import React, { Component } from 'react'
import { connect } from 'react-redux'

import Slider from 'material-ui/Slider'
import Chip from 'material-ui/Chip'

const mapStateToProps = ({
  group, pair, state, g1rate, g2rate, g1proposal, g2proposal, role, money, selling
}) => ({
  group, pair, state, g1rate, g2rate, g1proposal, g2proposal, role, money, selling
})

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

const WaitingProposal = ({ 
  group, pair, state, g1rate, g2rate, g1proposal, g2proposal, role, money, selling
}) => {
  const g1max = Math.max(g1proposal, Math.trunc(money / g1rate))
  const g2max = Math.max(g2proposal, Math.trunc(money / g2rate))
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
        disabled={true}
      />
      <Chip style={styles.min}>0</Chip>
      <Chip style={styles.max}>{g2max}</Chip>
      <Slider
        style={styles.slider}
        min={0}
        max={g2max}
        step={1}
        value={g2proposal}
        disabled={true}
      />
    </div>
  )
}

export default connect(mapStateToProps)(WaitingProposal)
