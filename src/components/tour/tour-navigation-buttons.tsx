import React, { useCallback, useContext } from 'react';

import { RouteToPages } from '../../paths';

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

  const onEnd = useCallback(() => {
    tour.stop();
    LocalStorageService.save(STORAGE_KEY.TOUR, { [props.tourName]: true });
    window.location.hash = RouteToPages.help;
  }, [tour, props.tourName]);

  const onBack = useCallback(() => {
    if (props.start) {
      tour.stop();
      window.location.hash = RouteToPages.help;
    } else {
      tour.back();
    }
  }, [props.start, tour]);

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
