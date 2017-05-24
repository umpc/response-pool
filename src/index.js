// response-pool: CSP-based result queue
// Copyright (c) Justin Lowery 2017. MIT License. See LICENSE file in the library's root directory.

import { chan, buffers, go, put, take } from 'js-csp';

export default class ResponsePool {
  constructor(bufSize = 1) {
    this.pending = 0;
    this.waiting = 0;
    this.chan = chan(buffers.sliding(bufSize));
  }

  resetCh() {
    if (this.pubPending()) delPending();
    this.chan.close();
    this.chan = chan();
  }

  addPending() { this.pending++; }
  delPending() { if (this.pending > 0) this.pending--; }
  pubPending() { return this.pending > 0; }

  pubResp(val, cb) {
    if (this.waiting > 0) go(putVal, [this, val]);
    if (cb) cb(val);
  }

  subResp(cb) {
    go(subRespWait, [this, cb]);
  }
}

function* putVal(rPool, val) {
  yield put(rPool.chan, val);
}

function* subRespWait(rPool, cb) {
  rPool.waiting++;
  const val = yield take(rPool.chan);
  rPool.waiting--;

  rPool.pubResp(val, cb);
}