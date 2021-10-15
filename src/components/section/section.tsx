import React, { memo } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import Done from 'url:../../static/images/shape/done.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import RightArrowHead from 'url:../../static/images/shape/right-arrow-head.svg';

type SectionItem = {
  text: string;
  link: string;
  done: boolean;
};

export default memo(function Section(props: { items: SectionItem[] }) {
  return (
    <div className={'section-container'}>
      {props.items.map((item: SectionItem, index: number) => {
        return (
          <div key={'section-' + index} className={'section'}>
            <div className={'section-row'}>
              <a href={item.link}>
                <div className={'section-link'}>
                  <p>{item.text}</p>
                  <img
                    src={item.done ? Done : RightArrowHead}
                    alt={item.done ? 'Done' : '>'}
                  />
                </div>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
});
