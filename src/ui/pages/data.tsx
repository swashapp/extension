import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { withStyles } from '@mui/styles';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { defaultStyles, JsonView } from 'react-json-view-lite';

import { StreamCategory } from '../../enums/stream.enum';
import { helper } from '../../helper';
import { Any } from '../../types/any.type';
import { Message, MessageRecord } from '../../types/message.type';
import { AdsPreferences } from '../../types/storage/preferences.type';
import { isValidURL } from '../../utils/validator.util';
import { RemoveButton } from '../components/button/remove';
import { NumericInput } from '../components/input/numeric-input';
import { MultiTabView } from '../components/multi-tab-view/multi-tab-view';
import { PageHeader } from '../components/page-header/page-header';
import { TimeProgressBar } from '../components/progress/time-progress';
import { TextListManagement } from '../components/text-list-management/text-list-management';
import { useErrorHandler } from '../hooks/use-error-handler';

import 'react-json-view-lite/dist/index.css';
import '../../static/css/components/data-accordion.css';

const Icons: Record<StreamCategory, string> = {
  [StreamCategory.SEARCH]: '/static/images/icons/search-category.svg',
  [StreamCategory.GENERAL]: '/static/images/icons/general-category.svg',
  [StreamCategory.SHOPPING]: '/static/images/icons/shopping-category.svg',
  [StreamCategory.SOCIAL]: '/static/images/icons/social-category.svg',
  [StreamCategory.MUSIC]: '/static/images/icons/music-category.svg',
  [StreamCategory.NEWS]: '/static/images/icons/news-category.svg',
  [StreamCategory.BEAUTY]: '/static/images/icons/beauty-category.svg',
};

const StyledAccordion = withStyles({
  root: {
    width: '100%',
    border: 'none',
    boxShadow: 'none',
    background: 'transparent',
    borderRadius: '12px 12px 0 0',
    overflow: 'hidden',
  },
  expanded: {
    background: 'var(--data-accordion-color)',
    borderRadius: '12px',
  },
})(Accordion);

const StyledAccordionSummary = withStyles({
  root: {
    flexDirection: 'row-reverse',
    padding: '24px 26px 24px 20px',
    background: 'var(--data-accordion-color)',
    '&$expanded': {},
  },
  content: {
    padding: 0,
    margin: 0,
    '&$expanded': {
      padding: 0,
      margin: 0,
    },
  },
  expanded: {},
})(AccordionSummary);

const StyledAccordionDetails = withStyles(() => ({
  root: {
    margin: 0,
    padding: 24,
    overflow: 'auto',
  },
}))(AccordionDetails);

function DataAccordion({
  item,
  delay,
  active,
  setActive,
  removeMessage,
}: {
  item: MessageRecord;
  delay: number;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  removeMessage: (record: MessageRecord) => void;
}) {
  const [host, setHost] = useState<string>('Undetermined');
  const [message, setMessage] = useState<Message>(item.message);

  useEffect(() => {
    const { origin, ...restMessage } = item.message;

    try {
      if (origin) setHost(new URL(origin).host);
    } catch (err) {
      console.error((err as Any)?.message);
    }
    setMessage(restMessage);
  }, [item.message]);

  return (
    <div
      key={`item-${item.id}`}
      className={`${
        active === item.id ? 'data-accordion-active' : 'data-accordion-inactive'
      } data-accordion`}
    >
      <StyledAccordion
        square
        expanded={active === item.id}
        onChange={() =>
          setActive((current) => (current === item.id ? -1 : item.id))
        }
      >
        <StyledAccordionSummary
          expandIcon={
            <img
              className={'section-accordion-expand-icon'}
              src={'/static/images/shape/expand.svg'}
              alt={'Expand'}
            />
          }
        >
          <div className={'flex col data-accordion-summary'}>
            <div className={'flex align-center justify-between'}>
              <div className={'flex align-center'}>
                <div className={'data-accordion-icon'}>
                  <img
                    width={24}
                    height={24}
                    src={Icons[message.header.category]}
                    alt={''}
                  />
                </div>
                <div className={'flex col'}>
                  <p>{host}</p>
                  <p
                    className={'flex align-center smaller data-accordion-title'}
                  >
                    {message.header.module}
                  </p>
                </div>
              </div>
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  removeMessage(item);
                }}
              />
            </div>
            <div className={'data-accordion-progress'}>
              <TimeProgressBar
                start={item.timestamp}
                end={item.timestamp + delay}
              />
            </div>
          </div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <JsonView
            data={message}
            style={{
              ...defaultStyles,
              container: 'data-accordion-content',
            }}
            shouldExpandNode={(level) => level < 2}
            clickToExpandNode
          />
        </StyledAccordionDetails>
      </StyledAccordion>
    </div>
  );
}

