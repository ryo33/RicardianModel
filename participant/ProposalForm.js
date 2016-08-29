import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Slider from 'material-ui/Slider'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import Left from 'material-ui/svg-icons/navigation/arrow-back'
import Right from 'material-ui/svg-icons/navigation/arrow-forward'

import { updateG1, updateG2, switchGoods, propose, addG1, addG2 } from './actions'

import { calculateGain } from './util'

const mapStateToProps = ({
  group, pair, state, g1rate, g2rate, g1proposal, g2proposal, role, money, selling
}, { proposer }) => ({
  group, pair, state, g1rate, g2rate, g1proposal, g2proposal, role, money, selling,
  g1max: Math.trunc(proposer == (selling == 1) ? money / g1rate : pair.money / pair.g1rate),
  g2max: Math.trunc(proposer == (selling == 2) ? money / g2rate : pair.money / pair.g2rate),
  gain: calculateGain(proposer, selling, g1proposal, g1rate, g2proposal, g2rate),
  g1reversed: (proposer && selling == 2) || (!proposer && selling == 1),
  g2reversed: (proposer && selling == 1) || (!proposer && selling == 2),
})

const actionCreators = {
  updateG1, updateG2, switchGoods, propose, addG1, addG2
}

const styles = {
  switchGoods: {
    margin: "2% 0%",
    clear: "both",
    display: "inline-block"
  },
  sliderInner: {
    marginTop: "1%",
    marginBottom: "1%",
  },
  min: {
    marginTop: "-2%",
    marginBottom: "4%",
    float: "left"
  },
  max: {
    marginTop: "-2%",
    marginBottom: "4%",
    float: "right"
  },
  sliderGroup: {
    margin: "0% 0%"
  },
  slider: {
    clear: "both",
    color: "#FF0"
  },
  trade: {
    float: "left",
    textAlign: "center",
    margin: "0px"
  },
  increase: {
    color: "#2b2"
  },
  decrease: {
    color: "#b22"
  },
  chip: {
    display: "inline-block",
  },
}

function renderGain(gain) {
  if (gain == 0) {
    return <span>±0</span>
  } else if (gain > 0) {
    return <span style={styles.increase}>+{gain}</span>
  } else {
    return <span style={styles.decrease}>{gain}</span>
  }
}

const OnlyProposer = ({ proposer, children }) => {
  if (proposer) {
    return children
  } else {
    return null
  }
}

const Gain = ({ style, money, gain }) => (
  <div style={style}>
    <p>
      あなたの所持金<strong>{money}</strong>
      <span style={{margin: "0% 1%"}}>→</span>
      <strong><strong>{money + gain}</strong></strong>
      <span style={{margin: "0% 1%"}}>(</span>
      <strong><strong>{renderGain(gain)}</strong></strong>
      <span style={{margin: "0% 1%"}}>)</span>
    </p>
  </div>
)

class ProposalForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.changeG1 = this.changeG1.bind(this)
    this.changeG2 = this.changeG2.bind(this)
    this.incrementG1 = this.incrementG1.bind(this)
    this.decrementG1 = this.decrementG1.bind(this)
    this.incrementG2 = this.incrementG2.bind(this)
    this.decrementG2 = this.decrementG2.bind(this)
    this.switchGoods = this.switchGoods.bind(this)
    this.propose = this.propose.bind(this)
  }

  changeG1(event, value) {
    const { updateG1 } = this.props
    updateG1(value)
  }

  changeG2(event, value) {
    const { updateG2 } = this.props
    updateG2(value)
  }

  switchGoods() {
    const { switchGoods } = this.props
    switchGoods()
  }

  propose() {
    const { propose, selling, g1proposal, g2proposal } = this.props
    propose(selling, g1proposal, g2proposal)
  }

  incrementG1() {
    const { addG1 } = this.props
    addG1(1)
  }

  decrementG1() {
    const { addG1 } = this.props
    addG1(-1)
  }

  incrementG2() {
    const { addG2 } = this.props
    addG2(1)
  }

  decrementG2() {
    const { addG2 } = this.props
    addG2(-1)
  }

  calculatePosition(reversed, value) {
    if (reversed) {
      return 100 - value
    } else {
      return value
    }
  }

  render () {
    const { 
      group, pair, state, role, money, selling,
      g1rate, g2rate, g1proposal, g2proposal,
      g1max, g2max, gain,
      g1reversed, g2reversed,
      proposer
    } = this.props

    return (
      <div>
        <p>あなたの材2の交換レートは<strong>{g1rate}</strong>、材2の交換レートは<strong>{g2rate}</strong>です。</p>
        {
          proposer
            ? <div>
              <p>提案内容を入力したら提案ボタンをクリックしてください。</p>
            </div>
            : <div>
              <p>相手が提案内容を検討しています。</p>
              <p>しばらくお待ちください。</p>
            </div>
        }
        <div style={styles.sliderGroup}>
          <div
            style={{
              display: "inline-block",
              padding: "0%",
              position: "relative",
              left: this.calculatePosition(g1reversed, g1proposal * 100 / g1max) + "%",
              transform: "translate(-50%, 0%)",
              WebkitTransform: "translate(-50%, 0%)",
              width: "auto",
            }}
          >
            <OnlyProposer
              proposer={proposer}
              children={<Chip
                style={styles.chip}
                onTouchTap={g1reversed ? this.incrementG1 : this.decrementG1}
              >{"<"}</Chip>}
            />
            <Chip style={styles.chip}>{g1proposal}</Chip>
            <OnlyProposer
              proposer={proposer}
              children={<Chip
                style={styles.chip}
                onTouchTap={g1reversed ? this.decrementG1 : this.incrementG1}
              >{">"}</Chip>}
            />
          </div>
          <Slider
            axis={ g1reversed ? 'x-reverse' : 'x' }
            style={styles.slider}
            min={0}
            max={g1max}
            step={1}
            disabled={!proposer}
            value={g1proposal}
            onChange={this.changeG1}
            sliderStyle={styles.sliderInner}
          />
          <p
            style={!g1reversed ? styles.min : styles.max}
          >0</p>
          <p
            style={g1reversed ? styles.min : styles.max}
          >{g1max + " (" + (selling == 1 ? "輸出量" : "輸入量") + ")"}</p>
        </div>
        {
          proposer
            ? <RaisedButton
              style={styles.switchGoods}
              label="輸出入の反転"
              onClick={this.switchGoods}
            />
            : null
        }
        <div style={styles.sliderGroup}>
          <div
            style={{
              clear: "both",
              display: "inline-block",
              padding: "0%",
              position: "relative",
              left: this.calculatePosition(g2reversed, g2proposal * 100 / g2max) + "%",
              transform: "translate(-50%, 0%)",
              WebkitTransform: "translate(-50%, 0%)",
              width: "auto",
              merginTop: "0px",
            }}
          >
            <OnlyProposer
              proposer={proposer}
              children={<Chip
                style={styles.chip}
                onTouchTap={g2reversed ? this.incrementG2 : this.decrementG2}
              >{"<"}</Chip>}
            />
            <Chip style={styles.chip}>{g2proposal}</Chip>
            <OnlyProposer
              proposer={proposer}
              children={<Chip
                style={styles.chip}
                onTouchTap={g2reversed ? this.decrementG2 : this.incrementG2}
              >{">"}</Chip>}
            />
          </div>
          <Slider
            axis={ g2reversed ? 'x-reverse' : 'x' }
            style={styles.slider}
            min={0}
            max={g2max}
            step={1}
            disabled={!proposer}
            value={g2proposal}
            onChange={this.changeG2}
            sliderStyle={styles.sliderInner}
          />
          <p
            style={!g2reversed ? styles.min : styles.max}
          >0</p>
          <p
            style={g2reversed ? styles.min : styles.max}
          >{g2max + " (" + (selling == 2 ? "輸出量" : "輸入量") + ")"}</p>
        </div>
        <Gain
          style={{clear: "both"}}
          money={money}
          gain={gain}
        />
        {
          proposer
            ? <RaisedButton
              primary={true}
              label="提案"
              onClick={this.propose}
            />
            : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(ProposalForm)
