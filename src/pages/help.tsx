import React, { ReactElement } from 'react';

import { Link } from '../components/link/link';
import { HelpItems } from '../data/help-items';
import { SwashSupportPath } from '../paths';

export function Help(): ReactElement {
  return (
    <>
      <div className={'page-header'}>
        <h6>Help</h6>
      </div>
      <div className={'flex col gap32'}>
        <div className={'round no-overflow bg-white card'}>
          <p>
            Got a question? Check out each section below for FAQs on the
            different sides of Swash.
          </p>
          <div className={'flex wrap gap20 help-container'}>
            {HelpItems.map(({ title, image, className, link }, index) => (
              <Link
                url={link}
                className={`relative flex col justify-end help-option ${className}`}
                external={link.startsWith('http')}
                newTab={link.startsWith('http')}
                key={`help-option-${index}`}
              >
                <img
                  className={'absolute help-option-image'}
                  src={image}
                  alt={title}
                />
                <p className={'large'}>{title}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className={'round no-overflow bg-white card'}>
          <p className={'large bold'}>Can’t find your answer? Contact Swash.</p>
          <p>
            Submit a support request{' '}
            <Link url={SwashSupportPath} external newTab>
              here
            </Link>{' '}
            and someone will get back to you within 48 hours.
          </p>
        </div>
      </div>
    </>
  );
}
