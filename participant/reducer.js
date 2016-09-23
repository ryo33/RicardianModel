import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import { changePage, changeGoods } from './actions'

const reducer = concatenateReducers([
  handleActions({
    'update contents': (_, { payload }) => payload,
    'joined': (_, { payload }) => ({ joined: payload }),
    'update ranking': (_, { payload }) => ({ ranking: payload }),
    'change page': (_, { payload }) => ({ page: payload }),
    'matched': (_, { payload }) => payload,
    'change proposal': (_, { payload: { number, value } }) => {
      switch (number) {
        case 1:
          return {
            g1proposal: value
          }
        case 2:
          return {
            g2proposal: value
          }
      }
    },
    'proposed': (_, { payload }) => payload,
    'change state': (_, { payload }) => ({ state: payload }),
    'rejected': (_, { payload }) => payload,
    'accepted': (_, { payload }) => payload,
    [changeGoods]: (_, { payload }) => ({
      selling: payload
    })
  }, {
    ranking: []
  }),
  handleAction('update contents', () => ({ loading: false }), { loading: true }),
  handleActions({
    [changeGoods]: () => ({
      g1proposal: 0,
      g2proposal: 0
    }),
    'accepted': () => ({
      g1proposal: 0,
      g2proposal: 0
    }),
  }, {})
])

export default reducer
