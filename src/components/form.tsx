import React, { FormEvent } from 'react';

export interface FormContext {
  model: object;
  notify: (field: string, value: any) => void;
}

export const { Provider, Consumer } = React.createContext<
  FormContext | undefined
>(undefined);

interface Props<T> {
  model?: T;
  initialModel?: T;
  onSubmit?: (model: T) => void;
  onInput?: (model: T, key: string) => void;
}

interface State<T> {
  model: T;
}

export class Form<T extends object> extends React.Component<
  Props<T>,
  State<T>
> {
  constructor(props: Props<T>) {
    super(props);
    const model = props.model || props.initialModel || ({} as T);
    this.state = {
      model,
    };
  }

  public render() {
    const context: FormContext = {
      model: this.model,
      notify: this.notify,
    };
    return (
      <form onSubmit={this.submit}>
        <Provider value={context}>{this.props.children}</Provider>
      </form>
    );
  }

  private get model(): T {
    return this.props.model || this.state.model!;
  }

  private notify = (field: string, value: any) => {
    const model = { ...(this.model as object), [field]: value } as T;
    this.setState({ model });
    if (this.props.onInput) {
      this.props.onInput(model, field);
    }
  };

  private submit = (e: FormEvent) => {
    e.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit(this.model);
    }
  };
}
