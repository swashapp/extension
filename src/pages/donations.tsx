import React, { useState } from 'react';

import { Charity } from '../components/charity/charity';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { SearchEndAdornment } from '../components/input/end-adornments/search-end-adornment';
import { Input } from '../components/input/input';

export function Donations(): JSX.Element {
  const [searchText, setSearchText] = useState<string>('');

  return (
    <div className="page-container">
      <BackgroundTheme layout="layout3" />
      <div className="page-content">
        <div className="page-header">
          <h2>Donations</h2>
        </div>
        <div className="flex-column card-gap">
          <div className="simple-card">
            <div className="donation-burn">
              <div>
                <div className={'donation-burn-title title'}>
                  Swash Donating Aswell
                </div>
                <div className="donation-burn-text">
                  Swash will match every donation to charity made by community
                  members and will also burn 1 $SWASH for every 1 $SWASH
                  donated.
                </div>
              </div>
              <div className={'donation-burn-stats'}>
                <div className={'stats-box-green'}>
                  <div className={'stats-title'}>Donated</div>
                  <div className={'stats-number title'}>$222,222.1</div>
                </div>
                <div className={'stats-box-green'}>
                  <div className={'stats-title'}>Burned</div>
                  <div className={'stats-number title'}>$3,333.33</div>
                </div>
              </div>
            </div>
            <hr className="custom" />
            <div>
              <Input
                name="search"
                placeholder="Search Charity..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                endAdornment={<SearchEndAdornment />}
              />
            </div>
            <FlexGrid
              column={2}
              className={'donation-charities'}
              innerClassName={'donation-charity'}
            >
              <Charity
                banner={'/static/images/image.png'}
                logo={'/static/images/logo.png'}
                title={'Mercy For Animals'}
                location={'Los Angeles, CA'}
                description={
                  'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.'
                }
                supporters={255}
                donated={1559}
                yours={150}
              />
              <Charity
                banner={'/static/images/image.png'}
                logo={'/static/images/logo.png'}
                title={'Mercy For Animals'}
                location={'Los Angeles, CA'}
                description={
                  'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.'
                }
                supporters={255}
                donated={1559}
                yours={150}
              />
              <Charity
                banner={'/static/images/image.png'}
                logo={'/static/images/logo.png'}
                title={'Mercy For Animals'}
                location={'Los Angeles, CA'}
                description={
                  'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.'
                }
                supporters={255}
                donated={1559}
                yours={150}
              />
              <Charity
                banner={'/static/images/image.png'}
                logo={'/static/images/logo.png'}
                title={'Mercy For Animals'}
                location={'Los Angeles, CA'}
                description={
                  'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.'
                }
                supporters={255}
                donated={1559}
                yours={150}
              />
              <Charity
                banner={'/static/images/image.png'}
                logo={'/static/images/logo.png'}
                title={'Mercy For Animals'}
                location={'Los Angeles, CA'}
                description={
                  'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.'
                }
                supporters={255}
                donated={1559}
                yours={150}
              />
            </FlexGrid>
          </div>
        </div>
      </div>
    </div>
  );
}
