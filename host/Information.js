import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Card, CardHeader, CardText } from 'material-ui/Card'

import { openParticipantPage } from './actions'

const mapStateToProps = ({ participants, groups }) => ({
  participants, groups
})

const Expandable = ({title, children, initiallyExpanded=null}) => (
  <Card
    initiallyExpanded={initiallyExpanded}
  >
    <CardHeader
      title={title}
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardText expandable={true}>
      {children}
    </CardText>
  </Card>
)

const Users = ({ participants, openParticipantPage }) => (
  <table>
    <thead>
      <tr>
        <th>id</th><th>money</th>
      </tr>
    </thead>
    <tbody>
      {
        Object.keys(participants).map(id => {
          const p = participants[id]
          return <tr key={id}>
            <td><a onClick={openParticipantPage(id)}>{id}</a></td><td>{p.money}</td>
          </tr>
        })
      }
    </tbody>
  </table>
)

const Groups = ({ groups }) => (
  <table>
    <thead>
      <tr>
        <th>id</th><th>round</th><th>state</th>
      </tr>
    </thead>
    <tbody>
      {
        Object.keys(groups).map(id => {
          const g = groups[id]
          return <tr key={id}>
            <td>{id}</td><td>{g.round}</td><td>{g.state}</td>
          </tr>
        })
      }
    </tbody>
  </table>
)

const Information = ({ groups, participants, openParticipantPage }) => (
  <div>
    <Expandable
      title={"Users (" + Object.keys(participants).length + "人)"}
    >
      <Users
        participants={participants}
        openParticipantPage={openParticipantPage}
      />
    </Expandable>
    <Expandable
      title={"Groups (" + Object.keys(groups).length + ")"}
    >
      <Groups groups={groups} />
    </Expandable>
  </div>
)

const mapDispatchToProps = (dispatch) => {
  const open = bindActionCreators(openParticipantPage, dispatch)
  return {
    openParticipantPage: (id) => () => open(id)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Information)
