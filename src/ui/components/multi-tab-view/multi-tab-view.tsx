import { Tab, Tabs as MuiTabs, styled } from "@mui/material";
import clsx from "clsx";
import { ReactNode, useEffect, useRef, useState } from "react";

import styles from "./multi-tab-view.module.css";

const AnimatedTabs = styled(MuiTabs)({
  position: "relative",
  "& .MuiTabs-flexContainer": {
    "& .Mui-selected": {
      color: "unset",
    },
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
});

function TabPanel({
  children,
  index,
  value,
}: {
  children?: ReactNode;
  index: number;
  value: number;
}) {
  return (
    <div
      role={"tabpanel"}
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {children}
    </div>
  );
}

export function MultiTabView({
  tabs,
  action,
  onTabChange,
}: {
  tabs: { label: ReactNode; content: ReactNode }[];
  action?: ReactNode;
  onTabChange?: (index: number) => void;
}) {
  const tabsRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    width: number;
    transform: string;
  }>({
    width: 0,
    transform: "translateX(0px)",
  });

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const coloredIndex = hoveredIndex !== null ? hoveredIndex : active;

  useEffect(() => {
    const updateIndicator = () => {
      if (tabsRef.current) {
        const tabElements = tabsRef.current.querySelectorAll(".MuiTab-root");
        const activeTab = tabElements[coloredIndex] as HTMLElement;
        if (activeTab) {
          setIndicatorStyle({
            width: activeTab.offsetWidth,
            transform: `translateX(${activeTab.offsetLeft}px)`,
          });
        }
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [coloredIndex]);

  return (
    <div className={"flex col gap32"}>
      <div className={clsx("flex align-center justify-between", styles.header)}>
        <AnimatedTabs
          className={styles.container}
          value={active}
          aria-label={"tabs"}
          ref={tabsRef}
        >
          <div
            style={{
              position: "absolute",
              height: "100%",
              backgroundColor: "var(--color-purple)",
              borderRadius: 100,
              opacity: 0.5,
              bottom: 0,
              left: 0,
              transition: "all 0.5s ease",
              ...indicatorStyle,
            }}
          />
          {tabs.map((tab, index) => (
            <Tab
              className={clsx("relative", styles.item, {
                [styles.selected]: index === coloredIndex,
              })}
              key={index}
              label={tab.label}
              id={`tab-${index}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                setActive(index);
                if (onTabChange) onTabChange(index);
              }}
              sx={{
                backgroundColor:
                  hoveredIndex === index
                    ? "var(--color-dark-purple)"
                    : "transparent",
              }}
            />
          ))}
        </AnimatedTabs>
        {action}
      </div>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={active} index={index}>
          {index === active ? tab.content : null}
        </TabPanel>
      ))}
    </div>
  );
}
