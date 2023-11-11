import React, {
  useCallback,
  useState,
  SetStateAction,
  Dispatch,
  useMemo,
} from 'react';

import { RemoveButton } from '../button/remove';
import { AddEndAdornment } from '../input/end-adornments/add-end-adornment';
import { Input } from '../input/input';

export function TextListManagement({
  items,
  setItems,
  placeholder,
  transformer,
  validator,
}: {
  items: string[] | null;
  setItems: Dispatch<SetStateAction<string[] | null>>;
  placeholder: string;
  transformer?: (data: string) => string;
  validator?: (data: string) => boolean;
}): JSX.Element {
  const [input, setInput] = useState<string>('');

  const onAdd = useCallback(
    (item: string) => {
      let _item = item;
      if (transformer) _item = transformer(item);

      setItems((_items) => {
        const list = _items || [];
        list?.unshift(_item);
        return list?.slice();
      });
      setInput('');
    },
    [setItems, transformer],
  );

  const onRemove = useCallback(
    (index: number) =>
      setItems((_items) => {
        const list = _items || [];
        list.splice(index, 1);
        return list.slice();
      }),
    [setItems],
  );

  const allowAdd = useMemo(() => {
    if (!input) return false;
    if (
      (items || []).find((item: string) => {
        let _input = input;
        if (transformer) _input = transformer(input);

        return item === _input;
      })
    )
      return false;
    return !(validator && !validator(input));
  }, [input, items, transformer, validator]);

  return (
    <div className={'text-list-container'}>
      <div className={`text-input`}>
        <Input
          label={placeholder}
          name={'input'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && allowAdd && input) {
              onAdd(input);
            }
          }}
          endAdornment={
            <AddEndAdornment
              disabled={!allowAdd}
              onAdd={() => (allowAdd && input ? onAdd(input) : {})}
            />
          }
        />
      </div>
      <div className="text-list-items">
        {(items || []).map((item: string, index: number) => (
          <div key={item + index} className="text-list-item">
            {item}
            <RemoveButton onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}
