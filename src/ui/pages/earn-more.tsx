import { ReactNode } from 'react';

import { Link } from '../components/link/link';
import { PageHeader } from '../components/page-header/page-header';
import { PunchedBox } from '../components/punched-box/punched-box';
import { EarnMoreItems } from '../data/earn-more-items';

export function EarnMore(): ReactNode {
  return (
    <>
      <PageHeader header={'Earn More'} />
      <div className={'flex col gap32'}>
        <div className={'round no-overflow flex col gap32 bg-white card28'}>
          <p>
            Currently in beta, Swash Earn enables verified Swash app members to
            turbo boost their earnings by opting in four new ways to earn
            online.
          </p>
          <div className={'flex wrap justify-between gap16'}>
            {EarnMoreItems.map(({ title, subtitle, image, link }, index) => {
              const children = (
                <>
                  <img className={'absolute'} src={image} alt={title} />
                  <p className={'subHeader2'}>{title}</p>
                  <p className={'large'}>{subtitle}</p>
                </>
              );

              return (
                <Link
                  url={link}
                  key={`earn-option-${index}`}
                  className={`flex col justify-end earn-more-option`}
                  external={link.startsWith('http')}
                  newTab={link.startsWith('http')}
                >
                  <PunchedBox className={'card32 border-box relative'}>
                    {children}
                  </PunchedBox>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
