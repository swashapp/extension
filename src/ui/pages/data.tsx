import clsx from "clsx";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { helper } from "@/helper";
import { MessageRecord } from "@/types/message.type";
import { AdsPreferences } from "@/types/storage/preferences.type";
import { DataAccordion } from "@/ui/components/data-accordion/data-accordion";
import { NumericInput } from "@/ui/components/input/numeric-input";
import { MultiTabView } from "@/ui/components/multi-tab-view/multi-tab-view";
import { PageHeader } from "@/ui/components/page-header/page-header";
import { TextListManagement } from "@/ui/components/text-list-management/text-list-management";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import { isValidURL } from "@/utils/validator.util";

import styles from "./data.module.css";

export function Data(): ReactNode {
  const { safeRun } = useErrorHandler();

  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [lastMessageId, setLastMessageId] = useState<number>(0);
  const [delay, setDelay] = useState<number>(2);
  const [masks, setMasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [adsFilters, setAdsFilters] = useState<string[]>([]);

  const urlTransformer = useCallback((url: string) => {
    try {
      return new URL(
        url.startsWith("http") ? url : `https://${url}`,
      ).toString();
    } catch (error) {
      return url;
    }
  }, []);

  const urlFormater = useCallback(
    (url: string) => {
      return urlTransformer(url.replace("*://", "").replace("/*", ""));
    },
    [urlTransformer],
  );

  const removeMessage = useCallback(
    (record: MessageRecord) => {
      safeRun(async () => {
        await helper("message").remove(record.id);
        setMessages((prevMessages) =>
          prevMessages.filter((dp) => dp.id !== record.id),
        );
      });
    },
    [safeRun],
  );

  const loadMessages = useCallback(async () => {
    await safeRun(async () => {
      const records = await helper("message").getGreaterThan(lastMessageId);

      const newMessages = records.filter(
        ({ id }) => !messages.some((dp) => dp.id === id),
      );

      if (newMessages.length > 0) {
        setLastMessageId(newMessages.at(-1)?.id || 0);
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      }
    });
  }, [lastMessageId, messages, safeRun]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    safeRun(async () => {
      const delay = (await helper("preferences").get("delay")) as number;
      setDelay(delay);
    });

    safeRun(async () => {
      const masks = (await helper("privacy").get("masks")) as string[];
      setMasks(masks);
    });
  }, [safeRun]);

  useEffect(() => {
    safeRun(async () => {
      const filters = await helper("privacy").getFilters();
      setFilters(filters.map((url) => urlFormater(url)));
    });

    safeRun(async () => {
      const filters = (
        (await helper("preferences").get("ads")) as AdsPreferences
      ).filters.urls;
      setAdsFilters(filters.map((url) => urlFormater(url)));
    });
  }, [safeRun, urlFormater]);

  const tabs = useMemo(
    () => [
      {
        label: <p className={"bold"}>Your data</p>,
        content: (
          <div className={"flex col gap24"}>
            <p>
              The data collected as you browse is shown here before being added
              to the Swash dataset. If you want time to check the data before it
              gets uploaded, you can adjust the sending delay and delete
              anything that you don’t want to share.
            </p>
            <div>
              <NumericInput
                label={"Delay my data by"}
                value={delay / 60000}
                setValue={(value) => {
                  safeRun(async () => {
                    const _value = (value as number) * 60000;
                    await helper("preferences").set("delay", _value);
                    setDelay(_value);
                  });
                }}
                unit={delay > 1 ? "minutes" : "minute"}
              />
            </div>
            {messages.length > 0 ? (
              <div className={clsx("flex col gap20", styles.accordion)}>
                {messages.map((item: MessageRecord) => (
                  <DataAccordion
                    key={`item-${item.id}`}
                    item={item}
                    delay={delay}
                    removeMessage={removeMessage}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        label: <p className={"bold"}>Text masking</p>,
        content: (
          <div className={"flex col gap24"}>
            <p>
              Swash doesn’t collect any sensitive data from you, like your name,
              email, or passwords. If you really want to be sure, you can hide
              certain sensitive words or numbers so they don’t get added to the
              Swash dataset.
            </p>
            <TextListManagement
              placeholder={"Mask It"}
              items={masks}
              onAdd={(value: string) => {
                safeRun(async () => {
                  await helper("privacy").addMask(value);
                  const _masks = new Set(masks);
                  _masks.add(value);
                  setMasks([..._masks]);
                });
              }}
              onRemove={(value: string) => {
                safeRun(async () => {
                  await helper("privacy").removeMask(value);
                  const _masks = new Set(masks);
                  _masks.delete(value);
                  setMasks([..._masks]);
                });
              }}
            />
          </div>
        ),
      },
      {
        label: <p className={"bold"}>Data domain exclusion</p>,
        content: (
          <div className={"flex col gap24"}>
            <p>
              If there are some websites where you don’t want Swash to work,
              simply add them here. Swash will then completely ignore them
              unless you remove them from this list. You can add or remove sites
              from your excluded domains list at any time.
            </p>
            <TextListManagement
              placeholder={"Domain To Exclude"}
              items={filters}
              onAdd={(value: string) => {
                safeRun(async () => {
                  await helper("privacy").addFilter(value);
                  const _filters = new Set(filters);
                  _filters.add(value);
                  setFilters([..._filters]);
                });
              }}
              onRemove={(value: string) => {
                safeRun(async () => {
                  await helper("privacy").removeFilter(value);
                  const _filters = new Set(filters);
                  _filters.delete(value);
                  setFilters([..._filters]);
                });
              }}
              transformer={urlTransformer}
              validator={isValidURL}
            />
          </div>
        ),
      },
      {
        label: <p className={"bold"}>Ad display restriction</p>,
        content: (
          <div className={"flex col gap24"}>
            <p>
              If you’ve ever closed a Swash Ad by clicking ‘Forever on this
              site’, those excluded sites will be listed here. To enable ads on
              those sites again, simply click ‘Undo’ to remove them from your
              excluded domains list.
            </p>
            <TextListManagement
              placeholder={"Domain To Exclude From Ads"}
              items={adsFilters}
              onAdd={(value: string) => {
                safeRun(async () => {
                  await helper("preferences").addAdsFilter(value);
                  const _adsFilters = new Set(adsFilters);
                  _adsFilters.add(value);
                  setAdsFilters([..._adsFilters]);
                });
              }}
              onRemove={(value: string) => {
                safeRun(async () => {
                  await helper("preferences").removeAdsFilter(value);
                  const _adsFilters = new Set(adsFilters);
                  _adsFilters.delete(value);
                  setAdsFilters([..._adsFilters]);
                });
              }}
              transformer={urlTransformer}
              validator={isValidURL}
            />
          </div>
        ),
      },
    ],
    [
      adsFilters,
      delay,
      filters,
      masks,
      messages,
      removeMessage,
      safeRun,
      urlTransformer,
    ],
  );

  return (
    <>
      <PageHeader header={"Data & Ads Controls"} />
      <div className={"round no-overflow bg-white card28"}>
        <MultiTabView tabs={tabs}></MultiTabView>
      </div>
    </>
  );
}
