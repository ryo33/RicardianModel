import { createAction } from 'redux-actions'

export const fetchContents = createAction('fetch contents')

export const updateG1 = createAction('update g1', value => value)
export const updateG2 = createAction('update g2', value => value)
export const changeProposal = createAction('change proposal', (number, value) => ({ number, value }))
