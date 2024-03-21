import clsx from "clsx";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ButtonColors } from "@/enums/button.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { InternalRoutes } from "@/paths";
import {
  GetGiftCardProductRes,
  GetVoucherRes,
  WithdrawNetworkInfoRes,
  WithdrawNetworkTokensRes,
} from "@/types/api/withdraw.type";
import { showPopup } from "@/ui/components/popup/popup";
import { VerifiedUsersOnly } from "@/ui/components/verification/verified-users-only";
import { DashboardContext } from "@/ui/context/dashboard.context";
import { purgeNumber, purgeString } from "@/utils/string.util";
import { isValidWallet } from "@/utils/validator.util";
import NextIcon from "~/images/icons/arrow-1.svg?react";
import CryptoIcon from "~/images/icons/crypto.svg?react";
import MoneyIcon from "~/images/icons/money.svg?react";
import VoucherBodyIcon from "~/images/icons/voucher-body.svg?react";
import VoucherIcon from "~/images/icons/voucher.svg?react";

import { Button } from "../components/button/button";
import { Input } from "../components/input/input";
import { Select } from "../components/input/select";
import { MultiTabView } from "../components/multi-tab-view/multi-tab-view";
import { NumericSection } from "../components/numeric-section/numeric-section";
import { PageHeader } from "../components/page-header/page-header";
import { PunchedBox } from "../components/punched-box/punched-box";
import { toastMessage } from "../components/toast/toast-message";
import { Tooltip } from "../components/tooltip/tooltip";
import { useAccountBalance } from "../hooks/use-account-balance";
import { useErrorHandler } from "../hooks/use-error-handler";

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
  const [info, setInfo] = useState<WithdrawNetworkInfoRes[]>([]);
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
    if (info.length > 0) return;
    safeRun(async () => {
      const info = await helper("payment").getWithdrawInfo();
      setInfo(info);
    });
  }, [info.length, safeRun]);

  useEffect(() => {
    if (info.length > 0) {
      setNetwork(info[0]);
    } else setNetwork(undefined);
  }, [info]);

  useEffect(() => {
    const token = network?.tokens?.[0];
    setToken(token);
    setAmount(token?.min || 0);
    updateMax(network?.id, token?.address);
  }, [network, updateMax]);

  const onChangeNetwork = (network: string) => {
    const item = info.find((inf) => inf.name === network);
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
      <Select
        label={"Select network"}
        value={network?.name || ""}
        items={info.map((rec) => {
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
      <Input
        label={"Paste wallet address"}
        value={receiver}
        onChange={(e) => setReceiver(e.target.value as string)}
      />
      <div className={"flex justify-between gap32"}>
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
        <Input
          name={"Cashout amount"}
          label={"Cashout amount"}
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
      </div>
      <div className={"flex justify-between gap32"}>
        <div className={"flex col gap8 grow1"}>
          <p className={"bold"}>Deduction amount</p>
          <p className={"larger"}>
            {amount + (token?.fee || 0)}{" "}
            <span className={"large"}>{token?.name}</span>
          </p>
          <p className={"small"}>
            Including{" "}
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

function WithdrawGiftCard() {
  const { safeRun } = useErrorHandler();

  const [products, setProducts] = useState<GetGiftCardProductRes[]>([]);
  const [product, setProduct] = useState<GetGiftCardProductRes>();
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (products.length > 0) return;
    safeRun(async () => {
      const products = await helper("payment").getTopGiftCardProducts();
      console.log(products);
      setProducts(products.filter((product) => product.priceList.length > 0));
    });
  }, [products.length, safeRun]);

  return (
    <div className={"flex col gap32"}>
      <div className={"flex col gap20"}>
        <p className={"bold"}>
          Choose from any of the payout and gift card options below
          <br />
          to withdraw your Swash earnings
        </p>
        <div className={"flex gap16"}>
          {products.map((pr, index) => {
            return (
              <img
                key={`product-${index}`}
                className={clsx("border-box round pointer", styles.card, {
                  [styles.selected]: product?.id === pr.id,
                })}
                src={pr.imagePath}
                alt={pr.name}
                onClick={() => {
                  setProduct(pr);
                }}
              />
            );
          })}
          <div
            className={clsx(
              "flex align-center justify-between border-box round pointer",
              styles.card,
            )}
            onClick={() => {}}
          >
            <p>See full list </p>
            <NextIcon />
          </div>
        </div>
      </div>
      {product ? (
        <div className={"flex col gap20"}>
          <p className={"bold"}>How much do you want to cashout?</p>
          <div className={"flex gap16"}>
            {(product?.priceList || []).map(({ dollar, swash }, index) => (
              <div
                className={clsx(
                  "flex col justify-between border-box round pointer",
                  styles.cashout,
                  { [styles.selected]: amount === +dollar },
                )}
                key={`cashout-${index}`}
                onClick={() => {
                  setAmount(+dollar);
                }}
              >
                <p>$ {dollar}</p>
                <p className={"small"}>{purgeNumber(swash, 0)} SWASH</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div>
        <p className={clsx("small", styles.caption)}>
          When you click the button below, your $SWASH will be automatically
          <br />
          converted ready for you to redeem a gift card of your choice.
        </p>
        <br />
        <p className={clsx("small", styles.caption)}>
          If you don’t redeem straight away, don’t worry, your voucher will be
          ready for
          <br />
          you to use whenever you’re ready. Got questions?{" "}
          <em>Check out the FAQ</em>
        </p>
      </div>
      <div className={"flex col gap20"}>
        <Button
          text={`Convert and go to the gift card checkout`}
          className={"full-width-button"}
          color={ButtonColors.PRIMARY}
          link={{ url: InternalRoutes.data }}
          disabled={amount === 0}
        />
        <p className={`small ${styles.caption}`}>
          Check your payout status and unclaimed vouchers <em>here.</em>
        </p>
      </div>
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
              <VoucherIcon color={getColor(amount)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Earnings(): ReactNode {
  const { balance } = useAccountBalance();

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
        content: <WithdrawGiftCard />,
      },
      {
        label: (
          <div className={"flex row gap4 center"}>
            <VoucherBodyIcon />
            <p className={"bold"}>Unused vouchers</p>
          </div>
        ),
        content: <WithdrawVouchers />,
      },
    ];
  }, [balance]);

  return (
    <>
      <PageHeader header={"Wallet"} />
      <div className={"flex row nowrap gap32"}>
        <div className={"flex col col-10 gap32"}>
          <NumericSection
            title={"Earning balance"}
            tooltip={"This number updates every 48 hours."}
            value={balance}
            image={"/images/icons/swash-coin.svg"}
          />
          <PunchedBox className={styles.punch}>
            <div style={{ height: 200 }}></div>
          </PunchedBox>
        </div>
        <div className={"round flex col col-21 gap24 bg-white card28"}>
          <div className={"flex col gap12"}>
            <div className={"flex align-center"}>
              <h6>Withdraw Your Earnings</h6>
              <Tooltip
                text={
                  "This is your unique ID in the Swash ecosystem. Do not use it to send crypto to yourself."
                }
              />
            </div>
            <p>
              Ready to cash out? Choose how to withdraw your earnings
              <br />
              from the options below.
            </p>
          </div>
          <MultiTabView tabs={tabs} />
        </div>
      </div>
    </>
  );
}
