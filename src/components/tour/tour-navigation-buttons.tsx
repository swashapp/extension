import React, { useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { RouteToPages } from '../../paths';

import {
  LocalStorageService,
  STORAGE_KEY,
} from '../../service/local-storage-service';

import Button from '../button/button';

import { TourContext } from './tour';

export default function TourNavigationButtons(props: {
  tourName: string;
  start?: boolean;
  end?: boolean;
}): JSX.Element {
  const tour = useContext(TourContext);
  const history = useHistory();
  const onEnd = useCallback(() => {
    tour.stop();
    LocalStorageService.save(STORAGE_KEY.TOUR, { [props.tourName]: true });
    history.push(RouteToPages.help);
  }, [history, tour, props.tourName]);
  return (
    <div className="flex-row tour-nav-buttons">
      <div className="form-button">
        <Button
          color="secondary"
          text="Back"
          link={false}
          disabled={props.start}
          onClick={tour.back}
        />
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
