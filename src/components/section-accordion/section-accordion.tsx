import {
  Accordion,
  accordionClasses,
  AccordionDetails,
  AccordionDetailsProps,
  AccordionSummary,
  accordionSummaryClasses,
  AccordionSummaryProps,
  styled,
} from '@mui/material';
import { Markup } from 'interweave';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import React from 'react';

import { scroller } from 'react-scroll';

const Expand = '/static/images/shape/expand.svg';

type AccordionItem = {
  title: string;
  icon: string;
  content: string;
  expanded?: boolean;
  id: string;
};

const StyledAccordion = styled(Accordion)(() => ({
  width: '100%',
  border: 'none',
  boxShadow: 'none',
  [`& .${accordionClasses.expanded}`]: {},
}));

const StyledAccordionSummary = styled(({ ...props }: AccordionSummaryProps) => (
  <AccordionSummary {...props} />
))(() => ({
  margin: '32px 0 32px 0',
  padding: 0,
  '&$expanded': {
    padding: 0,
  },
  [`& .${accordionSummaryClasses.content}`]: {
    padding: 0,
    margin: 0,
    '&$expanded': {
      padding: 0,
      margin: 0,
    },
  },
  [`& .${accordionSummaryClasses.expanded}`]: {},
}));

const StyledAccordionDetails = styled(({ ...props }: AccordionDetailsProps) => (
  <AccordionDetails {...props} />
))(() => ({
  margin: '0 0 32px 0',
  padding: 0,
}));

export function SectionAccordion(
  props: PropsWithChildren<{
    items: AccordionItem[];
  }>,
): JSX.Element {
  const [active, setActive] = useState<string>('');

  const scrollTo = useCallback((id: string) => {
    scroller.scrollTo(id, {
      duration: 1000,
      delay: 0,
      smooth: true,
    });
  }, []);
  const activate = useCallback((id: string) => {
    setActive((current) => (current === id ? '' : id));
  }, []);

  useEffect(() => {
    if (active) {
      setTimeout(() => scrollTo(active), 1000);
    }
  }, [active, scrollTo]);
  return (
    <div className="section-accordion-container">
      {props.items.map((item: AccordionItem, index: number) => {
        return (
          <div
            key={`item-${index}`}
            className={`${
              active === item.id
                ? 'section-accordion-active'
                : 'section-accordion-inactive'
            } ${'section-accordion'}`}
          >
            <StyledAccordion
              square
              TransitionProps={{ unmountOnExit: true }}
              expanded={item.expanded || active === item.id}
              onChange={() => activate(item.id)}
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
                <div className={'title section-accordion-title'}>
                  <div className={'section-accordion-title-icon'}>
                    <img src={item.icon} alt="" />
                  </div>
                  <div
                    id={item.id}
                    className={'title section-accordion-title-text'}
                  >
                    {item.title}
                  </div>
                </div>
              </StyledAccordionSummary>
              <StyledAccordionDetails>
                <div className={'section-accordion-content'}>
                  <Markup
                    content={item.content}
                    transform={(node) => {
                      if (node.tagName === 'IFRAME') {
                        const src = node.getAttribute('src') || '';
                        return (
                          <iframe
                            className="help-video"
                            allowFullScreen
                            src={src}
                            title="YouTube video player"
                            scrolling="no"
                            frameBorder="no"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          ></iframe>
                        );
                      }
                    }}
                  />
                </div>
              </StyledAccordionDetails>
            </StyledAccordion>
          </div>
        );
      })}
    </div>
  );
}
