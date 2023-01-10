import React, { useCallback, useState } from 'react';

import { helper } from '../../core/webHelper';

export function Customisation(props: {
  onBackgroundChange: () => void;
}): JSX.Element {
  const setBackground = useCallback((background) => {
    helper.setBackground(background).then(() => {
      props.onBackgroundChange();
    });
  }, []);

  function backgrounds() {
    return (
      <div className={'bg-options'}>
        <div
          className={'bg-option'}
          onClick={() => {
            setBackground('unsplash');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(21, 30, 154)' }}
          onClick={() => {
            setBackground('rgb(21, 30, 154)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(33, 151, 249)' }}
          onClick={() => {
            setBackground('rgb(33, 151, 249)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(31, 195, 220)' }}
          onClick={() => {
            setBackground('rgb(31, 195, 220)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(8, 101, 130)' }}
          onClick={() => {
            setBackground('rgb(8, 101, 130)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(103, 212, 180)' }}
          onClick={() => {
            setBackground('rgb(103, 212, 180)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(7, 125, 90)' }}
          onClick={() => {
            setBackground('rgb(7, 125, 90)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(60, 121, 11)' }}
          onClick={() => {
            setBackground('rgb(60, 121, 11)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(175, 206, 87)' }}
          onClick={() => {
            setBackground('rgb(175, 206, 87)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(240, 203, 68)' }}
          onClick={() => {
            setBackground('rgb(240, 203, 68)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(242, 138, 41)' }}
          onClick={() => {
            setBackground('rgb(242, 138, 41)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(252, 121, 143)' }}
          onClick={() => {
            setBackground('rgb(252, 121, 143)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(193, 34, 110)' }}
          onClick={() => {
            setBackground('rgb(193, 34, 110)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(250, 181, 238)' }}
          onClick={() => {
            setBackground('rgb(250, 181, 238)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(192, 196, 255)' }}
          onClick={() => {
            setBackground('rgb(192, 196, 255)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(150, 119, 238)' }}
          onClick={() => {
            setBackground('rgb(150, 119, 238)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(84, 51, 176)' }}
          onClick={() => {
            setBackground('rgb(84, 51, 176)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(74, 0, 12)' }}
          onClick={() => {
            setBackground('rgb(74, 0, 12)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(91, 92, 99)' }}
          onClick={() => {
            setBackground('rgb(91, 92, 99)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(36, 36, 36)' }}
          onClick={() => {
            setBackground('rgb(36, 36, 36)');
          }}
        ></div>
        <div
          className={'bg-option'}
          style={{ background: 'rgb(0, 0, 0)' }}
          onClick={() => {
            setBackground('rgb(0, 0, 0)');
          }}
        ></div>
      </div>
    );
  }

  return (
    <>
      <div className="popup-title title">Customisation</div>
      <div className="popup-separator" />
      <div className="popup-content-row">
        <div className={'customisation-nav'}>
          <div className={'settings-option'}>Background</div>
        </div>
        <div className={'customisation-content'}>{backgrounds()}</div>
      </div>
    </>
  );
}
