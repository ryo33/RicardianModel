import React, { Component } from 'react'
import { connect } from 'react-redux'

import Slider from 'material-ui/Slider'
import Chip from 'material-ui/Chip'

import ProposalForm from './ProposalForm'

const WaitingProposal = () => (
  <div>
    <ProposalForm
      proposer={false}
    />
  </div>
)

export default WaitingProposal
