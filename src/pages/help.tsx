import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import Button from '../components/button/button';
import BackgroundTheme from '../components/drawing/background-theme';
import SearchEndAdornment from '../components/input/end-adornments/search-end-adornment';
import Input from '../components/input/input';
import SectionAccordion from '../components/section-accordion/section-accordion';
import Section from '../components/section/section';
import { TOUR_NAME } from '../components/tour/tour';
import HelpData from '../data/help';
import { RouteToPages } from '../paths';
import {
  LocalStorageService,
  STORAGE_KEY,
} from '../service/local-storage-service';

export default memo(function Help() {
  const [searchText, setSearchText] = useState<string>('');
  const [reward, setReward] = useState<number>(0);
  const [tour, setTour] = useState<{ [key: string]: unknown }>({});

  const loadActiveReferral = useCallback(() => {
    window.helper.getActiveReferral().then((referral) => {
      if (referral.reward) setReward(referral.reward);
    });
  }, []);

  useEffect(() => {
    loadActiveReferral();
  }, [loadActiveReferral]);

  useEffect(() => {
    setTour(LocalStorageService.load(STORAGE_KEY.TOUR));
  }, [loadActiveReferral]);

  const helpData = useMemo(() => {
    return searchText === ''
      ? HelpData.map((data) => ({
          ...data,
          content: data.content.replace('$REWARD', reward.toString()),
        }))
      : [
          ...HelpData.filter(
            (data) =>
              data.content.toLowerCase().indexOf(searchText.toLowerCase()) >=
                0 ||
              data.title.toLowerCase().indexOf(searchText.toLowerCase()) >= 0,
          ).map((data) => {
            return {
              ...data,
              title: data.title,
              content: data.content
                .replace(
                  new RegExp(`${searchText}(?![^<]*>)`, 'gi'),
                  `<mark>${searchText}</mark>`,
                )
                .replace('$REWARD', reward.toString()),
              expanded:
                data.content.toLowerCase().indexOf(searchText.toLowerCase()) >=
                0,
            };
          }),
        ];
  }, [searchText, reward]);

  const makeTourLink = useCallback(
    (route: string, tourName: TOUR_NAME) => route + '?tour=' + tourName,
    [],
  );
  return (
    <div className="page-container">
      <BackgroundTheme layout="layout3" />
      <div className="page-content">
        <div className="page-header">
          <h2>Help</h2>
        </div>
        <div className="flex-column card-gap">
          <div className="simple-card">
            <div>
              <h6>Product tour</h6>
              <Section
                items={[
                  {
                    text: 'What is Swash wallet?',
                    done: !!tour[TOUR_NAME.WALLET],
                    link: makeTourLink(RouteToPages.wallet, TOUR_NAME.WALLET),
                  },
                  {
                    text: 'How backup works?',
                    done: !!tour?.backup,
                    link: '',
                  },
                  {
                    text: 'How referral link works?',
                    done: !!tour[TOUR_NAME.INVITE_FRIENDS],
                    link: makeTourLink(
                      RouteToPages.inviteFriends,
                      TOUR_NAME.INVITE_FRIENDS,
                    ),
                  },
                  {
                    text: 'How donations works?',
                    done: !!tour?.donations,
                    link: '',
                  },
                  {
                    text: 'Few more things',
                    done: false,
                    link: '',
                  },
                ]}
              />
              <Button
                className="next-tour-button"
                text="Next Tour"
                color="secondary"
                link={false}
              />
            </div>
          </div>
          <div className="simple-card">
            <div>
              <div className="help-search-input">
                <Input
                  name="search"
                  placeholder="Search something at help..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  endAdornment={<SearchEndAdornment />}
                />
              </div>
              <SectionAccordion items={helpData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
