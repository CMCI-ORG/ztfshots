export interface Source {
  id: string;
  title: string;
  url?: string;
}

export interface SourceFieldsProps {
  control: any;
  setValue: (name: string, value: any, options?: any) => void;
}