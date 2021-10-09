import React, { useMemo, useState } from 'react';
import Input from '../components/input/input';
import BackgroundTheme from '../components/drawing/background-theme';
import Button from '../components/button/button';
import Section from '../components/section/section';
import SectionAccordion from '../components/section-accordion/section-accordion';
import HelpData from '../data/help';
import SearchEndAdornment from '../components/input/end-adronments/search-end-adornment';

export default function Help() {
  const [searchText, setSearchText] = useState<string>('');

  const helpData = useMemo(() => {
    return searchText === ''
      ? HelpData
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
              content: data.content.replace(
                new RegExp(`${searchText}(?![^<]*>)`, 'gi'),
                `<mark>${searchText}</mark>`,
              ),
              expanded:
                data.content.toLowerCase().indexOf(searchText.toLowerCase()) >=
                0,
            };
          }),
        ];
  }, [searchText]);
  return (
    <div className="page-container help-container">
      <BackgroundTheme layout="layout3" />
      <div className="page-header">
        <h2>Help</h2>
      </div>
      <div className="flex-column gap32">
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
            <Input
              name="search"
              placeholder="Search something at help..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              endAdornment={<SearchEndAdornment value={searchText} />}
            />
            <SectionAccordion items={helpData} />
          </div>
        </div>
      </div>
    </div>
  );
}
