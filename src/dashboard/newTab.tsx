import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import '../static/css/main.css';
import '../static/css/laptop.css';
import '../static/css/tablet.css';
import '../static/css/mobile.css';
import '../static/css/smobile.css';
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';

import { helper } from '../core/webHelper';
import App from '../pages/app';

declare global {
  interface Window {
    helper: any;
  }
}
window.helper = helper;

function NewTab(): JSX.Element {
  const [address, setAddress] = React.useState('');

  useEffect(() => {
    helper
      .getWalletAddress()
      .then((address: string) => {
        setAddress(address);
        console.log('address', address);
      })
      .catch((err: any) => {
        console.log('error', err);
        setAddress('');
      });
  }, []);

  return (
    <>
      <div style={{ overflow: 'hidden' }}>
        Swash, Reimagining data ownership
      </div>
      <div
        id="newTab_ads"
        className="swash-inpage-ads"
        style={{ position: 'fixed', bottom: 0, right: 0 }}
      >
        <div
          className="c25b4ef591762a17"
          data-zone="n1"
          data-pay-to={`eth:${address}`}
          data-page="website"
          style={{
            width: 300,
            height: 100,
            display: 'inline-block',
            margin: '0 auto',
          }}
        />
        <div
          className="c25b4ef591762a17"
          data-zone="n2"
          data-pay-to={`eth:${address}`}
          data-page="website"
          style={{
            width: 728,
            height: 90,
            display: 'inline-block',
            margin: '0 auto',
          }}
        />
      </div>
    </>
  );
}

ReactDOM.render(<NewTab />, document.getElementById('newTab'));
