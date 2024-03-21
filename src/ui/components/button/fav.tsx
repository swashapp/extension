import { Checkbox } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

export function FavButton(props: {
  enable: boolean;
  onClick: (e: boolean) => void;
}): ReactNode {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setStatus(props.enable);
  }, [props.enable]);

  return (
    <Checkbox
      checked={status}
      onClick={() => {
        props.onClick(!status);
        setStatus(!status);
      }}
      icon={<img src={'/static/images/shape/heart.png'} alt={'like'} />}
      checkedIcon={
        <img src={'/static/images/shape/heart-filled.png'} alt={'unlike'} />
      }
    />
  );
}
