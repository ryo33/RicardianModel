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
  }, {}),
  handleAction('update contents', () => ({ loading: false }), { loading: true })
])

export default reducer
