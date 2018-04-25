import * as React from 'react';

interface Props<T extends Object> {
  model: T;
  onChange?: (T)=>void;
  onSubmit?: (T)=>void;
}

const R = React as any;

export const Context = R.createContext('form');

declare const window: any;

export default class Form<T> extends React.Component<Props<T>> {
  form: HTMLFormElement | null = null;

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

  valueForName(name: string): any {
    return this.props.model[name];
  }

  change() {
    this.props.onChange && this.props.onChange(this.serialize());
  }

  private submit(event: Event) {
    event.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.serialize());
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
