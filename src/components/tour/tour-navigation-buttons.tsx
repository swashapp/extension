import React, { useCallback, useContext, useEffect } from 'react';

import { SidenavContext } from '../../pages/app';

import {
  LocalStorageService,
  STORAGE_KEY,
} from '../../service/local-storage-service';
import { Button } from '../button/button';

import { TourContext } from './tour';

export function TourNavigationButtons(props: {
  tourName: string;
  start?: boolean;
  end?: boolean;
}): JSX.Element {
  const tour = useContext(TourContext);
  const sidenav = useContext(SidenavContext);

  const onEnd = useCallback(() => {
    tour.stop();
    LocalStorageService.save(STORAGE_KEY.TOUR, { [props.tourName]: true });
  }, [tour, props.tourName]);

  const onBack = useCallback(() => {
    if (props.start) {
      tour.stop();
    } else {
      tour.back();
    }
  }, [props.start, tour]);

  useEffect(() => {
    return () => {
      props.start && sidenav.setOpen(false);
    };
  }, [props.start, sidenav]);

  return (
    <div className="flex-row tour-nav-buttons">
      <div className="form-button">
        <Button color="secondary" text="Back" link={false} onClick={onBack} />
      </div>
      <div className="form-button">
        <Button
          color="primary"
          text={props.end ? 'End' : 'Next'}
          link={false}
          onClick={props.end ? onEnd : tour.next}
        />
      </div>
    </div>
  );
}
