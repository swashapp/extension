import clsx from "clsx";
import { ReactNode, useMemo, useState } from "react";

import { NewTabDateTime, NewTabSearchEngine } from "@/types/new-tab.type";
import { MultiTabView } from "@/ui/components/multi-tab-view/multi-tab-view";
import { Switch } from "@/ui/components/switch/switch";
import { NewTabColors } from "@/ui/data/new-tab-colors";
import { SearchEngines } from "@/ui/data/search-engines";

import styles from "./customization.module.css";

export function Customization({
  datetime,
  onBackgroundChange,
  onSearchEngineChange,
  onDateTimeChange,
}: {
  datetime?: NewTabDateTime;
  onBackgroundChange: (background: string) => void;
  onSearchEngineChange: (searchEngine: NewTabSearchEngine) => void;
  onDateTimeChange: (datetime: NewTabDateTime) => void;
}): ReactNode {
  const [time, setTime] = useState<NewTabDateTime>(
    datetime || {
      h24: true,
      seconds: true,
    },
  );

  const tabs = useMemo(
    () => [
      {
        label: "Background",
        content: (
          <div
            className={clsx("flex wrap justify-center gap12", styles.content)}
          >
            <div
              className={clsx("flex center no-overflow pointer", styles.color)}
              onClick={() => {
                onBackgroundChange("unsplash");
              }}
            >
              <img src={"/images/logos/unsplash.png"} alt={"unsplash logo"} />
            </div>
            {NewTabColors.map((color, index) => (
              <div
                key={`color-${index}`}
                className={`no-overflow pointer ${styles.color}`}
                style={{ background: color }}
                onClick={() => {
                  onBackgroundChange(color);
                }}
              />
            ))}
          </div>
        ),
      },
      {
        label: "Search Engine",
        content: (
          <div
            className={clsx("flex wrap justify-center gap12", styles.content)}
          >
            {SearchEngines.map((search, index) => (
              <div
                key={`search-${index}`}
                className={clsx(
                  "flex center no-overflow pointer",
                  styles.searchEngine,
                )}
                onClick={() => {
                  onSearchEngineChange(search);
                }}
              >
                <img src={search.logo} alt={"search logo"} />
              </div>
            ))}
          </div>
        ),
      },
      {
        label: "Date & Time",
        content: (
          <div className={clsx("flex col gap20", styles.content)}>
            <div className={"flex align-center gap12"}>
              <Switch
                checked={time.h24}
                onChange={(e) => {
                  setTime((prev) => {
                    const res = { ...prev, h24: e.target.checked };
                    onDateTimeChange(res);
                    return res;
                  });
                }}
              />
              Show the 24 hour clock
            </div>
            <div className={"flex align-center gap12"}>
              <Switch
                checked={time.seconds}
                onChange={(e) => {
                  setTime((prev) => {
                    const res = { ...prev, seconds: e.target.checked };
                    onDateTimeChange(res);
                    return res;
                  });
                }}
              />
              Show Seconds
            </div>
          </div>
        ),
      },
    ],
    [onBackgroundChange, onDateTimeChange, onSearchEngineChange, time],
  );

  return (
    <div className={clsx("flex col gap24", styles.container)}>
      <h6>Customisation</h6>
      <MultiTabView tabs={tabs}></MultiTabView>
    </div>
  );
}
