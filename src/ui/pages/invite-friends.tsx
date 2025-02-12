import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";

import { ButtonColors } from "@/enums/button.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { SUPPORT_URLS, WEBSITE_URLs } from "@/paths";
import { ReferralLinkRes, ReferralSummaryRes } from "@/types/api/referral.type";
import { MultiPageRef } from "@/types/ui.type";
import { Button } from "@/ui/components/button/button";
import { Checkbox } from "@/ui/components/checkbox/checkbox";
import { IconButton } from "@/ui/components/icon-button/icon-button";
import { CopyEndAdornment } from "@/ui/components/input/end-adornments/copy-end-adornment";
import { Input } from "@/ui/components/input/input";
import { Label } from "@/ui/components/label/label";
import { MultiPageView } from "@/ui/components/multi-page-view/multi-page-view";
import { MultiTabView } from "@/ui/components/multi-tab-view/multi-tab-view";
import { NumericSection } from "@/ui/components/numeric-section/numeric-section";
import { PageHeader } from "@/ui/components/page-header/page-header";
import { showPopup } from "@/ui/components/popup/popup";
import { PunchedBox } from "@/ui/components/punched-box/punched-box";
import { toastMessage } from "@/ui/components/toast/toast-message";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import { BalanceInitValue, purgeNumber } from "@/utils/string.util";
import NextIcon from "~/images/icons/arrow-1.svg?react";
import CalendarIcon from "~/images/icons/calendar.svg?react";
import ClockIcon from "~/images/icons/clock.svg?react";
import MoneyIcon from "~/images/icons/money.svg?react";

import styles from "./invite-friends.module.css";

const referralMessage = "Use my referral link to earn as you surf with Swash:";

const CustomSlider = styled(Slider)(() => ({
  color: "var(--color-black)",
  height: 8,
  "& .MuiSlider-thumb": {
    height: 32,
    width: 32,
    marginLeft: 7,
    backgroundColor: "var(--color-white)",
    border: "4px solid currentColor",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "inherit",
    },
  },
  "& .MuiSlider-valueLabel": {
    left: "calc(-50% + 4px)",
  },
  "& .MuiSlider-track": {
    height: 4,
    borderRadius: 4,
  },
  "& .MuiSlider-rail": {
    backgroundColor: "var(--color-light-grey)",
    height: 4,
    borderRadius: 4,
  },
  "& .MuiSlider-mark": {
    backgroundColor: "var(--color-light-grey)",
    borderRadius: "100%",
    height: 16,
    width: 16,
  },
  "& .MuiSlider-markActive": {
    opacity: 1,
    backgroundColor: "currentColor",
  },
}));

