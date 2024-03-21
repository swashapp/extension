import { ReactNode, useState } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { Button } from "@/ui/components/button/button";
import { Input } from "@/ui/components/input/input";
import { closePopup } from "@/ui/components/popup/popup";
import { isValidURL } from "@/utils/validator.util";

export function AddSite({
  id,
  onAdd,
}: {
  id: number;
  onAdd: (id: number, title: string, url: string) => void;
}): ReactNode {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("https://");

  return (
    <>
      <p className={"large"}>Add site</p>
      <hr />
      <div className={"flex col gap12"}>
        <Input
          label={"Title"}
          name={"title"}
          value={title}
          autoComplete={"off"}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          label={"URL"}
          name={"url"}
          value={url}
          autoComplete={"off"}
          placeholder={"https://"}
          onChange={(event) => setUrl(event.target.value)}
        />
      </div>
      <hr />
      <div className={"flex justify-between"}>
        <Button
          text={"Cancel"}
          color={ButtonColors.SECONDARY}
          onClick={() => {
            closePopup();
          }}
        />
        <Button
          text={"Add"}
          disabled={!isValidURL(url)}
          onClick={() => {
            onAdd(id, title, url);
          }}
        />
      </div>
    </>
  );
}
