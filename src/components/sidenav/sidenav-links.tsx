import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { helper } from '../../core/webHelper';
import { SidenavItem, SidenavItems } from '../../data/sidenav-items';
import { VerificationBadge } from '../verification/verification-badge';

export function SidenavLinks(props: { activeIndex?: number }): JSX.Element {
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [active, setActive] = useState<number>(props.activeIndex || 0);

  const checkVerification = useCallback(() => {
    helper.isAccountInitialized().then((initiated: boolean) => {
      if (initiated) {
        helper.isVerified().then((verified: boolean) => {
          setVerified(verified);
        });
      } else {
        setTimeout(checkVerification, 3000, true);
      }
    });
  }, []);

  useEffect(() => {
    checkVerification();
  }, [checkVerification]);

  return (
    <>
      {SidenavItems.filter((item) => !item.hidden).map(
        (item: SidenavItem, index: number) => {
          return (
            <div
              key={item.title + index}
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
                <div className={`sidenav-icon-title`}>
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
                  {item.title === 'Profile' ? (
                    <VerificationBadge
                      verified={verified}
                      short
                      darkBackground
                    />
                  ) : item.title === 'Earn More' ? (
                    <div className={'beta-badge'}>Beta</div>
                  ) : (
                    <></>
                  )}
                </div>
              </Link>
            </div>
          );
        },
      )}
    </>
  );
}
