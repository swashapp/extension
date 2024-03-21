import { ReactNode } from 'react';

import { WebsiteURLs } from '../../../paths';
import { getAppVersion } from '../../../utils/browser.util';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Link } from '../link/link';

import '../../../static/css/components/swash-logo.css';

const lightLogo = '/static/images/logos/swash-dark.svg';
const darkLogo = '/static/images/logos/swash-white.svg';

export function SwashLogo(props: { className?: string }): ReactNode {
  const { isDark } = useColorScheme();
  const logo = isDark ? darkLogo : lightLogo;

  return (
    <div className={'flex align-center gap8'}>
      <Link
        url={WebsiteURLs.home}
        external
        className={props.className ? props.className : 'swash-logo'}
      >
        <img className={'swash-logo'} src={logo} alt={'Swash'} />
      </Link>
      <p className={'small bold swash-version'}>{getAppVersion()}.</p>
    </div>
  );
}
