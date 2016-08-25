import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import { changePage } from './actions'

const reducer = concatenateReducers([
  handleActions({
    'update contents': (_, { payload }) => payload,
    [changePage]: (_, { payload }) => ({ page: payload }),
    'join': ({ participants }, { payload: { id, participant } }) => ({
      participants: Object.assign({}, participants, {[id]: participant})
    }),
    'matched': (_, { payload: { participants, groups } }) => ({
      participants, groups, investmentLog: []
    }),
    'proposed': ({ groups }, { payload: { groupID, state, g1proposal, g2proposal } }) => {
      const newGroups = Object.assign({}, groups, {
        [groupID]: Object.assign({}, groups[groupID], {
          state, g1proposal, g2proposal
        })
      })
      return {
        groups: newGroups
      }
    },
    'change state': ({ groups }, { payload: { groupID, state } }) => {
      return {
        groups: Object.assign({}, groups, {
          [groupID]: Object.assign({}, groups[groupID], { state })
        })
      }
    },
    'accepted': ({ groups, participants }, { payload: { groupID, round, state, u1money, u2money } }) => {
      const group = groups[groupID]
      const newGroups = Object.assign({}, groups, {
        [groupID]: Object.assign({}, group, { state, round })
      })
      const newParticipants = Object.assign({}, participants, {
        [group.u1]: Object.assign({}, participants[group.u1], {
          money: u1money
        }),
        [group.u2]: Object.assign({}, participants[group.u2], {
          money: u2money
        }),
      })
      return {
        groups: newGroups,
        participants: newParticipants
      }
    },
  }, {}),
  handleAction('update contents', () => ({ loading: false }), { loading: true })
])

export default reducer
