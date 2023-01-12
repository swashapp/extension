import React, { useEffect, useMemo, useState } from 'react';

import { helper } from '../../core/webHelper';

const SWASH_DOMAIN = 'https://swashapp.io';
const SWASH_JOIN_PAGE = '/user/ads/view';

export function DisplayAds(props: {
  width: number;
  height: number;
}): JSX.Element {
  const [uuid, setUuid] = useState('');
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);

  useEffect(() => {
    helper.getAdsSlots(`${props.width}`, `${props.height}`).then((resp) => {
      setUuid(resp.uuid);
      console.log(resp);
    });
  }, [props.height, props.width]);

  const iframeSrc = useMemo(() => {
    console.log(uuid);
    return `${SWASH_DOMAIN}${SWASH_JOIN_PAGE}?id=${uuid}&w=${props.width}&h=${props.height}`;
  }, [props.height, props.width, uuid]);

  return (
    <>
      {uuid === '' ? (
        <></>
      ) : (
        <iframe
          seamless
          style={{
            visibility: !iframeVisible || uuid !== '' ? 'visible' : 'hidden',
            width: props.width,
            height: props.height,
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
