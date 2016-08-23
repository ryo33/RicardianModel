import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchContents } from './actions'

import Pages from './Pages'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = (dispatch) => ({
  fetchContents: bindActionCreators(fetchContents, dispatch)
})

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
      <p>ロード中です</p>
    } else {
      return <div>
        <Pages />
      </div>
    }
  }
}

export default connect(null, mapDispatchToProps)(App)
