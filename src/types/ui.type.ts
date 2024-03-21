export type MultiPageRef = {
  back: (page?: number) => void;
  next: (page?: number) => void;
};

export type SelectItem = { value: string; display: string; icon?: string };
