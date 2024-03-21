import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { SystemMessage } from '../../enums/message.enum';
import { helper } from '../../helper';
import { InternalPaths } from '../../paths';
import { Any } from '../../types/any.type';
import { ImageRecord } from '../../types/image.type';
import {
  NewTabDateTime,
  NewTabSearchEngine,
  NewTabSite,
} from '../../types/new-tab.type';
import { NewTabPreferences } from '../../types/storage/preferences.type';
import { openInTab } from '../../utils/browser.util';
import { DisplayAds } from '../components/ads/display-ads';
import { AddSite } from '../components/new-tab/add-site';
import { Customization } from '../components/new-tab/customization';
import { closePopup, Popup, showPopup } from '../components/popup/popup';
import { toastMessage } from '../components/toast/toast-message';
import { useErrorHandler } from '../hooks/use-error-handler';

import '../../static/css/shared.css';
import '../../static/css/new-tab.css';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare global {
  interface Window {
    helper: Any;
  }
}
window.helper = helper;

function DateTimeDisplay({ datetime }: { datetime?: NewTabDateTime }) {
  const [now, setNow] = useState<Date>(new Date());
  const [timeFormat, setTimeFormat] = useState<Intl.DateTimeFormatOptions>({
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  useEffect(() => {
    const format: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    if (datetime) {
      format.hourCycle = datetime.h24 ? 'h24' : 'h12';
      if (datetime.seconds) format.second = '2-digit';
    }

    setTimeFormat(format);

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [datetime]);

  return (
    <div className={'flex col justify-end align-end item-clock'}>
      <h2 className={'time'}>{now.toLocaleTimeString([], timeFormat)}</h2>
      <h4 className={'date'}>
        {now.toLocaleDateString([], {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
        })}
      </h4>
    </div>
  );
}

function App(): ReactNode {
  const { safeRun } = useErrorHandler();

  const [ads] = useState<'full' | 'partial' | 'none'>('none');

  const [background, setBackground] = useState<string>('');
  const [image, setImage] = useState<ImageRecord>();
  const [searchEngine, setSearchEngine] = useState<NewTabSearchEngine>();
  const [sites, setSites] = useState<Record<number, NewTabSite>>({});
  const [datetime, setDatetime] = useState<NewTabDateTime>();
  const [hide, setHide] = useState(false);

  const onBackgroundChange = useCallback(
    (background: string) => {
      safeRun(async () => {
        await helper('preferences').setNewTabBackground(background);
        setBackground(background);
        toastMessage('success', SystemMessage.SUCCESSFULLY_CHANGED_BACKGROUND);
      });
    },
    [safeRun],
  );

  const onSearchEngineChange = useCallback(
    (searchEngine: NewTabSearchEngine) => {
      safeRun(async () => {
        await helper('preferences').setNewTabSearchEngine(searchEngine);
        setSearchEngine(searchEngine);
        toastMessage(
          'success',
          SystemMessage.SUCCESSFULLY_CHANGED_SEARCH_ENGINE,
        );
      });
    },
    [safeRun],
  );

  const onDatetimeChange = useCallback(
    (datetime: NewTabDateTime) => {
      safeRun(async () => {
        await helper('preferences').setNewTabDatetime(datetime);
        setDatetime((prev) => ({ ...prev, ...datetime }));
        toastMessage('success', SystemMessage.SUCCESSFULLY_CHANGED_DATE_TIME);
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
        await helper('preferences').addNewTabSite(id, site);
        setSites((prev) => ({ ...prev, [id]: site }));
        toastMessage('success', SystemMessage.SUCCESSFULLY_ADDED_FAV_SITE);
        closePopup();
      });
    },
    [safeRun],
  );

  const onSiteRemove = useCallback(
    (id: number) => {
      safeRun(async () => {
        await helper('preferences').removeNewTabSite(id);
        setSites((prev) => {
          const sites = { ...prev };
          delete sites[id];
          return sites;
        });
        toastMessage('success', SystemMessage.SUCCESSFULLY_REMOVE_FAV_SITE);
      });
    },
    [safeRun],
  );

  const updateImage = useCallback(async () => {
    if (background === 'unsplash') {
      const image = await helper('image').getImageForDisplay();
      if (!image) setTimeout(updateImage, 500);
      setImage(image);
    } else setImage(undefined);
  }, [background]);

  const favSites = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => index).map((id) => {
      if (id in sites) {
        const site = sites[id];
        return (
          <div className={'relative site-box'} key={`site-${id}`}>
            <a href={site.url}>
              <div className={'flex center fav-site'}>
                <img src={site.logo} alt={site.title} />
              </div>
            </a>
            <div className={'absolute pointer remove-site'}>
              <img
                src={'/static/images/shape/plus.png'}
                alt={'add'}
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
            className={'flex center fav-site'}
            key={`site-${id}`}
            onClick={() => {
              showPopup({
                closable: false,
                closeOnBackDropClick: true,
                paperClassName: 'popup small',
                content: <AddSite id={id} onAdd={onSiteAdd} />,
              });
            }}
          >
            <img src={'/static/images/shape/plus.png'} alt={'add'} />
          </div>
        );
      }
    });
  }, [onSiteAdd, onSiteRemove, sites]);

  const styles = useMemo(() => {
    if (background === 'unsplash') {
      // setCopyright(response.copyright);
      return {
        backgroundImage: `url("${image?.blob}")`,
      };
    } else {
      return { background: `${background}` };
    }
  }, [background, image]);

  useEffect(() => {
    injectStyle();
  }, []);

  useEffect(() => {
    updateImage();
  }, [updateImage]);

  useEffect(() => {
    safeRun(async () => {
      const newtab = (await helper('preferences').get(
        'new_tab',
      )) as NewTabPreferences;

      setBackground(newtab.background);
      setDatetime(newtab.datetime);
      setSearchEngine(newtab.search_engine);
      setSites(newtab.sites);
    });
  }, [safeRun]);

  return (
    <>
      <div
        className={'absolute no-overflow gap12 new-tab'}
        style={{ ...styles }}
      >
        {ads === 'full' ? (
          <div className={'absolute no-overflow full-screen-ads'}>
            <DisplayAds
              width={3840}
              height={2160}
              divWidth={'100%'}
              divHeight={'100%'}
            />
          </div>
        ) : null}
        <div className={'flex justify-between align-start border-box row-1'}>
          <div className={'flex align-center gap14 action'}>
            <div className={'pointer'}>
              <img
                src={'/static/images/icons/new-tab/swash.svg'}
                alt={''}
                onClick={async () => {
                  await openInTab(InternalPaths.dashboard);
                }}
              />
            </div>
            <div className={'pointer'}>
              <img
                src={'/static/images/icons/new-tab/page.svg'}
                alt={''}
                onClick={async () => {
                  if (!document.fullscreenElement) {
                    await document.documentElement.requestFullscreen();
                  } else if (document.exitFullscreen) {
                    await document.exitFullscreen();
                  }
                }}
              />
            </div>
            <div className={'pointer'}>
              <img
                src={'/static/images/icons/new-tab/eye.svg'}
                alt={''}
                onClick={() => {
                  setHide(!hide);
                }}
              />
            </div>
            <div className={'pointer'}>
              <img src={'/static/images/icons/new-tab/line.svg'} alt={''} />
            </div>
            <div
              className={'flex align-center gap12 item-actions-customize'}
              onClick={() => {
                showPopup({
                  closable: false,
                  closeOnBackDropClick: true,
                  paperClassName: 'popup custom',
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
              <img src={'/static/images/icons/new-tab/window.svg'} alt={''} />
              <p>Customize</p>
            </div>
          </div>
          {image && ads !== 'full' ? (
            <p className={'item-copyright'}>
              Photo by{' '}
              <a
                href={`${image.copyright.profile}?utm_source=Swash&utm_medium=referral`}
                target={'_blank'}
                rel={'noreferrer'}
              >
                {image.copyright.user}
              </a>{' '}
              on{' '}
              <a
                href={`${image.copyright.link}?utm_source=Swash&utm_medium=referral`}
                target={'_blank'}
                rel={'noreferrer'}
              >
                Unsplash
              </a>
            </p>
          ) : null}
        </div>
        <div className={'flex center border row-2'}>
          <div className={'flex col center gap40 item-search'}>
            {hide ? null : (
              <>
                <form
                  className={`relative search-form`}
                  role={'search'}
                  action={searchEngine?.url}
                >
                  <input
                    className={'text-center'}
                    type={'search'}
                    id={searchEngine?.params || 'q'}
                    name={searchEngine?.params || 'q'}
                    autoComplete={'off'}
                    placeholder={`Search on ${searchEngine?.title}...`}
                  />
                </form>
                <div className={'fav-sites'}>{favSites}</div>
              </>
            )}
          </div>
        </div>
        <div className={'flex justify-between row-3'}>
          {ads === 'partial' ? (
            <div className={'flex justify-start align-end item-ads'}>
              <DisplayAds width={300} height={250} />
            </div>
          ) : ads === 'full' ? (
            <div className={'flex click-ignore-wrapper'}>
              <div className={'click-ignore-col1'} />
              <div className={'flex click-ignore-col2'}>
                <div className={'row1'} />
                <div className={'flex center row2'}>
                  <img
                    src={'/static/images/icons/new-tab/link.svg'}
                    alt={'link'}
                  />
                </div>
                <div className={'row3'} />
              </div>
              <div className={'click-ignore-col3'} />
            </div>
          ) : (
            <div className={'flex click-ignore-wrapper'} />
          )}
          {hide ? null : <DateTimeDisplay datetime={datetime} />}
        </div>
      </div>
      <ToastContainer
        toastClassName={'bg-white toast-panel-container'}
        autoClose={5000}
        closeButton={true}
        hideProgressBar
        pauseOnHover
      />
      <Popup />
    </>
  );
}

const theme = createTheme();
const container = document.getElementById('newTab');
const root = createRoot(container!);
root.render(
  <Router>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </Router>,
);
