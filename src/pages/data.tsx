import React, { useState } from 'react';
import BackgroundTheme from '../components/drawing/background-theme';
import TextMasking from '../components/text-masking/text-masking';
import NumericInput from '../components/numeric-input/numeric-input';
import DataAccordion, {
  DataItem,
} from '../components/data-accordion/data-accordion';

export default function Data() {
  const [maskItems, setMaskItems] = useState<string[]>([]);
  const [dataItem, setDataItem] = useState<DataItem[]>([]);
  const [delay, setDelay] = useState<number>(0);
  return (
    <div className="page-container data-container">
      <BackgroundTheme layout="layout3" />
      <div className="page-header">
        <h2>Data</h2>
      </div>
      <div className="flex-column gap32">
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
            The data collected as you browse is shown here before being added to
            the Swash dataset. If you want time to check the data before it gets
            uploaded, you can adjust the sending delay and delete anything that
            you don’t want to share.
          </p>
          <NumericInput
            label="Delay My Data By"
            value={delay}
            setValue={setDelay}
            unit={delay > 1 ? 'minutes' : 'minute'}
          />
          <DataAccordion items={dataItem} onRemove={(item: DataItem) => {}} />
        </div>
      </div>
    </div>
  );
}
