import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { SearchEngine } from '../../types/storage/new-tab.type';
import { ToastMessage } from '../toast/toast-message';

const colorList = [
  'rgb(21, 30, 154)',
  'rgb(33, 151, 249)',
  'rgb(31, 195, 220)',
  'rgb(8, 101, 130)',
  'rgb(103, 212, 180)',
  'rgb(7, 125, 90)',
  'rgb(60, 121, 11)',
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
];

export function Customisation(props: {
  onBackgroundChange: () => void;
  onSearchEngineChange: () => void;
}): JSX.Element {
  const [page, setPage] = useState('Background');

  const setBackground = useCallback(
    (background) => {
      helper.setBackground(background).then(() => {
        props.onBackgroundChange();
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
        props.onSearchEngineChange();
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
              backgroundSize: 'contain',
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
  }, []);

  const loadSettings = useCallback(() => {
    switch (page) {
      case 'Background':
        return backgrounds;
      case 'Search Engine':
        return searchEngines;
      default:
        return <></>;
    }
  }, [backgrounds, page, searchEngines]);

  return (
    <>
      <div className="popup-title title">Customisation</div>
      <div className="popup-separator" />
      <div className="popup-content-sidenav">
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
        </div>
        <div className={'customisation-content'}>{loadSettings()}</div>
      </div>
    </>
  );
}
