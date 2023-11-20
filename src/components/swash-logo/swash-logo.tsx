import React from 'react';

import browser from 'webextension-polyfill';

import { useColorScheme } from '../../hooks/use-color-scheme';
import { WebsitePath } from '../../paths';
import { Link } from '../link/link';

const lightLogo = '/static/images/logos/swash-dark.svg';
const darkLogo = '/static/images/logos/swash-white.svg';

export function SwashLogo(props: { className?: string }): JSX.Element {
  const { isDark } = useColorScheme();
  const logo = isDark ? darkLogo : lightLogo;

  return (
    <div className="flex-row swash-logo-container">
      <Link
        url={WebsitePath}
        external
        className={props.className ? props.className : 'swash-logo'}
      >
        <img className={'swash-logo'} src={logo} alt={'Swash'} />
      </Link>
      <div className="swash-version">
        {browser.runtime.getManifest().version}.
      </div>
    </div>
  );
}
