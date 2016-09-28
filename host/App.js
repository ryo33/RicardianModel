import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchContents } from './actions'

import PageButtons from './PageButtons'
import MatchingButton from './MatchingButton'
import DownloadButton from './DownloadButton'
import Information from './Information'

import Divider from 'material-ui/Divider'

const mapStateToProps = ({ loading, participants, groups, page }) => ({
  loading, participants, groups, page
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
    const { loading, participants, groups, page } = this.props
    if (loading) {
      return <p>ロード中です</p>
    } else {
      return <div>
        <PageButtons />
        <Divider
           style={{
            marginTop: "5%",
            marginBottom: "5%"
          }}
         />
        <Information /><br />
        <MatchingButton />
        <DownloadButton
          fileName={"ricardian_model.csv"}
          list={[
            ["リカーディアンモデル"],
            ["実験日", new Date()],
            ["登録者数", Object.keys(participants).length],
            ["グループ数", Object.keys(groups).length],
            ["ID", "利得"],
          ].concat(
            Object.keys(participants).map(id => [id, participants[id].money])
          )}
          style={{marginLeft: '2%'}}
          disabled={page != "result"}
        />
      </div>
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
