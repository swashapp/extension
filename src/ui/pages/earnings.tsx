import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ButtonColors } from "@/enums/button.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { SUPPORT_URLS, WEBSITE_URLs } from "@/paths";
import { GetIpLocationRes } from "@/types/api/ip.type";
import {
  GetGiftCardProductRes,
  OngoingWithdrawRes,
  VoucherRes,
  WithdrawInfoRes,
  WithdrawNetworkInfoRes,
  WithdrawNetworkTokensRes,
} from "@/types/api/withdraw.type";
import { MultiPageRef, SelectItem } from "@/types/ui.type";
import { Button } from "@/ui/components/button/button";
import { SearchEndAdornment } from "@/ui/components/input/end-adornments/search-end-adornment";
import { TextEndAdornment } from "@/ui/components/input/end-adornments/text-end-adornment";
import { Input } from "@/ui/components/input/input";
import { NumericInput } from "@/ui/components/input/numeric-input";
import { Select } from "@/ui/components/input/select";
import { Link } from "@/ui/components/link/link";
import { MultiPageView } from "@/ui/components/multi-page-view/multi-page-view";
import { MultiTabView } from "@/ui/components/multi-tab-view/multi-tab-view";
import { NumericSection } from "@/ui/components/numeric-section/numeric-section";
import { PageHeader } from "@/ui/components/page-header/page-header";
import { showPopup } from "@/ui/components/popup/popup";
import { StepperProgress } from "@/ui/components/progress/stepper-progress";
import { PunchedBox } from "@/ui/components/punched-box/punched-box";
import { toastMessage } from "@/ui/components/toast/toast-message";
import { VerifiedUsersOnly } from "@/ui/components/verification/verified-users-only";
import { DashboardContext } from "@/ui/context/dashboard.context";
import { useAccountBalance } from "@/ui/hooks/use-account-balance";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import { isTimeAfter } from "@/utils/date.util";
import { purgeNumber, purgeString } from "@/utils/string.util";
import { isValidWallet } from "@/utils/validator.util";
import NextIcon from "~/images/icons/arrow-1.svg?react";
import BackIcon from "~/images/icons/arrow-2.svg?react";
import CheckIcon from "~/images/icons/check.svg?react";
import CryptoIcon from "~/images/icons/crypto.svg?react";
import MoneyIcon from "~/images/icons/money.svg?react";
import VoucherBodyIcon from "~/images/icons/voucher-body.svg?react";
import VoucherIcon from "~/images/icons/voucher.svg?react";

import styles from "./earnings.module.css";

function AvailableToVerifiedUser() {
  showPopup({
    closable: false,
    closeOnBackDropClick: false,
    size: "small",
    content: (
      <VerifiedUsersOnly
        header={"Get verified to Withdraw!"}
        body={
          <>
            Withdrawal is only available for verified Swash members.
            <br />
            <br />
            To use the withdrawal options, your phone number has to be verified.
            Take a few minutes to verify your phone number and get ready to
            withdraw your balances.
          </>
        }
      />
    ),
  });
}

