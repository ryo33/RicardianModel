import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import { Step, Stepper, StepButton } from 'material-ui/Stepper'

import { submitPage, nextPage, previousPage } from './actions'

import { getPage } from 'util/index'

const pages = ["waiting", "description", "experiment", "result"]

const mapStateToProps = ({ page }) => ({
  page
})

const actionCreators = {
  nextPage, previousPage, submitPage
}

class PageButtons extends Component {
  changePage(page) {
    const { dispatch } = this.props
    dispatch(submitPage(page))
  }

  render() {
    const { page, nextPage, previousPage, submitPage } = this.props
    const buttons = []
    for (let i = 0; i < pages.length; i ++) {
      buttons[i] = (
        <Step key={i}>
          <StepButton
            onClick={() => submitPage(pages[i])}
          >{getPage(pages[i])}</StepButton>
        </Step>
      )
    }
    return (
      <span>
        <Stepper activeStep={pages.indexOf(page)} linear={false}>
          {buttons}
        </Stepper>
        <FlatButton onClick={previousPage} style={{ marginLeft: '3%' }} disabled={pages.indexOf(page) == 0}>戻る</FlatButton>
        <RaisedButton onClick={nextPage} primary={true} style={{ marginLeft: '3%' }}>次へ</RaisedButton>
      </span>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(PageButtons)
