import clsx from "clsx";
import { useCallback, useState, useMemo, ReactNode } from "react";

import { RemoveButton } from "@/ui/components/button/remove";
import { TextEndAdornment } from "@/ui/components/input/end-adornments/text-end-adornment";
import { Input } from "@/ui/components/input/input";

import styles from "./text-list-management.module.css";

export function TextListManagement({
  placeholder,
  items,
  onAdd,
  onRemove,
  transformer,
  validator,
}: {
  placeholder: string;
  items: string[];
  onAdd: (data: string) => void;
  onRemove: (data: string) => void;
  transformer?: (data: string) => string;
  validator?: (data: string) => boolean;
}): ReactNode {
  const [input, setInput] = useState<string>("");

  const allowAdd = useMemo(() => {
    if (!input) return false;
    if (
      items.find((item: string) => {
        let _input = input;
        if (transformer) _input = transformer(input);

        return item === _input;
      })
    )
      return false;
    return !(validator && !validator(input));
  }, [input, items, transformer, validator]);

  const add = useCallback(() => {
    if (allowAdd) {
      let _item = input;
      if (transformer) _item = transformer(input);
      onAdd(_item);
      setInput("");
    }
  }, [allowAdd, input, onAdd, transformer]);

  const remove = useCallback(
    (item: string) => {
      onRemove(item);
    },
    [onRemove],
  );

  return (
    <div className={styles.container}>
      <div>
        <Input
          label={placeholder}
          name={"input"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") add();
          }}
          endAdornment={
            <TextEndAdornment
              text={"Add"}
              disabled={!allowAdd}
              onClick={() => {
                add();
              }}
            />
          }
        />
      </div>
      {items.length > 0 ? (
        <div>
          {items.map((item: string, index: number) => (
            <div
              key={item + index}
              className={clsx("flex align-center justify-between", styles.item)}
            >
              <p>{item}</p>
              <RemoveButton onClick={() => remove(item)} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
