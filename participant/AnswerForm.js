import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({
  group, state, g1rate, g2rate, g1proposal, g2proposal, role, money
}) => ({
  group, state, g1rate, g2rate, g1proposal, g2proposal, role, money
})

const AnswerForm = ({ 
  group, state, g1rate, g2rate, g1proposal, g2proposal, role, money
}) => (
<div>

</div>
)

export default connect(mapStateToProps)(AnswerForm)
