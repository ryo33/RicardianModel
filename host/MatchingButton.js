import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionCached from 'material-ui/svg-icons/action/cached'

import { match } from './actions'

class MatchingButton extends Component {
  handleClick() {
    const { dispatch } = this.props
    dispatch(match())
  }

  render() {
    const { style } = this.props
    return (
      <FloatingActionButton
        style={style}
        onClick={this.handleClick.bind(this)}
      ><ActionCached /></FloatingActionButton>
    )
  }
}

export default connect()(MatchingButton)
