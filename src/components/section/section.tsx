import React from 'react';
import { Link } from 'react-router-dom';

const Done = '/static/images/shape/done.svg';
const RightArrowHead = '/static/images/shape/right-arrow-head.svg';

type SectionItem = {
  text: string;
  link: string;
  done: boolean;
};

export function Section(props: { items: SectionItem[] }): JSX.Element {
  return (
    <div className={'section-container'}>
      {props.items.map((item: SectionItem, index: number) => {
        return (
          <div key={'section-' + index} className={'section'}>
            <div className={'section-row'}>
              <Link to={item.link}>
                <div className={'section-link'}>
                  <p>{item.text}</p>
                  <img
                    src={item.done ? Done : RightArrowHead}
                    alt={item.done ? 'Done' : '>'}
                  />
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
