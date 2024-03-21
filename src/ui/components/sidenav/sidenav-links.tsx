import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { helper } from '../../../helper';
import { AccountInfoRes } from '../../../types/api/account.type';
import { SidenavItem, SidenavItems } from '../../data/sidenav-items';
import { VerificationBadge } from '../verification/verification-badge';

export function SidenavLinks(props: { activeIndex?: number }): ReactNode {
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [active, setActive] = useState<number>(props.activeIndex || 0);

  const checkVerification = useCallback(async () => {
    if (await helper('coordinator').isReady()) {
      const { is_verified } = (await helper('cache').getData(
        'info',
      )) as AccountInfoRes;
      setVerified(is_verified);
    } else {
      setTimeout(checkVerification, 3000, true);
    }
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
                    {item.icon ? <img src={item.icon.url} alt={''} /> : null}
                  </div>
                  <p className={'bold'}>{item.title}</p>
                  {item.title === 'Profile' ? (
                    <VerificationBadge
                      verified={verified}
                      short
                      darkBackground
                    />
                  ) : null}
                </div>
              </Link>
            </div>
          );
        },
      )}
    </>
  );
}
