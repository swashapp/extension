import { useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import createPersistedState from 'use-persisted-state';

const useColorSchemeState = createPersistedState('colorScheme');

export function useColorScheme() {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const [needOnBoarding, setNeedOnBoarding] = useState<boolean>(true);
  const [isDark, setIsDark] = useColorSchemeState();

  const value = useMemo(
    () =>
      needOnBoarding
        ? false
        : isDark === undefined
        ? !!systemPrefersDark
        : isDark,
    [isDark, needOnBoarding, systemPrefersDark],
  );

  useEffect(
    () =>
      window.helper.isNeededOnBoarding().then((_needOnBoarding: boolean) => {
        setNeedOnBoarding(_needOnBoarding);
      }),
    [],
  );

  useEffect(() => {
    if (value) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [value]);

  return {
    isDark: value,
    setIsDark,
  };
}
