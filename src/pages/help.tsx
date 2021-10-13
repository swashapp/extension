import React, { memo, useMemo, useState } from 'react';

import Button from '../components/button/button';
import BackgroundTheme from '../components/drawing/background-theme';
import SearchEndAdornment from '../components/input/end-adornments/search-end-adornment';
import Input from '../components/input/input';
import SectionAccordion from '../components/section-accordion/section-accordion';
import Section from '../components/section/section';
import HelpData from '../data/help';

export default memo(function Help() {
  const [searchText, setSearchText] = useState<string>('');
  const [reward, setReward] = useState<string>('VALUE');

  const helpData = useMemo(() => {
    return searchText === ''
      ? HelpData.map((data) => ({
          ...data,
          content: data.content.replace('$REWARD', reward),
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
                .replace('$REWARD', reward),
              expanded:
                data.content.toLowerCase().indexOf(searchText.toLowerCase()) >=
                0,
            };
          }),
        ];
  }, [searchText, reward]);
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
                    done: false,
                    link: '',
                  },
                  {
                    text: 'How backup works?',
                    done: false,
                    link: '',
                  },
                  {
                    text: 'How referral link works?',
                    done: false,
                    link: '',
                  },
                  {
                    text: 'How donations works?',
                    done: false,
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
