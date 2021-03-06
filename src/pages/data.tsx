import React, { useCallback, useEffect, useState } from 'react';

import {
  DataAccordion,
  DataItem,
} from '../components/data-accordion/data-accordion';
import { DATA_TOUR_CLASS } from '../components/data/data-tour';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { NumericInput } from '../components/numeric-input/numeric-input';
import { TextMasking } from '../components/text-masking/text-masking';
import { PrivacyData } from '../types/storage/privacy-data.type';

let delayOnLoad = 0;

export function Data(): JSX.Element {
  const [delay, setDelay] = useState<number>(0);
  const [maskItems, setMaskItems] = useState<string[] | null>(null);
  const [dataItems, setDataItems] = useState<DataItem[] | null>(null);

  const loadSettings = useCallback(() => {
    window.helper
      .load()
      .then(
        (db: {
          privacyData: { value: string }[];
          configs: { delay: string };
        }) => {
          const masks = db.privacyData;
          const newMasks = [];
          for (const x in masks) {
            newMasks.push(masks[x].value);
          }

          delayOnLoad = Number(db.configs.delay);
          setDelay(Number(db.configs.delay));
          setMaskItems(newMasks);
        },
      );
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    async function loader() {
      const retMessages = await window.helper.loadMessages();
      const db = await window.helper.load();
      const delay = db.configs.delay * 60000;
      const currentTime = Number(new Date().getTime());
      const messages = [];
      for (const msgId in retMessages) {
        let host = 'Undetermined';
        const msg = retMessages[msgId].message;
        let percentage = Math.round(
          ((currentTime - retMessages[msgId].createTime) * 100) / delay,
        );
        percentage = percentage > 100 ? 100 : percentage;
        try {
          host = new URL(msg.origin).host;
        } catch (err) {
          //do nothing
        }
        delete msg.origin;
        messages.push({
          percentage: percentage,
          currentTime: currentTime,
          msg: msg,
          msgId: retMessages[msgId].id,
          category: msg.header.category,
          // icon: (await window.helper.getCategory(msg.header.category)).icon,
          link: host,
          title: msg.header.module,
        });
      }
      setDataItems(messages);
    }
    loader().then();
    const interval = setInterval(loader, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (delay > 0 && delay !== delayOnLoad) {
      console.log(delay);
      window.helper.updateConfigs('delay', delay);
    }
  }, [delay]);

  useEffect(() => {
    if (maskItems) {
      const data: PrivacyData[] = [];
      maskItems.forEach((item) => {
        data.push({ value: item });
      });
      window.helper.savePrivacyData(data);
    }
  }, [maskItems]);

  const deleteMsg = useCallback((message) => {
    window.helper.cancelSending(message.msgId);
    setDataItems((items) =>
      (items || []).filter((msg) => msg.msgId !== message.msgId),
    );
  }, []);

  return (
    <div className="page-container">
      <BackgroundTheme layout="layout3" />
      <div className="page-content">
        <div className="page-header">
          <h2>Data</h2>
        </div>
        <div className="flex-column card-gap">
          <div className="simple-card">
            <h6>Text masking</h6>
            <p>
              Swash doesn???t collect any sensitive data from you, like your name,
              email, or passwords. If you really want to be sure, you can hide
              certain sensitive words or numbers so they don???t get added to the
              Swash dataset.
            </p>
            <TextMasking items={maskItems} setItems={setMaskItems} />
          </div>
          <div className="simple-card">
            <h6>Your data</h6>
            <p>
              The data collected as you browse is shown here before being added
              to the Swash dataset. If you want time to check the data before it
              gets uploaded, you can adjust the sending delay and delete
              anything that you don???t want to share.
            </p>
            <div className={DATA_TOUR_CLASS.DELAY_DATA}>
              <NumericInput
                label="Delay my data by"
                value={delay}
                setValue={setDelay}
                unit={delay > 1 ? 'minutes' : 'minute'}
              />
            </div>
            <DataAccordion items={dataItems || []} onRemove={deleteMsg} />
          </div>
        </div>
      </div>
    </div>
  );
}
