import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Slider from 'material-ui/Slider'
import Chip from 'material-ui/Chip'

import { updateG1, updateG2 } from './actions'

const mapStateToProps = ({
  group, pair, state, g1rate, g2rate, g1proposal, g2proposal, role, money, selling
}) => ({
  group, pair, state, g1rate, g2rate, g1proposal, g2proposal, role, money, selling
})

const actionCreators = {
  updateG1, updateG2
}

const styles = {
  min: {
    float: "left"
  },
  max: {
    float: "right"
  },
  slider: {
    clear: "both"
  }
}

class ProposalForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.changeG1 = this.changeG1.bind(this)
    this.changeG2 = this.changeG2.bind(this)
  }

  changeG1(event, value) {
    const { updateG1 } = this.props
    updateG1(value)
  }

  changeG2(event, value) {
    const { updateG2 } = this.props
    updateG2(value)
  }

  render () {
    const { 
      group, pair, state, role, money, selling,
      g1rate, g2rate, g1proposal, g2proposal,
    } = this.props

    let g1max, g2max

    if (selling == 1) {
      // Selling g1
      g1max = Math.min(money / g1rate, pair.money / pair.g1rate)
      g2max = money / g2rate
    } else {
      // Selling g2
      g1max = money / g1rate
      g2max = money / pair.g2raite
    }
    g1max = Math.trunc(g1max)
    g2max = Math.trunc(g2max)
    return (
      <div>
        <Chip style={styles.min}>0</Chip>
        <Chip style={styles.max}>{g1max}</Chip>
        <Slider
          style={styles.slider}
          min={0}
          max={g1max}
          step={1}
          value={g1proposal}
          onChange={this.changeG1}
        />
        <Chip style={styles.min}>0</Chip>
        <Chip style={styles.max}>{g2max}</Chip>
        <Slider
          style={styles.slider}
          min={0}
          max={g2max}
          step={1}
          value={g2proposal}
          onChange={this.changeG2}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(ProposalForm)
