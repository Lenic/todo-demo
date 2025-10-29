export interface IFieldRendererEventArgs<T, TUpdateModel = T> {
  field: {
    value: T;
    name: string;
    onBlur: (e: Event) => void;
    onChange: (e: Event) => void;
    onInput: (e: Event) => void;
    'onUpdate:modelValue': (value: TUpdateModel) => void;
  };
}
