import React from 'react';

export interface Props {
  options: string[];
  selectedOption?: string;
  onChange?: (value: string) => void;
}

export default class FilterBar extends React.Component<Props> {
  public render() {
    const { options, selectedOption, onChange } = this.props;
    return (
      <div className="filter-bar">
        {options.map(e => (
          <a
            key={e}
            className={`filter-bar__option filter-bar__option--${e ===
              selectedOption && 'selected'}`}
            onClick={() => onChange && onChange(e)}
          >
            {e}
          </a>
        ))}
      </div>
    );
  }
}
