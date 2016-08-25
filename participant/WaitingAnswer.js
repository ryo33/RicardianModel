import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({
  group, state, g1rate, g2rate, g1proposal, g2proposal, role, money
}) => ({
  group, state, g1rate, g2rate, g1proposal, g2proposal, role, money
})

const WaitingAnswer = ({ 
  group, state, g1rate, g2rate, g1proposal, g2proposal, role, money
}) => {
  return (
    <div>
      <p>相手の返答を待っています。</p>
    </div>
  )
}

export default connect(mapStateToProps)(WaitingAnswer)
