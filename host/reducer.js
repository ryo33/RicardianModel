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
  }, {}),
  handleAction('update contents', () => ({ loading: false }), { loading: true })
])

export default reducer
