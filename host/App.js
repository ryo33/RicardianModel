import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchContents } from './actions'

import PageButtons from './PageButtons'
import MatchingButton from './MatchingButton'
import Information from './Information'

const mapStateToProps = ({ loading }) => ({
  loading
})

const mapDispatchToProps = (dispatch) => ({
  fetchContents: bindActionCreators(fetchContents, dispatch)
})

const styles = {
  matchingButton: {
    float: "right"
  }
}

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  componentDidMount() {
    const { fetchContents } = this.props
    fetchContents()
  }

  render() {
    const { loading } = this.props
    if (loading) {
      return <p>ロード中です</p>
    } else {
      return <div>
        <PageButtons />
        <MatchingButton style={styles.matchingButton}/>
        <Information />
      </div>
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
