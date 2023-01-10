import React, { useCallback, useEffect, useState } from 'react';

import browser from 'webextension-polyfill';

import { AddSite } from '../components/new-tab/add-site';
import { Customisation } from '../components/new-tab/customisation';
import { Popup, showPopup } from '../components/popup/popup';
import { helper } from '../core/webHelper';
import { Site } from '../types/storage/new-tab.type';

async function getImages() {
  const url = new URL('https://api.unsplash.com/photos/random');
  url.searchParams.set('count', '10');
  url.searchParams.set(
    'w',
    String(calculateWidth(window.innerWidth, window.devicePixelRatio)),
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID oreT5F-CEO3BsJuOu8OUD9w1a-9Q5My0yXWa4MJqbsE`,
    },
  });
  const body = await res.json();

  return body.map((item: any) => ({
    src: item.urls.raw,
    credit: {
      imageLink: item.links.html,
      location: item.location ? item.location.title : null,
      userName: item.user.name,
      userLink: item.user.links.html,
    },
  }));
}

const buildLink = (src: string): string => {
  const url = new URL(src);
  url.searchParams.set('q', '85');
  url.searchParams.set(
    'w',
    String(calculateWidth(window.innerWidth, window.devicePixelRatio)),
  );
  return String(url);
};

function calculateWidth(screenWidth = 1920, pixelRatio = 1): number {
  screenWidth = screenWidth * pixelRatio;
  screenWidth = Math.max(screenWidth, 1920);
  screenWidth = Math.min(screenWidth, 3840);
  screenWidth = Math.ceil(screenWidth / 240) * 240;
  return screenWidth;
}

export default function NewTab(): JSX.Element {
  const [wallet, setWallet] = useState('');
  const [uuid, setUuid] = useState('');
  const [bg, setBg] = useState('');
  const [style, setStyle] = useState({});
  const [sites, setSites] = useState([]);
  const [time, setTime] = useState(new Date());
  const [hide, setHide] = useState(false);
  const [credit, setCredit] = useState({
    imageLink: '',
    location: '',
    userName: '',
    userLink: '',
  });

  const updateSites = useCallback(() => {
    helper.getSites().then(setSites);
  }, []);

  const updateBackground = useCallback(async () => {
    helper.getBackground().then((_bg) => {
      setBg(_bg);
      if (bg === 'unsplash') {
        getImages().then(async (response) => {
          setCredit(response[0].credit);
          setStyle({ backgroundImage: `url("${buildLink(response[0].src)}")` });
        });
      } else {
        setStyle({ background: `${_bg}` });
      }
    });
  }, [bg]);

  useEffect(() => {
    updateBackground().then();

    helper.getAdsSlots('512', '512').then((resp) => {
      setWallet(resp.id);
      setUuid(resp.uuid);
    });
    updateSites();
    const interval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, [updateBackground, updateSites]);

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
    console.log(hide);
    setHide(!hide);
  }, [hide]);

  const openCustomisation = useCallback(() => {
    showPopup({
      closable: false,
      closeOnBackDropClick: true,
      paperClassName: 'large-popup',
      content: <Customisation onBackgroundChange={updateBackground} />,
    });
  }, [updateBackground]);

  const addSite = useCallback(
    (rank) => {
      showPopup({
        closable: false,
        closeOnBackDropClick: true,
        paperClassName: 'small-popup',
        content: <AddSite rank={rank} onSave={updateSites} />,
      });
    },
    [updateSites],
  );

  const removeSite = useCallback(
    (rank) => {
      helper.addSite(rank, '', '', '').then(() => {
        updateSites();
      });
    },
    [updateSites],
  );

  function getSites() {
    return sites.map((value: Site, index) => {
      if (value.title) {
        return (
          <div className={'site-box'} key={`site-${index}`}>
            <a href={value.url}>
              <div className={'fav-site'}>
                <img src={value.icon} alt={value.title} />
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
  }

  return (
    <>
      <div className={'container'} style={{ ...style }}>
        <Popup />
        <div className={'item'}>
          <div className={'item-actions'}>
            {/*<div>*/}
            {/*  <img src={'/static/images/icons/new-tab/settings.png'} alt={''} />*/}
            {/*</div>*/}
            <div>
              <img
                src={'/static/images/icons/new-tab/swash.png'}
                alt={''}
                onClick={openSwashDashboard}
              />
            </div>
            {/*<div>*/}
            {/*  <img*/}
            {/*    src={'/static/images/icons/new-tab/link-folder.png'}*/}
            {/*    alt={''}*/}
            {/*  />*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <img*/}
            {/*    src={'/static/images/icons/new-tab/download-box.png'}*/}
            {/*    alt={''}*/}
            {/*  />*/}
            {/*</div>*/}
            <div>
              <img
                src={'/static/images/icons/new-tab/page.png'}
                alt={''}
                onClick={toggleFullScreen}
              />
            </div>
            <div>
              <img
                src={'/static/images/icons/new-tab/eye.png'}
                alt={''}
                onClick={toggleVisibility}
              />
            </div>
            <div>
              <img src={'/static/images/icons/new-tab/line.png'} alt={''} />
            </div>
            <div
              className={'item-actions-customise'}
              onClick={openCustomisation}
            >
              <div>
                <img src={'/static/images/icons/new-tab/window.png'} alt={''} />
              </div>
              <div>Customise</div>
            </div>
          </div>
        </div>
        <div className={'item'}></div>
        <div className={'item-copyright'}>
          {bg === 'unsplash' ? `Photo by ${credit.userName} on Unsplash` : ''}
        </div>
        <div className={'item-ads'}>
          <div
            className="c25b4ef591762a17"
            data-zone={uuid}
            data-pay-to={wallet}
            data-page="extension"
            style={{
              width: 512,
              height: 512,
              display: 'inline-block',
              margin: '0 auto',
            }}
          />
        </div>
        <div className={'item-search'}>
          {hide ? (
            <></>
          ) : (
            <>
              <form
                className={'search-form'}
                role="search"
                action="https://www.google.com/search"
              >
                <input
                  className={'search-input'}
                  type="search"
                  id="query"
                  name="q"
                  placeholder="Search..."
                  aria-label="Search through site content"
                />
                <button className={'search-button'}>
                  <svg className={'search-svg'} viewBox="0 0 1024 1024">
                    <path
                      className="path1"
                      d="M848.471 928l-263.059-263.059c-48.941 36.706-110.118 55.059-177.412 55.059-171.294 0-312-140.706-312-312s140.706-312 312-312c171.294 0 312 140.706 312 312 0 67.294-24.471 128.471-55.059 177.412l263.059 263.059-79.529 79.529zM189.623 408.078c0 121.364 97.091 218.455 218.455 218.455s218.455-97.091 218.455-218.455c0-121.364-103.159-218.455-218.455-218.455-121.364 0-218.455 97.091-218.455 218.455z"
                    ></path>
                  </svg>
                </button>
              </form>
              <div className={'fav-sites'}>{getSites()}</div>
            </>
          )}
        </div>
        <div className={'item'}></div>
        <div className={'item'}></div>
        <div className={'item-clock'}>
          {hide ? (
            <></>
          ) : (
            <>
              <div className={'time'}>
                {time.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hourCycle: 'h24',
                })}
              </div>
              <div className={'date'}>
                {time.toLocaleDateString([], {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
