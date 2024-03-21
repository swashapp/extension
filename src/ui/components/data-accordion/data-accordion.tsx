import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { withStyles } from "@mui/styles";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { defaultStyles, JsonView } from "react-json-view-lite";

import { StreamCategory } from "@/enums/stream.enum";
import { Any } from "@/types/any.type";
import { Message, MessageRecord } from "@/types/message.type";

import { RemoveButton } from "../button/remove";
import { TimeProgressBar } from "../progress/time-progress";

import "react-json-view-lite/dist/index.css";
import styles from "./data.module.css";

const Icons: Record<StreamCategory, string> = {
  [StreamCategory.SEARCH]: "/images/icons/search-category.svg",
  [StreamCategory.GENERAL]: "/images/icons/general-category.svg",
  [StreamCategory.SHOPPING]: "/images/icons/shopping-category.svg",
  [StreamCategory.SOCIAL]: "/images/icons/social-category.svg",
  [StreamCategory.MUSIC]: "/images/icons/music-category.svg",
  [StreamCategory.NEWS]: "/images/icons/news-category.svg",
  [StreamCategory.BEAUTY]: "/images/icons/beauty-category.svg",
};

const StyledAccordion = withStyles({
  root: {
    width: "100%",
    border: "none",
    boxShadow: "none",
    background: "transparent",
    borderRadius: "12px 12px 0 0",
    overflow: "hidden",
  },
  expanded: {
    background: "var(--data-accordion-color)",
    borderRadius: "12px",
  },
})(Accordion);

const StyledAccordionSummary = withStyles({
  root: {
    flexDirection: "row-reverse",
    padding: "24px 26px 24px 20px",
    background: "var(--data-accordion-color)",
    "&$expanded": {},
  },
  content: {
    padding: 0,
    margin: 0,
    "&$expanded": {
      padding: 0,
      margin: 0,
    },
  },
  expanded: {},
})(AccordionSummary);

const StyledAccordionDetails = withStyles(() => ({
  root: {
    margin: 0,
    padding: 24,
    overflow: "auto",
  },
}))(AccordionDetails);

export function DataAccordion({
  item,
  delay,
  removeMessage,
}: {
  item: MessageRecord;
  delay: number;
  removeMessage: (record: MessageRecord) => void;
}) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [host, setHost] = useState<string>("Undetermined");
  const [message, setMessage] = useState<Message>(item.message);

  useEffect(() => {
    const { origin, ...restMessage } = item.message;

    try {
      if (origin) setHost(new URL(origin).host);
    } catch (err) {
      console.error((err as Any)?.message);
    }
    setMessage(restMessage);
  }, [item.message]);

  return (
    <div key={`item-${item.id}`} className={styles.container}>
      <StyledAccordion
        square
        expanded={expanded}
        onChange={(_, expanded) => {
          setExpanded(expanded);
        }}
      >
        <StyledAccordionSummary
          expandIcon={
            <img
              className={styles.icon}
              src={"/images/shape/expand.svg"}
              alt={"Expand"}
            />
          }
        >
          <div className={clsx("flex col", styles.summary)}>
            <div className={"flex align-center justify-between"}>
              <div className={"flex align-center"}>
                <div className={styles.icon}>
                  <img
                    width={24}
                    height={24}
                    src={Icons[message.header.category]}
                    alt={""}
                  />
                </div>
                <div className={"flex col"}>
                  <p>{host}</p>
                  <p
                    className={clsx("flex align-center smaller", styles.title)}
                  >
                    {message.header.module}
                  </p>
                </div>
              </div>
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  removeMessage(item);
                }}
              />
            </div>
            <div className={styles.progress}>
              <TimeProgressBar
                start={item.timestamp}
                end={item.timestamp + delay}
              />
            </div>
          </div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <JsonView
            data={message}
            style={{
              ...defaultStyles,
              container: styles.content,
            }}
            shouldExpandNode={(level) => level < 2}
            clickToExpandNode
          />
        </StyledAccordionDetails>
      </StyledAccordion>
    </div>
  );
}
