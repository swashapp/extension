import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import browser from 'webextension-polyfill';

import { DisplayAds } from '../components/ads/display-ads';
import { AddSite } from '../components/new-tab/add-site';
import { Customisation } from '../components/new-tab/customisation';
import { Popup, showPopup } from '../components/popup/popup';
import { helper } from '../core/webHelper';
import { NewTab as NTXConfig } from '../types/storage/new-tab.type';

import {
  SearchEngine,
  Site,
  UnsplashCopyright,
  UnsplashResponse,
} from '../types/storage/new-tab.type';

const addUnsplashParams = (src: string): string => {
  const url = new URL(src);
  url.searchParams.set('q', '70');
  url.searchParams.set('w', window.innerWidth.toString());
  return String(url);
};

export default function NewTab(): JSX.Element {
  const [ads, setAds] = useState<'full' | 'partial' | 'none'>('none');
  const [bg, setBg] = useState('');
  const [style, setStyle] = useState({});
  const [search, setSearch] = useState<SearchEngine>();
  const [sites, setSites] = useState<Site[]>([]);
  const [time, setTime] = useState(new Date());
  const [timeFormat, setTimeFormat] = useState<Intl.DateTimeFormatOptions>();
  const [hide, setHide] = useState(false);
  const [copyright, setCopyright] = useState<UnsplashCopyright>({
    imageLink: '',
    location: '',
    userName: '',
    userLink: '',
  });

  const getConfigs = useCallback((cache = true) => {
    helper.getNewTabConfig().then(async (config: NTXConfig) => {
      const { background, searchEngine, sites, datetime } = config;
      setSearch(searchEngine);
      setSites(sites);

      const status = await helper.getIsFullScreenAvailable();
      if (status) setAds('full');
      else setAds('partial');

      if (!cache && !status) {
        setBg(background);
        if (background === 'unsplash') {
          helper
            .getUnsplashImage(window.innerWidth.toString())
            .then(async (response: UnsplashResponse) => {
              setCopyright(response.copyright);
              setStyle({
                backgroundImage: `url("${addUnsplashParams(response.src)}")`,
              });
            });
        } else {
          setStyle({ background: `${background}` });
        }
      }

      const format: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
      };

      format['hourCycle'] = datetime.h24 ? 'h24' : 'h12';
      if (datetime.seconds) format['second'] = '2-digit';
      setTimeFormat(format);
    });
  }, []);

  const openSwashDashboard = useCallback(() => {
    browser.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs: browser.Tabs.Tab[]) => {
        browser.tabs
          .update(tabs[0].id, {
            url: browser.runtime.getURL('/dashboard/index.html'),
          })
          .then();
      });
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then();
    } else if (document.exitFullscreen) {
      document.exitFullscreen().then();
    }
  }, []);

  const toggleVisibility = useCallback(() => {
    setHide(!hide);
  }, [hide]);

  const openCustomisation = useCallback(() => {
    showPopup({
      closable: false,
      closeOnBackDropClick: true,
      paperClassName: 'large-popup',
      content: <Customisation onChange={getConfigs} />,
    });
  }, [getConfigs]);

  const addSite = useCallback(
    (rank) => {
      showPopup({
        closable: false,
        closeOnBackDropClick: true,
        paperClassName: 'small-popup',
        content: <AddSite rank={rank} onSave={getConfigs} />,
      });
    },
    [getConfigs],
  );

  const removeSite = useCallback(
    (rank) => {
      helper.addSite(rank, '', '', '').then(() => {
        getConfigs();
      });
    },
    [getConfigs],
  );

  const getSites = useMemo(() => {
    return sites.map((value: Site, index) => {
      if (value.title) {
        const _url = new URL(value.url);
        let icon = value.icon;

        if (!icon.startsWith('https://www.google.com'))
          icon = `https://www.google.com/s2/favicons?sz=64&domain_url=${_url.origin}`;
        return (
          <div className={'site-box'} key={`site-${index}`}>
            <a href={value.url}>
              <div className={'fav-site'}>
                <img src={icon} alt={value.title} />
              </div>
            </a>
            <div className={'remove-site'}>
              <img
                src={'/static/images/shape/plus.png'}
                alt={'add'}
                onClick={() => {
                  removeSite(index);
                }}
              />
            </div>
          </div>
        );
      } else {
        return (
          <div className={'fav-site'} key={`site-${index}`}>
            <img
              src={'/static/images/shape/plus.png'}
              alt={'add'}
              onClick={() => {
                addSite(index);
              }}
            />
          </div>
        );
      }
    });
  }, [addSite, removeSite, sites]);

  useEffect(() => {
    injectStyle();
  }, []);

  useEffect(() => {
    getConfigs(false);

    const interval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, [getConfigs]);

  return (
    <>
      <div className={'container'} style={{ ...style }}>
        {ads === 'full' ? (
          <div className={'full-ads'}>
            <DisplayAds
              width={3840}
              height={2160}
              divWidth={'100%'}
              divHeight={'100%'}
            />
          </div>
        ) : (
          <></>
        )}
        <div className={'row-1'}>
          <div className={'item-actions'}>
            <div>
              <img
                src={'/static/images/icons/new-tab/swash.svg'}
                alt={''}
                onClick={openSwashDashboard}
              />
            </div>
            <div>
              <img
                src={'/static/images/icons/new-tab/page.svg'}
                alt={''}
                onClick={toggleFullScreen}
              />
            </div>
            <div>
              <img
                src={'/static/images/icons/new-tab/eye.svg'}
                alt={''}
                onClick={toggleVisibility}
              />
            </div>
            <div>
              <img src={'/static/images/icons/new-tab/line.svg'} alt={''} />
            </div>
            <div
              className={'item-actions-customise'}
              onClick={openCustomisation}
            >
              <div>
                <img src={'/static/images/icons/new-tab/window.svg'} alt={''} />
              </div>
              <div>Customise</div>
            </div>
          </div>
          <div className={'item-copyright'}>
            {bg === 'unsplash' && ads !== 'full' ? (
              <>
                Photo by{' '}
                <a
                  href={`${copyright.userLink}?utm_source=Swash&utm_medium=referral`}
                  target={'_blank'}
                  rel={'noreferrer'}
                >
                  {copyright.userName}
                </a>{' '}
                on{' '}
                <a
                  href={
                    'https://unsplash.com/?utm_source=Swash&utm_medium=referral'
                  }
                  target={'_blank'}
                  rel={'noreferrer'}
                >
                  Unsplash
                </a>
              </>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className={'row-2'}>
          <div className={'item-search'}>
            {hide ? (
              <></>
            ) : (
              <>
                <form
                  className={`search-form`}
                  role={'search'}
                  action={search?.url}
                >
                  <input
                    type={'search'}
                    id={search?.params || 'q'}
                    name={search?.params || 'q'}
                    autoComplete={'off'}
                    placeholder={`Search on ${search?.name}...`}
                  />
                </form>
                <div className={'fav-sites'}>{getSites}</div>
              </>
            )}
          </div>
        </div>
        <div className={'row-3'}>
          {ads === 'partial' ? (
            <div className={'item-ads'}>
              <DisplayAds width={300} height={250} />
            </div>
          ) : ads === 'full' ? (
            <div className={'click-ignore-wrapper'}>
              <div className={'click-ignore-col1'} />
              <div className={'click-ignore-col2'}>
                <div className={'row1'} />
                <div className={'row2'}>
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
            <div className={'click-ignore-wrapper'} />
          )}
          <div className={'item-clock'}>
            {hide ? (
              <></>
            ) : (
              <>
                <div className={'time'}>
                  {time.toLocaleTimeString([], timeFormat)}
                </div>
                <div className={'date'}>
                  {time.toLocaleDateString([], {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        toastClassName={'toast-panel-container'}
        autoClose={3000}
        closeButton={false}
        hideProgressBar
        pauseOnHover
      />
      <Popup />
    </>
  );
}
