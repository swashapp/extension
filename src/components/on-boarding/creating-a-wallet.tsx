import CircularProgress from '../circular-progress/circular-progress';
import React from 'react';

export default function CreatingAWallet() {
  return (
    <div className="on-boarding-progress-card">
      <CircularProgress type="loading" />
      <h2>Creating a wallet...</h2>
      <p>One second, we are creating for you a new wallet.</p>
    </div>
  );
}