function ReferralLinksTable({
  links,
  onAddClick,
  onDefaultChange,
}: {
  links: ReferralLinkRes[];
  onAddClick: () => void;
  onDefaultChange: (link: ReferralLinkRes) => void;
}) {
  return (
    <div key={`link-list`} className={clsx("flex col gap24", styles.referrals)}>
      <h6>Select referral</h6>
      <div className={"flex col gap40"}>
        <div
          className={clsx("flex align-center justify-between", styles.header)}
        >
          <p>
            Remaining number of promotional links to be created:{" "}
            <span className={"bold"}>{5 - links.length}</span>
          </p>
          <Button text={"Add new referral"} onClick={onAddClick} />
        </div>
        <table className={styles.links}>
          <thead>
            <tr>
              <th>
                <p className={"bold"}>Title</p>
              </th>
              <th>
                <p className={"bold"}>Your % / Referee&apos;s %</p>
              </th>
              <th>
                <p className={"bold"}>Friends</p>
              </th>
              <th>
                <p className={"bold"}>Code</p>
              </th>
              <th>
                <p className={"bold"}>Action</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {links.map((row, index) => (
              <tr key={index}>
                <td>
                  <p>{row.title}</p>
                </td>
                <td>
                  <p>{`${row.referral_share} / ${100 - row.referral_share}`}</p>
                </td>
                <td>
                  <p>{row.registrations}</p>
                </td>
                <td>
                  <p>{row.code}</p>
                </td>
                <td className={"flex gap24 justify-end"}>
                  <p
                    hidden={row.is_default}
                    className={"bold pointer"}
                    onClick={() => {
                      onDefaultChange(row);
                    }}
                  >
                    Set as default
                  </p>
                  <CopyToClipboard
                    text={`${WEBSITE_URLs.download}?referral_code=${row.code}`}
                  >
                    <p
                      className={"bold pointer"}
                      onClick={() =>
                        toastMessage(
                          "success",
                          SystemMessage.SUCCESSFULLY_COPIED,
                        )
                      }
                    >
                      Copy link
                    </p>
                  </CopyToClipboard>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={clsx("flex row wrap gap20", styles.content)}>
          {links.map((row, index) => (
            <div className={clsx("flex col gap24", styles.box)} key={index}>
              <div className={"flex align-center justify-between"}>
                <p className={"large bold"}>{row.title}</p>
              </div>
              <div className={"flex col gap12"}>
                <div className={"flex align-center justify-between"}>
                  <p className={"bold"}>Code</p>
                  <p>{row.code}</p>
                </div>
                <div className={"flex align-center justify-between"}>
                  <p className={"bold"}>
                    You receive/
                    <br />
                    Your referee
                  </p>
                  <p>{`${row.referral_share} / ${100 - row.referral_share}`}</p>
                </div>
                <div className={"flex align-center justify-between"}>
                  <p className={"bold"}>Friends</p>
                  <p>{row.registrations}</p>
                </div>
              </div>
              <div className={"flex gap12 center"}>
                <Button
                  text={"Set as default"}
                  color={ButtonColors.TERTIARY}
                  disabled={row.is_default}
                  className={"bold pointer full-width-button"}
                  onClick={() => {
                    onDefaultChange(row);
                  }}
                />
                <CopyToClipboard
                  text={`${WEBSITE_URLs.download}?referral_code=${row.code}`}
                >
                  <Button
                    text={"Copy link"}
                    className={"bold pointer full-width-button"}
                    color={ButtonColors.TERTIARY}
                    onClick={() =>
                      toastMessage("success", SystemMessage.SUCCESSFULLY_COPIED)
                    }
                  />
                </CopyToClipboard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddReferralLink({
  loading,
  onBack,
  onSubmit,
}: {
  loading: boolean;
  onBack: () => void;
  onSubmit: (title: string, percentage: number, isDefault: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [percentage, setPercentage] = useState(20);
  const [isDefault, setIsDefault] = useState(false);

  return (
    <div key={"add-referral"} className={clsx("flex col gap40", styles.add)}>
      <div className={"flex col gap24"}>
        <h6>Add new referral</h6>
        <p>
          Your referral percentage:{" "}
          <span className={"bold"}>{percentage}%</span>
        </p>
      </div>
      <Input
        label={"What would you like to call this link?"}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
      />
      <div className={"flex col gap16 no-overflow"}>
        <Label text={"Set your sharing percentage"} id={"percentage-slider"}>
          <CustomSlider
            className={styles.slider}
            value={percentage}
            onChange={(_, value) => {
              setPercentage(Array.isArray(value) ? value[0] : value);
            }}
            step={10}
            marks
            min={20}
            max={100}
          />
        </Label>
        <div className={"flex align-center justify-between"}>
          <p>Mine: {percentage}%</p>
          <p>My referee: {100 - percentage}%</p>
        </div>
      </div>
      <div className={"flex align-center gap12"}>
        <Checkbox
          checked={isDefault}
          onChange={(event) => {
            setIsDefault(event.target.checked);
          }}
          label={<p>Set as default referral</p>}
        />
      </div>
      <div className={"flex justify-end gap12"}>
        <Button text={"Back"} color={ButtonColors.SECONDARY} onClick={onBack} />
        <Button
          text={"Save"}
          loading={loading}
          onClick={() => {
            onSubmit(title, percentage, isDefault);
          }}
        />
      </div>
    </div>
  );
}

function ReferralLinks({ onDefaultChange }: { onDefaultChange: () => void }) {
  const ref = useRef<MultiPageRef>();
  const { safeRun } = useErrorHandler();

  const [loading, setLoading] = useState<boolean>(false);
  const [links, setLinks] = useState<ReferralLinkRes[]>([]);

  const updateDefaultLink = useCallback(
    (link: ReferralLinkRes) => {
      setLinks((prev) =>
        prev.map((row) => ({
          ...row,
          is_default: row.id === link.id,
        })),
      );
      onDefaultChange();
    },
    [onDefaultChange],
  );

  useEffect(() => {
    safeRun(async () => {
      const links = await helper("user").getReferralLinks();
      setLinks(links);
    }).then();
  }, [safeRun]);

  return (
    <MultiPageView ref={ref}>
      <ReferralLinksTable
        links={links}
        onAddClick={() => {
          ref.current?.next();
        }}
        onDefaultChange={async (link: ReferralLinkRes) => {
          await safeRun(
            async () => {
              setLoading(true);
              await helper("user").setDefaultReferralLink(link.id);
              updateDefaultLink(link);
              toastMessage(
                "success",
                SystemMessage.SUCCESSFULLY_ADDED_REFERRAL_LINK,
              );
            },
            {
              finally: () => {
                setLoading(false);
              },
            },
          );
        }}
      />
      <AddReferralLink
        loading={loading}
        onBack={() => {
          ref.current?.back();
        }}
        onSubmit={async (
          title: string,
          percentage: number,
          isDefault: boolean,
        ) => {
          await safeRun(
            async () => {
              setLoading(true);
              const link = await helper("user").addReferralLink(
                title,
                percentage,
                isDefault,
              );
              setLinks((prev) => [...prev, link]);
              if (isDefault) updateDefaultLink(link);
              toastMessage(
                "success",
                SystemMessage.SUCCESSFULLY_ADDED_REFERRAL_LINK,
              );
            },
            {
              finally: () => {
                setLoading(false);
              },
            },
          );
          ref.current?.back();
        }}
      />
    </MultiPageView>
  );
}

function ReferralShare(props: { progress: number }) {
  return (
    <div className={styles.progress}>
      <div className={styles.bar} style={{ width: `${props.progress}%` }}></div>
    </div>
  );
}

export function InviteFriends(): ReactNode {
  const { safeRun } = useErrorHandler();

  const [tab, setTab] = useState<number>(0);
  const [rewards, setRewards] = useState<string>(BalanceInitValue);
  const [summary, setSummary] = useState<ReferralSummaryRes>({
    registrations: 0,
  });

  const updateSummary = useCallback(async () => {
    await safeRun(async () => {
      const summary = await helper("user").getReferralSummary();
      setSummary(summary);
    });
  }, [safeRun]);

  useEffect(() => {
    updateSummary().then();

    safeRun(async () => {
      const { reward } = await helper("payment").getReferralReward();
      setRewards(reward);
    }).then();
  }, [safeRun, updateSummary]);

  const defaultLink = useMemo(
    () =>
      summary.default_link?.code
        ? `${WEBSITE_URLs.download}?referral_code=${summary.default_link?.code}`
        : "",
    [summary.default_link?.code],
  );

  const tabs = useMemo(() => {
    return [
      {
        label: (
          <div className={"flex row gap4 center"}>
            <MoneyIcon />
            <p className={"bold"}>Revenue-sharing</p>
          </div>
        ),
        content: (
          <div className={"flex col gap16"}>
            <div className={"flex col gap32"}>
              <div className={"flex justify-between"}>
                <p>Selected sharing percentage:</p>
                <div
                  className={"flex align-center gap4 pointer"}
                  onClick={() => {
                    showPopup({
                      closable: false,
                      closeOnBackDropClick: true,
                      size: "custom",
                      content: (
                        <ReferralLinks onDefaultChange={updateSummary} />
                      ),
                    });
                  }}
                >
                  <p className={"bold"}>Choose another percentage pair</p>
                  <NextIcon className={clsx("rotate90", styles.next)} />
                </div>
              </div>
              <ReferralShare
                progress={summary.default_link?.referral_share || 0}
              />
            </div>
            <div className={"flex justify-between"}>
              <p>
                You:{" "}
                <span className={"bold"}>
                  {summary.default_link?.referral_share || 0}
                </span>
              </p>
              <p>
                Your referee:{" "}
                <span className={"bold"}>
                  {summary.default_link?.referral_share
                    ? 100 - summary.default_link?.referral_share
                    : 0}
                </span>
              </p>
            </div>
          </div>
        ),
      },
      {
        label: (
          <div className={"flex row gap4 center"}>
            <CalendarIcon />
            <p className={"bold"}>Monthly</p>
          </div>
        ),
        content: (
          <p>
            Be in to win the monthly 2000 SWASH prize for making the most
            referrals this month!
          </p>
        ),
      },
      {
        label: (
          <div className={"flex row gap4 center"}>
            <ClockIcon />
            <p className={"bold"}>Limited</p>
          </div>
        ),
        content: (
          <p>
            When a Limited campaign is live, you can read about the terms and
            how to get involved here. Until then, be sure to make the most of
            the Monthly and Revenue-Sharing campaigns!
          </p>
        ),
      },
    ];
  }, [summary.default_link?.referral_share, updateSummary]);

  const banner = useMemo(() => {
    if (tab === 0)
      return {
        className: "",
        image: "/images/misc/talk.webp",
        title: "Revenue-sharing for you and your friends",
        text: "Set your % and keep earning with the friends you bring to Swash!",
        button: SUPPORT_URLS.revenueSharing,
      };
    if (tab === 1)
      return {
        className: styles.banner1,
        image: "/images/misc/cup.webp",
        title: "Win 2000 SWASH for the most monthly referrals",
        text: "Bring the most new users in a month, you’ll receive a 2000 SWASH prize!",
        button: SUPPORT_URLS.monthlyReferral,
      };
    return {
      className: styles.banner2,
      image: "/images/misc/thumbs-up.webp",
      title: "Time-capped referrals, limited time",
      text: "Earn for every successful referral that you bring to Swash within live campaigns!",
      button: SUPPORT_URLS.limitedReferral,
    };
  }, [tab]);

  return (
    <>
      <PageHeader header={"Referral bonus and cards"} />
      <div className={"flex col gap32"}>
        <div className={clsx("flex row gap32", styles.balances)}>
          <NumericSection
            className={"col-10"}
            title={"SWASH referral bonus"}
            tooltip={
              "Swash has anti-fraud measures to combat fake users. Only genuine referrals will be reflected here."
            }
            value={purgeNumber(`${rewards}`)}
            image={{
              url: "/images/icons/diamond.svg",
              background: "bg-yellow",
            }}
          />
          <NumericSection
            className={"col-10"}
            title={"Invited friends"}
            tooltip={
              "You will not receive referral rewards for friends that are flagged as fake by Swash’s anti-fraud measures."
            }
            value={summary.registrations}
            image={{
              url: "/images/icons/friends.svg",
              background: "bg-purple",
            }}
          />
        </div>
        <div
          className={clsx(
            "round no-overflow flex nowrap gap32 bg-white card28",
            styles.main,
          )}
        >
          <div className={"flex col col-21 gap32"}>
            <div className={"flex col gap24"}>
              <div className={"flex col gap12"}>
                <h6>Earn more by inviting your friends</h6>
                <p>
                  Share your referral link to bring your friends to Swash. Live
                  referral programs will always be shown here.
                </p>
              </div>
              <MultiTabView tabs={tabs} onTabChange={setTab} />
            </div>
            <Input
              name={"referral"}
              label={"Your referral link"}
              value={
                defaultLink
                  ? defaultLink
                  : "You should set a default referral link"
              }
              disabled={true}
              endAdornment={<CopyEndAdornment value={defaultLink} />}
            />
            <div className={"flex align-center relative"}>
              <hr className={"col-10"} />
              <p className={`absolute bg-white ${styles.share}`}>Or Share</p>
            </div>
            <div className={"flex nowrap gap16"}>
              <TwitterShareButton
                className={"col-10"}
                url={defaultLink}
                title={referralMessage}
              >
                <IconButton
                  classname={styles.icon}
                  image={"/images/logos/x.png"}
                />
              </TwitterShareButton>
              <FacebookShareButton
                className={"col-10"}
                url={defaultLink}
                title={referralMessage}
              >
                <IconButton
                  classname={styles.icon}
                  image={"/images/logos/facebook.png"}
                />
              </FacebookShareButton>
              <LinkedinShareButton
                className={"col-10"}
                url={defaultLink}
                summary={referralMessage}
              >
                <IconButton
                  classname={styles.icon}
                  image={"/images/logos/linkedin.png"}
                />
              </LinkedinShareButton>
              <EmailShareButton
                className={"col-10"}
                url={defaultLink}
                subject={"My Referral Link"}
                body={referralMessage}
              >
                <IconButton
                  classname={styles.icon}
                  image={"/images/logos/email.png"}
                />
              </EmailShareButton>
            </div>
          </div>
          <PunchedBox
            className={clsx(
              "flex col col-10 gap24 card38",
              styles.banner,
              banner.className,
            )}
          >
            <img className={styles.image} src={banner.image} alt={""} />
            <div className={"flex col gap24"}>
              <div className={"flex col gap16"}>
                <p className={"subHeader2"}>{banner.title}</p>
                <p>{banner.text}</p>
              </div>
              <Button
                text={"Learn More"}
                className={"full-width-button"}
                link={{
                  url: banner.button,
                  external: true,
                  newTab: true,
                }}
              />
            </div>
          </PunchedBox>
        </div>
      </div>
    </>
  );
}
