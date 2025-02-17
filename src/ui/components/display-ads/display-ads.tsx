import { ReactNode, useEffect, useMemo, useState } from "react";

import { helper } from "@/helper";
import { WEBSITE_URLs } from "@/paths";
import { WaitingProgressBar } from "@/ui/components/progress/waiting-progress";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";

export function DisplayAds({
  width,
  height,
  divWidth,
  divHeight,
}: {
  width: number;
  height: number;
  divWidth?: number | string;
  divHeight?: number | string;
}): ReactNode {
  const { safeRun } = useErrorHandler();

  const [uuid, setUuid] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    safeRun(async () => {
      const { uuid } = await helper("ads").getAdSlot(width, height);
      setUuid(uuid);
    });
  }, [height, safeRun, width]);

  const iframeSrc = useMemo(() => {
    if (uuid) {
      const url = new URL(`${WEBSITE_URLs.adview}`);
      url.searchParams.set("id", uuid);
      url.searchParams.set("w", `${width}`);
      url.searchParams.set("h", `${height}`);
      return url.toString();
    }
  }, [height, width, uuid]);

  if (uuid === "") return null;
  else if (!uuid) return <WaitingProgressBar showText={false} />;

  return (
    <div className={"flex center"}>
      <iframe
        title={"Advertisement"}
        src={iframeSrc}
        scrolling={"no"}
        loading={"lazy"}
        style={{
          width: divWidth ?? width,
          height: divHeight ?? height,
          border: "none",
          overflow: "hidden",
          visibility: visible ? "visible" : "hidden",
          transition: "visibility 0.3s ease-in-out",
        }}
        onLoad={() => setVisible(true)}
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </div>
  );
}
