import clsx from "clsx";
import { ReactNode, useCallback, useEffect, useState } from "react";

import { helper } from "@/helper";
import { AdsType } from "@/types/ads.type";
import { AdsPreferences } from "@/types/storage/preferences.type";
import { PageHeader } from "@/ui/components/page-header/page-header";
import { Switch } from "@/ui/components/switch/switch";

import styles from "./earn-from-ads.module.css";

export function EarnFromAds(): ReactNode {
  const [ads, setAds] = useState<AdsType>({
    fullscreen: false,
    notification: false,
    integrated: false,
  });

  const updateValues = useCallback(async () => {
    const { status } = (await helper("preferences").get(
      "ads",
    )) as AdsPreferences;
    setAds(status);
  }, []);

  const onToggleClick = useCallback(
    async (name: keyof AdsType, value: boolean) => {
      await helper("preferences").setAdsStatus({ ...ads, [name]: value });
      await updateValues();
    },
    [ads, updateValues],
  );

  useEffect(() => {
    updateValues();
  }, [updateValues]);

  return (
    <>
      <PageHeader header={"Earn More"} />
      <div className={clsx("flex gap32", styles.container)}>
        <div className={"round flex col col-17 bg-white card28"}>
          <div className={"flex col gap32"}>
            <div className={"flex col gap16"}>
              <p className={"subHeader2"}>Get the full page experience</p>
              <p>Ready to unlock the full potential of your browser?</p>
            </div>
            <p>
              With the Swash full page new tab, you can not-only earn from full
              page ads, you can also customise your view to include your taste.
              Widgets, jokes, gifs, and more coming soon.
              <br />
              <br />
              Plus, soon you will be able to check out the latest news by
              scrolling down the Swash News section. You can always tailor your
              preferences in your new tab settings.
            </p>
            <img
              src={"/images/misc/new-tab.webp"}
              alt={"New Tab Experience"}
              className={styles.image}
            />
          </div>
        </div>
        <div className={"round flex col col-10 gap32 bg-white card28"}>
          <div className={"flex col gap32"}>
            <p className={"subHeader2"}>Swash Ads</p>
            <p>
              Earn even more with Swash by opting-in to receive Swash Ads on
              your favourite browser. You see ads and get paid as a thank you
              for your attention.
            </p>
          </div>
          <div className={"flex col gap24"}>
            <p className={"bold"}>
              Opt-in with the toggles below to get paid for seeing Swash ads:
            </p>
            <div className={"flex col gap24"}>
              <div className={"flex row align-center gap16"}>
                <Switch
                  checked={ads.fullscreen}
                  onChange={(e) =>
                    onToggleClick("fullscreen", e.target.checked)
                  }
                />
                <p>Receive full page ads when opening a new tab</p>
              </div>
              <div className={"flex row align-center gap16"}>
                <Switch
                  checked={ads.notification}
                  onChange={(e) =>
                    onToggleClick("notification", e.target.checked)
                  }
                />
                <p>Receive ads as push notifications</p>
              </div>
              <div className={"flex row align-center gap16"}>
                <Switch
                  checked={ads.integrated}
                  onChange={(e) =>
                    onToggleClick("integrated", e.target.checked)
                  }
                />
                <p>Receive integrated display ads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
