import * as React from 'react';

interface Props<T extends Object> {
  model?: T;
  onChange?: (T)=>void;
  onSubmit?: (T)=>void;
}

interface FormState<T> {
  model: Partial<T>;
}

export const Context = (React as any).createContext('form');

export default class Form<T> extends React.Component<Props<T>, FormState<T>> {
  form: HTMLFormElement | null = null;
  state = {model: {}};

  render() {
    const {model, onChange, onSubmit} = this.props;
    return (
      <form onSubmit={(event: any) => this.submit(event)} ref={el => this.form = el}>
        <Context.Provider value={this}>
          {this.props.children}
        </Context.Provider>
      </form>
    )
  }

  valueForName<Key extends keyof T>(name: Key): T[Key] | undefined {
    return this.model[name];
  }

  change() {
    const model = this.serialize();
    this.setState({model})
    this.props.onChange && this.props.onChange(model);
  }

  private get model(): Partial<T> {
    return this.props.model || this.state.model;
  }

  private submit(event: Event) {
    event.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.model);
  }

  private serialize(): Partial<T> {
    const values = {};
    const form = this.form!
    for (let i = 0; i < form.elements.length; i++) {
      const element = form.elements[i] as HTMLInputElement;
      if(element.name.length > 0) {
        values[element.name] = element.value;
      }
    }
    return values;
  }
}
