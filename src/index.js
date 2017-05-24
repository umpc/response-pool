// response-pool: CSP-based result queue
// Copyright (c) Justin Lowery 2017. MIT License. See LICENSE file in the library's root directory.

import { chan, buffers, go, put, take } from 'js-csp';

export default class ResponsePool {
  constructor(bufSize) {
    this.reset(bufSize);
  }
  reset(bufSize = 1) {
    this.pending = 0;
    this.waiting = 0;
    if (this.chan) this.chan.close();
    this.chan = chan(buffers.sliding(bufSize));
  }

  addPending() { this.pending++; }
  isPending() { return this.pending > 0; }
  done() { if (this.isPending()) this.pending--; }

  pubVal(val, cb) {
    if (this.waiting > 0) go(putVal, [this.chan, val]);
    if (cb) cb(val);
  }
  subVal(cb) {
    go(valWait, [this, cb]);
  }
}

function* putVal(ch, val) { yield put(ch, val); }

function* valWait(rPool, cb) {
  rPool.waiting++;
  const val = yield take(rPool.chan);
  rPool.waiting--;

  rPool.pubVal(val, cb);
}