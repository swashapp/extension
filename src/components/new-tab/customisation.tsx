import * as assert from 'assert';

import React, { useCallback, useState } from 'react';

import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { ToastMessage } from '../toast/toast-message';

const colorList = [
  'rgb(21, 30, 154)',
  'rgb(33, 151, 249)',
  'rgb(31, 195, 220)',
  'rgb(8, 101, 130)',
  'rgb(103, 212, 180)',
  'rgb(7, 125, 90)',
  'rgb(60, 121, 11)',
  'rgb(175, 206, 87)',
  'rgb(240, 203, 68)',
  'rgb(242, 138, 41)',
  'rgb(252, 121, 143)',
  'rgb(193, 34, 110)',
  'rgb(250, 181, 238)',
  'rgb(192, 196, 255)',
  'rgb(150, 119, 238)',
  'rgb(84, 51, 176)',
  'rgb(74, 0, 12)',
  'rgb(91, 92, 99)',
  'rgb(36, 36, 36)',
  'rgb(0, 0, 0)',
];

export function Customisation(props: {
  onBackgroundChange: () => void;
}): JSX.Element {
  const setBackground = useCallback(
    (background) => {
      helper.setBackground(background).then(() => {
        props.onBackgroundChange();
        toast(
          <ToastMessage
            type="success"
            content={<>Background changed successfully</>}
          />,
        );
      });
    },
    [props],
  );

  function backgrounds() {
    return (
      <div className={'bg-options'}>
        <div
          className={'bg-option'}
          style={{
            backgroundImage: 'url(/static/images/logos/unsplash.png)',
            backgroundSize: 'contain',
          }}
          onClick={() => {
            setBackground('unsplash');
          }}
        ></div>
        {colorList.map((color, index) => (
          <div
            key={`color-${index}`}
            className={'bg-option'}
            style={{ background: color }}
            onClick={() => {
              setBackground(color);
            }}
          ></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="popup-title title">Customisation</div>
      <div className="popup-separator" />
      <div className="popup-content-sidenav">
        <div className={'customisation-nav'}>
          <div className={'settings-option'}>Background</div>
        </div>
        <div className={'customisation-content'}>{backgrounds()}</div>
      </div>
    </>
  );
}
