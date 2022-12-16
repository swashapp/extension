import React from 'react';

export default function NewTab(): JSX.Element {
  return (
    <>
      <div style={{ overflow: 'hidden' }}>
        Swash, Reimagining data ownership
      </div>
      <div
        id="newTab_ads"
        className="swash-inpage-ads"
        style={{ position: 'fixed', bottom: 0, right: 0 }}
      ></div>
    </>
  );
}
