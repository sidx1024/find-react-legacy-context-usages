// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

function FunctionalComponent(): JSX.Element {}

FunctionalComponent.contextTypes = {
  currentUser: PropTypes.object,
  currentTeam: PropTypes.object,
  location: PropTypes.object,
  router: PropTypes.object.isRequired,
};

FunctionalComponent.childContextTypes = {
  currentUser: PropTypes.object,
  currentTeam: PropTypes.object,
  location: PropTypes.object,
  router: PropTypes.object,
};
