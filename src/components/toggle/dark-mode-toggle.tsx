import React from 'react';

import { useColorScheme } from '../../hooks/use-color-scheme';
import { Switch } from '../switch/switch';

export const DarkModeToggle = () => {
  const { isDark, setIsDark } = useColorScheme();

  return (
    <div className={'absolute flex row center gap12 dark-theme-toggle'}>
      <img
        src={'/static/images/shape/sun.svg'}
        alt={'light'}
        className={!isDark ? `active` : ''}
      ></img>
      <Switch
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        checked={isDark}
        onChange={({ target }) => setIsDark(target.checked)}
      />
      <img
        src={'/static/images/shape/moon.svg'}
        alt={'dark'}
        className={isDark ? `active` : ''}
      ></img>
    </div>
  );
};
