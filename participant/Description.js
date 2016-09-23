import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Card, CardText, CardTitle } from 'material-ui/Card'
import {List, ListItem} from 'material-ui/List'

const mapStateToProps = ({ }) => ({
})

const Description = ({ }) => (
  <Card>
    <CardTitle title="リカーディアンモデル" subtitle="ルールの説明" />
    <CardText>

    </CardText>
  </Card>
)
export default connect(mapStateToProps)(Description)