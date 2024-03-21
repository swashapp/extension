import { createContext } from 'react';

export const SidenavContext = createContext<{
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}>({
  isOpen: false,
  setOpen: () => undefined,
});
