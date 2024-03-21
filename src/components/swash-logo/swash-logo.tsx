import React, { ReactElement } from 'react';

import browser from 'webextension-polyfill';

import { useColorScheme } from '../../hooks/use-color-scheme';
import { WebsitePath } from '../../paths';
import { Link } from '../link/link';

import '../../static/css/components/swash-logo.css';

const lightLogo = '/static/images/logos/swash-dark.svg';
const darkLogo = '/static/images/logos/swash-white.svg';

export function SwashLogo(props: { className?: string }): ReactElement {
  const { isDark } = useColorScheme();
  const logo = isDark ? darkLogo : lightLogo;

  return (
    <div className={'flex align-center gap8'}>
      <Link
        url={WebsitePath}
        external
        className={props.className ? props.className : 'swash-logo'}
      >
        <img className={'swash-logo'} src={logo} alt={'Swash'} />
      </Link>
      <p className={'small bold swash-version'}>
        {browser.runtime.getManifest().version}.
      </p>
    </div>
  );
}
