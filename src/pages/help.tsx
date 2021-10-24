import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/button/button';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { HELP_TOUR_CLASS } from '../components/help/help-tour';
import { SearchEndAdornment } from '../components/input/end-adornments/search-end-adornment';
import { Input } from '../components/input/input';
import { SectionAccordion } from '../components/section-accordion/section-accordion';
import { Section } from '../components/section/section';
import { TOUR_NAME } from '../components/tour/tour';
import HelpData from '../data/help';
import { RouteToPages } from '../paths';
import {
  LocalStorageService,
  STORAGE_KEY,
} from '../service/local-storage-service';

export function Help(): JSX.Element {
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
  const tourItems = useMemo(() => {
    return [
      {
        text: 'What is Swash wallet?',
        done: !!tour[TOUR_NAME.WALLET],
        link: makeTourLink(RouteToPages.wallet, TOUR_NAME.WALLET),
      },
      {
        text: 'How backup works?',
        done: !!tour[TOUR_NAME.SETTINGS],
        link: makeTourLink(RouteToPages.settings, TOUR_NAME.SETTINGS),
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
        text: 'What is Swash data?',
        done: !!tour[TOUR_NAME.DATA],
        link: makeTourLink(RouteToPages.data, TOUR_NAME.DATA),
      },
      {
        text: 'How help works?',
        done: !!tour[TOUR_NAME.HELP],
        link: makeTourLink(RouteToPages.help, TOUR_NAME.HELP),
      },
    ];
  }, [makeTourLink, tour]);
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
              <div className={HELP_TOUR_CLASS.TOUR}>
                <h6>Product tour</h6>
              </div>
              <Section items={tourItems} />
              <Link
                to={
                  tourItems.find((item) => item.link && !item.done)?.link ||
                  tourItems[0].link
                }
              >
                <Button
                  className="next-tour-button"
                  text="Next Tour"
                  color="secondary"
                  link={false}
                />
              </Link>
            </div>
          </div>
          <div className="simple-card">
            <div>
              <div
                className={`help-search-input ${HELP_TOUR_CLASS.SEARCH_HELP}`}
              >
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
}