export function Data(): ReactNode {
  const { safeRun } = useErrorHandler();

  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [lastMessageId, setLastMessageId] = useState<number>(0);
  const [active, setActive] = useState(-1);
  const [delay, setDelay] = useState<number>(2);
  const [masks, setMasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [adsFilters, setAdsFilters] = useState<string[]>([]);

  const urlTransformer = useCallback((url: string) => {
    try {
      return new URL(
        url.startsWith('http') ? url : `https://${url}`,
      ).toString();
    } catch (err) {
      return url;
    }
  }, []);

  const urlFormater = useCallback(
    (url: string) => {
      return urlTransformer(url.replace('*://', '').replace('/*', ''));
    },
    [urlTransformer],
  );

  const removeMessage = useCallback(
    (record: MessageRecord) => {
      safeRun(async () => {
        await helper('message').remove(record.id);
        setMessages((prevDatapoints) =>
          prevDatapoints.filter((dp) => dp.id !== record.id),
        );
      });
    },
    [safeRun],
  );

  const loadMessages = useCallback(async () => {
    await safeRun(async () => {
      const records = await helper('message').getGreaterThan(lastMessageId);

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
      const delay = (await helper('preferences').get('delay')) as number;
      setDelay(delay);
    });

    safeRun(async () => {
      const masks = (await helper('privacy').get('masks')) as string[];
      setMasks(masks);
    });
  }, [safeRun]);

  useEffect(() => {
    safeRun(async () => {
      const filters = await helper('privacy').getFilters();
      setFilters(filters.map((url) => urlFormater(url)));
    });

    safeRun(async () => {
      const filters = (
        (await helper('preferences').get('ads')) as AdsPreferences
      ).filters.urls;
      setAdsFilters(filters.map((url) => urlFormater(url)));
    });
  }, [safeRun, urlFormater]);

  const tabs = useMemo(
    () => [
      {
        label: <p className={'bold'}>Your data</p>,
        content: (
          <div className={'flex col gap24'}>
            <p>
              The data collected as you browse is shown here before being added
              to the Swash dataset. If you want time to check the data before it
              gets uploaded, you can adjust the sending delay and delete
              anything that you don’t want to share.
            </p>
            <div>
              <NumericInput
                label={'Delay my data by'}
                value={delay / 60000}
                setValue={(value) => {
                  safeRun(async () => {
                    const _value = (value as number) * 60000;
                    await helper('preferences').set('delay', _value);
                    setDelay(_value);
                  });
                }}
                unit={delay > 1 ? 'minutes' : 'minute'}
              />
            </div>
            {messages.length > 0 ? (
              <div className={'flex col gap20 data-accordion-container'}>
                {messages.map((item: MessageRecord) => (
                  <DataAccordion
                    key={`item-${item.id}`}
                    item={item}
                    delay={delay}
                    active={active}
                    setActive={setActive}
                    removeMessage={removeMessage}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        label: <p className={'bold'}>Text masking</p>,
        content: (
          <div className={'flex col gap24'}>
            <p>
              Swash doesn’t collect any sensitive data from you, like your name,
              email, or passwords. If you really want to be sure, you can hide
              certain sensitive words or numbers so they don’t get added to the
              Swash dataset.
            </p>
            <TextListManagement
              placeholder={'Mask It'}
              items={masks}
              onAdd={(value: string) => {
                safeRun(async () => {
                  await helper('privacy').addMask(value);
                  const _masks = new Set(masks);
                  _masks.add(value);
                  setMasks([..._masks]);
                });
              }}
              onRemove={(value: string) => {
                safeRun(async () => {
                  await helper('privacy').removeMask(value);
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
        label: <p className={'bold'}>Data domain exclusion</p>,
        content: (
          <div className={'flex col gap24'}>
            <p>
              If there are some websites where you don’t want Swash to work,
              simply add them here. Swash will then completely ignore them
              unless you remove them from this list. You can add or remove sites
              from your excluded domains list at any time.
            </p>
            <TextListManagement
              placeholder={'Domain To Exclude'}
              items={filters}
              onAdd={(value: string) => {
                safeRun(async () => {
                  await helper('privacy').addFilter(value);
                  const _filters = new Set(filters);
                  _filters.add(value);
                  setFilters([..._filters]);
                });
              }}
              onRemove={(value: string) => {
                safeRun(async () => {
                  await helper('privacy').removeFilter(value);
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
        label: <p className={'bold'}>Ad display restriction</p>,
        content: (
          <div className={'flex col gap24'}>
            <p>
              If you’ve ever closed a Swash Ad by clicking ‘Forever on this
              site’, those excluded sites will be listed here. To enable ads on
              those sites again, simply click ‘Undo’ to remove them from your
              excluded domains list.
            </p>
            <TextListManagement
              placeholder={'Domain To Exclude From Ads'}
              items={adsFilters}
              onAdd={(value: string) => {
                safeRun(async () => {
                  await helper('preferences').addAdsFilter(value);
                  const _adsFilters = new Set(adsFilters);
                  _adsFilters.add(value);
                  setAdsFilters([..._adsFilters]);
                });
              }}
              onRemove={(value: string) => {
                safeRun(async () => {
                  await helper('preferences').removeAdsFilter(value);
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
      active,
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
      <PageHeader header={'Data & Ads Controls'} />
      <div className={'round no-overflow bg-white card28'}>
        <MultiTabView tabs={tabs}></MultiTabView>
      </div>
    </>
  );
}
