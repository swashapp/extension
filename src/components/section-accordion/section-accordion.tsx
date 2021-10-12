import React, { ReactElement } from 'react';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
import { PropsWithChildren, useState } from 'react';
import Expand from 'url:../../static/images/shape/expand.svg';
import { Markup } from 'interweave';

type AccordionItem = {
  title: string;
  icon: string;
  content: string;
  expanded?: boolean;
};

const StyledAccordion = withStyles({
  root: {
    width: '100%',
    border: 'none',
    boxShadow: 'none',
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    margin: '32px 0 32px 0',
    padding: 0,
    '&$expanded': {
      padding: 0,
    },
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
})(MuiAccordionSummary);

const AccordionDetails = withStyles(() => ({
  root: {
    margin: '0 0 32px 0',
    padding: 0,
  },
}))(MuiAccordionDetails);

export default function SectionAccordion(
  props: PropsWithChildren<{
    items: AccordionItem[];
  }>,
) {
  const [active, setActive] = useState(-1);

  return (
    <div className={'section-accordion-container'}>
      {props.items.map((item: AccordionItem, index: number) => {
        return (
          <div
            key={`item-${index}`}
            className={`
              ${
                active === index
                  ? 'section-accordion-active'
                  : 'section-accordion-inactive'
              } ${'section-accordion'} `}
          >
            <StyledAccordion
              square
              expanded={item.expanded || active === index}
              onChange={() =>
                setActive((current) => (current === index ? -1 : index))
              }
            >
              <AccordionSummary
                expandIcon={
                  <img
                    className="section-accordion-expand-icon"
                    src={Expand}
                    alt={'Expand'}
                  />
                }
              >
                <div className={'title section-accordion-title'}>
                  <div className={'section-accordion-title-icon'}>
                    <img src={item.icon} alt="" />
                  </div>
                  <div className={'title section-accordion-title-text'}>
                    {item.title}
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className={'section-accordion-content'}>
                  <Markup content={item.content} />
                </div>
              </AccordionDetails>
            </StyledAccordion>
          </div>
        );
      })}
    </div>
  );
}
