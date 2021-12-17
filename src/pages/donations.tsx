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
