import {
  createTheme,
  Switch as MuiSwitch,
  SwitchProps,
  ThemeProvider,
} from '@mui/material';
import React from 'react';

const theme = createTheme({
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 32,
          height: 20,
          padding: 0,
        },
        switchBase: {
          padding: 1,
          '&$checked': {
            transform: 'translateX(16px)',
            color: 'var(--white)',
            '& + $track': {
              backgroundColor: 'var(--gray)',
              opacity: 1,
              border: 'none',
            },
          },
          '&$focusVisible $thumb': {
            color: 'var(--gray)',
            border: '6px solid #fff',
          },
        },
        thumb: {
          width: 16,
          height: 16,
        },
        track: ({ theme }) => ({
          borderRadius: 9,
          backgroundColor: 'var(--light-green)',
          opacity: 1,
          transition: theme.transitions.create(['background-color', 'border']),
        }),
      },
    },
  },
});

export function Switch(props: SwitchProps): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <MuiSwitch {...props} />
    </ThemeProvider>
  );
}
