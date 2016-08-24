import { createAction } from 'redux-actions'

export const fetchContents = createAction('fetch contents')

export const updateG1 = createAction('update g1', value => value)
export const updateG2 = createAction('update g2', value => value)
export const changeProposal = createAction('change proposal', (number, value) => ({ number, value }))
export const switchGoods = createAction('switch goods')
export const changeGoods = createAction('change goods', goods => goods)

export const propose = createAction('propose', (goods, g1, g2) => ({goods, g1, g2}))

export const accept = createAction('accept')
export const reject = createAction('reject')
