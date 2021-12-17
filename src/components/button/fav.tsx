import React from 'react';

export function FavButton(props: {
  onClick: (e: React.MouseEvent) => void;
}): JSX.Element {
  return <div onClick={props.onClick} className="fav-button" />;
}
