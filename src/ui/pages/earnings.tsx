import clsx from "clsx";
import {
  ReactNode,
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
import { WebsiteURLs } from "@/paths";
import { GetIpLocationRes } from "@/types/api/ip.type";
import {
  GetGiftCardProductRes,
  GetVoucherRes,
  WithdrawNetworkInfoRes,
  WithdrawNetworkTokensRes,
} from "@/types/api/withdraw.type";
import { MultiPageRef, SelectItem } from "@/types/ui.type";
import { Button } from "@/ui/components/button/button";
import { SearchEndAdornment } from "@/ui/components/input/end-adornments/search-end-adornment";
import { Input } from "@/ui/components/input/input";
import { Select } from "@/ui/components/input/select";
import { MultiPageView } from "@/ui/components/multi-page-view/multi-page-view";
import { MultiTabView } from "@/ui/components/multi-tab-view/multi-tab-view";
import { NumericSection } from "@/ui/components/numeric-section/numeric-section";
import { PageHeader } from "@/ui/components/page-header/page-header";
import { showPopup } from "@/ui/components/popup/popup";
import { PunchedBox } from "@/ui/components/punched-box/punched-box";
import { toastMessage } from "@/ui/components/toast/toast-message";
import { VerifiedUsersOnly } from "@/ui/components/verification/verified-users-only";
import { DashboardContext } from "@/ui/context/dashboard.context";
import { useAccountBalance } from "@/ui/hooks/use-account-balance";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import { purgeNumber, purgeString } from "@/utils/string.util";
import { isValidWallet } from "@/utils/validator.util";
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

function WithdrawCrypto({ balance }: { balance: number }) {
  const { safeRun } = useErrorHandler();
  const { account } = useContext(DashboardContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [networks, setNetworks] = useState<WithdrawNetworkInfoRes[]>([]);
  const [network, setNetwork] = useState<WithdrawNetworkInfoRes>();
  const [token, setToken] = useState<WithdrawNetworkTokensRes>();
  const [receiver, setReceiver] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [max, setMax] = useState<number>(0);

  const updateMax = useCallback(
    (networkId?: string, tokenAddress?: string) => {
      if (networkId && tokenAddress && !isNaN(balance)) {
        safeRun(
          async () => {
            const eq = await helper("payment").convertAmountFromSwash(
              networkId,
              tokenAddress,
              balance,
            );
            setMax(+eq);
          },
          {
            failure: () => {
              setMax(0);
            },
          },
        );
      }
    },
    [balance, safeRun],
  );

  useEffect(() => {
    if (networks.length > 0) return;
    safeRun(async () => {
      const { networks } = await helper("payment").getWithdrawInfo();
      setNetworks(networks);
    });
  }, [networks.length, safeRun]);

  useEffect(() => {
    if (networks.length > 0) {
      setNetwork(networks[0]);
    } else setNetwork(undefined);
  }, [networks]);

  useEffect(() => {
    const token = network?.tokens?.[0];
    setToken(token);
    setAmount(token?.min || 0);
    updateMax(network?.id, token?.address);
  }, [network, updateMax]);

  const onChangeNetwork = (network: string) => {
    const item = networks.find((inf) => inf.name === network);
    setNetwork(item);
  };

  const onChangeCurrency = (currency: string) => {
    const item = network?.tokens.find((t) => t.name === currency);
    setToken(item);
  };

  const onClickWithdraw = () => {
    if (account.is_verified) return AvailableToVerifiedUser();

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
        }
        toastMessage("success", SystemMessage.SUCCESSFULLY_WITHDRAW_TOKEN);
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
      <Input
        name={"Amount"}
        label={"Swash amount to withdraw"}
        value={`${amount}`.replace(/^0\d+/, "")}
        type={"number"}
        inputProps={{
          step: Math.floor((token?.min || 1) / 10),
          min: token?.min || 0.01,
          max,
        }}
        onChange={(e) => {
          const value = +e.target.value;
          if (value >= 0) setAmount(value);
        }}
        error={amount < (token?.min || 0) || amount > max}
      />
      <Input
        label={"Paste wallet address"}
        value={receiver}
        onChange={(e) => setReceiver(e.target.value as string)}
      />
      <div className={"flex justify-between gap32"}>
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
      <div className={"flex justify-between gap32"}>
        <div className={"flex col gap8 grow1"}>
          <p className={"bold"}>Approximate receiving amount</p>
          <p className={"larger"}>
            {/*{amount + (token?.fee || 0)}{" "}*/}~ 9.90 USDT
            {/*<span className={"large"}>{token?.name}</span>*/}
          </p>
          <p className={"small"}>
            Deducted{" "}
            <span className={"small bold"}>
              {token?.fee} {token?.name}
            </span>{" "}
            as fee
          </p>
        </div>
        <div className={"flex col justify-between grow1"}>
          <div
            className={clsx(
              "flex align-center border-box bg-soft-yellow",
              styles.toaster,
            )}
          >
            <p>How to withdraw? View guide</p>
          </div>
          <div className={"flex justify-between"}>
            <p className={"small"}>Contract information</p>
            <p className={"small bold"}>
              {purgeString(network?.swapContract || "", 5)}
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
            balance !== 0 &&
            isValidWallet(receiver) &&
            token &&
            amount >= token.min &&
            amount <= max
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

export function WithdrawVouchers() {
  const { safeRun } = useErrorHandler();

  const [vouchers, setVouchers] = useState<GetVoucherRes[]>([]);

  const getColor = useCallback((value: string) => {
    switch (value) {
      case "5":
        return "purple";
      case "10":
        return "soft-yellow";
      case "20":
        return "soft-green";
      case "50":
        return "yellow";
      case "100":
        return "orange";
      default:
        return "light-grey";
    }
  }, []);

  useEffect(() => {
    if (vouchers.length > 0) return;
    safeRun(async () => {
      setVouchers(await helper("payment").getVouchers());
    });
  }, [vouchers.length, safeRun]);

  return (
    <div className={"flex col gap20"}>
      <p className={"bold"}>Select an unused voucher to redeem it:</p>
      <div className={"flex gap16"}>
        {vouchers.map(({ amount }, index) => (
          <div
            key={`unused-voucher-${index}`}
            className={clsx("flex col", styles.voucher)}
          >
            <div className={clsx("flex center", styles.amount)}>
              <p className={"bold"}>$ {amount}</p>
            </div>
            <div className={clsx("flex center", styles.use)}>
              <p className={"smaller"}>Use voucher</p>
            </div>
            <div className={"absolute"}>
              <VoucherBodyIcon color={getColor(amount)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Earnings(): ReactNode {
  const ref = useRef<MultiPageRef>();
  const { safeRun } = useErrorHandler();
  const { balance } = useAccountBalance();

  const [loading, setLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<SelectItem[]>([]);
  const [country, setCountry] = useState<string>("");
  const [values, setValues] = useState<SelectItem[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [cards, setCards] = useState<GetGiftCardProductRes[]>([]);
  const [selected, setSelected] = useState<GetGiftCardProductRes>();
  const [searchText, setSearchText] = useState<string>("");

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

  const onLoadAvailableGiftCards = useCallback(async () => {
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
          info.priceList.map((price) => ({
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
  }, [safeRun]);

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
        const link = await helper("payment").withdrawByGiftCard(
          +amount,
          selected?.id,
        );
        console.log(link);
      },
      { finally: () => setLoading(false) },
    );
  }, [amount, safeRun, selected]);

  const availableCards = useMemo(() => {
    if (!searchText) return cards;
    return cards.filter((card) =>
      card.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [cards, searchText]);

  const tabs = useMemo(() => {
    return [
      {
        label: (
          <div className={"flex row gap4 center"}>
            <CryptoIcon />
            <p className={"bold"}>Crypto</p>
          </div>
        ),
        content: <WithdrawCrypto balance={balance} />,
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
            <div className={"flex align-center gap16"}>
              <img
                src={"/images/misc/top-gift-cards.webp"}
                alt={"Top gift card"}
                className={styles.top}
              />
              <Button
                text={"See available gift cards"}
                color={ButtonColors.TERTIARY}
                loading={loading}
                onClick={onLoadAvailableGiftCards}
                muiProps={{
                  endIcon: (
                    <img
                      width={16}
                      height={16}
                      src={"/images/icons/arrow-1.svg"}
                      alt={"next"}
                      className={"pointer rotate90"}
                    />
                  ),
                }}
              />
            </div>
          </div>
        ),
      },
      {
        label: (
          <div className={"flex row gap4 center"}>
            <VoucherIcon />
            <p className={"bold"}>Unused vouchers</p>
          </div>
        ),
        content: <WithdrawVouchers />,
      },
    ];
  }, [balance, onLoadAvailableGiftCards, loading]);

  return (
    <>
      <PageHeader header={"Wallet"} />
      <div className={"flex row nowrap gap32"}>
        <div className={"flex col col-10 gap32"}>
          <NumericSection
            title={"Earning balance"}
            tooltip={"This number updates every 48 hours."}
            value={balance}
            image={{
              url: "/images/icons/coins.svg",
              background: "bg-green",
            }}
          />
          <PunchedBox
            className={clsx("border-box flex col gap80", styles.punch)}
          >
            <img
              src={"/images/misc/token-galaxy.webp"}
              alt={"Token galaxy"}
              className={styles.galaxy}
            />
            <div className={"flex col gap32"}>
              <h6>
                Welcome to <em>a new world of data.</em>
              </h6>
              <Button text={"Learn more"} className={styles.cta} />
            </div>
          </PunchedBox>
        </div>
        <div className={"round no-overflow col-21 bg-white card28"}>
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
                    className={"pointer rotate270"}
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
                <Select
                  label={"Select amount to redeem"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  items={values}
                />
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
                    className={"pointer rotate270"}
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
          </MultiPageView>
        </div>
      </div>
    </>
  );
}
