import React, { memo, useState } from 'react';

import DataAccordion, {
  DataItem,
} from '../components/data-accordion/data-accordion';
import BackgroundTheme from '../components/drawing/background-theme';
import NumericInput from '../components/numeric-input/numeric-input';
import TextMasking from '../components/text-masking/text-masking';

export default memo(function Data() {
  const [maskItems, setMaskItems] = useState<string[]>([]);
  const [dataItems, setDataItems] = useState<DataItem[]>([
    {
      percentage: 10,
      category: 'Search',
      currentTime: 2,
      link: '',
      msg: { a: 'asdf', b: 'asdfasd' },
      msgId: '1',
      title: 'behtarin',
    },
    {
      percentage: 10,
      category: 'Search',
      currentTime: 2,
      link: '',
      msg: { a: 'asdf', b: 'asdfasd' },
      msgId: '1',
      title: 'behtarin',
    },
  ]);
  const [delay, setDelay] = useState<number>(0);
  return (
    <div className="page-container">
      <BackgroundTheme layout="layout3" />
      <div className="page-content">
        <div className="page-header">
          <h2>Data</h2>
        </div>
        <div className="flex-column card-gap">
          <div className="simple-card">
            <h6>Text Masking</h6>
            <p>
              Swash doesn’t collect any sensitive data from you, like your name,
              email, or passwords. If you really want to be sure, you can hide
              certain sensitive words or numbers so they don’t get added to the
              Swash dataset.
            </p>
            <TextMasking items={maskItems} setItems={setMaskItems} />
          </div>
          <div className="simple-card">
            <h6>Your Data</h6>
            <p>
              The data collected as you browse is shown here before being added
              to the Swash dataset. If you want time to check the data before it
              gets uploaded, you can adjust the sending delay and delete
              anything that you don’t want to share.
            </p>
            <NumericInput
              label="Delay My Data By"
              value={delay}
              setValue={setDelay}
              unit={delay > 1 ? 'minutes' : 'minute'}
            />
            <DataAccordion
              items={dataItems}
              onRemove={(/*item: DataItem*/) => undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
