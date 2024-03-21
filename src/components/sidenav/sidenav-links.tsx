import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { helper } from '../../core/webHelper';
import { SidenavItem, SidenavItems } from '../../data/sidenav-items';
import { VerificationBadge } from '../verification/verification-badge';

export function SidenavLinks(props: { activeIndex?: number }): ReactElement {
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
              className={`flex row sidenav-link ${
                index === active ? 'active' : 'inactive'
              }`}
            >
              <div
                className={`${'sidenav-border'} ${
                  index === active ? 'active' : 'inactive'
                }`}
              />
              <Link to={item.route}>
                <div className={`flex row nowrap align-center sidenav-body`}>
                  <div className={'sidenav-icon'}>
                    {item.icon ? <img src={item.icon.url} alt={''} /> : <></>}
                  </div>
                  <p className={'bold'}>{item.title}</p>
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
