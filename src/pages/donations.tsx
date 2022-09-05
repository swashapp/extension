import React, { useEffect, useState } from 'react';

import { Charity } from '../components/charity/charity';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { SearchEndAdornment } from '../components/input/end-adornments/search-end-adornment';
import { Input } from '../components/input/input';
import { helper } from '../core/webHelper';
import { Charity as CharityType } from '../types/storage/charity.type';

const charities = [
  {
    id: 1,
    name: 'Mercy For Animals',
    category: 'Animal',
    banner: '/static/images/image.png',
    location: 'Los Angeles, CA',
    icon: '/static/images/logo.png',
    website: 'https://donate.com',
    address: '0x0000000000000000000000000000000000000000',
    description:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
    mission:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
    program:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
    result:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
  },
  {
    id: 2,
    name: 'Mercy For Animals',
    category: 'Animal',
    banner: '/static/images/image.png',
    location: 'Los Angeles, CA',
    icon: '/static/images/logo.png',
    website: 'https://donate.com',
    address: '0x0000000000000000000000000000000000000000',
    description:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
    mission:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
    program:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
    result:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
  },
  {
    id: 3,
    name: 'Mercy For Animals',
    category: 'Animal',
    banner: '/static/images/image.png',
    location: 'Los Angeles, CA',
    icon: '/static/images/logo.png',
    website: 'https://donate.com',
    address: '0x0000000000000000000000000000000000000000',
    description:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
    mission:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
    program:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
    result:
      'People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world.',
  },
];

export function Donations(): JSX.Element {
  const [metadata, setMetadata] = useState<CharityType[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    helper.getCharityMetadata().then(setMetadata);
  }, []);

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
              {charities.map((charity) => (
                <Charity
                  key={charity.id}
                  id={charity.id}
                  banner={charity.banner}
                  logo={charity.icon}
                  title={charity.name}
                  location={charity.location}
                  description={charity.description}
                  wallet={charity.address}
                  metadata={metadata.find((item) => item.id === charity.id)}
                />
              ))}
            </FlexGrid>
          </div>
        </div>
      </div>
    </div>
  );
}
