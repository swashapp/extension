import React, { ReactElement } from 'react';

import { Link } from '../components/link/link';
import { EarnMoreItems } from '../data/earn-more-items';

export function EarnMore(): ReactElement {
  return (
    <>
      <div className={'flex align-center page-header'}>
        <h5>Earn</h5>
        <div className={'beta-badge-page'}>Beta</div>
      </div>
      <div className={'flex col gap32'}>
        <div className={'round no-overflow bg-white card'}>
          <p>
            Currently in beta, Swash Earn enables verified Swash app members to
            turbo boost their earnings by opting in for new ways to earn online.
          </p>
          <div
            className={'flex wrap justify-between gap24 earn-more-container'}
          >
            {EarnMoreItems.map(
              ({ title, subtitle, image, className, link }, index) => {
                const children = (
                  <>
                    <img className={'absolute'} src={image} alt={title} />
                    <p className={'large'}>{title}</p>
                    <p>{subtitle}</p>
                  </>
                );

                if (link)
                  return (
                    <Link
                      url={link}
                      className={`flex col justify-end relative earn-more-option ${className}`}
                      external={link.startsWith('http')}
                      newTab={link.startsWith('http')}
                      key={`earn-option-${index}`}
                    >
                      {children}
                    </Link>
                  );
                else {
                  return (
                    <div
                      className={`flex col justify-end relative earn-more-option ${className}`}
                      key={`earn-option-${index}`}
                    >
                      {children}
                    </div>
                  );
                }
              },
            )}
          </div>
        </div>
      </div>
    </>
  );
}
