import React, { useEffect, useMemo, useState } from 'react';

import { helper } from '../../core/webHelper';

const SWASH_DOMAIN = 'https://swashapp.io';
const SWASH_JOIN_PAGE = '/user/ads/view';

export function DisplayAds(props: {
  width: number;
  height: number;
  divWidth?: number | string;
  divHeight?: number | string;
  scale?: number;
}): JSX.Element {
  const { width, height, divWidth, divHeight, scale = 1 } = props;
  const [uuid, setUuid] = useState('');
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);

  useEffect(() => {
    helper.getAdsSlots(width, height).then((resp) => {
      setUuid(resp.uuid || '');
    });
  }, [height, width]);

  const iframeSrc = useMemo(() => {
    const url = new URL(`${SWASH_DOMAIN}${SWASH_JOIN_PAGE}`);
    url.searchParams.set('id', uuid);
    url.searchParams.set('w', `${width}`);
    url.searchParams.set('h', `${height}`);
    return url.toString();
  }, [height, width, uuid]);

  return (
    <>
      {uuid === '' ? (
        <></>
      ) : (
        <iframe
          seamless
          style={{
            visibility: !iframeVisible || uuid !== '' ? 'visible' : 'hidden',
            width: divWidth || width,
            height: divHeight || height,
            transform: `scale(${scale})`,
          }}
          onLoad={() => setIframeVisible(true)}
          title={'ads'}
          scrolling="no"
          frameBorder="no"
          src={iframeSrc}
        >
          <p>Your browser does not support iframe.</p>
        </iframe>
      )}
    </>
  );
}
