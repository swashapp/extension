import CircularProgress from '../circular-progress/circular-progress';
import React from 'react';

export default function ImportingConfig() {
  return (
    <div className="on-boarding-progress-card">
      <CircularProgress type="uploading" />
      <h2>Importing configuration...</h2>
      <p>One second, we are importing your configuration.</p>
    </div>
  );
}
