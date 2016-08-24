import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import { changePage, changeGoods } from './actions'

const reducer = concatenateReducers([
  handleActions({
    'update contents': (_, { payload }) => payload,
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
    [changeGoods]: (_, { payload }) => ({ selling: payload })
  }, {}),
  handleAction('update contents', () => ({ loading: false }), { loading: true })
])

export default reducer
