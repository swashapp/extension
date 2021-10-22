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

export function TextMasking({
  items,
  setItems,
}: {
  items: string[] | null;
  setItems: Dispatch<SetStateAction<string[] | null>>;
}): JSX.Element {
  const [mask, setMask] = useState<string>('');
  const onAdd = useCallback(
    (item: string) =>
      setItems((_items) => {
        const list = _items || [];
        list?.unshift(item);
        return list?.slice();
      }),
    [setItems],
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
  const allowAdd = useMemo(
    () => mask && !(items || []).find((item: string) => item === mask),
    [items, mask],
  );
  return (
    <div className={'text-masking-container'}>
      <div className="text-masking-input">
        <Input
          label="Mask It"
          name="MaskIt"
          value={mask}
          onChange={(e) => setMask(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && allowAdd && mask) {
              onAdd(mask);
            }
          }}
          endAdornment={
            <AddEndAdornment
              disabled={!allowAdd}
              onAdd={() => (allowAdd && mask ? onAdd(mask) : {})}
            />
          }
        />
      </div>
      <div className="text-masking-items">
        {(items || []).map((item: string, index: number) => (
          <div key={item + index} className="text-masking-item">
            {item}
            <RemoveButton onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}
