import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
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
    <div className={'section-accordion-container'}>
      {props.items.map((item: AccordionItem, index: number) => {
        return (
          <div
            key={`item-${index}`}
            className={`
              ${
                active === item.id
                  ? 'section-accordion-active'
                  : 'section-accordion-inactive'
              } ${'section-accordion'} `}
          >
            <StyledAccordion
              square
              TransitionProps={{ unmountOnExit: true }}
              expanded={item.expanded || active === item.id}
              onChange={() => activate(item.id)}
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
                  <div
                    id={item.id}
                    className={'title section-accordion-title-text'}
                  >
                    {item.title}
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
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
              </AccordionDetails>
            </StyledAccordion>
          </div>
        );
      })}
    </div>
  );
}
