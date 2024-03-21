import {
  Children,
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import SwipeableViews from "react-swipeable-views";

import styles from "./multi-page-view.module.css";

export const MultiPageView = forwardRef(function MultiPageView(
  {
    children,
    onChange,
  }: { children: ReactNode; onChange?: (value: number) => void },
  ref,
) {
  const [active, setActive] = useState<number>(0);
  const pages = useMemo(() => Children.count(children), [children]);

  const next = useCallback(
    (page: number = 1) => {
      setActive((prev) => {
        const value = Math.min(prev + page, pages - 1);
        if (onChange) onChange(value);
        return value;
      });
    },
    [onChange, pages],
  );

  const back = useCallback(
    (page: number = 1) => {
      setActive((prev) => {
        const value = Math.max(prev - page, 0);
        if (onChange) onChange(value);
        return value;
      });
    },
    [onChange],
  );

  useImperativeHandle(ref, () => ({
    back,
    next,
  }));

  return (
    <SwipeableViews className={styles.container} index={active} disabled={true}>
      {Children.map(children, (child, index: number) =>
        active === index ? child : <></>,
      )}
    </SwipeableViews>
  );
});
