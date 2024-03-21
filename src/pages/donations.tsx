import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '../components/button/button';
import { Charity } from '../components/charity/charity';
import { StopDonation } from '../components/donate/stop-donation';
import { SearchEndAdornment } from '../components/input/end-adornments/search-end-adornment';
import { Input } from '../components/input/input';
import { Link } from '../components/link/link';
import { showPopup } from '../components/popup/popup';
import { helper } from '../core/webHelper';
import { Charity as CharityType } from '../types/storage/charity.type';

export function Donations(): ReactElement {
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
    setTimeout(() => helper.getCharities().then(setCharities), 300);
  }, [fetchMetadata]);

  const charityData = useMemo(() => {
    if (searchText === '') return charities;
    else {
      const keyword = searchText.toLowerCase();
      return charities.filter(
        (charity) =>
          charity.name.toLowerCase().indexOf(keyword) >= 0 ||
          charity.category.toLowerCase().indexOf(keyword) >= 0 ||
          charity.location.toLowerCase().indexOf(keyword) >= 0 ||
          charity.website.toLowerCase().indexOf(keyword) >= 0 ||
          charity.description.toLowerCase().indexOf(keyword) >= 0 ||
          charity.mission.toLowerCase().indexOf(keyword) >= 0 ||
          charity.program.toLowerCase().indexOf(keyword) >= 0 ||
          charity.result.toLowerCase().indexOf(keyword) >= 0,
      );
    }
  }, [charities, searchText]);

  const getOngoingCharities = useCallback(
    () =>
      metadata.map((charity) => {
        if (charity.auto_pay) {
          const data = charities.find((item) => item.id === charity.id);

          return (
            <div
              key={charity.id}
              className={
                'flex align-center justify-between bg-lightest-grey donation-ongoing'
              }
            >
              <div className={'flex align-center justify-between grow3'}>
                <div className={'flex gap16'}>
                  <img
                    src={data?.logo}
                    alt={data?.name}
                    className={'donation-ongoing-logo'}
                  />
                  <div className={'flex col justify-center'}>
                    <p className={'large bold'}>{data?.name}</p>
                    <p>{data?.location}</p>
                  </div>
                </div>
              </div>
              <div className={'grow1'}>
                <p className={'bold'}>Donation Type</p>
                <p>Ongoing Donation</p>
              </div>
              <div className={'grow1'}>
                <p className={'bold'}>Donation Amount</p>
                <p>{charity.percentage}% per day</p>
              </div>
              <div>
                <Button
                  text={'Stop Donating'}
                  link={false}
                  className={'donation-ongoing-action'}
                  onClick={() => {
                    showPopup({
                      closable: false,
                      closeOnBackDropClick: true,
                      paperClassName: 'popup custom',
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
      }),
    [charities, fetchMetadata, metadata],
  );

  return (
    <>
      <div className={'page-header'}>
        <h6>Donations</h6>
      </div>
      <div className={'flex col gap32'}>
        {onGoing && charities.length > 0 ? (
          <div className={'flex col gap32 donation-bottom-margin'}>
            <div className={'round no-overflow bg-white card'}>
              <div>
                <h6>Ongoing donations</h6>
              </div>
              <div className={'flex col gap16'}>{getOngoingCharities()}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className={'flex col gap32 round no-overflow bg-white card'}>
          <div>
            <h6>Data for Good</h6>
            <p>
              Data for Good enables you to automatically donate the value of
              your data to a social good organisation of your choice. Read more
              about Data for Good and what it means for the Swash community{' '}
              <Link
                url={
                  'https://medium.com/swashapp/introducing-data-for-good-philanthropy-in-web-3-2ce57da289e7'
                }
                external
                newTab
              >
                here
              </Link>
              .
            </p>
          </div>
          <hr />
          <div>
            <Input
              name={'search'}
              placeholder={'Search the list of charities'}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              endAdornment={<SearchEndAdornment />}
            />
          </div>
          <div className={`flex wrap gap24`}>
            {charityData.map((charity) => {
              return (
                <Charity
                  key={charity.id}
                  className={'donation-charity'}
                  id={charity.id}
                  banner={charity.banner}
                  logo={charity.logo}
                  title={charity.name}
                  website={charity.website}
                  location={charity.location}
                  description={charity.description}
                  wallet={charity.address}
                  metadata={metadata.find((item) => item.id === charity.id)}
                  callback={fetchMetadata}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
