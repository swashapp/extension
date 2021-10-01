import React, { Dispatch, SetStateAction, useCallback } from 'react';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
import { PropsWithChildren, useState } from 'react';
import RemoveButton from '../button/remove';
import Expand from 'url:../../static/images/shape/expand.svg';
import Search from 'url:../../static/images/icons/search-category.svg';
import Travel from 'url:../../static/images/icons/travel-category.svg';
import General from 'url:../../static/images/icons/general-category.svg';
import Shopping from 'url:../../static/images/icons/shopping-category.svg';
import Social from 'url:../../static/images/icons/social-category.svg';
import Music from 'url:../../static/images/icons/music-category.svg';
import News from 'url:../../static/images/icons/news-category.svg';
import ProgressBar from '../progress/progress';

const Icons = {
  Search,
  Travel,
  General,
  Shopping,
  Social,
  Music,
  News,
};

export interface DataItem {
  percentage: number;
  currentTime: number;
  msg: object;
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
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    flexDirection: 'row-reverse',
    margin: '20px 0 0 0',
    padding: '24px 26px 24px 20px',
    background: '#F3F9F9',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
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
})(MuiAccordionSummary);

const AccordionDetails = withStyles(() => ({
  root: {
    margin: 0,
    padding: 24,
    overflow: 'auto',
  },
}))(MuiAccordionDetails);

export default function DataAccordion(
  props: PropsWithChildren<{
    items: DataItem[];
    // setItems: Dispatch<SetStateAction<DataItem[]>>;
  }>,
) {
  const [active, setActive] = useState(-1);
  // const deleteMsg = useCallback(
  //   (message) =>
  //     props.setItems((messages) => {
  //       const filterdMessages = messages.filter(
  //         (msg: DataItem) => msg.msgId !== message.msgId,
  //       );
  //       window.helper.cancelSending(message.msgId);
  //       return filterdMessages.slice();
  //     }),
  //   [props.setItems],
  // );
  return (
    <div className={'data-accordion-container'}>
      {props.items.map((item: DataItem, index: number) => {
        return (
          <div
            key={`item-${index}`}
            className={`
              ${
                active === index
                  ? 'data-accordion-active'
                  : 'data-accordion-inactive'
              } ${'data-accordion'} `}
          >
            <StyledAccordion
              square
              expanded={active === index}
              onChange={() =>
                setActive((current) => (current === index ? -1 : index))
              }
            >
              <AccordionSummary
                expandIcon={<img src={Expand} alt={'Expand'} />}
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
                    {/* <RemoveButton onClick={() => deleteMsg(item)} /> */}
                    <RemoveButton onClick={() => {}} />
                  </div>
                  <div className="data-accordion-progress">
                    <ProgressBar value={item.percentage} />
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className={'data-accordion-content'}>
                  <pre>{JSON.stringify(item.msg, undefined, 2)}</pre>
                </div>
              </AccordionDetails>
            </StyledAccordion>
          </div>
        );
      })}
    </div>
  );
}
