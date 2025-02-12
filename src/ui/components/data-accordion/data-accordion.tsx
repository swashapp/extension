import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { defaultStyles, JsonView } from "react-json-view-lite";

import { StreamCategory } from "@/enums/stream.enum";
import { Any } from "@/types/any.type";
import { Message, MessageRecord } from "@/types/message.type";
import { RemoveButton } from "@/ui/components/button/remove";
import { TimeProgressBar } from "@/ui/components/progress/time-progress";
import { Logger } from "@/utils/log.util";
import ExpandIcon from "~/images/icons/arrow-1.svg?react";

import "react-json-view-lite/dist/index.css";
import styles from "./data-accordion.module.css";

const Icons: Record<StreamCategory, string> = {
  [StreamCategory.SEARCH]: "/images/icons/streams/search.svg",
  [StreamCategory.GENERAL]: "/images/icons/streams/general.svg",
  [StreamCategory.SHOPPING]: "/images/icons/streams/shopping.svg",
  [StreamCategory.SOCIAL]: "/images/icons/streams/social.svg",
  [StreamCategory.MUSIC]: "/images/icons/streams/music.svg",
  [StreamCategory.NEWS]: "/images/icons/streams/news.svg",
  [StreamCategory.BEAUTY]: "/images/icons/streams/beauty.svg",
};

const StyledAccordion = styled(Accordion)(() => ({
  width: "100%",
  border: "none",
  boxShadow: "none",
  background: "transparent",
  borderRadius: "12px 12px 0 0",
  overflow: "hidden",
  "&.Mui-expanded": {
    background: "var(--data-accordion-color)",
    borderRadius: "12px",
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  flexDirection: "row-reverse",
  padding: "24px 26px 24px 20px",
  background: "var(--data-accordion-color)",
  "& .MuiAccordionSummary-content": {
    padding: 0,
    margin: 0,
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  margin: 0,
  padding: 24,
  overflow: "auto",
}));

export function DataAccordion({
  item,
  delay,
  removeMessage,
}: {
  item: MessageRecord;
  delay: number;
  removeMessage: (record: MessageRecord) => void;
}) {
  const [hide, setHide] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [host, setHost] = useState<string>("Undetermined");
  const [message, setMessage] = useState<Message>(item.message);

  useEffect(() => {
    const { origin, ...restMessage } = item.message;

    try {
      if (origin) setHost(new URL(origin).host);
    } catch (error) {
      Logger.error((error as Any)?.message);
    }
    setMessage(restMessage);
  }, [item.message]);

  const onEnd = useCallback(() => {
    setHide(true);
  }, []);

  return hide ? null : (
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
            <ExpandIcon className={clsx("rotate180", styles.expand)} />
          }
        >
          <div className={clsx("flex col", styles.summary)}>
            <div className="flex align-center justify-between">
              <div className="flex align-center gap16">
                <div className={styles.icon}>
                  <img
                    width={24}
                    height={24}
                    src={Icons[message.header.category]}
                    alt=""
                  />
                </div>
                <div className="flex col">
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
                onEnd={onEnd}
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
