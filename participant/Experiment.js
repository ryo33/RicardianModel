import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProposalForm from './ProposalForm'
import AnswerForm from './AnswerForm'
import WaitingAnswer from './WaitingAnswer'

const mapStateToProps = ({
  group, state, g1rate, g2rate, g1proposal, g2proposal, role
}) => ({
  group, state, g1rate, g2rate, g1proposal, g2proposal, role
})

const Experiment = ({ 
  group, state, g1rate, g2rate, g1proposal, g2proposal, role
}) => {
  if (role == null) {
    return <div>
      <p>グループに参加できませんでした。</p>
      <p>しばらくお待ちください。</p>
    </div>
  } else {
    if ((state == 'u1thinking' && role == 'u1') || (state == 'u2thinking' && role == 'u2')) {
      // Thinking
      return <ProposalForm proposer={true} />
    } else if ((state == 'u1thinking' && role == 'u2') || (state == 'u2thinking' && role == 'u1')) {
      // Waiting for a proposal
      return <ProposalForm proposer={false} />
    } else if ((state == 'u1proposed' && role == 'u1') || (state == 'u2proposed' && role == 'u2')) {
      // Be Proposed
      return <AnswerForm />
    } else if ((state == 'u1proposed' && role == 'u2') || (state == 'u2proposed' && role == 'u1')) {
      // Waiting for an answer
      return <WaitingAnswer />
    }
  }
}

export default connect(mapStateToProps)(Experiment)
