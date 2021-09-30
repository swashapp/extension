import Input from '../input/input';
import RemoveButton from '../button/remove';
import React, { useCallback, useState, SetStateAction, Dispatch } from 'react';
import AddEndAdornment from '../input/end-adronments/add-end-adornment';

export default function TextMasking({
  items,
  setItems,
}: {
  items: string[];
  setItems: Dispatch<SetStateAction<string[]>>;
}) {
  const [mask, setMask] = useState<string>();
  const onAdd = useCallback(
    (item: string) =>
      setItems((_items) => {
        _items.unshift(item);
        return _items.slice();
      }),
    [setItems],
  );
  const onRemove = useCallback(
    (index: number) =>
      setItems((_items) => {
        _items.splice(index, 1);
        return _items.slice();
      }),
    [setItems],
  );
  return (
    <div className={'text-masking-container'}>
      <div className="text-masking-input">
        <Input
          label="Mask It"
          name="MaskIt"
          value={mask}
          onChange={(e) => setMask(e.target.value)}
          endAdornment={
            <AddEndAdornment onAdd={() => (mask ? onAdd(mask) : {})} />
          }
        />
      </div>
      <div className="text-masking-items">
        {items.map((item: string, index: number) => (
          <div className="text-masking-item">
            {item}
            <RemoveButton onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}
