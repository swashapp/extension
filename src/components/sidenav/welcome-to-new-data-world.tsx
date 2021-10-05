import ClosablePanel from '../closable-panel/closable-panel';
import Circle from '../drawing/circle';
import React, { memo } from 'react';

import LearnMore from '../button/learn-more';

export default memo(function WelcomeToNewDataWorld() {
  return (
    <ClosablePanel className={'welcome-container'}>
      <div className="welcome-text">
        <h5>Welcome to a new world of data.</h5>
      </div>
      <Circle className={'welcome-circle1'} border={'black'} />
      <Circle className={'welcome-circle2'} color={'black'} />
      <Circle className={'welcome-circle3'} border={'black'} />
      <LearnMore position="Sidenav" />
    </ClosablePanel>
  );
});
