import { useColorScheme } from '../../hooks/use-color-scheme';
import { Switch } from '../switch/switch';

export const DarkModeToggle = () => {
  const { isDark, setIsDark } = useColorScheme();

  return (
    <div className={'flex row center gap12 dark-theme-toggle'}>
      <img
        src={'/static/images/shape/sun.svg'}
        alt={'light'}
        className={!isDark ? `active` : ''}
      ></img>
      <Switch
        checked={!!isDark}
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
