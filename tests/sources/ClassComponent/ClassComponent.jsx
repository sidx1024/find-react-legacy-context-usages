// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

export default class ClassComponent extends React.Component {
  props = {};

  static contextTypes = {
    currentUser: PropTypes.object,
    currentTeam: PropTypes.object,
    location: PropTypes.object,
    router: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    currentUser: PropTypes.object,
    currentTeam: PropTypes.object,
    location: PropTypes.object,
    router: PropTypes.object,
  };

  render() {
    const location = this.context.router.location;
    const { currentUser } = this.context;

    return <Bro><Route prop={{ color: 'red' }}></Route></Bro>
  }
}
