import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidenavItem, SidenavItems } from '../../data/sidenav-items';

export default function SidenavLinks() {
  const [active, setActive] = useState<number>(0);
  return (
    <>
      {SidenavItems.filter((item: SidenavItem) => !!item.icon).map(
        (item: SidenavItem, index: number) => {
          return (
            <div
              onClick={() => setActive(index)}
              className={`${'sidenav-link'} ${
                index === active
                  ? 'sidenav-link-active'
                  : 'sidenav-link-inactive'
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
                        src={
                          item.icon[index === active ? 'active' : 'inactive']
                        }
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
        },
      )}
    </>
  );
}
