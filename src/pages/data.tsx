import { Box, Tab, Tabs, TabsProps, styled } from '@mui/material';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  DataAccordion,
  DataItem,
} from '../components/data-accordion/data-accordion';
import { NumericInput } from '../components/numeric-input/numeric-input';
import { TextListManagement } from '../components/text-list-management/text-list-management';
import { helper } from '../core/webHelper';
import { PrivacyData } from '../types/storage/privacy-data.type';

let delayOnLoad = 0;

const StyledTabs = styled((props: TabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ sx: { display: 'none' } }} />
))({
  root: {
    color: 'var(--color-light-grey) !important',
  },
  '& .Mui-selected': {
    background: 'var(--color-white)',
    color: 'var(--color-black) !important',
    borderRadius: '12px 12px 0 0',
  },
});

function CustomTabPanel(
  props: PropsWithChildren<{
    index: number;
    value: number;
  }>,
) {
  const { children, value, index } = props;

  let style = {};
  if (index === 0) {
    style = {
      borderTopLeftRadius: 0,
    };
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box>
          <div className={'simple-card'} style={{ ...style }}>
            {children}
          </div>
        </Box>
      )}
    </div>
  );
}

export function Data(): JSX.Element {
  const [delay, setDelay] = useState<number>(0);
  const [dataItems, setDataItems] = useState<DataItem[] | null>(null);
  const [maskItems, setMaskItems] = useState<string[] | null>(null);
  const [excludeUrls, setExcludeUrls] = useState<string[] | null>(null);
  const [adExcludeUrls, setAdExcludeUrls] = useState<string[] | null>(null);

  const loadSettings = useCallback(() => {
    helper
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

    helper.getExcludeUrls().then(setExcludeUrls);
    helper.getPausedDisplayedAds().then(setAdExcludeUrls);
  }, [loadSettings]);

  useEffect(() => {
    async function loader() {
      const retMessages = await helper.loadMessages();
      const db = await helper.load();
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
          // icon: (await helper.getCategory(msg.header.category)).icon,
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
      helper.updateConfigs('delay', delay);
    }
  }, [delay]);

  useEffect(() => {
    if (maskItems) {
      const data: PrivacyData[] = [];
      maskItems.forEach((item) => {
        data.push({ value: item });
      });
      helper.savePrivacyData(data);
    }
  }, [maskItems]);

  const deleteMsg = useCallback((message) => {
    helper.cancelSending(message.msgId);
    setDataItems((items) =>
      (items || []).filter((msg) => msg.msgId !== message.msgId),
    );
  }, []);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (excludeUrls) helper.saveExcludeUrls(excludeUrls);
  }, [excludeUrls]);

  useEffect(() => {
    if (adExcludeUrls) helper.savePausedDisplayedAds(adExcludeUrls);
  }, [adExcludeUrls]);

  const urlTransformer = (url: string) => {
    try {
      const _url = new URL(url.startsWith('http') ? url : `https://${url}`);
      return `*://${_url.host}/*`;
    } catch (err) {
      return url;
    }
  };

  const urlValidator = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h2>Data & Ads Controls</h2>
        </div>
        <div className="flex-column card-gap">
          <div>
            <StyledTabs value={value} onChange={handleChange}>
              <Tab label="Your Data" className="data-tab" />
              <Tab label="Text Masking" className="data-tab" />
              <Tab label="Data domain exclusion" className="data-tab" />
              <Tab label="Ad display restriction" className="data-tab" />
            </StyledTabs>
            <CustomTabPanel value={value} index={0}>
              <p>
                The data collected as you browse is shown here before being
                added to the Swash dataset. If you want time to check the data
                before it gets uploaded, you can adjust the sending delay and
                delete anything that you don’t want to share.
              </p>
              <div>
                <NumericInput
                  label="Delay my data by"
                  value={delay}
                  setValue={setDelay}
                  unit={delay > 1 ? 'minutes' : 'minute'}
                />
              </div>
              <DataAccordion items={dataItems || []} onRemove={deleteMsg} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <p>
                Swash doesn’t collect any sensitive data from you, like your
                name, email, or passwords. If you really want to be sure, you
                can hide certain sensitive words or numbers so they don’t get
                added to the Swash dataset.
              </p>
              <TextListManagement
                items={maskItems}
                setItems={setMaskItems}
                placeholder={'Mask It'}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <p>
                Swash doesn’t collect any sensitive data from you, like your
                name, email, or passwords. If you really want to be sure, you
                can hide certain sensitive words or numbers so they don’t get
                added to the Swash dataset.
              </p>
              <TextListManagement
                items={excludeUrls}
                setItems={setExcludeUrls}
                placeholder={'Domain To Exclude'}
                transformer={urlTransformer}
                validator={urlValidator}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <p>
                If you’ve ever closed a Swash Ad by clicking ‘Forever on this
                site’, those excluded sites will be listed here. To enable ads
                on those sites again, simply click ‘Undo’ to remove them from
                your excluded domains list.
              </p>
              <TextListManagement
                items={adExcludeUrls}
                setItems={setAdExcludeUrls}
                placeholder={'Domain To Exclude From Ads'}
                transformer={urlTransformer}
                validator={urlValidator}
              />
            </CustomTabPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
