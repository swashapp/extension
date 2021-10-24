import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { SidenavItem, SidenavItems } from '../../data/sidenav-items';
import { RouteToPages } from '../../paths';
import { DATA_TOUR_CLASS } from '../data/data-tour';
import { HELP_TOUR_CLASS } from '../help/help-tour';
import { WALLET_TOUR_CLASS } from '../wallet/wallet-tour';

export function SidenavLinks(props: { activeIndex?: number }): JSX.Element {
  const [active, setActive] = useState<number>(props.activeIndex || 0);
  const getTourClass = useCallback((index: number) => {
    let ret = '';
    if (
      index ===
      SidenavItems.findIndex((item) => item.route === RouteToPages.wallet)
    )
      ret = WALLET_TOUR_CLASS.WALLET;
    else if (
      index ===
      SidenavItems.findIndex((item) => item.route === RouteToPages.data)
    )
      ret = DATA_TOUR_CLASS.SWASH_DATA;
    else if (
      index ===
      SidenavItems.findIndex((item) => item.route === RouteToPages.help)
    )
      ret = HELP_TOUR_CLASS.SWASH_HELP;
    return ret;
  }, []);
  return (
    <>
      {SidenavItems.map((item: SidenavItem, index: number) => {
        return (
          <div
            key={item.title + index}
            onClick={() => setActive(index)}
            className={`${'sidenav-link'} ${
              index === active ? 'sidenav-link-active' : 'sidenav-link-inactive'
            }`}
          >
            <div
              className={`${'sidenav-border'} ${
                index === active
                  ? 'sidenav-border-active'
                  : 'sidenav-border-inactive'
              }`}
            />
            <Link to={item.route}>
              <div className={`sidenav-icon-title ${getTourClass(index)}`}>
                <div className="sidenav-icon">
                  {item.icon ? (
                    <img
                      src={item.icon[index === active ? 'active' : 'inactive']}
                      alt={''}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="sidenav-title">{item.title}</div>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
}