function WithdrawCrypto({
  balance,
  networks,
  updatePolling,
}: {
  balance: number;
  networks: WithdrawNetworkInfoRes[];
  updatePolling: Dispatch<SetStateAction<boolean>>;
}) {
  const { safeRun } = useErrorHandler();
  const { account } = useContext(DashboardContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [network, setNetwork] = useState<WithdrawNetworkInfoRes>();
  const [token, setToken] = useState<WithdrawNetworkTokensRes>();
  const [receiver, setReceiver] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [receiving, setReceiving] = useState<number>(0);

  useEffect(() => {
    if (networks.length > 0) {
      setNetwork(networks[0]);
    } else setNetwork(undefined);
  }, [networks]);

  useEffect(() => {
    const token = network?.tokens?.[0];
    setToken(token);
  }, [balance, network]);

  useEffect(() => {
    setReceiving(-1);

    const timer = setTimeout(() => {
      safeRun(async () => {
        if (!network || !token || amount === 0 || token?.min > amount) {
          setReceiving(0);
          return;
        }

        setReceiving(
          await helper("payment").convertSwashAmount(
            network?.id,
            token?.address || "",
            amount - token.fee,
          ),
        );
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [amount, network, safeRun, token]);

  const onChangeNetwork = (network: string) => {
    const item = networks.find((inf) => inf.name === network);
    setNetwork(item);
  };

  const onChangeCurrency = (currency: string) => {
    const item = network?.tokens.find((t) => t.name === currency);
    setToken(item);
  };

  const onClickWithdraw = () => {
    if (!account.is_verified) return AvailableToVerifiedUser();

    setLoading(true);
    safeRun(
      async () => {
        if (network && token) {
          await helper("payment").withdrawByCrypto(
            receiver,
            amount,
            token.decimals,
            +network.id,
            token.address,
          );
          updatePolling(true);
          toastMessage("success", SystemMessage.SUCCESSFULLY_WITHDRAW_TOKEN);
        }
      },
      {
        finally: () => {
          setLoading(false);
        },
      },
    );
  };

  return (
    <div className={"flex col gap24"}>
      <NumericInput
        name={"Withdraw amount"}
        label={"Amount to withdraw"}
        value={amount}
        unit={"SWASH"}
        inputProps={{
          min: Math.min(balance, token?.min || Number.MAX_SAFE_INTEGER),
          max: balance,
        }}
        setValue={(value) => {
          if (value >= 0 && value <= balance) setAmount(value);
          else setAmount(balance);
        }}
        error={amount < (token?.min || 0) || amount > balance}
        errorMessage={
          amount < (token?.min || 0)
            ? `Minimum withdrawal amount is ${token?.min} SWASH`
            : amount > balance
              ? `Your balance is ${balance} SWASH`
              : undefined
        }
        endAdornment={
          <TextEndAdornment
            className={styles.max}
            text={"MAX"}
            disabled={balance === 0}
            onClick={() => {
              setAmount(balance);
            }}
          />
        }
      />
      <Input
        label={"Paste wallet address"}
        value={receiver}
        onChange={(e) => setReceiver(e.target.value as string)}
      />
      <div className={clsx("flex justify-between gap32", styles.row)}>
        <Select
          label={"Select network"}
          value={network?.name || ""}
          items={networks.map((rec) => {
            return {
              value: rec.name,
              display: rec.name,
              icon: rec.icon,
            };
          })}
          onChange={(e) => {
            onChangeNetwork(e.target.value);
          }}
        />
        <Select
          label={"Select currency"}
          value={token?.name || ""}
          items={
            network?.tokens.map((rec) => {
              return {
                value: rec.name,
                display: rec.name,
                icon: rec.icon,
              };
            }) || []
          }
          captions={network?.tokens.map((token, index) => (
            <div key={`caption-${index}`} className={"flex justify-between"}>
              <p className={clsx("smaller col-10", styles.caption)}>
                Fee: {token.fee}
              </p>
              <p className={clsx("smaller col-10", styles.caption)}>
                Min withdrawal: {token.min}
              </p>
            </div>
          ))}
          onChange={(e) => {
            onChangeCurrency(e.target.value);
          }}
        />
      </div>
      <div className={clsx("flex justify-between gap32", styles.row)}>
        <div className={"flex col gap8 grow1"}>
          <p className={"bold"}>Approximate receiving amount</p>
          {receiving === -1 ? (
            <div>
              <CircularProgress style={{ width: 16, height: 16 }} />
            </div>
          ) : (
            <p className={"larger"}>
              ~ {purgeNumber(`${receiving}`)}{" "}
              <span className={"large"}>{token?.name}</span>
            </p>
          )}
          <p className={"small"}>
            Deducted <span className={"small bold"}>{token?.fee} SWASH</span> as
            fee
          </p>
        </div>
        <div className={"flex col justify-between grow1"}>
          <div
            className={clsx(
              "flex align-center border-box bg-soft-yellow",
              styles.toaster,
            )}
          >
            <p>
              Need help?{" "}
              <Link
                className={styles.link}
                url={SUPPORT_URLS.withdrawalHelp}
                external
                newTab
              >
                View guide
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Button
        text={`Withdraw`}
        className={"full-width-button"}
        color={ButtonColors.PRIMARY}
        disabled={
          !(
            isValidWallet(receiver) &&
            token &&
            amount >= token.min &&
            amount <= balance
          )
        }
        loading={loading}
        onClick={() => {
          onClickWithdraw();
        }}
      />
    </div>
  );
}

export function WithdrawVouchers({
  vouchers,
  onUse,
}: {
  vouchers: VoucherRes[];
  onUse: (voucher: VoucherRes) => void;
}): ReactNode {
  return (
    <div className={"flex col gap20"}>
      <p className={"bold"}>Select an unused voucher to redeem it:</p>
      <div className={"flex center gap16 wrap"}>
        {vouchers.map(({ amount }, index) => (
          <div
            key={`unused-voucher-${index}`}
            className={clsx("flex col", styles.voucher)}
            onClick={() => {
              onUse(vouchers[index]);
            }}
          >
            <div className={clsx("flex center", styles.amount)}>
              <p className={"bold"}>$ {amount}</p>
            </div>
            <div className={clsx("flex center", styles.use)}>
              <p className={"smaller"}>Use voucher</p>
            </div>
            <VoucherBodyIcon
              className={clsx("absolute", styles[`color${amount}`])}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Earnings(): ReactNode {
  const ref = useRef<MultiPageRef>();
  const { safeRun } = useErrorHandler();
  const { balance, balanceInUSD } = useAccountBalance();

  const [loading, setLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<WithdrawInfoRes>();
  const [ongoing, setOngoing] = useState<OngoingWithdrawRes>();
  const [forcePolling, setForcePolling] = useState<boolean>(false);
  const [countries, setCountries] = useState<SelectItem[]>([]);
  const [country, setCountry] = useState<string>("");
  const [values, setValues] = useState<SelectItem[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [cards, setCards] = useState<GetGiftCardProductRes[]>([]);
  const [selected, setSelected] = useState<GetGiftCardProductRes>();
  const [searchText, setSearchText] = useState<string>("");

  const [voucher, setVoucher] = useState<VoucherRes>();
  const [vouchers, setVouchers] = useState<VoucherRes[]>([]);

  const [link, setLink] = useState<string>("");

  useEffect(() => {
    if (info) return;
    safeRun(async () => {
      const info = await helper("payment").getWithdrawInfo();
      setInfo(info);
    });
  }, [info, safeRun]);

  useEffect(() => {
    if (!country) {
      safeRun(async () => {
        const location = (await helper("cache").getData(
          "location",
        )) as GetIpLocationRes;
        setCountry(location.country_code);
      });
    }
  }, [country, safeRun]);

  useEffect(() => {
    if (!info) return;

    let timer: NodeJS.Timeout;

    const isActive = (
      data: OngoingWithdrawRes | undefined,
      info: WithdrawInfoRes | undefined,
    ) => {
      if (data) {
        if (data.isError) return false;
        if (info && data.state === info?.withdrawStates.length - 1)
          return false;
        return !isTimeAfter(data.date + 1800000);
      }
      return false;
    };

    const pollOngoing = async () => {
      await safeRun(async () => {
        const ongoingData = await helper("payment").getOngoingPayment();
        setOngoing(ongoingData);

        const interval =
          isActive(ongoingData, info) || forcePolling ? 10000 : 300000;

        if (!isActive(ongoingData, info) && forcePolling)
          setForcePolling(false);

        timer = setTimeout(pollOngoing, interval);
      });
    };

    pollOngoing();

    return () => {
      clearTimeout(timer);
    };
  }, [forcePolling, info, safeRun]);

  useEffect(() => {
    if (vouchers.length > 0) return;
    safeRun(async () => {
      const response = await helper("payment").getVouchers();
      const vouchers: VoucherRes[] = [];

      Object.keys(response).forEach((key) => {
        response[key].forEach((voucher) => {
          vouchers.push(voucher);
        });
      });

      setVouchers(vouchers);
    });
  }, [vouchers.length, safeRun]);

  const onLoadAvailableGiftCards = useCallback(async () => {
    setLink("");
    setLoading(true);
    await safeRun(
      async () => {
        const info = await helper("payment").getGiftCardInfo();
        setCountries(
          info.countries.map((country) => ({
            value: country.code,
            display: country.name,
          })),
        );
        setValues(
          info.priceList
            .filter(({ swash }) => +swash < balance)
            .map((price) => ({
              value: price.dollar,
              display: `$${price.dollar} / ${purgeNumber(price.swash)} SWASH`,
            })),
        );
        ref.current?.next();
      },
      {
        finally: () => {
          setLoading(false);
        },
      },
    );
  }, [balance, safeRun]);

  const onLoadFilteredGiftCard = useCallback(async () => {
    setLoading(true);
    await safeRun(
      async () => {
        setCards(await helper("payment").getGiftCardProducts(country, amount));
        ref.current?.next();
      },
      {
        finally: () => {
          setLoading(false);
        },
      },
    );
  }, [amount, country, safeRun]);

  const onClickPurchaseGiftCard = useCallback(async () => {
    if (!selected) return;

    setLoading(true);
    safeRun(
      async () => {
        let link: string;
        if (voucher)
          link = await helper("payment").withdrawByVoucher(
            voucher,
            selected?.id,
          );
        else
          link = await helper("payment").withdrawByGiftCard(
            +amount,
            selected?.id,
          );

        setLink(link);
        setAmount("");
        setVoucher(undefined);

        ref.current?.next();
      },
      { finally: () => setLoading(false) },
    );
  }, [amount, safeRun, selected, voucher]);

  const availableCards = useMemo(() => {
    if (!searchText) return cards;
    return cards.filter((card) =>
      card.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [cards, searchText]);

  const tabs = useMemo(() => {
    const tabs = [
      {
        label: (
          <div className={"flex row gap4 center"}>
            <CryptoIcon />
            <p className={"bold"}>Crypto</p>
          </div>
        ),
        content: (
          <WithdrawCrypto
            networks={info?.networks || []}
            balance={balance}
            updatePolling={setForcePolling}
          />
        ),
      },
      {
        label: (
          <div className={"flex row gap4 center"}>
            <MoneyIcon />
            <p className={"bold"}>Cash & Gift Card</p>
          </div>
        ),
        content: (
          <div className={"flex col gap32"}>
            <p className={clsx("small", styles.caption)}>
              When you start the process to redeem a gift card, your selected
              Swash balance will be automatically exchanged.
              <br />
              <br />
              If you get interrupted at some point in this process, your unused
              vouchers will be shown here for you to continue choosing your gift
              card later.
            </p>
            <div className={clsx("flex align-center gap16", styles.row)}>
              <img
                src={"/images/misc/top-gift-cards.webp"}
                alt={"Top gift card"}
                className={styles.top}
              />
              <Button
                text={"See available gift cards"}
                color={ButtonColors.TERTIARY}
                loading={loading}
                onClick={async () => {
                  setVoucher(undefined);
                  await onLoadAvailableGiftCards();
                }}
                muiProps={{
                  endIcon: (
                    <NextIcon
                      width={16}
                      height={16}
                      className={clsx("pointer rotate90", styles.svg)}
                    />
                  ),
                }}
              />
            </div>
          </div>
        ),
      },
    ];

    if (vouchers.length > 0)
      tabs.push({
        label: (
          <div className={"flex row gap4 center"}>
            <VoucherIcon />
            <p className={"bold"}>Unused vouchers</p>
          </div>
        ),
        content: (
          <WithdrawVouchers
            vouchers={vouchers}
            onUse={async (voucher: VoucherRes) => {
              setVoucher(voucher);
              setAmount(voucher.amount);
              await onLoadAvailableGiftCards();
            }}
          />
        ),
      });

    return tabs;
  }, [balance, info?.networks, loading, onLoadAvailableGiftCards, vouchers]);

  return (
    <>
      <PageHeader header={"Wallet"} />
      <div className={clsx("flex row nowrap gap32", styles.container)}>
        <div className={clsx("flex col col-10 gap32", styles.balance)}>
          <NumericSection
            title={"Earning balance"}
            tooltip={"This number updates every 48 hours."}
            value={balance}
            postfix={"SWASH"}
            caption={`$ ${balanceInUSD}`}
            image={{
              url: "/images/icons/coins.svg",
              background: "bg-green",
            }}
          />
          {ongoing && info?.withdrawStates ? (
            <>
              <div
                className={
                  "round no-overflow flex col gap24 bg-white card28 border-box"
                }
              >
                <p className={clsx("bold", styles.title)}>
                  Withdrawal progress
                </p>
                <StepperProgress
                  steps={info?.withdrawStates || []}
                  status={
                    ongoing.state === info.withdrawStates.length - 1
                      ? "success"
                      : ongoing.isError
                        ? "error"
                        : "pending"
                  }
                  activeStep={ongoing.state}
                />
                <div
                  className={"flow align-center gap8 pointer"}
                  onClick={() =>
                    showPopup({
                      closable: true,
                      closeOnBackDropClick: true,
                      size: "custom",
                      content: (
                        <div className={clsx("flex col gap32", styles.popup)}>
                          <div className={"subHeader2"}>Withdrawal details</div>
                          <div className={styles.table}>
                            <div className={"flex justify-between"}>
                              <p>Status</p>

                              {ongoing.state ===
                              info.withdrawStates.length - 1 ? (
                                <p
                                  className={clsx(
                                    "bold bg-soft-green round",
                                    styles.status,
                                  )}
                                >
                                  Finished
                                </p>
                              ) : ongoing.isError ? (
                                <p
                                  className={clsx(
                                    "bold bg-red round",
                                    styles.status,
                                  )}
                                >
                                  Failed
                                </p>
                              ) : (
                                <p
                                  className={clsx(
                                    "bold bg-soft-yellow round",
                                    styles.status,
                                  )}
                                >
                                  Processing
                                </p>
                              )}
                            </div>
                            <div className={"flex justify-between"}>
                              <p>Date</p>
                              <p className={"bold"}>
                                {new Date(ongoing?.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={"flex justify-between"}>
                              <p>Time</p>
                              <p className={"bold"}>
                                {new Date(ongoing?.date).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className={"flex justify-between"}>
                              <p>Network</p>
                              <p className={"bold"}>{ongoing?.network}</p>
                            </div>
                            <div className={"flex justify-between"}>
                              <p>Currency</p>
                              <p className={"bold"}>{ongoing?.token}</p>
                            </div>
                            <div className={"flex justify-between"}>
                              <p>TxID</p>
                              <p className={"bold"}>
                                {ongoing?.transactionHash && ongoing.network ? (
                                  info ? (
                                    <Link
                                      url={
                                        info?.networks.find(
                                          (network) =>
                                            network.id === ongoing.networkId,
                                        )?.explorer + ongoing?.transactionHash
                                      }
                                      newTab
                                    >
                                      {purgeString(ongoing?.transactionHash)}
                                    </Link>
                                  ) : (
                                    ongoing?.transactionHash
                                  )
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    })
                  }
                >
                  <span className={"bold"}>View details</span>
                  <NextIcon className={clsx("rotate90", styles.svg)} />
                </div>
              </div>
              <PunchedBox
                className={clsx("border-box flex col gap80", styles.punch)}
              >
                <div className={"flex col center gap32"}>
                  <h6 className={"text-center"}>Earn for being you, online.</h6>
                  <Button
                    text={"Learn more"}
                    className={styles.cta}
                    link={{
                      url: WEBSITE_URLs.ecosystem,
                      external: true,
                      newTab: true,
                    }}
                  />
                </div>
              </PunchedBox>
            </>
          ) : (
            <PunchedBox
              className={clsx("border-box flex col gap80", styles.punch)}
            >
              <img
                src={"/images/misc/token-galaxy.webp"}
                alt={"Token galaxy"}
                className={styles.galaxy}
              />
              <div className={"flex col gap32"}>
                <h6>Earn for being you, online.</h6>
                <Button
                  text={"Learn more"}
                  className={styles.cta}
                  link={{
                    url: WEBSITE_URLs.ecosystem,
                    external: true,
                    newTab: true,
                  }}
                />
              </div>
            </PunchedBox>
          )}
        </div>
        <div
          className={clsx(
            "round no-overflow col-21 bg-white card28",
            styles.main,
          )}
        >
          <MultiPageView ref={ref}>
            <div className={"flex col gap24"}>
              <div className={"flex col gap12"}>
                <h6>Withdraw Your Earnings</h6>
                <p>
                  Ready to cash out? Choose how to withdraw your earnings
                  <br />
                  from the options below.
                </p>
              </div>
              <MultiTabView tabs={tabs} />
            </div>
            <div className={"flex col gap32"}>
              <div className={"flex col gap24"}>
                <div className={"flex align-center gap16"}>
                  <BackIcon
                    className={clsx("pointer rotate270", styles.svg)}
                    onClick={() => {
                      ref.current?.back();
                    }}
                  />
                  <h6>See available gift cards</h6>
                </div>
                <Select
                  label={"Select Country"}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  items={countries}
                />
                {voucher ? null : (
                  <Select
                    label={"Select amount to redeem"}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    items={values}
                  />
                )}
              </div>
              <Button
                text={"See available gift cards"}
                disabled={!country || !amount}
                loading={loading}
                onClick={onLoadFilteredGiftCard}
              />
            </div>
            <div className={"flex col gap32"}>
              <div className={"flex col gap24"}>
                <div className={"flex align-center gap16"}>
                  <BackIcon
                    className={clsx("pointer rotate270", styles.svg)}
                    onClick={() => {
                      ref.current?.back();
                    }}
                  />
                  <h6>Choose a gift card</h6>
                </div>
                <Input
                  label={"Search"}
                  name={"search"}
                  placeholder={"Search the list of gift cards"}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  endAdornment={<SearchEndAdornment />}
                />
                <div className={styles.companies}>
                  {availableCards.map((item) => {
                    return (
                      <div
                        key={item.name}
                        className={clsx(
                          "flex align-center justify-between pointer",
                          styles.company,
                        )}
                        onClick={() => {
                          if (item.id !== selected?.id) setSelected(item);
                          else setSelected(undefined);
                        }}
                      >
                        <div className={"flex align-center gap20"}>
                          <img src={item.imagePath} alt={item.name} />
                          <p className={"bold"}>{item.name}</p>
                        </div>
                        <CheckIcon
                          className={clsx({ hide: item.id !== selected?.id })}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button
                text={"Continue to the gift card checkout"}
                disabled={!selected}
                loading={loading}
                onClick={onClickPurchaseGiftCard}
              />
            </div>
            <div className={"flex col gap32"}>
              <div className={"flex align-center gap16"}>
                <h6>Congratulations</h6>
              </div>
              <div className={"flex col center gap24"}>
                <img
                  src={"/images/misc/thumbs-up.webp"}
                  alt={"Thumbs up"}
                  className={styles.thumbs}
                />
                <p className={"text-center"}>
                  Your Gift Card is on its way! Click below to continue.
                </p>
                <Button
                  color={ButtonColors.SECONDARY}
                  text={"Open Gift Card page"}
                  onClick={() => {
                    setLink("");
                    ref.current?.back(3);
                  }}
                  link={{
                    url: link,
                    external: true,
                    newTab: true,
                  }}
                />
              </div>
            </div>
          </MultiPageView>
        </div>
      </div>
    </>
  );
}
