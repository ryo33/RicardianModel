import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'

import { accept, reject } from './actions'
import { calculateGain } from './util'

const mapStateToProps = ({
  group, proposer, selling, state,
  g1rate, g2rate, g1proposal, g2proposal, role, money
}) => ({
  group, proposer, selling, state,
  g1rate, g2rate, g1proposal, g2proposal, role, money,
  gain: calculateGain(proposer, selling, g1proposal, g1rate, g2proposal, g2rate),
})

const actionCreators = {
  accept, reject
}

class AnswerForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.accept = this.accept.bind(this)
    this.reject = this.reject.bind(this)
  }

  accept() {
    const { accept } = this.props
    accept()
  }

  reject() {
    const { reject } = this.props
    reject()
  }

  render() {
    const {
      group, proposer, selling, state, gain,
      g1rate, g2rate, g1proposal, g2proposal, role, money
    } = this.props
    return (
      <div>
        <p>材1を<strong>{g1proposal}</strong>{selling == 1 ? "輸出" : "輸入"}し、材2を<strong>{g2proposal}</strong>{selling == 2 ? "輸出" : "輸入"}します。</p>
        <p>あなたの利得は<strong>{gain}</strong>です。</p>
        <p>この提案を承認するか拒否するか選択してください。</p>
        <RaisedButton
          primary={true}
          label="承認"
          onClick={this.accept}
        />
        <RaisedButton
          secondary={true}
          label="拒否"
          onClick={this.reject}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(AnswerForm)
