import React, { useEffect, useState } from 'react';

import { helper } from '../core/webHelper';

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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    getImages().then(async (response) => {
      setBg(buildLink(response[0].src));
    });

    helper.getAdsSlots('512', '512').then((resp) => {
      setWallet(resp.id);
      setUuid(resp.uuid);
    });

    const interval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div
        className={'container'}
        style={{
          backgroundImage: `url("${bg}")`,
        }}
      >
        <div className={'item'}></div>
        <div className={'item'}></div>
        <div className={'item'}></div>
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
          <form className={'search-form'} role="search">
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
          <div className={'fav-sites'}>
            <div className={'fav-site'}>
              <img src={'/static/images/shape/plus.png'} alt={'add'} />
            </div>
            <div className={'fav-site'}>
              <img src={'/static/images/shape/plus.png'} alt={'add'} />
            </div>
            <div className={'fav-site'}>
              <img src={'/static/images/shape/plus.png'} alt={'add'} />
            </div>
            <div className={'fav-site'}>
              <img src={'/static/images/shape/plus.png'} alt={'add'} />
            </div>
            <div className={'fav-site'}>
              <img src={'/static/images/shape/plus.png'} alt={'add'} />
            </div>
          </div>
        </div>
        <div className={'item'}></div>
        <div className={'item'}></div>
        <div className={'item-clock'}>
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
        </div>
      </div>
    </>
  );
}
