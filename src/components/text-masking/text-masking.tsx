import React, {
  useCallback,
  useState,
  SetStateAction,
  Dispatch,
  memo,
} from 'react';

import RemoveButton from '../button/remove';
import AddEndAdornment from '../input/end-adornments/add-end-adornment';
import Input from '../input/input';

export default memo(function TextMasking({
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
          onKeyPress={(e) => {
            if (e.key === 'Enter' && mask) {
              onAdd(mask);
            }
          }}
          endAdornment={
            <AddEndAdornment onAdd={() => (mask ? onAdd(mask) : {})} />
          }
        />
      </div>
      <div className="text-masking-items">
        {items.map((item: string, index: number) => (
          <div key={item + index} className="text-masking-item">
            {item}
            <RemoveButton onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
});
