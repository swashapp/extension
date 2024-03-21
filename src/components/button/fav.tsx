import { Checkbox } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';

export function FavButton(props: {
  enable: boolean;
  onClick: (e: MouseEvent) => void;
}): ReactElement {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setStatus(props.enable);
  }, [props.enable]);

  return (
    <Checkbox
      checked={status}
      onClick={(event) => {
        props.onClick(event);
        setStatus(!status);
      }}
      icon={<img src={'/static/images/shape/heart.png'} alt={'like'} />}
      checkedIcon={
        <img src={'/static/images/shape/heart-filled.png'} alt={'unlike'} />
      }
    />
  );
}
