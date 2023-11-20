import React from 'react';

import { Link } from '../components/link/link';
import { EarnMoreItems } from '../data/earn-more-items';

export function EarnMore(): JSX.Element {
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header beta-badge-header">
          <h2>Earn</h2>
          <div className={'beta-badge-page'}>Beta</div>
        </div>
        <div className="flex-column card-gap">
          <div className="simple-card">
            <p>
              Currently in beta, Swash Earn enables verified Swash app members
              to turbo boost their earnings by opting in for new ways to earn
              online.
            </p>
            <div className="earn-more-grid-container">
              {EarnMoreItems.map(
                ({ title, subtitle, image, className, link }, index) => {
                  const children = (
                    <>
                      <img src={image} alt={title} />
                      <div className="earn-more-option-title title">
                        {title}
                      </div>
                      <div className="earn-more-option-subtitle title">
                        {subtitle}
                      </div>
                    </>
                  );

                  if (link)
                    return (
                      <Link
                        url={link}
                        className={`earn-more-option ${className}`}
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
                        className={`earn-more-option ${className}`}
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
      </div>
    </div>
  );
}
