import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';

interface Props {
  id: string;
  resource?: any;
  select: (DB, string) => any;
  load: () => void;
  component: any;
}

function resourceLoader(component) {
  return function(props) {
    const {resource} = props;
    if(!resource) { return null };
    return component;
  }
}

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  const {select, load, component} = props;
  const resource = props.select(state, id);
  if(!resource) { load() };
  return {resource};
}

export default function wrap() {
  return function(component) {
    return connect(mapStateToProps)(resourceLoader(component))
  }
}