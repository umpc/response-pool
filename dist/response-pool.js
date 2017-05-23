(function(e,t){'object'==typeof exports&&'object'==typeof module?module.exports=t():'function'==typeof define&&define.amd?define('response-pool',[],t):'object'==typeof exports?exports['response-pool']=t():e['response-pool']=t()})(this,function(){return function(e){function t(i){if(n[i])return n[i].exports;var a=n[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e['default']}:function(){return e};return t.d(n,'a',n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p='dist',t(t.s=24)}([function(e,t,n){'use strict';function i(e){return console.log('error in channel transformer',e.stack),u}function a(t,n,a){const e=(n||i)(a);return e!==u&&t.add(e),t}function s(t){return(e)=>({'@@transducer/step':(n,i)=>{try{return e['@@transducer/step'](n,i)}catch(i){return a(n,t,i)}},'@@transducer/result':(n)=>{try{return e['@@transducer/result'](n)}catch(i){return a(n,t,i)}}})}t.a=function(e,t,i){let a;if(t){if(!e)throw new Error('Only buffered channels can use transducers');a=t(h)}else a=h;return new c(n.i(o.e)(32),n.i(o.e)(32),e,s(i)(a))};var o=n(2),l=n(1),r=n(29);const d=64,p=1024,u=null;t.b=u;class c{constructor(e,t,n,i){this.buf=n,this.xform=i,this.takes=e,this.puts=t,this.dirtyTakes=0,this.dirtyPuts=0,this.closed=!1}put(e,t){if(e===u)throw new Error('Cannot put CLOSED on a channel.');if(!t.isActive())return null;if(this.closed)return t.commit(),new l.a(!1);if(this.buf&&!this.buf.isFull()){t.commit();const i=n.i(r.a)(this.xform['@@transducer/step'](this.buf,e));for(;0<this.buf.count()&&0<this.takes.length;){const e=this.takes.pop();e.isActive()&&n.i(r.b)(e.commit(),this.buf.remove())}return i&&this.close(),new l.a(!0)}for(;0<this.takes.length;){const i=this.takes.pop();if(i.isActive())return t.commit(),n.i(r.b)(i.commit(),e),new l.a(!0)}if(this.dirtyPuts>d?(this.puts.cleanup((e)=>e.handler.isActive()),this.dirtyPuts=0):this.dirtyPuts+=1,t.isBlockable()){if(this.puts.length>=p)throw new Error(`No more than ${p} pending puts are allowed on a single channel.`);this.puts.unboundedUnshift(new l.b(t,e))}return null}take(e){if(!e.isActive())return null;if(this.buf&&0<this.buf.count()){e.commit();const t=this.buf.remove();for(;0<this.puts.length&&!this.buf.isFull();){const e=this.puts.pop();e.handler.isActive()&&(n.i(r.b)(e.handler.commit(),!0),n.i(r.a)(this.xform['@@transducer/step'](this.buf,e.value))&&this.close())}return new l.a(t)}for(;0<this.puts.length;){const t=this.puts.pop();if(t.handler.isActive())return e.commit(),n.i(r.b)(t.handler.commit(),!0),new l.a(t.value)}if(this.closed)return e.commit(),new l.a(u);if(this.dirtyTakes>d?(this.takes.cleanup((e)=>e.isActive()),this.dirtyTakes=0):this.dirtyTakes+=1,e.isBlockable()){if(this.takes.length>=p)throw new Error(`No more than ${p} pending takes are allowed on a single channel.`);this.takes.unboundedUnshift(e)}return null}close(){if(!this.closed){if(this.closed=!0,this.buf)for(this.xform['@@transducer/result'](this.buf);0<this.buf.count()&&0<this.takes.length;){const e=this.takes.pop();e.isActive()&&n.i(r.b)(e.commit(),this.buf.remove())}n.i(r.c)(this.takes,(e)=>{e.isActive()&&n.i(r.b)(e.commit(),u)}),n.i(r.c)(this.puts,(e)=>{e.handler.isActive()&&n.i(r.b)(e.handler.commit(),!1)})}}isClosed(){return this.closed}}t.c=c;const h={'@@transducer/init':()=>{throw new Error('init not available')},'@@transducer/result':(e)=>e,'@@transducer/step':(e,t)=>{return e.add(t),e}}},function(e,t){'use strict';t.a=class{constructor(e){this.value=e}};t.b=class{constructor(e,t){this.handler=e,this.value=t}}},function(e,t){'use strict';function n(e,t,n,i,a){for(let s=0;s<a;s+=1)n[i+s]=e[t+s]}function i(e){if(0>=e)throw new Error('Can\'t create a ring buffer of size 0');return new a(0,0,0,Array(e))}t.e=i,t.a=function(e){return new s(i(e),e)},t.b=function(e){return new o(i(e),e)},t.c=function(e){return new l(i(e),e)},t.d=function(){return new r(r.NO_VALUE)};class a{constructor(e,t,n,i){this.head=e,this.tail=t,this.length=n,this.arr=i}pop(){if(0!==this.length){const e=this.arr[this.tail];return this.arr[this.tail]=void 0,this.tail=(this.tail+1)%this.arr.length,this.length-=1,e}}unshift(e){this.arr[this.head]=e,this.head=(this.head+1)%this.arr.length,this.length+=1}unboundedUnshift(e){this.length+1===this.arr.length&&this.resize(),this.unshift(e)}resize(){const e=2*this.arr.length,t=Array(e);this.tail<this.head?(n(this.arr,this.tail,t,0,this.length),this.tail=0,this.head=this.length,this.arr=t):this.tail>this.head?(n(this.arr,this.tail,t,0,this.arr.length-this.tail),n(this.arr,0,t,this.arr.length-this.tail,this.head),this.tail=0,this.head=this.length,this.arr=t):this.tail===this.head&&(this.tail=0,this.head=0,this.arr=t)}cleanup(e){for(let t=this.length;0<t;t-=1){const t=this.pop();e(t)&&this.unshift(t)}}}class s{constructor(e,t){this.buffer=e,this.n=t}isFull(){return this.buffer.length===this.n}remove(){return this.buffer.pop()}add(e){this.buffer.unboundedUnshift(e)}closeBuffer(){}count(){return this.buffer.length}}class o{constructor(e,t){this.buffer=e,this.n=t}isFull(){return!1}remove(){return this.buffer.pop()}add(e){this.buffer.length!==this.n&&this.buffer.unshift(e)}closeBuffer(){}count(){return this.buffer.length}}class l{constructor(e,t){this.buffer=e,this.n=t}isFull(){return!1}remove(){return this.buffer.pop()}add(e){this.buffer.length===this.n&&this.remove(),this.buffer.unshift(e)}closeBuffer(){}count(){return this.buffer.length}}class r{constructor(e){this.value=e}isFull(){return!1}remove(){return this.value}add(e){r.isUndelivered(this.value)&&(this.value=e)}closeBuffer(){r.isUndelivered(this.value)&&(this.value=null)}count(){return r.isUndelivered(this.value)?0:1}}r.NO_VALUE='@@PromiseBuffer/NO_VALUE',r.isUndelivered=(e)=>r.NO_VALUE===e},function(e,t,n){var i=n(18);e.exports=function(e,t){for(var n=e.length;n--;)if(i(e[n][0],t))return n;return-1}},function(e,t,n){var i=n(58);e.exports=function(e,t){var n=e.__data__;return i(t)?n['string'==typeof t?'string':'hash']:n.map}},function(e,t,n){var i=n(17),a=i(Object,'create');e.exports=a},function(e){e.exports=function(e){var t=typeof e;return null!=e&&('object'==t||'function'==t)}},function(e,t,n){var i=n(16),a=n(80);e.exports=function(e){return'symbol'==typeof e||a(e)&&i(e)=='[object Symbol]'}},function(e,t,n){'use strict';(function(e){function i(){r&&l||(r=!0,e(()=>{let e=0;for(l=!0,r=!1;e<s;){const t=o.pop();if(t)t(),e+=1;else break}l=!1,0<o.length&&i()}))}t.b=function(e){o.unboundedUnshift(e),i()},t.a=function(e,t){setTimeout(e,t)};var a=n(2);const s=1024,o=n.i(a.e)(32);let l=!1,r=!1}).call(t,n(21).setImmediate)},function(e,t,n){'use strict';(function(e){function i(e,t,n){const i=e.put(t,new o.a(!0,n));i&&n&&n(i.value)}function a(e,t){const n=e.take(new o.a(!0,t));n&&t&&t(n.value)}t.d=i,t.e=a,t.b=function(e){return new l.a(e)},t.a=function(e,t){return new l.b(e,t)},t.f=function(e,t){return new l.d(e,t)};var s=n(27),o=n(14),l=n(26),r=n(1),d=n(0),p=n(8);const u='@@process/NO_VALUE';t.c=class{constructor(t,n){this.schedule=(t)=>{e(()=>this.run(t))},this.gen=t,this.finished=!1,this.onFinishFunc=n}run(e){if(!this.finished){const{done:t,value:o}=this.gen.next(e);t?(this.finished=!0,this.onFinishFunc(o)):o instanceof l.a?a(o.channel,this.schedule):o instanceof l.b?i(o.channel,o.value,this.schedule):o instanceof l.c?n.i(p.a)(this.schedule,o.msec):o instanceof l.d?n.i(s.a)(o.operations,this.schedule,o.options):o instanceof d.c?a(o,this.schedule):this.schedule(o)}}}}).call(t,n(21).setImmediate)},function(e,t,n){var i=n(11),a=i.Symbol;e.exports=a},function(e,t,n){var i=n(47),a='object'==typeof self&&self&&self.Object===Object&&self,s=i||a||Function('return this')();e.exports=s},function(e){var t=Array.isArray;e.exports=t},function(e,t,n){'use strict';function i(e){const t=n.i(o.a)(n.i(a.a)(1)),i=new s.c(e,(e)=>{e===o.b?t.close():n.i(s.d)(t,e,()=>t.close())});return i.run(),t}t.a=function(e,t=[]){return i(e(...t))},t.b=function(e,t,i){return'number'==typeof e?n.i(o.a)(0===e?null:n.i(a.a)(e),t,i):n.i(o.a)(e,t,i)};var a=n(2),s=n(9),o=n(0)},function(e,t,n){'use strict';var i=n(82),a=n.n(i),s=n(1);t.a=class{constructor(e,t){this.blockable=e,this.func=t||a.a}isActive(){return!0}isBlockable(){return this.blockable}commit(){return this.func}};t.b=class{constructor(e,t){this.flag=e,this.func=t}isActive(){return this.flag.value}isBlockable(){return!0}commit(){return this.flag.value=!1,this.func}}},function(e,t,n){'use strict';n(0);const i={toString(){return'[object DEFAULT]'}};t.b=i;t.a=class{constructor(e,t){this.value=e,this.channel=t}}},function(e,t,n){var i=n(10),a=n(48),s=n(71),o=i?i.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?'[object Undefined]':'[object Null]':o&&o in Object(e)?a(e):s(e)}},function(e,t,n){var i=n(37),a=n(49);e.exports=function(e,t){var n=a(e,t);return i(n)?n:void 0}},function(e){e.exports=function(e,t){return e===t||e!==e&&t!==t}},function(e,t,n){var i=n(16),a=n(6);e.exports=function(e){if(!a(e))return!1;var t=i(e);return t=='[object Function]'||t=='[object GeneratorFunction]'||t=='[object AsyncFunction]'||t=='[object Proxy]'}},function(e,t,n){var i=n(86),a=1/0;e.exports=function(e){if(!e)return 0===e?e:0;if(e=i(e),e===a||e===-a){var t=0>e?-1:1;return t*1.7976931348623157e308}return e===e?e:0}},function(e,t,n){function i(e,t){this._id=e,this._clearFn=t}var a=Function.prototype.apply;t.setTimeout=function(){return new i(a.call(setTimeout,window,arguments),clearTimeout)},t.setInterval=function(){return new i(a.call(setInterval,window,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(window,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;0<=t&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},n(89),t.setImmediate=setImmediate,t.clearImmediate=clearImmediate},function(e){var t=function(){return this}();try{t=t||Function('return this')()||(1,eval)('this')}catch(n){'object'==typeof window&&(t=window)}e.exports=t},function(e,t,n){'use strict';var i=n(2),a=n(25),s=n(0),o=n(28),l=n(15),r=n(9);n.d(t,'d',function(){return r.a}),n.d(t,'e',function(){return r.b});var d=n(13);n.d(t,'c',function(){return d.a}),n.d(t,'a',function(){return d.b});const p={mapFrom:a.a,mapInto:a.b,filterFrom:a.c,filterInto:a.d,removeFrom:a.e,removeInto:a.f,mapcatFrom:a.g,mapcatInto:a.h,pipe:a.i,split:a.j,reduce:a.k,onto:a.l,fromColl:a.m,map:a.n,merge:a.o,into:a.p,unique:a.q,partitionBy:a.r,partition:a.s,mult:a.t,mix:a.u,pub:a.v,pipeline:a.w,pipelineAsync:a.x,take:a.y},u={fixed:i.a,dropping:i.b,sliding:i.c,promise:i.d};t.b=u},function(e,t,n){'use strict';function*i(e,t){yield n.i(o.d)(e.chan,t)}function*a(e,t){e.waiting++;const i=yield n.i(o.e)(e.chan);e.waiting--,e.pubResp(i,t)}function s(e,t){e.resetCh(),setTimeout(()=>s(e,t),t)}Object.defineProperty(t,'__esModule',{value:!0});var o=n(23);t['default']=class{constructor(e=1,t){this.pending=0,this.waiting=0,this.chan=n.i(o.a)(o.b.sliding(e)),0<t&&s(this,t)}resetCh(){this.pubPending()&&delPending(),this.chan.close(),this.chan=n.i(o.a)()}addPending(){this.pending++}delPending(){this.pending--}pubPending(){return 0<this.pending}pubResp(e,t){0<this.waiting&&n.i(o.c)(i,[this,e]),t&&t(e)}subResp(e){n.i(o.c)(a,[this,e])}}},function(e,t,a){'use strict';function n(e,t,n){const i=a.i(y.b)(n);return a.i(y.a)(function*(){for(;;){const n=yield a.i(_.b)(t);if(n===x.b){i.close();break}e(n)&&(yield a.i(_.a)(i,n))}}),i}function i(e,t){return{isClosed(){return t.isClosed()},close(){t.close()},put(n,i){return e(n)?t.put(n,i):new g.a(!t.isClosed())},take(e){return t.take(e)}}}function*s(e,t,n){for(;;){const i=yield a.i(_.b)(t);if(i===x.b){n.close();break}else{const t=e(i),s=t.length;for(let e=0;e<s;e+=1)yield a.i(_.a)(n,t[e]);if(n.isClosed())break}}}function o(e,t,n){return a.i(y.a)(function*(){for(let i=t;;){const t=yield a.i(_.b)(n);if(t===x.b)return i;i=e(i,t)}},[],!0)}function l(e,t,n){return a.i(y.a)(function*(){const s=t.length;for(let n=0;n<s;n+=1)yield a.i(_.a)(e,t[n]);n||e.close()})}function r(e){let t=e[k];if(!t){const n=v();t=n,e[k]=n}return t}function d(e){function n(e){return(t)=>{o-=1,0===o&&a.i(_.d)(s,!0),t||i.untap(e.channel)}}const i=new A(e),s=a.i(y.b)(1);let o;return a.i(y.a)(function*(){for(;;){const l=yield a.i(_.b)(e),r=i.taps;let d;if(l===x.b){Object.keys(r).forEach((e)=>{d=r[e],d.keepOpen||d.channel.close()}),i.untapAll();break}o=Object.keys(r).length;const t=o;Object.keys(r).forEach((e)=>{d=r[e],a.i(_.d)(d.channel,l,n(d))}),0<t&&(yield a.i(_.b)(s))}}),i}function p(e){const t=new E(e);return a.i(y.a)(function*(){for(let n=t._getAllState();;){const i=yield a.i(_.f)(n.reads),s=i.value,o=i.channel;if(s===x.b)delete t.stateMap[r(o)],n=t._getAllState();else if(o===t.change)n=t._getAllState();else{const t=n.solos;if(-1<t.indexOf(o)||0===t.length&&!(-1<n.mutes.indexOf(o))){const t=yield a.i(_.a)(e,s);if(!t)break}}}}),t}function u(){return null}function c(e,t,n=u){const i=new S(e,t,n);return a.i(y.a)(function*(){for(;;){const n=yield a.i(_.b)(e),s=i.mults;if(n===x.b){Object.keys(s).forEach((e)=>{s[e].muxch().close()});break}const o=t(n),l=s[o];if(l){const e=yield a.i(_.a)(l.muxch(),n);e||delete s[o]}}}),i}function h(e,t,n,i,s){if(0>=e)throw new Error('n must be positive');const o=a.i(y.b)(e),l=a.i(y.b)(e);return f()(e,()=>{a.i(y.a)(function*(e,t,n){for(;;){const i=yield a.i(_.b)(t);if(!e(i)){n.close();break}}},[s,o,l])}),a.i(y.a)(function*(e,t,n){for(;;){const i=yield a.i(_.b)(t);if(i===x.b){e.close();break}const s=a.i(y.b)(1);yield a.i(_.a)(e,[i,s]),yield a.i(_.a)(n,s)}},[o,n,l]),a.i(y.a)(function*(e,t,n){for(;;){const i=yield a.i(_.b)(e);if(i===x.b){t&&n.close();break}for(const e=yield a.i(_.b)(i);;){const t=yield a.i(_.b)(e);if(t===x.b)break;yield a.i(_.a)(n,t)}}},[l,i,t]),t}t.a=function(e,t){return{isClosed(){return t.isClosed()},close(){t.close()},put(e,n){return t.put(e,n)},take(n){const i=t.take({isActive(){return n.isActive()},commit(){const t=n.commit();return(n)=>t(n===x.b?x.b:e(n))}});if(i){const t=i.value;return new g.a(t===x.b?x.b:e(t))}return null}}},t.b=function(e,t){return{isClosed(){return t.isClosed()},close(){t.close()},put(n,i){return t.put(e(n),i)},take(e){return t.take(e)}}},t.c=n,t.d=i,t.e=function(e,t){return n((t)=>!e(t),t)},t.f=function(e,t){return i((t)=>!e(t),t)},t.g=function(e,t,n){const i=a.i(y.b)(n);return a.i(y.a)(s,[e,t,i]),i},t.h=function(e,t,n){const i=a.i(y.b)(n);return a.i(y.a)(s,[e,i,t]),i},t.i=function(e,t,n){return a.i(y.a)(function*(){for(;;){const i=yield a.i(_.b)(e);if(i===x.b){n||t.close();break}if(!(yield a.i(_.a)(t,i)))break}}),t},t.j=function(e,t,n,i){const s=a.i(y.b)(n),o=a.i(y.b)(i);return a.i(y.a)(function*(){for(;;){const n=yield a.i(_.b)(t);if(n===x.b){s.close(),o.close();break}yield a.i(_.a)(e(n)?s:o,n)}}),[s,o]},t.k=o,t.l=l,t.m=function(e){const t=a.i(y.b)(e.length);return l(t,e),t},t.n=function(e,t,n){const s=a.i(y.b)(n),o=t.length,l=Array(o),r=a.i(y.b)(1);let d;const p=Array(o),u=(e)=>(t)=>{l[e]=t,d-=1,0===d&&a.i(_.d)(r,l.slice(0))};for(let e=0;e<o;e+=1)p[e]=u(e);return a.i(y.a)(function*(){for(;;){d=o;for(let e=0;e<o;e+=1)try{a.i(_.e)(t[e],p[e])}catch(t){d-=1}const n=yield a.i(_.b)(r);for(let e=0;e<o;e+=1)if(n[e]===x.b)return void s.close();yield a.i(_.a)(s,e(...n))}}),s},t.o=function(e,t){const n=a.i(y.b)(t),s=e.slice(0);return a.i(y.a)(function*(){for(;;){if(0===s.length)break;const e=yield a.i(_.f)(s),t=e.value;if(t===x.b){const t=s.indexOf(e.channel);s.splice(t,1)}else yield a.i(_.a)(n,t)}n.close()}),n},t.p=function(e,t){const n=e.slice(0);return o((e,t)=>{return e.push(t),e},n,t)},t.y=function(e,t,n){const i=a.i(y.b)(n);return a.i(y.a)(function*(){for(let n=0;n<e;n+=1){const e=yield a.i(_.b)(t);if(e===x.b)break;yield a.i(_.a)(i,e)}i.close()}),i},t.q=function(e,t){const n=a.i(y.b)(t);let i=m;return a.i(y.a)(function*(){for(;;){const t=yield a.i(_.b)(e);if(t===x.b)break;t!==i&&(i=t,yield a.i(_.a)(n,t))}n.close()}),n},t.r=function(e,t,n){const i=a.i(y.b)(n);let s=[],o=m;return a.i(y.a)(function*(){for(;;){const n=yield a.i(_.b)(t);if(n===x.b){0<s.length&&(yield a.i(_.a)(i,s)),i.close();break}else{const t=e(n);t===o||o===m?s.push(n):(yield a.i(_.a)(i,s),s=[n]),o=t}}}),i},t.s=function(e,t,n){const s=a.i(y.b)(n);return a.i(y.a)(function*(){for(;;){const n=Array(e);for(let o=0;o<e;o+=1){const e=yield a.i(_.b)(t);if(e===x.b)return 0<o&&(yield a.i(_.a)(s,n.slice(0,o))),void s.close();n[o]=e}yield a.i(_.a)(s,n)}}),s},t.t=d,t.u=p,t.v=c,t.w=function(e,t,n,i,s){return h(1,e,n,!i,function(e){if(e===x.b)return null;const[n,i]=e,o=a.i(y.b)(1,t,s);return a.i(y.a)(function*(e,t){yield a.i(_.a)(e,t),o.close()},[o,n]),a.i(_.d)(i,o),!0})},t.x=function(e,t,n,i,s){return h(e,t,i,!s,function(e){if(e===x.b)return null;const[t,i]=e,s=a.i(y.b)(1);return n(t,s),a.i(_.d)(i,s),!0})};var b=a(84),f=a.n(b),g=a(1),x=a(0),_=a(9),y=a(13);const m={},v=(()=>{let e=0;return()=>{return e+=1,`${e}`}})(),k='__csp_channel_id';class T{constructor(e,t){this.channel=e,this.keepOpen=t}}class A{constructor(e){this.taps={},this.ch=e}muxch(){return this.ch}tap(e,t){this.taps[r(e)]=new T(e,t)}untap(e){delete this.taps[r(e)]}untapAll(){this.taps={}}}d.tap=(e,t,n)=>{return e.tap(t,n),t},d.untap=(e,t)=>{e.untap(t)},d.untapAll=(e)=>{e.untapAll()};const O='mute',I='pause',M=[O,I];class E{constructor(e){this.ch=e,this.stateMap={},this.change=a.i(y.b)(),this.soloMode=O}_changed(){a.i(_.d)(this.change,!0)}_getAllState(){const e=this.stateMap,t=[],a=[],s=[];let o;Object.keys(e).forEach((n)=>{const i=e[n],o=i.state,l=i.channel;o['solo']&&t.push(l),o[O]&&a.push(l),o[I]&&s.push(l)});let l,i;if(this.soloMode===I&&0<t.length){for(i=t.length,o=Array(i+1),l=0;l<i;l+=1)o[l]=t[l];o[i]=this.change}else o=[],Object.keys(e).forEach((t)=>{const n=e[t],i=n.channel;0>s.indexOf(i)&&o.push(i)}),o.push(this.change);return{solos:t,mutes:a,reads:o}}admix(e){this.stateMap[r(e)]={channel:e,state:{}},this._changed()}unmix(e){delete this.stateMap[r(e)],this._changed()}unmixAll(){this.stateMap={},this._changed()}toggle(e){const t=e.length;for(let n=0;n<t;n+=1){const t=e[n][0],i=r(t),a=e[n][1];let s=this.stateMap[i];if(!s){const e={channel:t,state:{}};s=e,this.stateMap[i]=e}Object.keys(a).forEach((e)=>{s.state[e]=a[e]})}this._changed()}setSoloMode(e){if(0>M.indexOf(e))throw new Error('Mode must be one of: ',M.join(', '));this.soloMode=e,this._changed()}}p.add=function(e,t){e.admix(t)},p.remove=function(e,t){e.unmix(t)},p.removeAll=function(e){e.unmixAll()},p.toggle=function(e,t){e.toggle(t)},p.setSoloMode=function(e,t){e.setSoloMode(t)};class S{constructor(e,t,n){this.ch=e,this.topicFn=t,this.bufferFn=n,this.mults={}}_ensureMult(e){let t=this.mults[e];const n=this.bufferFn;if(!t){const i=d(a.i(y.b)(n(e)));t=i,this.mults[e]=i}return t}sub(e,t,n){const i=this._ensureMult(e);return d.tap(i,t,n)}unsub(e,t){const n=this.mults[e];n&&d.untap(n,t)}unsubAll(e){e===void 0?this.mults={}:delete this.mults[e]}}c.sub=(e,t,n,i)=>e.sub(t,n,i),c.unsub=(e,t,n)=>{e.unsub(t,n)},c.unsubAll=(e,t)=>{e.unsubAll(t)}},function(e,t,n){'use strict';n(0);t.a=class{constructor(e){this.channel=e}};t.b=class{constructor(e,t){this.channel=e,this.value=t}};t.c=class{constructor(e){this.msec=e}};t.d=class{constructor(e,t){this.operations=e,this.options=t}}},function(e,t,n){'use strict';t.a=function(e,t,n){if(0===e.length)throw new Error('Empty alt list');const s=new d.a(!0),l=r()(o()(e.length)),h=!!(n&&n.priority);let b;for(let n=0;n<e.length;n+=1){const i=e[h?n:l[n]];let a;if(i instanceof p.c?(a=i,b=a.take(new u.b(s,(e)=>t(new c.a(e,a))))):(a=i[0],b=a.put(i[1],new u.b(s,(e)=>t(new c.a(e,a))))),b){t(new c.a(b.value,a));break}}!b&&a()(n,'default')&&s.value&&(s.value=!1,t(new c.a(n.default,c.b)))};var i=n(76),a=n.n(i),s=n(83),o=n.n(s),l=n(35),r=n.n(l),d=n(1),p=n(0),u=n(14),c=n(15)},function(e,t,n){'use strict';var i=n(8),a=n(0)},function(e,t,n){'use strict';t.c=function(e,t){for(;0<e.length;)t(e.pop())};var i=n(8);t.b=(e,t)=>{n.i(i.b)(()=>e(t))};t.a=(e)=>e&&e['@@transducer/reduced']},function(e,t,n){function i(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var i=e[t];this.set(i[0],i[1])}}var a=n(50),s=n(51),o=n(52),l=n(53),r=n(54);i.prototype.clear=a,i.prototype['delete']=s,i.prototype.get=o,i.prototype.has=l,i.prototype.set=r,e.exports=i},function(e,t,n){function i(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var i=e[t];this.set(i[0],i[1])}}var a=n(60),s=n(61),o=n(62),l=n(63),r=n(64);i.prototype.clear=a,i.prototype['delete']=s,i.prototype.get=o,i.prototype.has=l,i.prototype.set=r,e.exports=i},function(e,t,n){var i=n(17),a=n(11),s=i(a,'Map');e.exports=s},function(e,t,n){function i(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var i=e[t];this.set(i[0],i[1])}}var a=n(65),s=n(66),o=n(67),l=n(68),r=n(69);i.prototype.clear=a,i.prototype['delete']=s,i.prototype.get=o,i.prototype.has=l,i.prototype.set=r,e.exports=i},function(e){e.exports=function(e,t){for(var n=-1,i=null==e?0:e.length,a=Array(i);++n<i;)a[n]=t(e[n],n,e);return a}},function(e,t,n){var i=n(44),a=n(72);e.exports=function(e){return a(i(e))}},function(e,t,n){var i=n(43),a=n(74);e.exports=function(e,t){t=i(t,e);for(var n=0,s=t.length;null!=e&&n<s;)e=e[a(t[n++])];return n&&n==s?e:void 0}},function(e,t,n){var i=n(19),a=n(59),s=n(6),o=n(75),l=/[\\^$.*+?()[\]{}|]/g,r=/^\[object .+?Constructor\]$/,d=Function.prototype,p=Object.prototype,u=d.toString,c=p.hasOwnProperty,h=RegExp('^'+u.call(c).replace(l,'\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,'$1.*?')+'$');e.exports=function(e){if(!s(e)||a(e))return!1;var t=i(e)?h:r;return t.test(o(e))}},function(e){var t=Math.floor,n=Math.random;e.exports=function(e,i){return e+t(n()*(i-e+1))}},function(e){var t=Math.ceil,n=Math.max;e.exports=function(e,i,a,s){for(var o=-1,l=n(t((i-e)/(a||1)),0),r=Array(l);l--;)r[s?l:++o]=e,e+=a;return r}},function(e){e.exports=function(e,t){for(var n=-1,i=Array(e);++n<e;)i[n]=t(n);return i}},function(e,t,n){function i(e){if('string'==typeof e)return e;if(o(e))return s(e,i)+'';if(l(e))return p?p.call(e):'';var t=e+'';return'0'==t&&1/e==-r?'-0':t}var a=n(10),s=n(34),o=n(12),l=n(7),r=1/0,d=a?a.prototype:void 0,p=d?d.toString:void 0;e.exports=i},function(e,t,n){var i=n(77);e.exports=function(e){return'function'==typeof e?e:i}},function(e,t,n){var i=n(12),a=n(57),s=n(73),o=n(87);e.exports=function(e,t){return i(e)?e:a(e,t)?[e]:s(o(e))}},function(e){e.exports=function(e,t){var n=-1,i=e.length;for(t||(t=Array(i));++n<i;)t[n]=e[n];return t}},function(e,t,n){var i=n(11),a=i['__core-js_shared__'];e.exports=a},function(e,t,n){var i=n(39),a=n(56),s=n(20);e.exports=function(e){return function(t,n,o){return o&&'number'!=typeof o&&a(t,n,o)&&(n=o=void 0),t=s(t),void 0===n?(n=t,t=0):n=s(n),o=void 0===o?t<n?1:-1:s(o),i(t,n,o,e)}}},function(e,t,n){(function(t){var n='object'==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(t,n(22))},function(e,t,n){var i=n(10),a=Object.prototype,s=a.hasOwnProperty,o=a.toString,l=i?i.toStringTag:void 0;e.exports=function(e){var t=s.call(e,l),n=e[l];try{e[l]=void 0}catch(t){}var i=o.call(e);return t?e[l]=n:delete e[l],i}},function(e){e.exports=function(e,t){return null==e?void 0:e[t]}},function(e,t,n){var i=n(5);e.exports=function(){this.__data__=i?i(null):{},this.size=0}},function(e){e.exports=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}},function(e,t,n){var i=n(5),a=Object.prototype,s=a.hasOwnProperty;e.exports=function(e){var t=this.__data__;if(i){var n=t[e];return n==='__lodash_hash_undefined__'?void 0:n}return s.call(t,e)?t[e]:void 0}},function(e,t,n){var i=n(5),a=Object.prototype,s=a.hasOwnProperty;e.exports=function(e){var t=this.__data__;return i?t[e]!==void 0:s.call(t,e)}},function(e,t,n){var i=n(5);e.exports=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=i&&void 0===t?'__lodash_hash_undefined__':t,this}},function(e){var t=/^(?:0|[1-9]\d*)$/;e.exports=function(e,n){return n=null==n?9007199254740991:n,!!n&&('number'==typeof e||t.test(e))&&-1<e&&0==e%1&&e<n}},function(e,t,n){var i=n(18),a=n(78),s=n(55),o=n(6);e.exports=function(e,t,n){if(!o(n))return!1;var l=typeof t;return!('number'==l?!(a(n)&&s(t,n.length)):!('string'==l&&t in n))&&i(n[t],e)}},function(e,t,n){var i=n(12),a=n(7),s=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,o=/^\w*$/;e.exports=function(e,t){if(i(e))return!1;var n=typeof e;return'number'==n||'symbol'==n||'boolean'==n||null==e||a(e)||o.test(e)||!s.test(e)||null!=t&&e in Object(t)}},function(e){e.exports=function(e){var t=typeof e;return'string'==t||'number'==t||'symbol'==t||'boolean'==t?'__proto__'!==e:null===e}},function(e,t,n){var i=n(45),a=function(){var e=/[^.]+$/.exec(i&&i.keys&&i.keys.IE_PROTO||'');return e?'Symbol(src)_1.'+e:''}();e.exports=function(e){return!!a&&a in e}},function(e){e.exports=function(){this.__data__=[],this.size=0}},function(e,t,n){var i=n(3),a=Array.prototype,s=a.splice;e.exports=function(e){var t=this.__data__,n=i(t,e);if(0>n)return!1;var a=t.length-1;return n==a?t.pop():s.call(t,n,1),--this.size,!0}},function(e,t,n){var i=n(3);e.exports=function(e){var t=this.__data__,n=i(t,e);return 0>n?void 0:t[n][1]}},function(e,t,n){var i=n(3);e.exports=function(e){return-1<i(this.__data__,e)}},function(e,t,n){var i=n(3);e.exports=function(e,t){var n=this.__data__,a=i(n,e);return 0>a?(++this.size,n.push([e,t])):n[a][1]=t,this}},function(e,t,n){var i=n(30),a=n(31),s=n(32);e.exports=function(){this.size=0,this.__data__={hash:new i,map:new(s||a),string:new i}}},function(e,t,n){var i=n(4);e.exports=function(e){var t=i(this,e)['delete'](e);return this.size-=t?1:0,t}},function(e,t,n){var i=n(4);e.exports=function(e){return i(this,e).get(e)}},function(e,t,n){var i=n(4);e.exports=function(e){return i(this,e).has(e)}},function(e,t,n){var i=n(4);e.exports=function(e,t){var n=i(this,e),a=n.size;return n.set(e,t),this.size+=n.size==a?0:1,this}},function(e,t,n){var i=n(81);e.exports=function(e){var t=i(e,function(e){return n.size===500&&n.clear(),e}),n=t.cache;return t}},function(e){var t=Object.prototype,n=t.toString;e.exports=function(e){return n.call(e)}},function(e,t,n){var i=n(38);e.exports=function(e,t){var n=-1,a=e.length;for(t=void 0===t?a:t;++n<t;){var s=i(n,a-1),o=e[s];e[s]=e[n],e[n]=o}return e.length=t,e}},function(e,t,n){var i=n(70),a=/^\./,s=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,o=/\\(\\)?/g,l=i(function(e){var t=[];return a.test(e)&&t.push(''),e.replace(s,function(e,n,i,a){t.push(i?a.replace(o,'$1'):n||e)}),t});e.exports=l},function(e,t,n){var i=n(7);e.exports=function(e){if('string'==typeof e||i(e))return e;var t=e+'';return'0'==t&&1/e==-(1/0)?'-0':t}},function(e){var t=Function.prototype,n=t.toString;e.exports=function(e){if(null!=e){try{return n.call(e)}catch(t){}try{return e+''}catch(t){}}return''}},function(e,t,n){var i=n(36);e.exports=function(e,t,n){var a=null==e?void 0:i(e,t);return a===void 0?n:a}},function(e){e.exports=function(e){return e}},function(e,t,n){var i=n(19),a=n(79);e.exports=function(e){return null!=e&&a(e.length)&&!i(e)}},function(e){e.exports=function(e){return'number'==typeof e&&-1<e&&0==e%1&&e<=9007199254740991}},function(e){e.exports=function(e){return null!=e&&'object'==typeof e}},function(e,t,n){function i(e,t){if('function'!=typeof e||null!=t&&'function'!=typeof t)throw new TypeError(s);var n=function(){var i=arguments,a=t?t.apply(this,i):i[0],s=n.cache;if(s.has(a))return s.get(a);var o=e.apply(this,i);return n.cache=s.set(a,o)||s,o};return n.cache=new(i.Cache||a),n}var a=n(33),s='Expected a function';i.Cache=a,e.exports=i},function(e){e.exports=function(){}},function(e,t,n){var i=n(46),a=i();e.exports=a},function(e,t,n){var i=n(40),a=n(42),s=n(85),o=4294967295,l=Math.min;e.exports=function(e,t){if(e=s(e),1>e||e>9007199254740991)return[];var n=o,r=l(e,o);t=a(t),e-=o;for(var d=i(r,t);++n<e;)t(n);return d}},function(e,t,n){var i=n(20);e.exports=function(e){var t=i(e),n=t%1;return t===t?n?t-n:t:0}},function(e,t,n){var i=n(6),a=n(7),s=0/0,o=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,r=/^0b[01]+$/i,d=/^0o[0-7]+$/i,p=parseInt;e.exports=function(e){if('number'==typeof e)return e;if(a(e))return s;if(i(e)){var t='function'==typeof e.valueOf?e.valueOf():e;e=i(t)?t+'':t}if('string'!=typeof e)return 0===e?e:+e;e=e.replace(o,'');var n=r.test(e);return n||d.test(e)?p(e.slice(2),n?2:8):l.test(e)?s:+e}},function(e,t,n){var i=n(41);e.exports=function(e){return null==e?'':i(e)}},function(e){function t(){throw new Error('setTimeout has not been defined')}function n(){throw new Error('clearTimeout has not been defined')}function a(e){if(d===setTimeout)return setTimeout(e,0);if((d===t||!d)&&setTimeout)return d=setTimeout,setTimeout(e,0);try{return d(e,0)}catch(t){try{return d.call(null,e,0)}catch(t){return d.call(this,e,0)}}}function i(e){if(p===clearTimeout)return clearTimeout(e);if((p===n||!p)&&clearTimeout)return p=clearTimeout,clearTimeout(e);try{return p(e)}catch(t){try{return p.call(null,e)}catch(t){return p.call(this,e)}}}function s(){b&&c&&(b=!1,c.length?h=c.concat(h):f=-1,h.length&&o())}function o(){if(!b){var e=a(s);b=!0;for(var t=h.length;t;){for(c=h,h=[];++f<t;)c&&c[f].run();f=-1,t=h.length}c=null,b=!1,i(e)}}function l(e,t){this.fun=e,this.array=t}function r(){}var d,p,u=e.exports={};(function(){try{d='function'==typeof setTimeout?setTimeout:t}catch(n){d=t}try{p='function'==typeof clearTimeout?clearTimeout:n}catch(t){p=n}})();var c,h=[],b=!1,f=-1;u.nextTick=function(e){var t=Array(arguments.length-1);if(1<arguments.length)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];h.push(new l(e,t)),1!==h.length||b||a(o)},l.prototype.run=function(){this.fun.apply(null,this.array)},u.title='browser',u.browser=!0,u.env={},u.argv=[],u.version='',u.versions={},u.on=r,u.addListener=r,u.once=r,u.off=r,u.removeListener=r,u.removeAllListeners=r,u.emit=r,u.prependListener=r,u.prependOnceListener=r,u.listeners=function(){return[]},u.binding=function(){throw new Error('process.binding is not supported')},u.cwd=function(){return'/'},u.chdir=function(){throw new Error('process.chdir is not supported')},u.umask=function(){return 0}},function(e,t,n){(function(e,t){(function(e){'use strict';function n(e){'function'!=typeof e&&(e=new Function(''+e));for(var t=Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var i={callback:e,args:t};return b[h]=i,c(h),h++}function i(e){delete b[e]}function a(e){var t=e.callback,n=e.args;switch(n.length){case 0:t();break;case 1:t(n[0]);break;case 2:t(n[0],n[1]);break;case 3:t(n[0],n[1],n[2]);break;default:t.apply(void 0,n);}}function s(e){if(f)setTimeout(s,0,e);else{var t=b[e];if(t){f=!0;try{a(t)}finally{i(e),f=!1}}}}function o(){c=function(e){t.nextTick(function(){s(e)})}}function l(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage('','*'),e.onmessage=n,t}}function r(){var t='setImmediate$'+Math.random()+'$',n=function(n){n.source===e&&'string'==typeof n.data&&0===n.data.indexOf(t)&&s(+n.data.slice(t.length))};e.addEventListener?e.addEventListener('message',n,!1):e.attachEvent('onmessage',n),c=function(n){e.postMessage(t+n,'*')}}function d(){var e=new MessageChannel;e.port1.onmessage=function(e){var t=e.data;s(t)},c=function(t){e.port2.postMessage(t)}}function p(){var e=g.documentElement;c=function(t){var n=g.createElement('script');n.onreadystatechange=function(){s(t),n.onreadystatechange=null,e.removeChild(n),n=null},e.appendChild(n)}}function u(){c=function(e){setTimeout(s,0,e)}}if(!e.setImmediate){var c,h=1,b={},f=!1,g=e.document,m=Object.getPrototypeOf&&Object.getPrototypeOf(e);m=m&&m.setTimeout?m:e,'[object process]'==={}.toString.call(e.process)?o():l()?r():e.MessageChannel?d():g&&'onreadystatechange'in g.createElement('script')?p():u(),m.setImmediate=n,m.clearImmediate=i}})('undefined'==typeof self?'undefined'==typeof e?this:e:self)}).call(t,n(22),n(88))}])});