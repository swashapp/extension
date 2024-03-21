import { useCallback, useState, useMemo, ReactNode } from 'react';

import { RemoveButton } from '../button/remove';
import { TextEndAdornment } from '../input/end-adornments/text-end-adornment';
import { Input } from '../input/input';

import '../../../static/css/components/text-list-management.css';

export function TextListManagement(props: {
  placeholder: string;
  items: string[];
  onAdd: (data: string) => void;
  onRemove: (data: string) => void;
  transformer?: (data: string) => string;
  validator?: (data: string) => boolean;
}): ReactNode {
  const { placeholder, items, onAdd, onRemove, transformer, validator } = props;

  const [input, setInput] = useState<string>('');

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
      setInput('');
    }
  }, [allowAdd, input, onAdd, transformer]);

  const remove = useCallback(
    (item: string) => {
      onRemove(item);
    },
    [onRemove],
  );

  return (
    <div className={'text-list-container'}>
      <div className={`text-input`}>
        <Input
          label={placeholder}
          name={'input'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') add();
          }}
          endAdornment={
            <TextEndAdornment
              text={'Add'}
              disabled={!allowAdd}
              onClick={() => {
                add();
              }}
            />
          }
        />
      </div>
      {items.length > 0 ? (
        <div className={'text-list-items'}>
          {items.map((item: string, index: number) => (
            <div
              key={item + index}
              className={'flex align-center justify-between text-list-item'}
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
