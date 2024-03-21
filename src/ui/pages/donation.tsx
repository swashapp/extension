import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { helper } from '../../helper';
import { GetCharityInfoRes } from '../../types/api/charity.type';
import { OngoingRes } from '../../types/api/donation.type';
import { Button } from '../components/button/button';
import { Charity } from '../components/charity/charity';
import { StopDonation } from '../components/donate/stop-donation';
import { SearchEndAdornment } from '../components/input/end-adornments/search-end-adornment';
import { InputBase } from '../components/input/input-base';
import { Link } from '../components/link/link';
import { PageHeader } from '../components/page-header/page-header';
import { showPopup } from '../components/popup/popup';
import { useErrorHandler } from '../hooks/use-error-handler';

export function Donation(): ReactNode {
  const { safeRun } = useErrorHandler();

  const [charities, setCharities] = useState<GetCharityInfoRes[]>([]);
  const [favorite, setFavorite] = useState<string[]>([]);
  const [ongoings, setOngoings] = useState<OngoingRes[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const filteredCharity = useMemo(() => {
    if (!searchText) return charities;
    const keyword = searchText.toLowerCase();

    return charities.filter((charity) =>
      Object.keys(charity).some((field) =>
        charity[field as keyof GetCharityInfoRes]
          .toLowerCase()
          .includes(keyword),
      ),
    );
  }, [charities, searchText]);

  const onStopDonation = useCallback((id: string) => {
    setOngoings((prev) => prev.filter((row) => row.id !== id));
  }, []);

  useEffect(() => {
    safeRun(async () => {
      const charities = await helper('user').getAvailableDonation();
      setCharities(charities);
    });

    safeRun(async () => {
      const ongoing = await helper('user').getOngoingDonations();
      setOngoings(ongoing);
    });

    safeRun(async () => {
      const favorite = await helper('preferences').getFavoriteCharities();
      setFavorite(favorite);
    });
  }, [safeRun]);

  const getOngoingCharities = useMemo(
    () =>
      ongoings.map((ongoing) => {
        const charity = charities.find(
          (item) => item.id === ongoing.charity_id,
        );
        if (!charity) return;

        return (
          <div
            key={charity.id}
            className={
              'flex align-center justify-between bg-lightest-grey donation-ongoing'
            }
          >
            <div className={'flex align-center justify-between col-21'}>
              <div className={'flex gap16'}>
                <img
                  src={charity?.logo}
                  alt={charity?.name}
                  className={'donation-ongoing-logo'}
                />
                <div className={'flex col justify-center'}>
                  <p className={'large bold'}>{charity?.name}</p>
                  <p>{charity?.location}</p>
                </div>
              </div>
            </div>
            <div className={'col-10'}>
              <p className={'bold'}>Donation Type</p>
              <p>Ongoing Donation</p>
            </div>
            <div className={'col-10'}>
              <p className={'bold'}>Donation Amount</p>
              <p>{ongoing.portion}% per day</p>
            </div>
            <div>
              <Button
                text={'Stop Donating'}
                className={'donation-ongoing-action'}
                onClick={() => {
                  showPopup({
                    closable: false,
                    closeOnBackDropClick: true,
                    paperClassName: 'popup custom',
                    content: (
                      <StopDonation
                        charity={charity}
                        ongoing={ongoing}
                        onStop={() => {
                          onStopDonation(ongoing.id);
                        }}
                      />
                    ),
                  });
                }}
              />
            </div>
          </div>
        );
      }),
    [charities, ongoings],
  );

  return (
    <>
      <PageHeader header={'Donation'} />
      <div className={'flex col gap32'}>
        {ongoings.length > 0 && charities.length > 0 ? (
          <div className={'round no-overflow flex col gap24 bg-white card28'}>
            <p className={'subHeader2'}>Ongoing donations</p>
            <div className={'flex col gap16'}>{getOngoingCharities}</div>
          </div>
        ) : null}
        <div className={'flex col gap24 round no-overflow bg-white card28'}>
          <div className={'flex col gap16'}>
            <p className={'subHeader2'}>Data for Good</p>
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
            <InputBase
              name={'search'}
              placeholder={'Search the list of charities'}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              endAdornment={<SearchEndAdornment />}
            />
          </div>
          <div className={`flex wrap gap24`}>
            {filteredCharity.map((charity) => {
              return (
                <Charity
                  key={charity.id}
                  className={'donation-charity'}
                  charity={charity}
                  favorite={favorite.includes(charity.id)}
                  ongoing={ongoings.find(
                    (item) => item.charity_id === charity.id,
                  )}
                  onDonate={(ongoing: OngoingRes) => {
                    setOngoings((prev) => [...prev, ongoing]);
                  }}
                  onStop={() => {
                    const item = ongoings.find(
                      (item) => item.charity_id === charity.id,
                    );
                    if (item) onStopDonation(item.id);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
