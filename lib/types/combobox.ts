export type ComboboxOption = {
  id: number;
  label: string;
};

type BaseProps = {
  options: ComboboxOption[];

  search: string;
  onSearchChange: (v: string) => void;

  open: boolean;
  onOpenChange: (v: boolean) => void;

  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyText?: string;
};

export type SingleComboboxProps = BaseProps & {
  multiple?: false; // default single
  value: number | null;
  onChange: (value: number) => void;
};

export type MultiComboboxProps = BaseProps & {
  multiple: true;
  value: number[]; // wajib array
  onChange: (value: number[]) => void;
};

export type ComboboxProps = SingleComboboxProps | MultiComboboxProps;
