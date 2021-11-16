import React from 'react';

import browser from 'webextension-polyfill';

import { WebsitePath } from '../../paths';
import { Link } from '../link/link';

const logo = '/static/images/logos/swash-logo.svg';

export function SwashLogo(props: { className?: string }): JSX.Element {
  return (
    <div className="flex-row swash-logo">
      <Link url={WebsitePath} external>
        <img
          className={`swash-logo ${props.className}`}
          src={logo}
          alt={'Swash'}
        />
      </Link>
      <div className="swash-version">
        {browser.runtime.getManifest().version}.
      </div>
    </div>
  );
}
