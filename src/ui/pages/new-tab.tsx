import { StyledEngineProvider } from "@mui/material";
import clsx from "clsx";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";

import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { INTERNAL_PATHS } from "@/paths";
import { Any } from "@/types/any.type";
import { ImageRecord } from "@/types/image.type";
import {
  NewTabDateTime,
  NewTabSearchEngine,
  NewTabSite,
} from "@/types/new-tab.type";
import { NewTabPreferences } from "@/types/storage/preferences.type";
import { DisplayAds } from "@/ui/components/display-ads/display-ads";
import { AddSite } from "@/ui/components/new-tab/add-site";
import { Customization } from "@/ui/components/new-tab/customization";
import { closePopup, Popup, showPopup } from "@/ui/components/popup/popup";
import { ToastContainer } from "@/ui/components/toast/toast-container";
import { toastMessage } from "@/ui/components/toast/toast-message";
import { ThemeProvider } from "@/ui/context/theme.context";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import { openInTab } from "@/utils/browser.util";
import PlusIcon from "~/images/icons/plus.svg?react";

import styles from "./new-tab.module.css";

import "../styles/main.css";
import "../styles/common.css";
import "../styles/devices.css";

declare global {
  interface Window {
    helper: Any;
  }
}
window.helper = helper;

const MAX_RETRIES = 5;

