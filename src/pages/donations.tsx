import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '../components/button/button';
import { Charity } from '../components/charity/charity';
import { StopDonation } from '../components/donate/stop-donation';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { SearchEndAdornment } from '../components/input/end-adornments/search-end-adornment';
import { Input } from '../components/input/input';
import { showPopup } from '../components/popup/popup';
import { helper } from '../core/webHelper';
import { Charity as CharityType } from '../types/storage/charity.type';

export function Donations(): JSX.Element {
  const [charities, setCharities] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<CharityType[]>([]);
  const [onGoing, setOngoing] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const fetchMetadata = useCallback(() => {
    helper.getCharityMetadata().then((meta) => {
      setMetadata(meta);
      setOngoing(false);

      const index = meta.findIndex((charity: CharityType) => charity.auto_pay);
      if (index >= 0) setOngoing(true);
    });
  }, []);

  useEffect(() => {
    fetchMetadata();
    helper.getCharities().then(setCharities);
  }, [fetchMetadata]);

  const charityData = useMemo(() => {
    if (searchText === '') return charities;
    else
      return charities.filter(
        (charity) =>
          charity.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
          charity.description.toLowerCase().indexOf(searchText.toLowerCase()) >=
            0,
      );
  }, [charities, searchText]);

  return (
    <div className="page-container">
      <BackgroundTheme layout="layout3" />
      <div className="page-content">
        {onGoing ? (
          <div className="flex-column card-gap donation-bottom-margin">
            <div className="simple-card">
              <div className="flex-column card-gap">
                <div className={'transaction-header-container'}>
                  <h2>Ongoing donations</h2>
                </div>
                {metadata.map((charity) => {
                  if (charity.auto_pay) {
                    const data = charities.find(
                      (item) => item.id === charity.id,
                    );

                    return (
                      <div key={charity.id} className="ongoing-top-page">
                        <div className="ongoing-top-about">
                          <div className="ongoing-top-logo">
                            <img
                              src={data?.icon}
                              alt={''}
                              style={{
                                height: 'fit-content',
                                width: 'fit-content',
                              }}
                            />
                          </div>
                          <div className="ongoing-top-body">
                            <div className="charity-title title">
                              {data?.name}
                            </div>
                            <div className="charity-location">
                              {data?.location}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="donate-confirmation-name">
                            Donation Type
                          </div>
                          <div className="donate-confirmation-value">
                            Ongoing Donation
                          </div>
                        </div>
                        <div>
                          <div className="donate-confirmation-name">
                            Donation Amount
                          </div>
                          <div className="donate-confirmation-value">
                            {charity.percentage}% per day
                          </div>
                        </div>
                        <div>
                          <Button
                            color={'white'}
                            text={'Stop Donating'}
                            link={false}
                            className={'charity-actions-stop'}
                            onClick={() => {
                              showPopup({
                                closable: false,
                                closeOnBackDropClick: true,
                                paperClassName: 'custom-popup',
                                content: (
                                  <StopDonation
                                    id={charity.id}
                                    title={data?.name || ''}
                                    percent={charity.percentage}
                                    callback={fetchMetadata}
                                  />
                                ),
                              });
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="page-header">
          <h2>Donations</h2>
        </div>
        <div className="flex-column card-gap">
          <div className="simple-card">
            <div className="donation-burn">
              <div>
                <div className="donation-burn-title title">Data for Good</div>
                <div className="donation-burn-text">
                  Data for Good enables you to automatically donate the value of
                  your data to a social good organisation of your choice. Read
                  more about Data for Good{' '}
                  <a href={''} target={'_blank'} rel="noreferrer">
                    here
                  </a>
                  .
                </div>
              </div>
            </div>
            <hr className="custom" />
            <div>
              <Input
                name="search"
                placeholder="Search the list of charities"
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
              {charityData.map((charity) => (
                <Charity
                  key={charity.id}
                  id={charity.id}
                  banner={charity.banner}
                  logo={charity.logo}
                  title={charity.name}
                  location={charity.location}
                  description={charity.description}
                  wallet={charity.address}
                  metadata={metadata.find((item) => item.id === charity.id)}
                  callback={fetchMetadata}
                />
              ))}
            </FlexGrid>
          </div>
        </div>
      </div>
    </div>
  );
}
