import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import { PropsWithChildren, useState } from 'react';

import { RemoveButton } from '../button/remove';
import { ProgressBar } from '../progress/progress';

const General = '/static/images/icons/general-category.svg';
const Music = '/static/images/icons/music-category.svg';
const News = '/static/images/icons/news-category.svg';
const Search = '/static/images/icons/search-category.svg';
const Shopping = '/static/images/icons/shopping-category.svg';
const Social = '/static/images/icons/social-category.svg';
const Travel = '/static/images/icons/travel-category.svg';
const Beauty = '/static/images/icons/beauty-category.svg';
const Expand = '/static/images/shape/expand.svg';

const Icons = {
  Search,
  Travel,
  General,
  Shopping,
  Social,
  Music,
  News,
  Beauty,
};

export interface DataItem {
  percentage: number;
  currentTime: number;
  msg: { [key: string]: string };
  msgId: string;
  category: keyof typeof Icons;
  link: string;
  title: string;
}

const StyledAccordion = withStyles({
  root: {
    width: '100%',
    border: 'none',
    boxShadow: 'none',
    background: 'transparent',
    borderRadius: '12px 12px 0 0',
    overflow: 'hidden',
  },
  expanded: {
    background: 'var(--data-accordion-color)',
    borderRadius: '12px',
  },
})(Accordion);

const StyledAccordionSummary = withStyles({
  root: {
    flexDirection: 'row-reverse',
    padding: '24px 26px 24px 20px',
    background: 'var(--data-accordion-color)',
    '&$expanded': {},
  },
  content: {
    padding: 0,
    margin: 0,
    '&$expanded': {
      padding: 0,
      margin: 0,
    },
  },
  expanded: {},
})(AccordionSummary);

const StyledAccordionDetails = withStyles(() => ({
  root: {
    margin: 0,
    padding: 24,
    overflow: 'auto',
  },
}))(AccordionDetails);

export function DataAccordion(
  props: PropsWithChildren<{
    items: DataItem[];
    onRemove: (item: DataItem) => void;
  }>,
): JSX.Element {
  const [active, setActive] = useState(-1);
  return (
    <div className={'data-accordion-container'}>
      {props.items.map((item: DataItem, index: number) => {
        return (
          <div
            key={`item-${index}`}
            className={`${
              active === index
                ? 'data-accordion-active'
                : 'data-accordion-inactive'
            } data-accordion`}
          >
            <StyledAccordion
              square
              expanded={active === index}
              onChange={() =>
                setActive((current) => (current === index ? -1 : index))
              }
            >
              <StyledAccordionSummary
                expandIcon={
                  <img
                    className="section-accordion-expand-icon"
                    src={Expand}
                    alt={'Expand'}
                  />
                }
              >
                <div className="data-accordion-summary-progress">
                  <div className={'data-accordion-summary'}>
                    <div className={'data-accordion-title'}>
                      <div className={'data-accordion-title-icon'}>
                        <img
                          width={24}
                          height={24}
                          src={Icons[item.category]}
                          alt=""
                        />
                      </div>
                      <div className={'data-accordion-title-content'}>
                        <div className={'data-accordion-title-header'}>
                          {item.link}
                        </div>
                        <div className={'data-accordion-title-text'}>
                          {item.title}
                        </div>
                      </div>
                    </div>
                    <RemoveButton
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onRemove(item);
                      }}
                    />
                  </div>
                  <div className="data-accordion-progress">
                    <ProgressBar value={item.percentage} />
                  </div>
                </div>
              </StyledAccordionSummary>
              <StyledAccordionDetails>
                <div className={'data-accordion-content'}>
                  <pre>{JSON.stringify(item.msg, undefined, 2)}</pre>
                </div>
              </StyledAccordionDetails>
            </StyledAccordion>
          </div>
        );
      })}
    </div>
  );
}
