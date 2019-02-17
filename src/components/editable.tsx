import React from 'react';

interface Props {
  value?: any | null;
  editValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  editable?: boolean;
  placeholder?: string;
}

interface State {
  editing: boolean;
}

export default class Editable extends React.Component<Props, State> {
  public static defaultProps = { editable: true };
  public state = { editing: false };
  private element: HTMLElement | null = null;

  public render() {
    const { value, editable, placeholder } = this.props;
    if (!editable) {
      return value;
    }
    const html = this.editValue;
    return (
      <span
        ref={el => (this.element = el)}
        className="editable"
        data-placeholder={placeholder}
        contentEditable
        onInput={this.onInput}
        onFocus={() => this.setState({ editing: true })}
        onBlur={this.onBlur}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  get editValue(): string {
    const { editValue, value } = this.props;
    return (editValue || value || '').toString();
  }

  public componentDidUpdate() {
    const element = this.element;
    if (!this.state.editing && element) {
      element.innerText = this.editValue;
    }
  }

  public shouldComponentUpdate(_: Props) {
    return !this.state.editing;
  }

  private onInput = (event: React.FormEvent<HTMLSpanElement>) => {
    this.setState({ editing: true });
    const onChange = this.props.onChange;
    if (!onChange) {
      return;
    }
    const text = (event.target as HTMLSpanElement).innerText;
    onChange(text);
  };

  private onBlur = (event: React.FormEvent<HTMLSpanElement>) => {
    this.setState({ editing: false });
    const onBlur = this.props.onBlur;
    if (!onBlur) {
      return;
    }
    const text = (event.target as HTMLSpanElement).innerText;
    onBlur(text);
  };
}
