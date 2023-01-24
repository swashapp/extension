import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { DateTime, SearchEngine } from '../../types/storage/new-tab.type';
import { Switch } from '../switch/switch';
import { ToastMessage } from '../toast/toast-message';

const colorList = [
  'rgb(21, 30, 154)',
  'rgb(33, 151, 249)',
  'rgb(31, 195, 220)',
  'rgb(8, 101, 130)',
  'rgb(103, 212, 180)',
  'rgb(7, 125, 90)',
  'rgb(60, 121, 11)',
  'rgb(120,157,18)',
  'rgb(175, 206, 87)',
  'rgb(240, 203, 68)',
  'rgb(242, 138, 41)',
  'rgb(252, 121, 143)',
  'rgb(193, 34, 110)',
  'rgb(250, 181, 238)',
  'rgb(192, 196, 255)',
  'rgb(150, 119, 238)',
  'rgb(84, 51, 176)',
  'rgb(74, 0, 12)',
  'rgb(91, 92, 99)',
  'rgb(36, 36, 36)',
  'rgb(0, 0, 0)',
  'linear-gradient(180deg, #F92170 6.77%, #4BC5FB 100%)',
  'linear-gradient(180deg, #F8F8C8 0%, #F3C2EA 45.49%, #F67D6E 100%)',
  'linear-gradient(180deg, #E2DFC8 0%, #9CEBE3 24.48%, #6AF3F6 55.81%, #E8A6DD 100%)',
  'linear-gradient(180deg, #EF719A 0%, #FA9272 100%)',
  'linear-gradient(180deg, #B291BA 0%, #E6B496 100%)',
  'linear-gradient(180deg, #0B2D25 0%, #23774B 100%)',
  'linear-gradient(180deg, #FBD17C 0%, #F7F779 100%)',
  'linear-gradient(180deg, #F9E5BB 0%, #E97EBB 47.3%, #4C4CD7 100%)',
  'linear-gradient(180deg, #6C6FFF 0%, #F5AAFF 100%)',
  'linear-gradient(180deg, #56EC90 0%, #2EA4CF 42.66%, #022638 100%)',
  'linear-gradient(180deg, #012333 0%, #2B9FD2 51.94%, #032A3D 100%)',
  'linear-gradient(180deg, #D4EEF4 0%, #F0EECA 44.2%, #F3A871 100%)',
  'linear-gradient(180deg, #2BBE5E 0%, #FAF26B 53.49%, #5FF295 100%)',
  'linear-gradient(180deg, #022334 0%, #72C3F7 51.94%, #E2EEF7 100%)',
];

const searchEnginesList: SearchEngine[] = [
  {
    name: 'Google',
    url: 'https://www.google.com/search',
    params: 'q',
    logo: '/static/images/logos/google.png',
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search',
    params: 'q',
    logo: '/static/images/logos/bing.png',
  },
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/',
    params: 'q',
    logo: '/static/images/logos/duckduckgo.png',
  },
  {
    name: 'Ecosia',
    url: 'https://www.ecosia.org/search',
    params: 'q',
    logo: '/static/images/logos/ecosia.png',
  },
];

export function Customisation(props: {
  onChange: (cache?: boolean) => void;
}): JSX.Element {
  const [page, setPage] = useState('Background');
  const [time, setTime] = useState<DateTime>({ h24: false, seconds: false });

  const setBackground = useCallback(
    (background) => {
      helper.setBackground(background).then(() => {
        props.onChange(false);
        toast(
          <ToastMessage
            type="success"
            content={<>Background changed successfully</>}
          />,
        );
      });
    },
    [props],
  );

  const setSearchEngine = useCallback(
    (searchEngine: SearchEngine) => {
      helper.setSearchEngine(searchEngine).then(() => {
        props.onChange();
        toast(
          <ToastMessage
            type="success"
            content={<>Search engine changed successfully</>}
          />,
        );
      });
    },
    [props],
  );

  const getDatetime = useCallback(() => {
    helper.getDatetime().then(setTime);
  }, []);

  const setDatetime = useCallback(
    (key, value) => {
      helper.setDatetime({ ...time, [key]: value }).then(() => {
        getDatetime();
        props.onChange();
        toast(
          <ToastMessage
            type="success"
            content={<>Date & Time changed successfully</>}
          />,
        );
      });
    },
    [getDatetime, props, time],
  );

  useEffect(() => {
    getDatetime();
  }, [getDatetime]);

  const backgrounds = useMemo(() => {
    return (
      <div className={'cs-options'}>
        <div
          className={'cs-option'}
          style={{
            backgroundImage: 'url(/static/images/logos/unsplash.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          }}
          onClick={() => {
            setBackground('unsplash');
          }}
        ></div>
        {colorList.map((color, index) => (
          <div
            key={`color-${index}`}
            className={'cs-option'}
            style={{ background: color }}
            onClick={() => {
              setBackground(color);
            }}
          />
        ))}
      </div>
    );
  }, [setBackground]);

  const searchEngines = useMemo(() => {
    return (
      <div className={'cs-options'}>
        {searchEnginesList.map((search, index) => (
          <div
            key={`search-${index}`}
            className={'cs-option-2'}
            style={{
              backgroundImage: `url(${search.logo})`,
              backgroundSize: 'auto',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
            }}
            onClick={() => {
              setSearchEngine(search);
            }}
          />
        ))}
      </div>
    );
  }, [setSearchEngine]);

  const datetime = useMemo(() => {
    return (
      <div className={'cs-options-2'}>
        <div className={'cs-option-3'}>
          <Switch
            checked={time.h24}
            onChange={(e) => {
              setDatetime('h24', e.target.checked);
            }}
          />
          Show the 24 hour clock
        </div>
        <div className={'cs-option-3'}>
          <Switch
            checked={time.seconds}
            onChange={(e) => {
              setDatetime('seconds', e.target.checked);
            }}
          />
          Show Seconds
        </div>
      </div>
    );
  }, [setDatetime, time]);

  const loadSettings = useCallback(() => {
    switch (page) {
      case 'Background':
        return backgrounds;
      case 'Search Engine':
        return searchEngines;
      case 'Date & Time':
        return datetime;
      default:
        return <></>;
    }
  }, [backgrounds, datetime, page, searchEngines]);

  return (
    <>
      <div className="popup-title title">Customisation</div>
      <div className="popup-separator" />
      <div className="popup-content-sidenav">
        <div className={'customisation-container'}>
          <div className={'customisation-nav'}>
            <div
              className={'settings-option'}
              onClick={() => setPage('Background')}
            >
              Background
            </div>
            <div
              className={'settings-option'}
              onClick={() => setPage('Search Engine')}
            >
              Search Engine
            </div>
            <div
              className={'settings-option'}
              onClick={() => setPage('Date & Time')}
            >
              Date & Time
            </div>
          </div>
        </div>
        <div className={'customisation-content'}>{loadSettings()}</div>
      </div>
    </>
  );
}
