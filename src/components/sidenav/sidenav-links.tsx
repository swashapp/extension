import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidenavItem, SidenavItems } from '../../data/sidenav-items';

export default function SidenavLinks(props: { activeIndex?: number }) {
  const [active, setActive] = useState<number>(props.activeIndex || 0);
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
              <div className="sidenav-icon-title">
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
