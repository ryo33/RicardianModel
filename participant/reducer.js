import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import { changePage } from './actions'

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
    }
  }, {}),
  handleAction('update contents', () => ({ loading: false }), { loading: true })
])

export default reducer
