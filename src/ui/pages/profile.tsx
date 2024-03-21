import { ReactNode, useCallback, useEffect, useState } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { GetAvailableInfo } from "@/types/api/info.type";

import { Button } from "../components/button/button";
import { Select } from "../components/input/select";
import { PageHeader } from "../components/page-header/page-header";
import { toastMessage } from "../components/toast/toast-message";
import { useErrorHandler } from "../hooks/use-error-handler";

export function Profile(): ReactNode {
  const { safeRun } = useErrorHandler();

  const [data, setData] = useState<GetAvailableInfo>({
    birth: { min: 0, max: 0 },
    gender: [],
    marital: [],
    household: [],
    employment: [],
    industry: [],
    income: [],
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [birth, setBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [marital, setMarital] = useState<string>("");
  const [household, setHousehold] = useState<string>("");
  const [employment, setEmployment] = useState<string>("");
  const [income, setIncome] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");

  const updateAdditionalInfo = useCallback(async () => {
    await safeRun(
      async () => {
        setLoading(true);
        await helper("user").updateAdditionalInfo(
          +birth,
          gender,
          marital,
          household,
          employment,
          income,
          industry,
        );
        toastMessage("success", SystemMessage.SUCCESSFULLY_UPDATED_PROFILE);
      },
      {
        finally: () => {
          setLoading(false);
        },
      },
    );
  }, [
    safeRun,
    birth,
    gender,
    marital,
    household,
    employment,
    income,
    industry,
  ]);

  useEffect(() => {
    safeRun(async () => {
      const data = await helper("user").getAvailableAdditionalInfo();
      setData(data);
    }).then();
  }, [data.gender.length, safeRun]);

  useEffect(() => {
    safeRun(async () => {
      const {
        birth,
        gender,
        marital,
        household,
        employment,
        income,
        industry,
      } = await helper("user").getAdditionalInfo();
      setBirth(birth);
      setGender(gender);
      setMarital(marital);
      setHousehold(household);
      setEmployment(employment);
      setIncome(income);
      setIndustry(industry);
    }).then();
  }, [safeRun]);

  return (
    <>
      <PageHeader header={"Profile"} />
      <div className={"flex gap32"}>
        <div className={`round flex col col-17 gap32 bg-white card28`}>
          <div className={"flex col gap16"}>
            <h6>Complete your profile</h6>
            <p>
              Tell Swash you’re human by verifying your profile. Only members
              who verify can withdraw their earnings.
            </p>
          </div>
          <div className={"flex col gap32"}>
            <div className={"flex row gap32"}>
              <Select
                label={"Birth year"}
                value={birth}
                items={Array.from(
                  { length: data.birth.max - data.birth.min + 1 },
                  (_, i) => ({
                    value: `${data.birth.min + i}`,
                    display: `${data.birth.min + i}`,
                  }),
                )}
                onChange={(e) => setBirth(e.target.value as string)}
              />
              <Select
                label={"Gender"}
                value={gender}
                items={data.gender}
                onChange={(e) => setGender(e.target.value as string)}
              />
            </div>
            <div className={"flex row gap32"}>
              <Select
                label={"Marital status"}
                value={marital}
                items={data.marital}
                onChange={(e) => setMarital(e.target.value as string)}
              />
              <Select
                label={"Household size"}
                value={household}
                items={data.household}
                onChange={(e) => setHousehold(e.target.value as string)}
              />
            </div>
            <div className={"flex row gap32"}>
              <Select
                label={"Employment status"}
                value={employment}
                items={data.employment}
                onChange={(e) => setEmployment(e.target.value as string)}
              />
              <Select
                label={"Income"}
                value={income}
                items={data.income}
                onChange={(e) => setIncome(e.target.value as string)}
              />
            </div>
            <Select
              label={"Occupational industry"}
              value={industry}
              items={data.industry}
              onChange={(e) => setIndustry(e.target.value as string)}
            />
          </div>
          <div className={"flex justify-end"}>
            <Button
              text={"Update"}
              color={ButtonColors.PRIMARY}
              loading={loading}
              disabled={
                !birth ||
                !gender ||
                !marital ||
                !household ||
                !employment ||
                !income ||
                !industry
              }
              onClick={updateAdditionalInfo}
            />
          </div>
        </div>
      </div>
    </>
  );
}
