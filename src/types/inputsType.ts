export type inputProps = {
  name?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  setValue: (fieldType: string, value: any) => void;
  reset: boolean;
};
