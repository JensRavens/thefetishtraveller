import * as React from 'react';

interface Props {
  value?: any | null;
  editValue?: string;
  onChange?: (string) => void;  
  onBlur?: (string) => void;
  editable?: boolean;
  placeholder?: string;
}

interface State {
  editing: boolean;
}

export default class Editable extends React.Component<Props, State> {
  static defaultProps = {editable: true};
  state = {editing: false};
  element: HTMLElement | null;

  constructor(props) {
    super(props);
    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  render() {
    const {value, editValue, onChange, editable, placeholder} = this.props;
    if(!editable) { return value; }
    return (
      <span ref={el => this.element = el} className="editable" data-placeholder={placeholder} contentEditable onInput={this.onInput} onFocus={() => this.setState({editing: true})} onBlur={this.onBlur} dangerouslySetInnerHTML={{__html: ((editable && editValue) || value || '').toString()}}></span>
    )
  }

  componentDidUpdate() {
    if(!this.state.editing) {
      this.element && (this.element.innerText = this.props.value);
    }
  }

  shouldComponentUpdate(props) {
    return !this.state.editing;
  }

  private onInput(event: React.FormEvent<HTMLSpanElement>) {
    this.setState({editing: true});
    const onChange = this.props.onChange;
    if(!onChange) { return; }
    const text = (event.target as HTMLSpanElement).innerText;
    onChange(text);
  }

  private onBlur(event: React.FormEvent<HTMLSpanElement>) {
    this.setState({editing: false});
    const onBlur = this.props.onBlur;
    if(!onBlur) { return; }
    const text = (event.target as HTMLSpanElement).innerText;
    onBlur(text);
  }
}