function DateTimeDisplay({ datetime }: { datetime?: NewTabDateTime }) {
  const [now, setNow] = useState<Date>(new Date());
  const [timeFormat, setTimeFormat] = useState<Intl.DateTimeFormatOptions>({
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  useEffect(() => {
    const format: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    if (datetime) {
      format.hourCycle = datetime.h24 ? "h24" : "h12";
      if (datetime.seconds) format.second = "2-digit";
    }

    setTimeFormat(format);

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [datetime]);

  return (
    <div className={clsx("flex col justify-end align-end", styles.clock)}>
      <h2 className={styles.time}>{now.toLocaleTimeString([], timeFormat)}</h2>
      <h4 className={styles.date}>
        {now.toLocaleDateString([], {
          weekday: "long",
          day: "2-digit",
          month: "long",
        })}
      </h4>
    </div>
  );
}

function App(): ReactNode {
  const { safeRun } = useErrorHandler();
  const retryCountRef = useRef(0);

  const [ads] = useState<"full" | "partial" | "none">("none");

  const [background, setBackground] = useState<string>("");
  const [image, setImage] = useState<ImageRecord>();
  const [searchEngine, setSearchEngine] = useState<NewTabSearchEngine>();
  const [sites, setSites] = useState<Record<number, NewTabSite>>({});
  const [datetime, setDatetime] = useState<NewTabDateTime>();
  const [hide, setHide] = useState(false);

  const onBackgroundChange = useCallback(
    (background: string) => {
      safeRun(async () => {
        await helper("preferences").setNewTabBackground(background);
        setBackground(background);
        toastMessage("success", SystemMessage.SUCCESSFULLY_CHANGED_BACKGROUND);
      });
    },
    [safeRun],
  );

  const onSearchEngineChange = useCallback(
    (searchEngine: NewTabSearchEngine) => {
      safeRun(async () => {
        await helper("preferences").setNewTabSearchEngine(searchEngine);
        setSearchEngine(searchEngine);
        toastMessage(
          "success",
          SystemMessage.SUCCESSFULLY_CHANGED_SEARCH_ENGINE,
        );
      });
    },
    [safeRun],
  );

  const onDatetimeChange = useCallback(
    (datetime: NewTabDateTime) => {
      safeRun(async () => {
        await helper("preferences").setNewTabDatetime(datetime);
        setDatetime((prev) => ({ ...prev, ...datetime }));
        toastMessage("success", SystemMessage.SUCCESSFULLY_CHANGED_DATE_TIME);
      });
    },
    [safeRun],
  );

  const onSiteAdd = useCallback(
    (id: number, title: string, url: string) => {
      safeRun(async () => {
        const _url = new URL(url);
        const site = {
          title,
          url,
          logo: `https://www.google.com/s2/favicons?sz=64&domain_url=${_url.origin}`,
        } as NewTabSite;
        await helper("preferences").addNewTabSite(id, site);
        setSites((prev) => ({ ...prev, [id]: site }));
        toastMessage("success", SystemMessage.SUCCESSFULLY_ADDED_FAV_SITE);
        closePopup();
      });
    },
    [safeRun],
  );

  const onSiteRemove = useCallback(
    (id: number) => {
      safeRun(async () => {
        await helper("preferences").removeNewTabSite(id);
        setSites((prev) => {
          const sites = { ...prev };
          delete sites[id];
          return sites;
        });
        toastMessage("success", SystemMessage.SUCCESSFULLY_REMOVE_FAV_SITE);
      });
    },
    [safeRun],
  );

  const updateImage = useCallback(async () => {
    if (background !== "unsplash") {
      setImage(undefined);
      retryCountRef.current = 0;
      return;
    }

    const image = await helper("image").getImageForDisplay();
    if (!image) {
      if (retryCountRef.current++ === 0) setTimeout(updateImage, 100);
      else if (retryCountRef.current++ < MAX_RETRIES)
        setTimeout(updateImage, 250 * Math.pow(2, retryCountRef.current));
    } else {
      setImage(image);
      retryCountRef.current = 0;
    }
  }, [background]);

  const favSites = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => index).map((id) => {
      if (id in sites) {
        const site = sites[id];
        return (
          <div className={clsx("relative", styles.box)} key={`site-${id}`}>
            <a href={site.url}>
              <div className={clsx("flex center", styles.site)}>
                <img src={site.logo} alt={site.title} />
              </div>
            </a>
            <div className={clsx("absolute pointer", styles.remove)}>
              <PlusIcon
                onClick={() => {
                  onSiteRemove(id);
                }}
              />
            </div>
          </div>
        );
      } else {
        return (
          <div
            className={clsx("flex center", styles.site)}
            key={`site-${id}`}
            onClick={() => {
              showPopup({
                closable: false,
                closeOnBackDropClick: true,
                size: "small",
                content: <AddSite id={id} onAdd={onSiteAdd} />,
              });
            }}
          >
            <PlusIcon />
          </div>
        );
      }
    });
  }, [onSiteAdd, onSiteRemove, sites]);

  const customStyles = useMemo(() => {
    if (background === "unsplash") {
      return {
        backgroundImage: `url("${image?.blob}")`,
      };
    } else {
      return { background: `${background}` };
    }
  }, [background, image]);

  useEffect(() => {
    updateImage();
  }, [updateImage]);

  useEffect(() => {
    safeRun(async () => {
      const newtab = (await helper("preferences").get(
        "new_tab",
      )) as NewTabPreferences;

      setBackground(newtab.background);
      setDatetime(newtab.datetime);
      setSearchEngine(newtab.search_engine);
      setSites(newtab.sites);
    });
  }, [safeRun]);

  return (
    <div
      className={clsx("absolute no-overflow gap12", styles.container)}
      style={{ ...customStyles }}
    >
      {ads === "full" ? (
        <div className={clsx("absolute no-overflow", styles.fullAds)}>
          <DisplayAds
            width={3840}
            height={2160}
            divWidth={"100%"}
            divHeight={"100%"}
          />
        </div>
      ) : null}
      <div
        className={clsx(
          "flex justify-between align-start border-box",
          styles.row1,
        )}
      >
        <div className={clsx("flex align-center gap14", styles.action)}>
          <div className={"pointer"}>
            <img
              src={"/images/icons/swash.svg"}
              alt={""}
              onClick={async () => {
                await openInTab(INTERNAL_PATHS.profile);
              }}
            />
          </div>
          <div className={"pointer"}>
            <img
              src={"/images/icons/page.svg"}
              alt={""}
              onClick={async () => {
                if (!document.fullscreenElement) {
                  await document.documentElement.requestFullscreen();
                } else if (document.exitFullscreen) {
                  await document.exitFullscreen();
                }
              }}
            />
          </div>
          <div className={"pointer"}>
            <img
              src={"/images/icons/eye.svg"}
              alt={""}
              onClick={() => {
                setHide(!hide);
              }}
            />
          </div>
          <div className={"pointer"}>
            <img src={"/images/icon/line.svg"} alt={""} />
          </div>
          <div
            className={clsx("flex align-center gap12", styles.customize)}
            onClick={() => {
              showPopup({
                closable: false,
                closeOnBackDropClick: true,
                size: "custom",
                content: (
                  <Customization
                    datetime={datetime}
                    onBackgroundChange={onBackgroundChange}
                    onSearchEngineChange={onSearchEngineChange}
                    onDateTimeChange={onDatetimeChange}
                  />
                ),
              });
            }}
          >
            <img src={"/images/icons/window.svg"} alt={""} />
            <p>Customize</p>
          </div>
        </div>
        {image && ads !== "full" ? (
          <p className={styles.copyright}>
            Photo by{" "}
            <a
              href={`${image.copyright.profile}?utm_source=Swash&utm_medium=referral`}
              target={"_blank"}
              rel={"noreferrer"}
            >
              {image.copyright.user}
            </a>{" "}
            on{" "}
            <a
              href={`${image.copyright.link}?utm_source=Swash&utm_medium=referral`}
              target={"_blank"}
              rel={"noreferrer"}
            >
              Unsplash
            </a>
          </p>
        ) : null}
      </div>
      <div className={clsx("flex center border-box", styles.row2)}>
        <div className={clsx("flex col center gap40", styles.search)}>
          {hide ? null : (
            <>
              <form
                className={clsx("relative", styles.input)}
                role={"search"}
                action={searchEngine?.url}
              >
                <input
                  className={"text-center"}
                  type={"search"}
                  id={searchEngine?.params || "q"}
                  name={searchEngine?.params || "q"}
                  autoComplete={"off"}
                  placeholder={`Search on ${searchEngine?.title}...`}
                />
              </form>
              <div className={styles.sites}>{favSites}</div>
            </>
          )}
        </div>
      </div>
      <div className={clsx("flex justify-between", styles.row3)}>
        {ads === "partial" ? (
          <div className={clsx("flex justify-start align-end", styles.ads)}>
            <DisplayAds width={300} height={250} />
          </div>
        ) : ads === "full" ? (
          <div className={clsx("flex", styles.ignore)}>
            <div className={styles.col1} />
            <div className={clsx("flex", styles.col2)}>
              <div className={styles.row1} />
              <div className={clsx("flex center", styles.row2)}>
                <img src={"/images/icons/new-tab/link.svg"} alt={"link"} />
              </div>
              <div className={styles.row3} />
            </div>
            <div className={styles.col3} />
          </div>
        ) : (
          <div className={clsx("flex", styles.ignore)} />
        )}
        {hide ? null : <DateTimeDisplay datetime={datetime} />}
      </div>
    </div>
  );
}

const container = document.getElementById("newTab");
const root = createRoot(container!);
root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider>
      <App />
      <ToastContainer />
      <Popup />
    </ThemeProvider>
  </StyledEngineProvider>,
);
