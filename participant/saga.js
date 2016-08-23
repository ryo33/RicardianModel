import { put, take, call, select, fork, race } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { fetchContents, updateG1, updateG2, changeProposal } from './actions'

const INTERVAL = 100 // ten per a second

function* fetchContentsSaga() {
  while (true) {
    yield take(`${fetchContents}`)
    yield call(sendData, 'fetch contents')
  }
}

function* watchProposal(action, num) {
  let countDown = 0
  let lastTime = Date.now()
  let lastAction = null
  while (true) {
    const winner = yield race({
      action: take(action),
      timeout: countDown ? call(delay, countDown) : null
    })
    const now = Date.now()
    countDown -= now - lastTime
    lastTime = now
    if (winner.action) {
      lastAction = winner.action
      const { payload } = lastAction
      yield put(changeProposal(num, payload))
    }
    if (lastAction && countDown <= 0) {
      const { payload } = lastAction
      yield call(sendData, 'update proposal', {
        number: num, value: payload
      })
      lastAction = null
      countDown = INTERVAL
    }
  }
}

function* saga() {
  yield fork(fetchContentsSaga)
  yield fork(watchProposal, `${updateG1}`, 1)
  yield fork(watchProposal, `${updateG2}`, 2)
}

export default saga
