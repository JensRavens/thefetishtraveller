import * as React from 'react';

interface Props {
  value?: any | null;
  onChange?: (string) => void;  
  editable?: boolean;
  placeholder?: string;
}

interface State {
  editing: boolean;
}

export default class Editable extends React.Component<Props, State> {
  static defaultProps = {editable: true};
  state = {editing: false};

  constructor(props) {
    super(props);
    this.onInput = this.onInput.bind(this);
  }

  render() {
    const {value, onChange, editable, placeholder} = this.props;
    if(!editable) { return value; }
    return (
      <span className="editable" data-placeholder={placeholder} contentEditable onInput={this.onInput} onFocus={() => this.setState({editing: true})} onBlur={() => this.setState({editing: false})} dangerouslySetInnerHTML={{__html: (value || '').toString()}}></span>
    )
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
}
