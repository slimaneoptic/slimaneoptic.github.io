function e(){return typeof globalThis.WebAssembly?.promising==`function`}function t(){return e()?`jspi`:`asyncify`}function n(e){let n={},r=null;function i(){return r||(r=t(),e.logFlavorSelection&&console.log(r===`jspi`?`JSPI is supported. Using JSPI runtime.`:`Using Asyncify runtime.`),r)}async function a(t,r=i()){let a=`${t}:${r}`;return n[a]??(n[a]=(async()=>{let n=await e.resolveAsset(t,r),i=await e.loadFactory(n.jsUrl),a={locateFile:n.locateFile,noExitRuntime:!0};n.wasmBinary&&(a.wasmBinary=n.wasmBinary),n.mainScriptUrlOrBlob&&(a.mainScriptUrlOrBlob=n.mainScriptUrlOrBlob);try{return await i(a)}finally{n.cleanupGlobalState?.()}})()),n[a]}async function o(){let e=Object.entries(n),t=await Promise.allSettled(e.map(([,e])=>e));try{for(let e of t){if(e.status!==`fulfilled`)continue;let t=e.value;try{Object.prototype.hasOwnProperty.call(t,`PThread`)&&t.PThread?.terminateAllThreads?.()}catch(e){if(!String(e).includes(`PThread`))throw e}}}finally{for(let[t]of e)delete n[t]}}return{terminateLoadedRuntimeThreads:o,loadRuntime:()=>a(`cp_sat_runtime`),loadRuntimeAsyncify:()=>a(`cp_sat_runtime`,`asyncify`),loadRoutingRuntime:()=>a(`routing_runtime`),loadRoutingRuntimeAsyncify:()=>a(`routing_runtime`,`asyncify`),loadMPSolverRuntime:()=>a(`mp_solver_runtime`),loadMPSolverRuntimeAsyncify:()=>a(`mp_solver_runtime`,`asyncify`),loadMathOptRuntime:()=>a(`mathopt_runtime`),loadMathOptRuntimeAsyncify:()=>a(`mathopt_runtime`,`asyncify`),loadPdlpRuntime:()=>a(`pdlp_runtime`),loadPdlpRuntimeAsyncify:()=>a(`pdlp_runtime`,`asyncify`),loadGraphRuntime:()=>a(`graph_runtime`),loadGraphRuntimeAsyncify:()=>a(`graph_runtime`,`asyncify`),loadSetCoverRuntime:()=>a(`set_cover_runtime`),loadSetCoverRuntimeAsyncify:()=>a(`set_cover_runtime`,`asyncify`)}}const r={cp_sat_runtime:{jspi:{jsUrl:new URL(new URL(`cp_sat_runtime-DbI0Sx8Q.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`cp_sat_runtime-C-yaxgmf.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`cp_sat_runtime_asyncify-BbDIArG2.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`cp_sat_runtime_asyncify-DsO6wVBK.wasm`,import.meta.url).href,``+import.meta.url).href}},routing_runtime:{jspi:{jsUrl:new URL(new URL(`routing_runtime-uVALT8bB.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`routing_runtime-B6Sl4amb.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`routing_runtime_asyncify-BcbpcAqX.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`routing_runtime_asyncify-BZA4mzZn.wasm`,import.meta.url).href,``+import.meta.url).href}},mp_solver_runtime:{jspi:{jsUrl:new URL(new URL(`mp_solver_runtime-Cnb23_IP.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`mp_solver_runtime-BxOcqfjp.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`mp_solver_runtime_asyncify-5LXgi4lb.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`mp_solver_runtime_asyncify-XHBqoulo.wasm`,import.meta.url).href,``+import.meta.url).href}},mathopt_runtime:{jspi:{jsUrl:new URL(new URL(`mathopt_runtime-CFHYpQRY.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`mathopt_runtime-BwzFJFaF.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`mathopt_runtime_asyncify-DHsAOpqq.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`mathopt_runtime_asyncify-DBJWDmp5.wasm`,import.meta.url).href,``+import.meta.url).href}},pdlp_runtime:{jspi:{jsUrl:new URL(new URL(`pdlp_runtime-OdblZeaT.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`pdlp_runtime-BtLKECe3.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`pdlp_runtime_asyncify-D4FO5jsd.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`pdlp_runtime_asyncify-CVkze6WI.wasm`,import.meta.url).href,``+import.meta.url).href}},graph_runtime:{jspi:{jsUrl:new URL(new URL(`graph_runtime-CeCeiLGJ.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`graph_runtime-Cq2M9ebD.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`graph_runtime_asyncify-4fpHjuEm.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`graph_runtime_asyncify-DhW89rlF.wasm`,import.meta.url).href,``+import.meta.url).href}},set_cover_runtime:{jspi:{jsUrl:new URL(new URL(`set_cover_runtime-BQCTbzA6.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`set_cover_runtime-Cd2OLsL_.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`set_cover_runtime_asyncify-DJN8nTUN.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`set_cover_runtime_asyncify-C2vbVyTI.wasm`,import.meta.url).href,``+import.meta.url).href}}};async function i(e){let{default:t}=await import(
/* webpackIgnore: true */
/* @vite-ignore */
e);return t}function a(e){return(new URL(e).pathname.split(`/`).pop()??``).replace(/-[A-Za-z0-9_-]+(?=\.(?:js|wasm)$)/,``)}function o(e){for(let t of Object.values(r))for(let n of Object.values(t)){if(e===a(n.jsUrl))return n.jsUrl;if(e===a(n.wasmUrl))return n.wasmUrl}return e}const s=n({logFlavorSelection:!0,loadFactory:i,async resolveAsset(e,t){let n=r[e][t],i=new Uint8Array(await(await fetch(n.wasmUrl)).arrayBuffer());return{jsUrl:n.jsUrl,locateFile:o,wasmBinary:i,mainScriptUrlOrBlob:n.jsUrl}}});s.terminateLoadedRuntimeThreads,s.loadRuntime,s.loadRuntimeAsyncify,s.loadRoutingRuntime,s.loadRoutingRuntimeAsyncify,s.loadMPSolverRuntime,s.loadMPSolverRuntimeAsyncify,s.loadMathOptRuntime,s.loadMathOptRuntimeAsyncify,s.loadPdlpRuntime,s.loadPdlpRuntimeAsyncify,s.loadGraphRuntime,s.loadGraphRuntimeAsyncify,s.loadSetCoverRuntime,s.loadSetCoverRuntimeAsyncify;var c=Object.create,l=Object.defineProperty,u=Object.getOwnPropertyDescriptor,d=Object.getOwnPropertyNames,f=Object.getPrototypeOf,p=Object.prototype.hasOwnProperty,m=(e,t)=>function(){return t||(0,e[d(e)[0]])((t={exports:{}}).exports,t),t.exports},h=(e,t,n,r)=>{if(t&&typeof t==`object`||typeof t==`function`)for(let i of d(t))!p.call(e,i)&&i!==n&&l(e,i,{get:()=>t[i],enumerable:!(r=u(t,i))||r.enumerable});return e},g=(e,t,n)=>(n=e==null?{}:c(f(e)),h(t||!e||!e.__esModule?l(n,`default`,{value:e,enumerable:!0}):n,e)),_=m({"node_modules/@bufbuild/protobuf/dist/commonjs/types.js"(e){Object.defineProperty(e,"__esModule",{value:!0})}}),v=m({"node_modules/@bufbuild/protobuf/dist/commonjs/is-message.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.isMessage=t;function t(e,t){return typeof e==`object`&&e&&`$typeName`in e&&typeof e.$typeName==`string`?t===void 0||t.typeName===e.$typeName:!1}}}),y=m({"node_modules/@bufbuild/protobuf/dist/commonjs/descriptors.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.ScalarType=void 0;var t;(function(e){e[e.DOUBLE=1]=`DOUBLE`,e[e.FLOAT=2]=`FLOAT`,e[e.INT64=3]=`INT64`,e[e.UINT64=4]=`UINT64`,e[e.INT32=5]=`INT32`,e[e.FIXED64=6]=`FIXED64`,e[e.FIXED32=7]=`FIXED32`,e[e.BOOL=8]=`BOOL`,e[e.STRING=9]=`STRING`,e[e.BYTES=12]=`BYTES`,e[e.UINT32=13]=`UINT32`,e[e.SFIXED32=15]=`SFIXED32`,e[e.SFIXED64=16]=`SFIXED64`,e[e.SINT32=17]=`SINT32`,e[e.SINT64=18]=`SINT64`})(t||(e.ScalarType=t={}))}}),b=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wire/varint.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.varint64read=t,e.varint64write=n,e.int64FromString=i,e.int64ToString=a,e.uInt64ToString=o,e.varint32write=d,e.varint32read=f;function t(){let e=this.buf,t=this.pos,n=0,r=0;for(let i=0;i<28;i+=7){let a=e[t++];if(n|=(a&127)<<i,!(a&128)){this.pos=t,this.assertBounds(),this.varint64Lo=n,this.varint64Hi=r;return}}let i=e[t++];if(n|=(i&15)<<28,r=(i&112)>>4,!(i&128))this.pos=t,this.assertBounds(),this.varint64Lo=n,this.varint64Hi=r;else{for(let i=3;i<=31;i+=7){let a=e[t++];if(r|=(a&127)<<i,!(a&128)){this.pos=t,this.assertBounds(),this.varint64Lo=n,this.varint64Hi=r;return}}throw Error(`invalid varint`)}}function n(e,t,n){for(let r=0;r<28;r+=7){let i=e>>>r,a=!(!(i>>>7)&&t==0),o=(a?i|128:i)&255;if(n.push(o),!a)return}let r=e>>>28&15|(t&7)<<4,i=!!(t>>3);if(n.push((i?r|128:r)&255),i){for(let e=3;e<31;e+=7){let r=t>>>e,i=!!(r>>>7),a=(i?r|128:r)&255;if(n.push(a),!i)return}n.push(t>>>31&1)}}var r=4294967296;function i(e){let t=e[0]===`-`;t&&(e=e.slice(1));let n=1e6,i=0,a=0;function o(t,o){let s=Number(e.slice(t,o));a*=n,i=i*n+s,i>=r&&(a+=i/r|0,i%=r)}return o(-24,-18),o(-18,-12),o(-12,-6),o(-6),t?l(i,a):c(i,a)}function a(e,t){let n=c(e,t),r=n.hi&2147483648;r&&(n=l(n.lo,n.hi));let i=o(n.lo,n.hi);return r?`-`+i:i}function o(e,t){if({lo:e,hi:t}=s(e,t),t<=2097151)return String(r*t+e);let n=e&16777215,i=(e>>>24|t<<8)&16777215,a=t>>16&65535,o=n+i*6777216+a*6710656,c=i+a*8147497,l=a*2,d=1e7;return o>=d&&(c+=Math.floor(o/d),o%=d),c>=d&&(l+=Math.floor(c/d),c%=d),l.toString()+u(c)+u(o)}function s(e,t){return{lo:e>>>0,hi:t>>>0}}function c(e,t){return{lo:e|0,hi:t|0}}function l(e,t){return t=~t,e?e=~e+1:t+=1,c(e,t)}var u=e=>{let t=String(e);return`0000000`.slice(t.length)+t};function d(e,t){if(e>>>0<128)t.push(e);else if(e>=0){for(;e>127;)t.push(e&127|128),e>>>=7;t.push(e)}else{for(let n=0;n<9;n++)t.push(e&127|128),e>>=7;t.push(1)}}function f(){let e=this.buf[this.pos++];if(!(e&128))return this.assertBounds(),e;let t=e&127;if(e=this.buf[this.pos++],t|=(e&127)<<7,!(e&128)||(e=this.buf[this.pos++],t|=(e&127)<<14,!(e&128))||(e=this.buf[this.pos++],t|=(e&127)<<21,!(e&128)))return this.assertBounds(),t;e=this.buf[this.pos++],t|=(e&15)<<28;for(let t=5;e&128&&t<10;t++)e=this.buf[this.pos++];if(e&128)throw Error(`invalid varint`);return this.assertBounds(),t>>>0}}}),x=m({"node_modules/@bufbuild/protobuf/dist/commonjs/proto-int64.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.protoInt64=void 0;var t=b();e.protoInt64=n();function n(){let e=/* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));if(typeof BigInt==`function`&&typeof e.getBigInt64==`function`&&typeof e.getBigUint64==`function`&&typeof e.setBigInt64==`function`&&typeof e.setBigUint64==`function`&&(globalThis.Deno||globalThis.Bun||typeof process!=`object`||{}.BUF_BIGINT_DISABLE!==`1`)){let t=BigInt(`-9223372036854775808`),n=BigInt(`9223372036854775807`),r=BigInt(`0`),i=BigInt(`18446744073709551615`);return{zero:BigInt(0),supported:!0,parse(e){let r=typeof e==`bigint`?e:BigInt(e);if(r>n||r<t)throw Error(`invalid int64: ${e}`);return r},uParse(e){let t=typeof e==`bigint`?e:BigInt(e);if(t>i||t<r)throw Error(`invalid uint64: ${e}`);return t},enc(t){return e.setBigInt64(0,this.parse(t),!0),{lo:e.getInt32(0,!0),hi:e.getInt32(4,!0)}},uEnc(t){return e.setBigInt64(0,this.uParse(t),!0),{lo:e.getInt32(0,!0),hi:e.getInt32(4,!0)}},dec(t,n){return e.setInt32(0,t,!0),e.setInt32(4,n,!0),e.getBigInt64(0,!0)},uDec(t,n){return e.setInt32(0,t,!0),e.setInt32(4,n,!0),e.getBigUint64(0,!0)}}}return{zero:`0`,supported:!1,parse(e){return typeof e!=`string`&&(e=e.toString()),r(e),e},uParse(e){return typeof e!=`string`&&(e=e.toString()),i(e),e},enc(e){return typeof e!=`string`&&(e=e.toString()),r(e),(0,t.int64FromString)(e)},uEnc(e){return typeof e!=`string`&&(e=e.toString()),i(e),(0,t.int64FromString)(e)},dec(e,n){return(0,t.int64ToString)(e,n)},uDec(e,n){return(0,t.uInt64ToString)(e,n)}}}function r(e){if(!/^-?[0-9]+$/.test(e))throw Error(`invalid int64: `+e)}function i(e){if(!/^[0-9]+$/.test(e))throw Error(`invalid uint64: `+e)}}}),S=m({"node_modules/@bufbuild/protobuf/dist/commonjs/reflect/scalar.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.scalarEquals=r,e.scalarZeroValue=i,e.isScalarZeroValue=a;var t=x(),n=y();function r(e,t,r){if(t===r)return!0;if(e==n.ScalarType.BYTES){if(!(t instanceof Uint8Array)||!(r instanceof Uint8Array)||t.length!==r.length)return!1;for(let e=0;e<t.length;e++)if(t[e]!==r[e])return!1;return!0}switch(e){case n.ScalarType.UINT64:case n.ScalarType.FIXED64:case n.ScalarType.INT64:case n.ScalarType.SFIXED64:case n.ScalarType.SINT64:return t==r}return!1}function i(e,r){switch(e){case n.ScalarType.STRING:return``;case n.ScalarType.BOOL:return!1;case n.ScalarType.DOUBLE:case n.ScalarType.FLOAT:return 0;case n.ScalarType.INT64:case n.ScalarType.UINT64:case n.ScalarType.SFIXED64:case n.ScalarType.FIXED64:case n.ScalarType.SINT64:return r?`0`:t.protoInt64.zero;case n.ScalarType.BYTES:return/* @__PURE__ */ new Uint8Array;default:return 0}}function a(e,t){switch(e){case n.ScalarType.BOOL:return t===!1;case n.ScalarType.STRING:return t===``;case n.ScalarType.BYTES:return t instanceof Uint8Array&&!t.byteLength;case n.ScalarType.DOUBLE:case n.ScalarType.FLOAT:return Object.is(t,0);default:return t==0}}}}),C=m({"node_modules/@bufbuild/protobuf/dist/commonjs/reflect/unsafe.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.unsafeLocal=void 0,e.unsafeOneofCase=r,e.unsafeIsSet=i,e.unsafeIsSetExplicit=a,e.unsafeGet=o,e.unsafeSet=s,e.unsafeClear=c;var t=S(),n=2;e.unsafeLocal=/* @__PURE__ */ Symbol.for(`reflect unsafe local`);function r(e,t){let n=e[t.localName].case;return n===void 0?n:t.fields.find(e=>e.localName===n)}function i(e,r){let i=r.localName;if(r.oneof)return e[r.oneof.localName].case===i;if(r.presence!=n)return e[i]!==void 0&&Object.prototype.hasOwnProperty.call(e,i);switch(r.fieldKind){case`list`:return e[i].length>0;case`map`:return Object.keys(e[i]).length>0;case`scalar`:return!(0,t.isScalarZeroValue)(r.scalar,e[i]);case`enum`:return e[i]!==r.enum.values[0].number}throw Error(`message field with implicit presence`)}function a(e,t){return Object.prototype.hasOwnProperty.call(e,t)&&e[t]!==void 0}function o(e,t){if(t.oneof){let n=e[t.oneof.localName];return n.case===t.localName?n.value:void 0}return e[t.localName]}function s(e,t,n){t.oneof?e[t.oneof.localName]={case:t.localName,value:n}:e[t.localName]=n}function c(e,r){let i=r.localName;if(r.oneof){let t=r.oneof.localName;e[t].case===i&&(e[t]={case:void 0})}else if(r.presence!=n)delete e[i];else switch(r.fieldKind){case`map`:e[i]={};break;case`list`:e[i]=[];break;case`enum`:e[i]=r.enum.values[0].number;break;case`scalar`:e[i]=(0,t.scalarZeroValue)(r.scalar,r.longAsString)}}}}),w=m({"node_modules/@bufbuild/protobuf/dist/commonjs/reflect/guard.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.isObject=n,e.isOneofADT=r,e.isReflectList=i,e.isReflectMap=a,e.isReflectMessage=o;var t=C();function n(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function r(e){return typeof e==`object`&&!!e&&`case`in e&&(typeof e.case==`string`&&`value`in e&&e.value!=null||e.case===void 0&&(!(`value`in e)||e.value===void 0))}function i(e,r){if(n(e)&&t.unsafeLocal in e&&`add`in e&&`field`in e&&typeof e.field==`function`){if(r!==void 0){let t=r,n=e.field();return t.listKind==n.listKind&&t.scalar===n.scalar&&t.message?.typeName===n.message?.typeName&&t.enum?.typeName===n.enum?.typeName}return!0}return!1}function a(e,r){if(n(e)&&t.unsafeLocal in e&&`has`in e&&`field`in e&&typeof e.field==`function`){if(r!==void 0){let t=r,n=e.field();return t.mapKey===n.mapKey&&t.mapKind==n.mapKind&&t.scalar===n.scalar&&t.message?.typeName===n.message?.typeName&&t.enum?.typeName===n.enum?.typeName}return!0}return!1}function o(e,r){return n(e)&&t.unsafeLocal in e&&`desc`in e&&n(e.desc)&&e.desc.kind===`message`&&(r===void 0||e.desc.typeName==r.typeName)}}}),T=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/wrappers.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.isWrapper=t,e.isWrapperDesc=n,e.hasCustomJsonRepresentation=r;function t(e){return a(e.$typeName)}function n(e){let t=e.fields[0];return a(e.typeName)&&t!==void 0&&t.fieldKind==`scalar`&&t.name==`value`&&t.number==1}function r(e){switch(e.typeName){case`google.protobuf.Any`:case`google.protobuf.Timestamp`:case`google.protobuf.Duration`:case`google.protobuf.FieldMask`:case`google.protobuf.Struct`:case`google.protobuf.Value`:case`google.protobuf.ListValue`:return!0;default:return n(e)}}var i=/* @__PURE__ */ new Set([`google.protobuf.DoubleValue`,`google.protobuf.FloatValue`,`google.protobuf.Int64Value`,`google.protobuf.UInt64Value`,`google.protobuf.Int32Value`,`google.protobuf.UInt32Value`,`google.protobuf.BoolValue`,`google.protobuf.StringValue`,`google.protobuf.BytesValue`]);function a(e){return i.has(e)}}}),E=m({"node_modules/@bufbuild/protobuf/dist/commonjs/create.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.create=l;var t=v(),n=y(),r=S(),i=w(),a=T(),o=999,s=998,c=2;function l(e,n){return(0,t.isMessage)(n,e)?n:d(e)(n)}var u=/* @__PURE__ */ new WeakMap;function d(e){let t=u.get(e);return t===void 0&&(t=g(e),u.set(e,t)),t}var f=0,p=1,m=2,h=3;function g(e){let t=e.typeName,{properties:n,prototype:r}=_(e);return e=>{let a;r===void 0?a={$typeName:t}:(a=Object.create(r),a.$typeName=t);for(let t=0;t<n.length;t++){let r=n[t],o=r.name,s=e?.[o];switch(r.kind){case f:s==null?r.constant!==void 0&&(a[o]=r.constant):a[o]=r.convert===void 0?s:r.convert(s);break;case p:a[o]=r.convert!==void 0&&Array.isArray(s)?s.map(r.convert):s??[];break;case m:if(r.convert===void 0||!(0,i.isObject)(s))a[o]=s??{};else{let e={},t=Object.keys(s);for(let n=0;n<t.length;n++)e[t[n]]=r.convert(s[t[n]]);a[o]=e}break;case h:{let e=s;if(e?.case!=null){let t=r.convert.get(e.case);if(t!==void 0){a[o]={case:e.case,value:t(e.value)};break}}a[o]={case:void 0};break}}}return a}}function _(e){let t=[],r={},i=E(e);for(let a of e.members){let e=a.localName;if(a.kind==`oneof`)t.push({name:e,kind:h,constant:void 0,convert:b(a)});else switch(a.fieldKind){case`message`:t.push({name:e,kind:f,constant:void 0,convert:x(a)});break;case`list`:t.push({name:e,kind:p,constant:void 0,convert:a.listKind==`message`?x(a)??(e=>e):a.scalar==n.ScalarType.BYTES?C:void 0});break;case`map`:t.push({name:e,kind:m,constant:void 0,convert:a.mapKind==`message`?x(a)??(e=>e):a.scalar==n.ScalarType.BYTES?C:void 0});break;default:{let o=D(a);t.push({name:e,kind:f,constant:a.presence==c?o:void 0,convert:a.fieldKind==`scalar`&&a.scalar==n.ScalarType.BYTES?C:void 0}),i&&(r[e]=o);break}}}return{properties:t,prototype:i?r:void 0}}function b(e){let t=/* @__PURE__ */ new Map;for(let r of e.fields){let e;r.fieldKind==`message`?e=x(r):r.fieldKind==`scalar`&&r.scalar==n.ScalarType.BYTES&&(e=C),t.set(r.localName,e??(e=>e))}return t}function x(e){if(e.fieldKind==`message`&&!e.oneof&&(0,a.isWrapperDesc)(e.message))return e.message.fields[0].scalar==n.ScalarType.BYTES?C:void 0;if(e.message.typeName==`google.protobuf.Struct`&&e.parent.typeName!==`google.protobuf.Value`)return;let r=e.message,o;return e=>!(0,i.isObject)(e)||(0,t.isMessage)(e,r)?e:(o??=d(r),o(e))}function C(e){return Array.isArray(e)?new Uint8Array(e):e}function E(e){switch(e.file.edition){case o:return!1;case s:return!0;default:return e.fields.some(e=>e.presence!=c&&e.fieldKind!=`message`&&!e.oneof)}}function D(e){let t=e.getDefaultValue();return t===void 0?e.fieldKind==`scalar`?(0,r.scalarZeroValue)(e.scalar,e.longAsString):e.enum.values[0].number:e.fieldKind==`scalar`&&e.longAsString?t.toString():t}}}),D=m({"node_modules/@bufbuild/protobuf/dist/commonjs/reflect/error.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.FieldError=void 0,e.isFieldError=n;var t=[`FieldValueInvalidError`,`FieldListRangeError`,`ForeignFieldError`];e.FieldError=class extends Error{constructor(e,t,n=`FieldValueInvalidError`){super(t),this.name=n,this.field=()=>e}};function n(e){return e instanceof Error&&t.includes(e.name)&&`field`in e&&typeof e.field==`function`}}}),O=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wire/text-encoding.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.configureTextEncoding=n,e.getTextEncoding=r,e.emulateEncodeInto=i;var t=/* @__PURE__ */ Symbol.for(`@bufbuild/protobuf/text-encoding`);function n(e){globalThis[t]=Object.assign(Object.assign({},e),{encodeUtf8Into:e.encodeUtf8Into??i(e.encodeUtf8.bind(e))})}function r(){let e=globalThis;if(!e[t]){let t=new e.TextEncoder,r=new e.TextDecoder,i,a={encodeUtf8(e){return t.encode(e)},decodeUtf8(t,n){return n?(i||=new e.TextDecoder(`utf-8`,{fatal:!0}),i.decode(t)):r.decode(t)},checkUtf8(e){try{return!0}catch{return!1}}};t.encodeInto&&(a.encodeUtf8Into=t.encodeInto.bind(t));let o=String.prototype.isWellFormed;o&&(a.checkUtf8=e=>o.call(e)),n(a)}return e[t]}function i(e){return(t,n)=>{let r=e(t);return n.set(r),{written:r.byteLength}}}}}),ee=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wire/binary-encoding.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.BinaryReader=e.BinaryWriter=e.INT32_MIN=e.INT32_MAX=e.UINT32_MAX=e.FLOAT32_MIN=e.FLOAT32_MAX=e.WireType=void 0;var t=b(),n=x(),r=O(),i;(function(e){e[e.Varint=0]=`Varint`,e[e.Bit64=1]=`Bit64`,e[e.LengthDelimited=2]=`LengthDelimited`,e[e.StartGroup=3]=`StartGroup`,e[e.EndGroup=4]=`EndGroup`,e[e.Bit32=5]=`Bit32`})(i||(e.WireType=i={})),e.FLOAT32_MAX=34028234663852886e22,e.FLOAT32_MIN=-34028234663852886e22,e.UINT32_MAX=4294967295,e.INT32_MAX=2147483647,e.INT32_MIN=-2147483648,e.BinaryWriter=class{constructor(e){this.stackPos=[],this.encodeUtf8Into=e?(0,r.emulateEncodeInto)(e):(0,r.getTextEncoding)().encodeUtf8Into,this.buffer=s,this.viewCache=c,this.pos=0}ensureCapacity(e){let t=this.pos+e;if(t>this.buffer.length){let e=this.buffer.length||a;for(;e<t;)e*=2;let n=new Uint8Array(e);this.pos>0&&n.set(this.buffer),this.buffer=n}}view(){let e=this.buffer,t=this.viewCache;if(t.byteLength===e.byteLength)return t;let n=new DataView(e.buffer);return this.viewCache=n,n}finish(){let e=this.buffer.slice(0,this.pos);return this.pos=0,this.stackPos=[],e}fork(){return this.stackPos.push(this.pos),this.ensureCapacity(o),this.buffer[this.pos++]=0,this}join(){let e=this.stackPos.pop();if(e===void 0)throw Error(`invalid state, fork stack empty`);let t=this.pos-e-o,n=u(t);return n>o&&(this.ensureCapacity(n-o),this.buffer.copyWithin(e+n,e+o,this.pos)),this.pos=e,this.uint32(t),this.pos+=t,this}tag(e,t){return this.uint32((e<<3|t)>>>0)}raw(e){return this.ensureCapacity(e.length),this.buffer.set(e,this.pos),this.pos+=e.length,this}uint32(e){if(f(e),this.ensureCapacity(5),e<128)return this.buffer[this.pos++]=e,this;for(;e>127;)this.buffer[this.pos++]=e&127|128,e>>>=7;return this.buffer[this.pos++]=e,this}int32(e){if(d(e),e>=0)return this.uint32(e);this.ensureCapacity(10);for(let t=0;t<9;t++)this.buffer[this.pos++]=e&127|128,e>>=7;return this.buffer[this.pos++]=1,this}bool(e){return this.ensureCapacity(1),this.buffer[this.pos++]=+!!e,this}bytes(e){return this.uint32(e.byteLength),this.raw(e)}string(e){typeof e!=`string`&&(e=String(e));let t=e.length;if(t<=l){this.ensureCapacity(t+1);let n=this.buffer,r=this.pos;n[r++]=t;let i=0;for(;i<t;i++){let t=e.charCodeAt(i);if(t>127)break;n[r++]=t}if(i==t)return this.pos=r,this}this.ensureCapacity(t*3+5);let n=u(t),r=this.buffer,i=this.pos,{written:a}=this.encodeUtf8Into(e,r.subarray(i+n)),o=u(a);return o!=n&&r.copyWithin(i+o,i+n,i+n+a),this.uint32(a),this.pos+=a,this}float(e){return p(e),this.ensureCapacity(4),this.view().setFloat32(this.pos,e,!0),this.pos+=4,this}double(e){return this.ensureCapacity(8),this.view().setFloat64(this.pos,e,!0),this.pos+=8,this}fixed32(e){return f(e),this.ensureCapacity(4),this.view().setUint32(this.pos,e,!0),this.pos+=4,this}sfixed32(e){return d(e),this.ensureCapacity(4),this.view().setInt32(this.pos,e,!0),this.pos+=4,this}sint32(e){return d(e),this.uint32((e<<1^e>>31)>>>0)}sfixed64(e){let t=n.protoInt64.enc(e);this.ensureCapacity(8);let r=this.view();return r.setInt32(this.pos,t.lo,!0),r.setInt32(this.pos+4,t.hi,!0),this.pos+=8,this}fixed64(e){let t=n.protoInt64.uEnc(e);this.ensureCapacity(8);let r=this.view();return r.setInt32(this.pos,t.lo,!0),r.setInt32(this.pos+4,t.hi,!0),this.pos+=8,this}int64(e){let t=n.protoInt64.enc(e);return this.writeVarint64(t.lo,t.hi)}sint64(e){let t=n.protoInt64.enc(e),r=t.hi>>31,i=t.lo<<1^r,a=(t.hi<<1|t.lo>>>31)^r;return this.writeVarint64(i,a)}uint64(e){let t=n.protoInt64.uEnc(e);return this.writeVarint64(t.lo,t.hi)}writeVarint64(e,t){this.ensureCapacity(10);let n=this.buffer,r=this.pos;for(let i=0;i<28;i+=7){let a=e>>>i,o=!(!(a>>>7)&&t==0);if(n[r++]=(o?a|128:a)&255,!o)return this.pos=r,this}let i=e>>>28&15|(t&7)<<4,a=!!(t>>3);if(n[r++]=(a?i|128:i)&255,!a)return this.pos=r,this;for(let e=3;e<31;e+=7){let i=t>>>e,a=!!(i>>>7);if(n[r++]=(a?i|128:i)&255,!a)return this.pos=r,this}return n[r++]=t>>>31&1,this.pos=r,this}};var a=128,o=1,s=/* @__PURE__ */ new Uint8Array,c=new DataView(s.buffer),l=32;function u(e){return e<128?1:e<16384?2:e<2097152?3:e<268435456?4:5}e.BinaryReader=class{constructor(e,n=(0,r.getTextEncoding)().decodeUtf8){this.decodeUtf8=n,this.varint64Lo=0,this.varint64Hi=0,this.varint64=t.varint64read,this.uint32=t.varint32read,this.buf=e,this.len=e.length,this.pos=0,this.view=new DataView(e.buffer,e.byteOffset,e.byteLength)}tag(){let e=this.pos,t=this.uint32(),n=this.pos-e;if(n>5||n==5&&this.buf[this.pos-1]>15)throw Error(`illegal tag: varint overflows uint32`);let r=t>>>3,i=t&7;if(r<=0||i>5)throw Error(`illegal tag: field no `+r+` wire type `+i);return[r,i]}skip(e,t,n=100){let r=this.pos;switch(e){case i.Varint:for(;this.buf[this.pos++]&128;);break;case i.Bit64:this.pos+=4;case i.Bit32:this.pos+=4;break;case i.LengthDelimited:let r=this.uint32();this.pos+=r;break;case i.StartGroup:if(n<=0)throw Error(`maximum recursion depth reached`);for(;;){let[e,r]=this.tag();if(r===i.EndGroup){if(t!==void 0&&e!==t)throw Error(`invalid end group tag`);break}this.skip(r,e,n-1)}break;default:throw Error(`cant skip wire type `+e)}return this.assertBounds(),this.buf.subarray(r,this.pos)}assertBounds(){if(this.pos>this.len)throw RangeError(`premature EOF`)}int32(){return this.uint32()|0}sint32(){let e=this.uint32();return e>>>1^-(e&1)}int64(){return this.varint64(),n.protoInt64.dec(this.varint64Lo,this.varint64Hi)}uint64(){return this.varint64(),n.protoInt64.uDec(this.varint64Lo,this.varint64Hi)}sint64(){this.varint64();let e=this.varint64Lo,t=this.varint64Hi,r=-(e&1);return e=(e>>>1|(t&1)<<31)^r,t=t>>>1^r,n.protoInt64.dec(e,t)}bool(){let e=this.buf[this.pos];return e<128?(this.pos++,e!==0):(this.varint64(),this.varint64Lo!==0||this.varint64Hi!==0)}fixed32(){return this.view.getUint32((this.pos+=4)-4,!0)}sfixed32(){return this.view.getInt32((this.pos+=4)-4,!0)}fixed64(){return n.protoInt64.uDec(this.sfixed32(),this.sfixed32())}sfixed64(){return n.protoInt64.dec(this.sfixed32(),this.sfixed32())}float(){return this.view.getFloat32((this.pos+=4)-4,!0)}double(){return this.view.getFloat64((this.pos+=8)-8,!0)}bytes(){let e=this.uint32(),t=this.pos;return this.pos+=e,this.assertBounds(),this.buf.subarray(t,t+e)}string(e){let t=this.bytes(),n=t.length;if(n<=l){let r=Array(n);for(let i=0;i<n;i++){let n=t[i];if(n>127)return this.decodeUtf8(t,e);r[i]=n}return String.fromCharCode.apply(String,r)}return this.decodeUtf8(t,e)}};function d(t){if(typeof t==`string`)t=Number(t);else if(typeof t!=`number`)throw Error(`invalid int32: `+typeof t);if(!Number.isInteger(t)||t>e.INT32_MAX||t<e.INT32_MIN)throw Error(`invalid int32: `+t)}function f(t){if(typeof t==`string`)t=Number(t);else if(typeof t!=`number`)throw Error(`invalid uint32: `+typeof t);if(!Number.isInteger(t)||t>e.UINT32_MAX||t<0)throw Error(`invalid uint32: `+t)}function p(t){if(typeof t==`string`){let e=t;if(t=Number(t),Number.isNaN(t)&&e!==`NaN`)throw Error(`invalid float32: `+e)}else if(typeof t!=`number`)throw Error(`invalid float32: `+typeof t);if(Number.isFinite(t)&&(t>e.FLOAT32_MAX||t<e.FLOAT32_MIN))throw Error(`invalid float32: `+t)}}}),te=m({"node_modules/@bufbuild/protobuf/dist/commonjs/reflect/reflect-check.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.checkField=c,e.checkListItem=l,e.checkMapEntry=u,e.checkScalarValue=f,e.reasonSingular=p,e.formatVal=m;var t=y(),n=v(),r=D(),i=w(),a=ee(),o=O(),s=x();function c(e,t){let n=e.fieldKind==`list`?(0,i.isReflectList)(t,e):e.fieldKind==`map`?(0,i.isReflectMap)(t,e):d(e,t);if(n===!0)return;let a;switch(e.fieldKind){case`list`:a=`expected ${g(e)}, got ${m(t)}`;break;case`map`:a=`expected ${_(e)}, got ${m(t)}`;break;default:a=p(e,t,n)}return new r.FieldError(e,a)}function l(e,t,n){let i=d(e,n);if(i!==!0)return new r.FieldError(e,`list item #${t+1}: ${p(e,n,i)}`)}function u(e,t,n){let i=f(e.mapKey)(t);if(i!==!0)return new r.FieldError(e,`invalid map key: ${p({scalar:e.mapKey},t,i)}`);let a=d(e,n);if(a!==!0)return new r.FieldError(e,`map entry ${m(t)}: ${p(e,n,a)}`)}function d(e,n){return e.scalar===void 0?e.enum===void 0?(0,i.isReflectMessage)(n,e.message):e.enum.open?f(t.ScalarType.INT32)(n):e.enum.values.some(e=>e.number===n):f(e.scalar)(n)}function f(e){switch(e){case t.ScalarType.DOUBLE:return e=>typeof e==`number`;case t.ScalarType.FLOAT:return e=>typeof e==`number`?Number.isNaN(e)||!Number.isFinite(e)?!0:e>a.FLOAT32_MAX||e<a.FLOAT32_MIN?`${e.toFixed()} out of range`:!0:!1;case t.ScalarType.INT32:case t.ScalarType.SFIXED32:case t.ScalarType.SINT32:return e=>typeof e!=`number`||!Number.isInteger(e)?!1:e>a.INT32_MAX||e<a.INT32_MIN?`${e.toFixed()} out of range`:!0;case t.ScalarType.FIXED32:case t.ScalarType.UINT32:return e=>typeof e!=`number`||!Number.isInteger(e)?!1:e>a.UINT32_MAX||e<0?`${e.toFixed()} out of range`:!0;case t.ScalarType.BOOL:return e=>typeof e==`boolean`;case t.ScalarType.STRING:return e=>typeof e==`string`?(0,o.getTextEncoding)().checkUtf8(e)||`invalid UTF8`:!1;case t.ScalarType.BYTES:return e=>e instanceof Uint8Array;case t.ScalarType.INT64:case t.ScalarType.SFIXED64:case t.ScalarType.SINT64:return e=>{if(typeof e==`bigint`||typeof e==`number`||typeof e==`string`&&e.length>0)try{return s.protoInt64.parse(e),!0}catch{return`${e} out of range`}return!1};case t.ScalarType.FIXED64:case t.ScalarType.UINT64:return e=>{if(typeof e==`bigint`||typeof e==`number`||typeof e==`string`&&e.length>0)try{return s.protoInt64.uParse(e),!0}catch{return`${e} out of range`}return!1}}}function p(e,t,n){return n=typeof n==`string`?`: ${n}`:`, got ${m(t)}`,e.scalar===void 0?e.enum===void 0?`expected ${h(e.message)}`+n:`expected ${e.enum.toString()}`+n:`expected ${b(e.scalar)}`+n}function m(e){switch(typeof e){case`object`:return e===null?`null`:e instanceof Uint8Array?`Uint8Array(${e.length})`:Array.isArray(e)?`Array(${e.length})`:(0,i.isReflectList)(e)?g(e.field()):(0,i.isReflectMap)(e)?_(e.field()):(0,i.isReflectMessage)(e)?h(e.desc):(0,n.isMessage)(e)?`message ${e.$typeName}`:`object`;case`string`:return e.length>30?`string`:`"${e.split(`"`).join(`\\"`)}"`;case`boolean`:return String(e);case`number`:return String(e);case`bigint`:return String(e)+`n`;default:return typeof e}}function h(e){return`ReflectMessage (${e.typeName})`}function g(e){switch(e.listKind){case`message`:return`ReflectList (${e.message.toString()})`;case`enum`:return`ReflectList (${e.enum.toString()})`;case`scalar`:return`ReflectList (${t.ScalarType[e.scalar]})`}}function _(e){switch(e.mapKind){case`message`:return`ReflectMap (${t.ScalarType[e.mapKey]}, ${e.message.toString()})`;case`enum`:return`ReflectMap (${t.ScalarType[e.mapKey]}, ${e.enum.toString()})`;case`scalar`:return`ReflectMap (${t.ScalarType[e.mapKey]}, ${t.ScalarType[e.scalar]})`}}function b(e){switch(e){case t.ScalarType.STRING:return`string`;case t.ScalarType.BOOL:return`boolean`;case t.ScalarType.INT64:case t.ScalarType.SINT64:case t.ScalarType.SFIXED64:return`bigint (int64)`;case t.ScalarType.UINT64:case t.ScalarType.FIXED64:return`bigint (uint64)`;case t.ScalarType.BYTES:return`Uint8Array`;case t.ScalarType.DOUBLE:return`number (float64)`;case t.ScalarType.FLOAT:return`number (float32)`;case t.ScalarType.FIXED32:case t.ScalarType.UINT32:return`number (uint32)`;case t.ScalarType.INT32:case t.ScalarType.SFIXED32:case t.ScalarType.SINT32:return`number (int32)`}}}}),k=m({"node_modules/@bufbuild/protobuf/dist/commonjs/reflect/message.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.localMessageMapper=a,e.wktStructToReflect=s,e.wktStructToLocal=c;var t=E(),n=w(),r=T(),i=0;function a(e){if(o(e))return{toMessage:e=>s(e),toLocal:e=>c(e)};if(e.fieldKind==`message`&&!e.oneof&&(0,r.isWrapperDesc)(e.message)){let n=e.message,r=n.fields[0].localName;return{toMessage:e=>{let i=(0,t.create)(n);return e!==void 0&&(i[r]=e),i},toLocal:e=>e[r]}}let n=e.message;return{toMessage:e=>e===void 0?(0,t.create)(n):e,toLocal:e=>e}}function o(e){return e.message.typeName==`google.protobuf.Struct`&&e.parent.typeName!=`google.protobuf.Value`}function s(e){let t={$typeName:`google.protobuf.Struct`,fields:{}};if((0,n.isObject)(e))for(let n of Object.keys(e))t.fields[n]=u(e[n]);return t}function c(e){let t={};for(let n of Object.keys(e.fields))t[n]=l(e.fields[n]);return t}function l(e){switch(e.kind.case){case`structValue`:return c(e.kind.value);case`listValue`:return e.kind.value.values.map(l);case`nullValue`:case void 0:return null;default:return e.kind.value}}function u(e){let t={$typeName:`google.protobuf.Value`,kind:{case:void 0}};switch(typeof e){case`number`:t.kind={case:`numberValue`,value:e};break;case`string`:t.kind={case:`stringValue`,value:e};break;case`boolean`:t.kind={case:`boolValue`,value:e};break;case`object`:if(e===null)t.kind={case:`nullValue`,value:i};else if(Array.isArray(e)){let n={$typeName:`google.protobuf.ListValue`,values:[]};if(Array.isArray(e))for(let t of e)n.values.push(u(t));t.kind={case:`listValue`,value:n}}else t.kind={case:`structValue`,value:s(e)}}return t}}}),A=m({"node_modules/@bufbuild/protobuf/dist/commonjs/reflect/reflect.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.reflect=d,e.reflectList=h,e.reflectMap=_;var t=y(),n=te(),r=D(),i=C(),a=E(),o=T(),s=S(),c=x(),l=w(),u=k();function d(e,t,n=!0){return new p(e,t,n)}var f=/* @__PURE__ */ new WeakMap,p=class{get sortedFields(){let e=f.get(this.desc);if(e)return e;let t=this.desc.fields.concat().sort((e,t)=>e.number-t.number);return f.set(this.desc,t),t}constructor(e,t,n=!0){this.lists=/* @__PURE__ */ new Map,this.maps=/* @__PURE__ */ new Map,this.check=n,this.desc=e,this.message=this[i.unsafeLocal]=t??(0,a.create)(e),this.fields=e.fields,this.oneofs=e.oneofs,this.members=e.members}findNumber(e){return this._fieldsByNumber||=new Map(this.desc.fields.map(e=>[e.number,e])),this._fieldsByNumber.get(e)}oneofCase(e){return m(this.message,e),(0,i.unsafeOneofCase)(this.message,e)}isSet(e){return m(this.message,e),(0,i.unsafeIsSet)(this.message,e)}clear(e){m(this.message,e),(0,i.unsafeClear)(this.message,e)}get(e){m(this.message,e);let t=(0,i.unsafeGet)(this.message,e);switch(e.fieldKind){case`list`:let n=this.lists.get(e);return(!n||n[i.unsafeLocal]!==t)&&this.lists.set(e,n=new g(e,t,this.check)),n;case`map`:let r=this.maps.get(e);return(!r||r[i.unsafeLocal]!==t)&&this.maps.set(e,r=new v(e,t,this.check)),r;case`message`:return O(e,t,this.check);case`scalar`:return t===void 0?(0,s.scalarZeroValue)(e.scalar,!1):ie(e,t);case`enum`:return t??e.enum.values[0].number}}set(e,t){if(m(this.message,e),this.check){let r=(0,n.checkField)(e,t);if(r)throw r}let r;r=e.fieldKind==`message`?b(e,t):(0,l.isReflectMap)(t)||(0,l.isReflectList)(t)?t[i.unsafeLocal]:ae(e,t),(0,i.unsafeSet)(this.message,e,r)}getUnknown(){return this.message.$unknown}setUnknown(e){this.message.$unknown=e}};function m(e,t){if(t.parent.typeName!==e.$typeName)throw new r.FieldError(t,`cannot use ${t.toString()} with message ${e.$typeName}`,`ForeignFieldError`)}function h(e,t,n=!0){return new g(e,t??[],n)}var g=class{field(){return this._field}get size(){return this._arr.length}constructor(e,t,n){this._field=e,this._arr=this[i.unsafeLocal]=t,this.check=n}get(e){let t=this._arr[e];return t===void 0?void 0:A(this._field,t,this.check)}set(e,t){if(e<0||e>=this._arr.length)throw new r.FieldError(this._field,`list item #${e+1}: out of range`);if(this.check){let r=(0,n.checkListItem)(this._field,e,t);if(r)throw r}this._arr[e]=ee(this._field,t)}add(e){if(this.check){let t=(0,n.checkListItem)(this._field,this._arr.length,e);if(t)throw t}this._arr.push(ee(this._field,e))}clear(){this._arr.splice(0,this._arr.length)}[Symbol.iterator](){return this.values()}keys(){return this._arr.keys()}*values(){for(let e of this._arr)yield A(this._field,e,this.check)}*entries(){for(let e=0;e<this._arr.length;e++)yield[e,A(this._field,this._arr[e],this.check)]}};function _(e,t,n=!0){return new v(e,t,n)}var v=class{constructor(e,t,n=!0){this.obj=this[i.unsafeLocal]=t??{},this.check=n,this._field=e}field(){return this._field}set(e,t){if(this.check){let r=(0,n.checkMapEntry)(this._field,e,t);if(r)throw r}return this.obj[ne(e)]=j(this._field,t),this}delete(e){let t=ne(e),n=Object.prototype.hasOwnProperty.call(this.obj,t);return n&&delete this.obj[t],n}clear(){for(let e of Object.keys(this.obj))delete this.obj[e]}get(e){let t=this.obj[ne(e)];return t!==void 0&&(t=M(this._field,t,this.check)),t}has(e){return Object.prototype.hasOwnProperty.call(this.obj,ne(e))}*keys(){for(let e of Object.keys(this.obj))yield re(e,this._field.mapKey)}*entries(){for(let e of Object.entries(this.obj))yield[re(e[0],this._field.mapKey),M(this._field,e[1],this.check)]}[Symbol.iterator](){return this.entries()}get size(){return Object.keys(this.obj).length}*values(){for(let e of Object.values(this.obj))yield M(this._field,e,this.check)}forEach(e,t){for(let n of this.entries())e.call(t,n[1],n[0],this)}};function b(e,t){return(0,l.isReflectMessage)(t)?(0,o.isWrapper)(t.message)&&!e.oneof&&e.fieldKind==`message`?t.message.value:t.desc.typeName==`google.protobuf.Struct`&&e.parent.typeName!=`google.protobuf.Value`?(0,u.wktStructToLocal)(t.message):t.message:t}function O(e,t,n){return t!==void 0&&((0,o.isWrapperDesc)(e.message)&&!e.oneof&&e.fieldKind==`message`?t={$typeName:e.message.typeName,value:ie(e.message.fields[0],t)}:e.message.typeName==`google.protobuf.Struct`&&e.parent.typeName!=`google.protobuf.Value`&&(0,l.isObject)(t)&&(t=(0,u.wktStructToReflect)(t))),new p(e.message,t,n)}function ee(e,t){return e.listKind==`message`?b(e,t):ae(e,t)}function A(e,t,n){return e.listKind==`message`?O(e,t,n):ie(e,t)}function j(e,t){return e.mapKind==`message`?b(e,t):ae(e,t)}function M(e,t,n){return e.mapKind==`message`?O(e,t,n):t}function ne(e){return typeof e==`string`||typeof e==`number`?e:String(e)}function re(e,n){switch(n){case t.ScalarType.STRING:return e;case t.ScalarType.INT32:case t.ScalarType.FIXED32:case t.ScalarType.UINT32:case t.ScalarType.SFIXED32:case t.ScalarType.SINT32:{let t=Number.parseInt(e);if(Number.isFinite(t))return t;break}case t.ScalarType.BOOL:switch(e){case`true`:return!0;case`false`:return!1}break;case t.ScalarType.UINT64:case t.ScalarType.FIXED64:try{return c.protoInt64.uParse(e)}catch{}break;default:try{return c.protoInt64.parse(e)}catch{}}return e}function ie(e,n){switch(e.scalar){case t.ScalarType.INT64:case t.ScalarType.SFIXED64:case t.ScalarType.SINT64:`longAsString`in e&&e.longAsString&&typeof n==`string`&&(n=c.protoInt64.parse(n));break;case t.ScalarType.FIXED64:case t.ScalarType.UINT64:`longAsString`in e&&e.longAsString&&typeof n==`string`&&(n=c.protoInt64.uParse(n))}return n}function ae(e,n){switch(e.scalar){case t.ScalarType.INT64:case t.ScalarType.SFIXED64:case t.ScalarType.SINT64:`longAsString`in e&&e.longAsString?n=String(n):(typeof n==`string`||typeof n==`number`)&&(n=c.protoInt64.parse(n));break;case t.ScalarType.FIXED64:case t.ScalarType.UINT64:`longAsString`in e&&e.longAsString?n=String(n):(typeof n==`string`||typeof n==`number`)&&(n=c.protoInt64.uParse(n))}return n}}}),j=m({"node_modules/@bufbuild/protobuf/dist/commonjs/clone.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.clone=i;var t=y(),n=A(),r=w();function i(e,t){return a((0,n.reflect)(e,t)).message}function a(e){let t=(0,n.reflect)(e.desc);for(let n of e.fields)if(e.isSet(n))switch(n.fieldKind){case`list`:let r=t.get(n);for(let t of e.get(n))r.add(o(n,t));break;case`map`:let i=t.get(n);for(let t of e.get(n).entries())i.set(t[0],o(n,t[1]));break;default:t.set(n,o(n,e.get(n)))}let r=e.getUnknown();return r&&r.length>0&&t.setUnknown([...r]),t}function o(e,n){return e.message!==void 0&&(0,r.isReflectMessage)(n)?a(n):e.scalar==t.ScalarType.BYTES&&n instanceof Uint8Array?n.slice():n}}}),M=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wire/base64-encoding.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.base64Decode=n,e.base64Encode=o;var t=Uint8Array.prototype.setFromBase64;function n(e){let n=e.length,i=n-(n+3>>2);!(n&3)&&e[n-1]==`=`&&(i-=e[n-2]==`=`?2:1);let a=new Uint8Array(i),o=-1;if(t)try{let r=t.call(a,e);r.read==n&&(o=r.written)}catch{}return o<0&&(o=r(a,e)),o==i?a:a.subarray(0,o)}function r(e,t){let n=d(),r=0,i=0,a,o=0;for(let s=0;s<t.length;s++){if(a=n[t.charCodeAt(s)],a===void 0)switch(t[s]){case`=`:i=0;case`
`:case`\r`:case`	`:case` `:continue;default:throw Error(`invalid base64 string`)}switch(i){case 0:o=a,i=1;break;case 1:e[r++]=o<<2|(a&48)>>4,o=a,i=2;break;case 2:e[r++]=(o&15)<<4|(a&60)>>2,o=a,i=3;break;case 3:e[r++]=(o&3)<<6|a,i=0}}if(i==1)throw Error(`invalid base64 string`);return r}var i=Uint8Array.prototype.toBase64,a={std:{alphabet:`base64`,omitPadding:!1},std_raw:{alphabet:`base64`,omitPadding:!0},url:{alphabet:`base64url`,omitPadding:!0}};function o(e,t=`std`){if(i)return i.call(e,a[t]);let n=u(t),r=t==`std`,o=``,s=0,c,l=0;for(let t=0;t<e.length;t++)switch(c=e[t],s){case 0:o+=n[c>>2],l=(c&3)<<4,s=1;break;case 1:o+=n[l|c>>4],l=(c&15)<<2,s=2;break;case 2:o+=n[l|c>>6],o+=n[c&63],s=0}return s&&(o+=n[l],r&&(o+=`=`,s==1&&(o+=`=`))),o}var s,c,l;function u(e){return s||(s=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`.split(``),c=s.slice(0,-2).concat(`-`,`_`)),e==`url`?c:s}function d(){if(!l){l=[];let e=u(`std`);for(let t=0;t<e.length;t++)l[e[t].charCodeAt(0)]=t;l[45]=e.indexOf(`+`),l[95]=e.indexOf(`/`)}return l}}}),ne=m({"node_modules/@bufbuild/protobuf/dist/commonjs/reflect/names.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.qualifiedName=t,e.protoCamelCase=n,e.protoSnakeCase=r,e.safeObjectProperty=a;function t(e){switch(e.kind){case`field`:case`oneof`:case`rpc`:return e.parent.typeName+`.`+e.name;case`enum_value`:{let t=e.parent.parent?e.parent.parent.typeName:e.parent.file.proto.package;return t+(t.length>0?`.`:``)+e.name}case`service`:case`message`:case`enum`:case`extension`:return e.typeName;case`file`:return e.proto.name}}function n(e){let t=!1,n=[];for(let r=0;r<e.length;r++){let i=e.charAt(r);switch(i){case`_`:t=!0;break;case`0`:case`1`:case`2`:case`3`:case`4`:case`5`:case`6`:case`7`:case`8`:case`9`:n.push(i),t=!1;break;default:t&&(t=!1,i=i.toUpperCase()),n.push(i)}}return n.join(``)}function r(e){return e.replace(/[A-Z]/g,e=>`_`+e.toLowerCase())}var i=/* @__PURE__ */ new Set([`constructor`,`toString`,`toJSON`,`valueOf`]);function a(e){return i.has(e)?e+`$`:e}}}),re=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/restore-json-names.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.restoreJsonNames=r;var t=ne(),n=C();function r(e){for(let r of e.field)(0,n.unsafeIsSetExplicit)(r,`jsonName`)||(r.jsonName=(0,t.protoCamelCase)(r.name));e.nestedType.forEach(r)}}}),ie=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wire/text-format.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.parseTextFormatEnumValue=r,e.parseTextFormatScalarValue=i;var t=y(),n=x();function r(e,t){let n=e.values.find(e=>e.name===t);if(!n)throw Error(`cannot parse ${e} default value: ${t}`);return n.number}function i(e,r){switch(e){case t.ScalarType.STRING:return r;case t.ScalarType.BYTES:{let n=a(r);if(n===!1)throw Error(`cannot parse ${t.ScalarType[e]} default value: ${r}`);return n}case t.ScalarType.INT64:case t.ScalarType.SFIXED64:case t.ScalarType.SINT64:return n.protoInt64.parse(r);case t.ScalarType.UINT64:case t.ScalarType.FIXED64:return n.protoInt64.uParse(r);case t.ScalarType.DOUBLE:case t.ScalarType.FLOAT:switch(r){case`inf`:return 1/0;case`-inf`:return-1/0;case`nan`:return NaN;default:return parseFloat(r)}case t.ScalarType.BOOL:return r===`true`;case t.ScalarType.INT32:case t.ScalarType.UINT32:case t.ScalarType.SINT32:case t.ScalarType.FIXED32:case t.ScalarType.SFIXED32:return parseInt(r,10)}}function a(e){let t=[],r={tail:e,c:``,next(){return this.tail.length!=0&&(this.c=this.tail[0],this.tail=this.tail.substring(1),!0)},take(e){if(this.tail.length>=e){let t=this.tail.substring(0,e);return this.tail=this.tail.substring(e),t}return!1}};for(;r.next();)switch(r.c){case`\\`:if(r.next())switch(r.c){case`\\`:t.push(r.c.charCodeAt(0));break;case`b`:t.push(8);break;case`f`:t.push(12);break;case`n`:t.push(10);break;case`r`:t.push(13);break;case`t`:t.push(9);break;case`v`:t.push(11);break;case`0`:case`1`:case`2`:case`3`:case`4`:case`5`:case`6`:case`7`:{let e=r.c,n=r.take(2);if(n===!1)return!1;let i=parseInt(e+n,8);if(Number.isNaN(i))return!1;t.push(i);break}case`x`:{let e=r.c,n=r.take(2);if(n===!1)return!1;let i=parseInt(e+n,16);if(Number.isNaN(i))return!1;t.push(i);break}case`u`:{let e=r.c,n=r.take(4);if(n===!1)return!1;let i=parseInt(e+n,16);if(Number.isNaN(i))return!1;let a=/* @__PURE__ */ new Uint8Array(4);new DataView(a.buffer).setInt32(0,i,!0),t.push(a[0],a[1],a[2],a[3]);break}case`U`:{let e=r.c,i=r.take(8);if(i===!1)return!1;let a=n.protoInt64.uEnc(e+i),o=/* @__PURE__ */ new Uint8Array(8),s=new DataView(o.buffer);s.setInt32(0,a.lo,!0),s.setInt32(4,a.hi,!0),t.push(o[0],o[1],o[2],o[3],o[4],o[5],o[6],o[7]);break}}break;default:t.push(r.c.charCodeAt(0))}return new Uint8Array(t)}}}),ae=m({"node_modules/@bufbuild/protobuf/dist/commonjs/reflect/nested-types.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.nestedTypes=t,e.usedTypes=n,e.parentTypes=i;function*t(e){switch(e.kind){case`file`:for(let n of e.messages)yield n,yield*t(n);yield*e.enums,yield*e.services,yield*e.extensions;break;case`message`:for(let n of e.nestedMessages)yield n,yield*t(n);yield*e.nestedEnums,yield*e.nestedExtensions}}function n(e){return r(e,/* @__PURE__ */ new Set)}function*r(e,t){for(let n of e.fields){let e=n.enum??n.message??void 0;!e||t.has(e.typeName)||(t.add(e.typeName),yield e,e.kind==`message`&&(yield*r(e,t)))}}function i(e){let t=[];for(;e.kind!==`file`;){let n=a(e);e=n,t.push(n)}return t}function a(e){switch(e.kind){case`enum_value`:case`field`:case`oneof`:case`rpc`:return e.parent;case`service`:return e.file;case`extension`:case`enum`:case`message`:return e.parent??e.file}}}}),oe=m({"node_modules/@bufbuild/protobuf/dist/commonjs/registry.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.maximumEdition=e.minimumEdition=void 0,e.createRegistry=o,e.createMutableRegistry=s,e.createFileRegistry=c;var t=y(),n=ie(),r=ae(),i=C(),a=ne();function o(...e){return u(e)}function s(...e){let t=u(e);return Object.assign(Object.assign({},t),{remove(e){var n;e.kind==`extension`&&((n=t.extendees.get(e.extendee.typeName))==null||n.delete(e.number)),t.types.delete(e.typeName)}})}function c(...e){let t=l();if(!e.length)return t;if(`$typeName`in e[0]&&e[0].$typeName==`google.protobuf.FileDescriptorSet`){for(let n of e[0].file)j(n,t);return t}if(`$typeName`in e[0]){let n=function(e){let r=[];for(let n of e.dependency){if(t.getFile(n)!=null||a.has(n))continue;let o=i(n);if(!o)throw Error(`Unable to resolve ${n}, imported by ${e.name}`);`kind`in o?t.addFile(o,!1,!0):(a.add(o.name),r.push(o))}return r.concat(...r.map(n))},r=e[0],i=e[1],a=/* @__PURE__ */ new Set;for(let e of[r,...n(r)].reverse())j(e,t)}else for(let n of e)for(let e of n.files)t.addFile(e);return t}function l(){let e=/* @__PURE__ */ new Map,t=/* @__PURE__ */ new Map,n=/* @__PURE__ */ new Map;return{kind:`registry`,types:e,extendees:t,[Symbol.iterator](){return e.values()},get files(){return n.values()},addFile(e,t,i){if(n.set(e.proto.name,e),!t)for(let t of(0,r.nestedTypes)(e))this.add(t);if(i)for(let n of e.dependencies)this.addFile(n,t,i)},add(n){if(n.kind==`extension`){let e=t.get(n.extendee.typeName);e||t.set(n.extendee.typeName,e=/* @__PURE__ */ new Map),e.set(n.number,n)}e.set(n.typeName,n)},get(t){return e.get(t)},getFile(e){return n.get(e)},getMessage(t){let n=e.get(t);return n?.kind==`message`?n:void 0},getEnum(t){let n=e.get(t);return n?.kind==`enum`?n:void 0},getExtension(t){let n=e.get(t);return n?.kind==`extension`?n:void 0},getExtensionFor(e,n){return t.get(e.typeName)?.get(n)},getService(t){let n=e.get(t);return n?.kind==`service`?n:void 0}}}function u(e){let t=l();for(let n of e)switch(n.kind){case`registry`:for(let e of n)t.add(e);break;case`file`:t.addFile(n);break;default:t.add(n)}return t}var d=998,f=999,p=9999,m=9,h=10,g=11,_=12,v=14,b=3,x=2,S=1,w=0,T=1,E=2,D=3,O=1,ee=2,te=1,k=2;e.minimumEdition=998,e.maximumEdition=1001;var A={998:{fieldPresence:1,enumType:2,repeatedFieldEncoding:2,utf8Validation:3,messageEncoding:1,jsonFormat:2,enforceNamingStyle:2,defaultSymbolVisibility:1},999:{fieldPresence:2,enumType:1,repeatedFieldEncoding:1,utf8Validation:2,messageEncoding:1,jsonFormat:1,enforceNamingStyle:2,defaultSymbolVisibility:1},1e3:{fieldPresence:1,enumType:1,repeatedFieldEncoding:1,utf8Validation:2,messageEncoding:1,jsonFormat:1,enforceNamingStyle:2,defaultSymbolVisibility:1},1001:{fieldPresence:1,enumType:1,repeatedFieldEncoding:1,utf8Validation:2,messageEncoding:1,jsonFormat:1,enforceNamingStyle:1,defaultSymbolVisibility:2}};function j(e,t){let n={kind:`file`,proto:e,deprecated:e.options?.deprecated??!1,edition:R(e),name:e.name.replace(/\.proto$/,``),dependencies:z(e,t),enums:[],messages:[],extensions:[],services:[],toString(){return`file ${e.name}`}},r=/* @__PURE__ */ new Map,i={get(e){return r.get(e)},add(e){H(e.proto.options?.mapEntry===!0),r.set(e.typeName,e)}};for(let r of e.enumType)oe(r,n,void 0,t);for(let r of e.messageType)N(r,n,void 0,t,i);for(let r of e.service)P(r,n,t);M(n,t);for(let e of r.values())re(e,t,i);for(let e of n.messages)re(e,t,i),M(e,t);t.addFile(n,!0)}function M(e,t){switch(e.kind){case`file`:for(let n of e.proto.extension){let r=L(n,e,t);e.extensions.push(r),t.add(r)}break;case`message`:for(let n of e.proto.extension){let r=L(n,e,t);e.nestedExtensions.push(r),t.add(r)}for(let n of e.nestedMessages)M(n,t)}}function re(e,t,n){let r=e.proto.oneofDecl.map(t=>I(t,e)),i=/* @__PURE__ */ new Set;for(let a of e.proto.field){let o=ue(a,r),s=L(a,e,t,o,n);e.fields.push(s),e.field[s.localName]=s,o===void 0?e.members.push(s):(o.fields.push(s),i.has(o)||(i.add(o),e.members.push(o)))}for(let t of r.filter(e=>i.has(e)))e.oneofs.push(t);for(let r of e.nestedMessages)re(r,t,n)}function oe(e,t,n,r){let i=se(e.name,e.value),o={kind:`enum`,proto:e,deprecated:e.options?.deprecated??!1,file:t,parent:n,open:!0,name:e.name,typeName:le(e,n,t),value:{},values:[],sharedPrefix:i,toString(){return`enum ${this.typeName}`}};o.open=me(o),r.add(o);for(let t of e.value){let e=t.name;o.values.push(o.value[t.number]={kind:`enum_value`,proto:t,deprecated:t.options?.deprecated??!1,parent:o,name:e,localName:(0,a.safeObjectProperty)(i==null?e:e.substring(i.length)),number:t.number,toString(){return`enum value ${o.typeName}.${e}`}})}(n?.nestedEnums??t.enums).push(o)}function N(e,t,n,r,i){let a={kind:`message`,proto:e,deprecated:e.options?.deprecated??!1,file:t,parent:n,name:e.name,typeName:le(e,n,t),fields:[],field:{},oneofs:[],members:[],nestedEnums:[],nestedMessages:[],nestedExtensions:[],toString(){return`message ${this.typeName}`}};e.options?.mapEntry===!0?i.add(a):((n?.nestedMessages??t.messages).push(a),r.add(a));for(let n of e.enumType)oe(n,t,a,r);for(let n of e.nestedType)N(n,t,a,r,i)}function P(e,t,n){let r={kind:`service`,proto:e,deprecated:e.options?.deprecated??!1,file:t,name:e.name,typeName:le(e,void 0,t),methods:[],method:{},toString(){return`service ${this.typeName}`}};t.services.push(r),n.add(r);for(let t of e.method){let e=F(t,r,n);r.methods.push(e),r.method[e.localName]=e}}function F(e,t,n){let r;r=e.clientStreaming&&e.serverStreaming?`bidi_streaming`:e.clientStreaming?`client_streaming`:e.serverStreaming?`server_streaming`:`unary`;let i=n.getMessage(B(e.inputType)),o=n.getMessage(B(e.outputType));H(i,`invalid MethodDescriptorProto: input_type ${e.inputType} not found`),H(o,`invalid MethodDescriptorProto: output_type ${e.inputType} not found`);let s=e.name;return{kind:`rpc`,proto:e,deprecated:e.options?.deprecated??!1,parent:t,name:s,localName:(0,a.safeObjectProperty)(s.length?(0,a.safeObjectProperty)(s[0].toLowerCase()+s.substring(1)):s),methodKind:r,input:i,output:o,idempotency:e.options?.idempotencyLevel??w,toString(){return`rpc ${t.typeName}.${s}`}}}function I(e,t){return{kind:`oneof`,proto:e,deprecated:!1,parent:t,fields:[],name:e.name,localName:(0,a.safeObjectProperty)((0,a.protoCamelCase)(e.name)),toString(){return`oneof ${t.typeName}.${this.name}`}}}function L(e,t,r,o,s){let c=s===void 0,l={kind:`field`,proto:e,deprecated:e.options?.deprecated??!1,name:e.name,number:e.number,scalar:void 0,message:void 0,enum:void 0,presence:de(e,o,c,t),utf8Validation:ge(e,t),listKind:void 0,mapKind:void 0,mapKey:void 0,delimitedEncoding:void 0,packed:void 0,longAsString:!1,getDefaultValue:void 0},u;if(c){let n=t.kind==`file`?t:t.file,i=t.kind==`file`?void 0:t,a=le(e,i,n);l.kind=`extension`,l.file=n,l.parent=i,l.oneof=void 0,l.typeName=a,l.jsonName=`[${a}]`,u=()=>`extension ${a}`;let o=r.getMessage(B(e.extendee));H(o,`invalid FieldDescriptorProto: extendee ${e.extendee} not found`),l.extendee=o}else{let n=t;H(n.kind==`message`),l.parent=n,l.oneof=o,l.localName=o?(0,a.protoCamelCase)(e.name):(0,a.safeObjectProperty)((0,a.protoCamelCase)(e.name)),l.jsonName=e.jsonName,u=()=>`field ${n.typeName}.${e.name}`}Object.defineProperty(l,"toString",{value:u,writable:!0,enumerable:!0,configurable:!0});let d=e.label,f=e.type,p=e.options?.jstype;if(d===b){let n=f==g?s?.get(B(e.typeName)):void 0;if(n){l.fieldKind=`map`;let{key:e,value:t}=pe(n);return l.mapKey=e.scalar,l.mapKind=t.fieldKind,l.message=t.message,l.delimitedEncoding=!1,l.enum=t.enum,l.scalar=t.scalar,l}switch(l.fieldKind=`list`,f){case g:case h:l.listKind=`message`,l.message=r.getMessage(B(e.typeName)),H(l.message),l.delimitedEncoding=he(e,t);break;case v:l.listKind=`enum`,l.enum=r.getEnum(B(e.typeName)),H(l.enum);break;default:l.listKind=`scalar`,l.scalar=f,l.longAsString=p==S}return l.packed=fe(e,t),l}switch(f){case g:case h:l.fieldKind=`message`,l.message=r.getMessage(B(e.typeName)),H(l.message,`invalid FieldDescriptorProto: type_name ${e.typeName} not found`),l.delimitedEncoding=he(e,t),l.getDefaultValue=()=>{};break;case v:{let t=r.getEnum(B(e.typeName));H(t!==void 0,`invalid FieldDescriptorProto: type_name ${e.typeName} not found`),l.fieldKind=`enum`,l.enum=r.getEnum(B(e.typeName)),l.getDefaultValue=()=>(0,i.unsafeIsSetExplicit)(e,`defaultValue`)?(0,n.parseTextFormatEnumValue)(t,e.defaultValue):void 0;break}default:l.fieldKind=`scalar`,l.scalar=f,l.longAsString=p==S,l.getDefaultValue=()=>(0,i.unsafeIsSetExplicit)(e,`defaultValue`)?(0,n.parseTextFormatScalarValue)(f,e.defaultValue):void 0}return l}function R(t){switch(t.syntax){case``:case`proto2`:return d;case`proto3`:return f;case`editions`:if(t.edition===p)return e.maximumEdition;if(t.edition in A)return t.edition;throw Error(`${t.name}: unsupported edition`);default:throw Error(`${t.name}: unsupported syntax "${t.syntax}"`)}}function z(e,t){return e.dependency.map(n=>{let r=t.getFile(n);if(!r)throw Error(`Cannot find ${n}, imported by ${e.name}`);return r})}function se(e,t){let n=ce(e)+`_`;for(let e of t){if(!e.name.toLowerCase().startsWith(n))return;let t=e.name.substring(n.length);if(t.length==0||/^\d/.test(t))return}return n}function ce(e){return(e.substring(0,1)+e.substring(1).replace(/[A-Z]/g,e=>`_`+e)).toLowerCase()}function le(e,t,n){let r;return r=t?`${t.typeName}.${e.name}`:n.proto.package.length>0?`${n.proto.package}.${e.name}`:`${e.name}`,r}function B(e){return e.startsWith(`.`)?e.substring(1):e}function ue(e,t){if(!(0,i.unsafeIsSetExplicit)(e,`oneofIndex`)||e.proto3Optional)return;let n=t[e.oneofIndex];return H(n,`invalid FieldDescriptorProto: oneof #${e.oneofIndex} for field #${e.number} not found`),n}function de(e,t,n,r){if(e.label==x)return D;if(e.label==b)return E;if(t||e.proto3Optional||n)return T;let i=V(`fieldPresence`,{proto:e,parent:r});return i==E&&(e.type==g||e.type==h)?T:i}function fe(e,t){if(e.label!=b)return!1;switch(e.type){case m:case _:case h:case g:return!1}let n=e.options;return n&&(0,i.unsafeIsSetExplicit)(n,`packed`)?n.packed:O==V(`repeatedFieldEncoding`,{proto:e,parent:t})}function pe(e){let n=e.fields.find(e=>e.number===1),r=e.fields.find(e=>e.number===2);return H(n&&n.fieldKind==`scalar`&&n.scalar!=t.ScalarType.BYTES&&n.scalar!=t.ScalarType.FLOAT&&n.scalar!=t.ScalarType.DOUBLE&&r&&r.fieldKind!=`list`&&r.fieldKind!=`map`),{key:n,value:r}}function me(e){return te==V(`enumType`,{proto:e.proto,parent:e.parent??e.file})}function he(e,t){return e.type==h||ee==V(`messageEncoding`,{proto:e,parent:t})}function ge(e,t){return k==V(`utf8Validation`,{proto:e,parent:t})}function V(e,t){let n=t.proto.options?.features;if(n){let t=n[e];if(t!=0)return t}if(`kind`in t){if(t.kind==`message`)return V(e,t.parent??t.file);let n=A[t.edition];if(!n)throw Error(`feature default for edition ${t.edition} not found`);return n[e]}return V(e,t.parent)}function H(e,t){if(!e)throw Error(t)}}}),N=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/boot.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.boot=r,e.bootFileDescriptorProto=i;var t=re(),n=oe();function r(e){let r=i(e);return r.messageType.forEach(t.restoreJsonNames),(0,n.createFileRegistry)(r,()=>{}).getFile(r.name)}function i(e){return Object.assign(/* @__PURE__ */ Object.create({syntax:``,edition:0}),Object.assign(Object.assign({$typeName:`google.protobuf.FileDescriptorProto`,dependency:[],publicDependency:[],weakDependency:[],optionDependency:[],service:[],extension:[]},e),{messageType:e.messageType.map(a),enumType:e.enumType.map(c)}))}function a(e){return Object.assign(/* @__PURE__ */ Object.create({visibility:0}),{$typeName:`google.protobuf.DescriptorProto`,name:e.name,field:e.field?.map(o)??[],extension:[],nestedType:e.nestedType?.map(a)??[],enumType:e.enumType?.map(c)??[],extensionRange:e.extensionRange?.map(e=>Object.assign({$typeName:`google.protobuf.DescriptorProto.ExtensionRange`},e))??[],oneofDecl:[],reservedRange:[],reservedName:[]})}function o(e){return Object.assign(/* @__PURE__ */ Object.create({label:1,typeName:``,extendee:``,defaultValue:``,oneofIndex:0,jsonName:``,proto3Optional:!1}),Object.assign(Object.assign({$typeName:`google.protobuf.FieldDescriptorProto`},e),{options:e.options?s(e.options):void 0}))}function s(e){return Object.assign(/* @__PURE__ */ Object.create({ctype:0,packed:!1,jstype:0,lazy:!1,unverifiedLazy:!1,deprecated:!1,weak:!1,debugRedact:!1,retention:0}),Object.assign(Object.assign({$typeName:`google.protobuf.FieldOptions`},e),{targets:e.targets??[],editionDefaults:e.editionDefaults?.map(e=>Object.assign({$typeName:`google.protobuf.FieldOptions.EditionDefault`},e))??[],uninterpretedOption:[]}))}function c(e){return Object.assign(/* @__PURE__ */ Object.create({visibility:0}),{$typeName:`google.protobuf.EnumDescriptorProto`,name:e.name,reservedName:[],reservedRange:[],value:e.value.map(e=>Object.assign({$typeName:`google.protobuf.EnumValueDescriptorProto`},e))})}}}),P=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/message.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.messageDesc=t;function t(e,t,...n){return n.reduce((e,t)=>e.nestedMessages[t],e.messages[t])}}}),F=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/enum.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.enumDesc=t,e.tsEnum=n,e.objEnum=r;function t(e,t,...n){if(n.length==0)return e.enums[t];let r=n.pop();return n.reduce((e,t)=>e.nestedMessages[t],e.messages[t]).nestedEnums[r]}function n(e){let t={};for(let n of e.values)t[n.localName]=n.number,t[n.number]=n.localName;return t}function r(e){let t={};for(let n of e.values)t[n.localName]=n.number;return t}}}),I=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/descriptor_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.FeatureSet_FieldPresence=e.FeatureSet_VisibilityFeature_DefaultSymbolVisibilitySchema=e.FeatureSet_VisibilityFeature_DefaultSymbolVisibility=e.FeatureSet_VisibilityFeatureSchema=e.FeatureSetSchema=e.UninterpretedOption_NamePartSchema=e.UninterpretedOptionSchema=e.MethodOptions_IdempotencyLevelSchema=e.MethodOptions_IdempotencyLevel=e.MethodOptionsSchema=e.ServiceOptionsSchema=e.EnumValueOptionsSchema=e.EnumOptionsSchema=e.OneofOptionsSchema=e.FieldOptions_OptionTargetTypeSchema=e.FieldOptions_OptionTargetType=e.FieldOptions_OptionRetentionSchema=e.FieldOptions_OptionRetention=e.FieldOptions_JSTypeSchema=e.FieldOptions_JSType=e.FieldOptions_CTypeSchema=e.FieldOptions_CType=e.FieldOptions_FeatureSupportSchema=e.FieldOptions_EditionDefaultSchema=e.FieldOptionsSchema=e.MessageOptionsSchema=e.FileOptions_OptimizeModeSchema=e.FileOptions_OptimizeMode=e.FileOptionsSchema=e.MethodDescriptorProtoSchema=e.ServiceDescriptorProtoSchema=e.EnumValueDescriptorProtoSchema=e.EnumDescriptorProto_EnumReservedRangeSchema=e.EnumDescriptorProtoSchema=e.OneofDescriptorProtoSchema=e.FieldDescriptorProto_LabelSchema=e.FieldDescriptorProto_Label=e.FieldDescriptorProto_TypeSchema=e.FieldDescriptorProto_Type=e.FieldDescriptorProtoSchema=e.ExtensionRangeOptions_VerificationStateSchema=e.ExtensionRangeOptions_VerificationState=e.ExtensionRangeOptions_DeclarationSchema=e.ExtensionRangeOptionsSchema=e.DescriptorProto_ReservedRangeSchema=e.DescriptorProto_ExtensionRangeSchema=e.DescriptorProtoSchema=e.FileDescriptorProtoSchema=e.FileDescriptorSetSchema=e.file_google_protobuf_descriptor=void 0,e.SymbolVisibilitySchema=e.SymbolVisibility=e.EditionSchema=e.Edition=e.GeneratedCodeInfo_Annotation_SemanticSchema=e.GeneratedCodeInfo_Annotation_Semantic=e.GeneratedCodeInfo_AnnotationSchema=e.GeneratedCodeInfoSchema=e.SourceCodeInfo_LocationSchema=e.SourceCodeInfoSchema=e.FeatureSetDefaults_FeatureSetEditionDefaultSchema=e.FeatureSetDefaultsSchema=e.FeatureSet_EnforceNamingStyleSchema=e.FeatureSet_EnforceNamingStyle=e.FeatureSet_JsonFormatSchema=e.FeatureSet_JsonFormat=e.FeatureSet_MessageEncodingSchema=e.FeatureSet_MessageEncoding=e.FeatureSet_Utf8ValidationSchema=e.FeatureSet_Utf8Validation=e.FeatureSet_RepeatedFieldEncodingSchema=e.FeatureSet_RepeatedFieldEncoding=e.FeatureSet_EnumTypeSchema=e.FeatureSet_EnumType=e.FeatureSet_FieldPresenceSchema=void 0;var t=N(),n=P(),r=F();e.file_google_protobuf_descriptor=(0,t.boot)({name:`google/protobuf/descriptor.proto`,package:`google.protobuf`,messageType:[{name:`FileDescriptorSet`,field:[{name:`file`,number:1,type:11,label:3,typeName:`.google.protobuf.FileDescriptorProto`}],extensionRange:[{start:536e6,end:536000001}]},{name:`FileDescriptorProto`,field:[{name:`name`,number:1,type:9,label:1},{name:`package`,number:2,type:9,label:1},{name:`dependency`,number:3,type:9,label:3},{name:`public_dependency`,number:10,type:5,label:3},{name:`weak_dependency`,number:11,type:5,label:3},{name:`option_dependency`,number:15,type:9,label:3},{name:`message_type`,number:4,type:11,label:3,typeName:`.google.protobuf.DescriptorProto`},{name:`enum_type`,number:5,type:11,label:3,typeName:`.google.protobuf.EnumDescriptorProto`},{name:`service`,number:6,type:11,label:3,typeName:`.google.protobuf.ServiceDescriptorProto`},{name:`extension`,number:7,type:11,label:3,typeName:`.google.protobuf.FieldDescriptorProto`},{name:`options`,number:8,type:11,label:1,typeName:`.google.protobuf.FileOptions`},{name:`source_code_info`,number:9,type:11,label:1,typeName:`.google.protobuf.SourceCodeInfo`},{name:`syntax`,number:12,type:9,label:1},{name:`edition`,number:14,type:14,label:1,typeName:`.google.protobuf.Edition`}]},{name:`DescriptorProto`,field:[{name:`name`,number:1,type:9,label:1},{name:`field`,number:2,type:11,label:3,typeName:`.google.protobuf.FieldDescriptorProto`},{name:`extension`,number:6,type:11,label:3,typeName:`.google.protobuf.FieldDescriptorProto`},{name:`nested_type`,number:3,type:11,label:3,typeName:`.google.protobuf.DescriptorProto`},{name:`enum_type`,number:4,type:11,label:3,typeName:`.google.protobuf.EnumDescriptorProto`},{name:`extension_range`,number:5,type:11,label:3,typeName:`.google.protobuf.DescriptorProto.ExtensionRange`},{name:`oneof_decl`,number:8,type:11,label:3,typeName:`.google.protobuf.OneofDescriptorProto`},{name:`options`,number:7,type:11,label:1,typeName:`.google.protobuf.MessageOptions`},{name:`reserved_range`,number:9,type:11,label:3,typeName:`.google.protobuf.DescriptorProto.ReservedRange`},{name:`reserved_name`,number:10,type:9,label:3},{name:`visibility`,number:11,type:14,label:1,typeName:`.google.protobuf.SymbolVisibility`}],nestedType:[{name:`ExtensionRange`,field:[{name:`start`,number:1,type:5,label:1},{name:`end`,number:2,type:5,label:1},{name:`options`,number:3,type:11,label:1,typeName:`.google.protobuf.ExtensionRangeOptions`}]},{name:`ReservedRange`,field:[{name:`start`,number:1,type:5,label:1},{name:`end`,number:2,type:5,label:1}]}]},{name:`ExtensionRangeOptions`,field:[{name:`uninterpreted_option`,number:999,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption`},{name:`declaration`,number:2,type:11,label:3,typeName:`.google.protobuf.ExtensionRangeOptions.Declaration`,options:{retention:2}},{name:`features`,number:50,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`verification`,number:3,type:14,label:1,typeName:`.google.protobuf.ExtensionRangeOptions.VerificationState`,defaultValue:`UNVERIFIED`,options:{retention:2}}],nestedType:[{name:`Declaration`,field:[{name:`number`,number:1,type:5,label:1},{name:`full_name`,number:2,type:9,label:1},{name:`type`,number:3,type:9,label:1},{name:`reserved`,number:5,type:8,label:1},{name:`repeated`,number:6,type:8,label:1}]}],enumType:[{name:`VerificationState`,value:[{name:`DECLARATION`,number:0},{name:`UNVERIFIED`,number:1}]}],extensionRange:[{start:1e3,end:536870912}]},{name:`FieldDescriptorProto`,field:[{name:`name`,number:1,type:9,label:1},{name:`number`,number:3,type:5,label:1},{name:`label`,number:4,type:14,label:1,typeName:`.google.protobuf.FieldDescriptorProto.Label`},{name:`type`,number:5,type:14,label:1,typeName:`.google.protobuf.FieldDescriptorProto.Type`},{name:`type_name`,number:6,type:9,label:1},{name:`extendee`,number:2,type:9,label:1},{name:`default_value`,number:7,type:9,label:1},{name:`oneof_index`,number:9,type:5,label:1},{name:`json_name`,number:10,type:9,label:1},{name:`options`,number:8,type:11,label:1,typeName:`.google.protobuf.FieldOptions`},{name:`proto3_optional`,number:17,type:8,label:1}],enumType:[{name:`Type`,value:[{name:`TYPE_DOUBLE`,number:1},{name:`TYPE_FLOAT`,number:2},{name:`TYPE_INT64`,number:3},{name:`TYPE_UINT64`,number:4},{name:`TYPE_INT32`,number:5},{name:`TYPE_FIXED64`,number:6},{name:`TYPE_FIXED32`,number:7},{name:`TYPE_BOOL`,number:8},{name:`TYPE_STRING`,number:9},{name:`TYPE_GROUP`,number:10},{name:`TYPE_MESSAGE`,number:11},{name:`TYPE_BYTES`,number:12},{name:`TYPE_UINT32`,number:13},{name:`TYPE_ENUM`,number:14},{name:`TYPE_SFIXED32`,number:15},{name:`TYPE_SFIXED64`,number:16},{name:`TYPE_SINT32`,number:17},{name:`TYPE_SINT64`,number:18}]},{name:`Label`,value:[{name:`LABEL_OPTIONAL`,number:1},{name:`LABEL_REPEATED`,number:3},{name:`LABEL_REQUIRED`,number:2}]}]},{name:`OneofDescriptorProto`,field:[{name:`name`,number:1,type:9,label:1},{name:`options`,number:2,type:11,label:1,typeName:`.google.protobuf.OneofOptions`}]},{name:`EnumDescriptorProto`,field:[{name:`name`,number:1,type:9,label:1},{name:`value`,number:2,type:11,label:3,typeName:`.google.protobuf.EnumValueDescriptorProto`},{name:`options`,number:3,type:11,label:1,typeName:`.google.protobuf.EnumOptions`},{name:`reserved_range`,number:4,type:11,label:3,typeName:`.google.protobuf.EnumDescriptorProto.EnumReservedRange`},{name:`reserved_name`,number:5,type:9,label:3},{name:`visibility`,number:6,type:14,label:1,typeName:`.google.protobuf.SymbolVisibility`}],nestedType:[{name:`EnumReservedRange`,field:[{name:`start`,number:1,type:5,label:1},{name:`end`,number:2,type:5,label:1}]}]},{name:`EnumValueDescriptorProto`,field:[{name:`name`,number:1,type:9,label:1},{name:`number`,number:2,type:5,label:1},{name:`options`,number:3,type:11,label:1,typeName:`.google.protobuf.EnumValueOptions`}]},{name:`ServiceDescriptorProto`,field:[{name:`name`,number:1,type:9,label:1},{name:`method`,number:2,type:11,label:3,typeName:`.google.protobuf.MethodDescriptorProto`},{name:`options`,number:3,type:11,label:1,typeName:`.google.protobuf.ServiceOptions`}]},{name:`MethodDescriptorProto`,field:[{name:`name`,number:1,type:9,label:1},{name:`input_type`,number:2,type:9,label:1},{name:`output_type`,number:3,type:9,label:1},{name:`options`,number:4,type:11,label:1,typeName:`.google.protobuf.MethodOptions`},{name:`client_streaming`,number:5,type:8,label:1,defaultValue:`false`},{name:`server_streaming`,number:6,type:8,label:1,defaultValue:`false`}]},{name:`FileOptions`,field:[{name:`java_package`,number:1,type:9,label:1},{name:`java_outer_classname`,number:8,type:9,label:1},{name:`java_multiple_files`,number:10,type:8,label:1,defaultValue:`false`,options:{}},{name:`java_generate_equals_and_hash`,number:20,type:8,label:1,options:{deprecated:!0}},{name:`java_string_check_utf8`,number:27,type:8,label:1,defaultValue:`false`},{name:`optimize_for`,number:9,type:14,label:1,typeName:`.google.protobuf.FileOptions.OptimizeMode`,defaultValue:`SPEED`},{name:`go_package`,number:11,type:9,label:1},{name:`cc_generic_services`,number:16,type:8,label:1,defaultValue:`false`},{name:`java_generic_services`,number:17,type:8,label:1,defaultValue:`false`},{name:`py_generic_services`,number:18,type:8,label:1,defaultValue:`false`},{name:`deprecated`,number:23,type:8,label:1,defaultValue:`false`},{name:`cc_enable_arenas`,number:31,type:8,label:1,defaultValue:`true`},{name:`objc_class_prefix`,number:36,type:9,label:1},{name:`csharp_namespace`,number:37,type:9,label:1},{name:`swift_prefix`,number:39,type:9,label:1},{name:`php_class_prefix`,number:40,type:9,label:1},{name:`php_namespace`,number:41,type:9,label:1},{name:`php_metadata_namespace`,number:44,type:9,label:1},{name:`ruby_package`,number:45,type:9,label:1},{name:`features`,number:50,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`uninterpreted_option`,number:999,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption`}],enumType:[{name:`OptimizeMode`,value:[{name:`SPEED`,number:1},{name:`CODE_SIZE`,number:2},{name:`LITE_RUNTIME`,number:3}]}],extensionRange:[{start:1e3,end:536870912}]},{name:`MessageOptions`,field:[{name:`message_set_wire_format`,number:1,type:8,label:1,defaultValue:`false`},{name:`no_standard_descriptor_accessor`,number:2,type:8,label:1,defaultValue:`false`},{name:`deprecated`,number:3,type:8,label:1,defaultValue:`false`},{name:`map_entry`,number:7,type:8,label:1},{name:`deprecated_legacy_json_field_conflicts`,number:11,type:8,label:1,options:{deprecated:!0}},{name:`features`,number:12,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`uninterpreted_option`,number:999,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption`}],extensionRange:[{start:1e3,end:536870912}]},{name:`FieldOptions`,field:[{name:`ctype`,number:1,type:14,label:1,typeName:`.google.protobuf.FieldOptions.CType`,defaultValue:`STRING`},{name:`packed`,number:2,type:8,label:1},{name:`jstype`,number:6,type:14,label:1,typeName:`.google.protobuf.FieldOptions.JSType`,defaultValue:`JS_NORMAL`},{name:`lazy`,number:5,type:8,label:1,defaultValue:`false`},{name:`unverified_lazy`,number:15,type:8,label:1,defaultValue:`false`},{name:`deprecated`,number:3,type:8,label:1,defaultValue:`false`},{name:`weak`,number:10,type:8,label:1,defaultValue:`false`,options:{deprecated:!0}},{name:`debug_redact`,number:16,type:8,label:1,defaultValue:`false`},{name:`retention`,number:17,type:14,label:1,typeName:`.google.protobuf.FieldOptions.OptionRetention`},{name:`targets`,number:19,type:14,label:3,typeName:`.google.protobuf.FieldOptions.OptionTargetType`},{name:`edition_defaults`,number:20,type:11,label:3,typeName:`.google.protobuf.FieldOptions.EditionDefault`},{name:`features`,number:21,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`feature_support`,number:22,type:11,label:1,typeName:`.google.protobuf.FieldOptions.FeatureSupport`},{name:`uninterpreted_option`,number:999,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption`}],nestedType:[{name:`EditionDefault`,field:[{name:`edition`,number:3,type:14,label:1,typeName:`.google.protobuf.Edition`},{name:`value`,number:2,type:9,label:1}]},{name:`FeatureSupport`,field:[{name:`edition_introduced`,number:1,type:14,label:1,typeName:`.google.protobuf.Edition`},{name:`edition_deprecated`,number:2,type:14,label:1,typeName:`.google.protobuf.Edition`},{name:`deprecation_warning`,number:3,type:9,label:1},{name:`edition_removed`,number:4,type:14,label:1,typeName:`.google.protobuf.Edition`},{name:`removal_error`,number:5,type:9,label:1}]}],enumType:[{name:`CType`,value:[{name:`STRING`,number:0},{name:`CORD`,number:1},{name:`STRING_PIECE`,number:2}]},{name:`JSType`,value:[{name:`JS_NORMAL`,number:0},{name:`JS_STRING`,number:1},{name:`JS_NUMBER`,number:2}]},{name:`OptionRetention`,value:[{name:`RETENTION_UNKNOWN`,number:0},{name:`RETENTION_RUNTIME`,number:1},{name:`RETENTION_SOURCE`,number:2}]},{name:`OptionTargetType`,value:[{name:`TARGET_TYPE_UNKNOWN`,number:0},{name:`TARGET_TYPE_FILE`,number:1},{name:`TARGET_TYPE_EXTENSION_RANGE`,number:2},{name:`TARGET_TYPE_MESSAGE`,number:3},{name:`TARGET_TYPE_FIELD`,number:4},{name:`TARGET_TYPE_ONEOF`,number:5},{name:`TARGET_TYPE_ENUM`,number:6},{name:`TARGET_TYPE_ENUM_ENTRY`,number:7},{name:`TARGET_TYPE_SERVICE`,number:8},{name:`TARGET_TYPE_METHOD`,number:9}]}],extensionRange:[{start:1e3,end:536870912}]},{name:`OneofOptions`,field:[{name:`features`,number:1,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`uninterpreted_option`,number:999,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption`}],extensionRange:[{start:1e3,end:536870912}]},{name:`EnumOptions`,field:[{name:`allow_alias`,number:2,type:8,label:1},{name:`deprecated`,number:3,type:8,label:1,defaultValue:`false`},{name:`deprecated_legacy_json_field_conflicts`,number:6,type:8,label:1,options:{deprecated:!0}},{name:`features`,number:7,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`uninterpreted_option`,number:999,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption`}],extensionRange:[{start:1e3,end:536870912}]},{name:`EnumValueOptions`,field:[{name:`deprecated`,number:1,type:8,label:1,defaultValue:`false`},{name:`features`,number:2,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`debug_redact`,number:3,type:8,label:1,defaultValue:`false`},{name:`feature_support`,number:4,type:11,label:1,typeName:`.google.protobuf.FieldOptions.FeatureSupport`},{name:`uninterpreted_option`,number:999,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption`}],extensionRange:[{start:1e3,end:536870912}]},{name:`ServiceOptions`,field:[{name:`features`,number:34,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`deprecated`,number:33,type:8,label:1,defaultValue:`false`},{name:`uninterpreted_option`,number:999,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption`}],extensionRange:[{start:1e3,end:536870912}]},{name:`MethodOptions`,field:[{name:`deprecated`,number:33,type:8,label:1,defaultValue:`false`},{name:`idempotency_level`,number:34,type:14,label:1,typeName:`.google.protobuf.MethodOptions.IdempotencyLevel`,defaultValue:`IDEMPOTENCY_UNKNOWN`},{name:`features`,number:35,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`uninterpreted_option`,number:999,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption`}],enumType:[{name:`IdempotencyLevel`,value:[{name:`IDEMPOTENCY_UNKNOWN`,number:0},{name:`NO_SIDE_EFFECTS`,number:1},{name:`IDEMPOTENT`,number:2}]}],extensionRange:[{start:1e3,end:536870912}]},{name:`UninterpretedOption`,field:[{name:`name`,number:2,type:11,label:3,typeName:`.google.protobuf.UninterpretedOption.NamePart`},{name:`identifier_value`,number:3,type:9,label:1},{name:`positive_int_value`,number:4,type:4,label:1},{name:`negative_int_value`,number:5,type:3,label:1},{name:`double_value`,number:6,type:1,label:1},{name:`string_value`,number:7,type:12,label:1},{name:`aggregate_value`,number:8,type:9,label:1}],nestedType:[{name:`NamePart`,field:[{name:`name_part`,number:1,type:9,label:2},{name:`is_extension`,number:2,type:8,label:2}]}]},{name:`FeatureSet`,field:[{name:`field_presence`,number:1,type:14,label:1,typeName:`.google.protobuf.FeatureSet.FieldPresence`,options:{retention:1,targets:[4,1],editionDefaults:[{value:`EXPLICIT`,edition:900},{value:`IMPLICIT`,edition:999},{value:`EXPLICIT`,edition:1e3}]}},{name:`enum_type`,number:2,type:14,label:1,typeName:`.google.protobuf.FeatureSet.EnumType`,options:{retention:1,targets:[6,1],editionDefaults:[{value:`CLOSED`,edition:900},{value:`OPEN`,edition:999}]}},{name:`repeated_field_encoding`,number:3,type:14,label:1,typeName:`.google.protobuf.FeatureSet.RepeatedFieldEncoding`,options:{retention:1,targets:[4,1],editionDefaults:[{value:`EXPANDED`,edition:900},{value:`PACKED`,edition:999}]}},{name:`utf8_validation`,number:4,type:14,label:1,typeName:`.google.protobuf.FeatureSet.Utf8Validation`,options:{retention:1,targets:[4,1],editionDefaults:[{value:`NONE`,edition:900},{value:`VERIFY`,edition:999}]}},{name:`message_encoding`,number:5,type:14,label:1,typeName:`.google.protobuf.FeatureSet.MessageEncoding`,options:{retention:1,targets:[4,1],editionDefaults:[{value:`LENGTH_PREFIXED`,edition:900}]}},{name:`json_format`,number:6,type:14,label:1,typeName:`.google.protobuf.FeatureSet.JsonFormat`,options:{retention:1,targets:[3,6,1],editionDefaults:[{value:`LEGACY_BEST_EFFORT`,edition:900},{value:`ALLOW`,edition:999}]}},{name:`enforce_naming_style`,number:7,type:14,label:1,typeName:`.google.protobuf.FeatureSet.EnforceNamingStyle`,options:{retention:2,targets:[1,2,3,4,5,6,7,8,9],editionDefaults:[{value:`STYLE_LEGACY`,edition:900},{value:`STYLE2024`,edition:1001}]}},{name:`default_symbol_visibility`,number:8,type:14,label:1,typeName:`.google.protobuf.FeatureSet.VisibilityFeature.DefaultSymbolVisibility`,options:{retention:2,targets:[1],editionDefaults:[{value:`EXPORT_ALL`,edition:900},{value:`EXPORT_TOP_LEVEL`,edition:1001}]}}],nestedType:[{name:`VisibilityFeature`,enumType:[{name:`DefaultSymbolVisibility`,value:[{name:`DEFAULT_SYMBOL_VISIBILITY_UNKNOWN`,number:0},{name:`EXPORT_ALL`,number:1},{name:`EXPORT_TOP_LEVEL`,number:2},{name:`LOCAL_ALL`,number:3},{name:`STRICT`,number:4}]}]}],enumType:[{name:`FieldPresence`,value:[{name:`FIELD_PRESENCE_UNKNOWN`,number:0},{name:`EXPLICIT`,number:1},{name:`IMPLICIT`,number:2},{name:`LEGACY_REQUIRED`,number:3}]},{name:`EnumType`,value:[{name:`ENUM_TYPE_UNKNOWN`,number:0},{name:`OPEN`,number:1},{name:`CLOSED`,number:2}]},{name:`RepeatedFieldEncoding`,value:[{name:`REPEATED_FIELD_ENCODING_UNKNOWN`,number:0},{name:`PACKED`,number:1},{name:`EXPANDED`,number:2}]},{name:`Utf8Validation`,value:[{name:`UTF8_VALIDATION_UNKNOWN`,number:0},{name:`VERIFY`,number:2},{name:`NONE`,number:3}]},{name:`MessageEncoding`,value:[{name:`MESSAGE_ENCODING_UNKNOWN`,number:0},{name:`LENGTH_PREFIXED`,number:1},{name:`DELIMITED`,number:2}]},{name:`JsonFormat`,value:[{name:`JSON_FORMAT_UNKNOWN`,number:0},{name:`ALLOW`,number:1},{name:`LEGACY_BEST_EFFORT`,number:2}]},{name:`EnforceNamingStyle`,value:[{name:`ENFORCE_NAMING_STYLE_UNKNOWN`,number:0},{name:`STYLE2024`,number:1},{name:`STYLE_LEGACY`,number:2}]}],extensionRange:[{start:1e3,end:9995},{start:9995,end:1e4},{start:1e4,end:10001}]},{name:`FeatureSetDefaults`,field:[{name:`defaults`,number:1,type:11,label:3,typeName:`.google.protobuf.FeatureSetDefaults.FeatureSetEditionDefault`},{name:`minimum_edition`,number:4,type:14,label:1,typeName:`.google.protobuf.Edition`},{name:`maximum_edition`,number:5,type:14,label:1,typeName:`.google.protobuf.Edition`}],nestedType:[{name:`FeatureSetEditionDefault`,field:[{name:`edition`,number:3,type:14,label:1,typeName:`.google.protobuf.Edition`},{name:`overridable_features`,number:4,type:11,label:1,typeName:`.google.protobuf.FeatureSet`},{name:`fixed_features`,number:5,type:11,label:1,typeName:`.google.protobuf.FeatureSet`}]}]},{name:`SourceCodeInfo`,field:[{name:`location`,number:1,type:11,label:3,typeName:`.google.protobuf.SourceCodeInfo.Location`}],nestedType:[{name:`Location`,field:[{name:`path`,number:1,type:5,label:3,options:{packed:!0}},{name:`span`,number:2,type:5,label:3,options:{packed:!0}},{name:`leading_comments`,number:3,type:9,label:1},{name:`trailing_comments`,number:4,type:9,label:1},{name:`leading_detached_comments`,number:6,type:9,label:3}]}],extensionRange:[{start:536e6,end:536000001}]},{name:`GeneratedCodeInfo`,field:[{name:`annotation`,number:1,type:11,label:3,typeName:`.google.protobuf.GeneratedCodeInfo.Annotation`}],nestedType:[{name:`Annotation`,field:[{name:`path`,number:1,type:5,label:3,options:{packed:!0}},{name:`source_file`,number:2,type:9,label:1},{name:`begin`,number:3,type:5,label:1},{name:`end`,number:4,type:5,label:1},{name:`semantic`,number:5,type:14,label:1,typeName:`.google.protobuf.GeneratedCodeInfo.Annotation.Semantic`}],enumType:[{name:`Semantic`,value:[{name:`NONE`,number:0},{name:`SET`,number:1},{name:`ALIAS`,number:2}]}]}]}],enumType:[{name:`Edition`,value:[{name:`EDITION_UNKNOWN`,number:0},{name:`EDITION_LEGACY`,number:900},{name:`EDITION_PROTO2`,number:998},{name:`EDITION_PROTO3`,number:999},{name:`EDITION_2023`,number:1e3},{name:`EDITION_2024`,number:1001},{name:`EDITION_UNSTABLE`,number:9999},{name:`EDITION_1_TEST_ONLY`,number:1},{name:`EDITION_2_TEST_ONLY`,number:2},{name:`EDITION_99997_TEST_ONLY`,number:99997},{name:`EDITION_99998_TEST_ONLY`,number:99998},{name:`EDITION_99999_TEST_ONLY`,number:99999},{name:`EDITION_MAX`,number:2147483647}]},{name:`SymbolVisibility`,value:[{name:`VISIBILITY_UNSET`,number:0},{name:`VISIBILITY_LOCAL`,number:1},{name:`VISIBILITY_EXPORT`,number:2}]}]}),e.FileDescriptorSetSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,0),e.FileDescriptorProtoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,1),e.DescriptorProtoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,2),e.DescriptorProto_ExtensionRangeSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,2,0),e.DescriptorProto_ReservedRangeSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,2,1),e.ExtensionRangeOptionsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,3),e.ExtensionRangeOptions_DeclarationSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,3,0);var i;(function(e){e[e.DECLARATION=0]=`DECLARATION`,e[e.UNVERIFIED=1]=`UNVERIFIED`})(i||(e.ExtensionRangeOptions_VerificationState=i={})),e.ExtensionRangeOptions_VerificationStateSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,3,0),e.FieldDescriptorProtoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,4);var a;(function(e){e[e.DOUBLE=1]=`DOUBLE`,e[e.FLOAT=2]=`FLOAT`,e[e.INT64=3]=`INT64`,e[e.UINT64=4]=`UINT64`,e[e.INT32=5]=`INT32`,e[e.FIXED64=6]=`FIXED64`,e[e.FIXED32=7]=`FIXED32`,e[e.BOOL=8]=`BOOL`,e[e.STRING=9]=`STRING`,e[e.GROUP=10]=`GROUP`,e[e.MESSAGE=11]=`MESSAGE`,e[e.BYTES=12]=`BYTES`,e[e.UINT32=13]=`UINT32`,e[e.ENUM=14]=`ENUM`,e[e.SFIXED32=15]=`SFIXED32`,e[e.SFIXED64=16]=`SFIXED64`,e[e.SINT32=17]=`SINT32`,e[e.SINT64=18]=`SINT64`})(a||(e.FieldDescriptorProto_Type=a={})),e.FieldDescriptorProto_TypeSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,4,0);var o;(function(e){e[e.OPTIONAL=1]=`OPTIONAL`,e[e.REPEATED=3]=`REPEATED`,e[e.REQUIRED=2]=`REQUIRED`})(o||(e.FieldDescriptorProto_Label=o={})),e.FieldDescriptorProto_LabelSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,4,1),e.OneofDescriptorProtoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,5),e.EnumDescriptorProtoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,6),e.EnumDescriptorProto_EnumReservedRangeSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,6,0),e.EnumValueDescriptorProtoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,7),e.ServiceDescriptorProtoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,8),e.MethodDescriptorProtoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,9),e.FileOptionsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,10);var s;(function(e){e[e.SPEED=1]=`SPEED`,e[e.CODE_SIZE=2]=`CODE_SIZE`,e[e.LITE_RUNTIME=3]=`LITE_RUNTIME`})(s||(e.FileOptions_OptimizeMode=s={})),e.FileOptions_OptimizeModeSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,10,0),e.MessageOptionsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,11),e.FieldOptionsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,12),e.FieldOptions_EditionDefaultSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,12,0),e.FieldOptions_FeatureSupportSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,12,1);var c;(function(e){e[e.STRING=0]=`STRING`,e[e.CORD=1]=`CORD`,e[e.STRING_PIECE=2]=`STRING_PIECE`})(c||(e.FieldOptions_CType=c={})),e.FieldOptions_CTypeSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,12,0);var l;(function(e){e[e.JS_NORMAL=0]=`JS_NORMAL`,e[e.JS_STRING=1]=`JS_STRING`,e[e.JS_NUMBER=2]=`JS_NUMBER`})(l||(e.FieldOptions_JSType=l={})),e.FieldOptions_JSTypeSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,12,1);var u;(function(e){e[e.RETENTION_UNKNOWN=0]=`RETENTION_UNKNOWN`,e[e.RETENTION_RUNTIME=1]=`RETENTION_RUNTIME`,e[e.RETENTION_SOURCE=2]=`RETENTION_SOURCE`})(u||(e.FieldOptions_OptionRetention=u={})),e.FieldOptions_OptionRetentionSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,12,2);var d;(function(e){e[e.TARGET_TYPE_UNKNOWN=0]=`TARGET_TYPE_UNKNOWN`,e[e.TARGET_TYPE_FILE=1]=`TARGET_TYPE_FILE`,e[e.TARGET_TYPE_EXTENSION_RANGE=2]=`TARGET_TYPE_EXTENSION_RANGE`,e[e.TARGET_TYPE_MESSAGE=3]=`TARGET_TYPE_MESSAGE`,e[e.TARGET_TYPE_FIELD=4]=`TARGET_TYPE_FIELD`,e[e.TARGET_TYPE_ONEOF=5]=`TARGET_TYPE_ONEOF`,e[e.TARGET_TYPE_ENUM=6]=`TARGET_TYPE_ENUM`,e[e.TARGET_TYPE_ENUM_ENTRY=7]=`TARGET_TYPE_ENUM_ENTRY`,e[e.TARGET_TYPE_SERVICE=8]=`TARGET_TYPE_SERVICE`,e[e.TARGET_TYPE_METHOD=9]=`TARGET_TYPE_METHOD`})(d||(e.FieldOptions_OptionTargetType=d={})),e.FieldOptions_OptionTargetTypeSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,12,3),e.OneofOptionsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,13),e.EnumOptionsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,14),e.EnumValueOptionsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,15),e.ServiceOptionsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,16),e.MethodOptionsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,17);var f;(function(e){e[e.IDEMPOTENCY_UNKNOWN=0]=`IDEMPOTENCY_UNKNOWN`,e[e.NO_SIDE_EFFECTS=1]=`NO_SIDE_EFFECTS`,e[e.IDEMPOTENT=2]=`IDEMPOTENT`})(f||(e.MethodOptions_IdempotencyLevel=f={})),e.MethodOptions_IdempotencyLevelSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,17,0),e.UninterpretedOptionSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,18),e.UninterpretedOption_NamePartSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,18,0),e.FeatureSetSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,19),e.FeatureSet_VisibilityFeatureSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,19,0);var p;(function(e){e[e.DEFAULT_SYMBOL_VISIBILITY_UNKNOWN=0]=`DEFAULT_SYMBOL_VISIBILITY_UNKNOWN`,e[e.EXPORT_ALL=1]=`EXPORT_ALL`,e[e.EXPORT_TOP_LEVEL=2]=`EXPORT_TOP_LEVEL`,e[e.LOCAL_ALL=3]=`LOCAL_ALL`,e[e.STRICT=4]=`STRICT`})(p||(e.FeatureSet_VisibilityFeature_DefaultSymbolVisibility=p={})),e.FeatureSet_VisibilityFeature_DefaultSymbolVisibilitySchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,19,0,0);var m;(function(e){e[e.FIELD_PRESENCE_UNKNOWN=0]=`FIELD_PRESENCE_UNKNOWN`,e[e.EXPLICIT=1]=`EXPLICIT`,e[e.IMPLICIT=2]=`IMPLICIT`,e[e.LEGACY_REQUIRED=3]=`LEGACY_REQUIRED`})(m||(e.FeatureSet_FieldPresence=m={})),e.FeatureSet_FieldPresenceSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,19,0);var h;(function(e){e[e.ENUM_TYPE_UNKNOWN=0]=`ENUM_TYPE_UNKNOWN`,e[e.OPEN=1]=`OPEN`,e[e.CLOSED=2]=`CLOSED`})(h||(e.FeatureSet_EnumType=h={})),e.FeatureSet_EnumTypeSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,19,1);var g;(function(e){e[e.REPEATED_FIELD_ENCODING_UNKNOWN=0]=`REPEATED_FIELD_ENCODING_UNKNOWN`,e[e.PACKED=1]=`PACKED`,e[e.EXPANDED=2]=`EXPANDED`})(g||(e.FeatureSet_RepeatedFieldEncoding=g={})),e.FeatureSet_RepeatedFieldEncodingSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,19,2);var _;(function(e){e[e.UTF8_VALIDATION_UNKNOWN=0]=`UTF8_VALIDATION_UNKNOWN`,e[e.VERIFY=2]=`VERIFY`,e[e.NONE=3]=`NONE`})(_||(e.FeatureSet_Utf8Validation=_={})),e.FeatureSet_Utf8ValidationSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,19,3);var v;(function(e){e[e.MESSAGE_ENCODING_UNKNOWN=0]=`MESSAGE_ENCODING_UNKNOWN`,e[e.LENGTH_PREFIXED=1]=`LENGTH_PREFIXED`,e[e.DELIMITED=2]=`DELIMITED`})(v||(e.FeatureSet_MessageEncoding=v={})),e.FeatureSet_MessageEncodingSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,19,4);var y;(function(e){e[e.JSON_FORMAT_UNKNOWN=0]=`JSON_FORMAT_UNKNOWN`,e[e.ALLOW=1]=`ALLOW`,e[e.LEGACY_BEST_EFFORT=2]=`LEGACY_BEST_EFFORT`})(y||(e.FeatureSet_JsonFormat=y={})),e.FeatureSet_JsonFormatSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,19,5);var b;(function(e){e[e.ENFORCE_NAMING_STYLE_UNKNOWN=0]=`ENFORCE_NAMING_STYLE_UNKNOWN`,e[e.STYLE2024=1]=`STYLE2024`,e[e.STYLE_LEGACY=2]=`STYLE_LEGACY`})(b||(e.FeatureSet_EnforceNamingStyle=b={})),e.FeatureSet_EnforceNamingStyleSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,19,6),e.FeatureSetDefaultsSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,20),e.FeatureSetDefaults_FeatureSetEditionDefaultSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,20,0),e.SourceCodeInfoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,21),e.SourceCodeInfo_LocationSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,21,0),e.GeneratedCodeInfoSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,22),e.GeneratedCodeInfo_AnnotationSchema=(0,n.messageDesc)(e.file_google_protobuf_descriptor,22,0);var x;(function(e){e[e.NONE=0]=`NONE`,e[e.SET=1]=`SET`,e[e.ALIAS=2]=`ALIAS`})(x||(e.GeneratedCodeInfo_Annotation_Semantic=x={})),e.GeneratedCodeInfo_Annotation_SemanticSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,22,0,0);var S;(function(e){e[e.EDITION_UNKNOWN=0]=`EDITION_UNKNOWN`,e[e.EDITION_LEGACY=900]=`EDITION_LEGACY`,e[e.EDITION_PROTO2=998]=`EDITION_PROTO2`,e[e.EDITION_PROTO3=999]=`EDITION_PROTO3`,e[e.EDITION_2023=1e3]=`EDITION_2023`,e[e.EDITION_2024=1001]=`EDITION_2024`,e[e.EDITION_UNSTABLE=9999]=`EDITION_UNSTABLE`,e[e.EDITION_1_TEST_ONLY=1]=`EDITION_1_TEST_ONLY`,e[e.EDITION_2_TEST_ONLY=2]=`EDITION_2_TEST_ONLY`,e[e.EDITION_99997_TEST_ONLY=99997]=`EDITION_99997_TEST_ONLY`,e[e.EDITION_99998_TEST_ONLY=99998]=`EDITION_99998_TEST_ONLY`,e[e.EDITION_99999_TEST_ONLY=99999]=`EDITION_99999_TEST_ONLY`,e[e.EDITION_MAX=2147483647]=`EDITION_MAX`})(S||(e.Edition=S={})),e.EditionSchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,0);var C;(function(e){e[e.VISIBILITY_UNSET=0]=`VISIBILITY_UNSET`,e[e.VISIBILITY_LOCAL=1]=`VISIBILITY_LOCAL`,e[e.VISIBILITY_EXPORT=2]=`VISIBILITY_EXPORT`})(C||(e.SymbolVisibility=C={})),e.SymbolVisibilitySchema=(0,r.enumDesc)(e.file_google_protobuf_descriptor,1)}}),L=m({"node_modules/@bufbuild/protobuf/dist/commonjs/from-binary.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.makeReadContext=l,e.fromBinary=u,e.mergeFromBinary=d,e.readField=_;var t=y(),n=S(),r=D(),i=C(),a=k(),o=E(),s=ee(),c=b();function l(e){return Object.assign(Object.assign({readUnknownFields:!0,recursionLimit:100},e),{depth:0})}function u(e,t,n){let r=(0,o.create)(e);return p(e).read(r,new s.BinaryReader(t),l(n),t.byteLength),r}function d(e,t,n,i){if(t.$typeName!==e.typeName&&e.fields.length>0)throw new r.FieldError(e.fields[0],`cannot use ${e.fields[0]} with message ${t.$typeName}`,`ForeignFieldError`);return p(e).read(t,new s.BinaryReader(n),l(i),n.byteLength),t}var f=/* @__PURE__ */ new WeakMap;function p(e){let t=f.get(e);return t===void 0&&(t=m(e)),t}function m(e){let t=String(e),n=/* @__PURE__ */ new Map,r={read:h(t,n),readGroup:g(t,n)};f.set(e,r);for(let t of e.fields)n.set(t.number,v(t));return r}function h(e,t){return(n,r,i,a)=>{if(++i.depth>i.recursionLimit)throw Error(`cannot decode ${e} from binary: maximum recursion depth of ${i.recursionLimit} reached`);let o=r.pos+a,s=n.$unknown??[];for(;r.pos<o;){let[e,a]=r.tag(),o=t.get(e);if(o===void 0){let t=r.skip(a,e,i.recursionLimit-i.depth);i.readUnknownFields&&s.push({no:e,wireType:a,data:t})}else o(n,r,i,a)}s.length>0&&(n.$unknown=s),i.depth--}}function g(e,t){return(n,r,i,a)=>{if(++i.depth>i.recursionLimit)throw Error(`cannot decode ${e} from binary: maximum recursion depth of ${i.recursionLimit} reached`);let o,c,l=n.$unknown??[];for(;r.pos<r.len&&([o,c]=r.tag(),c!=s.WireType.EndGroup);){let e=t.get(o);if(e===void 0){let e=r.skip(c,o,i.recursionLimit-i.depth);i.readUnknownFields&&l.push({no:o,wireType:c,data:e})}else e(n,r,i,c)}if(c!=s.WireType.EndGroup||o!==a)throw Error(`invalid end group tag`);l.length>0&&(n.$unknown=l),i.depth--}}function _(e,t,n,r,a){v(n)(e[i.unsafeLocal],t,a,r)}function v(e){switch(e.fieldKind){case`scalar`:return x(e);case`enum`:return w(e);case`message`:return T(e);case`list`:return te(e);case`map`:return A(e)}}function x(e){let t=j(e.scalar,e.utf8Validation,e.longAsString),n=e.localName;if(e.oneof){let r=e.oneof.localName;return(e,i)=>{e[r]={case:n,value:t(i)}}}return(e,r)=>{e[n]=t(r)}}function w(e){let t=e.localName,n=e.oneof?.localName;if(e.enum.open)return n===void 0?(e,n)=>{e[t]=n.int32()}:(e,r)=>{e[n]={case:t,value:r.int32()}};let r=e.enum.values,i=e.number;return(e,a,o,s)=>{let l=a.int32();if(r.some(e=>e.number===l))n===void 0?e[t]=l:e[n]={case:t,value:l};else if(o.readUnknownFields){let t=[];(0,c.varint32write)(l,t);let n=e.$unknown??[];n.push({no:i,wireType:s,data:new Uint8Array(t)}),e.$unknown=n}}}function T(e){let t=e.localName,{toMessage:n,toLocal:r}=(0,a.localMessageMapper)(e),i=O(e);if(e.oneof){let a=e.oneof.localName;return(e,o,s)=>{let c=e[a],l=n(c.case===t?c.value:void 0);i(l,o,s),e[a]={case:t,value:r(l)}}}return(e,a,o)=>{let s=n(e[t]);i(s,a,o),e[t]=r(s)}}function O(e){let t=p(e.message);if(e.delimitedEncoding){let n=e.number;return(e,r,i)=>t.readGroup(e,r,i,n)}return(e,n,r)=>t.read(e,n,r,n.uint32())}function te(e){let n=e.localName;if(e.listKind==`message`){let{toMessage:t,toLocal:r}=(0,a.localMessageMapper)(e),i=O(e);return(e,a,o)=>{let s=t(void 0);i(s,a,o),e[n].push(r(s))}}let r=e.listKind==`enum`?t.ScalarType.INT32:e.scalar,i=e.listKind==`scalar`&&e.longAsString,o=j(r,e.utf8Validation,i),c=r!=t.ScalarType.STRING&&r!=t.ScalarType.BYTES;return(e,t,r,i)=>{let a=e[n];if(i==s.WireType.LengthDelimited&&c){let e=t.uint32()+t.pos;for(;t.pos<e;)a.push(o(t))}else a.push(o(t))}}function A(e){let r=e.localName,i=j(e.mapKey,e.utf8Validation,!1),o=(0,n.scalarZeroValue)(e.mapKey,!1),s,c;switch(e.mapKind){case`scalar`:{let r=e.scalar,i=j(r,e.utf8Validation,!1);if(s=e=>i(e),r==t.ScalarType.BYTES)c=()=>/* @__PURE__ */ new Uint8Array;else{let e=(0,n.scalarZeroValue)(r,!1);c=()=>e}break}case`enum`:{let t=e.enum.values[0].number;s=e=>e.int32(),c=()=>t;break}case`message`:{let{toMessage:t,toLocal:n}=(0,a.localMessageMapper)(e),r=p(e.message).read;s=(e,i)=>{let a=t(void 0);return r(a,e,i,e.uint32()),n(a)},c=()=>n(t(void 0));break}}return(e,t,n)=>{let a=e[r],l,u,d=t.uint32(),f=t.pos+d;for(;t.pos<f;){let[e]=t.tag();switch(e){case 1:l=i(t);break;case 2:u=s(t,n)}}l===void 0&&(l=o),u===void 0&&(u=c()),a[l]=u}}function j(e,n,r){switch(e){case t.ScalarType.STRING:return e=>e.string(n);case t.ScalarType.BOOL:return e=>e.bool();case t.ScalarType.DOUBLE:return e=>e.double();case t.ScalarType.FLOAT:return e=>e.float();case t.ScalarType.INT32:return e=>e.int32();case t.ScalarType.INT64:return r?e=>String(e.int64()):e=>e.int64();case t.ScalarType.UINT64:return r?e=>String(e.uint64()):e=>e.uint64();case t.ScalarType.FIXED64:return r?e=>String(e.fixed64()):e=>e.fixed64();case t.ScalarType.BYTES:return e=>e.bytes();case t.ScalarType.FIXED32:return e=>e.fixed32();case t.ScalarType.SFIXED32:return e=>e.sfixed32();case t.ScalarType.SFIXED64:return r?e=>String(e.sfixed64()):e=>e.sfixed64();case t.ScalarType.SINT64:return r?e=>String(e.sint64()):e=>e.sint64();case t.ScalarType.UINT32:return e=>e.uint32();case t.ScalarType.SINT32:return e=>e.sint32()}}}}),R=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/file.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.fileDesc=o;var t=M(),n=I(),r=oe(),i=re(),a=L();function o(e,o){let s=(0,a.fromBinary)(n.FileDescriptorProtoSchema,(0,t.base64Decode)(e));return s.messageType.forEach(i.restoreJsonNames),s.dependency=o?.map(e=>e.proto.name)??[],(0,r.createFileRegistry)(s,e=>o?.find(t=>t.proto.name===e)).getFile(s.name)}}}),z=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/timestamp_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.TimestampSchema=e.file_google_protobuf_timestamp=void 0;var t=R(),n=P();e.file_google_protobuf_timestamp=(0,t.fileDesc)(`Ch9nb29nbGUvcHJvdG9idWYvdGltZXN0YW1wLnByb3RvEg9nb29nbGUucHJvdG9idWYiKwoJVGltZXN0YW1wEg8KB3NlY29uZHMYASABKAMSDQoFbmFub3MYAiABKAVChQEKE2NvbS5nb29nbGUucHJvdG9idWZCDlRpbWVzdGFtcFByb3RvUAFaMmdvb2dsZS5nb2xhbmcub3JnL3Byb3RvYnVmL3R5cGVzL2tub3duL3RpbWVzdGFtcHBi+AEBogIDR1BCqgIeR29vZ2xlLlByb3RvYnVmLldlbGxLbm93blR5cGVzYgZwcm90bzM`),e.TimestampSchema=(0,n.messageDesc)(e.file_google_protobuf_timestamp,0)}}),se=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/timestamp.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.timestampNow=i,e.timestampFromDate=a,e.timestampDate=o,e.timestampFromMs=s,e.timestampMs=c;var t=z(),n=E(),r=x();function i(){return a(/* @__PURE__ */ new Date)}function a(e){return s(e.getTime())}function o(e){return new Date(c(e))}function s(e){let i=Math.floor(e/1e3);return(0,n.create)(t.TimestampSchema,{seconds:r.protoInt64.parse(i),nanos:(e-i*1e3)*1e6})}function c(e){return Number(e.seconds)*1e3+Math.round(e.nanos/1e6)}}}),ce=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/duration_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.DurationSchema=e.file_google_protobuf_duration=void 0;var t=R(),n=P();e.file_google_protobuf_duration=(0,t.fileDesc)(`Ch5nb29nbGUvcHJvdG9idWYvZHVyYXRpb24ucHJvdG8SD2dvb2dsZS5wcm90b2J1ZiIqCghEdXJhdGlvbhIPCgdzZWNvbmRzGAEgASgDEg0KBW5hbm9zGAIgASgFQoMBChNjb20uZ29vZ2xlLnByb3RvYnVmQg1EdXJhdGlvblByb3RvUAFaMWdvb2dsZS5nb2xhbmcub3JnL3Byb3RvYnVmL3R5cGVzL2tub3duL2R1cmF0aW9ucGL4AQGiAgNHUEKqAh5Hb29nbGUuUHJvdG9idWYuV2VsbEtub3duVHlwZXNiBnByb3RvMw`),e.DurationSchema=(0,n.messageDesc)(e.file_google_protobuf_duration,0)}}),le=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/duration.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.durationFromMs=i,e.durationMs=a;var t=ce(),n=E(),r=x();function i(e){let i=e<0?-1:1,a=Math.abs(e),o=Math.floor(a/1e3),s=(a-o*1e3)*1e6;return(0,n.create)(t.DurationSchema,{seconds:r.protoInt64.parse(o*i),nanos:s===0?0:s*i})}function a(e){return Number(e.seconds)*1e3+Math.round(e.nanos/1e6)}}}),B=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/any_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.AnySchema=e.file_google_protobuf_any=void 0;var t=R(),n=P();e.file_google_protobuf_any=(0,t.fileDesc)(`Chlnb29nbGUvcHJvdG9idWYvYW55LnByb3RvEg9nb29nbGUucHJvdG9idWYiJgoDQW55EhAKCHR5cGVfdXJsGAEgASgJEg0KBXZhbHVlGAIgASgMQnYKE2NvbS5nb29nbGUucHJvdG9idWZCCEFueVByb3RvUAFaLGdvb2dsZS5nb2xhbmcub3JnL3Byb3RvYnVmL3R5cGVzL2tub3duL2FueXBiogIDR1BCqgIeR29vZ2xlLlByb3RvYnVmLldlbGxLbm93blR5cGVzYgZwcm90bzM`),e.AnySchema=(0,n.messageDesc)(e.file_google_protobuf_any,0)}}),ue=m({"node_modules/@bufbuild/protobuf/dist/commonjs/to-binary.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.toBinary=d,e.writeField=O;var t=ee(),n=y(),r=D(),i=C(),a=k(),o=x(),s=2,c=3,l={writeUnknownFields:!0};function u(e){return e?Object.assign(Object.assign({},l),e):l}function d(e,n,r){let i=new t.BinaryWriter;return p(e)(i,u(r),n),i.finish()}var f=/* @__PURE__ */ new WeakMap;function p(e){let t=f.get(e);return t===void 0&&(t=m(e)),t}function m(e){let t=e.typeName,n=e.fields.concat().sort((e,t)=>e.number-t.number),i=n[0],a=[],o=(e,n,o)=>{if(o.$typeName!==t&&i!==void 0)throw new r.FieldError(i,`cannot use ${i} with message ${o.$typeName}`,`ForeignFieldError`);for(let t=0;t<a.length;t++)a[t](e,n,o);let s=o.$unknown;if(s!==void 0&&n.writeUnknownFields)for(let t=0;t<s.length;t++){let{no:n,wireType:r,data:i}=s[t];e.tag(n,r).raw(i)}};f.set(e,o);for(let e of n)a.push(h(e));return o}function h(e){switch(e.fieldKind){case`message`:case`scalar`:case`enum`:return g(e);case`list`:return v(e);case`map`:return b(e)}}function g(e){let t=_(e),r=e.localName;if(e.oneof){let n=e.oneof.localName;return(e,i,a)=>{let o=a[n];o.case===r&&t(e,i,o.value)}}if(e.presence!=s){let n=e.presence==c?`cannot encode ${e} to binary: required field not set`:void 0;return(e,i,a)=>{let o=a[r];if(o!==void 0&&Object.prototype.hasOwnProperty.call(a,r))t(e,i,o);else if(n!==void 0)throw Error(n)}}if(e.fieldKind==`enum`){let n=e.enum.values[0].number;return(e,i,a)=>{let o=a[r];o!==n&&t(e,i,o)}}switch(e.scalar){case n.ScalarType.BOOL:return(e,n,i)=>{let a=i[r];a!==!1&&t(e,n,a)};case n.ScalarType.STRING:return(e,n,i)=>{let a=i[r];a!==``&&t(e,n,a)};case n.ScalarType.BYTES:return(e,n,i)=>{let a=i[r];(!(a instanceof Uint8Array)||a.byteLength>0)&&t(e,n,a)};case n.ScalarType.DOUBLE:case n.ScalarType.FLOAT:return(e,n,i)=>{let a=i[r];Object.is(a,0)||t(e,n,a)};default:return(e,n,i)=>{let a=i[r];a!=0&&t(e,n,a)}}}function _(e){switch(e.fieldKind){case`message`:{let{toMessage:t}=(0,a.localMessageMapper)(e),n=te(e);return(e,r,i)=>{n(e,r,t(i))}}case`scalar`:case`enum`:{let t=e.fieldKind==`enum`?n.ScalarType.INT32:e.scalar,r=e.number,i=A(t),a=T(t,e.parent.typeName,e.name);return(e,t,n)=>{e.tag(r,i),a(e,n)}}}}function v(e){let r=e.localName,i=e.number;switch(e.listKind){case`message`:{let{toMessage:t}=(0,a.localMessageMapper)(e),n=te(e);return(e,i,a)=>{let o=a[r];for(let r=0;r<o.length;r++)n(e,i,t(o[r]))}}case`scalar`:case`enum`:{let a=e.listKind==`enum`?n.ScalarType.INT32:e.scalar,o=T(a,e.parent.typeName,e.name);if(e.packed)return(e,n,a)=>{let s=a[r];if(s.length!=0){e.tag(i,t.WireType.LengthDelimited).fork();for(let t=0;t<s.length;t++)o(e,s[t]);e.join()}};let s=A(a);return(e,t,n)=>{let a=n[r];for(let t=0;t<a.length;t++)e.tag(i,s),o(e,a[t])}}}}function b(e){let r=e.localName,i=e.number,o=S(e);if(e.mapKind==`message`){let{toMessage:n}=(0,a.localMessageMapper)(e),s=p(e.message);return(e,a,c)=>{let l=c[r],u=Object.keys(l);for(let r=0;r<u.length;r++){let c=u[r];e.tag(i,t.WireType.LengthDelimited).fork(),o(e,c),e.tag(2,t.WireType.LengthDelimited).fork(),s(e,a,n(l[c])),e.join(),e.join()}}}let s=e.mapKind==`enum`?n.ScalarType.INT32:e.scalar,c=A(s),l=T(s,e.parent.typeName,e.name);return(e,n,a)=>{let s=a[r],u=Object.keys(s);for(let n=0;n<u.length;n++){let r=u[n];e.tag(i,t.WireType.LengthDelimited).fork(),o(e,r),e.tag(2,c),l(e,s[r]),e.join()}}}function S(e){let t=A(e.mapKey),n=T(e.mapKey,e.parent.typeName,e.name),r=w(e.mapKey);return(e,i)=>{e.tag(1,t),n(e,r(i))}}function w(e){switch(e){case n.ScalarType.STRING:return e=>e;case n.ScalarType.BOOL:return e=>e===`true`||e!==`false`&&e;case n.ScalarType.UINT64:case n.ScalarType.FIXED64:return e=>{try{return o.protoInt64.uParse(e)}catch{return e}};case n.ScalarType.INT64:case n.ScalarType.SFIXED64:case n.ScalarType.SINT64:return e=>{try{return o.protoInt64.parse(e)}catch{return e}};default:return e=>{let t=Number.parseInt(e);return Number.isFinite(t)?t:e}}}function T(e,t,n){let r=E(e);return(e,i)=>{try{r(e,i)}catch(e){throw e instanceof Error?/* @__PURE__ */ Error(`cannot encode field ${t}.${n} to binary: ${e.message}`):e}}}function E(e){switch(e){case n.ScalarType.STRING:return(e,t)=>e.string(t);case n.ScalarType.BOOL:return(e,t)=>e.bool(t);case n.ScalarType.DOUBLE:return(e,t)=>e.double(t);case n.ScalarType.FLOAT:return(e,t)=>e.float(t);case n.ScalarType.INT32:return(e,t)=>e.int32(t);case n.ScalarType.INT64:return(e,t)=>e.int64(t);case n.ScalarType.UINT64:return(e,t)=>e.uint64(t);case n.ScalarType.FIXED64:return(e,t)=>e.fixed64(t);case n.ScalarType.BYTES:return(e,t)=>e.bytes(t);case n.ScalarType.FIXED32:return(e,t)=>e.fixed32(t);case n.ScalarType.SFIXED32:return(e,t)=>e.sfixed32(t);case n.ScalarType.SFIXED64:return(e,t)=>e.sfixed64(t);case n.ScalarType.SINT64:return(e,t)=>e.sint64(t);case n.ScalarType.UINT32:return(e,t)=>e.uint32(t);case n.ScalarType.SINT32:return(e,t)=>e.sint32(t)}}function O(e,t,n,r){h(r)(e,t,n[i.unsafeLocal])}function te(e){let n=e.number,r=p(e.message);return e.delimitedEncoding?(e,i,a)=>{e.tag(n,t.WireType.StartGroup),r(e,i,a),e.tag(n,t.WireType.EndGroup)}:(e,i,a)=>{e.tag(n,t.WireType.LengthDelimited).fork(),r(e,i,a),e.join()}}function A(e){switch(e){case n.ScalarType.BYTES:case n.ScalarType.STRING:return t.WireType.LengthDelimited;case n.ScalarType.DOUBLE:case n.ScalarType.FIXED64:case n.ScalarType.SFIXED64:return t.WireType.Bit64;case n.ScalarType.FIXED32:case n.ScalarType.SFIXED32:case n.ScalarType.FLOAT:return t.WireType.Bit32;default:return t.WireType.Varint}}}}),de=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/any.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.anyPack=a,e.anyIs=o,e.anyUnpack=s,e.anyUnpackTo=c;var t=B(),n=E(),r=ue(),i=L();function a(e,i,a){let o=!1;return a||(a=(0,n.create)(t.AnySchema),o=!0),a.value=(0,r.toBinary)(e,i),a.typeUrl=l(i.$typeName),o?a:void 0}function o(e,t){return e.typeUrl!==``&&(typeof t==`string`?t:t.typeName)===u(e.typeUrl)}function s(e,t){if(e.typeUrl===``)return;let n=t.kind==`message`?t:t.getMessage(u(e.typeUrl));if(n&&o(e,n))return(0,i.fromBinary)(n,e.value)}function c(e,t,n){if(o(e,t))return(0,i.mergeFromBinary)(t,n,e.value)}function l(e){return`type.googleapis.com/${e}`}function u(e){let t=e.lastIndexOf(`/`),n=t>=0?e.substring(t+1):e;if(!n.length)throw Error(`invalid type url: ${e}`);return n}}}),fe=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/source_context_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.SourceContextSchema=e.file_google_protobuf_source_context=void 0;var t=R(),n=P();e.file_google_protobuf_source_context=(0,t.fileDesc)(`CiRnb29nbGUvcHJvdG9idWYvc291cmNlX2NvbnRleHQucHJvdG8SD2dvb2dsZS5wcm90b2J1ZiIiCg1Tb3VyY2VDb250ZXh0EhEKCWZpbGVfbmFtZRgBIAEoCUKKAQoTY29tLmdvb2dsZS5wcm90b2J1ZkISU291cmNlQ29udGV4dFByb3RvUAFaNmdvb2dsZS5nb2xhbmcub3JnL3Byb3RvYnVmL3R5cGVzL2tub3duL3NvdXJjZWNvbnRleHRwYqICA0dQQqoCHkdvb2dsZS5Qcm90b2J1Zi5XZWxsS25vd25UeXBlc2IGcHJvdG8z`),e.SourceContextSchema=(0,n.messageDesc)(e.file_google_protobuf_source_context,0)}}),pe=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/type_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.SyntaxSchema=e.Syntax=e.OptionSchema=e.EnumValueSchema=e.EnumSchema=e.Field_CardinalitySchema=e.Field_Cardinality=e.Field_KindSchema=e.Field_Kind=e.FieldSchema=e.TypeSchema=e.file_google_protobuf_type=void 0;var t=R(),n=B(),r=fe(),i=P(),a=F();e.file_google_protobuf_type=(0,t.fileDesc)(`Chpnb29nbGUvcHJvdG9idWYvdHlwZS5wcm90bxIPZ29vZ2xlLnByb3RvYnVmIugBCgRUeXBlEgwKBG5hbWUYASABKAkSJgoGZmllbGRzGAIgAygLMhYuZ29vZ2xlLnByb3RvYnVmLkZpZWxkEg4KBm9uZW9mcxgDIAMoCRIoCgdvcHRpb25zGAQgAygLMhcuZ29vZ2xlLnByb3RvYnVmLk9wdGlvbhI2Cg5zb3VyY2VfY29udGV4dBgFIAEoCzIeLmdvb2dsZS5wcm90b2J1Zi5Tb3VyY2VDb250ZXh0EicKBnN5bnRheBgGIAEoDjIXLmdvb2dsZS5wcm90b2J1Zi5TeW50YXgSDwoHZWRpdGlvbhgHIAEoCSLVBQoFRmllbGQSKQoEa2luZBgBIAEoDjIbLmdvb2dsZS5wcm90b2J1Zi5GaWVsZC5LaW5kEjcKC2NhcmRpbmFsaXR5GAIgASgOMiIuZ29vZ2xlLnByb3RvYnVmLkZpZWxkLkNhcmRpbmFsaXR5Eg4KBm51bWJlchgDIAEoBRIMCgRuYW1lGAQgASgJEhAKCHR5cGVfdXJsGAYgASgJEhMKC29uZW9mX2luZGV4GAcgASgFEg4KBnBhY2tlZBgIIAEoCBIoCgdvcHRpb25zGAkgAygLMhcuZ29vZ2xlLnByb3RvYnVmLk9wdGlvbhIRCglqc29uX25hbWUYCiABKAkSFQoNZGVmYXVsdF92YWx1ZRgLIAEoCSLIAgoES2luZBIQCgxUWVBFX1VOS05PV04QABIPCgtUWVBFX0RPVUJMRRABEg4KClRZUEVfRkxPQVQQAhIOCgpUWVBFX0lOVDY0EAMSDwoLVFlQRV9VSU5UNjQQBBIOCgpUWVBFX0lOVDMyEAUSEAoMVFlQRV9GSVhFRDY0EAYSEAoMVFlQRV9GSVhFRDMyEAcSDQoJVFlQRV9CT09MEAgSDwoLVFlQRV9TVFJJTkcQCRIOCgpUWVBFX0dST1VQEAoSEAoMVFlQRV9NRVNTQUdFEAsSDgoKVFlQRV9CWVRFUxAMEg8KC1RZUEVfVUlOVDMyEA0SDQoJVFlQRV9FTlVNEA4SEQoNVFlQRV9TRklYRUQzMhAPEhEKDVRZUEVfU0ZJWEVENjQQEBIPCgtUWVBFX1NJTlQzMhAREg8KC1RZUEVfU0lOVDY0EBIidAoLQ2FyZGluYWxpdHkSFwoTQ0FSRElOQUxJVFlfVU5LTk9XThAAEhgKFENBUkRJTkFMSVRZX09QVElPTkFMEAESGAoUQ0FSRElOQUxJVFlfUkVRVUlSRUQQAhIYChRDQVJESU5BTElUWV9SRVBFQVRFRBADIt8BCgRFbnVtEgwKBG5hbWUYASABKAkSLQoJZW51bXZhbHVlGAIgAygLMhouZ29vZ2xlLnByb3RvYnVmLkVudW1WYWx1ZRIoCgdvcHRpb25zGAMgAygLMhcuZ29vZ2xlLnByb3RvYnVmLk9wdGlvbhI2Cg5zb3VyY2VfY29udGV4dBgEIAEoCzIeLmdvb2dsZS5wcm90b2J1Zi5Tb3VyY2VDb250ZXh0EicKBnN5bnRheBgFIAEoDjIXLmdvb2dsZS5wcm90b2J1Zi5TeW50YXgSDwoHZWRpdGlvbhgGIAEoCSJTCglFbnVtVmFsdWUSDAoEbmFtZRgBIAEoCRIOCgZudW1iZXIYAiABKAUSKAoHb3B0aW9ucxgDIAMoCzIXLmdvb2dsZS5wcm90b2J1Zi5PcHRpb24iOwoGT3B0aW9uEgwKBG5hbWUYASABKAkSIwoFdmFsdWUYAiABKAsyFC5nb29nbGUucHJvdG9idWYuQW55KkMKBlN5bnRheBIRCg1TWU5UQVhfUFJPVE8yEAASEQoNU1lOVEFYX1BST1RPMxABEhMKD1NZTlRBWF9FRElUSU9OUxACQnsKE2NvbS5nb29nbGUucHJvdG9idWZCCVR5cGVQcm90b1ABWi1nb29nbGUuZ29sYW5nLm9yZy9wcm90b2J1Zi90eXBlcy9rbm93bi90eXBlcGL4AQGiAgNHUEKqAh5Hb29nbGUuUHJvdG9idWYuV2VsbEtub3duVHlwZXNiBnByb3RvMw`,[n.file_google_protobuf_any,r.file_google_protobuf_source_context]),e.TypeSchema=(0,i.messageDesc)(e.file_google_protobuf_type,0),e.FieldSchema=(0,i.messageDesc)(e.file_google_protobuf_type,1);var o;(function(e){e[e.TYPE_UNKNOWN=0]=`TYPE_UNKNOWN`,e[e.TYPE_DOUBLE=1]=`TYPE_DOUBLE`,e[e.TYPE_FLOAT=2]=`TYPE_FLOAT`,e[e.TYPE_INT64=3]=`TYPE_INT64`,e[e.TYPE_UINT64=4]=`TYPE_UINT64`,e[e.TYPE_INT32=5]=`TYPE_INT32`,e[e.TYPE_FIXED64=6]=`TYPE_FIXED64`,e[e.TYPE_FIXED32=7]=`TYPE_FIXED32`,e[e.TYPE_BOOL=8]=`TYPE_BOOL`,e[e.TYPE_STRING=9]=`TYPE_STRING`,e[e.TYPE_GROUP=10]=`TYPE_GROUP`,e[e.TYPE_MESSAGE=11]=`TYPE_MESSAGE`,e[e.TYPE_BYTES=12]=`TYPE_BYTES`,e[e.TYPE_UINT32=13]=`TYPE_UINT32`,e[e.TYPE_ENUM=14]=`TYPE_ENUM`,e[e.TYPE_SFIXED32=15]=`TYPE_SFIXED32`,e[e.TYPE_SFIXED64=16]=`TYPE_SFIXED64`,e[e.TYPE_SINT32=17]=`TYPE_SINT32`,e[e.TYPE_SINT64=18]=`TYPE_SINT64`})(o||(e.Field_Kind=o={})),e.Field_KindSchema=(0,a.enumDesc)(e.file_google_protobuf_type,1,0);var s;(function(e){e[e.UNKNOWN=0]=`UNKNOWN`,e[e.OPTIONAL=1]=`OPTIONAL`,e[e.REQUIRED=2]=`REQUIRED`,e[e.REPEATED=3]=`REPEATED`})(s||(e.Field_Cardinality=s={})),e.Field_CardinalitySchema=(0,a.enumDesc)(e.file_google_protobuf_type,1,1),e.EnumSchema=(0,i.messageDesc)(e.file_google_protobuf_type,2),e.EnumValueSchema=(0,i.messageDesc)(e.file_google_protobuf_type,3),e.OptionSchema=(0,i.messageDesc)(e.file_google_protobuf_type,4);var c;(function(e){e[e.PROTO2=0]=`PROTO2`,e[e.PROTO3=1]=`PROTO3`,e[e.EDITIONS=2]=`EDITIONS`})(c||(e.Syntax=c={})),e.SyntaxSchema=(0,a.enumDesc)(e.file_google_protobuf_type,0)}}),me=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/api_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.MixinSchema=e.MethodSchema=e.ApiSchema=e.file_google_protobuf_api=void 0;var t=R(),n=fe(),r=pe(),i=P();e.file_google_protobuf_api=(0,t.fileDesc)(`Chlnb29nbGUvcHJvdG9idWYvYXBpLnByb3RvEg9nb29nbGUucHJvdG9idWYikgIKA0FwaRIMCgRuYW1lGAEgASgJEigKB21ldGhvZHMYAiADKAsyFy5nb29nbGUucHJvdG9idWYuTWV0aG9kEigKB29wdGlvbnMYAyADKAsyFy5nb29nbGUucHJvdG9idWYuT3B0aW9uEg8KB3ZlcnNpb24YBCABKAkSNgoOc291cmNlX2NvbnRleHQYBSABKAsyHi5nb29nbGUucHJvdG9idWYuU291cmNlQ29udGV4dBImCgZtaXhpbnMYBiADKAsyFi5nb29nbGUucHJvdG9idWYuTWl4aW4SJwoGc3ludGF4GAcgASgOMhcuZ29vZ2xlLnByb3RvYnVmLlN5bnRheBIPCgdlZGl0aW9uGAggASgJIu4BCgZNZXRob2QSDAoEbmFtZRgBIAEoCRIYChByZXF1ZXN0X3R5cGVfdXJsGAIgASgJEhkKEXJlcXVlc3Rfc3RyZWFtaW5nGAMgASgIEhkKEXJlc3BvbnNlX3R5cGVfdXJsGAQgASgJEhoKEnJlc3BvbnNlX3N0cmVhbWluZxgFIAEoCBIoCgdvcHRpb25zGAYgAygLMhcuZ29vZ2xlLnByb3RvYnVmLk9wdGlvbhIrCgZzeW50YXgYByABKA4yFy5nb29nbGUucHJvdG9idWYuU3ludGF4QgIYARITCgdlZGl0aW9uGAggASgJQgIYASIjCgVNaXhpbhIMCgRuYW1lGAEgASgJEgwKBHJvb3QYAiABKAlCdgoTY29tLmdvb2dsZS5wcm90b2J1ZkIIQXBpUHJvdG9QAVosZ29vZ2xlLmdvbGFuZy5vcmcvcHJvdG9idWYvdHlwZXMva25vd24vYXBpcGKiAgNHUEKqAh5Hb29nbGUuUHJvdG9idWYuV2VsbEtub3duVHlwZXNiBnByb3RvMw`,[n.file_google_protobuf_source_context,r.file_google_protobuf_type]),e.ApiSchema=(0,i.messageDesc)(e.file_google_protobuf_api,0),e.MethodSchema=(0,i.messageDesc)(e.file_google_protobuf_api,1),e.MixinSchema=(0,i.messageDesc)(e.file_google_protobuf_api,2)}}),he=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/extension.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.extDesc=t;function t(e,t,...n){if(n.length==0)return e.extensions[t];let r=n.pop();return n.reduce((e,t)=>e.nestedMessages[t],e.messages[t]).nestedExtensions[r]}}}),ge=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/cpp_features_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.cpp=e.CppFeatures_StringTypeSchema=e.CppFeatures_StringType=e.CppFeaturesSchema=e.file_google_protobuf_cpp_features=void 0;var t=R(),n=I(),r=P(),i=F(),a=he();e.file_google_protobuf_cpp_features=(0,t.fileDesc)(`CiJnb29nbGUvcHJvdG9idWYvY3BwX2ZlYXR1cmVzLnByb3RvEgJwYiL8AwoLQ3BwRmVhdHVyZXMS+wEKEmxlZ2FjeV9jbG9zZWRfZW51bRgBIAEoCELeAYgBAZgBBJgBAaIBCRIEdHJ1ZRiEB6IBChIFZmFsc2UY5weyAbgBCOgHEOgHGq8BVGhlIGxlZ2FjeSBjbG9zZWQgZW51bSBiZWhhdmlvciBpbiBDKysgaXMgZGVwcmVjYXRlZCBhbmQgaXMgc2NoZWR1bGVkIHRvIGJlIHJlbW92ZWQgaW4gZWRpdGlvbiAyMDI1LiAgU2VlIGh0dHA6Ly9wcm90b2J1Zi5kZXYvcHJvZ3JhbW1pbmctZ3VpZGVzL2VudW0vI2NwcCBmb3IgbW9yZSBpbmZvcm1hdGlvbhJaCgtzdHJpbmdfdHlwZRgCIAEoDjIaLnBiLkNwcEZlYXR1cmVzLlN0cmluZ1R5cGVCKYgBAZgBBJgBAaIBCxIGU1RSSU5HGIQHogEJEgRWSUVXGOkHsgEDCOgHEkwKGmVudW1fbmFtZV91c2VzX3N0cmluZ192aWV3GAMgASgIQiiIAQGYAQaYAQGiAQoSBWZhbHNlGIQHogEJEgR0cnVlGOkHsgEDCOkHIkUKClN0cmluZ1R5cGUSFwoTU1RSSU5HX1RZUEVfVU5LTk9XThAAEggKBFZJRVcQARIICgRDT1JEEAISCgoGU1RSSU5HEAM6PwoDY3BwEhsuZ29vZ2xlLnByb3RvYnVmLkZlYXR1cmVTZXQY6AcgASgLMg8ucGIuQ3BwRmVhdHVyZXNSA2NwcA`,[n.file_google_protobuf_descriptor]),e.CppFeaturesSchema=(0,r.messageDesc)(e.file_google_protobuf_cpp_features,0);var o;(function(e){e[e.STRING_TYPE_UNKNOWN=0]=`STRING_TYPE_UNKNOWN`,e[e.VIEW=1]=`VIEW`,e[e.CORD=2]=`CORD`,e[e.STRING=3]=`STRING`})(o||(e.CppFeatures_StringType=o={})),e.CppFeatures_StringTypeSchema=(0,i.enumDesc)(e.file_google_protobuf_cpp_features,0,0),e.cpp=(0,a.extDesc)(e.file_google_protobuf_cpp_features,0)}}),V=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/empty_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.EmptySchema=e.file_google_protobuf_empty=void 0;var t=R(),n=P();e.file_google_protobuf_empty=(0,t.fileDesc)(`Chtnb29nbGUvcHJvdG9idWYvZW1wdHkucHJvdG8SD2dvb2dsZS5wcm90b2J1ZiIHCgVFbXB0eUJ9ChNjb20uZ29vZ2xlLnByb3RvYnVmQgpFbXB0eVByb3RvUAFaLmdvb2dsZS5nb2xhbmcub3JnL3Byb3RvYnVmL3R5cGVzL2tub3duL2VtcHR5cGL4AQGiAgNHUEKqAh5Hb29nbGUuUHJvdG9idWYuV2VsbEtub3duVHlwZXNiBnByb3RvMw`),e.EmptySchema=(0,n.messageDesc)(e.file_google_protobuf_empty,0)}}),H=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/field_mask_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.FieldMaskSchema=e.file_google_protobuf_field_mask=void 0;var t=R(),n=P();e.file_google_protobuf_field_mask=(0,t.fileDesc)(`CiBnb29nbGUvcHJvdG9idWYvZmllbGRfbWFzay5wcm90bxIPZ29vZ2xlLnByb3RvYnVmIhoKCUZpZWxkTWFzaxINCgVwYXRocxgBIAMoCUKFAQoTY29tLmdvb2dsZS5wcm90b2J1ZkIORmllbGRNYXNrUHJvdG9QAVoyZ29vZ2xlLmdvbGFuZy5vcmcvcHJvdG9idWYvdHlwZXMva25vd24vZmllbGRtYXNrcGL4AQGiAgNHUEKqAh5Hb29nbGUuUHJvdG9idWYuV2VsbEtub3duVHlwZXNiBnByb3RvMw`),e.FieldMaskSchema=(0,n.messageDesc)(e.file_google_protobuf_field_mask,0)}}),U=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/go_features_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.go=e.GoFeatures_StripEnumPrefixSchema=e.GoFeatures_StripEnumPrefix=e.GoFeatures_APILevelSchema=e.GoFeatures_APILevel=e.GoFeatures_OptimizeModeFeature_OptimizeModeSchema=e.GoFeatures_OptimizeModeFeature_OptimizeMode=e.GoFeatures_OptimizeModeFeatureSchema=e.GoFeaturesSchema=e.file_google_protobuf_go_features=void 0;var t=R(),n=I(),r=P(),i=F(),a=he();e.file_google_protobuf_go_features=(0,t.fileDesc)(`CiFnb29nbGUvcHJvdG9idWYvZ29fZmVhdHVyZXMucHJvdG8SAnBiItEGCgpHb0ZlYXR1cmVzEqUBChpsZWdhY3lfdW5tYXJzaGFsX2pzb25fZW51bRgBIAEoCEKAAYgBAZgBBpgBAaIBCRIEdHJ1ZRiEB6IBChIFZmFsc2UY5weyAVsI6AcQ6AcaU1RoZSBsZWdhY3kgVW5tYXJzaGFsSlNPTiBBUEkgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIGVkaXRpb24uEmoKCWFwaV9sZXZlbBgCIAEoDjIXLnBiLkdvRmVhdHVyZXMuQVBJTGV2ZWxCPogBAZgBA5gBAaIBGhIVQVBJX0xFVkVMX1VOU1BFQ0lGSUVEGIQHogEPEgpBUElfT1BBUVVFGOkHsgEDCOgHEmsKEXN0cmlwX2VudW1fcHJlZml4GAMgASgOMh4ucGIuR29GZWF0dXJlcy5TdHJpcEVudW1QcmVmaXhCMIgBAZgBBpgBB5gBAaIBGxIWU1RSSVBfRU5VTV9QUkVGSVhfS0VFUBiEB7IBAwjpBxJ4Cg1vcHRpbWl6ZV9tb2RlGAQgASgOMi8ucGIuR29GZWF0dXJlcy5PcHRpbWl6ZU1vZGVGZWF0dXJlLk9wdGltaXplTW9kZUIwiAEBmAEDmAEBogEeEhlPUFRJTUlaRV9NT0RFX1VOU1BFQ0lGSUVEGIQHsgEDCOkHGl4KE09wdGltaXplTW9kZUZlYXR1cmUiRwoMT3B0aW1pemVNb2RlEh0KGU9QVElNSVpFX01PREVfVU5TUEVDSUZJRUQQABIJCgVTUEVFRBABEg0KCUNPREVfU0laRRACIlMKCEFQSUxldmVsEhkKFUFQSV9MRVZFTF9VTlNQRUNJRklFRBAAEgwKCEFQSV9PUEVOEAESDgoKQVBJX0hZQlJJRBACEg4KCkFQSV9PUEFRVUUQAyKSAQoPU3RyaXBFbnVtUHJlZml4EiEKHVNUUklQX0VOVU1fUFJFRklYX1VOU1BFQ0lGSUVEEAASGgoWU1RSSVBfRU5VTV9QUkVGSVhfS0VFUBABEiMKH1NUUklQX0VOVU1fUFJFRklYX0dFTkVSQVRFX0JPVEgQAhIbChdTVFJJUF9FTlVNX1BSRUZJWF9TVFJJUBADOjwKAmdvEhsuZ29vZ2xlLnByb3RvYnVmLkZlYXR1cmVTZXQY6gcgASgLMg4ucGIuR29GZWF0dXJlc1ICZ29CL1otZ29vZ2xlLmdvbGFuZy5vcmcvcHJvdG9idWYvdHlwZXMvZ29mZWF0dXJlc3Bi`,[n.file_google_protobuf_descriptor]),e.GoFeaturesSchema=(0,r.messageDesc)(e.file_google_protobuf_go_features,0),e.GoFeatures_OptimizeModeFeatureSchema=(0,r.messageDesc)(e.file_google_protobuf_go_features,0,0);var o;(function(e){e[e.OPTIMIZE_MODE_UNSPECIFIED=0]=`OPTIMIZE_MODE_UNSPECIFIED`,e[e.SPEED=1]=`SPEED`,e[e.CODE_SIZE=2]=`CODE_SIZE`})(o||(e.GoFeatures_OptimizeModeFeature_OptimizeMode=o={})),e.GoFeatures_OptimizeModeFeature_OptimizeModeSchema=(0,i.enumDesc)(e.file_google_protobuf_go_features,0,0,0);var s;(function(e){e[e.API_LEVEL_UNSPECIFIED=0]=`API_LEVEL_UNSPECIFIED`,e[e.API_OPEN=1]=`API_OPEN`,e[e.API_HYBRID=2]=`API_HYBRID`,e[e.API_OPAQUE=3]=`API_OPAQUE`})(s||(e.GoFeatures_APILevel=s={})),e.GoFeatures_APILevelSchema=(0,i.enumDesc)(e.file_google_protobuf_go_features,0,0);var c;(function(e){e[e.UNSPECIFIED=0]=`UNSPECIFIED`,e[e.KEEP=1]=`KEEP`,e[e.GENERATE_BOTH=2]=`GENERATE_BOTH`,e[e.STRIP=3]=`STRIP`})(c||(e.GoFeatures_StripEnumPrefix=c={})),e.GoFeatures_StripEnumPrefixSchema=(0,i.enumDesc)(e.file_google_protobuf_go_features,0,1),e.go=(0,a.extDesc)(e.file_google_protobuf_go_features,0)}}),_e=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/java_features_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.java=e.JavaFeatures_Utf8ValidationSchema=e.JavaFeatures_Utf8Validation=e.JavaFeatures_NestInFileClassFeature_NestInFileClassSchema=e.JavaFeatures_NestInFileClassFeature_NestInFileClass=e.JavaFeatures_NestInFileClassFeatureSchema=e.JavaFeaturesSchema=e.file_google_protobuf_java_features=void 0;var t=R(),n=I(),r=P(),i=F(),a=he();e.file_google_protobuf_java_features=(0,t.fileDesc)(`CiNnb29nbGUvcHJvdG9idWYvamF2YV9mZWF0dXJlcy5wcm90bxICcGIigwgKDEphdmFGZWF0dXJlcxL+AQoSbGVnYWN5X2Nsb3NlZF9lbnVtGAEgASgIQuEBiAEBmAEEmAEBogEJEgR0cnVlGIQHogEKEgVmYWxzZRjnB7IBuwEI6AcQ6AcasgFUaGUgbGVnYWN5IGNsb3NlZCBlbnVtIGJlaGF2aW9yIGluIEphdmEgaXMgZGVwcmVjYXRlZCBhbmQgaXMgc2NoZWR1bGVkIHRvIGJlIHJlbW92ZWQgaW4gZWRpdGlvbiAyMDI1LiAgU2VlIGh0dHA6Ly9wcm90b2J1Zi5kZXYvcHJvZ3JhbW1pbmctZ3VpZGVzL2VudW0vI2phdmEgZm9yIG1vcmUgaW5mb3JtYXRpb24uEp8CCg91dGY4X3ZhbGlkYXRpb24YAiABKA4yHy5wYi5KYXZhRmVhdHVyZXMuVXRmOFZhbGlkYXRpb25C5AGIAQGYAQSYAQGiAQwSB0RFRkFVTFQYhAeyAcgBCOgHEOkHGr8BVGhlIEphdmEtc3BlY2lmaWMgdXRmOCB2YWxpZGF0aW9uIGZlYXR1cmUgaXMgZGVwcmVjYXRlZCBhbmQgaXMgc2NoZWR1bGVkIHRvIGJlIHJlbW92ZWQgaW4gZWRpdGlvbiAyMDI1LiAgVXRmOCB2YWxpZGF0aW9uIGJlaGF2aW9yIHNob3VsZCB1c2UgdGhlIGdsb2JhbCBjcm9zcy1sYW5ndWFnZSB1dGY4X3ZhbGlkYXRpb24gZmVhdHVyZS4SMAoKbGFyZ2VfZW51bRgDIAEoCEIciAEBmAEGmAEBogEKEgVmYWxzZRiEB7IBAwjpBxJRCh91c2Vfb2xkX291dGVyX2NsYXNzbmFtZV9kZWZhdWx0GAQgASgIQiiIAQGYAQGiAQkSBHRydWUYhAeiAQoSBWZhbHNlGOkHsgEGCOkHIOkHEn8KEm5lc3RfaW5fZmlsZV9jbGFzcxgFIAEoDjI3LnBiLkphdmFGZWF0dXJlcy5OZXN0SW5GaWxlQ2xhc3NGZWF0dXJlLk5lc3RJbkZpbGVDbGFzc0IqiAEBmAEDmAEGmAEIogELEgZMRUdBQ1kYhAeiAQcSAk5PGOkHsgEDCOkHGnwKFk5lc3RJbkZpbGVDbGFzc0ZlYXR1cmUiWAoPTmVzdEluRmlsZUNsYXNzEh4KGk5FU1RfSU5fRklMRV9DTEFTU19VTktOT1dOEAASBgoCTk8QARIHCgNZRVMQAhIUCgZMRUdBQ1kQAxoIIgYI6Qcg6QdKCAgBEICAgIACIkYKDlV0ZjhWYWxpZGF0aW9uEhsKF1VURjhfVkFMSURBVElPTl9VTktOT1dOEAASCwoHREVGQVVMVBABEgoKBlZFUklGWRACSgQIBhAHOkIKBGphdmESGy5nb29nbGUucHJvdG9idWYuRmVhdHVyZVNldBjpByABKAsyEC5wYi5KYXZhRmVhdHVyZXNSBGphdmFCKAoTY29tLmdvb2dsZS5wcm90b2J1ZkIRSmF2YUZlYXR1cmVzUHJvdG8`,[n.file_google_protobuf_descriptor]),e.JavaFeaturesSchema=(0,r.messageDesc)(e.file_google_protobuf_java_features,0),e.JavaFeatures_NestInFileClassFeatureSchema=(0,r.messageDesc)(e.file_google_protobuf_java_features,0,0);var o;(function(e){e[e.NEST_IN_FILE_CLASS_UNKNOWN=0]=`NEST_IN_FILE_CLASS_UNKNOWN`,e[e.NO=1]=`NO`,e[e.YES=2]=`YES`,e[e.LEGACY=3]=`LEGACY`})(o||(e.JavaFeatures_NestInFileClassFeature_NestInFileClass=o={})),e.JavaFeatures_NestInFileClassFeature_NestInFileClassSchema=(0,i.enumDesc)(e.file_google_protobuf_java_features,0,0,0);var s;(function(e){e[e.UTF8_VALIDATION_UNKNOWN=0]=`UTF8_VALIDATION_UNKNOWN`,e[e.DEFAULT=1]=`DEFAULT`,e[e.VERIFY=2]=`VERIFY`})(s||(e.JavaFeatures_Utf8Validation=s={})),e.JavaFeatures_Utf8ValidationSchema=(0,i.enumDesc)(e.file_google_protobuf_java_features,0,0),e.java=(0,a.extDesc)(e.file_google_protobuf_java_features,0)}}),ve=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/struct_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.NullValueSchema=e.NullValue=e.ListValueSchema=e.ValueSchema=e.StructSchema=e.file_google_protobuf_struct=void 0;var t=R(),n=P(),r=F();e.file_google_protobuf_struct=(0,t.fileDesc)(`Chxnb29nbGUvcHJvdG9idWYvc3RydWN0LnByb3RvEg9nb29nbGUucHJvdG9idWYihAEKBlN0cnVjdBIzCgZmaWVsZHMYASADKAsyIy5nb29nbGUucHJvdG9idWYuU3RydWN0LkZpZWxkc0VudHJ5GkUKC0ZpZWxkc0VudHJ5EgsKA2tleRgBIAEoCRIlCgV2YWx1ZRgCIAEoCzIWLmdvb2dsZS5wcm90b2J1Zi5WYWx1ZToCOAEi6gEKBVZhbHVlEjAKCm51bGxfdmFsdWUYASABKA4yGi5nb29nbGUucHJvdG9idWYuTnVsbFZhbHVlSAASFgoMbnVtYmVyX3ZhbHVlGAIgASgBSAASFgoMc3RyaW5nX3ZhbHVlGAMgASgJSAASFAoKYm9vbF92YWx1ZRgEIAEoCEgAEi8KDHN0cnVjdF92YWx1ZRgFIAEoCzIXLmdvb2dsZS5wcm90b2J1Zi5TdHJ1Y3RIABIwCgpsaXN0X3ZhbHVlGAYgASgLMhouZ29vZ2xlLnByb3RvYnVmLkxpc3RWYWx1ZUgAQgYKBGtpbmQiMwoJTGlzdFZhbHVlEiYKBnZhbHVlcxgBIAMoCzIWLmdvb2dsZS5wcm90b2J1Zi5WYWx1ZSobCglOdWxsVmFsdWUSDgoKTlVMTF9WQUxVRRAAQn8KE2NvbS5nb29nbGUucHJvdG9idWZCC1N0cnVjdFByb3RvUAFaL2dvb2dsZS5nb2xhbmcub3JnL3Byb3RvYnVmL3R5cGVzL2tub3duL3N0cnVjdHBi+AEBogIDR1BCqgIeR29vZ2xlLlByb3RvYnVmLldlbGxLbm93blR5cGVzYgZwcm90bzM`),e.StructSchema=(0,n.messageDesc)(e.file_google_protobuf_struct,0),e.ValueSchema=(0,n.messageDesc)(e.file_google_protobuf_struct,1),e.ListValueSchema=(0,n.messageDesc)(e.file_google_protobuf_struct,2);var i;(function(e){e[e.NULL_VALUE=0]=`NULL_VALUE`})(i||(e.NullValue=i={})),e.NullValueSchema=(0,r.enumDesc)(e.file_google_protobuf_struct,0)}}),ye=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/wrappers_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.BytesValueSchema=e.StringValueSchema=e.BoolValueSchema=e.UInt32ValueSchema=e.Int32ValueSchema=e.UInt64ValueSchema=e.Int64ValueSchema=e.FloatValueSchema=e.DoubleValueSchema=e.file_google_protobuf_wrappers=void 0;var t=R(),n=P();e.file_google_protobuf_wrappers=(0,t.fileDesc)(`Ch5nb29nbGUvcHJvdG9idWYvd3JhcHBlcnMucHJvdG8SD2dvb2dsZS5wcm90b2J1ZiIcCgtEb3VibGVWYWx1ZRINCgV2YWx1ZRgBIAEoASIbCgpGbG9hdFZhbHVlEg0KBXZhbHVlGAEgASgCIhsKCkludDY0VmFsdWUSDQoFdmFsdWUYASABKAMiHAoLVUludDY0VmFsdWUSDQoFdmFsdWUYASABKAQiGwoKSW50MzJWYWx1ZRINCgV2YWx1ZRgBIAEoBSIcCgtVSW50MzJWYWx1ZRINCgV2YWx1ZRgBIAEoDSIaCglCb29sVmFsdWUSDQoFdmFsdWUYASABKAgiHAoLU3RyaW5nVmFsdWUSDQoFdmFsdWUYASABKAkiGwoKQnl0ZXNWYWx1ZRINCgV2YWx1ZRgBIAEoDEKDAQoTY29tLmdvb2dsZS5wcm90b2J1ZkINV3JhcHBlcnNQcm90b1ABWjFnb29nbGUuZ29sYW5nLm9yZy9wcm90b2J1Zi90eXBlcy9rbm93bi93cmFwcGVyc3Bi+AEBogIDR1BCqgIeR29vZ2xlLlByb3RvYnVmLldlbGxLbm93blR5cGVzYgZwcm90bzM`),e.DoubleValueSchema=(0,n.messageDesc)(e.file_google_protobuf_wrappers,0),e.FloatValueSchema=(0,n.messageDesc)(e.file_google_protobuf_wrappers,1),e.Int64ValueSchema=(0,n.messageDesc)(e.file_google_protobuf_wrappers,2),e.UInt64ValueSchema=(0,n.messageDesc)(e.file_google_protobuf_wrappers,3),e.Int32ValueSchema=(0,n.messageDesc)(e.file_google_protobuf_wrappers,4),e.UInt32ValueSchema=(0,n.messageDesc)(e.file_google_protobuf_wrappers,5),e.BoolValueSchema=(0,n.messageDesc)(e.file_google_protobuf_wrappers,6),e.StringValueSchema=(0,n.messageDesc)(e.file_google_protobuf_wrappers,7),e.BytesValueSchema=(0,n.messageDesc)(e.file_google_protobuf_wrappers,8)}}),be=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/gen/google/protobuf/compiler/plugin_pb.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.CodeGeneratorResponse_FeatureSchema=e.CodeGeneratorResponse_Feature=e.CodeGeneratorResponse_FileSchema=e.CodeGeneratorResponseSchema=e.CodeGeneratorRequestSchema=e.VersionSchema=e.file_google_protobuf_compiler_plugin=void 0;var t=R(),n=I(),r=P(),i=F();e.file_google_protobuf_compiler_plugin=(0,t.fileDesc)(`CiVnb29nbGUvcHJvdG9idWYvY29tcGlsZXIvcGx1Z2luLnByb3RvEhhnb29nbGUucHJvdG9idWYuY29tcGlsZXIiRgoHVmVyc2lvbhINCgVtYWpvchgBIAEoBRINCgVtaW5vchgCIAEoBRINCgVwYXRjaBgDIAEoBRIOCgZzdWZmaXgYBCABKAkigQIKFENvZGVHZW5lcmF0b3JSZXF1ZXN0EhgKEGZpbGVfdG9fZ2VuZXJhdGUYASADKAkSEQoJcGFyYW1ldGVyGAIgASgJEjgKCnByb3RvX2ZpbGUYDyADKAsyJC5nb29nbGUucHJvdG9idWYuRmlsZURlc2NyaXB0b3JQcm90bxJFChdzb3VyY2VfZmlsZV9kZXNjcmlwdG9ycxgRIAMoCzIkLmdvb2dsZS5wcm90b2J1Zi5GaWxlRGVzY3JpcHRvclByb3RvEjsKEGNvbXBpbGVyX3ZlcnNpb24YAyABKAsyIS5nb29nbGUucHJvdG9idWYuY29tcGlsZXIuVmVyc2lvbiKSAwoVQ29kZUdlbmVyYXRvclJlc3BvbnNlEg0KBWVycm9yGAEgASgJEhoKEnN1cHBvcnRlZF9mZWF0dXJlcxgCIAEoBBIXCg9taW5pbXVtX2VkaXRpb24YAyABKAUSFwoPbWF4aW11bV9lZGl0aW9uGAQgASgFEkIKBGZpbGUYDyADKAsyNC5nb29nbGUucHJvdG9idWYuY29tcGlsZXIuQ29kZUdlbmVyYXRvclJlc3BvbnNlLkZpbGUafwoERmlsZRIMCgRuYW1lGAEgASgJEhcKD2luc2VydGlvbl9wb2ludBgCIAEoCRIPCgdjb250ZW50GA8gASgJEj8KE2dlbmVyYXRlZF9jb2RlX2luZm8YECABKAsyIi5nb29nbGUucHJvdG9idWYuR2VuZXJhdGVkQ29kZUluZm8iVwoHRmVhdHVyZRIQCgxGRUFUVVJFX05PTkUQABIbChdGRUFUVVJFX1BST1RPM19PUFRJT05BTBABEh0KGUZFQVRVUkVfU1VQUE9SVFNfRURJVElPTlMQAkJyChxjb20uZ29vZ2xlLnByb3RvYnVmLmNvbXBpbGVyQgxQbHVnaW5Qcm90b3NaKWdvb2dsZS5nb2xhbmcub3JnL3Byb3RvYnVmL3R5cGVzL3BsdWdpbnBiqgIYR29vZ2xlLlByb3RvYnVmLkNvbXBpbGVy`,[n.file_google_protobuf_descriptor]),e.VersionSchema=(0,r.messageDesc)(e.file_google_protobuf_compiler_plugin,0),e.CodeGeneratorRequestSchema=(0,r.messageDesc)(e.file_google_protobuf_compiler_plugin,1),e.CodeGeneratorResponseSchema=(0,r.messageDesc)(e.file_google_protobuf_compiler_plugin,2),e.CodeGeneratorResponse_FileSchema=(0,r.messageDesc)(e.file_google_protobuf_compiler_plugin,2,0);var a;(function(e){e[e.NONE=0]=`NONE`,e[e.PROTO3_OPTIONAL=1]=`PROTO3_OPTIONAL`,e[e.SUPPORTS_EDITIONS=2]=`SUPPORTS_EDITIONS`})(a||(e.CodeGeneratorResponse_Feature=a={})),e.CodeGeneratorResponse_FeatureSchema=(0,i.enumDesc)(e.file_google_protobuf_compiler_plugin,2,0)}}),xe=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/index.js"(e){var t=e&&e.__createBinding||(Object.create?(function(e,t,n,r){r===void 0&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);(!i||(`get`in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}):(function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]})),n=e&&e.__exportStar||function(e,n){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(n,r)&&t(n,e,r)};Object.defineProperty(e,"__esModule",{value:!0}),n(se(),e),n(le(),e),n(de(),e),n(T(),e),n(B(),e),n(me(),e),n(ge(),e),n(I(),e),n(ce(),e),n(V(),e),n(H(),e),n(U(),e),n(_e(),e),n(fe(),e),n(ve(),e),n(z(),e),n(pe(),e),n(ye(),e),n(be(),e)}}),Se=m({"node_modules/@bufbuild/protobuf/dist/commonjs/extensions.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.getExtension=c,e.setExtension=l,e.clearExtension=u,e.hasExtension=d,e.hasOption=f,e.getOption=p,e.createExtensionContainer=h;var t=E(),n=L(),r=A(),i=S(),a=ue(),o=ee(),s=T();function c(e,t,r){g(t,e);let i=m(e.$unknown,t),[a,s,c]=h(t),l=(0,n.makeReadContext)(r);for(let e of i)(0,n.readField)(a,new o.BinaryReader(e.data),s,e.wireType,l);return c()}function l(e,t,n){g(t,e);let r=(e.$unknown??[]).filter(e=>e.no!==t.number),[i,s]=h(t,n),c=new o.BinaryWriter;(0,a.writeField)(c,{writeUnknownFields:!0},i,s);let l=new o.BinaryReader(c.finish());for(;l.pos<l.len;){let[e,t]=l.tag(),n=l.skip(t,e);r.push({no:e,wireType:t,data:n})}e.$unknown=r}function u(e,t){g(t,e),e.$unknown!==void 0&&(e.$unknown=e.$unknown.filter(e=>e.no!==t.number))}function d(e,t){var n;return t.extendee.typeName===e.$typeName&&!!((n=e.$unknown)!=null&&n.find(e=>e.no===t.number))}function f(e,t){let n=e.proto.options;return n?d(n,t):!1}function p(e,t){let n=e.proto.options;if(!n){let[,,e]=h(t);return e()}return c(n,t)}function m(e,t){if(e===void 0)return[];if(t.fieldKind===`enum`||t.fieldKind===`scalar`){for(let n=e.length-1;n>=0;--n)if(e[n].no==t.number)return[e[n]];return[]}return e.filter(e=>e.no===t.number)}function h(e,n){let a=e.typeName,o=Object.assign(Object.assign({},e),{kind:`field`,parent:e.extendee,localName:a}),c=Object.assign(Object.assign({},e.extendee),{fields:[o],members:[o],oneofs:[]}),l=(0,t.create)(c,n===void 0?void 0:{[a]:n});return[(0,r.reflect)(c,l),o,()=>{let n=l[a];if(n===void 0){let n=e.message;return(0,s.isWrapperDesc)(n)?(0,i.scalarZeroValue)(n.fields[0].scalar,n.fields[0].longAsString):(0,t.create)(n)}return n}]}function g(e,t){if(e.extendee.typeName!=t.$typeName)throw Error(`extension ${e.typeName} can only be applied to message ${e.extendee.typeName}`)}}}),Ce=m({"node_modules/@bufbuild/protobuf/dist/commonjs/equals.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.equals=o;var t=S(),n=A(),r=y(),i=xe(),a=Se();function o(e,t,r,i){return t.$typeName!=e.typeName||r.$typeName!=e.typeName?!1:t===r||s((0,n.reflect)(e,t),(0,n.reflect)(e,r),i)}function s(e,t,n){if(e.desc.typeName===`google.protobuf.Any`&&n?.unpackAny==1)return l(e.message,t.message,n);for(let r of e.fields)if(!c(r,e,t,n))return!1;return!(n?.unknown==1&&!u(e,t,n.registry)||n?.extensions==1&&!d(e,t,n))}function c(e,n,r,i){if(!n.isSet(e)&&!r.isSet(e))return!0;if(!n.isSet(e)||!r.isSet(e))return!1;switch(e.fieldKind){case`scalar`:return(0,t.scalarEquals)(e.scalar,n.get(e),r.get(e));case`enum`:return n.get(e)===r.get(e);case`message`:return s(n.get(e),r.get(e),i);case`map`:{let a=n.get(e),o=r.get(e),c=[];for(let e of a.keys()){if(!o.has(e))return!1;c.push(e)}for(let e of o.keys())if(!a.has(e))return!1;for(let n of c){let r=a.get(n),c=o.get(n);if(r!==c)switch(e.mapKind){case`enum`:return!1;case`message`:if(!s(r,c,i))return!1;break;case`scalar`:if(!(0,t.scalarEquals)(e.scalar,r,c))return!1}}break}case`list`:{let a=n.get(e),o=r.get(e);if(a.size!=o.size)return!1;for(let n=0;n<a.size;n++){let r=a.get(n),c=o.get(n);if(r!==c)switch(e.listKind){case`enum`:return!1;case`message`:if(!s(r,c,i))return!1;break;case`scalar`:if(!(0,t.scalarEquals)(e.scalar,r,c))return!1}}break}}return!0}function l(e,n,a){if(e.typeUrl!==n.typeUrl)return!1;let s=(0,i.anyUnpack)(e,a.registry),c=(0,i.anyUnpack)(n,a.registry);if(s&&c){let e=a.registry.getMessage(s.$typeName);if(e)return o(e,s,c,a)}return(0,t.scalarEquals)(r.ScalarType.BYTES,e.value,n.value)}function u(e,n,i){function a(e,t){let n=e.getUnknown()??[];return t?n.filter(n=>!t.getExtensionFor(e.desc,n.no)):n}let o=a(e,i),s=a(n,i);if(o.length!=s.length)return!1;for(let e=0;e<o.length;e++){let n=o[e],i=s[e];if(n.no!=i.no||n.wireType!=i.wireType||!(0,t.scalarEquals)(r.ScalarType.BYTES,n.data,i.data))return!1}return!0}function d(e,t,n){function r(e,t){return(e.getUnknown()??[]).map(n=>t.getExtensionFor(e.desc,n.no)).filter(e=>e!=null).filter((e,t,n)=>n.indexOf(e)===t)}let i=r(e,n.registry),o=r(t,n.registry);if(i.length!=o.length||i.some(e=>!o.includes(e)))return!1;for(let r of i){let[i,o]=(0,a.createExtensionContainer)(r,(0,a.getExtension)(e.message,r)),[s]=(0,a.createExtensionContainer)(r,(0,a.getExtension)(t.message,r));if(!c(o,i,s,n))return!1}return!0}}}),we=m({"node_modules/@bufbuild/protobuf/dist/commonjs/fields.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.isFieldSet=n,e.clearField=r;var t=C();function n(e,n){return n.parent.typeName==e.$typeName&&(0,t.unsafeIsSet)(e,n)}function r(e,n){n.parent.typeName==e.$typeName&&(0,t.unsafeClear)(e,n)}}}),Te=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wkt/json.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.durationSecondsMax=e.durationSecondsMin=e.timestampMsMax=e.timestampMsMin=void 0,e.timestampMsMin=Date.parse(`0001-01-01T00:00:00Z`),e.timestampMsMax=Date.parse(`9999-12-31T23:59:59Z`),e.durationSecondsMin=-315576e6,e.durationSecondsMax=315576e6}}),Ee=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wire/size-delimited.js"(e){var t=e&&e.__asyncValues||function(e){if(!Symbol.asyncIterator)throw TypeError(`Symbol.asyncIterator is not defined.`);var t=e[Symbol.asyncIterator],n;return t?t.call(e):(e=typeof __values==`function`?__values(e):e[Symbol.iterator](),n={},r(`next`),r(`throw`),r(`return`),n[Symbol.asyncIterator]=function(){return this},n);function r(t){n[t]=e[t]&&function(n){return new Promise(function(r,a){n=e[t](n),i(r,a,n.done,n.value)})}}function i(e,t,n,r){Promise.resolve(r).then(function(t){e({value:t,done:n})},t)}},n=e&&e.__await||function(e){return this instanceof n?(this.v=e,this):new n(e)},r=e&&e.__asyncGenerator||function(e,t,r){if(!Symbol.asyncIterator)throw TypeError(`Symbol.asyncIterator is not defined.`);var i=r.apply(e,t||[]),a,o=[];return a=Object.create((typeof AsyncIterator==`function`?AsyncIterator:Object).prototype),c(`next`),c(`throw`),c(`return`,s),a[Symbol.asyncIterator]=function(){return this},a;function s(e){return function(t){return Promise.resolve(t).then(e,f)}}function c(e,t){i[e]&&(a[e]=function(t){return new Promise(function(n,r){o.push([e,t,n,r])>1||l(e,t)})},t&&(a[e]=t(a[e])))}function l(e,t){try{u(i[e](t))}catch(e){p(o[0][3],e)}}function u(e){e.value instanceof n?Promise.resolve(e.value.v).then(d,f):p(o[0][2],e)}function d(e){l(`next`,e)}function f(e){l(`throw`,e)}function p(e,t){e(t),o.shift(),o.length&&l(o[0][0],o[0][1])}};Object.defineProperty(e,"__esModule",{value:!0}),e.sizeDelimitedEncode=s,e.sizeDelimitedDecodeStream=u,e.sizeDelimitedPeek=d;var i=ue(),a=ee(),o=L();function s(e,t,n){let r=new a.BinaryWriter;return r.bytes((0,i.toBinary)(e,t,n)),r.finish()}var c=67108864,l=class{constructor(){this.buffer=/* @__PURE__ */ new Uint8Array,this.length=0}get byteLength(){return this.length}bytes(){return this.buffer.subarray(0,this.length)}append(e){let t=this.length+e.byteLength;if(t>this.buffer.byteLength){let e=new Uint8Array(Math.max(this.buffer.byteLength*2,t));e.set(this.buffer.subarray(0,this.length)),this.buffer=e}this.buffer.set(e,this.length),this.length+=e.byteLength}};function u(e,i,a){return r(this,arguments,function*(){var r,s,u,f;let p=a?.readMaxBytes??c,m=new l;try{for(var h=!0,g=t(i),_;_=yield n(g.next()),r=_.done,!r;h=!0){f=_.value,h=!1;let t=f;m.append(t);let r=m.bytes(),i=0;for(;;){let t=d(r.subarray(i));if(t.eof)break;if(t.size>p)throw Error(`message size ${t.size} is larger than configured readMaxBytes ${p}`);let s=i+t.offset,c=s+t.size;if(c>r.byteLength)break;yield yield n((0,o.fromBinary)(e,r.subarray(s,c),a)),i=c}i>0&&(m=new l,m.append(r.subarray(i)))}}catch(e){s={error:e}}finally{try{!h&&!r&&(u=g.return)&&(yield n(u.call(g)))}finally{if(s)throw s.error}}if(m.byteLength>0)throw Error(`incomplete data`)})}function d(e){let t={eof:!0,size:null,offset:null};for(let n=0;n<10;n++){if(n>e.byteLength)return t;if(!(e[n]&128)){let n=new a.BinaryReader(e),r;try{r=n.uint32()}catch(e){if(e instanceof RangeError)return t;throw e}return{eof:!1,size:r,offset:n.pos}}}throw Error(`invalid varint`)}}}),De=m({"node_modules/@bufbuild/protobuf/dist/commonjs/wire/index.js"(e){var t=e&&e.__createBinding||(Object.create?(function(e,t,n,r){r===void 0&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);(!i||(`get`in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}):(function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]})),n=e&&e.__exportStar||function(e,n){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(n,r)&&t(n,e,r)};Object.defineProperty(e,"__esModule",{value:!0}),e.configureTextEncoding=e.getTextEncoding=void 0,n(ee(),e),n(M(),e);var r=O();Object.defineProperty(e,"getTextEncoding",{enumerable:!0,get:function(){return r.getTextEncoding}}),Object.defineProperty(e,"configureTextEncoding",{enumerable:!0,get:function(){return r.configureTextEncoding}}),n(ie(),e),n(Ee(),e)}}),Oe=m({"node_modules/@bufbuild/protobuf/dist/commonjs/to-json.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.toJson=_,e.toJsonString=v,e.enumToJson=b;var t=y(),n=ne(),r=xe(),i=T(),a=Te(),o=De(),s=Se(),c=te(),l=D(),u=C(),d=S(),f=k(),p=3,m=2,h={alwaysEmitImplicit:!1,enumAsInteger:!1,useProtoFieldName:!1};function g(e){return e?Object.assign(Object.assign({},h),e):h}function _(e,t,n){return w(e)(g(n),t)}function v(e,t,n){let r=_(e,t,n);return JSON.stringify(r,null,n?.prettySpaces??0)}function b(e,t){if(e.typeName==`google.protobuf.NullValue`)return null;let n=e.value[t]?.name;if(n===void 0)throw Error(`${t} is not a value in ${e}`);return n}var x=/* @__PURE__ */ new WeakMap;function w(e){let t=x.get(e);return t===void 0&&(t=E(e)),t}function E(e){let t=e.typeName,n=O(e);if(n!==void 0){let r=e.fields[0],i=(e,i)=>{if(i.$typeName!==t&&r!==void 0)throw new l.FieldError(r,`cannot use ${r} with message ${i.$typeName}`,`ForeignFieldError`);return n(e,i)};return x.set(e,i),i}let r=e.fields.concat().sort((e,t)=>e.number-t.number),i=r[0],a=[],o=(n,r)=>{if(r.$typeName!==t&&i!==void 0)throw new l.FieldError(i,`cannot use ${i} with message ${r.$typeName}`,`ForeignFieldError`);let o={};for(let e=0;e<a.length;e++)a[e](n,r,o);return n.registry&&R(o,n,n.registry,r,e),o};x.set(e,o);for(let e of r)a.push(ee(e));return o}function O(e){if(e.typeName.startsWith(`google.protobuf.`))switch(e.typeName){case`google.protobuf.Any`:return(e,t)=>z(t,e);case`google.protobuf.Timestamp`:return(e,t)=>de(t);case`google.protobuf.Duration`:return(e,t)=>se(t);case`google.protobuf.FieldMask`:return(e,t)=>ce(t);case`google.protobuf.Struct`:return(e,t)=>le(t);case`google.protobuf.Value`:return(e,t)=>B(t);case`google.protobuf.ListValue`:return(e,t)=>ue(t);default:if((0,i.isWrapperDesc)(e)){let t=e.fields[0],n=t.localName,r=(0,d.scalarZeroValue)(t.scalar,!1),i=I(t);return(e,t)=>{let a=t[n];return i(e,a===void 0?r:a)}}return}}function ee(e){switch(e.fieldKind){case`scalar`:case`enum`:case`message`:return A(e);case`list`:case`map`:{let t=e.fieldKind==`list`?ie(e):oe(e),n=e.name,r=e.jsonName,i=e.localName;return(e,a,o)=>{let s=t(e,a[i]);s!==void 0&&(o[e.useProtoFieldName?n:r]=s)}}}}function A(e){let n=M(e),r=e.name,i=e.jsonName,a=e.localName;if(e.oneof){let t=e.oneof.localName;return(e,o,s)=>{let c=o[t];c.case===a&&(s[e.useProtoFieldName?r:i]=n(e,c.value))}}if(e.presence!=m){let t=e.presence==p?`cannot encode ${e} to JSON: required field not set`:void 0;return(e,o,s)=>{let c=o[a];if(c!==void 0&&Object.prototype.hasOwnProperty.call(o,a))s[e.useProtoFieldName?r:i]=n(e,c);else if(t!==void 0)throw Error(t)}}if(e.fieldKind==`enum`){let t=e.enum.values[0].number;return(e,o,s)=>{let c=o[a];(c!==t||e.alwaysEmitImplicit)&&(s[e.useProtoFieldName?r:i]=n(e,c))}}switch(e.scalar){case t.ScalarType.BOOL:return(e,t,o)=>{let s=t[a];(s!==!1||e.alwaysEmitImplicit)&&(o[e.useProtoFieldName?r:i]=n(e,s))};case t.ScalarType.STRING:return(e,t,o)=>{let s=t[a];(s!==``||e.alwaysEmitImplicit)&&(o[e.useProtoFieldName?r:i]=n(e,s))};case t.ScalarType.BYTES:return(e,t,o)=>{let s=t[a];(!(s instanceof Uint8Array)||s.byteLength>0||e.alwaysEmitImplicit)&&(o[e.useProtoFieldName?r:i]=n(e,s))};case t.ScalarType.DOUBLE:case t.ScalarType.FLOAT:return(e,t,o)=>{let s=t[a];(!Object.is(s,0)||e.alwaysEmitImplicit)&&(o[e.useProtoFieldName?r:i]=n(e,s))};default:return(e,t,o)=>{let s=t[a];(s!=0||e.alwaysEmitImplicit)&&(o[e.useProtoFieldName?r:i]=n(e,s))}}}function j(e){switch(e.fieldKind){case`scalar`:case`enum`:case`message`:return M(e);case`list`:return ie(e);case`map`:return oe(e)}}function M(e){switch(e.fieldKind){case`scalar`:return I(e);case`enum`:return P(e);case`message`:return re(e)}}function re(e){let{toMessage:t}=(0,f.localMessageMapper)(e),n=w(e.message);return(e,r)=>n(e,t(r))}function ie(e){let t=ae(e);return(e,n)=>{let r=n;if(r.length==0&&!e.alwaysEmitImplicit)return;let i=[];for(let n=0;n<r.length;n++)i.push(t(e,r[n]));return i}}function ae(e){switch(e.listKind){case`scalar`:return I(e);case`enum`:return P(e);case`message`:return re(e)}}function oe(e){let t=N(e);return(e,n)=>{let r=n,i=Object.keys(r);if(i.length==0&&!e.alwaysEmitImplicit)return;let a={};for(let n=0;n<i.length;n++){let o=i[n];a[o]=t(e,r[o])}return a}}function N(e){switch(e.mapKind){case`scalar`:return I(e);case`enum`:return P(e);case`message`:return re(e)}}function P(e){let t=e.enum;return t.typeName==`google.protobuf.NullValue`?(e,n)=>{if(typeof n!=`number`)throw F(t,n);return null}:(e,n)=>{if(typeof n!=`number`)throw F(t,n);return e.enumAsInteger?n:t.value[n]?.name??n}}function F(e,t){return/* @__PURE__ */ Error(`cannot encode ${e} to JSON: expected number, got ${(0,c.formatVal)(t)}`)}function I(e){switch(e.scalar){case t.ScalarType.INT32:case t.ScalarType.SFIXED32:case t.ScalarType.SINT32:case t.ScalarType.FIXED32:case t.ScalarType.UINT32:return(t,n)=>{if(typeof n!=`number`)throw L(e,n);return n};case t.ScalarType.FLOAT:case t.ScalarType.DOUBLE:return(t,n)=>{if(typeof n!=`number`)throw L(e,n);return Number.isNaN(n)?`NaN`:n===1/0?`Infinity`:n===-1/0?`-Infinity`:n};case t.ScalarType.STRING:return(t,n)=>{if(typeof n!=`string`)throw L(e,n);return n};case t.ScalarType.BOOL:return(t,n)=>{if(typeof n!=`boolean`)throw L(e,n);return n};case t.ScalarType.UINT64:case t.ScalarType.FIXED64:case t.ScalarType.INT64:case t.ScalarType.SFIXED64:case t.ScalarType.SINT64:return(t,n)=>{if(typeof n==`bigint`||typeof n==`string`||typeof n==`number`&&Number.isInteger(n))return n.toString();throw L(e,n)};case t.ScalarType.BYTES:return(t,n)=>{if(n instanceof Uint8Array)return(0,o.base64Encode)(n);throw L(e,n)}}}function L(e,t){return/* @__PURE__ */ Error(`cannot encode ${e} to JSON: ${(0,c.checkField)(e,t)?.message}`)}function R(e,t,n,r,i){let a=r.$unknown;if(a===void 0)return;let o=/* @__PURE__ */ new Set;for(let c=0;c<a.length;c++){let{no:l}=a[c];if(!o.has(l)){o.add(l);let a=n.getExtensionFor(i,l);if(!a)continue;let c=(0,s.getExtension)(r,a),[d,f]=(0,s.createExtensionContainer)(a,c),p=d[u.unsafeLocal],m=j(f)(t,p[f.localName]);m!==void 0&&(e[a.jsonName]=m)}}}function z(e,t){if(e.typeUrl===``)return{};let{registry:n}=t,a,o;if(n&&(a=(0,r.anyUnpack)(e,n),a&&(o=n.getMessage(a.$typeName))),!o||!a)throw Error(`cannot encode message ${e.$typeName} to JSON: "${e.typeUrl}" is not in the type registry`);let s=(0,i.hasCustomJsonRepresentation)(o)?{value:w(o)(t,a)}:w(o)(t,a);return s[`@type`]=e.typeUrl,s}function se(e){let t=Number(e.seconds),n=e.nanos;if(t>a.durationSecondsMax||t<a.durationSecondsMin)throw Error(`cannot encode message ${e.$typeName} to JSON: value out of range`);if(t>0&&n<0||t<0&&n>0)throw Error(`cannot encode message ${e.$typeName} to JSON: nanos sign must match seconds sign`);let r=e.seconds.toString();if(n!==0){let e=Math.abs(n).toString();e=`0`.repeat(9-e.length)+e,e.substring(3)===`000000`?e=e.substring(0,3):e.substring(6)===`000`&&(e=e.substring(0,6)),r+=`.`+e,n<0&&t==0&&(r=`-`+r)}return r+`s`}function ce(e){return e.paths.map(t=>{if((0,n.protoSnakeCase)((0,n.protoCamelCase)(t))!==t)throw Error(`cannot encode message ${e.$typeName} to JSON: lowerCamelCase of path name "${t}" is irreversible`);return(0,n.protoCamelCase)(t)}).join(`,`)}function le(e){let t={},n=Object.keys(e.fields);for(let r=0;r<n.length;r++){let i=n[r];t[i]=B(e.fields[i])}return t}function B(e){switch(e.kind.case){case`nullValue`:return null;case`numberValue`:if(!Number.isFinite(e.kind.value))throw Error(`${e.$typeName} cannot be NaN or Infinity`);return e.kind.value;case`boolValue`:return e.kind.value;case`stringValue`:return e.kind.value;case`structValue`:return le(e.kind.value);case`listValue`:return ue(e.kind.value);default:throw Error(`${e.$typeName} must have a value`)}}function ue(e){return e.values.map(B)}function de(e){let t=Number(e.seconds)*1e3;if(t<a.timestampMsMin||t>a.timestampMsMax)throw Error(`cannot encode message ${e.$typeName} to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);if(e.nanos<0)throw Error(`cannot encode message ${e.$typeName} to JSON: nanos must not be negative`);if(e.nanos>999999999)throw Error(`cannot encode message ${e.$typeName} to JSON: nanos must not be greater than 99999999`);let n=`Z`;if(e.nanos>0){let t=(e.nanos+1e9).toString().substring(1);n=t.substring(3)===`000000`?`.`+t.substring(0,3)+`Z`:t.substring(6)===`000`?`.`+t.substring(0,6)+`Z`:`.`+t+`Z`}return new Date(t).toISOString().replace(`.000Z`,n)}}}),ke=m({"node_modules/@bufbuild/protobuf/dist/commonjs/from-json.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.fromJsonString=g,e.mergeFromJsonString=_,e.fromJson=v,e.mergeFromJson=b,e.enumFromJson=T,e.isEnumJson=O;var t=y(),n=x(),r=E(),i=D(),a=te(),o=ne(),s=S(),c=C(),l=k(),u=M(),d=xe(),f=Se(),p=Te(),m=2;function h(e){return Object.assign(Object.assign({ignoreUnknownFields:!1,recursionLimit:100},e),{depth:0})}function g(e,t,n){return v(e,fe(t,e.typeName),n)}function _(e,t,n,r){return b(e,t,fe(n,e.typeName),r)}function v(e,t,n){let i=(0,r.create)(e);return w(e,i,t,n),i}function b(e,t,n,r){if(t.$typeName!==e.typeName&&e.fields.length>0)throw new i.FieldError(e.fields[0],`cannot use ${e.fields[0]} with message ${t.$typeName}`,`ForeignFieldError`);return w(e,t,n,r),t}function w(e,t,n,r){try{A(e)(t,n,h(r))}catch(e){throw(0,i.isFieldError)(e)?Error(`cannot decode ${e.field()} from JSON: ${e.message}`,{cause:e}):e}}function T(e,t){return z(e)(t,!1)}function O(e,t){return e.values.find(e=>e.name===t)!==void 0}var ee=/* @__PURE__ */ new WeakMap;function A(e){let t=ee.get(e);return t===void 0&&(t=j(e)),t}function j(e){let t=String(e),n=re(e);if(n!==void 0){let r=(e,r,i)=>{if(++i.depth>i.recursionLimit)throw Error(`cannot decode ${t} from JSON: maximum recursion depth of ${i.recursionLimit} reached`);n(e,r,i),i.depth--};return ee.set(e,r),r}let r=e.typeName,o=/* @__PURE__ */ new Map,s=(e,n,s)=>{if(++s.depth>s.recursionLimit)throw Error(`cannot decode ${t} from JSON: maximum recursion depth of ${s.recursionLimit} reached`);if(n==null||Array.isArray(n)||typeof n!=`object`)throw Error(`cannot decode ${t} from JSON: ${(0,a.formatVal)(n)}`);let l=/* @__PURE__ */ new Map,u=/* @__PURE__ */ new Set,d=Object.keys(n);for(let a=0;a<d.length;a++){let p=d[a],m=n[p],h=o.get(p);if(h!==void 0){let t=h.field;if(u.has(t))throw new i.FieldError(t,`set multiple times`);if(u.add(t),h.oneofScalarNullSkip&&m===null)continue;if(h.oneof){let e=l.get(h.oneof);if(e!==void 0)throw new i.FieldError(h.oneof,`oneof set multiple times by ${e.name} and ${t.name}`);l.set(h.oneof,t)}h.read(e,m,s)}else{let n=p.startsWith(`[`)&&p.endsWith(`]`)?s.registry?.getExtension(p.substring(1,p.length-1)):void 0;if(n?.extendee.typeName==r){let[t,r,i]=(0,f.createExtensionContainer)(n);ie(r)(t[c.unsafeLocal],m,s),(0,f.setExtension)(e,n,i())}if(n===void 0&&!s.ignoreUnknownFields)throw Error(`cannot decode ${t} from JSON: key "${p}" is unknown`)}}s.depth--};ee.set(e,s);for(let t of e.fields){let e={read:ie(t),field:t,oneof:t.oneof,oneofScalarNullSkip:t.oneof!==void 0&&t.fieldKind==`scalar`};o.set(t.name,e).set(t.jsonName,e)}return s}function re(e){if(e.typeName.startsWith(`google.protobuf.`))switch(e.typeName){case`google.protobuf.Any`:return(e,t,n)=>me(e,t,n);case`google.protobuf.Timestamp`:return(e,t)=>he(e,t);case`google.protobuf.Duration`:return(e,t)=>ge(e,t);case`google.protobuf.FieldMask`:return(e,t)=>V(e,t);case`google.protobuf.Struct`:return(e,t,n)=>H(e,t,n);case`google.protobuf.Value`:return(e,t,n)=>U(e,t,n);case`google.protobuf.ListValue`:return(e,t,n)=>_e(e,t,n);default:if((0,d.isWrapperDesc)(e)){let t=e.fields[0],n=t.localName,r=t.scalar,i=t.longAsString,a=ce(t);return(e,t)=>{t===null?e[n]=(0,s.scalarZeroValue)(r,i):e[n]=a(t)}}return}}function ie(e){switch(e.fieldKind){case`scalar`:return ae(e);case`enum`:return N(e);case`message`:return P(e);case`list`:return F(e);case`map`:return L(e)}}function ae(e){let t=ce(e),n=e.localName;if(e.oneof){let r=e.oneof.localName;return(e,i)=>{e[r]={case:n,value:t(i)}}}let r=oe(e);return(e,i)=>{i===null?r(e):e[n]=t(i)}}function oe(e){let t=e.localName;if(e.presence!=m)return e=>{delete e[t]};if(e.fieldKind==`enum`){let n=e.enum.values[0].number;return e=>{e[t]=n}}let n=e.scalar,r=e.longAsString;return e=>{e[t]=(0,s.scalarZeroValue)(n,r)}}function N(e){let t=z(e.enum),n=se(e.enum),r=e.localName,o=e.enum.typeName!=`google.protobuf.NullValue`;if(e.oneof){let s=e.oneof.localName;return(c,l,u)=>{if(l===null&&o){c[s].case===r&&(c[s]={case:void 0});return}let d=t(l,u.ignoreUnknownFields);if(d===R)return;let f=n(d);if(f!==!0)throw new i.FieldError(e,(0,a.reasonSingular)(e,d,f));c[s]={case:r,value:d}}}let s=oe(e);return(c,l,u)=>{if(l===null&&o){s(c);return}let d=t(l,u.ignoreUnknownFields);if(d===R)return;let f=n(d);if(f!==!0)throw new i.FieldError(e,(0,a.reasonSingular)(e,d,f));c[r]=d}}function P(e){let t=e.localName,{toMessage:n,toLocal:r}=(0,l.localMessageMapper)(e),i=A(e.message),a=e.message.typeName!=`google.protobuf.Value`;if(e.oneof){let o=e.oneof.localName;return(e,s,c)=>{let l=e[o];if(s===null&&a){l.case===t&&(e[o]={case:void 0});return}let u=n(l.case===t?l.value:void 0);i(u,s,c),e[o]={case:t,value:r(u)}}}return(e,o,s)=>{if(o===null&&a){delete e[t];return}let c=n(e[t]);i(c,o,s),e[t]=r(c)}}function F(e){let t=e.localName,n=I(e);return(r,o,s)=>{if(o===null)return;if(!Array.isArray(o))throw new i.FieldError(e,`expected Array, got `+(0,a.formatVal)(o));let c=r[t];for(let e=0;e<o.length;e++){let t=n(o[e],s,c.length);t!==R&&c.push(t)}}}function I(e){switch(e.listKind){case`scalar`:{let t=le(e),n=(0,a.checkScalarValue)(e.scalar),r=B(e);return(o,s,c)=>{if(o===null)throw new i.FieldError(e,`list item must not be null`);let l=t(o),u=n(l);if(u!==!0)throw new i.FieldError(e,`list item #${c+1}: ${(0,a.reasonSingular)(e,l,u)}`);return r(l)}}case`enum`:{let t=z(e.enum),n=se(e.enum),r=e.enum.typeName!=`google.protobuf.NullValue`;return(o,s,c)=>{if(o===null&&r)throw new i.FieldError(e,`list item must not be null`);let l=t(o,s.ignoreUnknownFields);if(l===R)return l;let u=n(l);if(u!==!0)throw new i.FieldError(e,`list item #${c+1}: ${(0,a.reasonSingular)(e,l,u)}`);return l}}case`message`:{let{toMessage:t,toLocal:n}=(0,l.localMessageMapper)(e),r=A(e.message),a=e.message.typeName!=`google.protobuf.Value`;return(o,s)=>{if(o===null&&a)throw new i.FieldError(e,`list item must not be null`);let c=t(void 0);return r(c,o,s),n(c)}}}}function L(e){let t=e.localName,n=e.mapKey,r=ue(n),o=(0,a.checkScalarValue)(n),s,c,u=e=>e,d=!0;switch(e.mapKind){case`scalar`:s=le(e),c=(0,a.checkScalarValue)(e.scalar),u=B(e);break;case`enum`:{let t=z(e.enum);s=(e,n)=>t(e,n.ignoreUnknownFields),c=se(e.enum),d=e.enum.typeName!=`google.protobuf.NullValue`;break}case`message`:{let{toMessage:t,toLocal:n}=(0,l.localMessageMapper)(e),r=A(e.message);d=e.message.typeName!=`google.protobuf.Value`,s=(e,i)=>{let a=t(void 0);return r(a,e,i),n(a)};break}}return(l,f,p)=>{if(f===null)return;if(typeof f!=`object`||Array.isArray(f))throw new i.FieldError(e,`expected object, got `+(0,a.formatVal)(f));let m=l[t],h=/* @__PURE__ */ new Set,g=Object.keys(f);for(let t=0;t<g.length;t++){let l=g[t],_=f[l],v=r(l);if(h.has(v))throw new i.FieldError(e,`duplicate map key "${l}"`);if(h.add(v),_===null&&d)throw new i.FieldError(e,`map value must not be null`);let y=s(_,p);if(y===R)continue;let b=o(v);if(b!==!0)throw new i.FieldError(e,`invalid map key: ${(0,a.reasonSingular)({scalar:n},v,b)}`);if(c!==void 0){let t=c(y);if(t!==!0)throw new i.FieldError(e,`map entry ${(0,a.formatVal)(v)}: ${(0,a.reasonSingular)(e,y,t)}`)}m[v]=u(y)}}}var R=/* @__PURE__ */ Symbol();function z(e){let t=e.values[0].number,n=e.values;return(r,i)=>{if(r===null)return t;switch(typeof r){case`number`:if(Number.isInteger(r))return r;break;case`string`:{let e=n.find(e=>e.name===r);if(e!==void 0)return e.number;if(i)return R;break}}throw Error(`cannot decode ${e} from JSON: ${(0,a.formatVal)(r)}`)}}function se(e){if(e.open)return(0,a.checkScalarValue)(t.ScalarType.INT32);let n=e.values;return e=>n.some(t=>t.number===e)}function ce(e){let t=le(e),n=(0,a.checkScalarValue)(e.scalar),r=B(e);return o=>{let s=t(o),c=n(s);if(c!==!0)throw new i.FieldError(e,(0,a.reasonSingular)(e,s,c));return r(s)}}function le(e){switch(e.scalar){case t.ScalarType.DOUBLE:case t.ScalarType.FLOAT:return t=>{if(t===`NaN`)return NaN;if(t===`Infinity`)return 1/0;if(t===`-Infinity`)return-1/0;if(typeof t==`number`){if(Number.isNaN(t))throw new i.FieldError(e,`unexpected NaN number`);if(!Number.isFinite(t))throw new i.FieldError(e,`unexpected infinite number`);return t}if(typeof t==`string`){if(t===``||t.trim().length!==t.length)return t;let e=Number(t);return Number.isFinite(e)?e:t}return t};case t.ScalarType.INT32:case t.ScalarType.FIXED32:case t.ScalarType.SFIXED32:case t.ScalarType.SINT32:case t.ScalarType.UINT32:return de;case t.ScalarType.BYTES:return t=>{if(typeof t==`string`){if(t===``)return/* @__PURE__ */ new Uint8Array;try{return(0,u.base64Decode)(t)}catch(t){let n=t instanceof Error?t.message:String(t);throw new i.FieldError(e,n)}}return t};default:return e=>e}}function B(e){let r=e.fieldKind!==`map`&&e.longAsString;switch(e.scalar){case t.ScalarType.INT64:case t.ScalarType.SFIXED64:case t.ScalarType.SINT64:return r?e=>String(e):e=>typeof e==`string`||typeof e==`number`?n.protoInt64.parse(e):e;case t.ScalarType.FIXED64:case t.ScalarType.UINT64:return r?e=>String(e):e=>typeof e==`string`||typeof e==`number`?n.protoInt64.uParse(e):e;default:return e=>e}}function ue(e){switch(e){case t.ScalarType.BOOL:return e=>{switch(e){case`true`:return!0;case`false`:return!1}return e};case t.ScalarType.INT32:case t.ScalarType.FIXED32:case t.ScalarType.UINT32:case t.ScalarType.SFIXED32:case t.ScalarType.SINT32:return de;case t.ScalarType.INT64:case t.ScalarType.SINT64:case t.ScalarType.SFIXED64:case t.ScalarType.UINT64:case t.ScalarType.FIXED64:return e=>/^-?0+$/.test(e)?`0`:e.replace(/^(-?)0+(?=\d)/,`$1`);default:return e=>e}}function de(e){if(typeof e==`string`){if(e===``||e.trim().length!==e.length)return e;let t=Number(e);return Number.isNaN(t)?e:t}return e}function fe(e,t){let n;try{n=JSON.parse(e)}catch(e){let n=e instanceof Error?e.message:String(e);throw Error(`cannot decode message ${t} from JSON: ${n}`,{cause:e})}return pe(e,t),n}function pe(e,t){let n=[],r=!1,i=0;for(;i<e.length;)switch(e[i]){case`{`:n.push(/* @__PURE__ */ new Set),r=!0,i++;break;case`[`:n.push(null),r=!1,i++;break;case`}`:case`]`:n.pop(),r=!1,i++;break;case`,`:r=n[n.length-1]!=null,i++;break;case`:`:r=!1,i++;break;case`"`:{let a=i++,o=!1;for(;i<e.length;)if(e[i]==`\\`)o=!0,i+=2;else{if(e[i]==`"`)break;i++}let s=i++,c=n[n.length-1];if(r&&c){let n=o?JSON.parse(e.substring(a,s+1)):e.substring(a+1,s);if(c.has(n))throw Error(`cannot decode message ${t} from JSON: duplicate object key "${n}"`);c.add(n)}r=!1;break}default:i++}}function me(e,t,n){if(t===null||Array.isArray(t)||typeof t!=`object`)throw Error(`cannot decode message ${e.$typeName} from JSON: expected object but got ${(0,a.formatVal)(t)}`);if(Object.keys(t).length==0)return;let i=t[`@type`];if(typeof i!=`string`||i==``)throw Error(`cannot decode message ${e.$typeName} from JSON: "@type" is empty`);let o=i.includes(`/`)?i.substring(i.lastIndexOf(`/`)+1):i;if(!o.length)throw Error(`cannot decode message ${e.$typeName} from JSON: "@type" is invalid`);let s=n.registry?.getMessage(o);if(!s)throw Error(`cannot decode message ${e.$typeName} from JSON: ${i} is not in the type registry`);let c=(0,r.create)(s);if((0,d.hasCustomJsonRepresentation)(s)&&Object.prototype.hasOwnProperty.call(t,`value`))A(s)(c,t.value,n);else{let e=Object.assign({},t);delete e[`@type`],A(s)(c,e,n)}(0,d.anyPack)(s,c,e)}function he(e,t){if(typeof t!=`string`)throw Error(`cannot decode message ${e.$typeName} from JSON: ${(0,a.formatVal)(t)}`);let r=t.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:\.([0-9]{1,9}))?(?:Z|([+-][0-9][0-9]:[0-9][0-9]))$/);if(!r)throw Error(`cannot decode message ${e.$typeName} from JSON: invalid RFC 3339 string`);let i=Date.parse(r[1]+`-`+r[2]+`-`+r[3]+`T`+r[4]+`:`+r[5]+`:`+r[6]+(r[8]?r[8]:`Z`));if(Number.isNaN(i))throw Error(`cannot decode message ${e.$typeName} from JSON: invalid RFC 3339 string`);if(i<p.timestampMsMin||i>p.timestampMsMax)throw Error(`cannot decode message ${e.$typeName} from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);e.seconds=n.protoInt64.parse(i/1e3),e.nanos=0,r[7]&&(e.nanos=parseInt(`1`+r[7]+`0`.repeat(9-r[7].length))-1e9)}function ge(e,t){if(typeof t!=`string`)throw Error(`cannot decode message ${e.$typeName} from JSON: ${(0,a.formatVal)(t)}`);let r=t.match(/^(-?[0-9]+)(?:\.([0-9]+))?s/);if(r===null)throw Error(`cannot decode message ${e.$typeName} from JSON: ${(0,a.formatVal)(t)}`);let i=Number(r[1]);if(i>p.durationSecondsMax||i<p.durationSecondsMin)throw Error(`cannot decode message ${e.$typeName} from JSON: ${(0,a.formatVal)(t)}`);if(e.seconds=n.protoInt64.parse(i),typeof r[2]!=`string`)return;let o=r[2]+`0`.repeat(9-r[2].length);e.nanos=parseInt(o),(i<0||Object.is(i,-0))&&(e.nanos=-e.nanos)}function V(e,t){if(typeof t!=`string`)throw Error(`cannot decode message ${e.$typeName} from JSON: ${(0,a.formatVal)(t)}`);t!==``&&(e.paths=t.split(`,`).map(t=>{if(t.includes(`_`))throw Error(`cannot decode message ${e.$typeName} from JSON: path names must be lowerCamelCase`);return(0,o.protoSnakeCase)(t)}))}function H(e,t,n){if(typeof t!=`object`||!t||Array.isArray(t))throw Error(`cannot decode message ${e.$typeName} from JSON ${(0,a.formatVal)(t)}`);let i=Object.keys(t);for(let a=0;a<i.length;a++){let o=i[a],s=(0,r.create)(d.ValueSchema);U(s,t[o],n),e.fields[o]=s}}function U(e,t,n){if(++n.depth>n.recursionLimit)throw Error(`cannot decode ${e.$typeName} from JSON: maximum recursion depth of ${n.recursionLimit} reached`);switch(typeof t){case`number`:e.kind={case:`numberValue`,value:t};break;case`string`:e.kind={case:`stringValue`,value:t};break;case`boolean`:e.kind={case:`boolValue`,value:t};break;case`object`:if(t===null)e.kind={case:`nullValue`,value:d.NullValue.NULL_VALUE};else if(Array.isArray(t)){let i=(0,r.create)(d.ListValueSchema);_e(i,t,n),e.kind={case:`listValue`,value:i}}else{let i=(0,r.create)(d.StructSchema);H(i,t,n),e.kind={case:`structValue`,value:i}}break;default:throw Error(`cannot decode message ${e.$typeName} from JSON ${(0,a.formatVal)(t)}`)}return n.depth--,e}function _e(e,t,n){if(!Array.isArray(t))throw Error(`cannot decode message ${e.$typeName} from JSON ${(0,a.formatVal)(t)}`);for(let i=0;i<t.length;i++){let a=(0,r.create)(d.ValueSchema);U(a,t[i],n),e.values.push(a)}}}}),W=m({"node_modules/@bufbuild/protobuf/dist/commonjs/merge.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.merge=n;var t=A();function n(e,n,i){r((0,t.reflect)(e,n),(0,t.reflect)(e,i))}function r(e,t){var n;let i=t.message.$unknown;i!==void 0&&i.length>0&&((n=e.message).$unknown??(n.$unknown=[]),e.message.$unknown.push(...i));for(let n of e.fields)if(t.isSet(n))switch(n.fieldKind){case`scalar`:case`enum`:e.set(n,t.get(n));break;case`message`:e.isSet(n)?r(e.get(n),t.get(n)):e.set(n,t.get(n));break;case`list`:let i=e.get(n);for(let e of t.get(n))i.add(e);break;case`map`:let a=e.get(n);for(let[e,r]of t.get(n))a.set(e,r)}}}}),Ae=m({"node_modules/@bufbuild/protobuf/dist/commonjs/unknown-enum.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.isUnknownEnum=t;function t(e,t){return e.value[t]===void 0}}}),je=m({"node_modules/@bufbuild/protobuf/dist/commonjs/index.js"(e){var t=e&&e.__createBinding||(Object.create?(function(e,t,n,r){r===void 0&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);(!i||(`get`in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}):(function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]})),n=e&&e.__exportStar||function(e,n){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(n,r)&&t(n,e,r)};Object.defineProperty(e,"__esModule",{value:!0}),e.getOption=e.hasOption=e.clearExtension=e.setExtension=e.getExtension=e.hasExtension=e.mergeFromBinary=e.fromBinary=e.toBinary=void 0,n(_(),e),n(v(),e),n(E(),e),n(j(),e),n(y(),e),n(Ce(),e),n(we(),e),n(oe(),e);var r=ue();Object.defineProperty(e,"toBinary",{enumerable:!0,get:function(){return r.toBinary}});var i=L();Object.defineProperty(e,"fromBinary",{enumerable:!0,get:function(){return i.fromBinary}}),Object.defineProperty(e,"mergeFromBinary",{enumerable:!0,get:function(){return i.mergeFromBinary}}),n(Oe(),e),n(ke(),e),n(W(),e);var a=Se();Object.defineProperty(e,"hasExtension",{enumerable:!0,get:function(){return a.hasExtension}}),Object.defineProperty(e,"getExtension",{enumerable:!0,get:function(){return a.getExtension}}),Object.defineProperty(e,"setExtension",{enumerable:!0,get:function(){return a.setExtension}}),Object.defineProperty(e,"clearExtension",{enumerable:!0,get:function(){return a.clearExtension}}),Object.defineProperty(e,"hasOption",{enumerable:!0,get:function(){return a.hasOption}}),Object.defineProperty(e,"getOption",{enumerable:!0,get:function(){return a.getOption}}),n(x(),e),n(Ae(),e)}}),Me=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/embed.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.embedFileDesc=s,e.pathInFileDesc=l,e.createFileDescriptorProtoBoot=u;var t=ne(),n=we(),r=M(),i=ue(),a=j(),o=I();function s(e){let t={bootable:!1,proto(){let t=(0,a.clone)(o.FileDescriptorProtoSchema,e);return(0,n.clearField)(t,o.FileDescriptorProtoSchema.field.dependency),(0,n.clearField)(t,o.FileDescriptorProtoSchema.field.sourceCodeInfo),t.messageType.map(c),t},base64(){let e=(0,i.toBinary)(o.FileDescriptorProtoSchema,this.proto());return(0,r.base64Encode)(e,`std_raw`)}};return e.name==`google/protobuf/descriptor.proto`?Object.assign(Object.assign({},t),{bootable:!0,boot(){return u(this.proto())}}):t}function c(e){for(let r of e.field)r.jsonName===(0,t.protoCamelCase)(r.name)&&(0,n.clearField)(r,o.FieldDescriptorProtoSchema.field.jsonName);for(let t of e.nestedType)c(t)}function l(e){if(e.kind==`service`)return[e.file.services.indexOf(e)];let t=e.parent;if(t==null)switch(e.kind){case`enum`:return[e.file.enums.indexOf(e)];case`message`:return[e.file.messages.indexOf(e)];case`extension`:return[e.file.extensions.indexOf(e)]}function n(e){let t=[];for(let n=e.parent;n;){let r=n.nestedMessages.indexOf(e);t.unshift(r),e=n,n=e.parent}return t.unshift(e.file.messages.indexOf(e)),t}let r=n(t);switch(e.kind){case`extension`:return[...r,t.nestedExtensions.indexOf(e)];case`message`:return[...r,t.nestedMessages.indexOf(e)];case`enum`:return[...r,t.nestedEnums.indexOf(e)]}}function u(e){var t;return h(e.name==`google/protobuf/descriptor.proto`),h(e.package==`google.protobuf`),h(!e.dependency.length),h(!e.publicDependency.length),h(!e.weakDependency.length),h(!e.optionDependency.length),h(!e.service.length),h(!e.extension.length),h(e.sourceCodeInfo===void 0),h(e.syntax==``||e.syntax==`proto2`),h(!((t=e.options)!=null&&t.features)),h(e.edition===o.Edition.EDITION_UNKNOWN),{name:e.name,package:e.package,messageType:e.messageType.map(d),enumType:e.enumType.map(m)}}function d(e){h(e.extension.length==0),h(!e.oneofDecl.length),h(!e.options),h(!(0,n.isFieldSet)(e,o.DescriptorProtoSchema.field.visibility));let t={name:e.name};return e.field.length&&(t.field=e.field.map(f)),e.nestedType.length&&(t.nestedType=e.nestedType.map(d)),e.enumType.length&&(t.enumType=e.enumType.map(m)),e.extensionRange.length&&(t.extensionRange=e.extensionRange.map(e=>(h(!e.options),{start:e.start,end:e.end}))),t}function f(e){h((0,n.isFieldSet)(e,o.FieldDescriptorProtoSchema.field.name)),h((0,n.isFieldSet)(e,o.FieldDescriptorProtoSchema.field.number)),h((0,n.isFieldSet)(e,o.FieldDescriptorProtoSchema.field.type)),h(!(0,n.isFieldSet)(e,o.FieldDescriptorProtoSchema.field.oneofIndex)),h(!(0,n.isFieldSet)(e,o.FieldDescriptorProtoSchema.field.jsonName)||e.jsonName===(0,t.protoCamelCase)(e.name));let r={name:e.name,number:e.number,type:e.type};return(0,n.isFieldSet)(e,o.FieldDescriptorProtoSchema.field.label)&&(r.label=e.label),(0,n.isFieldSet)(e,o.FieldDescriptorProtoSchema.field.typeName)&&(r.typeName=e.typeName),(0,n.isFieldSet)(e,o.FieldDescriptorProtoSchema.field.extendee)&&(r.extendee=e.extendee),(0,n.isFieldSet)(e,o.FieldDescriptorProtoSchema.field.defaultValue)&&(r.defaultValue=e.defaultValue),e.options&&(r.options=p(e.options)),r}function p(e){let t={};return h(!(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.ctype)),(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.packed)&&(t.packed=e.packed),h(!(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.jstype)),h(!(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.lazy)),h(!(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.unverifiedLazy)),(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.deprecated)&&(t.deprecated=e.deprecated),h(!(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.weak)),h(!(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.debugRedact)),(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.retention)&&(t.retention=e.retention),e.targets.length&&(t.targets=e.targets),e.editionDefaults.length&&(t.editionDefaults=e.editionDefaults.map(e=>({value:e.value,edition:e.edition}))),h(!(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.features)),h(!(0,n.isFieldSet)(e,o.FieldOptionsSchema.field.uninterpretedOption)),t}function m(e){return h(!e.options),h(!(0,n.isFieldSet)(e,o.EnumDescriptorProtoSchema.field.visibility)),{name:e.name,value:e.value.map(e=>(h(!e.options),{name:e.name,number:e.number}))}}function h(e){if(!e)throw Error()}}}),Ne=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/service.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.serviceDesc=t;function t(e,t,...n){if(n.length>0)throw Error();return e.services[t]}}}),Pe=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/symbols.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.symbols=e.wktPublicImportPaths=e.packageName=void 0,e.packageName=`@bufbuild/protobuf`,e.wktPublicImportPaths={"google/protobuf/compiler/plugin.proto":e.packageName+`/wkt`,"google/protobuf/any.proto":e.packageName+`/wkt`,"google/protobuf/api.proto":e.packageName+`/wkt`,"google/protobuf/cpp_features.proto":e.packageName+`/wkt`,"google/protobuf/descriptor.proto":e.packageName+`/wkt`,"google/protobuf/duration.proto":e.packageName+`/wkt`,"google/protobuf/empty.proto":e.packageName+`/wkt`,"google/protobuf/field_mask.proto":e.packageName+`/wkt`,"google/protobuf/go_features.proto":e.packageName+`/wkt`,"google/protobuf/java_features.proto":e.packageName+`/wkt`,"google/protobuf/source_context.proto":e.packageName+`/wkt`,"google/protobuf/struct.proto":e.packageName+`/wkt`,"google/protobuf/timestamp.proto":e.packageName+`/wkt`,"google/protobuf/type.proto":e.packageName+`/wkt`,"google/protobuf/wrappers.proto":e.packageName+`/wkt`},e.symbols={isMessage:{typeOnly:!1,bootstrapWktFrom:`../../is-message.js`,from:e.packageName},Message:{typeOnly:!0,bootstrapWktFrom:`../../types.js`,from:e.packageName},create:{typeOnly:!1,bootstrapWktFrom:`../../create.js`,from:e.packageName},fromJson:{typeOnly:!1,bootstrapWktFrom:`../../from-json.js`,from:e.packageName},fromJsonString:{typeOnly:!1,bootstrapWktFrom:`../../from-json.js`,from:e.packageName},fromBinary:{typeOnly:!1,bootstrapWktFrom:`../../from-binary.js`,from:e.packageName},toBinary:{typeOnly:!1,bootstrapWktFrom:`../../to-binary.js`,from:e.packageName},toJson:{typeOnly:!1,bootstrapWktFrom:`../../to-json.js`,from:e.packageName},toJsonString:{typeOnly:!1,bootstrapWktFrom:`../../to-json.js`,from:e.packageName},protoInt64:{typeOnly:!1,bootstrapWktFrom:`../../proto-int64.js`,from:e.packageName},JsonValue:{typeOnly:!0,bootstrapWktFrom:`../../json-value.js`,from:e.packageName},JsonObject:{typeOnly:!0,bootstrapWktFrom:`../../json-value.js`,from:e.packageName},UnknownEnum:{typeOnly:!0,bootstrapWktFrom:`../../types.js`,from:e.packageName},codegen:{boot:{typeOnly:!1,bootstrapWktFrom:`../../codegenv2/boot.js`,from:e.packageName+`/codegenv2`},fileDesc:{typeOnly:!1,bootstrapWktFrom:`../../codegenv2/file.js`,from:e.packageName+`/codegenv2`},enumDesc:{typeOnly:!1,bootstrapWktFrom:`../../codegenv2/enum.js`,from:e.packageName+`/codegenv2`},extDesc:{typeOnly:!1,bootstrapWktFrom:`../../codegenv2/extension.js`,from:e.packageName+`/codegenv2`},messageDesc:{typeOnly:!1,bootstrapWktFrom:`../../codegenv2/message.js`,from:e.packageName+`/codegenv2`},serviceDesc:{typeOnly:!1,bootstrapWktFrom:`../../codegenv2/service.js`,from:e.packageName+`/codegenv2`},tsEnum:{typeOnly:!1,bootstrapWktFrom:`../../codegenv2/enum.js`,from:e.packageName+`/codegenv2`},objEnum:{typeOnly:!1,bootstrapWktFrom:`../../codegenv2/enum.js`,from:e.packageName+`/codegenv2`},GenFile:{typeOnly:!0,bootstrapWktFrom:`../../codegenv2/types.js`,from:e.packageName+`/codegenv2`},GenEnum:{typeOnly:!0,bootstrapWktFrom:`../../codegenv2/types.js`,from:e.packageName+`/codegenv2`},GenExtension:{typeOnly:!0,bootstrapWktFrom:`../../codegenv2/types.js`,from:e.packageName+`/codegenv2`},GenMessage:{typeOnly:!0,bootstrapWktFrom:`../../codegenv2/types.js`,from:e.packageName+`/codegenv2`},GenService:{typeOnly:!0,bootstrapWktFrom:`../../codegenv2/types.js`,from:e.packageName+`/codegenv2`}}}}}),Fe=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/scalar.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.scalarTypeScriptType=n,e.scalarJsonType=r;var t=y();function n(e,n){switch(e){case t.ScalarType.STRING:return`string`;case t.ScalarType.BOOL:return`boolean`;case t.ScalarType.UINT64:case t.ScalarType.SFIXED64:case t.ScalarType.FIXED64:case t.ScalarType.SINT64:case t.ScalarType.INT64:return n?`string`:`bigint`;case t.ScalarType.BYTES:return`Uint8Array`;default:return`number`}}function r(e){switch(e){case t.ScalarType.DOUBLE:case t.ScalarType.FLOAT:return`number | "NaN" | "Infinity" | "-Infinity"`;case t.ScalarType.UINT64:case t.ScalarType.SFIXED64:case t.ScalarType.FIXED64:case t.ScalarType.SINT64:case t.ScalarType.INT64:return`string`;case t.ScalarType.INT32:case t.ScalarType.FIXED32:case t.ScalarType.UINT32:case t.ScalarType.SFIXED32:case t.ScalarType.SINT32:return`number`;case t.ScalarType.STRING:return`string`;case t.ScalarType.BOOL:return`boolean`;case t.ScalarType.BYTES:return`string`}}}}),Ie=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/types.js"(e){Object.defineProperty(e,"__esModule",{value:!0})}}),Le=m({"node_modules/@bufbuild/protobuf/dist/commonjs/codegenv2/index.js"(e){var t=e&&e.__createBinding||(Object.create?(function(e,t,n,r){r===void 0&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);(!i||(`get`in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}):(function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]})),n=e&&e.__exportStar||function(e,n){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(n,r)&&t(n,e,r)};Object.defineProperty(e,"__esModule",{value:!0}),n(N(),e),n(Me(),e),n(F(),e),n(he(),e),n(R(),e),n(P(),e),n(Ne(),e),n(Pe(),e),n(Fe(),e),n(Ie(),e)}}),Re=m({"node_modules/protobufjs/src/util/aspromise.js"(e,t){t.exports=n;function n(e,t){for(var n=Array(arguments.length-1),r=0,i=2,a=!0;i<arguments.length;)n[r++]=arguments[i++];return new Promise(function(i,o){n[r]=function(e){if(a){if(a=!1,e)o(e);else{for(var t=Array(arguments.length-1),n=0;n<t.length;)t[n++]=arguments[n];i.apply(null,t)}}};try{e.apply(t||null,n)}catch(e){a&&(a=!1,o(e))}})}}}),ze=m({"node_modules/protobufjs/src/util/base64.js"(e){var t=e;t.length=function(e){var t=e.length;if(!t)return 0;for(;t>0&&e.charAt(t-1)===`=`;)--t;return Math.floor(t*3/4)};var n=Array(64),r=Array(123);for(i=0;i<64;)r[n[i]=i<26?i+65:i<52?i+71:i<62?i-4:i-59|43]=i++;var i;r[45]=62,r[95]=63,t.encode=function(e,t,r){for(var i=null,a=[],o=0,s=0,c;t<r;){var l=e[t++];switch(s){case 0:a[o++]=n[l>>2],c=(l&3)<<4,s=1;break;case 1:a[o++]=n[c|l>>4],c=(l&15)<<2,s=2;break;case 2:a[o++]=n[c|l>>6],a[o++]=n[l&63],s=0}o>8191&&((i||=[]).push(String.fromCharCode.apply(String,a)),o=0)}return s&&(a[o++]=n[c],a[o++]=61,s===1&&(a[o++]=61)),i?(o&&i.push(String.fromCharCode.apply(String,a.slice(0,o))),i.join(``)):String.fromCharCode.apply(String,a.slice(0,o))};var a=`invalid encoding`;t.decode=function(e,t,n){for(var i=n,o=0,s,c=0;c<e.length;){var l=e.charCodeAt(c++);if(l===61&&o>1)break;if((l=r[l])===void 0)throw Error(a);switch(o){case 0:s=l,o=1;break;case 1:t[n++]=s<<2|(l&48)>>4,s=l,o=2;break;case 2:t[n++]=(s&15)<<4|(l&60)>>2,s=l,o=3;break;case 3:t[n++]=(s&3)<<6|l,o=0}}if(o===1)throw Error(a);return n-i};var o=/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,s=/[-_]/,c=/^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}(?:==)?|[A-Za-z0-9_-]{3}=?)?$/;t.test=function(e){return o.test(e)||s.test(e)&&c.test(e)}}}),Be=m({"node_modules/protobufjs/src/util/eventemitter.js"(e,t){t.exports=n;function n(){this._listeners=/* @__PURE__ */ Object.create(null)}n.prototype.on=function(e,t,n){return(this._listeners[e]||(this._listeners[e]=[])).push({fn:t,ctx:n||this}),this},n.prototype.off=function(e,t){if(e===void 0)this._listeners=/* @__PURE__ */ Object.create(null);else if(t===void 0)this._listeners[e]=[];else{var n=this._listeners[e];if(!n)return this;for(var r=0;r<n.length;)n[r].fn===t?n.splice(r,1):++r}return this},n.prototype.emit=function(e){var t=this._listeners[e];if(t){for(var n=[],r=1;r<arguments.length;)n.push(arguments[r++]);for(r=0;r<t.length;)t[r].fn.apply(t[r++].ctx,n)}return this}}}),Ve=m({"node_modules/protobufjs/src/util/float.js"(e,t){t.exports=n(n);function n(e){return typeof Float32Array<`u`?(function(){var t=new Float32Array([-0]),n=new Uint8Array(t.buffer),r=n[3]===128;function i(e,r,i){t[0]=e,r[i]=n[0],r[i+1]=n[1],r[i+2]=n[2],r[i+3]=n[3]}function a(e,r,i){t[0]=e,r[i]=n[3],r[i+1]=n[2],r[i+2]=n[1],r[i+3]=n[0]}e.writeFloatLE=r?i:a,e.writeFloatBE=r?a:i;function o(e,r){return n[0]=e[r],n[1]=e[r+1],n[2]=e[r+2],n[3]=e[r+3],t[0]}function s(e,r){return n[3]=e[r],n[2]=e[r+1],n[1]=e[r+2],n[0]=e[r+3],t[0]}e.readFloatLE=r?o:s,e.readFloatBE=r?s:o})():(function(){function t(e,t,n,r){var i=+(t<0);if(i&&(t=-t),t===0)e(1/t>0?0:2147483648,n,r);else if(isNaN(t))e(2143289344,n,r);else if(t>34028234663852886e22)e((i<<31|2139095040)>>>0,n,r);else if(t<11754943508222875e-54)e((i<<31|Math.round(t/1401298464324817e-60))>>>0,n,r);else{var a=Math.floor(Math.log(t)/Math.LN2),o=Math.round(t*2**-a*8388608)&8388607;e((i<<31|a+127<<23|o)>>>0,n,r)}}e.writeFloatLE=t.bind(null,r),e.writeFloatBE=t.bind(null,i);function n(e,t,n){var r=e(t,n),i=(r>>31)*2+1,a=r>>>23&255,o=r&8388607;return a===255?o?NaN:1/0*i:a===0?i*1401298464324817e-60*o:i*2**(a-150)*(o+8388608)}e.readFloatLE=n.bind(null,a),e.readFloatBE=n.bind(null,o)})(),typeof Float64Array<`u`?(function(){var t=new Float64Array([-0]),n=new Uint8Array(t.buffer),r=n[7]===128;function i(e,r,i){t[0]=e,r[i]=n[0],r[i+1]=n[1],r[i+2]=n[2],r[i+3]=n[3],r[i+4]=n[4],r[i+5]=n[5],r[i+6]=n[6],r[i+7]=n[7]}function a(e,r,i){t[0]=e,r[i]=n[7],r[i+1]=n[6],r[i+2]=n[5],r[i+3]=n[4],r[i+4]=n[3],r[i+5]=n[2],r[i+6]=n[1],r[i+7]=n[0]}e.writeDoubleLE=r?i:a,e.writeDoubleBE=r?a:i;function o(e,r){return n[0]=e[r],n[1]=e[r+1],n[2]=e[r+2],n[3]=e[r+3],n[4]=e[r+4],n[5]=e[r+5],n[6]=e[r+6],n[7]=e[r+7],t[0]}function s(e,r){return n[7]=e[r],n[6]=e[r+1],n[5]=e[r+2],n[4]=e[r+3],n[3]=e[r+4],n[2]=e[r+5],n[1]=e[r+6],n[0]=e[r+7],t[0]}e.readDoubleLE=r?o:s,e.readDoubleBE=r?s:o})():(function(){function t(e,t,n,r,i,a){var o=+(r<0);if(o&&(r=-r),r===0)e(0,i,a+t),e(1/r>0?0:2147483648,i,a+n);else if(isNaN(r))e(0,i,a+t),e(2146959360,i,a+n);else if(r>17976931348623157e292)e(0,i,a+t),e((o<<31|2146435072)>>>0,i,a+n);else{var s;if(r<22250738585072014e-324)s=r/5e-324,e(s>>>0,i,a+t),e((o<<31|s/4294967296)>>>0,i,a+n);else{var c=Math.floor(Math.log(r)/Math.LN2);c===1024&&(c=1023),s=r*2**-c,e(s*4503599627370496>>>0,i,a+t),e((o<<31|c+1023<<20|s*1048576&1048575)>>>0,i,a+n)}}}e.writeDoubleLE=t.bind(null,r,0,4),e.writeDoubleBE=t.bind(null,i,4,0);function n(e,t,n,r,i){var a=e(r,i+t),o=e(r,i+n),s=(o>>31)*2+1,c=o>>>20&2047,l=4294967296*(o&1048575)+a;return c===2047?l?NaN:1/0*s:c===0?s*5e-324*l:s*2**(c-1075)*(l+4503599627370496)}e.readDoubleLE=n.bind(null,a,0,4),e.readDoubleBE=n.bind(null,o,4,0)})(),e}function r(e,t,n){t[n]=e&255,t[n+1]=e>>>8&255,t[n+2]=e>>>16&255,t[n+3]=e>>>24}function i(e,t,n){t[n]=e>>>24,t[n+1]=e>>>16&255,t[n+2]=e>>>8&255,t[n+3]=e&255}function a(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0}function o(e,t){return(e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3])>>>0}}}),He=m({"node_modules/protobufjs/src/util/utf8.js"(e){var t=e,n=new TextDecoder(`utf-8`,{ignoreBOM:!0}),r,i=64;try{r=new TextDecoder(`utf-8`,{fatal:!0,ignoreBOM:!0})}catch{r=n}t.length=function(e){for(var t=0,n=0,r=0;r<e.length;++r)n=e.charCodeAt(r),n<128?t+=1:n<2048?t+=2:(n&64512)==55296&&(e.charCodeAt(r+1)&64512)==56320?(++r,t+=4):t+=3;return t};function a(e,t,n,r){var i=n===0&&r===t.length?t:t.subarray(n,r);return e.decode(i)}t.read=function(e,t,r){if(r-t<1)return``;if(r-t>=i)return a(n,e,t,r);for(var o=``,s=t,c,l,u,d,f,p,m,h;s+7<r;s+=8){if(c=e[s],l=e[s+1],u=e[s+2],d=e[s+3],f=e[s+4],p=e[s+5],m=e[s+6],h=e[s+7],(c|l|u|d|f|p|m|h)&128)return o+a(n,e,s,r);o+=String.fromCharCode(c,l,u,d,f,p,m,h)}for(;s<r;++s){if(c=e[s],c&128)return o+a(n,e,s,r);o+=String.fromCharCode(c)}return o},t.readStrict=function(e,t,n){if(n-t<1)return``;if(n-t>=i)return a(r,e,t,n);for(var o=``,s=t,c,l,u,d,f,p,m,h;s+7<n;s+=8){if(c=e[s],l=e[s+1],u=e[s+2],d=e[s+3],f=e[s+4],p=e[s+5],m=e[s+6],h=e[s+7],(c|l|u|d|f|p|m|h)&128)return o+a(r,e,s,n);o+=String.fromCharCode(c,l,u,d,f,p,m,h)}for(;s<n;++s){if(c=e[s],c&128)return o+a(r,e,s,n);o+=String.fromCharCode(c)}return o},t.write=function(e,t,n){for(var r=n,i,a,o=0;o<e.length;++o)i=e.charCodeAt(o),i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)==55296&&((a=e.charCodeAt(o+1))&64512)==56320?(i=65536+((i&1023)<<10)+(a&1023),++o,t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128);return n-r}}}),Ue=m({"node_modules/protobufjs/src/util/pool.js"(e,t){t.exports=n;function n(e,t,n){var r=n||8192,i=r>>>1,a=null,o=r;return function(n){if(n<1||n>i)return e(n);o+n>r&&(a=e(r),o=0);var s=t.call(a,o,o+=n);return o&7&&(o=(o|7)+1),s}}}}),We=m({"node_modules/protobufjs/src/util/longbits.js"(e,t){t.exports=r;var n;function r(e,t){this.lo=e>>>0,this.hi=t>>>0}var i=r.zero=new r(0,0);i.toNumber=function(){return 0},i.zzEncode=i.zzDecode=function(){return this},i.length=function(){return 1};var a=r.zeroHash=`\0\0\0\0\0\0\0\0`;r.fromNumber=function(e){if(e===0)return i;var t=e<0;t&&(e=-e);var n=e>>>0,a=(e-n)/4294967296>>>0;return t&&(a=~a>>>0,n=~n>>>0,++n>4294967295&&(n=0,++a>4294967295&&(a=0))),new r(n,a)},r.from=function(e){if(typeof e==`number`)return r.fromNumber(e);if(typeof e==`string`||e instanceof String){if(n)e=n.fromString(e);else return r.fromNumber(parseInt(e,10))}return e.low||e.high?new r(e.low>>>0,e.high>>>0):i},r.prototype.toNumber=function(e){if(!e&&this.hi>>>31){var t=~this.lo+1>>>0,n=~this.hi>>>0;return t||(n=n+1>>>0),-(t+n*4294967296)}return this.lo+this.hi*4294967296},r.prototype.toLong=function(e){return n?new n(this.lo|0,this.hi|0,!!e):{low:this.lo|0,high:this.hi|0,unsigned:!!e}};var o=String.prototype.charCodeAt;r.fromHash=function(e){return e===a?i:new r((o.call(e,0)|o.call(e,1)<<8|o.call(e,2)<<16|o.call(e,3)<<24)>>>0,(o.call(e,4)|o.call(e,5)<<8|o.call(e,6)<<16|o.call(e,7)<<24)>>>0)},r.prototype.toHash=function(){return String.fromCharCode(this.lo&255,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,this.hi&255,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)},r.prototype.zzEncode=function(){var e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this},r.prototype.zzDecode=function(){var e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this},r.prototype.length=function(){var e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:n<128?9:10},r._configure=function(e){n=e}}}),Ge=m({"node_modules/long/umd/index.js"(e,t){(function(n,r){function i(e){return e.default||e}typeof define==`function`&&define.amd?define([],function(){var e={};return r(e),i(e)}):typeof e==`object`?(r(e),typeof t==`object`&&(t.exports=i(e))):(function(){var e={};r(e),n.Long=i(e)})()})(typeof globalThis<`u`?globalThis:typeof self<`u`?self:e,function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t=null;try{t=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function n(e,t,n){this.low=e|0,this.high=t|0,this.unsigned=!!n}n.prototype.__isLong__,Object.defineProperty(n.prototype,"__isLong__",{value:!0});function r(e){return(e&&e.__isLong__)===!0}function i(e){var t=Math.clz32(e&-e);return e?31-t:t}n.isLong=r;var a={},o={};function s(e,t){var n,r,i;return t?(e>>>=0,(i=0<=e&&e<256)&&(r=o[e],r)?r:(n=l(e,0,!0),i&&(o[e]=n),n)):(e|=0,(i=-128<=e&&e<128)&&(r=a[e],r)?r:(n=l(e,e<0?-1:0,!1),i&&(a[e]=n),n))}n.fromInt=s;function c(e,t){if(isNaN(e))return t?b:y;if(t){if(e<0)return b;if(e>=g)return T}else{if(e<=-_)return E;if(e+1>=_)return w}return e<0?c(-e,t).neg():l(e%h|0,e/h|0,t)}n.fromNumber=c;function l(e,t,r){return new n(e,t,r)}n.fromBits=l;var u=Math.pow;function d(e,t,n){if(e.length===0)throw Error(`empty string`);if(typeof t==`number`?(n=t,t=!1):t=!!t,e===`NaN`||e===`Infinity`||e===`+Infinity`||e===`-Infinity`)return t?b:y;if(n||=10,n<2||36<n)throw RangeError(`radix`);var r;if((r=e.indexOf(`-`))>0)throw Error(`interior hyphen`);if(r===0)return d(e.substring(1),t,n).neg();for(var i=c(u(n,8)),a=y,o=0;o<e.length;o+=8){var s=Math.min(8,e.length-o),l=parseInt(e.substring(o,o+s),n);if(s<8){var f=c(u(n,s));a=a.mul(f).add(c(l))}else a=a.mul(i),a=a.add(c(l))}return a.unsigned=t,a}n.fromString=d;function f(e,t){return typeof e==`number`?c(e,t):typeof e==`string`?d(e,t):l(e.low,e.high,typeof t==`boolean`?t:e.unsigned)}n.fromValue=f;var p=65536,m=1<<24,h=p*p,g=h*h,_=g/2,v=s(m),y=s(0);n.ZERO=y;var b=s(0,!0);n.UZERO=b;var x=s(1);n.ONE=x;var S=s(1,!0);n.UONE=S;var C=s(-1);n.NEG_ONE=C;var w=l(-1,2147483647,!1);n.MAX_VALUE=w;var T=l(-1,-1,!0);n.MAX_UNSIGNED_VALUE=T;var E=l(0,-2147483648,!1);n.MIN_VALUE=E;var D=n.prototype;D.toInt=function(){return this.unsigned?this.low>>>0:this.low},D.toNumber=function(){return this.unsigned?(this.high>>>0)*h+(this.low>>>0):this.high*h+(this.low>>>0)},D.toString=function(e){if(e||=10,e<2||36<e)throw RangeError(`radix`);if(this.isZero())return`0`;if(this.isNegative()){if(this.eq(E)){var t=c(e),n=this.div(t),r=n.mul(t).sub(this);return n.toString(e)+r.toInt().toString(e)}return`-`+this.neg().toString(e)}for(var i=c(u(e,6),this.unsigned),a=this,o=``;;){var s=a.div(i),l=(a.sub(s.mul(i)).toInt()>>>0).toString(e);if(a=s,a.isZero())return l+o;for(;l.length<6;)l=`0`+l;o=``+l+o}},D.getHighBits=function(){return this.high},D.getHighBitsUnsigned=function(){return this.high>>>0},D.getLowBits=function(){return this.low},D.getLowBitsUnsigned=function(){return this.low>>>0},D.getNumBitsAbs=function(){if(this.isNegative())return this.eq(E)?64:this.neg().getNumBitsAbs();for(var e=this.high==0?this.low:this.high,t=31;t>0&&!(e&1<<t);t--);return this.high==0?t+1:t+33},D.isSafeInteger=function(){var e=this.high>>21;return!e||!this.unsigned&&e===-1&&(this.low!==0||this.high!==-2097152)},D.isZero=function(){return this.high===0&&this.low===0},D.eqz=D.isZero,D.isNegative=function(){return!this.unsigned&&this.high<0},D.isPositive=function(){return this.unsigned||this.high>=0},D.isOdd=function(){return(this.low&1)==1},D.isEven=function(){return!(this.low&1)},D.equals=function(e){return r(e)||(e=f(e)),this.unsigned!==e.unsigned&&this.high>>>31==1&&e.high>>>31==1?!1:this.high===e.high&&this.low===e.low},D.eq=D.equals,D.notEquals=function(e){return!this.eq(e)},D.neq=D.notEquals,D.ne=D.notEquals,D.lessThan=function(e){return this.comp(e)<0},D.lt=D.lessThan,D.lessThanOrEqual=function(e){return this.comp(e)<=0},D.lte=D.lessThanOrEqual,D.le=D.lessThanOrEqual,D.greaterThan=function(e){return this.comp(e)>0},D.gt=D.greaterThan,D.greaterThanOrEqual=function(e){return this.comp(e)>=0},D.gte=D.greaterThanOrEqual,D.ge=D.greaterThanOrEqual,D.compare=function(e){if(r(e)||(e=f(e)),this.eq(e))return 0;var t=this.isNegative(),n=e.isNegative();return t&&!n?-1:!t&&n?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1},D.comp=D.compare,D.negate=function(){return!this.unsigned&&this.eq(E)?E:this.not().add(x)},D.neg=D.negate,D.add=function(e){r(e)||(e=f(e));var t=this.high>>>16,n=this.high&65535,i=this.low>>>16,a=this.low&65535,o=e.high>>>16,s=e.high&65535,c=e.low>>>16,u=e.low&65535,d=0,p=0,m=0,h=0;return h+=a+u,m+=h>>>16,h&=65535,m+=i+c,p+=m>>>16,m&=65535,p+=n+s,d+=p>>>16,p&=65535,d+=t+o,d&=65535,l(m<<16|h,d<<16|p,this.unsigned)},D.subtract=function(e){return r(e)||(e=f(e)),this.add(e.neg())},D.sub=D.subtract,D.multiply=function(e){if(this.isZero())return this;if(r(e)||(e=f(e)),t)return l(t.mul(this.low,this.high,e.low,e.high),t.get_high(),this.unsigned);if(e.isZero())return this.unsigned?b:y;if(this.eq(E))return e.isOdd()?E:y;if(e.eq(E))return this.isOdd()?E:y;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(v)&&e.lt(v))return c(this.toNumber()*e.toNumber(),this.unsigned);var n=this.high>>>16,i=this.high&65535,a=this.low>>>16,o=this.low&65535,s=e.high>>>16,u=e.high&65535,d=e.low>>>16,p=e.low&65535,m=0,h=0,g=0,_=0;return _+=o*p,g+=_>>>16,_&=65535,g+=a*p,h+=g>>>16,g&=65535,g+=o*d,h+=g>>>16,g&=65535,h+=i*p,m+=h>>>16,h&=65535,h+=a*d,m+=h>>>16,h&=65535,h+=o*u,m+=h>>>16,h&=65535,m+=n*p+i*d+a*u+o*s,m&=65535,l(g<<16|_,m<<16|h,this.unsigned)},D.mul=D.multiply,D.divide=function(e){if(r(e)||(e=f(e)),e.isZero())throw Error(`division by zero`);if(t)return!this.unsigned&&this.high===-2147483648&&e.low===-1&&e.high===-1?this:l((this.unsigned?t.div_u:t.div_s)(this.low,this.high,e.low,e.high),t.get_high(),this.unsigned);if(this.isZero())return this.unsigned?b:y;var n,i,a;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return b;if(e.gt(this.shru(1)))return S;a=b}else{if(this.eq(E))return e.eq(x)||e.eq(C)?E:e.eq(E)?x:(n=this.shr(1).div(e).shl(1),n.eq(y)?e.isNegative()?x:C:(i=this.sub(e.mul(n)),a=n.add(i.div(e)),a));if(e.eq(E))return this.unsigned?b:y;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();a=y}for(i=this;i.gte(e);){n=Math.max(1,Math.floor(i.toNumber()/e.toNumber()));for(var o=Math.ceil(Math.log(n)/Math.LN2),s=o<=48?1:u(2,o-48),d=c(n),p=d.mul(e);p.isNegative()||p.gt(i);)n-=s,d=c(n,this.unsigned),p=d.mul(e);d.isZero()&&(d=x),a=a.add(d),i=i.sub(p)}return a},D.div=D.divide,D.modulo=function(e){return r(e)||(e=f(e)),t?l((this.unsigned?t.rem_u:t.rem_s)(this.low,this.high,e.low,e.high),t.get_high(),this.unsigned):this.sub(this.div(e).mul(e))},D.mod=D.modulo,D.rem=D.modulo,D.not=function(){return l(~this.low,~this.high,this.unsigned)},D.countLeadingZeros=function(){return this.high?Math.clz32(this.high):Math.clz32(this.low)+32},D.clz=D.countLeadingZeros,D.countTrailingZeros=function(){return this.low?i(this.low):i(this.high)+32},D.ctz=D.countTrailingZeros,D.and=function(e){return r(e)||(e=f(e)),l(this.low&e.low,this.high&e.high,this.unsigned)},D.or=function(e){return r(e)||(e=f(e)),l(this.low|e.low,this.high|e.high,this.unsigned)},D.xor=function(e){return r(e)||(e=f(e)),l(this.low^e.low,this.high^e.high,this.unsigned)},D.shiftLeft=function(e){return r(e)&&(e=e.toInt()),(e&=63)==0?this:e<32?l(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):l(0,this.low<<e-32,this.unsigned)},D.shl=D.shiftLeft,D.shiftRight=function(e){return r(e)&&(e=e.toInt()),(e&=63)==0?this:e<32?l(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):l(this.high>>e-32,this.high>=0?0:-1,this.unsigned)},D.shr=D.shiftRight,D.shiftRightUnsigned=function(e){return r(e)&&(e=e.toInt()),(e&=63)==0?this:e<32?l(this.low>>>e|this.high<<32-e,this.high>>>e,this.unsigned):l(e===32?this.high:this.high>>>e-32,0,this.unsigned)},D.shru=D.shiftRightUnsigned,D.shr_u=D.shiftRightUnsigned,D.rotateLeft=function(e){var t;return r(e)&&(e=e.toInt()),(e&=63)==0?this:e===32?l(this.high,this.low,this.unsigned):e<32?(t=32-e,l(this.low<<e|this.high>>>t,this.high<<e|this.low>>>t,this.unsigned)):(e-=32,t=32-e,l(this.high<<e|this.low>>>t,this.low<<e|this.high>>>t,this.unsigned))},D.rotl=D.rotateLeft,D.rotateRight=function(e){var t;return r(e)&&(e=e.toInt()),(e&=63)==0?this:e===32?l(this.high,this.low,this.unsigned):e<32?(t=32-e,l(this.high<<t|this.low>>>e,this.low<<t|this.high>>>e,this.unsigned)):(e-=32,t=32-e,l(this.low<<t|this.high>>>e,this.high<<t|this.low>>>e,this.unsigned))},D.rotr=D.rotateRight,D.toSigned=function(){return this.unsigned?l(this.low,this.high,!1):this},D.toUnsigned=function(){return this.unsigned?this:l(this.low,this.high,!0)},D.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()},D.toBytesLE=function(){var e=this.high,t=this.low;return[t&255,t>>>8&255,t>>>16&255,t>>>24,e&255,e>>>8&255,e>>>16&255,e>>>24]},D.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,e&255,t>>>24,t>>>16&255,t>>>8&255,t&255]},n.fromBytes=function(e,t,r){return r?n.fromBytesLE(e,t):n.fromBytesBE(e,t)},n.fromBytesLE=function(e,t){return new n(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)},n.fromBytesBE=function(e,t){return new n(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)},typeof BigInt==`function`&&(n.fromBigInt=function(e,t){return l(Number(BigInt.asIntN(32,e)),Number(BigInt.asIntN(32,e>>BigInt(32))),t)},n.fromValue=function(e,t){return typeof e==`bigint`?n.fromBigInt(e,t):f(e,t)},D.toBigInt=function(){var e=BigInt(this.low>>>0);return BigInt(this.unsigned?this.high>>>0:this.high)<<BigInt(32)|e}),e.default=n})}}),Ke=m({"node_modules/protobufjs/src/util/minimal.js"(e){var t=e;t.asPromise=Re(),t.base64=ze(),t.EventEmitter=Be(),t.float=Ve(),t.utf8=He(),t.pool=Ue(),t.LongBits=We();function n(e){return e===`__proto__`||e===`prototype`||e===`constructor`}t.isUnsafeProperty=n,t.isNode=!!(typeof global<`u`&&global&&global.process&&global.process.versions&&global.process.versions.node),t.global=t.isNode&&global||typeof window<`u`&&window||typeof self<`u`&&self||typeof globalThis<`u`&&globalThis||e,t.emptyArray=Object.freeze?Object.freeze([]):
/* istanbul ignore next */
[],t.emptyObject=Object.freeze?Object.freeze({}):
/* istanbul ignore next */
{},t.isInteger=Number.isInteger||function(e){return typeof e==`number`&&isFinite(e)&&Math.floor(e)===e},t.isString=function(e){return typeof e==`string`||e instanceof String},t.isObject=function(e){return e&&typeof e==`object`},t.isset=t.isSet=function(e,t){var n=e[t];return n!=null&&Object.hasOwnProperty.call(e,t)?typeof n!=`object`||(Array.isArray(n)?n.length:Object.keys(n).length)>0:!1},t.Buffer=(function(){try{var e=t.global.Buffer;return e.prototype.utf8Write||t.isNode?e:
/* istanbul ignore next */
null}catch{return null}})(),t.newBuffer=function(e){var n=t.Buffer;return typeof e==`number`?n?n.allocUnsafe(e):new Uint8Array(e):n?n.from(e):new Uint8Array(e)},t.rawField=function(e,n,r){var i=[],a=e<<3|n;for(a>>>=0;a>127;)i.push(a&127|128),a>>>=7;i.push(a);for(var o=0;o<r.length;++o)i.push(r[o]);return t.newBuffer(i)},t.Array=Uint8Array,t.Long=t.global.dcodeIO&&t.global.dcodeIO.Long||t.global.Long||(function(){try{var e=Ge();return e&&e.isLong?e:null}catch{return null}})(),t.key2Re=/^(?:true|false|0|1)$/,t.key32Re=/^-?(?:0|[1-9][0-9]*)$/,t.key64Re=/^(?:[\x00-\xff]{8}|-?(?:0|[1-9][0-9]*))$/,t.longToHash=function(e){return e?t.LongBits.from(e).toHash():t.LongBits.zeroHash},t.longFromHash=function(e,n){var r=t.LongBits.fromHash(e);return t.Long?t.Long.fromBits(r.lo,r.hi,n):r.toNumber(!!n)},t.longFromKey=function(e,n){return t.key64Re.test(e)&&!t.key32Re.test(e)?t.longFromHash(e,n):e},t.boolFromKey=function(e){return e===`true`||e===`1`};function r(e){var t=typeof arguments[arguments.length-1]==`boolean`,r=t?arguments.length-1:arguments.length;t&&=arguments[arguments.length-1];for(var i=1;i<r;++i){var a=arguments[i];if(a)for(var o=Object.keys(a),s=0;s<o.length;++s)!n(o[s])&&(!t||!Object.prototype.hasOwnProperty.call(e,o[s])||e[o[s]]===void 0)&&(e[o[s]]=a[o[s]])}return e}t.merge=r,t.nestingLimit=32,t.recursionLimit=100,t.makeProp=function(e,t,n){Object.prototype.hasOwnProperty.call(e,t)||Object.defineProperty(e,t,{enumerable:n===void 0||n,configurable:!0,writable:!0})},t.lcFirst=function(e){return e.charAt(0).toLowerCase()+e.substring(1)};function i(e){function t(e,n){if(!(this instanceof t))return new t(e,n);Object.defineProperty(this,"message",{get:function(){return e}}),Error.captureStackTrace?Error.captureStackTrace(this,t):Object.defineProperty(this,"stack",{value:(/* @__PURE__ */ Error()).stack||``}),n&&r(this,n)}return t.prototype=Object.create(Error.prototype,{constructor:{value:t,writable:!0,enumerable:!1,configurable:!0},name:{get:function(){return e},set:void 0,enumerable:!1,configurable:!0},toString:{value:function(){return this.name+`: `+this.message},writable:!0,enumerable:!1,configurable:!0}}),t}t.newError=i,t.ProtocolError=i(`ProtocolError`),t.oneOfGetter=function(e){for(var t={},n=0;n<e.length;++n)t[e[n]]=1;return function(){for(var e=Object.keys(this),n=e.length-1;n>-1;--n)if(t[e[n]]===1&&this[e[n]]!==void 0&&this[e[n]]!==null)return e[n]}},t.oneOfSetter=function(e){return function(t){for(var n=0;n<e.length;++n)e[n]!==t&&delete this[e[n]]}},t.toJSONOptions={longs:String,enums:String,bytes:String,json:!0}}}),qe=m({"node_modules/protobufjs/src/writer.js"(e,t){t.exports=s;var n=Ke(),r,i=n.LongBits,a=n.base64,o=n.utf8;function s(){this.pos=0,this.buf=this.constructor.alloc(s.initialBufferSize),this.view=null,this.states=null}s.initialBufferSize=128,Object.defineProperty(s.prototype,"len",{configurable:!0,enumerable:!0,get:function(){return this.pos}});var c=function(){return n.Buffer?function(){return(s.create=function(){return new r})()}:function(){return new s}};s.create=c(),s.alloc=function(e){return new Uint8Array(e)},s.alloc=n.pool(s.alloc,Uint8Array.prototype.subarray);function l(e){return e<128?1:e<16384?2:e<2097152?3:e<268435456?4:5}s.prototype._reserve=function(e){var t=this.pos+e;if(t>this.buf.length){var n=this.buf.length<<1;n<t&&(n=t);var r=this.constructor.alloc(n);r.set(this.buf.subarray(0,this.pos),0),this.buf=r,this.view=null}};function u(e,t,n){for(var r=0;r<e.length;)t[n++]=e.charCodeAt(r++)}function d(e,t,n){for(;e>127;)t[n++]=e&127|128,e>>>=7;return t[n]=e,n+1}s.prototype.uint32=function(e){e>>>=0,this._reserve(5);var t=this.pos;return this.pos=d(e,this.buf,t),this},s.prototype.int32=function(e){return(e|=0)<0?(this._reserve(10),f(i.fromNumber(e),this.buf,this.pos),this.pos+=10,this):this.uint32(e)},s.prototype.sint32=function(e){return this.uint32((e<<1^e>>31)>>>0)};function f(e,t,n){for(var r=e.lo,i=e.hi;i;)t[n++]=r&127|128,r=(r>>>7|i<<25)>>>0,i>>>=7;for(;r>127;)t[n++]=r&127|128,r>>>=7;return t[n]=r,n+1}s.prototype.uint64=function(e){var t=i.from(e);this._reserve(10);var n=this.pos;return this.pos=f(t,this.buf,n),this},s.prototype.int64=s.prototype.uint64,s.prototype.sint64=function(e){var t=i.from(e).zzEncode();this._reserve(10);var n=this.pos;return this.pos=f(t,this.buf,n),this},s.prototype.bool=function(e){return this._reserve(1),this.buf[this.pos++]=+!!e,this};function p(e,t,n){t[n]=e&255,t[n+1]=e>>>8&255,t[n+2]=e>>>16&255,t[n+3]=e>>>24}s.prototype.fixed32=function(e){return this._reserve(4),p(e>>>0,this.buf,this.pos),this.pos+=4,this},s.prototype.sfixed32=s.prototype.fixed32,s.prototype.fixed64=function(e){var t=i.from(e);return this._reserve(8),p(t.lo,this.buf,this.pos),p(t.hi,this.buf,this.pos+4),this.pos+=8,this},s.prototype.sfixed64=s.prototype.fixed64,s.prototype.float=function(e){return this._reserve(4),n.float.writeFloatLE(e,this.buf,this.pos),this.pos+=4,this},s.prototype.double=function(e){return this._reserve(8),n.float.writeDoubleLE(e,this.buf,this.pos),this.pos+=8,this},s.prototype.bytes=function(e){var t=e.length>>>0;if(!t)return this._reserve(1),this.buf[this.pos++]=0,this;if(n.isString(e)){var r=s.alloc(t=a.length(e));a.decode(e,r,0),e=r}return this.uint32(t),this._reserve(t),this.buf.set(e,this.pos),this.pos+=t,this},s.prototype.raw=function(e){var t=e.length>>>0;return t&&(this._reserve(t),this.buf.set(e,this.pos),this.pos+=t),this},s.prototype._delim=function(e,t){var n=l(t);return n>1&&this.buf.copyWithin(e+n,e+1,e+1+t),d(t,this.buf,e),this.pos=e+n+t,this},s.prototype.string=function(e){var t=e.length;if(!t)return this._reserve(1),this.buf[this.pos++]=0,this;if(t<128){this._reserve(t*3+5);var n=this.pos;return this._delim(n,o.write(e,this.buf,n+1))}var r=o.length(e);return this.uint32(r),this._reserve(r),r===e.length?u(e,this.buf,this.pos):o.write(e,this.buf,this.pos),this.pos+=r,this},s.prototype.uint32s=function(e){var t=e.length;this._reserve(t*5+5);for(var n=this.buf,r=this.pos,i=r+1,a=0;a<t;++a)i=d(e[a]>>>0,n,i);return this._delim(r,i-r-1)},s.prototype.int32s=function(e){var t=e.length;this._reserve(t*10+5);for(var n=this.buf,r=this.pos,a=r+1,o,s=0;s<t;++s)a=(o=e[s]|0)<0?f(i.fromNumber(o),n,a):d(o,n,a);return this._delim(r,a-r-1)},s.prototype.sint32s=function(e){var t=e.length;this._reserve(t*5+5);for(var n=this.buf,r=this.pos,i=r+1,a=0;a<t;++a)i=d((e[a]<<1^e[a]>>31)>>>0,n,i);return this._delim(r,i-r-1)},s.prototype.uint64s=function(e){var t=e.length;this._reserve(t*10+5);for(var n=this.buf,r=this.pos,a=r+1,o=0;o<t;++o)a=f(i.from(e[o]),n,a);return this._delim(r,a-r-1)},s.prototype.int64s=s.prototype.uint64s,s.prototype.sint64s=function(e){var t=e.length;this._reserve(t*10+5);for(var n=this.buf,r=this.pos,a=r+1,o=0;o<t;++o)a=f(i.from(e[o]).zzEncode(),n,a);return this._delim(r,a-r-1)},s.prototype.bools=function(e){var t=e.length;this.uint32(t),this._reserve(t);for(var n=this.buf,r=this.pos,i=0;i<t;++i)n[r++]=+!!e[i];return this.pos+=t,this};var m=16,h=128;function g(e,t,n){var r=e.view;if(r||t<n)return r;var i=e.buf;return e.view=new DataView(i.buffer,i.byteOffset,i.byteLength)}s.prototype.fixed32s=function(e){var t=e.length,n=t*4;this.uint32(n),this._reserve(n);var r=this.pos,i,a=g(this,t,h);if(a)for(i=0;i<t;++i)a.setUint32(r,e[i]>>>0,!0),r+=4;else{var o=this.buf;for(i=0;i<t;++i)p(e[i]>>>0,o,r),r+=4}return this.pos+=n,this},s.prototype.sfixed32s=s.prototype.fixed32s,s.prototype.fixed64s=function(e){var t=e.length,n=t*8;this.uint32(n),this._reserve(n);var r=this.pos,a,o,s=g(this,t,h);if(s)for(a=0;a<t;++a)o=i.from(e[a]),s.setUint32(r,o.lo,!0),s.setUint32(r+4,o.hi,!0),r+=8;else{var c=this.buf;for(a=0;a<t;++a)o=i.from(e[a]),p(o.lo,c,r),p(o.hi,c,r+4),r+=8}return this.pos+=n,this},s.prototype.sfixed64s=s.prototype.fixed64s,s.prototype.floats=function(e){var t=e.length,r=t*4;this.uint32(r),this._reserve(r);var i=this.pos,a,o=g(this,t,m);if(o)for(a=0;a<t;++a)o.setFloat32(i,e[a],!0),i+=4;else{var s=this.buf;for(a=0;a<t;++a)n.float.writeFloatLE(e[a],s,i),i+=4}return this.pos+=r,this},s.prototype.doubles=function(e){var t=e.length,r=t*8;this.uint32(r),this._reserve(r);var i=this.pos,a,o=g(this,t,m);if(o)for(a=0;a<t;++a)o.setFloat64(i,e[a],!0),i+=8;else{var s=this.buf;for(a=0;a<t;++a)n.float.writeDoubleLE(e[a],s,i),i+=8}return this.pos+=r,this},s.prototype.fork=function(){return this._reserve(1),(this.states||=[]).push(this.pos),this.pos+=1,this},s.prototype.reset=function(){var e=this.states;return this.pos=e&&e.length?e.pop():0,this},s.prototype.ldelim=function(){var e=this.states,t,n;if(e&&e.length){var r=e.pop();t=this.pos-r-1,n=l(t),n>1?(this._reserve(n-1),this.buf.copyWithin(r+n,r+1,r+1+t),this.pos+=n-1,d(t,this.buf,r)):this.buf[r]=t}else t=this.pos,n=l(t),this._reserve(n),this.buf.copyWithin(n,0,t),d(t,this.buf,0),this.pos+=n;return this},s.prototype.finish=function(e){if(e)return this.buf.subarray(0,this.pos);var t=this.constructor.alloc(this.pos);return t.set(this.buf.subarray(0,this.pos),0),t},s.prototype.finishInto=function(e,t){return t===void 0&&(t=0),e.set(this.buf.subarray(0,this.pos),t),e},s._configure=function(e){r=e,s.create=c(),r._configure()}}}),Je=m({"node_modules/protobufjs/src/writer_buffer.js"(e,t){t.exports=i;var n=qe();i.prototype=Object.create(n.prototype,{constructor:{value:i,writable:!0,enumerable:!1,configurable:!0}});var r=Ke();function i(){n.call(this)}var a;i._configure=function(){i.alloc=r.Buffer&&r.Buffer.allocUnsafe,a=r.Buffer&&r.Buffer.prototype.utf8Write?function(e,t,n){return t.utf8Write(e,n)}:function(e,t,n){return t.write(e,n)}},i.prototype.bytes=function(e){r.isString(e)&&(e=r.Buffer.from(e,`base64`));var t=e.length>>>0;return this.uint32(t),t&&(this._reserve(t),this.buf.set(e,this.pos),this.pos+=t),this},i.prototype.string=function(e){var t=e.length;if(!t)return this._reserve(1),this.buf[this.pos++]=0,this;if(t<128){this._reserve(t*3+5);var n=this.pos,i=this.buf;return this._delim(n,t<40?r.utf8.write(e,i,n+1):a(e,i,n+1))}var o=r.Buffer.byteLength(e);return this.uint32(o),this._reserve(o),a(e,this.buf,this.pos),this.pos+=o,this},i._configure()}}),Ye=m({"node_modules/protobufjs/src/reader.js"(e,t){t.exports=s;var n=Ke(),r,i=n.LongBits,a=n.utf8;function o(e,t){return RangeError(`index out of range: `+e.pos+` + `+(t||1)+` > `+e.len)}function s(e){this.buf=e,this.pos=0,this.len=e.length,this.view=null,this.discardUnknown=s.discardUnknown}function c(e){if(Array.isArray(e)&&(e=new Uint8Array(e)),e instanceof Uint8Array)return new s(e);throw Error(`illegal buffer`)}var l=function(){return n.Buffer?function(e){return(s.create=function(e){return n.Buffer.isBuffer(e)?new r(e):c(e)})(e)}:c};s.create=l(),s.prototype.raw=function(e,t){return this.buf.subarray(e,t)};function u(e){for(var t=0,n=0;n<4;++n){if(e.pos>=e.len)throw o(e);var r=e.buf[e.pos++];if(t=(t|(r&127)<<n*7)>>>0,r<128)return t}throw o(e)}s.prototype.uint32=function(){if(this.len-this.pos<5){if(this.pos>=this.len)throw o(this);if(this.buf[this.pos]>=128)return u(this)}var e=this.buf,t=this.pos,n=(e[t]&127)>>>0;if(e[t++]<128||(n=(n|(e[t]&127)<<7)>>>0,e[t++]<128)||(n=(n|(e[t]&127)<<14)>>>0,e[t++]<128)||(n=(n|(e[t]&127)<<21)>>>0,e[t++]<128)||(n=(n|(e[t]&15)<<28)>>>0,e[t++]<128))return this.pos=t,n;for(var r=0;r<5;++r){if(t>=this.len)throw this.pos=t,o(this);if(e[t++]<128)return this.pos=t,n}throw this.pos=t,Error(`invalid varint encoding`)},s.prototype.tag=function(){if(this.len-this.pos<5){if(this.pos>=this.len)throw o(this);if(this.buf[this.pos]>=128)return u(this)}var e=this.buf,t=this.pos,n=(e[t]&127)>>>0;if(e[t++]<128||(n=(n|(e[t]&127)<<7)>>>0,e[t++]<128)||(n=(n|(e[t]&127)<<14)>>>0,e[t++]<128)||(n=(n|(e[t]&127)<<21)>>>0,e[t++]<128))return this.pos=t,n;if(n=(n|(e[t]&15)<<28)>>>0,e[t]<128&&!(e[t]&112))return this.pos=t+1,n;throw this.pos=t+1,Error(`invalid tag encoding`)},s.prototype.int32=function(){return this.uint32()|0},s.prototype.sint32=function(){var e=this.uint32();return e>>>1^-(e&1)};function d(){var e=new i(0,0),t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<4;++t){if(this.pos>=this.len)throw o(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}throw o(this)}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw o(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error(`invalid varint encoding`)}s.prototype.bool=function(){for(var e=!1,t,n=0;n<10;++n){if(this.pos>=this.len)throw o(this);if(t=this.buf[this.pos++],t&127&&(e=!0),t<128)return e}throw Error(`invalid varint encoding`)};function f(e,t){return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0}s.prototype.fixed32=function(){if(this.pos+4>this.len)throw o(this,4);return f(this.buf,this.pos+=4)},s.prototype.sfixed32=function(){if(this.pos+4>this.len)throw o(this,4);return f(this.buf,this.pos+=4)|0};function p(){if(this.pos+8>this.len)throw o(this,8);return new i(f(this.buf,this.pos+=4),f(this.buf,this.pos+=4))}s.prototype.float=function(){if(this.pos+4>this.len)throw o(this,4);var e=n.float.readFloatLE(this.buf,this.pos);return this.pos+=4,e},s.prototype.double=function(){if(this.pos+8>this.len)throw o(this,4);var e=n.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,e},s.prototype.uint32s=function(e){e===void 0&&(e=[]);var t=this.uint32()+this.pos,n=this.len,r=this.buf,i=this.pos,a;if(t>n)throw o(this,t-this.pos);for(this.len=t;i<t;)a=r[i++],a<128?e.push(a):(this.pos=i-1,e.push(this.uint32()),i=this.pos);if(this.pos=i,i!==t)throw RangeError(`index out of range`);return this.len=n,e},s.prototype.int32s=function(e){e===void 0&&(e=[]);var t=this.uint32()+this.pos,n=this.len,r=this.buf,i=this.pos,a;if(t>n)throw o(this,t-this.pos);for(this.len=t;i<t;)a=r[i++],a<128?e.push(a):(this.pos=i-1,e.push(this.int32()),i=this.pos);if(this.pos=i,i!==t)throw RangeError(`index out of range`);return this.len=n,e},s.prototype.sint32s=function(e){e===void 0&&(e=[]);var t=this.uint32()+this.pos,n=this.len;if(t>n)throw o(this,t-this.pos);for(this.len=t;this.pos<t;)e.push(this.sint32());if(this.pos!==t)throw RangeError(`index out of range`);return this.len=n,e},s.prototype.bools=function(e){e===void 0&&(e=[]);var t=this.uint32()+this.pos,n=this.len,r=this.buf,i=this.pos,a;if(t>n)throw o(this,t-this.pos);for(this.len=t;i<t;)a=r[i++],a<128?e.push(a!==0):(this.pos=i-1,e.push(this.bool()),i=this.pos);if(this.pos=i,i!==t)throw RangeError(`index out of range`);return this.len=n,e};var m=8,h=128;function g(e,t,n){var r=e.view;if(r||t<n)return r;var i=e.buf;return e.view=new DataView(i.buffer,i.byteOffset,i.byteLength)}s.prototype.fixed32s=function(e){e===void 0&&(e=[]);var t=this.uint32(),n=this.pos+t;if(n>this.len)throw o(this,t);var r=t>>>2,i=e.length,a=this.pos;e.length=i+r;var s=g(this,r,h);if(s)for(var c=0;c<r;++c,a+=4)e[i++]=s.getUint32(a,!0);else for(var l=this.buf,u=0;u<r;++u,a+=4)e[i++]=f(l,a+4);if(this.pos=a,a!==n)throw o(this,4);return e},s.prototype.sfixed32s=function(e){e===void 0&&(e=[]);var t=this.uint32(),n=this.pos+t;if(n>this.len)throw o(this,t);var r=t>>>2,i=e.length,a=this.pos;e.length=i+r;var s=g(this,r,h);if(s)for(var c=0;c<r;++c,a+=4)e[i++]=s.getInt32(a,!0);else for(var l=this.buf,u=0;u<r;++u,a+=4)e[i++]=f(l,a+4)|0;if(this.pos=a,a!==n)throw o(this,4);return e},s.prototype.floats=function(e){e===void 0&&(e=[]);var t=this.uint32(),r=this.pos+t;if(r>this.len)throw o(this,t);var i=t>>>2,a=e.length,s=this.pos;e.length=a+i;var c=g(this,i,m);if(c)for(var l=0;l<i;++l,s+=4)e[a++]=c.getFloat32(s,!0);else for(var u=this.buf,d=0;d<i;++d,s+=4)e[a++]=n.float.readFloatLE(u,s);if(this.pos=s,s!==r)throw o(this,4);return e},s.prototype.doubles=function(e){e===void 0&&(e=[]);var t=this.uint32(),r=this.pos+t;if(r>this.len)throw o(this,t);var i=t>>>3,a=e.length,s=this.pos;e.length=a+i;var c=g(this,i,m);if(c)for(var l=0;l<i;++l,s+=8)e[a++]=c.getFloat64(s,!0);else for(var u=this.buf,d=0;d<i;++d,s+=8)e[a++]=n.float.readDoubleLE(u,s);if(this.pos=s,s!==r)throw o(this,8);return e},s.prototype.uint64s=function(e){e===void 0&&(e=[]);var t=this.uint32()+this.pos,n=this.len;if(t>n)throw o(this,t-this.pos);for(this.len=t;this.pos<t;)e.push(this.uint64());if(this.pos!==t)throw RangeError(`index out of range`);return this.len=n,e},s.prototype.int64s=function(e){e===void 0&&(e=[]);var t=this.uint32()+this.pos,n=this.len;if(t>n)throw o(this,t-this.pos);for(this.len=t;this.pos<t;)e.push(this.int64());if(this.pos!==t)throw RangeError(`index out of range`);return this.len=n,e},s.prototype.sint64s=function(e){e===void 0&&(e=[]);var t=this.uint32()+this.pos,n=this.len;if(t>n)throw o(this,t-this.pos);for(this.len=t;this.pos<t;)e.push(this.sint64());if(this.pos!==t)throw RangeError(`index out of range`);return this.len=n,e},s.prototype.fixed64s=function(e){e===void 0&&(e=[]);var t=this.uint32(),n=this.pos+t,r=e.length;if(n>this.len)throw o(this,t);var i=t>>>3;e.length=r+i;for(var a=0;a<i;++a)e[r++]=this.fixed64();if(this.pos!==n)throw o(this,8);return e},s.prototype.sfixed64s=function(e){e===void 0&&(e=[]);var t=this.uint32(),n=this.pos+t,r=e.length;if(n>this.len)throw o(this,t);var i=t>>>3;e.length=r+i;for(var a=0;a<i;++a)e[r++]=this.sfixed64();if(this.pos!==n)throw o(this,8);return e},s.prototype.bytes=function(){var e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw o(this,e);return this.pos=n,this.raw(t,n)},s.prototype.string=function(){var e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw o(this,e);return this.pos=n,a.read(this.buf,t,n)},s.prototype.stringVerify=function(){var e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw o(this,e);return this.pos=n,a.readStrict(this.buf,t,n)},s.prototype.skip=function(e){if(typeof e==`number`){if(this.pos+e>this.len)throw o(this,e);this.pos+=e}else do if(this.pos>=this.len)throw o(this);while(this.buf[this.pos++]&128);return this},s.recursionLimit=n.recursionLimit,s.discardUnknown=!0,s.prototype.skipType=function(e,t,n){if(t===void 0&&(t=0),t>s.recursionLimit)throw Error(`max depth exceeded`);if(n===0)throw Error(`illegal tag: field number 0`);switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;;){var r=this.tag(),i=r>>>3;if(e=r&7,!i)throw Error(`illegal tag: field number 0`);if(e===4){if(n!==void 0&&i!==n)throw Error(`invalid end group tag`);break}this.skipType(e,t+1,i)}break;case 5:this.skip(4);break;
/* istanbul ignore next */
default:throw Error(`invalid wire type `+e+` at offset `+this.pos)}return this},s._configure=function(e){r=e,s.create=l(),r._configure();var t=n.Long?`toLong`:
/* istanbul ignore next */
`toNumber`;n.merge(s.prototype,{int64:function(){return d.call(this)[t](!1)},uint64:function(){return d.call(this)[t](!0)},sint64:function(){return d.call(this).zzDecode()[t](!1)},fixed64:function(){return p.call(this)[t](!0)},sfixed64:function(){return p.call(this)[t](!1)}})}}}),Xe=m({"node_modules/protobufjs/src/reader_buffer.js"(e,t){t.exports=i;var n=Ye();i.prototype=Object.create(n.prototype,{constructor:{value:i,writable:!0,enumerable:!1,configurable:!0}});var r=Ke();function i(e){n.call(this,e)}i._configure=function(){r.Buffer&&(i.prototype._slice=r.Buffer.prototype.slice)},i.prototype.raw=function(e,t){return this._slice.call(this.buf,e,t)},i.prototype.string=function(){var e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw RangeError(`index out of range: `+this.pos+` + `+e+` > `+this.len);return this.pos=n,this.buf.utf8Slice?this.buf.utf8Slice(t,n):this.buf.toString(`utf-8`,t,n)},i._configure()}}),Ze=m({"node_modules/protobufjs/src/rpc/service.js"(e,t){t.exports=r;var n=Ke();r.prototype=Object.create(n.EventEmitter.prototype,{constructor:{value:r,writable:!0,enumerable:!1,configurable:!0}});function r(e,t,r){if(typeof e!=`function`)throw TypeError(`rpcImpl must be a function`);n.EventEmitter.call(this),this.rpcImpl=e,this.requestDelimited=!!t,this.responseDelimited=!!r}r.prototype.rpcCall=function e(t,r,i,a,o){if(!a)throw TypeError(`request must be specified`);var s=this;if(!o)return n.asPromise(e,s,t,r,i,a);if(!s.rpcImpl)setTimeout(function(){o(Error(`already ended`))},0);else try{return s.rpcImpl(t,r[s.requestDelimited?`encodeDelimited`:`encode`](a).finish(),function(e,n){if(e)return s.emit(`error`,e,t),o(e);if(n===null)s.end(!0);else{if(!(n instanceof i))try{n=i[s.responseDelimited?`decodeDelimited`:`decode`](n)}catch(e){return s.emit(`error`,e,t),o(e)}return s.emit(`data`,n,t),o(null,n)}})}catch(e){s.emit(`error`,e,t),setTimeout(function(){o(e)},0);return}},r.prototype.end=function(e){return this.rpcImpl&&(e||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit(`end`).off()),this}}}),Qe=m({"node_modules/protobufjs/src/rpc.js"(e){var t=e;t.Service=Ze()}}),$e=m({"node_modules/protobufjs/src/roots.js"(e,t){t.exports=/* @__PURE__ */ Object.create(null)}}),et=m({"node_modules/protobufjs/src/index-minimal.js"(e){e.build=`minimal`,e.Writer=qe(),e.BufferWriter=Je(),e.Reader=Ye(),e.BufferReader=Xe(),e.util=Ke(),e.rpc=Qe(),e.roots=$e(),e.configure=t;function t(){e.util.LongBits._configure(e.util.Long),e.Writer._configure(e.BufferWriter),e.Reader._configure(e.BufferReader)}t()}}),tt=m({"node_modules/protobufjs/src/util/patterns.js"(e){var t=e;t.numberRe=/^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,t.typeRefRe=/^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/,t.reservedRe=/^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/}}),nt=m({"node_modules/protobufjs/src/util/codegen.js"(e,t){t.exports=r;var n=tt().reservedRe;function r(e,t){typeof e==`string`&&(t=e,e=void 0);var n=[];function a(e){if(typeof e!=`string`){var t=o();if(r.verbose&&console.log(`codegen: `+t),t=`return `+t,e){for(var i=Object.keys(e),s=Array(i.length+1),c=Array(i.length),l=0;l<i.length;)s[l]=i[l],c[l]=e[i[l++]];return s[l]=t,Function.apply(null,s).apply(null,c)}return Function(t)()}for(var u=Array(arguments.length-1),d=0;d<u.length;)u[d]=arguments[++d];if(d=0,e=e.replace(/%([%dfijs])/g,function(e,t){var n=u[d++];switch(t){case`d`:case`f`:return n=Number(n),Object.is(n,-0)?`-0`:String(n);case`i`:return String(Math.floor(n));case`j`:return JSON.stringify(n);case`s`:return String(n)}return`%`}),d!==u.length)throw Error(`parameter count mismatch`);return n.push(e),a}function o(r){return`function `+i(r||t)+`(`+(e&&e.join(`,`)||``)+`){
  `+n.join(`
  `)+`
}`}return Object.defineProperty(a,"toString",{value:o,writable:!0,enumerable:!0,configurable:!0}),a}r.verbose=!1;function i(e){return!e||(e=String(e).replace(/[^\w$]/g,``),!e)?``:(/^\d/.test(e)&&(e=`_`+e),n.test(e)?e+`_`:e)}}}),rt=m({"(disabled):fs"(){}}),it=m({"node_modules/protobufjs/src/util/fs.js"(e,t){var n=null;try{n=rt(),(!n||!n.readFile||!n.readFileSync)&&(n=null)}catch{}t.exports=n}}),at=m({"node_modules/protobufjs/src/util/fetch.js"(e,t){t.exports=i;var n=Re(),r=it();function i(e,t,a){return typeof t==`function`?(a=t,t={}):t||={},a?!t.xhr&&r&&r.readFile?r.readFile(e,function(n,r){return n&&typeof XMLHttpRequest<`u`?i.xhr(e,t,a):n?a(n):a(null,t.binary?r:r.toString(`utf8`))}):i.xhr(e,t,a):n(i,this,e,t)}i.xhr=function(e,t,n){var r=new XMLHttpRequest;r.onreadystatechange=function(){if(r.readyState===4){if(r.status!==0&&r.status!==200)return n(Error(`status `+r.status));if(t.binary){var e=r.response;if(!e){e=[];for(var i=0;i<r.responseText.length;++i)e.push(r.responseText.charCodeAt(i)&255)}return n(null,typeof Uint8Array<`u`?new Uint8Array(e):e)}return n(null,r.responseText)}},t.binary&&(`overrideMimeType`in r&&r.overrideMimeType(`text/plain; charset=x-user-defined`),r.responseType=`arraybuffer`),r.open(`GET`,e),r.send()}}}),ot=m({"node_modules/protobufjs/src/util/path.js"(e){var t=e,n=/^[a-zA-Z][a-zA-Z0-9+.-]+:\/\//;function r(e){if(typeof URL>`u`||!n.test(e))return null;try{return new URL(e).href}catch{return null}}function i(e,t){if(typeof URL>`u`||!n.test(e)||n.test(t))return null;try{return new URL(t,e).href}catch{return null}}var a=t.isAbsolute=function(e){return/^(?:\/|\w+:|\\\\\w+)/.test(e)},o=t.normalize=function(e){var t=r(e);if(t)return t;var n=e.substring(0,2),i=``;n===`\\\\`&&(i=n,e=e.substring(2)),e=e.replace(/\\/g,`/`).replace(/\/{2,}/g,`/`);var o=e.split(`/`),s=a(e),c=``;s&&(c=o.shift()+`/`);for(var l=0;l<o.length;)o[l]===`..`?l>0&&o[l-1]!==`..`?o.splice(--l,2):s?o.splice(l,1):++l:o[l]===`.`?o.splice(l,1):++l;return i+c+o.join(`/`)};t.resolve=function(e,t,n){return i(e,t)||(n||(t=o(t)),a(t)?t:(n||(e=o(e)),(e=e.replace(/(?:\/|^)[^/]+$/,``)).length?o(e+`/`+t):t))}}}),st=m({"node_modules/protobufjs/src/namespace.js"(e,t){t.exports=u;var n=xt();u.prototype=Object.create(n.prototype,{constructor:{value:u,writable:!0,enumerable:!1,configurable:!0}}),u.className=`Namespace`;var r=yt(),i=G(),a=bt(),o,s,c;u.fromJSON=function(e,t,n){if(n===void 0&&(n=0),n>i.recursionLimit)throw Error(`max depth exceeded`);return new u(e,t.options).addJSON(t.nested,n)};function l(e,t){if(e&&e.length){for(var n={},r=0;r<e.length;++r)n[e[r].name]=e[r].toJSON(t);return n}}u.arrayToJSON=l,u.isReservedId=function(e,t){if(e){for(var n=0;n<e.length;++n)if(typeof e[n]!=`string`&&e[n][0]<=t&&e[n][1]>=t)return!0}return!1},u.isReservedName=function(e,t){if(e){for(var n=0;n<e.length;++n)if(e[n]===t)return!0}return!1};function u(e,t){n.call(this,e,t),this.nested=void 0,this._nestedArray=null,this._lookupCache=/* @__PURE__ */ Object.create(null),this._needsRecursiveFeatureResolution=!0,this._needsRecursiveResolve=!0}function d(e){e._nestedArray=null,e._lookupCache=/* @__PURE__ */ Object.create(null);for(var t=e;t=t.parent;)t._lookupCache=/* @__PURE__ */ Object.create(null);return e}Object.defineProperty(u.prototype,"nestedArray",{get:function(){return this._nestedArray||=i.toArray(this.nested)}}),u.prototype.toJSON=function(e){return i.toObject([`options`,this.options,`nested`,l(this.nestedArray,e)])},u.prototype.addJSON=function(e,t){if(t===void 0&&(t=0),t>i.recursionLimit)throw Error(`max depth exceeded`);var n=this;if(e)for(var a=Object.keys(e),l=0,d;l<a.length;++l)d=e[a[l]],n.add((d.fields===void 0?d.values===void 0?d.methods===void 0?d.id===void 0?u.fromJSON:r.fromJSON:s.fromJSON:c.fromJSON:o.fromJSON)(a[l],d,t+1));return this},u.prototype.get=function(e){return this.nested&&Object.prototype.hasOwnProperty.call(this.nested,e)?this.nested[e]:null},u.prototype.getEnum=function(e){if(this.nested&&Object.prototype.hasOwnProperty.call(this.nested,e)&&this.nested[e]instanceof c)return this.nested[e].values;throw Error(`no such enum: `+e)},u.prototype.add=function(e){if(!(e instanceof r&&e.extend!==void 0||e instanceof o||e instanceof a||e instanceof c||e instanceof s||e instanceof u))throw TypeError(`object must be a valid nested object`);if(e.name===`__proto__`)return this;if(!this.nested)this.nested={};else{var t=this.get(e.name);if(t){if(t instanceof u&&e instanceof u&&!(t instanceof o||t instanceof s)){for(var n=t.nestedArray,i=0;i<n.length;++i)e.add(n[i]);this.remove(t),this.nested||={},e.setOptions(t.options,!0)}else throw Error(`duplicate name '`+e.name+`' in `+this)}}this.nested[e.name]=e,this instanceof o||this instanceof s||this instanceof c||this instanceof r||e._edition||(e._edition=e._defaultEdition),this._needsRecursiveFeatureResolution=!0,this._needsRecursiveResolve=!0;for(var l=this;l=l.parent;)l._needsRecursiveFeatureResolution=!0,l._needsRecursiveResolve=!0;return e.onAdd(this),d(this)},u.prototype.remove=function(e){if(!(e instanceof n))throw TypeError(`object must be a ReflectionObject`);if(e.parent!==this||!i.remove(this.nested,e,e.name))throw Error(e+` is not a member of `+this);return Object.keys(this.nested).length||(this.nested=void 0),e.onRemove(this),d(this)},u.prototype.define=function(e,t){if(i.isString(e))e=e.split(`.`);else if(!Array.isArray(e))throw TypeError(`illegal path`);if(e&&e.length&&e[0]===``)throw Error(`path must be relative`);if(e.length>i.recursionLimit)throw Error(`max depth exceeded`);for(var n=this;e.length>0;){var r=e.shift();if(n.nested&&n.nested[r]){if(n=n.nested[r],!(n instanceof u))throw Error(`path conflicts with non-namespace objects`)}else n.add(n=new u(r))}return t&&n.addJSON(t),n},u.prototype.resolveAll=function(){if(!this._needsRecursiveResolve)return this;this._needsRecursiveFeatureResolution&&this._resolveFeaturesRecursive(this._edition);var e=this.nestedArray,t=0;for(this.resolve();t<e.length;)e[t]instanceof u?e[t++].resolveAll():e[t++].resolve();return this._needsRecursiveResolve=!1,this},u.prototype._resolveFeaturesRecursive=function(e){return this._needsRecursiveFeatureResolution&&(this._needsRecursiveFeatureResolution=!1,e=this._edition||e,n.prototype._resolveFeaturesRecursive.call(this,e),this.nestedArray.forEach(t=>{t._resolveFeaturesRecursive(e)})),this},u.prototype.lookup=function(e,t,n){if(typeof t==`boolean`?(n=t,t=void 0):t&&!Array.isArray(t)&&(t=[t]),i.isString(e)&&e.length){if(e===`.`)return this.root;e=e.split(`.`)}else if(!e.length)return this;var r=e.join(`.`);if(e[0]===``)return this.root.lookup(e.slice(1),t);var a=this._lookupImpl(e,r);if(a&&(!t||t.indexOf(a.constructor)>-1)||(a=this.root._fullyQualifiedObjects&&this.root._fullyQualifiedObjects[`.`+r],a&&(!t||t.indexOf(a.constructor)>-1)))return a;if(n)return null;for(var o=this;o.parent;){if(a=o.parent._lookupImpl(e,r),a&&(!t||t.indexOf(a.constructor)>-1))return a;o=o.parent}return null},u.prototype._lookupImpl=function(e,t){if(Object.prototype.hasOwnProperty.call(this._lookupCache,t))return this._lookupCache[t];var n=this.get(e[0]),r=null;if(n)e.length===1?r=n:n instanceof u&&(e=e.slice(1),r=n._lookupImpl(e,e.join(`.`)));else for(var i=0;i<this.nestedArray.length;++i)if(this._nestedArray[i]instanceof u&&(n=this._nestedArray[i]._lookupImpl(e,t))){r=n;break}return this._lookupCache[t]=r,r},u.prototype.lookupType=function(e){var t=this.lookup(e,[o]);if(!t)throw Error(`no such type: `+e);return t},u.prototype.lookupEnum=function(e){var t=this.lookup(e,[c]);if(!t)throw Error(`no such Enum '`+e+`' in `+this);return t},u.prototype.lookupTypeOrEnum=function(e){var t=this.lookup(e,[o,c]);if(!t)throw Error(`no such Type or Enum '`+e+`' in `+this);return t},u.prototype.lookupService=function(e){var t=this.lookup(e,[s]);if(!t)throw Error(`no such Service '`+e+`' in `+this);return t},u._configure=function(e,t,n){o=e,s=t,c=n}}}),ct=m({"node_modules/protobufjs/src/mapfield.js"(e,t){t.exports=a;var n=yt();a.prototype=Object.create(n.prototype,{constructor:{value:a,writable:!0,enumerable:!1,configurable:!0}}),a.className=`MapField`;var r=vt(),i=G();function a(e,t,r,a,o,s){if(n.call(this,e,t,a,void 0,void 0,o,s),!i.isString(r))throw TypeError(`keyType must be a string`);this.keyType=r,this.resolvedKeyType=null,this.map=!0}a.fromJSON=function(e,t){var n=new a(e,t.id,t.keyType,t.type,t.options,t.comment);return t.protoName&&(n.protoName=t.protoName),t.jsonName===void 0?t.options&&t.options.json_name!==void 0&&(n.jsonName=t.options.json_name):n.jsonName=t.jsonName,n},a.prototype.toJSON=function(e){var t=e?!!e.keepComments:!1;return i.toObject([`keyType`,this.keyType,`type`,this.type,`id`,this.id,`extend`,this.extend,`protoName`,this.protoName===this.name?void 0:this.protoName,`jsonName`,this.jsonName===i.jsonName(this.protoName||this.name)?void 0:this.jsonName,`options`,this.options,`comment`,t?this.comment:void 0])},a.prototype.resolve=function(){if(this.resolved)return this;if(r.mapKey[this.keyType]===void 0)throw Error(`invalid key type: `+this.keyType);return n.prototype.resolve.call(this)},a.d=function(e,t,n){return typeof n==`function`?n=i.decorateType(n).name:n&&typeof n==`object`&&(n=i.decorateEnum(n).name),function(r,o){i.decorateType(r.constructor).add(new a(o,e,t,n))}}}}),lt=m({"node_modules/protobufjs/src/method.js"(e,t){t.exports=i;var n=xt();i.prototype=Object.create(n.prototype,{constructor:{value:i,writable:!0,enumerable:!1,configurable:!0}}),i.className=`Method`;var r=G();function i(e,t,i,a,o,s,c,l,u){if(r.isObject(o)?(c=o,o=s=void 0):r.isObject(s)&&(c=s,s=void 0),!(t===void 0||r.isString(t)))throw TypeError(`type must be a string`);if(!r.isString(i))throw TypeError(`requestType must be a string`);if(!r.isString(a))throw TypeError(`responseType must be a string`);n.call(this,e,c),this.type=t||`rpc`,this.requestType=i,this.requestStream=o?!0:void 0,this.responseType=a,this.responseStream=s?!0:void 0,this.path=`/`+this.name,this.resolvedRequestType=null,this.resolvedResponseType=null,this.comment=l,this.parsedOptions=u}i.fromJSON=function(e,t){return new i(e,t.type,t.requestType,t.responseType,t.requestStream,t.responseStream,t.options,t.comment,t.parsedOptions)},i.prototype.toJSON=function(e){var t=e?!!e.keepComments:!1;return r.toObject([`type`,this.type!==`rpc`&&this.type||void 0,`requestType`,this.requestType,`requestStream`,this.requestStream,`responseType`,this.responseType,`responseStream`,this.responseStream,`options`,this.options,`comment`,t?this.comment:void 0,`parsedOptions`,this.parsedOptions])},i.prototype.resolve=function(){if(this.resolved)return this;if(this.parent){var e=this.parent.fullName;e.charAt(0)===`.`&&(e=e.substring(1)),this.path=`/`+e+`/`+this.name}else this.path=`/`+this.name;return this.resolvedRequestType=this.parent.lookupType(this.requestType),this.resolvedResponseType=this.parent.lookupType(this.responseType),n.prototype.resolve.call(this)}}}),ut=m({"node_modules/protobufjs/src/service.js"(e,t){t.exports=o;var n=st();o.prototype=Object.create(n.prototype,{constructor:{value:o,writable:!0,enumerable:!1,configurable:!0}}),o.className=`Service`;var r=lt(),i=G(),a=Qe();function o(e,t){n.call(this,e,t),this.methods={},this._methodsArray=null}o.fromJSON=function(e,t,n){if(n===void 0&&(n=0),n>i.recursionLimit)throw Error(`max depth exceeded`);var a=new o(e,t.options);if(t.methods)for(var s=Object.keys(t.methods),c=0;c<s.length;++c)a.add(r.fromJSON(s[c],t.methods[s[c]]));return t.nested&&a.addJSON(t.nested,n),t.edition&&(a._edition=t.edition),a.comment=t.comment,a._defaultEdition=`proto3`,a},o.prototype.toJSON=function(e){var t=n.prototype.toJSON.call(this,e),r=e?!!e.keepComments:!1;return i.toObject([`edition`,this._editionToJSON(),`options`,t&&t.options||void 0,`methods`,n.arrayToJSON(this.methodsArray,e)||{},`nested`,t&&t.nested||void 0,`comment`,r?this.comment:void 0])},Object.defineProperty(o.prototype,"methodsArray",{get:function(){return this._methodsArray||=i.toArray(this.methods)}});function s(e){return e._methodsArray=null,e}o.prototype.get=function(e){return Object.prototype.hasOwnProperty.call(this.methods,e)?this.methods[e]:n.prototype.get.call(this,e)},o.prototype.resolveAll=function(){if(!this._needsRecursiveResolve)return this;n.prototype.resolve.call(this);for(var e=this.methodsArray,t=0;t<e.length;++t)e[t].resolve();return this},o.prototype._resolveFeaturesRecursive=function(e){return this._needsRecursiveFeatureResolution&&(e=this._edition||e,n.prototype._resolveFeaturesRecursive.call(this,e),this.methodsArray.forEach(t=>{t._resolveFeaturesRecursive(e)})),this},o.prototype.add=function(e){if(this.get(e.name))throw Error(`duplicate name '`+e.name+`' in `+this);return e instanceof r?e.name===`__proto__`?this:(this.methods[e.name]=e,e.parent=this,s(this)):n.prototype.add.call(this,e)},o.prototype.remove=function(e){if(e instanceof r){if(this.methods[e.name]!==e)throw Error(e+` is not a member of `+this);return delete this.methods[e.name],e.parent=null,s(this)}return n.prototype.remove.call(this,e)},o.prototype.create=function(e,t,n){for(var r=new a.Service(e,t,n),o=0,s;o<this.methodsArray.length;++o){var c=i.lcFirst((s=this._methodsArray[o]).resolve().name).replace(/[^$\w_]/g,``);r[c]=/* @__PURE__ */ (function(e,t,n){return function(r,i){return a.Service.prototype.rpcCall.call(this,e,t,n,r,i)}})(s,s.resolvedRequestType.ctor,s.resolvedResponseType.ctor)}return r}}}),dt=m({"node_modules/protobufjs/src/message.js"(e,t){t.exports=r;var n=Ke();function r(e){if(e)for(var t=Object.keys(e),n=0;n<t.length;++n)e[t[n]]!=null&&t[n]!==`__proto__`&&(this[t[n]]=e[t[n]])}r.create=function(e){return this.$type.create(e)},r.encode=function(e,t){return this.$type.encode(e,t)},r.encodeDelimited=function(e,t){return this.$type.encodeDelimited(e,t)},r.decode=function(e){return this.$type.decode(e)},r.decodeDelimited=function(e){return this.$type.decodeDelimited(e)},r.verify=function(e){return this.$type.verify(e)},r.fromObject=function(e){return this.$type.fromObject(e)},r.toObject=function(e,t){return this.$type.toObject(e,t)},r.prototype.toJSON=function(){return this.$type.toObject(this,n.toJSONOptions)}}}),ft=m({"node_modules/protobufjs/src/decoder.js"(e,t){t.exports=c;var n=St(),r=vt(),i=G();function a(e){return`missing required '`+e.name+`'`}function o(e){return e._features.utf8_validation===`VERIFY`?`stringVerify`:`string`}function s(e,t){return e(`if(!r.discardUnknown){`)(`util.makeProp(m,"$unknowns",false);`)(`(m.$unknowns||(m.$unknowns=[])).push(%s)`,t)(`}`)}function c(e){for(var t=!1,c=!1,l=0;l<e.fieldsArray.length;++l){var u=e._fieldsArray[l];u.map&&(t=!0),(u.resolvedType instanceof n||!u.repeated&&!u.map&&!u.hasPresence)&&(c=!0)}var d=i.codegen([`r`,`l`,`z`,`q`,`g`])(`if(!(r instanceof Reader))`)(`r=Reader.create(r)`)(`if(q===undefined)q=0`)(`if(q>Reader.recursionLimit)`)(`throw Error("max depth exceeded")`)(`var c,m`+(t?`,k,v`:c?`,v`:``))(`if(l===undefined)`)(`c=r.len`)(`else{`)(`c=r.pos+l`)(`if(c>r.len)`)(`throw RangeError("index out of range")`)(`l=r.len`)(`r.len=c`)(`}`)(`m=g||new C`)(`while(r.pos<c){`)(`var s=r.pos`)(`var t=r.tag()`)(`if(t===z){`)(`z=undefined`)(`break`)(`}`);for(e.fieldsArray.length&&d(`var u=t&7`)(`switch(t>>>=3){`),l=0;l<e.fieldsArray.length;++l){var f=e._fieldsArray[l].resolve(),p=f.resolvedType instanceof n?`int32`:f.type,m=`m`+i.safeProp(f.name),h=f.resolvedType instanceof n&&f.resolvedType._features.enum_type===`CLOSED`;if(f.map){d(`case %i:{`,f.id)(`if(u!==2)`)(`break`),h||d(`if(%s===util.emptyObject)`,m)(`%s={}`,m),d(`var c2=r.uint32()+r.pos`)(`if(c2>r.len)`)(`throw RangeError("index out of range")`)(`r.len=c2`),r.defaults[f.keyType]===void 0?d(`k=null`):d(`k=%j`,r.defaults[f.keyType]),r.long[p]===void 0?r.defaults[p]===void 0?d(`v=null`):d(`v=%j`,r.defaults[p]):d(`v=util.Long?util.Long.fromNumber(0,%j):0`,p===`uint64`||p===`fixed64`),d(`while(r.pos<c2){`)(`var t2=r.tag()`)(`u=t2&7`)(`switch(t2>>>=3){`)(`case 1:`)(`if(u!==%i)`,r.mapKey[f.keyType])(`break`)(`k=r.%s()`,f.keyType===`string`?o(f):f.keyType)(`continue`)(`case 2:`)(`if(u!==%i)`,r.basic[p]===void 0?2:r.basic[p])(`break`),r.basic[p]===void 0?d(`v=types[%i].decode(r,r.uint32(),undefined,q+1,v)`,l):d(`v=r.%s()`,p===`string`?o(f):p),d(`continue`)(`}`)(`r.skipType(u,q,t2)`)(`}`),d(`if(r.pos!==c2)`)(`throw RangeError("index out of range")`)(`r.len=c`),h&&(d(`if(types[%i].valuesById[v]===undefined){`,l),s(d,`r.raw(s,r.pos)`)(`continue`)(`}`)(`if(%s===util.emptyObject)`,m)(`%s={}`,m));var g=r.basic[p]===void 0?`v||new types[`+l+`].ctor`:`v`;r.long[f.keyType]===void 0?(f.keyType===`string`&&d(`if(k==="__proto__")`)(`util.makeProp(%s,k)`,m),d(`%s[k]=%s`,m,g)):d(`%s[typeof k==="object"?util.longToHash(k):k]=%s`,m,g)}else f.repeated?(d(`case %i:`,f.id)(`{`),r.packed[p]!==void 0&&(d(`if(u===2){`),h?(d(`var c2=r.uint32()+r.pos`)(`if(c2>r.len)`)(`throw RangeError("index out of range")`)(`r.len=c2`)(`while(r.pos<c2){`)(`s=r.pos`)(`v=r.%s()`,p)(`if(types[%i].valuesById[v]!==undefined){`,l)(`if(!(%s&&%s.length))`,m,m)(`%s=[]`,m)(`%s.push(v)`,m)(`}else`),s(d,`util.rawField(`+f.id+`,0,r.raw(s,r.pos))`)(`}`),d(`if(r.pos!==c2)`)(`throw RangeError("index out of range")`)(`r.len=c`)):d(`if(!(%s&&%s.length))`,m,m)(`%s=[]`,m)(`r.%ss(%s)`,p,m),d(`continue`)(`}`)),d(`if(u!==%i)`,r.basic[p]===void 0?f.delimited?3:2:r.basic[p])(`break`),h||d(`if(!(%s&&%s.length))`,m,m)(`%s=[]`,m),r.basic[p]===void 0?f.delimited?d(`%s.push(types[%i].decode(r,undefined,%i,q+1))`,m,l,f.id*8+4):d(`%s.push(types[%i].decode(r,r.uint32(),undefined,q+1))`,m,l):h?(d(`v=r.%s()`,p)(`if(types[%i].valuesById[v]!==undefined){`,l)(`if(!(%s&&%s.length))`,m,m)(`%s=[]`,m)(`%s.push(v)`,m)(`}else`),s(d,`r.raw(s,r.pos)`)):d(`%s.push(r.%s())`,m,p===`string`?o(f):p)):r.basic[p]===void 0?(d(`case %i:{`,f.id)(`if(u!==%i)`,f.delimited?3:2)(`break`),f.delimited?d(`%s=types[%i].decode(r,undefined,%i,q+1,%s)`,m,l,f.id*8+4,m):d(`%s=types[%i].decode(r,r.uint32(),undefined,q+1,%s)`,m,l,m)):f.hasPresence?(d(`case %i:{`,f.id)(`if(u!==%i)`,r.basic[p])(`break`),h?(d(`v=r.%s()`,p)(`if(types[%i].valuesById[v]!==undefined){`,l)(`%s=v`,m),f.partOf&&d(`m%s=%j`,i.safeProp(f.partOf.name),f.name),d(`}else`),s(d,`r.raw(s,r.pos)`)):d(`%s=r.%s()`,m,p===`string`?o(f):p)):(d(`case %i:{`,f.id)(`if(u!==%i)`,r.basic[p])(`break`),h?(d(`v=r.%s()`,p)(`if(types[%i].valuesById[v]!==undefined){`,l)(`if(v!==%j)`,f.typeDefault)(`%s=v`,m)(`else`)(`delete %s`,m)(`}else{`),s(d,`r.raw(s,r.pos)`)(`}`)):(f.resolvedType instanceof n&&f.typeDefault!==0?d(`if((v=r.%s())!==%j)`,p,f.typeDefault):p===`string`?d(`if((v=r.%s()).length)`,o(f)):p===`bytes`?d(`if((v=r.%s()).length)`,p):r.long[p]===void 0?d(p===`double`||p===`float`?`if(!Object.is(v=r.%s(),0))`:`if(v=r.%s())`,p):d(`if(typeof(v=r.%s())==="object"?v.low||v.high:v!==0)`,p),d(`%s=v`,m)(`else`)(`delete %s`,m)));f.partOf&&!h&&d(`m%s=%j`,i.safeProp(f.partOf.name),f.name),d(`continue`)(`}`)}for(l&&d(`}`),d(`r.skipType(%s,q,t)`,l?`u`:`t&7`),s(d,`r.raw(s,r.pos)`)(`}`)(`if(l!==undefined){`)(`if(r.pos!==c)`)(`throw RangeError("index out of range")`)(`r.len=l`)(`}`)(`if(z!==undefined)`)(`throw Error("missing end group")`),l=0;l<e._fieldsArray.length;++l){var _=e._fieldsArray[l];_.required&&d(`if(!Object.hasOwnProperty.call(m,%j))`,_.name)(`throw util.ProtocolError(%j,{instance:m})`,a(_))}return d(`return m`)}}}),pt=m({"node_modules/protobufjs/src/verifier.js"(e,t){t.exports=s;var n=St(),r=G();function i(e,t){return e.name+`: `+t+(e.repeated&&t!==`array`?`[]`:e.map&&t!==`object`?`{k:`+e.keyType+`}`:``)+` expected`}function a(e,t,r,a){var o=t.resolvedType;if(o){if(o instanceof n){if(o._features.enum_type===`CLOSED`){e(`switch(%s){`,a)(`default:`)(`return%j`,i(t,`enum value`));for(var s=Object.keys(o.values),c=0;c<s.length;++c)e(`case %i:`,o.values[s[c]]);e(`break`)(`}`)}else e(`if(typeof %s!=="number"||(%s|0)!==%s)`,a,a,a)(`return%j`,i(t,`enum value`))}else e(`{`)(`var e=types[%i].verify(%s,q+1);`,r,a)(`if(e)`)(`return%j+e`,t.name+`.`)(`}`)}else switch(t.type){case`int32`:case`uint32`:case`sint32`:case`fixed32`:case`sfixed32`:e(`if(!util.isInteger(%s))`,a)(`return%j`,i(t,`integer`));break;case`int64`:case`uint64`:case`sint64`:case`fixed64`:case`sfixed64`:e(`if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))`,a,a,a,a)(`return%j`,i(t,`integer|Long`));break;case`float`:case`double`:e(`if(typeof %s!=="number")`,a)(`return%j`,i(t,`number`));break;case`bool`:e(`if(typeof %s!=="boolean")`,a)(`return%j`,i(t,`boolean`));break;case`string`:e(`if(!util.isString(%s))`,a)(`return%j`,i(t,`string`));break;case`bytes`:e(`if(!(%s&&typeof %s.length==="number"||util.isString(%s)))`,a,a,a)(`return%j`,i(t,`buffer`))}return e}function o(e,t,n){switch(t.keyType){case`int32`:case`uint32`:case`sint32`:case`fixed32`:case`sfixed32`:e(`if(!util.key32Re.test(%s))`,n)(`return%j`,i(t,`integer key`));break;case`int64`:case`uint64`:case`sint64`:case`fixed64`:case`sfixed64`:e(`if(!util.key64Re.test(%s))`,n)(`return%j`,i(t,`integer|Long key`));break;case`bool`:e(`if(!util.key2Re.test(%s))`,n)(`return%j`,i(t,`boolean key`))}return e}function s(e){var t=r.codegen([`m`,`q`])(`if(typeof m!=="object"||m===null)`)(`return%j`,`object expected`)(`if(q===undefined)q=0`)(`if(q>util.recursionLimit)`)(`return%j`,`max depth exceeded`),n=e.oneofsArray,s={};n.length&&t(`var p={}`);for(var c=0;c<e.fieldsArray.length;++c){var l=e._fieldsArray[c].resolve(),u=`m`+r.safeProp(l.name);if(l.optional&&t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j)){`,u,l.name),l.map)t(`if(!util.isObject(%s))`,u)(`return%j`,i(l,`object`))(`var k=Object.keys(%s)`,u)(`for(var i=0;i<k.length;++i){`),o(t,l,`k[i]`),a(t,l,c,u+`[k[i]]`)(`}`);else if(l.repeated)t(`if(!Array.isArray(%s))`,u)(`return%j`,i(l,`array`))(`for(var i=0;i<%s.length;++i){`,u),a(t,l,c,u+`[i]`)(`}`);else{if(l.partOf){var d=r.safeProp(l.partOf.name);s[l.partOf.name]===1&&t(`if(p%s===1)`,d)(`return%j`,l.partOf.name+`: multiple values`),s[l.partOf.name]=1,t(`p%s=1`,d)}a(t,l,c,u)}l.optional&&t(`}`)}return t(`return null`)}}}),mt=m({"node_modules/protobufjs/src/converter.js"(e){var t=e,n=St(),r=vt(),i=G();function a(e,t,r,i,a){if(t.resolvedType){if(t.resolvedType instanceof n){var o=a?`m`+a+`[m`+a+`.length]`:`m`+i;e(`switch(d%s){`,i);for(var s=t.resolvedType.values,c=Object.keys(s),l=0;l<c.length;++l)e(`case%j:`,c[l])(`case %i:`,s[c[l]])(`%s=%j`,o,s[c[l]])(`break`);e(`default:`),t.resolvedType._features.enum_type!==`CLOSED`&&e(`if(typeof d%s==="number"&&(d%s|0)===d%s)`,i,i,i)(`%s=d%s`,o,i),e(`}`)}else e(`if(!util.isObject(d%s))`,i)(`throw TypeError(%j)`,t.fullName+`: object expected`)(`m%s=types[%i].fromObject(d%s,q+1)`,i,r,i)}else{var u=!1;switch(t.type){case`double`:case`float`:e(`m%s=Number(d%s)`,i,i);break;case`uint32`:case`fixed32`:e(`m%s=d%s>>>0`,i,i);break;case`int32`:case`sint32`:case`sfixed32`:e(`m%s=d%s|0`,i,i);break;case`uint64`:case`fixed64`:u=!0;case`int64`:case`sint64`:case`sfixed64`:e(`if(util.Long)`)(`m%s=util.Long.fromValue(d%s,%j)`,i,i,u)(`else if(typeof d%s==="string")`,i)(`m%s=parseInt(d%s,10)`,i,i)(`else if(typeof d%s==="number")`,i)(`m%s=d%s`,i,i)(`else if(typeof d%s==="object")`,i)(`m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)`,i,i,i,u?`true`:``);break;case`bytes`:e(`if(typeof d%s==="string")`,i)(`util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)`,i,i,i)(`else if(d%s.length>=0)`,i)(`m%s=d%s`,i,i);break;case`string`:e(`m%s=String(d%s)`,i,i);break;case`bool`:e(`m%s=Boolean(d%s)`,i,i)}}return e}t.fromObject=function(e){var t=e.fieldsArray,o=i.codegen([`d`,`q`])(`if(d instanceof C)`)(`return d`)(`if(!util.isObject(d))`)(`throw TypeError(%j)`,e.fullName+`: object expected`)(`if(q===undefined)q=0`)(`if(q>util.recursionLimit)`)(`throw Error("max depth exceeded")`);if(!t.length)return o(`return new C`);o(`var m=new C`);for(var s=0;s<t.length;++s){var c=t[s].resolve(),l=i.safeProp(c.name),u=!c.hasPresence&&!c.repeated&&!c.map&&(c.resolvedType instanceof n||r.basic[c.type]!==void 0);c.map?(o(`if(d%s){`,l)(`if(!util.isObject(d%s))`,l)(`throw TypeError(%j)`,c.fullName+`: object expected`)(`m%s={}`,l)(`for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){`,l),o(`if(ks[i]==="__proto__")`)(`util.makeProp(m%s,ks[i])`,l),a(o,c,s,l+`[ks[i]]`)(`}`)(`}`)):c.repeated?(o(`if(d%s){`,l)(`if(!Array.isArray(d%s))`,l)(`throw TypeError(%j)`,c.fullName+`: array expected`),c.resolvedType instanceof n?o(`m%s=[]`,l):o(`m%s=Array(d%s.length)`,l,l),o(`for(var i=0;i<d%s.length;++i){`,l),a(o,c,s,l+`[i]`,c.resolvedType instanceof n?l:void 0)(`}`)(`}`)):(c.resolvedType instanceof n||o(`if(d%s!=null){`,l),u&&(c.resolvedType instanceof n?o(`if(d%s!==%j&&(typeof d%s!=="string"||types[%i].values[d%s]!==%j)){`,l,c.typeDefault,l,s,l,c.typeDefault):c.type===`string`?o(`if(typeof d%s!=="string"||d%s.length){`,l,l):c.type===`bytes`?o(`if(d%s.length){`,l):c.type===`bool`?o(`if(d%s){`,l):c.type===`double`||c.type===`float`?o(`if(!Object.is(Number(d%s),0)){`,l):r.long[c.type]===void 0?o(`if(Number(d%s)!==0){`,l):o(`if(typeof d%s==="object"?d%s.low||d%s.high:Number(d%s)!==0){`,l,l,l,l)),a(o,c,s,l),u&&o(`}`),c.resolvedType instanceof n||o(`}`))}return o(`return m`)};function o(e,t,r,i,a){if(a||=i,t.resolvedType)t.resolvedType instanceof n?e(`d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s`,i,r,a,a,r,a,a):e(`d%s=types[%i].toObject(m%s,o,q+1)`,i,r,a);else{var o=!1;switch(t.type){case`double`:case`float`:e(`d%s=o.json&&!isFinite(m%s)?String(m%s):m%s`,i,a,a,a);break;case`uint64`:case`fixed64`:o=!0;case`int64`:case`sint64`:case`sfixed64`:e(`if(typeof BigInt!=="undefined"&&o.longs===BigInt)`)(`d%s=typeof m%s==="number"?BigInt(m%s):util.Long.fromBits(m%s.low>>>0,m%s.high>>>0,%j).toBigInt()`,i,a,a,a,a,o)(`else if(typeof m%s==="number")`,a)(`d%s=o.longs===String?String(m%s):m%s`,i,a,a)(`else`)(`d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s`,i,a,a,a,o?`true`:``,a);break;case`bytes`:e(`d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s`,i,a,a,a,a);break;default:e(`d%s=m%s`,i,a)}}return e}t.toObject=function(e){var t=e.fieldsArray.slice().sort(i.compareFieldsById);if(!t.length)return i.codegen()(`return {}`);for(var a=i.codegen([`m`,`o`,`q`])(`if(!o)`)(`o={}`)(`if(q===undefined)q=0`)(`if(q>util.recursionLimit)`)(`throw Error("max depth exceeded")`)(`var d={}`),s=[],c=[],l=[],u=0;u<t.length;++u)t[u].partOf||(t[u].resolve().repeated?s:t[u].map?c:l).push(t[u]);if(s.length){for(a(`if(o.arrays||o.defaults){`),u=0;u<s.length;++u)a(`d%s=[]`,i.safeProp(s[u].name));a(`}`)}if(c.length){for(a(`if(o.objects||o.defaults){`),u=0;u<c.length;++u)a(`d%s={}`,i.safeProp(c[u].name));a(`}`)}if(l.length){for(a(`if(o.defaults){`),u=0;u<l.length;++u){var d=l[u],f=i.safeProp(d.name);if(d.resolvedType instanceof n)a(`d%s=o.enums===String?%j:%j`,f,d.resolvedType.valuesById[d.typeDefault],d.typeDefault);else if(d.long)a(`if(util.Long){`)(`var n=new util.Long(%i,%i,%j)`,d.typeDefault.low,d.typeDefault.high,d.typeDefault.unsigned)(`d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():typeof BigInt!=="undefined"&&o.longs===BigInt?n.toBigInt():n`,f)(`}else`)(`d%s=o.longs===String?%j:typeof BigInt!=="undefined"&&o.longs===BigInt?BigInt(%j):%i`,f,d.typeDefault.toString(),d.typeDefault.toString(),d.typeDefault.toNumber());else if(d.bytes){var p=Array.prototype.slice.call(d.typeDefault);a(`if(o.bytes===String)d%s=%j`,f,i.base64.encode(d.typeDefault,0,d.typeDefault.length))(`else{`)(`d%s=%j`,f,p)(`if(o.bytes!==Array)d%s=util.newBuffer(d%s)`,f,f)(`}`)}else(d.type===`double`||d.type===`float`)&&typeof d.typeDefault==`number`&&(!isFinite(d.typeDefault)||Object.is(d.typeDefault,-0))?a(`d%s=%f`,f,d.typeDefault)(`if(o.json&&!isFinite(d%s))d%s=String(d%s)`,f,f,f):a(`d%s=%j`,f,d.typeDefault)}a(`}`)}var m=!1;for(u=0;u<t.length;++u){var d=t[u],h=e._fieldsArray.indexOf(d),f=i.safeProp(d.name);if(d.map){m||(m=!0,a(`var ks2`)),a(`if(m%s&&(ks2=Object.keys(m%s)).length){`,f,f)(`d%s={}`,f);var g=r.long[d.keyType]!==void 0,_=f+`[ks2[j]]`;a(`for(var j=0;j<ks2.length;++j){`),g&&a(`var k2=util.longFromKey(ks2[j],%j).toString()`,d.keyType===`uint64`||d.keyType===`fixed64`),a(`if(ks2[j]==="__proto__")`)(`util.makeProp(d%s,ks2[j])`,f),o(a,d,h,g?f+`[k2]`:_,_)(`}`)}else d.repeated?(a(`if(m%s&&m%s.length){`,f,f)(`d%s=Array(m%s.length)`,f,f)(`for(var j=0;j<m%s.length;++j){`,f),o(a,d,h,f+`[j]`)(`}`)):(a(`if(m%s!=null&&Object.hasOwnProperty.call(m,%j)){`,f,d.name),o(a,d,h,f),d.partOf&&!d.partOf.isProto3Optional&&a(`if(o.oneofs)`)(`d%s=%j`,i.safeProp(d.partOf.name),d.name));a(`}`)}return a(`return d`)}}}),ht=m({"node_modules/protobufjs/src/wrappers.js"(e){var t=e,n=dt(),r=Ke();t[`.google.protobuf.Any`]={fromObject:function(e,t){if(t===void 0&&(t=0),t>r.recursionLimit)throw Error(`max depth exceeded`);if(e&&e[`@type`]){var n=e[`@type`].substring(e[`@type`].lastIndexOf(`/`)+1),i=this.lookup(n,[this.constructor]);if(i){var a=e[`@type`].charAt(0)===`.`?e[`@type`].slice(1):e[`@type`];return a.indexOf(`/`)===-1&&(a=`/`+a),this.create({type_url:a,value:i.encode(i.fromObject(e,t+1)).finish()})}}return this.fromObject(e,t)},toObject:function(e,t,i){if(i===void 0&&(i=0),i>r.recursionLimit)throw Error(`max depth exceeded`);var a=`type.googleapis.com/`,o=``,s=``;if(t&&t.json&&e.type_url&&e.value){s=e.type_url.substring(e.type_url.lastIndexOf(`/`)+1),o=e.type_url.substring(0,e.type_url.lastIndexOf(`/`)+1);var c=this.lookup(s,[this.constructor]);c&&(e=c.decode(e.value,void 0,void 0,i+1))}if(!(e instanceof this.ctor)&&e instanceof n){var l=e.$type.toObject(e,t,i+1),u=e.$type.fullName[0]===`.`?e.$type.fullName.slice(1):e.$type.fullName;return o===``&&(o=a),s=o+u,l[`@type`]=s,l}return this.toObject(e,t,i)}}}}),gt=m({"node_modules/protobufjs/src/type.js"(e,t){t.exports=_;var n=st();_.prototype=Object.create(n.prototype,{constructor:{value:_,writable:!0,enumerable:!1,configurable:!0}}),_.className=`Type`;var r=St(),i=bt(),a=yt(),o=ct(),s=ut(),c=dt(),l=Ye(),u=qe(),d=G(),f=Ct(),p=ft(),m=pt(),h=mt(),g=ht();function _(e,t){e=e.replace(/\W/g,``),n.call(this,e,t),this.fields={},this.oneofs=void 0,this.extensions=void 0,this.reserved=void 0,this.group=void 0,this.visibility=void 0,this._fieldsById=null,this._fieldsArray=null,this._oneofsArray=null,this._ctor=null,this._fieldsByJsonName=null}Object.defineProperties(_.prototype,{fieldsById:{get:function(){if(this._fieldsById)return this._fieldsById;this._fieldsById={};for(var e=Object.keys(this.fields),t=0;t<e.length;++t){var n=this.fields[e[t]],r=n.id;if(this._fieldsById[r])throw Error(`duplicate id `+r+` in `+this);this._fieldsById[r]=n}return this._fieldsById}},fieldsArray:{get:function(){return this._fieldsArray||=d.toArray(this.fields)}},oneofsArray:{get:function(){return this._oneofsArray||=d.toArray(this.oneofs)}},ctor:{get:function(){return this._ctor||(this.ctor=_.generateConstructor(this)())},set:function(e){var t=e.prototype;t instanceof c||(e.prototype=new c,Object.defineProperty(e.prototype,"constructor",{value:e,writable:!0,enumerable:!1,configurable:!0}),d.merge(e.prototype,t)),e.$type=e.prototype.$type=this,d.merge(e,c,!0),this._ctor=e,delete this.decode,delete this.fromObject;for(var n=0,r;n<this.fieldsArray.length;++n)r=this._fieldsArray[n].resolve(),e.prototype[r.name]=r.defaultValue;var i={};for(n=0;n<this.oneofsArray.length;++n)i[this._oneofsArray[n].resolve().name]={get:d.oneOfGetter(this._oneofsArray[n].oneof),set:d.oneOfSetter(this._oneofsArray[n].oneof)};n&&Object.defineProperties(e.prototype,i)}}}),_.generateConstructor=function(e){for(var t=d.codegen([`p`]),n=0,r;n<e.fieldsArray.length;++n)(r=e._fieldsArray[n]).map?t(`this%s={}`,d.safeProp(r.name)):r.repeated&&t(`this%s=[]`,d.safeProp(r.name));return t(`if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null&&ks[i]!=="__proto__")`)(`this[ks[i]]=p[ks[i]]`)};function v(e){return e._fieldsById=e._fieldsArray=e._oneofsArray=e._fieldsByJsonName=null,delete e.encode,delete e.decode,delete e.verify,e}_.fromJSON=function(e,t,c){if(c===void 0&&(c=0),c>d.nestingLimit)throw Error(`max depth exceeded`);var l=new _(e,t.options);l.extensions=t.extensions,l.reserved=t.reserved;for(var u=Object.keys(t.fields),f=0;f<u.length;++f)l.add((typeof t.fields[u[f]].keyType<`u`?o.fromJSON:a.fromJSON)(u[f],t.fields[u[f]]));if(t.oneofs)for(u=Object.keys(t.oneofs),f=0;f<u.length;++f)l.add(i.fromJSON(u[f],t.oneofs[u[f]]));if(t.nested)for(u=Object.keys(t.nested),f=0;f<u.length;++f){var p=t.nested[u[f]];l.add((p.id===void 0?p.fields===void 0?p.values===void 0?p.methods===void 0?n.fromJSON:s.fromJSON:r.fromJSON:_.fromJSON:a.fromJSON)(u[f],p,c+1))}return t.extensions&&t.extensions.length&&(l.extensions=t.extensions),t.reserved&&t.reserved.length&&(l.reserved=t.reserved),t.group&&(l.group=!0),t.visibility&&(l.visibility=t.visibility),t.comment&&(l.comment=t.comment),t.edition&&(l._edition=t.edition),l._defaultEdition=`proto3`,l},_.prototype.toJSON=function(e){var t=n.prototype.toJSON.call(this,e),r=e?!!e.keepComments:!1;return d.toObject([`edition`,this._editionToJSON(),`options`,t&&t.options||void 0,`oneofs`,n.arrayToJSON(this.oneofsArray,e),`fields`,n.arrayToJSON(this.fieldsArray.filter(function(e){return!e.declaringField}),e)||{},`extensions`,this.extensions&&this.extensions.length?this.extensions:void 0,`reserved`,this.reserved&&this.reserved.length?this.reserved:void 0,`group`,this.group||void 0,`visibility`,this.visibility,`nested`,t&&t.nested||void 0,`comment`,r?this.comment:void 0])},_.prototype.resolveAll=function(){if(!this._needsRecursiveResolve)return this;n.prototype.resolveAll.call(this);var e=this.oneofsArray;for(r=0;r<e.length;)e[r++].resolve();for(var t=this.fieldsArray,r=0;r<t.length;)t[r++].resolve();return this},_.prototype._resolveFeaturesRecursive=function(e){return this._needsRecursiveFeatureResolution&&(e=this._edition||e,n.prototype._resolveFeaturesRecursive.call(this,e),this.oneofsArray.forEach(t=>{t._resolveFeatures(e)}),this.fieldsArray.forEach(t=>{t._resolveFeatures(e)})),this},_.prototype.get=function(e){return Object.prototype.hasOwnProperty.call(this.fields,e)?this.fields[e]:this.oneofs&&Object.prototype.hasOwnProperty.call(this.oneofs,e)?this.oneofs[e]:this.nested&&Object.prototype.hasOwnProperty.call(this.nested,e)?this.nested[e]:null},_.prototype.add=function(e){if(this.get(e.name))throw Error(`duplicate name '`+e.name+`' in `+this);if(e instanceof a&&e.extend===void 0){if(this._fieldsById?
/* istanbul ignore next */
this._fieldsById[e.id]:this.fieldsById[e.id])throw Error(`duplicate id `+e.id+` in `+this);if(this.isReservedId(e.id))throw Error(`id `+e.id+` is reserved in `+this);if(this.isReservedName(e.name)||e.name.charAt(0)===`$`)throw Error(`name '`+e.name+`' is reserved in `+this);return e.name===`__proto__`?this:(e.parent&&e.parent.remove(e),this.fields[e.name]=e,e.message=this,e.onAdd(this),v(this))}if(e instanceof i){if(e.name.charAt(0)===`$`)throw Error(`name '`+e.name+`' is reserved in `+this);return e.name===`__proto__`?this:(this.oneofs||={},this.oneofs[e.name]=e,e.onAdd(this),v(this))}return n.prototype.add.call(this,e)},_.prototype.remove=function(e){if(e instanceof a&&e.extend===void 0){if(!d.remove(this.fields,e,e.name))throw Error(e+` is not a member of `+this);return e.parent=null,e.onRemove(this),v(this)}if(e instanceof i){if(!d.remove(this.oneofs,e,e.name))throw Error(e+` is not a member of `+this);return e.parent=null,e.onRemove(this),v(this)}return n.prototype.remove.call(this,e)},_.prototype.isReservedId=function(e){return n.isReservedId(this.reserved,e)},_.prototype.isReservedName=function(e){return n.isReservedName(this.reserved,e)},_.prototype.create=function(e){return new this.ctor(e)},_.prototype.setup=function(){var e=this.root;if(e&&e._needsRecursiveFeatureResolution){var t=e._edition||this._edition;t&&e._resolveFeaturesRecursive(t)}for(var n=this.fullName,r=[],i=0;i<this.fieldsArray.length;++i)r.push(this._fieldsArray[i].resolve().resolvedType);this.encode=f(this)({Writer:u,types:r,util:d}),this.decode=p(this)({Reader:l,types:r,util:d,C:this.ctor}),this.verify=m(this)({types:r,util:d}),this.fromObject=h.fromObject(this)({types:r,util:d,C:this.ctor}),this.toObject=h.toObject(this)({types:r,util:d});var a=g[n];if(a){var o=Object.create(this);o._ctor=this.ctor,o.fromObject=this.fromObject,this.fromObject=a.fromObject.bind(o),o.toObject=this.toObject,this.toObject=a.toObject.bind(o)}return this},_.prototype.encode=function(e,t){return this.setup().encode.apply(this,arguments)},_.prototype.encodeDelimited=function(e,t){return this.encode(e,(t||u.create()).fork()).ldelim()},_.prototype.decode=function(e,t){return this.setup().decode.apply(this,arguments)},_.prototype.decodeDelimited=function(e){return e instanceof l||(e=l.create(e)),this.decode(e,e.uint32())},_.prototype.verify=function(e){return this.setup().verify.apply(this,arguments)},_.prototype.fromObject=function(e){return this.setup().fromObject.apply(this,arguments)},_.prototype.toObject=function(e,t){return this.setup().toObject.apply(this,arguments)},_.prototype.getTypeUrl=function(e){e===void 0&&(e=`type.googleapis.com`);var t=this.fullName;return e+`/`+(t.charAt(0)===`.`?t.substring(1):t)},_.d=function(e){return function(t){d.decorateType(t,e)}}}}),_t=m({"node_modules/protobufjs/src/root.js"(e,t){t.exports=u;var n=st();u.prototype=Object.create(n.prototype,{constructor:{value:u,writable:!0,enumerable:!1,configurable:!0}}),u.className=`Root`;var r=yt(),i=St(),a=bt(),o=G(),s,c,l;function u(e){n.call(this,``,e),this.deferred=[],this.files=[],this._edition=`proto2`,this._fullyQualifiedObjects={}}u.fromJSON=function(e,t,n){if(n===void 0&&(n=0),n>o.recursionLimit)throw Error(`max depth exceeded`);return t||=new u,e.options&&t.setOptions(e.options),t.addJSON(e.nested,n).resolveAll()},u.prototype.resolvePath=o.path.resolve,u.prototype.fetch=o.fetch;function d(){}u.prototype.load=function e(t,n,r){typeof n==`function`&&(r=n,n=void 0);var i=this;if(!r)return o.asPromise(e,i,t,n);var a=r===d;function s(e,t){if(r){if(a)throw e;t&&t.resolveAll();var n=r;r=null,n(e,t)}}function u(e){var t=e.lastIndexOf(`google/protobuf/`);if(t>-1){var n=e.substring(t);if(Object.prototype.hasOwnProperty.call(l,n))return n}return Object.prototype.hasOwnProperty.call(l,e)?e:null}function f(e,t,r){r===void 0&&(r=0);try{if(r>o.recursionLimit)throw Error(`max depth exceeded`);if(o.isString(t)&&t.charAt(0)===`{`&&(t=JSON.parse(t)),!o.isString(t))i.setOptions(t.options).addJSON(t.nested);else{c.filename=e;var l=c(t,i,n),d,f=0;if(l.imports)for(;f<l.imports.length;++f)(d=u(l.imports[f])||i.resolvePath(e,l.imports[f]))&&p(d,!1,r+1);if(l.weakImports)for(f=0;f<l.weakImports.length;++f)(d=u(l.weakImports[f])||i.resolvePath(e,l.weakImports[f]))&&p(d,!0,r+1)}}catch(e){s(e)}!a&&!m&&s(null,i)}function p(e,t,n){if(n===void 0&&(n=0),e=u(e)||e,!(i.files.indexOf(e)>-1)){if(i.files.push(e),Object.prototype.hasOwnProperty.call(l,e)){a?f(e,l[e],n):(++m,setTimeout(function(){--m,f(e,l[e],n)}));return}if(a){var c;try{c=o.fs.readFileSync(e).toString(`utf8`)}catch(e){t||s(e);return}f(e,c,n)}else++m,i.fetch(e,function(a,o){if(--m,r){if(a){t?m||s(null,i):s(a);return}f(e,o,n)}})}}var m=0;o.isString(t)&&(t=[t]);for(var h=0,g;h<t.length;++h)(g=i.resolvePath(``,t[h]))&&p(g);return a?(i.resolveAll(),i):(m||s(null,i),i)},u.prototype.loadSync=function(e,t){if(!o.isNode)throw Error(`not supported`);return this.load(e,t,d)},u.prototype.resolveAll=function(){if(!this._needsRecursiveResolve)return this;if(this.deferred.length)throw Error(`unresolvable extensions: `+this.deferred.map(function(e){return`'extend `+e.extend+`' in `+e.parent.fullName}).join(`, `));return n.prototype.resolveAll.call(this)};var f=/^[A-Z]/;function p(e,t){var n=t.parent.lookup(t.extend);if(n){var i=new r(t.fullName,t.id,t.type,t.rule,void 0,t.options);return n.get(i.name)||(i.declaringField=t,t.extensionField=i,n.add(i)),!0}return!1}u.prototype._handleAdd=function(e){if(e instanceof r)e.extend!==void 0&&!e.extensionField&&(p(this,e)||this.deferred.push(e));else if(e instanceof i)f.test(e.name)&&(e.parent[e.name]=e.values);else if(!(e instanceof a)){if(e instanceof s)for(var t=0;t<this.deferred.length;)p(this,this.deferred[t])?this.deferred.splice(t,1):++t;for(var n=0;n<e.nestedArray.length;++n)this._handleAdd(e._nestedArray[n]);f.test(e.name)&&(e.parent[e.name]=e)}(e instanceof s||e instanceof i||e instanceof r)&&(this._fullyQualifiedObjects[e.fullName]=e)},u.prototype._handleRemove=function(e){if(e instanceof r){if(e.extend!==void 0){if(e.extensionField)e.extensionField.parent.remove(e.extensionField),e.extensionField=null;else{var t=this.deferred.indexOf(e);t>-1&&this.deferred.splice(t,1)}}}else if(e instanceof i)f.test(e.name)&&delete e.parent[e.name];else if(e instanceof n){for(var a=0;a<e.nestedArray.length;++a)this._handleRemove(e._nestedArray[a]);f.test(e.name)&&delete e.parent[e.name]}delete this._fullyQualifiedObjects[e.fullName]},u._configure=function(e,t,n){s=e,c=t,l=n}}}),G=m({"node_modules/protobufjs/src/util.js"(e,t){var n=t.exports=Ke(),r=$e(),i,a;n.codegen=nt(),n.fetch=at(),n.path=ot(),n.patterns=tt();var o=n.patterns.reservedRe;n.fs=it(),n.toArray=function(e){if(e){for(var t=Object.keys(e),n=Array(t.length),r=0;r<t.length;)n[r]=e[t[r++]];return n}return[]},n.toObject=function(e){for(var t={},n=0;n<e.length;){var r=e[n++],i=e[n++];i!==void 0&&(t[r]=i)}return t},n.remove=function(e,t,n){if(!e)return!1;if(n!==void 0&&Object.prototype.hasOwnProperty.call(e,n)&&e[n]===t)return delete e[n],!0;for(var r=Object.keys(e),i=0;i<r.length;++i)if(e[r[i]]===t)return delete e[r[i]],!0;return!1},n.isReserved=function(e){return o.test(e)},n.safeProp=function(e){return!/^[$\w_]+$/.test(e)||o.test(e)?`[`+JSON.stringify(e)+`]`:`.`+e},n.ucFirst=function(e){return e.charAt(0).toUpperCase()+e.substring(1)};var s=/_([a-z])/g;n.camelCase=function(e){return e.substring(0,1)+e.substring(1).replace(s,function(e,t){return t.toUpperCase()})},n.jsonName=function(e){for(var t=``,n=!1,r=0;r<e.length;++r){var i=e.charAt(r);i===`_`?n=!0:n?(t+=i.toUpperCase(),n=!1):t+=i}return t},n.compareFieldsById=function(e,t){return e.id-t.id},n.decorateType=function(e,t){if(e.$type)return t&&e.$type.name!==t&&(n.decorateRoot.remove(e.$type),e.$type.name=t,n.decorateRoot.add(e.$type)),e.$type;i||=gt();var r=new i(t||e.name);return n.decorateRoot.add(r),r.ctor=e,Object.defineProperty(e,"$type",{value:r,enumerable:!1}),Object.defineProperty(e.prototype,"$type",{value:r,enumerable:!1}),r};var c=0;n.decorateEnum=function(e){if(e.$type)return e.$type;a||=St();var t=new a(`Enum`+c++,e);return n.decorateRoot.add(t),Object.defineProperty(e,"$type",{value:t,enumerable:!1}),t},n.setProperty=function(e,t,r,i){function a(e,t,r){var o=t.shift();if(n.isUnsafeProperty(o))return e;if(t.length>0)e[o]=a(e[o]||{},t,r);else{var s=e[o];if(s&&i)return e;s&&(r=[].concat(s,r)),e[o]=r}return e}if(typeof e!=`object`)throw TypeError(`dst must be an object`);if(!t)throw TypeError(`path must be specified`);if(t=t.split(`.`),t.length>n.recursionLimit)throw Error(`max depth exceeded`);return a(e,t,r)},Object.defineProperty(n,"decorateRoot",{get:function(){return r.decorated||=new(_t())}})}}),vt=m({"node_modules/protobufjs/src/types.js"(e){var t=e,n=G(),r=[`double`,`float`,`int32`,`uint32`,`sint32`,`fixed32`,`sfixed32`,`int64`,`uint64`,`sint64`,`fixed64`,`sfixed64`,`bool`,`string`,`bytes`];function i(e,t){var n=0,i=/* @__PURE__ */ Object.create(null);for(t|=0;n<e.length;)i[r[n+t]]=e[n++];return i}t.basic=i([1,5,0,0,0,5,5,0,0,0,1,1,0,2,2]),t.defaults=i([0,0,0,0,0,0,0,0,0,0,0,0,!1,``,n.emptyArray,null]),t.long=i([0,0,0,1,1],7),t.mapKey=i([0,0,0,5,5,0,0,0,1,1,0,2],2),t.packed=i([1,5,0,0,0,5,5,0,0,0,1,1,0])}}),yt=m({"node_modules/protobufjs/src/field.js"(e,t){t.exports=c;var n=xt();c.prototype=Object.create(n.prototype,{constructor:{value:c,writable:!0,enumerable:!1,configurable:!0}}),c.className=`Field`;var r=St(),i=vt(),a=G(),o,s=/^(?:required|optional|repeated)$/;c.fromJSON=function(e,t){var n=new c(e,t.id,t.type,t.rule,t.extend,t.options,t.comment);return t.edition&&(n._edition=t.edition),t.protoName&&(n.protoName=t.protoName),t.jsonName===void 0?t.options&&t.options.json_name!==void 0&&(n.jsonName=t.options.json_name):n.jsonName=t.jsonName,n._defaultEdition=`proto3`,n};function c(e,t,r,o,c,l,u){if(a.isObject(o)?(u=c,l=o,o=c=void 0):a.isObject(c)&&(u=l,l=c,c=void 0),n.call(this,e,l),!a.isInteger(t)||t<0)throw TypeError(`id must be a non-negative integer`);if(!a.isString(r))throw TypeError(`type must be a string`);if(o!==void 0&&!s.test(o=o.toString().toLowerCase()))throw TypeError(`rule must be a string rule`);if(c!==void 0&&!a.isString(c))throw TypeError(`extend must be a string`);this.rule=o&&o!==`optional`?o:void 0,this.type=r,this.id=t,this.extend=c||void 0,this.repeated=o===`repeated`,this.map=!1,this.message=null,this.partOf=null,this.typeDefault=null,this.defaultValue=null,this.long=a.Long?i.long[r]!==void 0:
/* istanbul ignore next */
!1,this.bytes=r===`bytes`,this.resolvedType=null,this.extensionField=null,this.declaringField=null,this.comment=u,this.protoName=void 0,this.jsonName=void 0}Object.defineProperty(c.prototype,"required",{get:function(){return this._features.field_presence===`LEGACY_REQUIRED`}}),Object.defineProperty(c.prototype,"optional",{get:function(){return!this.required}}),Object.defineProperty(c.prototype,"delimited",{get:function(){return this.resolvedType instanceof o&&this._features.message_encoding===`DELIMITED`}}),Object.defineProperty(c.prototype,"packed",{get:function(){return this._features.repeated_field_encoding===`PACKED`}}),Object.defineProperty(c.prototype,"hasPresence",{get:function(){return this.repeated||this.map?!1:this.partOf||this.declaringField||this.extensionField||this._features.field_presence!==`IMPLICIT`}}),c.prototype.setOption=function(e,t,r){return n.prototype.setOption.call(this,e,t,r)},c.prototype.toJSON=function(e){var t=e?!!e.keepComments:!1;return a.toObject([`edition`,this._editionToJSON(),`rule`,this.rule!==`optional`&&this.rule||void 0,`type`,this.type,`id`,this.id,`extend`,this.extend,`protoName`,this.protoName===this.name?void 0:this.protoName,`jsonName`,this.jsonName===a.jsonName(this.protoName||this.name)?void 0:this.jsonName,`options`,this.options,`comment`,t?this.comment:void 0])},c.prototype.resolve=function(){if(this.resolved)return this;if((this.typeDefault=i.defaults[this.type])===void 0?(this.resolvedType=(this.declaringField?this.declaringField.parent:this.parent).lookupTypeOrEnum(this.type),this.typeDefault=this.resolvedType instanceof o?null:this.resolvedType.values[Object.keys(this.resolvedType.values)[0]]):this.options&&this.options.proto3_optional&&(this.typeDefault=null),this.options&&this.options.default!=null&&(this.typeDefault=this.options.default,this.resolvedType instanceof r&&typeof this.typeDefault==`string`&&(this.typeDefault=this.resolvedType.values[this.typeDefault])),this.options&&(this.options.packed!==void 0&&this.resolvedType&&!(this.resolvedType instanceof r)&&delete this.options.packed,Object.keys(this.options).length||(this.options=void 0)),this.long){var e=this.type===`uint64`||this.type===`fixed64`;this.typeDefault=typeof this.typeDefault==`string`?a.Long.fromString(this.typeDefault,e):a.Long.fromNumber(this.typeDefault,e),Object.freeze&&Object.freeze(this.typeDefault)}else if(i.long[this.type]!==void 0&&typeof this.typeDefault==`string`)this.typeDefault=parseInt(this.typeDefault,10);else if(this.bytes&&typeof this.typeDefault==`string`){var t;a.base64.test(this.typeDefault)?a.base64.decode(this.typeDefault,t=a.newBuffer(a.base64.length(this.typeDefault)),0):a.utf8.write(this.typeDefault,t=a.newBuffer(a.utf8.length(this.typeDefault)),0),this.typeDefault=t}return this.defaultValue=this.map?a.emptyObject:this.repeated?a.emptyArray:this.typeDefault,this.parent instanceof o&&this.parent._ctor&&(this.parent._ctor.prototype[this.name]=this.defaultValue),this.protoName===void 0&&(this.protoName=this.name),this.jsonName===void 0&&(this.jsonName=a.jsonName(this.protoName)),n.prototype.resolve.call(this)},c.prototype._inferLegacyProtoFeatures=function(e){if(e!==`proto2`&&e!==`proto3`)return{};var t={};if(this.rule===`required`&&(t.field_presence=`LEGACY_REQUIRED`),this.parent&&i.defaults[this.type]===void 0){var n=this.parent.get(this.type.split(`.`).pop());n&&n instanceof o&&n.group&&(t.message_encoding=`DELIMITED`)}return this.getOption(`packed`)===!0?t.repeated_field_encoding=`PACKED`:this.getOption(`packed`)===!1&&(t.repeated_field_encoding=`EXPANDED`),t},c.prototype._resolveFeatures=function(e){return n.prototype._resolveFeatures.call(this,this._edition||e)},c.d=function(e,t,n,r){return typeof t==`function`?t=a.decorateType(t).name:t&&typeof t==`object`&&(t=a.decorateEnum(t).name),function(i,o){a.decorateType(i.constructor).add(new c(o,e,t,n,{default:r}))}},c._configure=function(e){o=e}}}),bt=m({"node_modules/protobufjs/src/oneof.js"(e,t){t.exports=a;var n=xt();a.prototype=Object.create(n.prototype,{constructor:{value:a,writable:!0,enumerable:!1,configurable:!0}}),a.className=`OneOf`;var r=yt(),i=G();function a(e,t,r,i){if(Array.isArray(t)||(r=t,t=void 0),n.call(this,e,r),!(t===void 0||Array.isArray(t)))throw TypeError(`fieldNames must be an Array`);this.oneof=t||[],this.fieldsArray=[],this.comment=i}a.fromJSON=function(e,t){return new a(e,t.oneof,t.options,t.comment)},a.prototype.toJSON=function(e){var t=e?!!e.keepComments:!1;return i.toObject([`options`,this.options,`oneof`,this.oneof,`comment`,t?this.comment:void 0])};function o(e){if(e.parent)for(var t=0;t<e.fieldsArray.length;++t)e.fieldsArray[t].parent||e.parent.add(e.fieldsArray[t])}a.prototype.add=function(e){if(!(e instanceof r))throw TypeError(`field must be a Field`);return e.parent&&e.parent!==this.parent&&e.parent.remove(e),this.oneof.push(e.name),this.fieldsArray.push(e),e.partOf=this,o(this),this},a.prototype.remove=function(e){if(!(e instanceof r))throw TypeError(`field must be a Field`);var t=this.fieldsArray.indexOf(e);if(t<0)throw Error(e+` is not a member of `+this);return this.fieldsArray.splice(t,1),t=this.oneof.indexOf(e.name),t>-1&&this.oneof.splice(t,1),e.partOf=null,this},a.prototype.onAdd=function(e){n.prototype.onAdd.call(this,e);for(var t=this,r=0;r<this.oneof.length;++r){var i=e.get(this.oneof[r]);i&&!i.partOf&&(i.partOf=t,t.fieldsArray.push(i))}o(this)},a.prototype.onRemove=function(e){for(var t=0,r;t<this.fieldsArray.length;++t)(r=this.fieldsArray[t]).parent&&r.parent.remove(r);n.prototype.onRemove.call(this,e)},Object.defineProperty(a.prototype,"isProto3Optional",{get:function(){if(this.fieldsArray==null||this.fieldsArray.length!==1)return!1;var e=this.fieldsArray[0];return e.options!=null&&e.options.proto3_optional===!0}}),a.d=function(){for(var e=Array(arguments.length),t=0;t<arguments.length;)e[t]=arguments[t++];return function(t,n){i.decorateType(t.constructor).add(new a(n,e)),Object.defineProperty(t,n,{get:i.oneOfGetter(e),set:i.oneOfSetter(e)})}}}}),xt=m({"node_modules/protobufjs/src/object.js"(e,t){t.exports=u,u.className=`ReflectionObject`;var n=bt(),r=G(),i,a={enum_type:`CLOSED`,field_presence:`EXPLICIT`,json_format:`LEGACY_BEST_EFFORT`,message_encoding:`LENGTH_PREFIXED`,repeated_field_encoding:`EXPANDED`,utf8_validation:`NONE`,enforce_naming_style:`STYLE_LEGACY`,default_symbol_visibility:`EXPORT_ALL`},o={enum_type:`OPEN`,field_presence:`IMPLICIT`,json_format:`ALLOW`,message_encoding:`LENGTH_PREFIXED`,repeated_field_encoding:`PACKED`,utf8_validation:`VERIFY`,enforce_naming_style:`STYLE_LEGACY`,default_symbol_visibility:`EXPORT_ALL`},s={enum_type:`OPEN`,field_presence:`EXPLICIT`,json_format:`ALLOW`,message_encoding:`LENGTH_PREFIXED`,repeated_field_encoding:`PACKED`,utf8_validation:`VERIFY`,enforce_naming_style:`STYLE_LEGACY`,default_symbol_visibility:`EXPORT_ALL`},c={enum_type:`OPEN`,field_presence:`EXPLICIT`,json_format:`ALLOW`,message_encoding:`LENGTH_PREFIXED`,repeated_field_encoding:`PACKED`,utf8_validation:`VERIFY`,enforce_naming_style:`STYLE2024`,default_symbol_visibility:`EXPORT_TOP_LEVEL`},l={enum_type:`OPEN`,field_presence:`EXPLICIT`,json_format:`ALLOW`,message_encoding:`LENGTH_PREFIXED`,repeated_field_encoding:`PACKED`,utf8_validation:`VERIFY`,enforce_naming_style:`STYLE2026`,default_symbol_visibility:`STRICT`,enforce_proto_limits:`PROTO_LIMITS2026`};function u(e,t){if(!r.isString(e))throw TypeError(`name must be a string`);if(t&&!r.isObject(t))throw TypeError(`options must be an object`);this.options=t,this.parsedOptions=null,this.name=e,this._edition=null,this._defaultEdition=`proto2`,this._features={},this._featuresResolved=!1,this.parent=null,this.resolved=!1,this.comment=null,this.filename=null}Object.defineProperties(u.prototype,{root:{get:function(){for(var e=this;e.parent!==null;)e=e.parent;return e}},fullName:{get:function(){for(var e=[this.name],t=this.parent;t;)e.unshift(t.name),t=t.parent;return e.join(`.`)}}}),u.prototype.toJSON=function(){throw Error()},u.prototype.onAdd=function(e){this.parent&&this.parent!==e&&this.parent.remove(this),this.parent=e,this.resolved=!1;var t=e.root;t instanceof i&&t._handleAdd(this)},u.prototype.onRemove=function(e){var t=e.root;t instanceof i&&t._handleRemove(this),this.parent=null,this.resolved=!1},u.prototype.resolve=function(){return this.resolved||this.root instanceof i&&(this.resolved=!0),this},u.prototype._resolveFeaturesRecursive=function(e){return this._resolveFeatures(this._edition||e)},u.prototype._resolveFeatures=function(e){if(!this._featuresResolved){var t={};if(!e)throw Error(`Unknown edition for `+this.fullName);var i=r.merge({},this.options&&this.options.features,this._inferLegacyProtoFeatures(e));if(this._edition){if(e===`proto2`)t=Object.assign({},a);else if(e===`proto3`)t=Object.assign({},o);else if(e===`2023`)t=Object.assign({},s);else if(e===`2024`)t=Object.assign({},c);else if(e===`2026`)t=Object.assign({},l);else throw Error(`Unknown edition: `+e);this._features=r.merge(t,i)}else if(this.partOf instanceof n){var u=r.merge({},this.partOf._features);this._features=r.merge(u,i)}else if(!this.declaringField){if(this.parent){var d=r.merge({},this.parent._features);this._features=r.merge(d,i)}else throw Error(`Unable to find a parent for `+this.fullName)}this.extensionField&&(this.extensionField._features=this._features),this._featuresResolved=!0}},u.prototype._inferLegacyProtoFeatures=function(){return{}},u.prototype.getOption=function(e){if(this.options&&Object.prototype.hasOwnProperty.call(this.options,e))return this.options[e]},u.prototype.setOption=function(e,t,n){if(e===`__proto__`)return this;if(this.options||={},/^features\./.test(e))r.setProperty(this.options,e,t,n);else{var i=this.getOption(e);(!n||i===void 0)&&(i!==t&&(this.resolved=!1),this.options[e]=t)}return this},u.prototype.setParsedOption=function(e,t,n){if(e===`__proto__`)return this;this.parsedOptions||=[];var i=this.parsedOptions;if(n){var a=i.find(function(t){return Object.prototype.hasOwnProperty.call(t,e)});if(a){var o=a[e];r.setProperty(o,n,t)}else a={},a[e]=r.setProperty({},n,t),i.push(a)}else{var s={};s[e]=t,i.push(s)}return this},u.prototype.setOptions=function(e,t){if(e)for(var n=Object.keys(e),r=0;r<n.length;++r)this.setOption(n[r],e[n[r]],t);return this},Object.defineProperty(u.prototype,"toString",{value:function(){var e=this.constructor.className,t=this.fullName;return t.length?e+` `+t:e},writable:!0,enumerable:!1,configurable:!0}),u.prototype._editionToJSON=function(){if(this._edition&&this._edition!==`proto3`)return this._edition},u._configure=function(e){i=e}}}),St=m({"node_modules/protobufjs/src/enum.js"(e,t){t.exports=a;var n=xt();a.prototype=Object.create(n.prototype,{constructor:{value:a,writable:!0,enumerable:!1,configurable:!0}}),a.className=`Enum`;var r=st(),i=G();function a(e,t,r,i,a,o){if(n.call(this,e,r),t&&typeof t!=`object`)throw TypeError(`values must be an object`);if(this.valuesById=/* @__PURE__ */ Object.create(null),this.values=Object.create(this.valuesById),this.comment=i,this.comments=a||{},this.valuesOptions=o,this._valuesFeatures={},this.reserved=void 0,this.visibility=void 0,t)for(var s=Object.keys(t),c=0;c<s.length;++c)s[c]!==`__proto__`&&typeof t[s[c]]==`number`&&(this.values[s[c]]=t[s[c]],this.valuesById[t[s[c]]]===void 0&&(this.valuesById[t[s[c]]]=s[c]))}a.prototype._resolveFeatures=function(e){return e=this._edition||e,n.prototype._resolveFeatures.call(this,e),Object.keys(this.values).forEach(e=>{var t=i.merge({},this._features);this._valuesFeatures[e]=i.merge(t,this.valuesOptions&&this.valuesOptions[e]&&this.valuesOptions[e].features||{})}),this},a.fromJSON=function(e,t){var n=new a(e,t.values,t.options,t.comment,t.comments,t.valuesOptions);return n.reserved=t.reserved,t.visibility&&(n.visibility=t.visibility),t.edition&&(n._edition=t.edition),n._defaultEdition=`proto3`,n},a.prototype.toJSON=function(e){var t=e?!!e.keepComments:!1;return i.toObject([`edition`,this._editionToJSON(),`options`,this.options,`valuesOptions`,this.valuesOptions,`values`,this.values,`reserved`,this.reserved&&this.reserved.length?this.reserved:void 0,`visibility`,this.visibility,`comment`,t?this.comment:void 0,`comments`,t?this.comments:void 0])},a.prototype.add=function(e,t,n,r){if(!i.isString(e))throw TypeError(`name must be a string`);if(!i.isInteger(t))throw TypeError(`id must be an integer`);if(e===`__proto__`)return this;if(this.values[e]!==void 0)throw Error(`duplicate name '`+e+`' in `+this);if(this.isReservedId(t))throw Error(`id `+t+` is reserved in `+this);if(this.isReservedName(e))throw Error(`name '`+e+`' is reserved in `+this);if(this.valuesById[t]!==void 0){if(!(this.options&&this.options.allow_alias))throw Error(`duplicate id `+t+` in `+this);this.values[e]=t}else this.valuesById[this.values[e]=t]=e;return r&&(this.valuesOptions===void 0&&(this.valuesOptions={}),this.valuesOptions[e]=r||null),this.comments[e]=n||null,this},a.prototype.remove=function(e){if(!i.isString(e))throw TypeError(`name must be a string`);var t=this.values[e];if(t==null)throw Error(`name '`+e+`' does not exist in `+this);return delete this.valuesById[t],delete this.values[e],delete this.comments[e],this.valuesOptions&&delete this.valuesOptions[e],this},a.prototype.isReservedId=function(e){return r.isReservedId(this.reserved,e)},a.prototype.isReservedName=function(e){return r.isReservedName(this.reserved,e)}}}),Ct=m({"node_modules/protobufjs/src/encoder.js"(e,t){t.exports=o;var n=St(),r=vt(),i=G();function a(e,t,n,r){return t.delimited?e(`types[%i].encode(%s,w.uint32(%i),q+1).uint32(%i)`,n,r,(t.id<<3|3)>>>0,(t.id<<3|4)>>>0):e(`types[%i].encode(%s,w.uint32(%i).fork(),q+1).ldelim()`,n,r,(t.id<<3|2)>>>0)}function o(e){for(var t=i.codegen([`m`,`w`,`q`])(`if(!w)`)(`w=Writer.create()`)(`if(q===undefined)q=0`)(`if(q>util.recursionLimit)`)(`throw Error("max depth exceeded")`),o,s,c=e.fieldsArray.slice().sort(i.compareFieldsById),o=0;o<c.length;++o){var l=c[o].resolve(),u=e._fieldsArray.indexOf(l),d=l.resolvedType instanceof n?`int32`:l.type,f=r.basic[d];s=`m`+i.safeProp(l.name),l.map?(t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j)){`,s,l.name)(`for(var ks=Object.keys(%s),i=0;i<ks.length;++i){`,s),l.keyType===`bool`?t(`w.uint32(%i).fork().uint32(%i).bool(util.boolFromKey(ks[i]))`,(l.id<<3|2)>>>0,8|r.mapKey[l.keyType]):r.long[l.keyType]===void 0?t(`w.uint32(%i).fork().uint32(%i).%s(ks[i])`,(l.id<<3|2)>>>0,8|r.mapKey[l.keyType],l.keyType):t(`w.uint32(%i).fork().uint32(%i).%s(util.longFromKey(ks[i],%j))`,(l.id<<3|2)>>>0,8|r.mapKey[l.keyType],l.keyType,l.keyType===`uint64`||l.keyType===`fixed64`),f===void 0?t(`types[%i].encode(%s[ks[i]],w.uint32(18).fork(),q+1).ldelim().ldelim()`,u,s):t(`.uint32(%i).%s(%s[ks[i]]).ldelim()`,16|f,d,s),t(`}`)(`}`)):l.repeated?(t(`if(%s!=null&&%s.length){`,s,s),l.packed&&r.packed[d]!==void 0?t(`w.uint32(%i).%ss(%s)`,(l.id<<3|2)>>>0,d,s):(t(`for(var i=0;i<%s.length;++i)`,s),f===void 0?a(t,l,u,s+`[i]`):t(`w.uint32(%i).%s(%s[i])`,(l.id<<3|f)>>>0,d,s)),t(`}`)):(l.required||(l.hasPresence||!(l.resolvedType instanceof n||r.basic[d]!==void 0)?t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j))`,s,l.name):l.resolvedType instanceof n?t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!==%j)`,s,l.name,s,l.typeDefault):d===`bool`?t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!==false)`,s,l.name,s):d===`string`?t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!=="")`,s,l.name,s):d===`bytes`?t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s.length)`,s,l.name,s):d===`double`||d===`float`?t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&!Object.is(%s,0))`,s,l.name,s):r.long[d]===void 0?t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!==0)`,s,l.name,s):t(`if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&(typeof %s==="object"?%s.low||%s.high:%s!==0))`,s,l.name,s,s,s,s)),f===void 0?a(t,l,u,s):t(`w.uint32(%i).%s(%s)`,(l.id<<3|f)>>>0,d,s))}return t(`if(m.$unknowns!=null&&Object.hasOwnProperty.call(m,"$unknowns"))`)(`for(var i=0;i<m.$unknowns.length;++i)`)(`w.raw(m.$unknowns[i])`)(`return w`)}}}),wt=m({"node_modules/protobufjs/src/index-light.js"(e,t){e=t.exports=et(),e.build=`light`;function n(t,n,r){return typeof n==`function`?(r=n,n=new e.Root):n||=new e.Root,n.load(t,r)}e.load=n;function r(t,n){return n||=new e.Root,n.loadSync(t)}e.loadSync=r,e.encoder=Ct(),e.decoder=ft(),e.verifier=pt(),e.converter=mt(),e.ReflectionObject=xt(),e.Namespace=st(),e.Root=_t(),e.Enum=St(),e.Type=gt(),e.Field=yt(),e.OneOf=bt(),e.MapField=ct(),e.Service=ut(),e.Method=lt(),e.Message=dt(),e.wrappers=ht(),e.types=vt(),e.util=G(),e.ReflectionObject._configure(e.Root),e.Namespace._configure(e.Type,e.Service,e.Enum),e.Root._configure(e.Type,void 0,{}),e.Field._configure(e.Type)}}),Tt=m({"node_modules/protobufjs/src/tokenize.js"(e,t){t.exports=f;var n=/[\s{}=;:[\],'"()<>]/g,r=/(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,i=/(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,a=/^ *[*/]+ */,o=/^\s*\*?\/*/,s=/\n/g,c=/\s/,l=/\\(.?)/g,u={0:`\0`,r:`\r`,n:`
`,t:`	`};function d(e){return e.replace(l,function(e,t){switch(t){case`\\`:case``:return t;default:return u[t]||``}})}f.unescape=d;function f(e,t){e=e.toString();var l=0,u=e.length,f=1,p=0,m={},h=[],g=null;function _(e){return Error(`illegal `+e+` (line `+f+`)`)}function v(){var t=g===`'`?i:r;t.lastIndex=l-1;var n=t.exec(e);if(!n)throw _(`string`);return l=t.lastIndex,w(g),g=null,d(n[1])}function y(t){return e.charAt(t)}function b(n,r,i){var c={type:e.charAt(n++),lineEmpty:!1,leading:i},l=n-(t?2:3),u;do if(--l<0||(u=e.charAt(l))===`
`){c.lineEmpty=!0;break}while(u===` `||u===`	`);for(var d=e.substring(n,r).split(s),h=0;h<d.length;++h)d[h]=d[h].replace(t?o:a,``).trim();c.text=d.join(`
`).trim(),m[f]=c,p=f}function x(t){var n=S(t),r=e.substring(t,n);return/^\s*\/\//.test(r)}function S(e){for(var t=e;t<u&&y(t)!==`
`;)t++;return t}function C(){if(h.length>0)return h.shift();if(g)return v();var r,i,a,o,s,d,p=l===0;do{if(l===u)return null;for(r=!1;c.test(a=y(l));)if(a===`
`&&(p=!0,++f),++l===u)return null;if(y(l)===`/`){if(++l===u)throw _(`comment`);if(y(l)===`/`){if(t){if(o=l,s=!1,x(l-1)){s=!0;do{if(l=S(l),l===u||(l++,!p))break;d=x(l),d&&f++}while(d)}else l=Math.min(u,S(l)+1);s&&(b(o,l,p),p=!0),f++,r=!0}else{for(s=y(o=l+1)===`/`;y(++l)!==`
`;)if(l===u)return null;++l,s&&(b(o,l-1,p),p=!0),++f,r=!0}}else if((a=y(l))===`*`){o=l+1,s=t||y(o)===`*`;do{if(a===`
`&&++f,++l===u)throw _(`comment`);i=a,a=y(l)}while(i!==`*`||a!==`/`);++l,s&&(b(o,l-2,p),p=!0),r=!0}else return`/`}}while(r);var m=l;if(n.lastIndex=0,!n.test(y(m++)))for(;m<u&&!n.test(y(m));)++m;var C=e.substring(l,l=m);return(C===`"`||C===`'`)&&(g=C),C}function w(e){h.push(e)}function T(){if(!h.length){var e=C();if(e===null)return null;w(e)}return h[0]}function E(e,t){var n=T();if(n===e)return C(),!0;if(!t)throw _(`token '`+n+`', '`+e+`' expected`);return!1}function D(e){var n=null,r;return e===void 0?(r=m[f-1],delete m[f-1],r&&(t||r.type===`*`||r.lineEmpty)&&(n=r.leading?r.text:null)):(p<e&&T(),r=m[e],delete m[e],r&&!r.lineEmpty&&(t||r.type===`/`)&&(n=r.leading?null:r.text)),n}return Object.defineProperty({next:C,peek:T,push:w,skip:E,cmnt:D},"line",{get:function(){return f}})}}}),Et=m({"node_modules/protobufjs/src/parse.js"(e,t){t.exports=D,D.filename=null,D.defaults={keepCase:!1};var n=Tt(),r=_t(),i=gt(),a=yt(),o=ct(),s=bt(),c=St(),l=ut(),u=lt(),d=xt(),f=vt(),p=G(),m=/^[1-9][0-9]*$/,h=/^-?[1-9][0-9]*$/,g=/^0[x][0-9a-fA-F]+$/,_=/^-?0[x][0-9a-fA-F]+$/,v=/^0[0-7]+$/,y=/^-?0[0-7]+$/,b=/^(?:u?int|sint|s?fixed)(?:32|64)$/,x=/^(?:uint|fixed)(?:32|64)$/,S=p.patterns.numberRe,C=/^[a-zA-Z_][a-zA-Z_0-9]*$/,w=p.patterns.typeRefRe,T=536870911,E=2147483647;function D(e,t,O){t instanceof r||(O=t,t=new r),O||=D.defaults;var ee=O.preferTrailingComment||!1,te=n(e,O.alternateCommentMode||!1),k=te.next,A=te.push,j=te.peek,M=te.skip,ne=te.cmnt,re=!0,ie,ae,oe,N=`proto2`,P=t,F=[],I={},L=O.keepCase?function(e){return e}:p.camelCase;function R(){F.forEach(e=>{e._edition=N,Object.keys(I).forEach(t=>{e.getOption(t)===void 0&&e.setOption(t,I[t],!0)})})}function z(e,t,n){var r=D.filename;return n||(D.filename=null),Error(`illegal `+(t||`token`)+` '`+e+`' (`+(r?r+`, `:``)+`line `+te.line+`)`)}function se(){var e=[],t;do{if((t=k())!==`"`&&t!==`'`)throw z(t);e.push(k()),M(t),t=j()}while(t===`"`||t===`'`);return e.join(``)}function ce(e){var t=k();switch(t){case`'`:case`"`:return A(t),se();case`true`:case`TRUE`:return!0;case`false`:case`FALSE`:return!1}try{return B(t,!0)}catch{if(e&&w.test(t))return t;throw z(t,`value`)}}function le(e,t,n,r){var i,a;do if(t&&((i=j())===`"`||i===`'`)){var o=se();if(e.push(o),N>=2023)throw z(o,`id`)}else try{e.push([a=de(k(),r,n),M(`to`,!0)?de(k(),r,n):a])}catch(n){if(t&&w.test(i)&&N>=2023)e.push(i);else throw n}while(M(`,`,!0));var s={options:void 0};s.setOption=function(e,t){this.options===void 0&&(this.options={}),this.options[e]=t},V(s,function(e){if(e===`option`)Se(s,e),M(`;`);else throw z(e)},function(){Ee(s)})}function B(e,t){var n=1;switch(e.charAt(0)===`-`&&(n=-1,e=e.substring(1)),e){case`inf`:case`INF`:case`Inf`:return 1/0*n;case`nan`:case`NAN`:case`Nan`:case`NaN`:return NaN;case`0`:return n*0}if(m.test(e))return n*parseInt(e,10);if(g.test(e))return n*parseInt(e,16);if(v.test(e))return n*parseInt(e,8);if(S.test(e))return n*parseFloat(e);throw z(e,`number`,t)}function ue(e,t,n){if(e===null)throw z(e,`end of input`);if(!t&&e.charAt(0)===`-`)throw z(e,n||`integer`);if(e===`0`||e===`-0`)return 0;var r;if(h.test(e))r=parseInt(e,10);else if(_.test(e))r=parseInt(e,16);else if(y.test(e))r=parseInt(e,8);else throw z(e,n||`integer`);return r||0}function de(e,t,n){switch(e){case`max`:case`MAX`:case`Max`:return n||T}return ue(e,t,`id`)}function fe(){if(ie!==void 0)throw z(`package`);if(ie=k(),ie===null||!w.test(ie))throw z(ie,`name`);P=P.define(ie),M(`;`)}function pe(){var e=j(),t;switch(e){case`option`:if(N<`2024`)throw z(`option`);k(),se(),M(`;`);return;case`weak`:t=oe||=[],k();break;case`public`:k();default:t=ae||=[]}e=se(),M(`;`),t.push(e)}function me(){if(M(`=`),N=se(),N<2023)throw z(N,`syntax`);M(`;`)}function he(){if(M(`=`),N=se(),![`2023`,`2024`,`2026`].includes(N))throw z(N,`edition`);M(`;`)}function ge(e,t,n){switch(n===void 0&&(n=0),t){case`option`:return Se(e,t),M(`;`),!0;case`message`:return H(e,t,n+1),!0;case`enum`:return be(e,t),!0;case`export`:case`local`:if(N<`2024`)return!1;var r=t;return t=k(),t===`export`||t===`local`||t!==`message`&&t!==`enum`?!1:((t===`message`?H(e,t,n+1):be(e,t)).visibility=r,!0);case`service`:return De(e,t,n+1),!0;case`extend`:return ke(e,t,n),!0}return!1}function V(e,t,n){var r=te.line;if(e&&(typeof e.comment!=`string`&&(e.comment=ne()),e.filename=D.filename),M(`{`,!0)){for(var i;(i=k())!==`}`;)t(i);M(`;`,!0)}else n&&n(),M(`;`),e&&(typeof e.comment!=`string`||ee)&&(e.comment=ne(r)||e.comment)}function H(e,t,n){if(n===void 0&&(n=0),n>p.nestingLimit)throw Error(`max depth exceeded`);if((t=k())===null||!C.test(t))throw z(t,`type name`);var r=new i(t);return V(r,function(e){if(!ge(r,e,n))switch(e){case`;`:break;case`map`:ve(r,e);break;case`required`:if(N!==`proto2`)throw z(e);case`repeated`:U(r,e,void 0,n+1);break;case`optional`:if(N===`proto3`)U(r,`proto3_optional`,void 0,n+1);else{if(N!==`proto2`)throw z(e);U(r,`optional`,void 0,n+1)}break;case`oneof`:ye(r,e,n+1);break;case`extensions`:le(r.extensions||=[]);break;case`reserved`:le(r.reserved||=[],!0);break;default:if(N===`proto2`||!w.test(e))throw z(e);A(e),U(r,`optional`,void 0,n+1)}}),e.add(r),e===P&&F.push(r),r}function U(e,t,n,r){var i=k();if(i===null)throw z(i,`end of input`);if(i===`group`)_e(e,t,n,r);else{for(;i.endsWith(`.`)||(j()||``).startsWith(`.`);){var o=k();if(o===null)throw z(o,`end of input`);i+=o}if(!w.test(i))throw z(i,`type`);var c=k();if(c===null)throw z(c,`end of input`);if(!C.test(c))throw z(c,`name`);var l=c;c=L(c),M(`=`);var u=new a(c,de(k()),i,t===`proto3_optional`?`optional`:t,n);if(l!==c&&(u.protoName=l),V(u,function(e){if(e===`option`)Se(u,e),M(`;`);else throw z(e)},function(){Ee(u)}),t===`proto3_optional`){var d=new s(`_`+c);u.setOption(`proto3_optional`,!0),d.add(u),e.add(d)}else e.add(u);e===P&&F.push(u)}}function _e(e,t,n,r){if(r===void 0&&(r=0),r>p.nestingLimit)throw Error(`max depth exceeded`);if(N>=2023)throw z(`group`);var o=k();if(o===null||!C.test(o))throw z(o,`name`);var s=p.lcFirst(o);o===s&&(o=p.ucFirst(o)),M(`=`);var c=de(k()),l=new i(o);l.group=!0;var u=new a(s,c,o,t,n);u.filename=D.filename,V(l,function(e){switch(e){case`;`:break;case`map`:ve(l);break;case`option`:Se(l,e),M(`;`);break;case`required`:case`repeated`:U(l,e,void 0,r+1);break;case`optional`:N===`proto3`?U(l,`proto3_optional`,void 0,r+1):U(l,`optional`,void 0,r+1);break;case`message`:H(l,e,r+1);break;case`enum`:be(l,e);break;case`reserved`:le(l.reserved||=[],!0);break;case`export`:case`local`:if(N<`2024`)throw z(e);switch(e=k(),e){case`message`:H(l,e,r+1);break;case`enum`:H(l,e,r+1);break;default:throw z(e)}break;
/* istanbul ignore next */
default:throw z(e)}}),e.add(l).add(u),e===P&&(F.push(l),F.push(u))}function ve(e){M(`<`);var t=k();if(f.mapKey[t]===void 0)throw z(t,`type`);M(`,`);var n=k();if(!w.test(n))throw z(n,`type`);M(`>`);var r=k();if(r===null||!C.test(r))throw z(r,`name`);M(`=`);var i=r;r=L(r);var a=new o(r,de(k()),t,n);i!==r&&(a.protoName=i),V(a,function(e){if(e===`option`)Se(a,e),M(`;`);else throw z(e)},function(){Ee(a)}),e.add(a)}function ye(e,t,n){if((t=k())===null||!C.test(t))throw z(t,`name`);var r=new s(L(t));V(r,function(e){e===`option`?(Se(r,e),M(`;`)):(A(e),U(r,`optional`,void 0,n))}),e.add(r)}function be(e,t){if((t=k())===null||!C.test(t))throw z(t,`name`);var n=new c(t),r=[];V(n,function(e){switch(e){case`;`:break;case`option`:Se(n,e),M(`;`);break;case`reserved`:le(n.reserved||=[],!0,E,!0),n.reserved===void 0&&(n.reserved=[]);break;default:r.push(xe(e))}});for(var i=0;i<r.length;++i)n.add(r[i].name,r[i].id,r[i].comment,r[i].options);return e.add(n),e===P&&F.push(n),n}function xe(e){if(!C.test(e))throw z(e,`name`);M(`=`);var t=de(k(),!0),n={options:void 0};return n.getOption=function(e){return this.options[e]},n.setOption=function(e,t){d.prototype.setOption.call(n,e,t)},n.setParsedOption=function(){},V(n,function(e){if(e===`option`)Se(n,e),M(`;`);else throw z(e)},function(){Ee(n)}),{name:e,id:t,comment:n.comment,options:n.parsedOptions||n.options}}function Se(e,t){var n,r,i=!0;for(t===`option`&&(t=k());t!==`=`;){if(t===null)throw z(t,`end of input`);if(t===`(`){var a=k();M(`)`),t=`(`+a+`)`}if(i){if(i=!1,t.includes(`.`)&&!t.includes(`(`)){var o=t.split(`.`);n=o[0]+`.`,t=o[1];continue}n=t}else r=r?r+=t:t;t=k()}var s=Ce(e,r?n.concat(r):n);r=r&&r[0]===`.`?r.slice(1):r,n=n&&n[n.length-1]===`.`?n.slice(0,-1):n,Te(e,n,s,r)}function Ce(e,t,n){if(n===void 0&&(n=0),n>p.recursionLimit)throw Error(`max depth exceeded`);if(M(`{`,!0)){for(var r={};!M(`}`,!0);){W=k();var i;if(W===null)throw z(W,`end of input`);if(W===`[`){W=k();var o=W===null?-1:W.lastIndexOf(`/`);if(W===null||!w.test(o<0?W:W.slice(o+1)))throw z(W,`name`);i=`[`+W+`]`,M(`]`)}else{if(!C.test(W))throw z(W,`name`);i=W}var s;if(M(`:`,!0),j()===`{`)s=Ce(e,t+`.`+i,n+1);else if(j()===`[`){s=[];var c,l;if(M(`[`,!0)&&!M(`]`,!0)){do l=j()===`{`,c=l?Ce(e,t+`.`+i,n+1):ce(!0),s.push(c);while(M(`,`,!0));M(`]`),typeof c<`u`&&(l||we(e,t+`.`+i,c))}}else s=ce(!0),we(e,t+`.`+i,s);var u=Object.prototype.hasOwnProperty.call(r,i)?r[i]:void 0;u&&(s=[].concat(u,s)),i!==`__proto__`&&(r[i]=s),M(`,`,!0),M(`;`,!0)}return r}var d=t==="default"&&e instanceof a&&b.test(e.type)?ue(k(),!x.test(e.type)):ce(!0);return we(e,t,d),d}function we(e,t,n){P===e&&/^features\./.test(t)?I[t]=n:(t===`json_name`&&e instanceof a&&(e.jsonName=n),e.setOption&&e.setOption(t,n))}function Te(e,t,n,r){e.setParsedOption&&e.setParsedOption(t,n,r)}function Ee(e){if(M(`[`,!0)){do Se(e,`option`);while(M(`,`,!0));M(`]`)}return e}function De(e,t,n){if(n===void 0&&(n=0),n>p.recursionLimit)throw Error(`max depth exceeded`);if((t=k())===null||!C.test(t))throw z(t,`service name`);var r=new l(t);V(r,function(e){if(!ge(r,e,n)&&e!==`;`){if(e===`rpc`)Oe(r,e);else throw z(e)}}),e.add(r),e===P&&F.push(r)}function Oe(e,t){var n=ne(),r=t;if(!C.test(t=k()))throw z(t,`name`);var i=t,a,o,s,c;if(M(`(`),M(`stream`,!0)&&(o=!0),!w.test(t=k())||(a=t,M(`)`),M(`returns`),M(`(`),M(`stream`,!0)&&(c=!0),!w.test(t=k())))throw z(t);s=t,M(`)`);var l=new u(i,r,a,s,o,c);l.comment=n,V(l,function(e){if(e!==`;`){if(e===`option`)Se(l,e),M(`;`);else throw z(e)}}),e.add(l)}function ke(e,t,n){if((t=k())===null||!w.test(t))throw z(t,`reference`);var r=t;V(null,function(t){switch(t){case`required`:case`repeated`:U(e,t,r,n+1);break;case`optional`:N===`proto3`?U(e,`proto3_optional`,r,n+1):U(e,`optional`,r,n+1);break;default:if(N===`proto2`||!w.test(t))throw z(t);A(t),U(e,`optional`,r,n+1)}})}for(var W;(W=k())!==null;)switch(W){case`;`:break;case`package`:if(!re)throw z(W);fe();break;case`import`:pe();break;case`syntax`:if(!re)throw z(W);me();break;case`edition`:if(!re)throw z(W);he();break;case`option`:Se(P,W),M(`;`,!0);break;default:if(ge(P,W,0)){re=!1;continue}throw z(W)}return R(),D.filename=null,{package:ie,imports:ae,weakImports:oe,root:t}}}}),Dt=m({"node_modules/protobufjs/src/common.js"(e,t){t.exports=r;var n=/\/|\./;function r(e,t){n.test(e)||(e=`google/protobuf/`+e+`.proto`,t={nested:{google:{nested:{protobuf:{nested:t}}}}}),r[e]=t}r(`any`,{Any:{fields:{type_url:{type:`string`,id:1},value:{type:`bytes`,id:2}}}});var i;r(`duration`,{Duration:i={fields:{seconds:{type:`int64`,id:1},nanos:{type:`int32`,id:2}}}}),r(`timestamp`,{Timestamp:i}),r(`empty`,{Empty:{fields:{}}}),r(`struct`,{Struct:{fields:{fields:{keyType:`string`,type:`Value`,id:1}}},Value:{oneofs:{kind:{oneof:[`nullValue`,`numberValue`,`stringValue`,`boolValue`,`structValue`,`listValue`]}},fields:{nullValue:{type:`NullValue`,id:1,protoName:`null_value`},numberValue:{type:`double`,id:2,protoName:`number_value`},stringValue:{type:`string`,id:3,protoName:`string_value`},boolValue:{type:`bool`,id:4,protoName:`bool_value`},structValue:{type:`Struct`,id:5,protoName:`struct_value`},listValue:{type:`ListValue`,id:6,protoName:`list_value`}}},NullValue:{values:{NULL_VALUE:0}},ListValue:{fields:{values:{rule:`repeated`,type:`Value`,id:1}}}}),r(`wrappers`,{DoubleValue:{fields:{value:{type:`double`,id:1}}},FloatValue:{fields:{value:{type:`float`,id:1}}},Int64Value:{fields:{value:{type:`int64`,id:1}}},UInt64Value:{fields:{value:{type:`uint64`,id:1}}},Int32Value:{fields:{value:{type:`int32`,id:1}}},UInt32Value:{fields:{value:{type:`uint32`,id:1}}},BoolValue:{fields:{value:{type:`bool`,id:1}}},StringValue:{fields:{value:{type:`string`,id:1}}},BytesValue:{fields:{value:{type:`bytes`,id:1}}}}),r(`field_mask`,{FieldMask:{fields:{paths:{rule:`repeated`,type:`string`,id:1}}}}),r.get=function(e){return r[e]||null}}}),Ot=m({"node_modules/protobufjs/src/index.js"(e,t){e=t.exports=wt(),e.build=`full`,e.tokenize=Tt(),e.parse=Et(),e.common=Dt(),e.Root._configure(e.Type,e.parse,e.common)}}),kt=m({"node_modules/protobufjs/index.js"(e,t){t.exports=Ot()}}),At=g(je(),1),jt=g(Le(),1),Mt=/* @__PURE__ */ (0,jt.fileDesc)(`CgxjcF9zYXQucHJvdG8SFm9ydG9vbHNfd2FzbS5icmlkZ2UudjEinQEKEkNwU2F0QnJpZGdlUmVxdWVzdBI6CgVzb2x2ZRgKIAEoCzIpLm9ydG9vbHNfd2FzbS5icmlkZ2UudjEuQ3BTYXRTb2x2ZVJlcXVlc3RIABJACgh2YWxpZGF0ZRgLIAEoCzIsLm9ydG9vbHNfd2FzbS5icmlkZ2UudjEuQ3BTYXRWYWxpZGF0ZVJlcXVlc3RIAEIJCgdwYXlsb2FkIuoBChNDcFNhdEJyaWRnZVJlc3BvbnNlEkAKDHNvbHZlX3Jlc3VsdBgKIAEoCzIoLm9ydG9vbHNfd2FzbS5icmlkZ2UudjEuQ3BTYXRTb2x2ZVJlc3VsdEgAEj4KC3NvbHZlX2V2ZW50GAsgASgLMicub3J0b29sc193YXNtLmJyaWRnZS52MS5DcFNhdFNvbHZlRXZlbnRIABJGCg92YWxpZGF0ZV9yZXN1bHQYDCABKAsyKy5vcnRvb2xzX3dhc20uYnJpZGdlLnYxLkNwU2F0VmFsaWRhdGVSZXN1bHRIAEIJCgdwYXlsb2FkIosBChFDcFNhdFNvbHZlUmVxdWVzdBIWCg5jcF9tb2RlbF9wcm90bxgBIAEoDBIcChRzYXRfcGFyYW1ldGVyc19wcm90bxgCIAEoDBJACg1jYWxsYmFja19tYXNrGAMgASgLMikub3J0b29sc193YXNtLmJyaWRnZS52MS5DcFNhdENhbGxiYWNrTWFzayJGChFDcFNhdENhbGxiYWNrTWFzaxIQCghzb2x1dGlvbhgBIAEoCBISCgpiZXN0X2JvdW5kGAIgASgIEgsKA2xvZxgDIAEoCCI0ChBDcFNhdFNvbHZlUmVzdWx0EiAKGGNwX3NvbHZlcl9yZXNwb25zZV9wcm90bxgBIAEoDCJbCg9DcFNhdFNvbHZlRXZlbnQSGAoOc29sdXRpb25fcHJvdG8YASABKAxIABIUCgpiZXN0X2JvdW5kGAIgASgBSAASDQoDbG9nGAMgASgJSABCCQoHcGF5bG9hZCIuChRDcFNhdFZhbGlkYXRlUmVxdWVzdBIWCg5jcF9tb2RlbF9wcm90bxgBIAEoDCIyChNDcFNhdFZhbGlkYXRlUmVzdWx0EgoKAm9rGAEgASgIEg8KB21lc3NhZ2UYAiABKAliBnByb3RvMw`),Nt=/* @__PURE__ */ (0,jt.messageDesc)(Mt,0),Pt=/* @__PURE__ */ (0,jt.messageDesc)(Mt,1),Ft=/* @__PURE__ */ (0,jt.messageDesc)(Mt,2),It=/* @__PURE__ */ (0,jt.messageDesc)(Mt,3),Lt=/* @__PURE__ */ (0,jt.messageDesc)(Mt,4),Rt=/* @__PURE__ */ (0,jt.messageDesc)(Mt,5),zt=/* @__PURE__ */ (0,jt.messageDesc)(Mt,6),Bt=/* @__PURE__ */ (0,jt.messageDesc)(Mt,7);function Vt(e){let t=(0,At.fromBinary)(Nt,e);switch(t.payload.case){case`solve`:{let{cpModelProto:e,satParametersProto:n,callbackMask:r}=t.payload.value;return{type:`solve`,model:e,parameters:n,callbacks:{solution:r?.solution??!1,bestBound:r?.bestBound??!1,log:r?.log??!1}}}case`validate`:return{type:`validate`,model:t.payload.value.cpModelProto};default:throw Error(`CP-SAT bridge request has no operation.`)}}function Ht(e){return(0,At.fromBinary)(Pt,e)}var Ut={solver:`cp-sat`,label:`CP-SAT`,encodeRequest:e=>{let t=e.type===`solve`?{case:`solve`,value:(0,At.create)(Ft,{cpModelProto:e.model,satParametersProto:e.parameters,callbackMask:(0,At.create)(It,e.callbacks)})}:{case:`validate`,value:(0,At.create)(zt,{cpModelProto:e.model})};return(0,At.toBinary)(Nt,(0,At.create)(Nt,{payload:t}))},decodeRequest:Vt,encodeResult:e=>{let t=e.type===`solve`?{case:`solveResult`,value:(0,At.create)(Lt,{cpSolverResponseProto:e.response})}:{case:`validateResult`,value:(0,At.create)(Bt,{ok:e.ok,message:e.message})};return(0,At.toBinary)(Pt,(0,At.create)(Pt,{payload:t}))},decodeResult:e=>{let t=Ht(e);switch(t.payload.case){case`solveResult`:return{type:`solve`,response:t.payload.value.cpSolverResponseProto};case`validateResult`:return{type:`validate`,ok:t.payload.value.ok,message:t.payload.value.message};default:throw Error(`CP-SAT bridge response has no result.`)}},encodeEvent:e=>{let t=e.type===`solution`?{case:`solutionProto`,value:e.response}:e.type===`bestBound`?{case:`bestBound`,value:e.bound}:{case:`log`,value:e.message};return(0,At.toBinary)(Pt,(0,At.create)(Pt,{payload:{case:`solveEvent`,value:(0,At.create)(Rt,{payload:t})}}))},decodeEvent:e=>{let t=Ht(e);if(t.payload.case!==`solveEvent`)return null;let n=t.payload.value.payload;switch(n.case){case`solutionProto`:return{type:`solution`,response:n.value};case`bestBound`:return{type:`bestBound`,bound:n.value};case`log`:return{type:`log`,message:n.value};default:return null}}};function Wt(e,t){if(!t?.length)return 0;let n=e._malloc(t.length);return e.HEAPU8.set(t,n),n}async function Gt(e,t,n=t=>e._free(t)){let r=e._malloc(Uint32Array.BYTES_PER_ELEMENT),i=0;try{i=await t(r);let n=new DataView(e.HEAPU8.buffer,r,Uint32Array.BYTES_PER_ELEMENT).getUint32(0,!0);return i&&n?e.HEAPU8.slice(i,i+n):/* @__PURE__ */ new Uint8Array}finally{i&&n(i),e._free(r)}}function Kt(){return typeof globalThis.WebAssembly?.promising==`function`}function qt(){return Kt()?`jspi`:`asyncify`}function Jt(e){let t={},n=null;function r(){return n||(n=qt(),e.logFlavorSelection&&console.log(n===`jspi`?`JSPI is supported. Using JSPI runtime.`:`Using Asyncify runtime.`),n)}async function i(n,i=r()){let a=`${n}:${i}`;return t[a]??(t[a]=(async()=>{let t=await e.resolveAsset(n,i),r=await e.loadFactory(t.jsUrl),a={locateFile:t.locateFile,noExitRuntime:!0};t.wasmBinary&&(a.wasmBinary=t.wasmBinary),t.mainScriptUrlOrBlob&&(a.mainScriptUrlOrBlob=t.mainScriptUrlOrBlob);try{return await r(a)}finally{t.cleanupGlobalState?.()}})()),t[a]}async function a(){let e=Object.entries(t),n=await Promise.allSettled(e.map(([,e])=>e));try{for(let e of n){if(e.status!==`fulfilled`)continue;let t=e.value;try{Object.prototype.hasOwnProperty.call(t,`PThread`)&&t.PThread?.terminateAllThreads?.()}catch(e){if(!String(e).includes(`PThread`))throw e}}}finally{for(let[n]of e)delete t[n]}}return{terminateLoadedRuntimeThreads:a,loadRuntime:()=>i(`cp_sat_runtime`),loadRuntimeAsyncify:()=>i(`cp_sat_runtime`,`asyncify`),loadRoutingRuntime:()=>i(`routing_runtime`),loadRoutingRuntimeAsyncify:()=>i(`routing_runtime`,`asyncify`),loadMPSolverRuntime:()=>i(`mp_solver_runtime`),loadMPSolverRuntimeAsyncify:()=>i(`mp_solver_runtime`,`asyncify`),loadMathOptRuntime:()=>i(`mathopt_runtime`),loadMathOptRuntimeAsyncify:()=>i(`mathopt_runtime`,`asyncify`),loadPdlpRuntime:()=>i(`pdlp_runtime`),loadPdlpRuntimeAsyncify:()=>i(`pdlp_runtime`,`asyncify`),loadGraphRuntime:()=>i(`graph_runtime`),loadGraphRuntimeAsyncify:()=>i(`graph_runtime`,`asyncify`),loadSetCoverRuntime:()=>i(`set_cover_runtime`),loadSetCoverRuntimeAsyncify:()=>i(`set_cover_runtime`,`asyncify`)}}var Yt={cp_sat_runtime:{jspi:{jsUrl:new URL(new URL(`cp_sat_runtime-DbI0Sx8Q.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`cp_sat_runtime-C-yaxgmf.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`cp_sat_runtime_asyncify-BbDIArG2.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`cp_sat_runtime_asyncify-DsO6wVBK.wasm`,import.meta.url).href,``+import.meta.url).href}},routing_runtime:{jspi:{jsUrl:new URL(new URL(`routing_runtime-uVALT8bB.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`routing_runtime-B6Sl4amb.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`routing_runtime_asyncify-BcbpcAqX.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`routing_runtime_asyncify-BZA4mzZn.wasm`,import.meta.url).href,``+import.meta.url).href}},mp_solver_runtime:{jspi:{jsUrl:new URL(new URL(`mp_solver_runtime-Cnb23_IP.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`mp_solver_runtime-BxOcqfjp.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`mp_solver_runtime_asyncify-5LXgi4lb.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`mp_solver_runtime_asyncify-XHBqoulo.wasm`,import.meta.url).href,``+import.meta.url).href}},mathopt_runtime:{jspi:{jsUrl:new URL(new URL(`mathopt_runtime-CFHYpQRY.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`mathopt_runtime-BwzFJFaF.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`mathopt_runtime_asyncify-DHsAOpqq.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`mathopt_runtime_asyncify-DBJWDmp5.wasm`,import.meta.url).href,``+import.meta.url).href}},pdlp_runtime:{jspi:{jsUrl:new URL(new URL(`pdlp_runtime-OdblZeaT.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`pdlp_runtime-BtLKECe3.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`pdlp_runtime_asyncify-D4FO5jsd.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`pdlp_runtime_asyncify-CVkze6WI.wasm`,import.meta.url).href,``+import.meta.url).href}},graph_runtime:{jspi:{jsUrl:new URL(new URL(`graph_runtime-CeCeiLGJ.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`graph_runtime-Cq2M9ebD.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`graph_runtime_asyncify-4fpHjuEm.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`graph_runtime_asyncify-DhW89rlF.wasm`,import.meta.url).href,``+import.meta.url).href}},set_cover_runtime:{jspi:{jsUrl:new URL(new URL(`set_cover_runtime-BQCTbzA6.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`set_cover_runtime-Cd2OLsL_.wasm`,import.meta.url).href,``+import.meta.url).href},asyncify:{jsUrl:new URL(new URL(`set_cover_runtime_asyncify-DJN8nTUN.js`,import.meta.url).href,``+import.meta.url).href,wasmUrl:new URL(new URL(`set_cover_runtime_asyncify-C2vbVyTI.wasm`,import.meta.url).href,``+import.meta.url).href}}};async function Xt(e){let{default:t}=await import(
/* webpackIgnore: true */
/* @vite-ignore */
e);return t}function Zt(e){return(new URL(e).pathname.split(`/`).pop()??``).replace(/-[A-Za-z0-9_-]+(?=\.(?:js|wasm)$)/,``)}function Qt(e){for(let t of Object.values(Yt))for(let n of Object.values(t)){if(e===Zt(n.jsUrl))return n.jsUrl;if(e===Zt(n.wasmUrl))return n.wasmUrl}return e}var $t=Jt({logFlavorSelection:!0,loadFactory:Xt,async resolveAsset(e,t){let n=Yt[e][t],r=new Uint8Array(await(await fetch(n.wasmUrl)).arrayBuffer());return{jsUrl:n.jsUrl,locateFile:Qt,wasmBinary:r,mainScriptUrlOrBlob:n.jsUrl}}});$t.terminateLoadedRuntimeThreads;var en=$t.loadRuntime;$t.loadRuntimeAsyncify,$t.loadRoutingRuntime,$t.loadRoutingRuntimeAsyncify,$t.loadMPSolverRuntime,$t.loadMPSolverRuntimeAsyncify,$t.loadMathOptRuntime,$t.loadMathOptRuntimeAsyncify,$t.loadPdlpRuntime,$t.loadPdlpRuntimeAsyncify,$t.loadGraphRuntime,$t.loadGraphRuntimeAsyncify,$t.loadSetCoverRuntime,$t.loadSetCoverRuntimeAsyncify;var tn=g(je(),1),nn=g(Le(),1),rn=/* @__PURE__ */ (0,nn.fileDesc)(`Cglqb2IucHJvdG8SFm9ydG9vbHNfd2FzbS5icmlkZ2UudjEi4gEKE1NvbHZlckJyaWRnZVJlcXVlc3QSEgoKcmVxdWVzdF9pZBgBIAEoDRIOCgZzb2x2ZXIYAiABKAkSQAoJcmVzb3VyY2VzGAMgASgLMi0ub3J0b29sc193YXNtLmJyaWRnZS52MS5Tb2x2ZXJSZXNvdXJjZVJlcXVlc3QSGQoPZXhlY3V0ZV9wYXlsb2FkGAogASgMSAASPQoGY2FuY2VsGAsgASgLMisub3J0b29sc193YXNtLmJyaWRnZS52MS5Tb2x2ZXJDYW5jZWxSZXF1ZXN0SABCCwoJb3BlcmF0aW9uIigKFVNvbHZlclJlc291cmNlUmVxdWVzdBIPCgd0aHJlYWRzGAEgASgNIjAKE1NvbHZlckNhbmNlbFJlcXVlc3QSGQoRdGFyZ2V0X3JlcXVlc3RfaWQYASABKA0ikgMKFFNvbHZlckJyaWRnZVJlc3BvbnNlEhIKCnJlcXVlc3RfaWQYASABKA0SDgoGc29sdmVyGAIgASgJEg4KBmpvYl9pZBgDIAEoBBITCgtzZXF1ZW5jZV9pZBgEIAEoBBI5CgZzdGF0dXMYCiABKAsyJy5vcnRvb2xzX3dhc20uYnJpZGdlLnYxLlNvbHZlckpvYlN0YXR1c0gAEjsKB2ZhaWx1cmUYCyABKAsyKC5vcnRvb2xzX3dhc20uYnJpZGdlLnYxLlNvbHZlckpvYkZhaWx1cmVIABIXCg1ldmVudF9wYXlsb2FkGAwgASgMSAASGAoOcmVzdWx0X3BheWxvYWQYDSABKAxIABI/CgljYW5jZWxsZWQYDiABKAsyKi5vcnRvb2xzX3dhc20uYnJpZGdlLnYxLlNvbHZlckpvYkNhbmNlbGxlZEgAEjoKBXJlYWR5GA8gASgLMikub3J0b29sc193YXNtLmJyaWRnZS52MS5Tb2x2ZXJXb3JrZXJSZWFkeUgAQgkKB3BheWxvYWQiEwoRU29sdmVyV29ya2VyUmVhZHkiLwoSU29sdmVySm9iQ2FuY2VsbGVkEhkKEXRhcmdldF9yZXF1ZXN0X2lkGAEgASgNIlMKEFNvbHZlckV2ZW50QmF0Y2gSPwoJcmVzcG9uc2VzGAEgAygLMiwub3J0b29sc193YXNtLmJyaWRnZS52MS5Tb2x2ZXJCcmlkZ2VSZXNwb25zZSLNAQoPU29sdmVySm9iU3RhdHVzEhIKCnJlcXVlc3RfaWQYASABKA0SDgoGc29sdmVyGAIgASgJEjUKBXN0YXRlGAMgASgOMiYub3J0b29sc193YXNtLmJyaWRnZS52MS5Tb2x2ZXJKb2JTdGF0ZRIVCg1jcmVhdGVkX2F0X21zGAQgASgEEhUKDXN0YXJ0ZWRfYXRfbXMYBSABKAQSGQoRYWxsb2NhdGVkX3RocmVhZHMYBiABKA0SFgoOcXVldWVfcG9zaXRpb24YByABKA0iogEKEFNvbHZlckpvYkZhaWx1cmUSEgoKcmVxdWVzdF9pZBgBIAEoDRIOCgZzb2x2ZXIYAiABKAkSNwoEa2luZBgDIAEoDjIpLm9ydG9vbHNfd2FzbS5icmlkZ2UudjEuU29sdmVyRmFpbHVyZUtpbmQSDwoHbWVzc2FnZRgEIAEoCRINCgV0cmFjZRgFIAEoCRIRCglyZXRyeWFibGUYBiABKAgqigIKDlNvbHZlckpvYlN0YXRlEiAKHFNPTFZFUl9KT0JfU1RBVEVfVU5TUEVDSUZJRUQQABIbChdTT0xWRVJfSk9CX1NUQVRFX1FVRVVFRBABEh0KGVNPTFZFUl9KT0JfU1RBVEVfU1RBUlRJTkcQAhIcChhTT0xWRVJfSk9CX1NUQVRFX1JVTk5JTkcQAxIfChtTT0xWRVJfSk9CX1NUQVRFX0NBTkNFTExJTkcQBBIeChpTT0xWRVJfSk9CX1NUQVRFX0NBTkNFTExFRBAFEh4KGlNPTFZFUl9KT0JfU1RBVEVfU1VDQ0VFREVEEAYSGwoXU09MVkVSX0pPQl9TVEFURV9GQUlMRUQQByrnAwoRU29sdmVyRmFpbHVyZUtpbmQSIwofU09MVkVSX0ZBSUxVUkVfS0lORF9VTlNQRUNJRklFRBAAEiYKIlNPTFZFUl9GQUlMVVJFX0tJTkRfRVhFQ1VUT1JfRVJST1IQARIqCiZTT0xWRVJfRkFJTFVSRV9LSU5EX1JVTlRJTUVfTE9BRF9FUlJPUhACEiQKIFNPTFZFUl9GQUlMVVJFX0tJTkRfV09SS0VSX0NSQVNIEAMSKwonU09MVkVSX0ZBSUxVUkVfS0lORF9TRVJWRVJfRElTQ09OTkVDVEVEEAQSHwobU09MVkVSX0ZBSUxVUkVfS0lORF9USU1FT1VUEAUSIQodU09MVkVSX0ZBSUxVUkVfS0lORF9DQU5DRUxMRUQQBhIgChxTT0xWRVJfRkFJTFVSRV9LSU5EX0lOVEVSTkFMEAcSJwojU09MVkVSX0ZBSUxVUkVfS0lORF9JTlZBTElEX1JFUVVFU1QQCBInCiNTT0xWRVJfRkFJTFVSRV9LSU5EX1VOQVVUSEVOVElDQVRFRBAJEiIKHlNPTFZFUl9GQUlMVVJFX0tJTkRfUVVFVUVfRlVMTBAKEioKJlNPTFZFUl9GQUlMVVJFX0tJTkRfVU5TVVBQT1JURURfU09MVkVSEAtiBnByb3RvMw`),an=/* @__PURE__ */ (0,nn.messageDesc)(rn,0),on=/* @__PURE__ */ (0,nn.messageDesc)(rn,1),sn=/* @__PURE__ */ (0,nn.messageDesc)(rn,2),cn=/* @__PURE__ */ (0,nn.messageDesc)(rn,3),ln=/* @__PURE__ */ (0,nn.messageDesc)(rn,6),un=/* @__PURE__ */ (0,nn.messageDesc)(rn,7),dn=/* @__PURE__ */ (0,nn.messageDesc)(rn,8),fn=/* @__PURE__ */ (e=>(e[e.UNSPECIFIED=0]=`UNSPECIFIED`,e[e.QUEUED=1]=`QUEUED`,e[e.STARTING=2]=`STARTING`,e[e.RUNNING=3]=`RUNNING`,e[e.CANCELLING=4]=`CANCELLING`,e[e.CANCELLED=5]=`CANCELLED`,e[e.SUCCEEDED=6]=`SUCCEEDED`,e[e.FAILED=7]=`FAILED`,e))(fn||{}),pn=/* @__PURE__ */ (e=>(e[e.UNSPECIFIED=0]=`UNSPECIFIED`,e[e.EXECUTOR_ERROR=1]=`EXECUTOR_ERROR`,e[e.RUNTIME_LOAD_ERROR=2]=`RUNTIME_LOAD_ERROR`,e[e.WORKER_CRASH=3]=`WORKER_CRASH`,e[e.SERVER_DISCONNECTED=4]=`SERVER_DISCONNECTED`,e[e.TIMEOUT=5]=`TIMEOUT`,e[e.CANCELLED=6]=`CANCELLED`,e[e.INTERNAL=7]=`INTERNAL`,e[e.INVALID_REQUEST=8]=`INVALID_REQUEST`,e[e.UNAUTHENTICATED=9]=`UNAUTHENTICATED`,e[e.QUEUE_FULL=10]=`QUEUE_FULL`,e[e.UNSUPPORTED_SOLVER=11]=`UNSUPPORTED_SOLVER`,e))(pn||{}),mn=2e3,hn=fn,gn=pn,_n=class extends Error{constructor(e){super(`${e} executor already has an active job.`),this.name=`SolverExecutorBusyError`}},vn=class extends Error{constructor(e,t){super(`${e} worker job ${t} was cancelled.`),this.name=`AbortError`}},yn=class extends Error{constructor(e){super(`${e} direct executor does not support cancellation.`),this.name=`SolverCancellationUnsupportedError`}};function bn(e,t,n,r,i=0n,a=0,o=0){return{type:`status`,status:(0,tn.create)(un,{requestId:t,solver:e,state:n,createdAtMs:r,startedAtMs:i,allocatedThreads:a,queuePosition:o})}}function xn(e,t,n,r=gn.INTERNAL,i=``,a=!1){return{type:`failure`,failure:(0,tn.create)(dn,{requestId:t,solver:e,kind:r,message:n,trace:i,retryable:a})}}var Sn=1,Cn=2,wn=4,Tn=1,En=2,Dn=3;function On(e){let t=0;return e?.solution&&(t|=Sn),e?.bestBound&&(t|=Cn),e?.log&&(t|=wn),t}function kn(e){return e.__ortoolsCpSatCallbacks??={nextId:1,sinks:/* @__PURE__ */ new Map}}function An(e,t){return e===Tn?{type:`solution`,response:t}:e===En?{type:`bestBound`,bound:new DataView(t.buffer,t.byteOffset,t.byteLength).getFloat64(0,!0)}:e===Dn?{type:`log`,message:new TextDecoder().decode(t)}:null}function jn(){return BigInt(Date.now())}function Mn(e,t,n,r=0n){return bn(`cp-sat`,e,t,n,r)}function Nn(e,t,n=gn.INTERNAL,r=``,i=!1){return xn(`cp-sat`,e,t,n,r,i)}var Pn=class{constructor(e=en){this.loadModuleImpl=e,this.solver=`cp-sat`,this.nextRequestId=1,this.activeJob=null}async load(){await this.module()}module(){return this.loadModuleImpl()}execute(e,t){if(this.activeJob)throw new _n(this.solver);let n=this.nextCpSatRequestId(),r={};return this.activeJob=r,{requestId:n,result:this.run(n,e,t.onEvent).finally(()=>{this.activeJob===r&&(this.activeJob=null)}),cancel:()=>Promise.reject(new yn(this.solver))}}async run(e,t,n){let r=jn();try{await n(Mn(e,hn.STARTING,r));let i;switch(t.type){case`solve`:i={response:await this.solve(e,t,r,n),terminalState:hn.SUCCEEDED};break;case`validate`:i={response:await this.validate(e,t,r,n),terminalState:hn.SUCCEEDED};break;default:throw Error(`Unsupported CP-SAT operation.`)}return await n(Mn(e,i.terminalState,r)),i.response}catch(t){let i=t instanceof Error?t.message:String(t),a=t instanceof Error?t.stack??``:``;throw await n(Nn(e,i,gn.INTERNAL,a)),await n(Mn(e,hn.FAILED,r)),t}}terminate(e){}nextCpSatRequestId(){return this.nextRequestId++}async solve(e,t,n,r){let i=await this.module(),a=jn();await r(Mn(e,hn.RUNNING,n,a));let o=t.model,s=t.parameters,c=On(t.callbacks),l=Wt(i,o),u=Wt(i,s),d=0,f=null,p=[];try{let e=await Gt(i,async e=>{if(!c)return await i.ccall(`solve_model`,`number`,[`number`,`number`,`number`,`number`,`number`],[l,o.length,u,s.length,e],{async:!0});let t=kn(i);return d=t.nextId++,t.sinks.set(d,(e,t)=>{let n=An(e,t);if(n&&!f)try{let e=r(n);e&&p.push(Promise.resolve(e).catch(e=>{f??=e}))}catch(e){f??=e}}),await i.ccall(`solve_model_with_callback_events`,`number`,[`number`,`number`,`number`,`number`,`number`,`number`,`number`],[l,o.length,u,s.length,c,d,e],{async:!0})},e=>i._free_buffer(e));if(await Promise.all(p),f)throw f;return{type:`solve`,response:e}}finally{d&&kn(i).sinks.delete(d),l&&i._free(l),u&&i._free(u)}}async validate(e,t,n,r){let i=await this.module(),a=jn();await r(Mn(e,hn.RUNNING,n,a));let o=t.model,s=Wt(i,o);try{let e=await Gt(i,e=>i.ccall(`validate_model`,`number`,[`number`,`number`,`number`],[s,o.length,e],{async:!0}),e=>i._free_buffer(e)),t=new TextDecoder().decode(e);return{type:`validate`,ok:t.length===0,message:t}}finally{s&&i._free(s)}}},Fn=`or-tools-wasm`,In=`1.0.0`,Ln=`https://or-tools-wasm-api.axelwickman.com/status`,Rn=class extends Error{constructor(e=`OR-Tools WASM Cloud execution is not currently available.`,t){super(e),this.name=`CloudExecutorUnavailableError`,this.cause=t?.cause}};function zn(){return globalThis.process}function Bn(){let e=zn();if(!e||Vn(`NO_COLOR`)!==void 0)return!1;let t=Vn(`FORCE_COLOR`);return t===void 0?e.stdout?.isTTY===!0:t!==`0`}function Vn(e){try{return zn()?.env?.[e]}catch{return}}var Hn=class{constructor(e,t={}){this.solver=e,this.nextRequestId=1,this.controllers=/* @__PURE__ */ new Set,this.fetchImpl=t.fetch??globalThis.fetch,this.log=t.log??(e=>console.info(e)),this.test=t.test===!0}async load(){}execute(e,t){let n=this.nextRequestId++,r=new AbortController;return this.controllers.add(r),{requestId:n,result:this.run(n,r,t),cancel:()=>this.cancel(n,r,t)}}terminate(e){for(let t of this.controllers.values())t.abort(e);this.controllers.clear()}async run(e,t,n){let r=BigInt(Date.now()),i=n.onEvent;await i(bn(this.solver,e,hn.STARTING,r));try{let n=await(await this.fetchImpl(Ln,{method:`POST`,headers:{accept:Bn()?`text/x-ansi`:`text/plain`,"content-type":`application/json`},body:JSON.stringify({package:Fn,version:In,...this.test?{test:!0}:{}}),signal:t.signal})).text();n&&this.log(n);let a=new Rn;throw await i(xn(this.solver,e,a.message,gn.UNSUPPORTED_SOLVER)),await i(bn(this.solver,e,hn.FAILED,r)),a}catch(n){if(n instanceof Rn)throw n;if(t.signal.aborted){let t=new Rn(`OR-Tools WASM Cloud status request was cancelled.`,{cause:n});throw await i(xn(this.solver,e,t.message,gn.CANCELLED)),await i(bn(this.solver,e,hn.CANCELLED,r)),t}let a=new Rn(`Could not reach OR-Tools WASM Cloud.`,{cause:n});throw await i(xn(this.solver,e,a.message,gn.EXECUTOR_ERROR)),await i(bn(this.solver,e,hn.FAILED,r)),a}finally{this.controllers.delete(t)}}async cancel(e,t,n){this.controllers.has(t)&&(await n.onEvent(bn(this.solver,e,hn.CANCELLING,BigInt(Date.now()))),t.abort())}},Un=g(je(),1),Wn=g(je(),1);function Gn(e){return(0,Wn.toBinary)(an,(0,Wn.create)(an,{requestId:e.requestId,solver:e.solver,resources:(0,Wn.create)(on,{threads:e.resources?.threads??0}),operation:{case:`executePayload`,value:e.payload}}))}function Kn(e,t,n){return(0,Wn.toBinary)(an,(0,Wn.create)(an,{requestId:e,solver:t,operation:{case:`cancel`,value:(0,Wn.create)(sn,{targetRequestId:n})}}))}function qn(e){return(0,Wn.fromBinary)(an,e)}function Jn(e){return(0,Wn.fromBinary)(cn,e)}var Yn=`application/x-protobuf`,Xn=`text/event-stream`,Zn=202,Qn=204,$n=409,er=class extends Error{constructor(e,t=!1){super(e.message),this.failure=e,this.emitted=t,e.trace&&(this.stack=e.trace)}},tr=class extends Error{constructor(e){let t=e;super(t instanceof Error?t.message:String(t)),this.cause=e,this.name=t instanceof Error?t.name:`Error`,t instanceof Error&&(this.stack=t.stack)}},nr=class extends Error{constructor(e,t){super(e),this.status=t}};function rr(e){return e.byteOffset===0&&e.byteLength===e.buffer.byteLength?e.buffer:e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}function ir(e){return new Promise(t=>setTimeout(t,e))}function ar(e){let t=globalThis.atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e+=1)n[e]=t.charCodeAt(e);return n}async function*or(e){let t=e.getReader(),n=new TextDecoder,r=``;try{for(;;){let e=await t.read();r+=n.decode(e.value,{stream:!e.done}),r=r.replace(/\r\n/g,`
`);let i=r.indexOf(`

`);for(;i>=0;){let e=r.slice(0,i);r=r.slice(i+2);let t=e.split(`
`).filter(e=>e.startsWith(`data:`)).map(e=>e.slice(5).trimStart()).join(`
`);t&&(yield t),i=r.indexOf(`

`)}if(e.done)return}}finally{t.releaseLock()}}var sr=class{constructor(e,t){this.codec=e,this.nextRequestId=1,this.solver=e.solver;let n=String(t.url);this.baseUrl=n.endsWith(`/`)?n:`${n}/`,this.headers={...t.headers},t.authToken&&(this.headers.Authorization=`Bearer ${t.authToken}`);let r=t.fetch??globalThis.fetch;if(typeof r!=`function`)throw Error(`${e.label} server executor requires fetch().`);this.fetchImpl=r.bind(globalThis),this.statusIntervalMs=t.statusIntervalMs??mn}execute(e,t){let n=this.nextRequestId++,r=this.submit(n,e,t.resources);return{requestId:n,result:this.run(n,r,t),cancel:()=>this.cancel(n,r)}}async load(){let e=await this.fetch(new URL(`healthz`,this.baseUrl),{headers:this.headers});if(!e.ok)throw Error(`${this.codec.label} server health check failed (${e.status} ${e.statusText}).`)}terminate(e){}async fetch(e,t){try{return await this.fetchImpl(e,t)}catch(e){throw new tr(e)}}async submit(e,t,n){let r=Gn({requestId:e,solver:this.solver,payload:this.codec.encodeRequest(t),resources:n}),i=await this.fetch(new URL(`jobs`,this.baseUrl),{method:`POST`,headers:{accept:Yn,"content-type":Yn,...this.headers},body:rr(r)});return i.ok||await this.throwHttpError(`submission`,i),Jn(new Uint8Array(await i.arrayBuffer()))}async run(e,t,n){try{let e=await t,r=await this.handleResponse(e,n);if(r!==null)return r;if(e.jobId===0n)throw Error(`${this.codec.label} server did not return a job id.`);let i=await this.streamResult(e.jobId,e.sequenceId,n);return i.complete?i.result:await this.pollResult(e.jobId,i.sequenceId,n)}catch(t){if(t instanceof er)throw t.emitted||await n.onEvent({type:`failure`,failure:t.failure}),t;let r=gn.EXECUTOR_ERROR,i=!1;throw t instanceof tr?(r=t.name===`TimeoutError`?gn.TIMEOUT:t.name===`AbortError`?gn.CANCELLED:gn.SERVER_DISCONNECTED,i=r!==gn.CANCELLED):t instanceof nr&&(t.status===401||t.status===403?r=gn.UNAUTHENTICATED:t.status===408||t.status===504?r=gn.TIMEOUT:t.status===429?r=gn.QUEUE_FULL:t.status>=400&&t.status<500&&(r=gn.INVALID_REQUEST),i=t.status===408||t.status===429||t.status>=500),await n.onEvent(xn(this.solver,e,t instanceof Error?t.message:String(t),r,t instanceof Error?t.stack??``:``,i)),t}}async streamResult(e,t,n){let r=t,i;try{i=await this.fetch(new URL(`jobs/${e}/stream?after=${t}`,this.baseUrl),{headers:{accept:Xn,...this.headers}})}catch{return{complete:!1,sequenceId:r}}if(i.status===404||i.status===$n||(i.ok||await this.throwHttpError(`event stream`,i),!i.headers.get(`content-type`)?.includes(Xn)||!i.body))return{complete:!1,sequenceId:r};try{for await(let t of or(i.body)){let i=Jn(ar(t));i.sequenceId>r&&(r=i.sequenceId);let a=i.payload.case===`resultPayload`||i.payload.case===`failure`;try{let e=await this.handleResponse(i,n);if(e!==null)return{complete:!0,result:e}}finally{a&&await this.release(e)}}}catch(e){if(e instanceof er)throw e;return{complete:!1,sequenceId:r}}return{complete:!1,sequenceId:r}}async pollResult(e,t,n){let r=t,i=!0;for(;;){i||await ir(this.statusIntervalMs),i=!1;let t=await this.fetch(new URL(`jobs/${e}/events?after=${r}`,this.baseUrl),{headers:{accept:Yn,...this.headers}});t.ok||await this.throwHttpError(`events`,t);let a=new Uint8Array(await t.arrayBuffer());if(a.byteLength){let t=(0,Un.fromBinary)(ln,a);for(let i of t.responses){i.sequenceId>r&&(r=i.sequenceId);let t=i.payload.case===`resultPayload`||i.payload.case===`failure`;try{let e=await this.handleResponse(i,n);if(e!==null)return e}finally{t&&await this.release(e)}}}let o=await this.fetchJob(new URL(`jobs/${e}/result`,this.baseUrl),`result`);if(!o)continue;let s=o.payload.case===`resultPayload`||o.payload.case===`failure`;try{let e=await this.handleResponse(o,n);if(e!==null)return e}finally{s&&await this.release(e)}}}async release(e){await this.fetch(new URL(`jobs/${e}`,this.baseUrl),{method:`DELETE`,headers:this.headers}).catch(()=>{})}async fetchJob(e,t){let n=await this.fetch(e,{headers:{accept:Yn,...this.headers}});if(n.status===Qn)return null;n.status!==Zn&&!n.ok&&await this.throwHttpError(t,n);let r=new Uint8Array(await n.arrayBuffer());return r.byteLength?Jn(r):null}async handleResponse(e,t){if(e.solver&&e.solver!==this.solver)throw Error(`${this.codec.label} server returned response for solver ${e.solver}.`);switch(e.payload.case){case`failure`:throw await t.onEvent({type:`failure`,failure:e.payload.value}),new er(e.payload.value,!0);case`status`:return await t.onEvent({type:`status`,status:e.payload.value}),null;case`eventPayload`:{let n=this.codec.decodeEvent?.(e.payload.value);return n!=null&&await t.onEvent(n),null}case`resultPayload`:return this.codec.decodeResult(e.payload.value);default:return null}}async cancel(e,t){let n=await t;if(n.jobId===0n)throw Error(`${this.codec.label} server did not return a job id.`);let r=Kn(this.nextRequestId++,this.solver,e),i=await this.fetch(new URL(`jobs/${n.jobId}/cancel`,this.baseUrl),{method:`POST`,headers:{accept:Yn,"content-type":Yn,...this.headers},body:rr(r)});i.ok||await this.throwHttpError(`cancel`,i);let a=new Uint8Array(await i.arrayBuffer());if(!a.byteLength)return;let o=Jn(a);if(o.payload.case===`failure`)throw new er(o.payload.value);if(o.payload.case!==`cancelled`||o.payload.value.targetRequestId!==e)throw Error(`${this.codec.label} server returned an invalid cancellation acknowledgement.`)}async throwHttpError(e,t){if((t.headers.get(`content-type`)??``).includes(Yn)){let e=new Uint8Array(await t.arrayBuffer());if(e.byteLength){let t=Jn(e);if(t.payload.case===`failure`)throw new er(t.payload.value)}}let n=await t.text().catch(()=>``);throw new nr(`${this.codec.label} server job ${e} failed (${t.status} ${t.statusText}): ${n}`,t.status)}},cr=class{constructor(e){this.options=e,this.worker=null,this.workerPromise=null,this.readyPromise=null,this.rejectReady=null,this.pendingRequests=/* @__PURE__ */ new Map,this.generation=0,this.terminationError=/* @__PURE__ */ Error(`Worker terminated.`)}async load(){(await this.ensureReady()).unref?.()}async post(e,t,n,r){let i=this.generation,a=await this.ensureReady(i);return a.ref?.(),new Promise((i,o)=>{r?.(),this.pendingRequests.set(this.options.getRequestId(e),{resolve:i,reject:o,onEvent:t,eventChain:Promise.resolve()}),a.postMessage(e,n)})}terminate(e){let t=e instanceof Error?e:Error(e??`Worker terminated.`);this.generation++,this.terminationError=t,this.worker?.terminate(),this.worker=null,this.workerPromise=null,this.rejectReady?.(t),this.rejectReady=null,this.readyPromise=null;for(let e of this.pendingRequests.values())e.reject(t);this.pendingRequests.clear()}async ensureReady(e=this.generation){let t=await this.ensureWorker(e);if(!this.readyPromise)throw Error(`Worker ready state unavailable.`);if(await this.readyPromise,e!==this.generation)throw this.terminationError;return t}async ensureWorker(e){if(e!==this.generation)throw this.terminationError;if(this.worker)return this.worker;this.workerPromise??=this.options.createWorker();let t=await this.workerPromise;if(e!==this.generation)throw t.terminate(),this.terminationError;return this.worker=t,this.workerPromise=null,this.readyPromise=new Promise((e,n)=>{this.rejectReady=n;let r=r=>{if(this.options.handleMessage?.(r))return;if(this.options.isReady?.(r)){this.rejectReady=null,e();return}let i=this.options.getResponseId(r),a=i===void 0?void 0:this.pendingRequests.get(i);if(this.options.isEvent?.(r))a?.onEvent&&(a.eventChain=a.eventChain.then(()=>a.onEvent?.(r)).catch(e=>{this.pendingRequests.get(i)===a&&this.pendingRequests.delete(i),a.reject(e),this.pendingRequests.size===0&&t.unref?.()}));else if(this.options.isError?.(r)){let e=Error(this.options.errorMessage?.(r)??`Worker request failed.`);a?(a.reject(e),this.pendingRequests.delete(i),this.pendingRequests.size===0&&t.unref?.()):n(e)}else a&&(this.pendingRequests.delete(i),a.eventChain.then(()=>{a.resolve(r),this.pendingRequests.size===0&&t.unref?.()},e=>{a.reject(e),this.pendingRequests.size===0&&t.unref?.()}))},i=e=>{let t=this.options.loadErrorMessage?.(e)??lr(e),r=Error(t);this.rejectReady=null,n(r),this.terminate(r.message)};typeof t.on==`function`?(t.on(`message`,r),t.on(`error`,i)):(t.onmessage=e=>r(e.data),t.onerror=i),this.options.isReady||(this.rejectReady=null,e())}),t}};function lr(e){return`Worker failed to load: ${e instanceof Error?e.message:e.error instanceof Error?e.error.message:e.message||`The runtime blocked or failed to load the worker module.`}`}var ur=class{constructor(e,t,n=!1){this.codec=e,this.supportsSharedCancellation=n,this.nextRequestId=1,this.activeJob=null,this.cancellation=null,this.solver=e.solver,this.worker=new cr({createWorker:t,isReady:e=>{if(!(e instanceof Uint8Array))return!1;let t=Jn(e);return t.solver===this.solver&&t.payload.case===`ready`},getRequestId:e=>qn(e).requestId,getResponseId:e=>e instanceof Uint8Array?Jn(e).requestId:void 0,isEvent:e=>{if(!(e instanceof Uint8Array))return!1;let t=Jn(e).payload.case;return t===`eventPayload`||t===`status`},handleMessage:e=>e instanceof Uint8Array?!1:(this.cancellation=e,!0),loadErrorMessage:t=>lr(t).replace(`Worker`,`${e.label} worker`)})}execute(e,t){if(this.activeJob)throw new _n(this.codec.label);let n=this.nextRequestId++,r={cancelled:!1,createdAtMs:BigInt(Date.now()),request:e};return this.activeJob=r,{requestId:n,result:this.run(n,e,t,r).finally(()=>{this.activeJob===r&&(this.activeJob=null)}),cancel:()=>this.cancel(n,t,r)}}async load(){await this.worker.load()}terminate(e){this.worker.terminate(e??`${this.codec.label} worker executor terminated.`)}async run(e,t,n,r){let i=Gn({requestId:e,solver:this.solver,payload:this.codec.encodeRequest(t)}),a=!1;try{let e=await this.worker.post(i,async e=>{if(!(e instanceof Uint8Array))return;let t=Jn(e);if(t.payload.case===`status`)await n.onEvent({type:`status`,status:t.payload.value});else if(t.payload.case===`eventPayload`){let e=this.codec.decodeEvent?.(t.payload.value);e!=null&&await n.onEvent(e)}},[i.buffer],()=>{if(this.cancellation&&Atomics.store(new Uint8Array(this.cancellation.memory),this.cancellation.byteOffset,0),r.cancelled)throw r.error});if(!(e instanceof Uint8Array))throw Error(`${this.codec.label} worker returned an invalid message.`);if(r.cancelled)throw r.error;let t=Jn(e);if(t.payload.case===`failure`){a=!0,await n.onEvent({type:`failure`,failure:t.payload.value});let e=Error(t.payload.value.message);throw t.payload.value.trace&&(e.stack=t.payload.value.trace),e}if(t.payload.case!==`resultPayload`)throw Error(`${this.codec.label} worker returned unexpected response: ${t.payload.case??`empty`}`);return this.codec.decodeResult(t.payload.value)}catch(t){throw r.cancelled?(await n.onEvent(bn(this.solver,e,hn.CANCELLED,r.createdAtMs)),r.error??t):(a||await n.onEvent(xn(this.solver,e,t instanceof Error?t.message:String(t),gn.WORKER_CRASH,t instanceof Error?t.stack??``:``,!0)),t)}}async cancel(e,t,n){if(!(this.activeJob!==n||n.cancelled)){if(n.cancelled=!0,n.error=new vn(this.codec.label,e),await t.onEvent(bn(this.solver,e,hn.CANCELLING,n.createdAtMs)),!(typeof this.supportsSharedCancellation==`function`?this.supportsSharedCancellation(n.request):this.supportsSharedCancellation))this.worker.terminate(n.error);else{if(await this.worker.load(),!this.cancellation)throw Error(`${this.codec.label} worker did not provide a cancellation signal.`);Atomics.store(new Uint8Array(this.cancellation.memory),this.cancellation.byteOffset,1)}}}},dr=`// Copyright 2010-2025 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Proto describing a general Constraint Programming (CP) problem.

syntax = "proto3";

package operations_research.sat;

option csharp_namespace = "Google.OrTools.Sat";
option go_package = "github.com/google/or-tools/ortools/sat/proto/cpmodel";
option java_package = "com.google.ortools.sat";
option java_multiple_files = true;
option java_outer_classname = "CpModelProtobuf";

// An integer variable.
//
// It will be referred to by an int32 corresponding to its index in a
// CpModelProto variables field.
//
// Depending on the context, a reference to a variable whose domain is in [0, 1]
// can also be seen as a Boolean that will be true if the variable value is 1
// and false if it is 0. When used in this context, the field name will always
// contain the word "literal".
//
// Negative reference (advanced usage): to simplify the creation of a model and
// for efficiency reasons, all the "literal" or "variable" fields can also
// contain a negative index. A negative index i will refer to the negation of
// the integer variable at index -i -1 or to NOT the literal at the same index.
//
// Ex: A variable index 4 will refer to the integer variable model.variables(4)
// and an index of -5 will refer to the negation of the same variable. A literal
// index 4 will refer to the logical fact that model.variable(4) == 1 and a
// literal index of -5 will refer to the logical fact model.variable(4) == 0.
message IntegerVariableProto {
  // For debug/logging only. Can be empty.
  string name = 1;

  // The variable domain given as a sorted list of n disjoint intervals
  // [min, max] and encoded as [min_0, max_0,  ..., min_{n-1}, max_{n-1}].
  //
  // The most common example being just [min, max].
  // If min == max, then this is a constant variable.
  //
  // We have:
  //  - domain_size() is always even.
  //  - min == domain.front();
  //  - max == domain.back();
  //  - for all i < n   :      min_i <= max_i
  //  - for all i < n-1 :  max_i + 1 < min_{i+1}.
  //
  // Note that we check at validation that a variable domain is small enough so
  // that we don't run into integer overflow in our algorithms. Because of that,
  // you cannot just have "unbounded" variable like [0, kint64max] and should
  // try to specify tighter domains.
  repeated int64 domain = 2;
}

// Argument of the constraints of the form OP(literals).
message BoolArgumentProto {
  repeated int32 literals = 1;
}

// Some constraints supports linear expression instead of just using a reference
// to a variable. This is especially useful during presolve to reduce the model
// size.
message LinearExpressionProto {
  repeated int32 vars = 1;
  repeated int64 coeffs = 2;
  int64 offset = 3;
}

message LinearArgumentProto {
  LinearExpressionProto target = 1;
  repeated LinearExpressionProto exprs = 2;
}

// All expressions must take different values.
message AllDifferentConstraintProto {
  repeated LinearExpressionProto exprs = 1;
}

// The linear sum vars[i] * coeffs[i] must fall in the given domain. The domain
// has the same format as the one in IntegerVariableProto.
//
// Note that the validation code currently checks using the domain of the
// involved variables that the sum can always be computed without integer
// overflow and throws an error otherwise.
message LinearConstraintProto {
  repeated int32 vars = 1;
  repeated int64 coeffs = 2;  // Same size as vars.
  repeated int64 domain = 3;
}

// The constraint linear_target = exprs[linear_index].
// This enforces that index takes one of the value in [0, vars_size()).
message ElementConstraintProto {
  int32 index = 1;          // Legacy field.
  int32 target = 2;         // Legacy field.
  repeated int32 vars = 3;  // Legacy field.
  LinearExpressionProto linear_index = 4;
  LinearExpressionProto linear_target = 5;
  repeated LinearExpressionProto exprs = 6;
}

// This is not really a constraint. It is there so it can be referred by other
// constraints using this "interval" concept.
//
// IMPORTANT: For now, this constraint do not enforce any relations on the
// components, and it is up to the client to add in the model:
// - enforcement => start + size == end.
// - enforcement => size >= 0  // Only needed if size is not already >= 0.
message IntervalConstraintProto {
  LinearExpressionProto start = 4;
  LinearExpressionProto end = 5;
  LinearExpressionProto size = 6;
}

// All the intervals (index of IntervalConstraintProto) must be disjoint. More
// formally, there must exist a sequence so that for each consecutive intervals,
// we have end_i <= start_{i+1}. In particular, intervals of size zero do matter
// for this constraint. This is also known as a disjunctive constraint in
// scheduling.
message NoOverlapConstraintProto {
  repeated int32 intervals = 1;
}

// The boxes defined by [start_x, end_x) * [start_y, end_y) cannot overlap.
// Furthermore, one box is optional if at least one of the x or y interval is
// optional.
//
// Note that the case of boxes of size zero is special. The following cases
// violate the constraint:
//   - a point box inside a box with a non zero area
//   - a line box overlapping a box with a non zero area
//   - one vertical line box crossing an horizontal line box.
message NoOverlap2DConstraintProto {
  repeated int32 x_intervals = 1;
  repeated int32 y_intervals = 2;  // Same size as x_intervals.
}

// The sum of the demands of the intervals at each interval point cannot exceed
// a capacity. Note that intervals are interpreted as [start, end) and as
// such intervals like [2,3) and [3,4) do not overlap for the point of view of
// this constraint. Moreover, intervals of size zero are ignored.
//
// All demands must not contain any negative value in their domains. This is
// checked at validation. Even if there are no intervals, this constraint
// implicit enforces capacity >= 0. In other words, a negative capacity is
// considered valid but always infeasible.
message CumulativeConstraintProto {
  LinearExpressionProto capacity = 1;
  repeated int32 intervals = 2;
  repeated LinearExpressionProto demands = 3;  // Same size as intervals.
}

// Maintain a reservoir level within bounds. The water level starts at 0, and at
// any time, it must be within [min_level, max_level].
//
// If the variable active_literals[i] is true, and if the expression
// time_exprs[i] is assigned a value t, then the current level changes by
// level_changes[i] at the time t. Therefore, at any time t:
//
// sum(level_changes[i] * active_literals[i] if time_exprs[i] <= t)
//   in [min_level, max_level]
//
// Note that min level must be <= 0, and the max level must be >= 0. Please use
// fixed level_changes to simulate initial state.
//
// The array of boolean variables 'actives', if defined, indicates which actions
// are actually performed. If this array is not defined, then it is assumed that
// all actions will be performed.
message ReservoirConstraintProto {
  int64 min_level = 1;
  int64 max_level = 2;
  repeated LinearExpressionProto time_exprs = 3;
  repeated LinearExpressionProto level_changes = 6;
  repeated int32 active_literals = 5;
  reserved 4;
}

// The circuit constraint is defined on a graph where the arc presence are
// controlled by literals. Each arc is given by an index in the
// tails/heads/literals lists that must have the same size.
//
// For now, we ignore node indices with no incident arc. All the other nodes
// must have exactly one incoming and one outgoing selected arc (i.e. literal at
// true). All the selected arcs that are not self-loops must form a single
// circuit. Note that multi-arcs are allowed, but only one of them will be true
// at the same time. Multi-self loop are disallowed though.
message CircuitConstraintProto {
  repeated int32 tails = 3;
  repeated int32 heads = 4;
  repeated int32 literals = 5;
}

// The "VRP" (Vehicle Routing Problem) constraint.
//
// The direct graph where arc #i (from tails[i] to head[i]) is present iff
// literals[i] is true must satisfy this set of properties:
// - #incoming arcs == 1 except for node 0.
// - #outgoing arcs == 1 except for node 0.
// - for node zero, #incoming arcs == #outgoing arcs.
// - There are no duplicate arcs.
// - Self-arcs are allowed except for node 0.
// - There is no cycle in this graph, except through node 0.
//
// Note: Currently this constraint expects all the nodes in [0, num_nodes) to
// have at least one incident arc. The model will be considered invalid if it
// is not the case. You can add self-arc fixed to one to ignore some nodes if
// needed.
//
// TODO(user): It is probably possible to generalize this constraint to a
// no-cycle in a general graph, or a no-cycle with sum incoming <= 1 and sum
// outgoing <= 1 (more efficient implementation). On the other hand, having this
// specific constraint allow us to add specific "cuts" to a VRP problem.
message RoutesConstraintProto {
  repeated int32 tails = 1;
  repeated int32 heads = 2;
  repeated int32 literals = 3;

  // DEPRECATED. These fields are no longer used. The solver ignores them.
  repeated int32 demands = 4;
  int64 capacity = 5;

  // A set of linear expressions associated with the nodes.
  message NodeExpressions {
    // The i-th element is the linear expression associated with the i-th node.
    repeated LinearExpressionProto exprs = 1;
  }

  // Expressions associated with the nodes of the graph, such as the load of the
  // vehicle arriving at a node, or the time at which a vehicle arrives at a
  // node. Expressions with the same "dimension" (such as "load" or "time") must
  // be listed together.
  // This field is optional. If it is set, the linear constraints of size 1 or 2
  // between the variables in these expressions will be used to derive cuts for
  // this constraint. If it is not set, the solver will try to automatically
  // derive it, from the linear constraints of size 1 or 2 in the model (this
  // can fail in complex cases).
  repeated NodeExpressions dimensions = 6;
}

// The values of the n-tuple formed by the given expression can only be one of
// the listed n-tuples in values. The n-tuples are encoded in a flattened way:
//     [tuple0_v0, tuple0_v1, ..., tuple0_v{n-1}, tuple1_v0, ...].
// Corner cases:
//  - If all \`vars\`, \`values\` and \`exprs\` are empty, the constraint is trivially
//    true, irrespective of the value of \`negated\`.
//  - If \`values\` is empty but either vars or exprs is not, the constraint is
//    trivially false if \`negated\` is false, and trivially true if \`negated\` is
//    true.
//  - If \`vars\` and \`exprs\` are empty but \`values\` is not, the model is invalid.
message TableConstraintProto {
  repeated int32 vars = 1;  // Legacy field.
  repeated int64 values = 2;
  repeated LinearExpressionProto exprs = 4;

  // If true, the meaning is "negated", that is we forbid any of the given
  // tuple from a feasible assignment.
  bool negated = 3;
}

// The two arrays of variable each represent a function, the second is the
// inverse of the first: f_direct[i] == j <=> f_inverse[j] == i.
message InverseConstraintProto {
  repeated int32 f_direct = 1;
  repeated int32 f_inverse = 2;
}

// This constraint forces a sequence of expressions to be accepted by an
// automaton.
message AutomatonConstraintProto {
  // A state is identified by a non-negative number. It is preferable to keep
  // all the states dense in says [0, num_states). The automaton starts at
  // starting_state and must finish in any of the final states.
  int64 starting_state = 2;
  repeated int64 final_states = 3;

  // List of transitions (all 3 vectors have the same size). Both tail and head
  // are states, label is any variable value. No two outgoing transitions from
  // the same state can have the same label.
  repeated int64 transition_tail = 4;
  repeated int64 transition_head = 5;
  repeated int64 transition_label = 6;

  // Legacy field.
  repeated int32 vars = 7;
  // The sequence of expressions. The automaton is ran for exprs_size() "steps"
  // and the value of exprs[i] corresponds to the transition label at step i.
  repeated LinearExpressionProto exprs = 8;
}

// A list of variables, without any semantics.
message ListOfVariablesProto {
  repeated int32 vars = 1;
}

// Next id: 31
message ConstraintProto {
  // For debug/logging only. Can be empty.
  string name = 1;

  // The constraint will be enforced iff all literals listed here are true. If
  // this is empty, then the constraint will always be enforced. An enforced
  // constraint must be satisfied, and an un-enforced one will simply be
  // ignored.
  //
  // This is also called half-reification. To have an equivalence between a
  // literal and a constraint (full reification), one must add both a constraint
  // (controlled by a literal l) and its negation (controlled by the negation of
  // l).
  //
  // Important: as of September 2025, some constraints might be less efficient
  // with enforcement than without: circuit, routes, no_overlap, no_overlap_2d,
  // and cumulative. If performance is not great, consider using a model without
  // these constraints enforced.
  repeated int32 enforcement_literal = 2;

  // The actual constraint with its arguments.
  oneof constraint {
    // The bool_or constraint forces at least one literal to be true.
    BoolArgumentProto bool_or = 3;

    // The bool_and constraint forces all of the literals to be true.
    //
    // This is a "redundant" constraint in the sense that this can easily be
    // encoded with many bool_or or at_most_one. It is just more space efficient
    // and handled slightly differently internally.
    BoolArgumentProto bool_and = 4;

    // The at_most_one constraint enforces that no more than one literal is
    // true at the same time.
    //
    // Note that an at most one constraint of length n could be encoded with n
    // bool_and constraint with n-1 term on the right hand side. So in a sense,
    // this constraint contribute directly to the "implication-graph" or the
    // 2-SAT part of the model.
    BoolArgumentProto at_most_one = 26;

    // The exactly_one constraint force exactly one literal to true and no more.
    //
    // Anytime a bool_or (it could have been called at_least_one) is included
    // into an at_most_one, then the bool_or is actually an exactly one
    // constraint, and the extra literal in the at_most_one can be set to false.
    // So in this sense, this constraint is not really needed. it is just here
    // for a better description of the problem structure and to facilitate some
    // algorithm.
    BoolArgumentProto exactly_one = 29;

    // The bool_xor constraint forces an odd number of the literals to be true.
    BoolArgumentProto bool_xor = 5;

    // The int_div constraint forces the target to equal exprs[0] / exprs[1].
    // The division is "rounded" towards zero, so we can have for instance
    // (2 = 12 / 5) or (-3 = -10 / 3). If you only want exact integer division,
    // then you should use instead of t = a / b, the int_prod constraint
    // a = b * t.
    //
    // If 0 belongs to the domain of exprs[1], then the model is deemed invalid.
    LinearArgumentProto int_div = 7;

    // The int_mod constraint forces the target to equal exprs[0] % exprs[1].
    // The domain of exprs[1] must be strictly positive. The sign of the target
    // is the same as the sign of exprs[0].
    LinearArgumentProto int_mod = 8;

    // The int_prod constraint forces the target to equal the product of all
    // variables. By convention, because we can just remove term equal to one,
    // the empty product forces the target to be one.
    //
    // Note that the solver checks for potential integer overflow. So the
    // product of the maximum absolute value of all the terms (using the initial
    // domain) should fit on an int64. Otherwise the model will be declared
    // invalid.
    LinearArgumentProto int_prod = 11;

    // The lin_max constraint forces the target to equal the maximum of all
    // linear expressions.
    // Note that this can model a minimum simply by negating all expressions.
    LinearArgumentProto lin_max = 27;

    // The linear constraint enforces a linear inequality among the variables,
    // such as 0 <= x + 2y <= 10.
    LinearConstraintProto linear = 12;

    // The all_diff constraint forces all variables to take different values.
    AllDifferentConstraintProto all_diff = 13;

    // The element constraint forces the variable with the given index
    // to be equal to the target.
    ElementConstraintProto element = 14;

    // The circuit constraint takes a graph and forces the arcs present
    // (with arc presence indicated by a literal) to form a unique cycle.
    CircuitConstraintProto circuit = 15;

    // The routes constraint implements the vehicle routing problem.
    RoutesConstraintProto routes = 23;

    // The table constraint enforces what values a tuple of variables may
    // take.
    TableConstraintProto table = 16;

    // The automaton constraint forces a sequence of variables to be accepted
    // by an automaton.
    AutomatonConstraintProto automaton = 17;

    // The inverse constraint forces two arrays to be inverses of each other:
    // the values of one are the indices of the other, and vice versa.
    InverseConstraintProto inverse = 18;

    // The reservoir constraint forces the sum of a set of active demands
    // to always be between a specified minimum and maximum value during
    // specific times.
    ReservoirConstraintProto reservoir = 24;

    // Constraints on intervals.
    //
    // The first constraint defines what an "interval" is and the other
    // constraints use references to it. All the intervals that have an
    // enforcement_literal set to false are ignored by these constraints.
    //
    // TODO(user): Explain what happen for intervals of size zero. Some
    // constraints ignore them; others do take them into account.

    // The interval constraint takes a start, end, and size, and forces
    // start + size == end.
    IntervalConstraintProto interval = 19;

    // The no_overlap constraint prevents a set of intervals from
    // overlapping; in scheduling, this is called a disjunctive
    // constraint.
    NoOverlapConstraintProto no_overlap = 20;

    // The no_overlap_2d constraint prevents a set of boxes from overlapping.
    NoOverlap2DConstraintProto no_overlap_2d = 21;

    // The cumulative constraint ensures that for any integer point, the sum
    // of the demands of the intervals containing that point does not exceed
    // the capacity.
    CumulativeConstraintProto cumulative = 22;

    // This constraint is not meant to be used and will be rejected by the
    // solver. It is meant to mark variable when testing the presolve code.
    ListOfVariablesProto dummy_constraint = 30;
  }
}

// Optimization objective.
message CpObjectiveProto {
  // The linear terms of the objective to minimize.
  // For a maximization problem, one can negate all coefficients in the
  // objective and set scaling_factor to -1.
  repeated int32 vars = 1;
  repeated int64 coeffs = 4;

  // The displayed objective is always:
  //   scaling_factor * (sum(coefficients[i] * objective_vars[i]) + offset).
  // This is needed to have a consistent objective after presolve or when
  // scaling a double problem to express it with integers.
  //
  // Note that if scaling_factor is zero, then it is assumed to be 1, so that by
  // default these fields have no effect.
  double offset = 2;
  double scaling_factor = 3;

  // If non-empty, only look for an objective value in the given domain.
  // Note that this does not depend on the offset or scaling factor, it is a
  // domain on the sum of the objective terms only.
  repeated int64 domain = 5;

  // Internal field. Do not set. When we scale a FloatObjectiveProto to a
  // integer version, we set this to true if the scaling was exact (i.e. all
  // original coeff were integer for instance).
  //
  // TODO(user): Put the error bounds we computed instead?
  bool scaling_was_exact = 6;

  // Internal fields to recover a bound on the original integer objective from
  // the presolved one. Basically, initially the integer objective fit on an
  // int64 and is in [Initial_lb, Initial_ub]. During presolve, we might change
  // the linear expression to have a new domain [Presolved_lb, Presolved_ub]
  // that will also always fit on an int64.
  //
  // The two domain will always be linked with an affine transformation between
  // the two of the form:
  //   old = (new + before_offset) * integer_scaling_factor + after_offset.
  // Note that we use both offsets to always be able to do the computation while
  // staying in the int64 domain. In particular, the after_offset will always
  // be in (-integer_scaling_factor, integer_scaling_factor).
  int64 integer_before_offset = 7;
  int64 integer_after_offset = 9;
  int64 integer_scaling_factor = 8;
}

// A linear floating point objective: sum coeffs[i] * vars[i] + offset.
// Note that the variable can only still take integer value.
message FloatObjectiveProto {
  repeated int32 vars = 1;
  repeated double coeffs = 2;
  double offset = 3;

  // The optimization direction. The default is to minimize
  bool maximize = 4;
}

// Define the strategy to follow when the solver needs to take a new decision.
// Note that this strategy is only defined on a subset of variables.
message DecisionStrategyProto {
  // The variables to be considered for the next decision. The order matter and
  // is always used as a tie-breaker after the variable selection strategy
  // criteria defined below.
  repeated int32 variables = 1;

  // If this is set, then the variables field must be empty.
  // We currently only support affine expression.
  //
  // Note that this is needed so that if a variable has an affine
  // representative, we can properly transform a DecisionStrategyProto through
  // presolve.
  repeated LinearExpressionProto exprs = 5;

  // The order in which the variables (resp. affine expression) above should be
  // considered. Note that only variables that are not already fixed are
  // considered.
  //
  // TODO(user): extend as needed.
  enum VariableSelectionStrategy {
    CHOOSE_FIRST = 0;
    CHOOSE_LOWEST_MIN = 1;
    CHOOSE_HIGHEST_MAX = 2;
    CHOOSE_MIN_DOMAIN_SIZE = 3;
    CHOOSE_MAX_DOMAIN_SIZE = 4;
  }
  VariableSelectionStrategy variable_selection_strategy = 2;

  // Once a variable (resp. affine expression) has been chosen, this enum
  // describe what decision is taken on its domain.
  //
  // TODO(user): extend as needed.
  enum DomainReductionStrategy {
    SELECT_MIN_VALUE = 0;
    SELECT_MAX_VALUE = 1;
    SELECT_LOWER_HALF = 2;
    SELECT_UPPER_HALF = 3;
    SELECT_MEDIAN_VALUE = 4;
    SELECT_RANDOM_HALF = 5;
  }
  DomainReductionStrategy domain_reduction_strategy = 3;
}

// This message encodes a partial (or full) assignment of the variables of a
// CpModelProto. The variable indices should be unique and valid variable
// indices.
message PartialVariableAssignment {
  repeated int32 vars = 1;
  repeated int64 values = 2;
}

// A permutation of integers encoded as a list of cycles, hence the "sparse"
// format. The image of an element cycle[i] is cycle[(i + 1) % cycle_length].
message SparsePermutationProto {
  // Each cycle is listed one after the other in the support field.
  // The size of each cycle is given (in order) in the cycle_sizes field.
  repeated int32 support = 1;
  repeated int32 cycle_sizes = 2;
}

// A dense matrix of numbers encoded in a flat way, row by row.
// That is matrix[i][j] = entries[i * num_cols + j];
message DenseMatrixProto {
  int32 num_rows = 1;
  int32 num_cols = 2;
  repeated int32 entries = 3;
}

// EXPERIMENTAL. For now, this is meant to be used by the solver and not filled
// by clients.
//
// Hold symmetry information about the set of feasible solutions. If we permute
// the variable values of any feasible solution using one of the permutation
// described here, we should always get another feasible solution.
//
// We usually also enforce that the objective of the new solution is the same.
//
// The group of permutations encoded here is usually computed from the encoding
// of the model, so it is not meant to be a complete representation of the
// feasible solution symmetries, just a valid subgroup.
message SymmetryProto {
  // A list of variable indices permutations that leave the feasible space of
  // solution invariant. Usually, we only encode a set of generators of the
  // group.
  repeated SparsePermutationProto permutations = 1;

  // An orbitope is a special symmetry structure of the solution space. If the
  // variable indices are arranged in a matrix (with no duplicates), then any
  // permutation of the columns will be a valid permutation of the feasible
  // space.
  //
  // This arise quite often. The typical example is a graph coloring problem
  // where for each node i, you have j booleans to indicate its color. If the
  // variables color_of_i_is_j are arranged in a matrix[i][j], then any columns
  // permutations leave the problem invariant.
  repeated DenseMatrixProto orbitopes = 2;
}

// A constraint programming problem.
message CpModelProto {
  // For debug/logging only. Can be empty.
  string name = 1;

  // The associated Protos should be referred by their index in these fields.
  repeated IntegerVariableProto variables = 2;
  repeated ConstraintProto constraints = 3;

  // The objective to minimize. Can be empty for pure decision problems.
  CpObjectiveProto objective = 4;

  // Advanced usage.
  // It is invalid to have both an objective and a floating point objective.
  //
  // The objective of the model, in floating point format. The solver will
  // automatically scale this to integer during expansion and thus convert it to
  // a normal CpObjectiveProto. See the mip* parameters to control how this is
  // scaled. In most situation the precision will be good enough, but you can
  // see the logs to see what are the precision guaranteed when this is
  // converted to a fixed point representation.
  //
  // Note that even if the precision is bad, the returned objective_value and
  // best_objective_bound will be computed correctly. So at the end of the solve
  // you can check the gap if you only want precise optimal.
  FloatObjectiveProto floating_point_objective = 9;

  // Defines the strategy that the solver should follow when the
  // search_branching parameter is set to FIXED_SEARCH. Note that this strategy
  // is also used as a heuristic when we are not in fixed search.
  //
  // Advanced Usage: if not all variables appears and the parameter
  // "instantiate_all_variables" is set to false, then the solver will not try
  // to instantiate the variables that do not appear. Thus, at the end of the
  // search, not all variables may be fixed. Currently, we will set them to
  // their lower bound in the solution.
  repeated DecisionStrategyProto search_strategy = 5;

  // Solution hint.
  //
  // If a feasible or almost-feasible solution to the problem is already known,
  // it may be helpful to pass it to the solver so that it can be used. The
  // solver will try to use this information to create its initial feasible
  // solution.
  //
  // Note that it may not always be faster to give a hint like this to the
  // solver. There is also no guarantee that the solver will use this hint or
  // try to return a solution "close" to this assignment in case of multiple
  // optimal solutions.
  PartialVariableAssignment solution_hint = 6;

  // A list of literals. The model will be solved assuming all these literals
  // are true. Compared to just fixing the domain of these literals, using this
  // mechanism is slower but allows in case the model is INFEASIBLE to get a
  // potentially small subset of them that can be used to explain the
  // infeasibility.
  //
  // Think (IIS), except when you are only concerned by the provided
  // assumptions. This is powerful as it allows to group a set of logically
  // related constraint under only one enforcement literal which can potentially
  // give you a good and interpretable explanation for infeasiblity.
  //
  // Such infeasibility explanation will be available in the
  // sufficient_assumptions_for_infeasibility response field.
  repeated int32 assumptions = 7;

  // For now, this is not meant to be filled by a client writing a model, but
  // by our preprocessing step.
  //
  // Information about the symmetries of the feasible solution space.
  // These usually leaves the objective invariant.
  SymmetryProto symmetry = 8;
}

// The status returned by a solver trying to solve a CpModelProto.
enum CpSolverStatus {
  // The status of the model is still unknown. A search limit has been reached
  // before any of the statuses below could be determined.
  UNKNOWN = 0;

  // The given CpModelProto didn't pass the validation step. You can get a
  // detailed error by calling ValidateCpModel(model_proto).
  MODEL_INVALID = 1;

  // A feasible solution has been found. But the search was stopped before we
  // could prove optimality or before we enumerated all solutions of a
  // feasibility problem (if asked).
  FEASIBLE = 2;

  // The problem has been proven infeasible.
  INFEASIBLE = 3;

  // An optimal feasible solution has been found.
  //
  // More generally, this status represent a success. So we also return OPTIMAL
  // if we find a solution for a pure feasibility problem or if a gap limit has
  // been specified and we return a solution within this limit. In the case
  // where we need to return all the feasible solution, this status will only be
  // returned if we enumerated all of them; If we stopped before, we will return
  // FEASIBLE.
  OPTIMAL = 4;
}

// Just a message used to store dense solution.
// This is used by the additional_solutions field.
message CpSolverSolution {
  repeated int64 values = 1;
}

// The response returned by a solver trying to solve a CpModelProto.
//
// Next id: 32
message CpSolverResponse {
  // The status of the solve.
  CpSolverStatus status = 1;

  // A feasible solution to the given problem. Depending on the returned status
  // it may be optimal or just feasible. This is in one-to-one correspondence
  // with a CpModelProto::variables repeated field and list the values of all
  // the variables.
  repeated int64 solution = 2;

  // Only make sense for an optimization problem. The objective value of the
  // returned solution if it is non-empty. If there is no solution, then for a
  // minimization problem, this will be an upper-bound of the objective of any
  // feasible solution, and a lower-bound for a maximization problem.
  double objective_value = 3;

  // Only make sense for an optimization problem. A proven lower-bound on the
  // objective for a minimization problem, or a proven upper-bound for a
  // maximization problem.
  double best_objective_bound = 4;

  // If the parameter fill_additional_solutions_in_response is set, then we
  // copy all the solutions from our internal solution pool here.
  //
  // Note that the one returned in the solution field will likely appear here
  // too. Do not rely on the solutions order as it depends on our internal
  // representation (after postsolve).
  repeated CpSolverSolution additional_solutions = 27;

  // Advanced usage.
  //
  // If the option fill_tightened_domains_in_response is set, then this field
  // will be a copy of the CpModelProto.variables where each domain has been
  // reduced using the information the solver was able to derive. Note that this
  // is only filled with the info derived during a normal search and we do not
  // have any dedicated algorithm to improve it.
  //
  // Warning: if you didn't set keep_all_feasible_solutions_in_presolve, then
  // these domains might exclude valid feasible solution. Otherwise for a
  // feasibility problem, all feasible solution should be there.
  //
  // Warning: For an optimization problem, these will correspond to valid bounds
  // for the problem of finding an improving solution to the best one found so
  // far. It might be better to solve a feasibility version if one just want to
  // explore the feasible region.
  repeated IntegerVariableProto tightened_variables = 21;

  // A subset of the model "assumptions" field. This will only be filled if the
  // status is INFEASIBLE. This subset of assumption will be enough to still get
  // an infeasible problem.
  //
  // This is related to what is called the irreducible inconsistent subsystem or
  // IIS. Except one is only concerned by the provided assumptions. There is
  // also no guarantee that we return an irreducible (aka minimal subset).
  // However, this is based on SAT explanation and there is a good chance it is
  // not too large.
  //
  // If you really want a minimal subset, a possible way to get one is by
  // changing your model to minimize the number of assumptions at false, but
  // this is likely an harder problem to solve.
  //
  // Important: Currently, this is minimized only in single-thread and if the
  // problem is not an optimization problem, otherwise, it will always include
  // all the assumptions.
  //
  // TODO(user): Allows for returning multiple core at once.
  repeated int32 sufficient_assumptions_for_infeasibility = 23;

  // Contains the integer objective optimized internally. This is only filled if
  // the problem had a floating point objective, and on the final response, not
  // the ones given to callbacks.
  CpObjectiveProto integer_objective = 28;

  // Advanced usage.
  //
  // A lower bound on the integer expression of the objective. This is either a
  // bound on the expression in the returned integer_objective or on the integer
  // expression of the original objective if the problem already has an integer
  // objective.
  //
  // TODO(user): This should be renamed integer_objective_lower_bound.
  int64 inner_objective_lower_bound = 29;

  // Some statistics about the solve.
  //
  // Important: in multithread, this correspond the statistics of the first
  // subsolver. Which is usually the one with the user defined parameters. Or
  // the default-search if none are specified.
  int64 num_integers = 30;
  int64 num_booleans = 10;
  int64 num_fixed_booleans = 31;
  int64 num_conflicts = 11;
  int64 num_branches = 12;
  int64 num_binary_propagations = 13;
  int64 num_integer_propagations = 14;
  int64 num_restarts = 24;
  int64 num_lp_iterations = 25;

  // The time counted from the beginning of the Solve() call.
  double wall_time = 15;
  double user_time = 16;
  double deterministic_time = 17;

  // The integral of log(1 + absolute_objective_gap) over time.
  double gap_integral = 22;

  // Additional information about how the solution was found. It also stores
  // model or parameters errors that caused the model to be invalid.
  string solution_info = 20;

  // The solve log will be filled if the parameter log_to_response is set to
  // true.
  string solve_log = 26;
}
`,fr=`// Copyright 2010-2025 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// LINT: LEGACY_NAMES
syntax = "proto2";

package operations_research.sat;

option csharp_namespace = "Google.OrTools.Sat";
option go_package = "github.com/google/or-tools/ortools/sat/proto/satparameters";
option java_package = "com.google.ortools.sat";
option java_multiple_files = true;

// Contains the definitions for all the sat algorithm parameters and their
// default values.
//
// NEXT TAG: 356
message SatParameters {
  // In some context, like in a portfolio of search, it makes sense to name a
  // given parameters set for logging purpose.
  optional string name = 171 [default = ""];

  // ==========================================================================
  // Branching and polarity
  // ==========================================================================

  // Variables without activity (i.e. at the beginning of the search) will be
  // tried in this preferred order.
  enum VariableOrder {
    IN_ORDER = 0;  // As specified by the problem.
    IN_REVERSE_ORDER = 1;
    IN_RANDOM_ORDER = 2;
  }
  optional VariableOrder preferred_variable_order = 1 [default = IN_ORDER];

  // Specifies the initial polarity (true/false) when the solver branches on a
  // variable. This can be modified later by the user, or the phase saving
  // heuristic.
  //
  // Note(user): POLARITY_FALSE is usually a good choice because of the
  // "natural" way to express a linear boolean problem.
  enum Polarity {
    POLARITY_TRUE = 0;
    POLARITY_FALSE = 1;
    POLARITY_RANDOM = 2;
  }
  optional Polarity initial_polarity = 2 [default = POLARITY_FALSE];

  // If this is true, then the polarity of a variable will be the last value it
  // was assigned to, or its default polarity if it was never assigned since the
  // call to ResetDecisionHeuristic().
  //
  // Actually, we use a newer version where we follow the last value in the
  // longest non-conflicting partial assignment in the current phase.
  //
  // This is called 'literal phase saving'. For details see 'A Lightweight
  // Component Caching Scheme for Satisfiability Solvers' K. Pipatsrisawat and
  // A.Darwiche, In 10th International Conference on Theory and Applications of
  // Satisfiability Testing, 2007.
  optional bool use_phase_saving = 44 [default = true];

  // If non-zero, then we change the polarity heuristic after that many number
  // of conflicts in an arithmetically increasing fashion. So x the first time,
  // 2 * x the second time, etc...
  optional int32 polarity_rephase_increment = 168 [default = 1000];

  // If true and we have first solution LS workers, tries in some phase to
  // follow a LS solutions that violates has litle constraints as possible.
  optional bool polarity_exploit_ls_hints = 309 [default = false];

  // The proportion of polarity chosen at random. Note that this take
  // precedence over the phase saving heuristic. This is different from
  // initial_polarity:POLARITY_RANDOM because it will select a new random
  // polarity each time the variable is branched upon instead of selecting one
  // initially and then always taking this choice.
  optional double random_polarity_ratio = 45 [default = 0.0];

  // A number between 0 and 1 that indicates the proportion of branching
  // variables that are selected randomly instead of choosing the first variable
  // from the given variable_ordering strategy.
  optional double random_branches_ratio = 32 [default = 0.0];

  // Whether we use the ERWA (Exponential Recency Weighted Average) heuristic as
  // described in "Learning Rate Based Branching Heuristic for SAT solvers",
  // J.H.Liang, V. Ganesh, P. Poupart, K.Czarnecki, SAT 2016.
  optional bool use_erwa_heuristic = 75 [default = false];

  // The initial value of the variables activity. A non-zero value only make
  // sense when use_erwa_heuristic is true. Experiments with a value of 1e-2
  // together with the ERWA heuristic showed slighthly better result than simply
  // using zero. The idea is that when the "learning rate" of a variable becomes
  // lower than this value, then we prefer to branch on never explored before
  // variables. This is not in the ERWA paper.
  optional double initial_variables_activity = 76 [default = 0.0];

  // When this is true, then the variables that appear in any of the reason of
  // the variables in a conflict have their activity bumped. This is addition to
  // the variables in the conflict, and the one that were used during conflict
  // resolution.
  optional bool also_bump_variables_in_conflict_reasons = 77 [default = false];

  // ==========================================================================
  // Conflict analysis
  // ==========================================================================

  // Do we try to minimize conflicts (greedily) when creating them.
  enum ConflictMinimizationAlgorithm {
    reserved 3;
    NONE = 0;
    SIMPLE = 1;
    RECURSIVE = 2;
  }
  optional ConflictMinimizationAlgorithm minimization_algorithm = 4
      [default = RECURSIVE];

  // Whether to expoit the binary clause to minimize learned clauses further.
  enum BinaryMinizationAlgorithm {
    reserved 2, 3, 4;
    NO_BINARY_MINIMIZATION = 0;
    BINARY_MINIMIZATION_FROM_UIP = 1;
    BINARY_MINIMIZATION_FROM_UIP_AND_DECISIONS = 5;
  }
  optional BinaryMinizationAlgorithm binary_minimization_algorithm = 34
      [default = BINARY_MINIMIZATION_FROM_UIP_AND_DECISIONS];

  // At a really low cost, during the 1-UIP conflict computation, it is easy to
  // detect if some of the involved reasons are subsumed by the current
  // conflict. When this is true, such clauses are detached and later removed
  // from the problem.
  optional bool subsumption_during_conflict_analysis = 56 [default = true];

  // It is possible that "intermediate" clauses during conflict resolution
  // subsumes some of the clauses that propagated. This is quite cheap to detect
  // and result in more subsumption/strengthening of clauses.
  optional bool extra_subsumption_during_conflict_analysis = 351
      [default = true];

  // Try even more subsumption options during conflict analysis.
  optional bool decision_subsumption_during_conflict_analysis = 353
      [default = true];

  // If >=0, each time we have a conflict, we try to subsume the last n learned
  // clause with it.
  optional int32 eagerly_subsume_last_n_conflicts = 343 [default = 4];

  // If we remove clause that we now are "implied" by others. Note that this
  // might not always be good as we might loose some propagation power.
  optional bool subsume_during_vivification = 355 [default = true];

  // If true, try to backtrack as little as possible on conflict and re-imply
  // the clauses later.
  // This means we discard less propagation than traditional backjumping, but
  // requites additional bookkeeping to handle reimplication.
  // See: https://doi.org/10.1007/978-3-319-94144-8_7
  optional bool use_chronological_backtracking = 330 [default = false];

  // If chronological backtracking is enabled, this is the maximum number of
  // levels we will backjump over, otherwise we will backtrack.
  optional int32 max_backjump_levels = 331 [default = 50];

  // If chronological backtracking is enabled, this is the minimum number of
  // conflicts before we will consider backjumping.
  optional int32 chronological_backtrack_min_conflicts = 332 [default = 1000];

  // ==========================================================================
  // Clause database management
  // ==========================================================================

  // Trigger a cleanup when this number of "deletable" clauses is learned.
  optional int32 clause_cleanup_period = 11 [default = 10000];

  // Increase clause_cleanup_period by this amount after each cleanup.
  optional int32 clause_cleanup_period_increment = 337 [default = 0];

  // During a cleanup, we will always keep that number of "deletable" clauses.
  // Note that this doesn't include the "protected" clauses.
  optional int32 clause_cleanup_target = 13 [default = 0];

  // During a cleanup, if clause_cleanup_target is 0, we will delete the
  // clause_cleanup_ratio of "deletable" clauses instead of aiming for a fixed
  // target of clauses to keep.
  optional double clause_cleanup_ratio = 190 [default = 0.5];

  // All the clauses with a LBD (literal blocks distance) lower or equal to this
  // parameters will always be kept.
  //
  // Note that the LBD of a clause that just propagated is 1 + number of
  // different decision levels of its literals. So that the "classic" LBD of a
  // learned conflict is the same as its LBD when we backjump and then propagate
  // it.
  optional int32 clause_cleanup_lbd_bound = 59 [default = 5];

  // All the clause with a LBD lower or equal to this will be kept except if
  // its activity hasn't been bumped in the last 32 cleanup phase. Note that
  // this has no effect if it is <= clause_cleanup_lbd_bound.
  optional int32 clause_cleanup_lbd_tier1 = 349 [default = 0];

  // All the clause with a LBD lower or equal to this will be kept except if its
  // activity hasn't been bumped since the previous cleanup phase. Note that
  // this has no effect if it is <= clause_cleanup_lbd_bound or <=
  // clause_cleanup_lbd_tier1.
  optional int32 clause_cleanup_lbd_tier2 = 350 [default = 0];

  // The clauses that will be kept during a cleanup are the ones that come
  // first under this order. We always keep or exclude ties together.
  enum ClauseOrdering {
    // Order clause by decreasing activity, then by increasing LBD.
    CLAUSE_ACTIVITY = 0;
    // Order clause by increasing LBD, then by decreasing activity.
    CLAUSE_LBD = 1;
  }
  optional ClauseOrdering clause_cleanup_ordering = 60
      [default = CLAUSE_ACTIVITY];

  // Same as for the clauses, but for the learned pseudo-Boolean constraints.
  optional int32 pb_cleanup_increment = 46 [default = 200];
  optional double pb_cleanup_ratio = 47 [default = 0.5];

  // ==========================================================================
  // Variable and clause activities
  // ==========================================================================

  // Each time a conflict is found, the activities of some variables are
  // increased by one. Then, the activity of all variables are multiplied by
  // variable_activity_decay.
  //
  // To implement this efficiently, the activity of all the variables is not
  // decayed at each conflict. Instead, the activity increment is multiplied by
  // 1 / decay. When an activity reach max_variable_activity_value, all the
  // activity are multiplied by 1 / max_variable_activity_value.
  optional double variable_activity_decay = 15 [default = 0.8];
  optional double max_variable_activity_value = 16 [default = 1e100];

  // The activity starts at 0.8 and increment by 0.01 every 5000 conflicts until
  // 0.95. This "hack" seems to work well and comes from:
  //
  // Glucose 2.3 in the SAT 2013 Competition - SAT Competition 2013
  // http://edacc4.informatik.uni-ulm.de/SC13/solver-description-download/136
  optional double glucose_max_decay = 22 [default = 0.95];
  optional double glucose_decay_increment = 23 [default = 0.01];
  optional int32 glucose_decay_increment_period = 24 [default = 5000];

  // Clause activity parameters (same effect as the one on the variables).
  optional double clause_activity_decay = 17 [default = 0.999];
  optional double max_clause_activity_value = 18 [default = 1e20];

  // ==========================================================================
  // Restart
  // ==========================================================================

  // Restart algorithms.
  //
  // A reference for the more advanced ones is:
  // Gilles Audemard, Laurent Simon, "Refining Restarts Strategies for SAT
  // and UNSAT", Principles and Practice of Constraint Programming Lecture
  // Notes in Computer Science 2012, pp 118-126
  enum RestartAlgorithm {
    NO_RESTART = 0;

    // Just follow a Luby sequence times restart_period.
    LUBY_RESTART = 1;

    // Moving average restart based on the decision level of conflicts.
    DL_MOVING_AVERAGE_RESTART = 2;

    // Moving average restart based on the LBD of conflicts.
    LBD_MOVING_AVERAGE_RESTART = 3;

    // Fixed period restart every restart period.
    FIXED_RESTART = 4;
  }

  // The restart strategies will change each time the strategy_counter is
  // increased. The current strategy will simply be the one at index
  // strategy_counter modulo the number of strategy. Note that if this list
  // includes a NO_RESTART, nothing will change when it is reached because the
  // strategy_counter will only increment after a restart.
  //
  // The idea of switching of search strategy tailored for SAT/UNSAT comes from
  // Chanseok Oh with his COMiniSatPS solver, see http://cs.nyu.edu/~chanseok/.
  // But more generally, it seems REALLY beneficial to try different strategy.
  repeated RestartAlgorithm restart_algorithms = 61;
  optional string default_restart_algorithms = 70
      [default =
           "LUBY_RESTART,LBD_MOVING_AVERAGE_RESTART,DL_MOVING_AVERAGE_RESTART"];

  // Restart period for the FIXED_RESTART strategy. This is also the multiplier
  // used by the LUBY_RESTART strategy.
  optional int32 restart_period = 30 [default = 50];

  // Size of the window for the moving average restarts.
  optional int32 restart_running_window_size = 62 [default = 50];

  // In the moving average restart algorithms, a restart is triggered if the
  // window average times this ratio is greater that the global average.
  optional double restart_dl_average_ratio = 63 [default = 1.0];
  optional double restart_lbd_average_ratio = 71 [default = 1.0];

  // Block a moving restart algorithm if the trail size of the current conflict
  // is greater than the multiplier times the moving average of the trail size
  // at the previous conflicts.
  optional bool use_blocking_restart = 64 [default = false];
  optional int32 blocking_restart_window_size = 65 [default = 5000];
  optional double blocking_restart_multiplier = 66 [default = 1.4];

  // After each restart, if the number of conflict since the last strategy
  // change is greater that this, then we increment a "strategy_counter" that
  // can be use to change the search strategy used by the following restarts.
  optional int32 num_conflicts_before_strategy_changes = 68 [default = 0];

  // The parameter num_conflicts_before_strategy_changes is increased by that
  // much after each strategy change.
  optional double strategy_change_increase_ratio = 69 [default = 0.0];

  // ==========================================================================
  // Limits
  // ==========================================================================

  // Maximum time allowed in seconds to solve a problem.
  // The counter will starts at the beginning of the Solve() call.
  optional double max_time_in_seconds = 36 [default = inf];

  // Maximum time allowed in deterministic time to solve a problem.
  // The deterministic time should be correlated with the real time used by the
  // solver, the time unit being as close as possible to a second.
  optional double max_deterministic_time = 67 [default = inf];

  // Stops after that number of batches has been scheduled. This only make sense
  // when interleave_search is true.
  optional int32 max_num_deterministic_batches = 291 [default = 0];

  // Maximum number of conflicts allowed to solve a problem.
  //
  // TODO(user): Maybe change the way the conflict limit is enforced?
  // currently it is enforced on each independent internal SAT solve, rather
  // than on the overall number of conflicts across all solves. So in the
  // context of an optimization problem, this is not really usable directly by a
  // client.
  optional int64 max_number_of_conflicts = 37
      [default = 0x7FFFFFFFFFFFFFFF];  // kint64max

  // Maximum memory allowed for the whole thread containing the solver. The
  // solver will abort as soon as it detects that this limit is crossed. As a
  // result, this limit is approximative, but usually the solver will not go too
  // much over.
  //
  // TODO(user): This is only used by the pure SAT solver, generalize to CP-SAT.
  optional int64 max_memory_in_mb = 40 [default = 10000];

  // Stop the search when the gap between the best feasible objective (O) and
  // our best objective bound (B) is smaller than a limit.
  // The exact definition is:
  // - Absolute: abs(O - B)
  // - Relative: abs(O - B) / max(1, abs(O)).
  //
  // Important: The relative gap depends on the objective offset! If you
  // artificially shift the objective, you will get widely different value of
  // the relative gap.
  //
  // Note that if the gap is reached, the search status will be OPTIMAL. But
  // one can check the best objective bound to see the actual gap.
  //
  // If the objective is integer, then any absolute gap < 1 will lead to a true
  // optimal. If the objective is floating point, a gap of zero make little
  // sense so is is why we use a non-zero default value. At the end of the
  // search, we will display a warning if OPTIMAL is reported yet the gap is
  // greater than this absolute gap.
  optional double absolute_gap_limit = 159 [default = 1e-4];
  optional double relative_gap_limit = 160 [default = 0.0];

  // ==========================================================================
  // Other parameters
  // ==========================================================================

  // At the beginning of each solve, the random number generator used in some
  // part of the solver is reinitialized to this seed. If you change the random
  // seed, the solver may make different choices during the solving process.
  //
  // For some problems, the running time may vary a lot depending on small
  // change in the solving algorithm. Running the solver with different seeds
  // enables to have more robust benchmarks when evaluating new features.
  optional int32 random_seed = 31 [default = 1];

  // This is mainly here to test the solver variability. Note that in tests, if
  // not explicitly set to false, all 3 options will be set to true so that
  // clients do not rely on the solver returning a specific solution if they are
  // many equivalent optimal solutions.
  optional bool permute_variable_randomly = 178 [default = false];
  optional bool permute_presolve_constraint_order = 179 [default = false];
  optional bool use_absl_random = 180 [default = false];

  // Whether the solver should log the search progress. This is the maing
  // logging parameter and if this is false, none of the logging (callbacks,
  // log_to_stdout, log_to_response, ...) will do anything.
  optional bool log_search_progress = 41 [default = false];

  // Whether the solver should display per sub-solver search statistics.
  // This is only useful is log_search_progress is set to true, and if the
  // number of search workers is > 1. Note that in all case we display a bit
  // of stats with one line per subsolver.
  optional bool log_subsolver_statistics = 189 [default = false];

  // Add a prefix to all logs.
  optional string log_prefix = 185 [default = ""];

  // Log to stdout.
  optional bool log_to_stdout = 186 [default = true];

  // Log to response proto.
  optional bool log_to_response = 187 [default = false];

  // Experimental.
  //
  // This is an old experiment, it might cause crashes in multi-thread and you
  // should double check the solver result. It can still be used if you only
  // care about feasible solutions (these are checked) and it gives good result
  // on your problem. We might revive it at some point.
  //
  // Whether to use pseudo-Boolean resolution to analyze a conflict. Note that
  // this option only make sense if your problem is modelized using
  // pseudo-Boolean constraints. If you only have clauses, this shouldn't change
  // anything (except slow the solver down).
  optional bool use_pb_resolution = 43 [default = false];

  // A different algorithm during PB resolution. It minimizes the number of
  // calls to ReduceCoefficients() which can be time consuming. However, the
  // search space will be different and if the coefficients are large, this may
  // lead to integer overflows that could otherwise be prevented.
  optional bool minimize_reduction_during_pb_resolution = 48 [default = false];

  // Whether or not the assumption levels are taken into account during the LBD
  // computation. According to the reference below, not counting them improves
  // the solver in some situation. Note that this only impact solves under
  // assumptions.
  //
  // Gilles Audemard, Jean-Marie Lagniez, Laurent Simon, "Improving Glucose for
  // Incremental SAT Solving with Assumptions: Application to MUS Extraction"
  // Theory and Applications of Satisfiability Testing - SAT 2013, Lecture Notes
  // in Computer Science Volume 7962, 2013, pp 309-317.
  optional bool count_assumption_levels_in_lbd = 49 [default = true];

  // ==========================================================================
  // Presolve
  // ==========================================================================

  // During presolve, only try to perform the bounded variable elimination (BVE)
  // of a variable x if the number of occurrences of x times the number of
  // occurrences of not(x) is not greater than this parameter.
  optional int32 presolve_bve_threshold = 54 [default = 500];

  // Internal parameter. During BVE, if we eliminate a variable x, by default we
  // will push all clauses containing x and all clauses containing not(x) to the
  // postsolve. However, it is possible to write the postsolve code so that only
  // one such set is needed. The idea is that, if we push the set containing a
  // literal l, is to set l to false except if it is needed to satisfy one of
  // the clause in the set. This is always beneficial, but for historical
  // reason, not all our postsolve algorithm support this.
  optional bool filter_sat_postsolve_clauses = 324 [default = false];

  // During presolve, we apply BVE only if this weight times the number of
  // clauses plus the number of clause literals is not increased.
  optional int32 presolve_bve_clause_weight = 55 [default = 3];

  // The maximum "deterministic" time limit to spend in probing. A value of
  // zero will disable the probing.
  //
  // TODO(user): Clean up. The first one is used in CP-SAT, the other in pure
  // SAT presolve.
  optional double probing_deterministic_time_limit = 226 [default = 1.0];
  optional double presolve_probing_deterministic_time_limit = 57
      [default = 30.0];

  // Whether we use an heuristic to detect some basic case of blocked clause
  // in the SAT presolve.
  optional bool presolve_blocked_clause = 88 [default = true];

  // Whether or not we use Bounded Variable Addition (BVA) in the presolve.
  optional bool presolve_use_bva = 72 [default = true];

  // Apply Bounded Variable Addition (BVA) if the number of clauses is reduced
  // by stricly more than this threshold. The algorithm described in the paper
  // uses 0, but quick experiments showed that 1 is a good value. It may not be
  // worth it to add a new variable just to remove one clause.
  optional int32 presolve_bva_threshold = 73 [default = 1];

  // In case of large reduction in a presolve iteration, we perform multiple
  // presolve iterations. This parameter controls the maximum number of such
  // presolve iterations.
  optional int32 max_presolve_iterations = 138 [default = 3];

  // Whether we presolve the cp_model before solving it.
  optional bool cp_model_presolve = 86 [default = true];

  // How much effort do we spend on probing. 0 disables it completely.
  optional int32 cp_model_probing_level = 110 [default = 2];

  // Whether we also use the sat presolve when cp_model_presolve is true.
  optional bool cp_model_use_sat_presolve = 93 [default = true];

  // If we try to load at most ones and exactly ones constraints when running
  // the pure SAT presolve. Or if we just ignore them.
  //
  // If one detects at_most_one via merge_at_most_one_work_limit or exactly one
  // with find_clauses_that_are_exactly_one, it might be good to also set this
  // to true.
  optional bool load_at_most_ones_in_sat_presolve = 335 [default = false];

  // If cp_model_presolve is true and there is a large proportion of fixed
  // variable after the first model copy, remap all the model to a dense set of
  // variable before the full presolve even starts. This should help for LNS on
  // large models.
  optional bool remove_fixed_variables_early = 310 [default = true];

  // If true, we detect variable that are unique to a table constraint and only
  // there to encode a cost on each tuple. This is usually the case when a WCSP
  // (weighted constraint program) is encoded into CP-SAT format.
  //
  // This can lead to a dramatic speed-up for such problems but is still
  // experimental at this point.
  optional bool detect_table_with_cost = 216 [default = false];

  // How much we try to "compress" a table constraint. Compressing more leads to
  // less Booleans and faster propagation but can reduced the quality of the lp
  // relaxation. Values goes from 0 to 3 where we always try to fully compress a
  // table. At 2, we try to automatically decide if it is worth it.
  optional int32 table_compression_level = 217 [default = 2];

  // If true, expand all_different constraints that are not permutations.
  // Permutations (#Variables = #Values) are always expanded.
  optional bool expand_alldiff_constraints = 170 [default = false];

  // Max domain size for all_different constraints to be expanded.
  optional int32 max_alldiff_domain_size = 320 [default = 256];

  // If true, expand the reservoir constraints by creating booleans for all
  // possible precedences between event and encoding the constraint.
  optional bool expand_reservoir_constraints = 182 [default = true];

  // Max domain size for expanding linear2 constraints (ax + by ==/!= c).
  optional int32 max_domain_size_for_linear2_expansion = 340 [default = 8];

  // Mainly useful for testing.
  //
  // If this and expand_reservoir_constraints is true, we use a different
  // encoding of the reservoir constraint using circuit instead of precedences.
  // Note that this is usually slower, but can exercise different part of the
  // solver. Note that contrary to the precedence encoding, this easily support
  // variable demands.
  //
  // WARNING: with this encoding, the constraint takes a slightly different
  // meaning. There must exist a permutation of the events occurring at the same
  // time such that the level is within the reservoir after each of these events
  // (in this permuted order). So we cannot have +100 and -100 at the same time
  // if the level must be between 0 and 10 (as authorized by the reservoir
  // constraint).
  optional bool expand_reservoir_using_circuit = 288 [default = false];

  // Encore cumulative with fixed demands and capacity as a reservoir
  // constraint. The only reason you might want to do that is to test the
  // reservoir propagation code!
  optional bool encode_cumulative_as_reservoir = 287 [default = false];

  // If the number of expressions in the lin_max is less that the max size
  // parameter, model expansion replaces target = max(xi) by linear constraint
  // with the introduction of new booleans bi such that bi => target == xi.
  //
  // This is mainly for experimenting compared to a custom lin_max propagator.
  optional int32 max_lin_max_size_for_expansion = 280 [default = 0];

  // If true, it disable all constraint expansion.
  // This should only be used to test the presolve of expanded constraints.
  optional bool disable_constraint_expansion = 181 [default = false];

  // Linear constraint with a complex right hand side (more than a single
  // interval) need to be expanded, there is a couple of way to do that.
  optional bool encode_complex_linear_constraint_with_integer = 223
      [default = false];

  // During presolve, we use a maximum clique heuristic to merge together
  // no-overlap constraints or at most one constraints. This code can be slow,
  // so we have a limit in place on the number of explored nodes in the
  // underlying graph. The internal limit is an int64, but we use double here to
  // simplify manual input.
  optional double merge_no_overlap_work_limit = 145 [default = 1e12];
  optional double merge_at_most_one_work_limit = 146 [default = 1e8];

  // How much substitution (also called free variable aggregation in MIP
  // litterature) should we perform at presolve. This currently only concerns
  // variable appearing only in linear constraints. For now the value 0 turns it
  // off and any positive value performs substitution.
  optional int32 presolve_substitution_level = 147 [default = 1];

  // If true, we will extract from linear constraints, enforcement literals of
  // the form "integer variable at bound => simplified constraint". This should
  // always be beneficial except that we don't always handle them as efficiently
  // as we could for now. This causes problem on manna81.mps (LP relaxation not
  // as tight it seems) and on neos-3354841-apure.mps.gz (too many literals
  // created this way).
  optional bool presolve_extract_integer_enforcement = 174 [default = false];

  // A few presolve operations involve detecting constraints included in other
  // constraint. Since there can be a quadratic number of such pairs, and
  // processing them usually involve scanning them, the complexity of these
  // operations can be big. This enforce a local deterministic limit on the
  // number of entries scanned. Default is 1e8.
  //
  // A value of zero will disable these presolve rules completely.
  optional int64 presolve_inclusion_work_limit = 201 [default = 100000000];

  // If true, we don't keep names in our internal copy of the user given model.
  optional bool ignore_names = 202 [default = true];

  // Run a max-clique code amongst all the x != y we can find and try to infer
  // set of variables that are all different. This allows to close neos16.mps
  // for instance. Note that we only run this code if there is no all_diff
  // already in the model so that if a user want to add some all_diff, we assume
  // it is well done and do not try to add more.
  //
  // This will also detect and add no_overlap constraints, if all the relations
  // x != y have "offsets" between them. I.e. x > y + offset.
  optional bool infer_all_diffs = 233 [default = true];

  // Try to find large "rectangle" in the linear constraint matrix with
  // identical lines. If such rectangle is big enough, we can introduce a new
  // integer variable corresponding to the common expression and greatly reduce
  // the number of non-zero.
  optional bool find_big_linear_overlap = 234 [default = true];

  // By propagating (or just using binary clauses), one can detect that all
  // literal of a clause are actually in at most one relationship. Thus this
  // constraint can be promoted to an exactly one constraints. This should help
  // as it convey more structure. Note that this is expensive, so we have a
  // deterministic limit in place.
  optional bool find_clauses_that_are_exactly_one = 333 [default = true];

  // ==========================================================================
  // Inprocessing
  // ==========================================================================

  // Enable or disable "inprocessing" which is some SAT presolving done at
  // each restart to the root level.
  optional bool use_sat_inprocessing = 163 [default = true];

  // Proportion of deterministic time we should spend on inprocessing.
  // At each "restart", if the proportion is below this ratio, we will do some
  // inprocessing, otherwise, we skip it for this restart.
  optional double inprocessing_dtime_ratio = 273 [default = 0.2];

  // The amount of dtime we should spend on probing for each inprocessing round.
  optional double inprocessing_probing_dtime = 274 [default = 1.0];

  // Parameters for an heuristic similar to the one described in "An effective
  // learnt clause minimization approach for CDCL Sat Solvers",
  // https://www.ijcai.org/proceedings/2017/0098.pdf
  //
  // This is the amount of dtime we should spend on this technique during each
  // inprocessing phase.
  //
  // The minimization technique is the same as the one used to minimize core in
  // max-sat. We also minimize problem clauses and not just the learned clause
  // that we keep forever like in the paper.
  optional double inprocessing_minimization_dtime = 275 [default = 1.0];
  optional bool inprocessing_minimization_use_conflict_analysis = 297
      [default = true];
  optional bool inprocessing_minimization_use_all_orderings = 298
      [default = false];

  // Whether we use the algorithm described in "Clausal Congruence closure",
  // Armin Biere, Katalin Fazekas, Mathias Fleury, Nils Froleyks, 2024.
  //
  // Note that we only have a basic version currently.
  optional bool inprocessing_use_congruence_closure = 342 [default = true];

  // Whether we use the SAT sweeping algorithm described in "Clausal Equivalence
  // Sweeping", Armin Biere, Katalin Fazekas, Mathias Fleury, Nils Froleyks,
  // 2025.
  optional bool inprocessing_use_sat_sweeping = 354 [default = false];

  // ==========================================================================
  // Multithread
  // ==========================================================================

  // Specify the number of parallel workers (i.e. threads) to use during search.
  // This should usually be lower than your number of available cpus +
  // hyperthread in your machine.
  //
  // A value of 0 means the solver will try to use all cores on the machine.
  // A number of 1 means no parallelism.
  //
  // Note that 'num_workers' is the preferred name, but if it is set to zero,
  // we will still read the deprecated 'num_search_workers'.
  //
  // As of 2020-04-10, if you're using SAT via MPSolver (to solve integer
  // programs) this field is overridden with a value of 8, if the field is not
  // set *explicitly*. Thus, always set this field explicitly or via
  // MPSolver::SetNumThreads().
  optional int32 num_workers = 206 [default = 0];
  optional int32 num_search_workers = 100 [default = 0];

  // We distinguish subsolvers that consume a full thread, and the ones that are
  // always interleaved. If left at zero, we will fix this with a default
  // formula that depends on num_workers. But if you start modifying what runs,
  // you might want to fix that to a given value depending on the num_workers
  // you use.
  optional int32 num_full_subsolvers = 294 [default = 0];

  // In multi-thread, the solver can be mainly seen as a portfolio of solvers
  // with different parameters. This field indicates the names of the parameters
  // that are used in multithread. This only applies to "full" subsolvers.
  //
  // See cp_model_search.cc to see a list of the names and the default value (if
  // left empty) that looks like:
  // - default_lp           (linearization_level:1)
  // - fixed                (only if fixed search specified or scheduling)
  // - no_lp                (linearization_level:0)
  // - max_lp               (linearization_level:2)
  // - pseudo_costs         (only if objective, change search heuristic)
  // - reduced_costs        (only if objective, change search heuristic)
  // - quick_restart        (kind of probing)
  // - quick_restart_no_lp  (kind of probing with linearization_level:0)
  // - lb_tree_search       (to improve lower bound, MIP like tree search)
  // - probing              (continuous probing and shaving)
  //
  // Also, note that some set of parameters will be ignored if they do not make
  // sense. For instance if there is no objective, pseudo_cost or reduced_cost
  // search will be ignored. Core based search will only work if the objective
  // has many terms. If there is no fixed strategy fixed will be ignored. And so
  // on.
  //
  // The order is important, as only the first num_full_subsolvers will be
  // scheduled. You can see in the log which one are selected for a given run.
  repeated string subsolvers = 207;

  // A convenient way to add more workers types.
  // These will be added at the beginning of the list.
  repeated string extra_subsolvers = 219;

  // Rather than fully specifying subsolvers, it is often convenient to just
  // remove the ones that are not useful on a given problem or only keep
  // specific ones for testing. Each string is interpreted as a "glob", so we
  // support '*' and '?'.
  //
  // The way this work is that we will only accept a name that match a filter
  // pattern (if non-empty) and do not match an ignore pattern. Note also that
  // these fields work on LNS or LS names even if these are currently not
  // specified via the subsolvers field.
  repeated string ignore_subsolvers = 209;
  repeated string filter_subsolvers = 293;

  // It is possible to specify additional subsolver configuration. These can be
  // referred by their params.name() in the fields above. Note that only the
  // specified field will "overwrite" the ones of the base parameter. If a
  // subsolver_params has the name of an existing subsolver configuration, the
  // named parameters will be merged into the subsolver configuration.
  repeated SatParameters subsolver_params = 210;

  // Experimental. If this is true, then we interleave all our major search
  // strategy and distribute the work amongst num_workers.
  //
  // The search is deterministic (independently of num_workers!), and we
  // schedule and wait for interleave_batch_size task to be completed before
  // synchronizing and scheduling the next batch of tasks.
  optional bool interleave_search = 136 [default = false];
  optional int32 interleave_batch_size = 134 [default = 0];

  // Allows objective sharing between workers.
  optional bool share_objective_bounds = 113 [default = true];

  // Allows sharing of the bounds of modified variables at level 0.
  optional bool share_level_zero_bounds = 114 [default = true];

  // Allows sharing of the bounds on linear2 discovered at level 0. This is
  // mainly interesting on scheduling type of problems when we branch on
  // precedences.
  //
  // Warning: This currently non-deterministic.
  optional bool share_linear2_bounds = 326 [default = false];

  // Allows sharing of new learned binary clause between workers.
  optional bool share_binary_clauses = 203 [default = true];

  // Allows sharing of short glue clauses between workers.
  // Implicitly disabled if share_binary_clauses is false.
  optional bool share_glue_clauses = 285 [default = true];

  // Minimize and detect subsumption of shared clauses immediately after they
  // are imported.
  optional bool minimize_shared_clauses = 300 [default = true];

  // The amount of dtime between each export of shared glue clauses.
  optional double share_glue_clauses_dtime = 322 [default = 1.0];

  // ==========================================================================
  // Proofs
  // ==========================================================================

  // If true, inferred clauses are checked with an LRAT checker as they are
  // learned, in presolve (reduced to trivial simplifications if
  // cp_model_presolve is false), and in each worker. As of December 2025, this
  // only works with pure SAT problems, with
  //  - cp_model_presolve = false,
  //  - linearization_level <= 1,
  //  - symmetry_level <= 1.
  optional bool check_lrat_proof = 344 [default = false];

  // If true, and if output_lrat_proof is true and the problem is UNSAT, check
  // that the merged proof file is valid, i.e., that clause sharing between
  // workers is correct. This checks each inferred clause, so you might want to
  // disable check_lrat_proof to avoid redundant work. As of November 2025, this
  // only works for pure SAT problems, with num_workers = 1.
  optional bool check_merged_lrat_proof = 352 [default = false];

  // If true, an LRAT proof that all the clauses inferred by the solver are
  // valid is output to several files (one for presolve -- reduced to trivial
  // simplifications if cp_model_presolve is false, one per worker, and one for
  // the merged proof). As of December 2025, this only works for pure SAT
  // problems, with
  //  - cp_model_presolve = false,
  //  - linearization_level <= 1,
  //  - symmetry_level <= 1.
  optional bool output_lrat_proof = 345 [default = false];

  // If true, and if the problem is UNSAT, a DRAT proof of this UNSAT property
  // is checked after the solver has finished. As of November 2025, this only
  // works for pure SAT problems, with
  //  - num_workers = 1,
  //  - cp_model_presolve = false,
  //  - linearization_level <= 1,
  //  - symmetry_level <= 1.
  optional bool check_drat_proof = 346 [default = false];

  // If true, a DRAT proof that all the clauses inferred by the solver are valid
  // is output to a file. As of December 2025, this only works for pure SAT
  // problems, with
  //  - num_workers = 1,
  //  - cp_model_presolve = false,
  //  - linearization_level <= 1,
  //  - symmetry_level <= 1.
  optional bool output_drat_proof = 347 [default = false];

  // The maximum time allowed to check the DRAT proof (this can take more time
  // than the solve itself). Only used if check_drat_proof is true.
  optional double max_drat_time_in_seconds = 348 [default = inf];

  // ==========================================================================
  // Debugging parameters
  // ==========================================================================

  // We have two different postsolve code. The default one should be better and
  // it allows for a more powerful presolve, but it can be useful to postsolve
  // using the full solver instead.
  optional bool debug_postsolve_with_full_solver = 162 [default = false];

  // If positive, try to stop just after that many presolve rules have been
  // applied. This is mainly useful for debugging presolve.
  optional int32 debug_max_num_presolve_operations = 151 [default = 0];

  // Crash if we do not manage to complete the hint into a full solution.
  optional bool debug_crash_on_bad_hint = 195 [default = false];

  // Crash if presolve breaks a feasible hint.
  optional bool debug_crash_if_presolve_breaks_hint = 306 [default = false];

  // Crash if the LRAT UNSAT proof is invalid.
  optional bool debug_crash_if_lrat_check_fails = 339 [default = false];

  // ==========================================================================
  // Max-sat parameters
  // ==========================================================================

  // For an optimization problem, whether we follow some hints in order to find
  // a better first solution. For a variable with hint, the solver will always
  // try to follow the hint. It will revert to the variable_branching default
  // otherwise.
  optional bool use_optimization_hints = 35 [default = true];

  // If positive, we spend some effort on each core:
  // - At level 1, we use a simple heuristic to try to minimize an UNSAT core.
  // - At level 2, we use propagation to minimize the core but also identify
  //   literal in at most one relationship in this core.
  optional int32 core_minimization_level = 50 [default = 2];

  // Whether we try to find more independent cores for a given set of
  // assumptions in the core based max-SAT algorithms.
  optional bool find_multiple_cores = 84 [default = true];

  // If true, when the max-sat algo find a core, we compute the minimal number
  // of literals in the core that needs to be true to have a feasible solution.
  // This is also called core exhaustion in more recent max-SAT papers.
  optional bool cover_optimization = 89 [default = true];

  // In what order do we add the assumptions in a core-based max-sat algorithm
  enum MaxSatAssumptionOrder {
    DEFAULT_ASSUMPTION_ORDER = 0;
    ORDER_ASSUMPTION_BY_DEPTH = 1;
    ORDER_ASSUMPTION_BY_WEIGHT = 2;
  }
  optional MaxSatAssumptionOrder max_sat_assumption_order = 51
      [default = DEFAULT_ASSUMPTION_ORDER];

  // If true, adds the assumption in the reverse order of the one defined by
  // max_sat_assumption_order.
  optional bool max_sat_reverse_assumption_order = 52 [default = false];

  // What stratification algorithm we use in the presence of weight.
  enum MaxSatStratificationAlgorithm {
    // No stratification of the problem.
    STRATIFICATION_NONE = 0;

    // Start with literals with the highest weight, and when SAT, add the
    // literals with the next highest weight and so on.
    STRATIFICATION_DESCENT = 1;

    // Start with all literals. Each time a core is found with a given minimum
    // weight, do not consider literals with a lower weight for the next core
    // computation. If the subproblem is SAT, do like in STRATIFICATION_DESCENT
    // and just add the literals with the next highest weight.
    STRATIFICATION_ASCENT = 2;
  }
  optional MaxSatStratificationAlgorithm max_sat_stratification = 53
      [default = STRATIFICATION_DESCENT];

  // ==========================================================================
  // Constraint programming parameters
  // ==========================================================================

  // Some search decisions might cause a really large number of propagations to
  // happen when integer variables with large domains are only reduced by 1 at
  // each step. If we propagate more than the number of variable times this
  // parameters we try to take counter-measure. Setting this to 0.0 disable this
  // feature.
  //
  // TODO(user): Setting this to something like 10 helps in most cases, but the
  // code is currently buggy and can cause the solve to enter a bad state where
  // no progress is made.
  optional double propagation_loop_detection_factor = 221 [default = 10.0];

  // When this is true, then a disjunctive constraint will try to use the
  // precedence relations between time intervals to propagate their bounds
  // further. For instance if task A and B are both before C and task A and B
  // are in disjunction, then we can deduce that task C must start after
  // duration(A) + duration(B) instead of simply max(duration(A), duration(B)),
  // provided that the start time for all task was currently zero.
  //
  // This always result in better propagation, but it is usually slow, so
  // depending on the problem, turning this off may lead to a faster solution.
  optional bool use_precedences_in_disjunctive_constraint = 74 [default = true];

  // At root level, we might compute the transitive closure of "precedences"
  // relations so that we can exploit that in scheduling problems. Setting this
  // to zero disable the feature.
  optional int32 transitive_precedences_work_limit = 327 [default = 1000000];

  // Create one literal for each disjunction of two pairs of tasks. This slows
  // down the solve time, but improves the lower bound of the objective in the
  // makespan case. This will be triggered if the number of intervals is less or
  // equal than the parameter and if use_strong_propagation_in_disjunctive is
  // true.
  optional int32 max_size_to_create_precedence_literals_in_disjunctive = 229
      [default = 60];

  // Enable stronger and more expensive propagation on no_overlap constraint.
  optional bool use_strong_propagation_in_disjunctive = 230 [default = false];

  // Whether we try to branch on decision "interval A before interval B" rather
  // than on intervals bounds. This usually works better, but slow down a bit
  // the time to find the first solution.
  //
  // These parameters are still EXPERIMENTAL, the result should be correct, but
  // it some corner cases, they can cause some failing CHECK in the solver.
  optional bool use_dynamic_precedence_in_disjunctive = 263 [default = false];
  optional bool use_dynamic_precedence_in_cumulative = 268 [default = false];

  // When this is true, the cumulative constraint is reinforced with overload
  // checking, i.e., an additional level of reasoning based on energy. This
  // additional level supplements the default level of reasoning as well as
  // timetable edge finding.
  //
  // This always result in better propagation, but it is usually slow, so
  // depending on the problem, turning this off may lead to a faster solution.
  optional bool use_overload_checker_in_cumulative = 78 [default = false];

  // Enable a heuristic to solve cumulative constraints using a modified energy
  // constraint. We modify the usual energy definition by applying a
  // super-additive function (also called "conservative scale" or "dual-feasible
  // function") to the demand and the durations of the tasks.
  //
  // This heuristic is fast but for most problems it does not help much to find
  // a solution.
  optional bool use_conservative_scale_overload_checker = 286 [default = false];

  // When this is true, the cumulative constraint is reinforced with timetable
  // edge finding, i.e., an additional level of reasoning based on the
  // conjunction of energy and mandatory parts. This additional level
  // supplements the default level of reasoning as well as overload_checker.
  //
  // This always result in better propagation, but it is usually slow, so
  // depending on the problem, turning this off may lead to a faster solution.
  optional bool use_timetable_edge_finding_in_cumulative = 79 [default = false];

  // Max number of intervals for the timetable_edge_finding algorithm to
  // propagate. A value of 0 disables the constraint.
  optional int32 max_num_intervals_for_timetable_edge_finding = 260
      [default = 100];

  // If true, detect and create constraint for integer variable that are "after"
  // a set of intervals in the same cumulative constraint.
  //
  // Experimental: by default we just use "direct" precedences. If
  // exploit_all_precedences is true, we explore the full precedence graph. This
  // assumes we have a DAG otherwise it fails.
  optional bool use_hard_precedences_in_cumulative = 215 [default = false];
  optional bool exploit_all_precedences = 220 [default = false];

  // When this is true, the cumulative constraint is reinforced with propagators
  // from the disjunctive constraint to improve the inference on a set of tasks
  // that are disjunctive at the root of the problem. This additional level
  // supplements the default level of reasoning.
  //
  // Propagators of the cumulative constraint will not be used at all if all the
  // tasks are disjunctive at root node.
  //
  // This always result in better propagation, but it is usually slow, so
  // depending on the problem, turning this off may lead to a faster solution.
  optional bool use_disjunctive_constraint_in_cumulative = 80 [default = true];

  // If less than this number of boxes are present in a no-overlap 2d, we
  // create 4 Booleans per pair of boxes:
  // - Box 2 is after Box 1 on x.
  // - Box 1 is after Box 2 on x.
  // - Box 2 is after Box 1 on y.
  // - Box 1 is after Box 2 on y.
  //
  // Note that at least one of them must be true, and at most one on x and one
  // on y can be true.
  //
  // This can significantly help in closing small problem. The SAT reasoning
  // can be a lot more powerful when we take decision on such positional
  // relations.
  optional int32 no_overlap_2d_boolean_relations_limit = 321 [default = 10];

  // When this is true, the no_overlap_2d constraint is reinforced with
  // propagators from the cumulative constraints. It consists of ignoring the
  // position of rectangles in one position and projecting the no_overlap_2d on
  // the other dimension to create a cumulative constraint. This is done on both
  // axis. This additional level supplements the default level of reasoning.
  optional bool use_timetabling_in_no_overlap_2d = 200 [default = false];

  // When this is true, the no_overlap_2d constraint is reinforced with
  // energetic reasoning. This additional level supplements the default level of
  // reasoning.
  optional bool use_energetic_reasoning_in_no_overlap_2d = 213
      [default = false];

  // When this is true, the no_overlap_2d constraint is reinforced with
  // an energetic reasoning that uses an area-based energy. This can be combined
  // with the two other overlap heuristics above.
  optional bool use_area_energetic_reasoning_in_no_overlap_2d = 271
      [default = false];

  optional bool use_try_edge_reasoning_in_no_overlap_2d = 299 [default = false];

  // If the number of pairs to look is below this threshold, do an extra step of
  // propagation in the no_overlap_2d constraint by looking at all pairs of
  // intervals.
  optional int32 max_pairs_pairwise_reasoning_in_no_overlap_2d = 276
      [default = 1250];

  // Detects when the space where items of a no_overlap_2d constraint can placed
  // is disjoint (ie., fixed boxes split the domain). When it is the case, we
  // can introduce a boolean for each pair <item, component> encoding whether
  // the item is in the component or not. Then we replace the original
  // no_overlap_2d constraint by one no_overlap_2d constraint for each
  // component, with the new booleans as the enforcement_literal of the
  // intervals. This is equivalent to expanding the original no_overlap_2d
  // constraint into a bin packing problem with each connected component being a
  // bin. This heuristic is only done when the number of regions to split
  // is less than this parameter and <= 1 disables it.
  optional int32 maximum_regions_to_split_in_disconnected_no_overlap_2d = 315
      [default = 0];

  // When set, this activates a propagator for the no_overlap_2d constraint that
  // uses any eventual linear constraints of the model in the form
  // \`{start interval 1} - {end interval 2} + c*w <= ub\` to detect that two
  // intervals must overlap in one dimension for some values of \`w\`. This is
  // particularly useful for problems where the distance between two boxes is
  // part of the model.
  optional bool use_linear3_for_no_overlap_2d_precedences = 323
      [default = true];

  // When set, it activates a few scheduling parameters to improve the lower
  // bound of scheduling problems. This is only effective with multiple workers
  // as it modifies the reduced_cost, lb_tree_search, and probing workers.
  optional bool use_dual_scheduling_heuristics = 214 [default = true];

  // Turn on extra propagation for the circuit constraint.
  // This can be quite slow.
  optional bool use_all_different_for_circuit = 311 [default = false];

  // If the size of a subset of nodes of a RoutesConstraint is less than this
  // value, use linear constraints of size 1 and 2 (such as capacity and time
  // window constraints) enforced by the arc literals to compute cuts for this
  // subset (unless the subset size is less than
  // routing_cut_subset_size_for_tight_binary_relation_bound, in which case the
  // corresponding algorithm is used instead). The algorithm for these cuts has
  // a O(n^3) complexity, where n is the subset size. Hence the value of this
  // parameter should not be too large (e.g. 10 or 20).
  optional int32 routing_cut_subset_size_for_binary_relation_bound = 312
      [default = 0];

  // Similar to above, but with a different algorithm producing better cuts, at
  // the price of a higher O(2^n) complexity, where n is the subset size. Hence
  // the value of this parameter should be small (e.g. less than 10).
  optional int32 routing_cut_subset_size_for_tight_binary_relation_bound = 313
      [default = 0];

  // Similar to above, but with an even stronger algorithm in O(n!). We try to
  // be defensive and abort early or not run that often. Still the value of
  // that parameter shouldn't really be much more than 10.
  optional int32 routing_cut_subset_size_for_exact_binary_relation_bound = 316
      [default = 8];

  // Similar to routing_cut_subset_size_for_exact_binary_relation_bound but
  // use a bound based on shortest path distances (which respect triangular
  // inequality). This allows to derive bounds that are valid for any superset
  // of a given subset. This is slow, so it shouldn't really be larger than 10.
  optional int32 routing_cut_subset_size_for_shortest_paths_bound = 318
      [default = 8];

  // The amount of "effort" to spend in dynamic programming for computing
  // routing cuts. This is in term of basic operations needed by the algorithm
  // in the worst case, so a value like 1e8 should take less than a second to
  // compute.
  optional double routing_cut_dp_effort = 314 [default = 1e7];

  // If the length of an infeasible path is less than this value, a cut will be
  // added to exclude it.
  optional int32 routing_cut_max_infeasible_path_length = 317 [default = 6];

  // The search branching will be used to decide how to branch on unfixed nodes.
  enum SearchBranching {
    // Try to fix all literals using the underlying SAT solver's heuristics,
    // then generate and fix literals until integer variables are fixed. New
    // literals on integer variables are generated using the fixed search
    // specified by the user or our default one.
    AUTOMATIC_SEARCH = 0;

    // If used then all decisions taken by the solver are made using a fixed
    // order as specified in the API or in the CpModelProto search_strategy
    // field.
    FIXED_SEARCH = 1;

    // Simple portfolio search used by LNS workers.
    PORTFOLIO_SEARCH = 2;

    // If used, the solver will use heuristics from the LP relaxation. This
    // exploit the reduced costs of the variables in the relaxation.
    LP_SEARCH = 3;

    // If used, the solver uses the pseudo costs for branching. Pseudo costs
    // are computed using the historical change in objective bounds when some
    // decision are taken. Note that this works whether we use an LP or not.
    PSEUDO_COST_SEARCH = 4;

    // Mainly exposed here for testing. This quickly tries a lot of randomized
    // heuristics with a low conflict limit. It usually provides a good first
    // solution.
    PORTFOLIO_WITH_QUICK_RESTART_SEARCH = 5;

    // Mainly used internally. This is like FIXED_SEARCH, except we follow the
    // solution_hint field of the CpModelProto rather than using the information
    // provided in the search_strategy.
    HINT_SEARCH = 6;

    // Similar to FIXED_SEARCH, but differ in how the variable not listed into
    // the fixed search heuristics are branched on. This will always start the
    // search tree according to the specified fixed search strategy, but will
    // complete it using the default automatic search.
    PARTIAL_FIXED_SEARCH = 7;

    // Randomized search. Used to increase entropy in the search.
    RANDOMIZED_SEARCH = 8;
  }
  optional SearchBranching search_branching = 82 [default = AUTOMATIC_SEARCH];

  // Conflict limit used in the phase that exploit the solution hint.
  optional int32 hint_conflict_limit = 153 [default = 10];

  // If true, the solver tries to repair the solution given in the hint. This
  // search terminates after the 'hint_conflict_limit' is reached and the solver
  // switches to regular search. If false, then  we do a FIXED_SEARCH using the
  // hint until the hint_conflict_limit is reached.
  optional bool repair_hint = 167 [default = false];

  // If true, variables appearing in the solution hints will be fixed to their
  // hinted value.
  optional bool fix_variables_to_their_hinted_value = 192 [default = false];

  // If true, search will continuously probe Boolean variables, and integer
  // variable bounds. This parameter is set to true in parallel on the probing
  // worker.
  optional bool use_probing_search = 176 [default = false];

  // Use extended probing (probe bool_or, at_most_one, exactly_one).
  optional bool use_extended_probing = 269 [default = true];

  // How many combinations of pairs or triplets of variables we want to scan.
  optional int32 probing_num_combinations_limit = 272 [default = 20000];

  // Add a shaving phase (where the solver tries to prove that the lower or
  // upper bound of a variable are infeasible) to the probing search. (<= 0
  // disables it).
  optional double shaving_deterministic_time_in_probing_search = 204
      [default = 0.001];

  // Specifies the amount of deterministic time spent of each try at shaving a
  // bound in the shaving search.
  optional double shaving_search_deterministic_time = 205 [default = 0.1];

  // Specifies the threshold between two modes in the shaving procedure.
  // If the range of the variable/objective is less than this threshold, then
  // the shaving procedure will try to remove values one by one. Otherwise, it
  // will try to remove one range at a time.
  optional int64 shaving_search_threshold = 290 [default = 64];

  // If true, search will search in ascending max objective value (when
  // minimizing) starting from the lower bound of the objective.
  optional bool use_objective_lb_search = 228 [default = false];

  // This search differs from the previous search as it will not use assumptions
  // to bound the objective, and it will recreate a full model with the
  // hardcoded objective value.
  optional bool use_objective_shaving_search = 253 [default = false];

  // This search takes all Boolean or integer variables, and maximize or
  // minimize them in order to reduce their domain. -1 is automatic, otherwise
  // value 0 disables it, and 1, 2, or 3 changes something.
  optional int32 variables_shaving_level = 289 [default = -1];

  // The solver ignores the pseudo costs of variables with number of recordings
  // less than this threshold.
  optional int64 pseudo_cost_reliability_threshold = 123 [default = 100];

  // The default optimization method is a simple "linear scan", each time trying
  // to find a better solution than the previous one. If this is true, then we
  // use a core-based approach (like in max-SAT) when we try to increase the
  // lower bound instead.
  optional bool optimize_with_core = 83 [default = false];

  // Do a more conventional tree search (by opposition to SAT based one) where
  // we keep all the explored node in a tree. This is meant to be used in a
  // portfolio and focus on improving the objective lower bound. Keeping the
  // whole tree allow us to report a better objective lower bound coming from
  // the worst open node in the tree.
  optional bool optimize_with_lb_tree_search = 188 [default = false];

  // Experimental. Save the current LP basis at each node of the search tree so
  // that when we jump around, we can load it and reduce the number of LP
  // iterations needed.
  //
  // It currently works okay if we do not change the lp with cuts or
  // simplification... More work is needed to make it robust in all cases.
  optional bool save_lp_basis_in_lb_tree_search = 284 [default = false];

  // If non-negative, perform a binary search on the objective variable in order
  // to find an [min, max] interval outside of which the solver proved unsat/sat
  // under this amount of conflict. This can quickly reduce the objective domain
  // on some problems.
  optional int32 binary_search_num_conflicts = 99 [default = -1];

  // This has no effect if optimize_with_core is false. If true, use a different
  // core-based algorithm similar to the max-HS algo for max-SAT. This is a
  // hybrid MIP/CP approach and it uses a MIP solver in addition to the CP/SAT
  // one. This is also related to the PhD work of tobyodavies@
  // "Automatic Logic-Based Benders Decomposition with MiniZinc"
  // http://aaai.org/ocs/index.php/AAAI/AAAI17/paper/view/14489
  optional bool optimize_with_max_hs = 85 [default = false];

  // Parameters for an heuristic similar to the one described in the paper:
  // "Feasibility Jump: an LP-free Lagrangian MIP heuristic", Bjørnar
  // Luteberget, Giorgio Sartor, 2023, Mathematical Programming Computation.
  optional bool use_feasibility_jump = 265 [default = true];

  // Disable every other type of subsolver, setting this turns CP-SAT into a
  // pure local-search solver.
  optional bool use_ls_only = 240 [default = false];

  // On each restart, we randomly choose if we use decay (with this parameter)
  // or no decay.
  optional double feasibility_jump_decay = 242 [default = 0.95];

  // How much do we linearize the problem in the local search code.
  optional int32 feasibility_jump_linearization_level = 257 [default = 2];

  // This is a factor that directly influence the work before each restart.
  // Increasing it leads to longer restart.
  optional int32 feasibility_jump_restart_factor = 258 [default = 1];

  // How much dtime for each LS batch.
  optional double feasibility_jump_batch_dtime = 292 [default = 0.1];

  // Probability for a variable to have a non default value upon restarts or
  // perturbations.
  optional double feasibility_jump_var_randomization_probability = 247
      [default = 0.05];

  // Max distance between the default value and the pertubated value relative to
  // the range of the domain of the variable.
  optional double feasibility_jump_var_perburbation_range_ratio = 248
      [default = 0.2];

  // When stagnating, feasibility jump will either restart from a default
  // solution (with some possible randomization), or randomly pertubate the
  // current solution. This parameter selects the first option.
  optional bool feasibility_jump_enable_restarts = 250 [default = true];

  // Maximum size of no_overlap or no_overlap_2d constraint for a quadratic
  // expansion. This might look a lot, but by expanding such constraint, we get
  // a linear time evaluation per single variable moves instead of a slow O(n
  // log n) one.
  optional int32 feasibility_jump_max_expanded_constraint_size = 264
      [default = 500];

  // This will create incomplete subsolvers (that are not LNS subsolvers)
  // that use the feasibility jump code to find improving solution, treating
  // the objective improvement as a hard constraint.
  optional int32 num_violation_ls = 244 [default = 0];

  // How long violation_ls should wait before perturbating a solution.
  optional int32 violation_ls_perturbation_period = 249 [default = 100];

  // Probability of using compound move search each restart.
  // TODO(user): Add reference to paper when published.
  optional double violation_ls_compound_move_probability = 259 [default = 0.5];

  // Enables shared tree search.
  // If positive, start this many complete worker threads to explore a shared
  // search tree. These workers communicate objective bounds and simple decision
  // nogoods relating to the shared prefix of the tree, and will avoid exploring
  // the same subtrees as one another.
  // Specifying a negative number uses a heuristic to select an appropriate
  // number of shared tree workeres based on the total number of workers.
  optional int32 shared_tree_num_workers = 235 [default = -1];

  // Set on shared subtree workers. Users should not set this directly.
  optional bool use_shared_tree_search = 236 [default = false];

  // Minimum restarts before a worker will replace a subtree
  // that looks "bad" based on the average LBD of learned clauses.
  optional int32 shared_tree_worker_min_restarts_per_subtree = 282
      [default = 1];

  // If true, workers share more of the information from their local trail.
  // Specifically, literals implied by the shared tree decisions.
  optional bool shared_tree_worker_enable_trail_sharing = 295 [default = true];

  // If true, shared tree workers share their target phase when returning an
  // assigned subtree for the next worker to use.
  optional bool shared_tree_worker_enable_phase_sharing = 304 [default = true];

  // How many open leaf nodes should the shared tree maintain per worker.
  optional double shared_tree_open_leaves_per_worker = 281 [default = 2.0];

  // In order to limit total shared memory and communication overhead, limit the
  // total number of nodes that may be generated in the shared tree. If the
  // shared tree runs out of unassigned leaves, workers act as portfolio
  // workers. Note: this limit includes interior nodes, not just leaves.
  optional int32 shared_tree_max_nodes_per_worker = 238 [default = 10000];

  enum SharedTreeSplitStrategy {
    // Uses the default strategy, currently equivalent to
    // SPLIT_STRATEGY_DISCREPANCY.
    SPLIT_STRATEGY_AUTO = 0;
    // Only accept splits if the node to be split's depth+discrepancy is minimal
    // for the desired number of leaves.
    // The preferred child for discrepancy calculation is the one with the
    // lowest objective lower bound or the original branch direction if the
    // bounds are equal. This rule allows twice as many workers to work in the
    // preferred subtree as non-preferred.
    SPLIT_STRATEGY_DISCREPANCY = 1;
    // Only split nodes with an objective lb equal to the global lb. If there is
    // no objective, this is equivalent to SPLIT_STRATEGY_FIRST_PROPOSAL.
    SPLIT_STRATEGY_OBJECTIVE_LB = 2;
    // Attempt to keep the shared tree balanced.
    SPLIT_STRATEGY_BALANCED_TREE = 3;
    // Workers race to split their subtree, the winner's proposal is accepted.
    SPLIT_STRATEGY_FIRST_PROPOSAL = 4;
  }
  optional SharedTreeSplitStrategy shared_tree_split_strategy = 239
      [default = SPLIT_STRATEGY_AUTO];

  // How much deeper compared to the ideal max depth of the tree is considered
  // "balanced" enough to still accept a split. Without such a tolerance,
  // sometimes the tree can only be split by a single worker, and they may not
  // generate a split for some time. In contrast, with a tolerance of 1, at
  // least half of all workers should be able to split the tree as soon as a
  // split becomes required. This only has an effect on
  // SPLIT_STRATEGY_BALANCED_TREE and SPLIT_STRATEGY_DISCREPANCY.
  optional int32 shared_tree_balance_tolerance = 305 [default = 1];

  // How much dtime a worker will wait between proposing splits.
  // This limits the contention in splitting the shared tree, and also reduces
  // the number of too-easy subtrees that are generates.
  optional double shared_tree_split_min_dtime = 328 [default = 0.1];

  // Whether we enumerate all solutions of a problem without objective.
  //
  // WARNING:
  // - This can be used with num_workers > 1 but then each solutions can be
  //   found more than once, so it is up to the client to deduplicate them.
  // - If keep_all_feasible_solutions_in_presolve is unset, we will set it to
  //   true as otherwise, many feasible solution can just be removed by the
  //   presolve. It is still possible to manually set this to false if one only
  //   wants to enumerate all solutions of the presolved model.
  optional bool enumerate_all_solutions = 87 [default = false];

  // If true, we disable the presolve reductions that remove feasible solutions
  // from the search space. Such solution are usually dominated by a "better"
  // solution that is kept, but depending on the situation, we might want to
  // keep all solutions.
  //
  // A trivial example is when a variable is unused. If this is true, then the
  // presolve will not fix it to an arbitrary value and it will stay in the
  // search space.
  optional bool keep_all_feasible_solutions_in_presolve = 173 [default = false];

  // If true, add information about the derived variable domains to the
  // CpSolverResponse. It is an option because it makes the response slighly
  // bigger and there is a bit more work involved during the postsolve to
  // construct it, but it should still have a low overhead. See the
  // tightened_variables field in CpSolverResponse for more details.
  optional bool fill_tightened_domains_in_response = 132 [default = false];

  // If true, the final response addition_solutions field will be filled with
  // all solutions from our solutions pool.
  //
  // Note that if both this field and enumerate_all_solutions is true, we will
  // copy to the pool all of the solution found. So if solution_pool_size is big
  // enough, you can get all solutions this way instead of using the solution
  // callback.
  //
  // Note that this only affect the "final" solution, not the one passed to the
  // solution callbacks.
  optional bool fill_additional_solutions_in_response = 194 [default = false];

  // If true, the solver will add a default integer branching strategy to the
  // already defined search strategy. If not, some variable might still not be
  // fixed at the end of the search. For now we assume these variable can just
  // be set to their lower bound.
  optional bool instantiate_all_variables = 106 [default = true];

  // If true, then the precedences propagator try to detect for each variable if
  // it has a set of "optional incoming arc" for which at least one of them is
  // present. This is usually useful to have but can be slow on model with a lot
  // of precedence.
  optional bool auto_detect_greater_than_at_least_one_of = 95 [default = true];

  // For an optimization problem, stop the solver as soon as we have a solution.
  optional bool stop_after_first_solution = 98 [default = false];

  // Mainly used when improving the presolver. When true, stops the solver after
  // the presolve is complete (or after loading and root level propagation).
  optional bool stop_after_presolve = 149 [default = false];
  optional bool stop_after_root_propagation = 252 [default = false];

  // LNS parameters.

  // Initial parameters for neighborhood generation.
  optional double lns_initial_difficulty = 307 [default = 0.5];
  optional double lns_initial_deterministic_limit = 308 [default = 0.1];

  // Testing parameters used to disable all lns workers.
  optional bool use_lns = 283 [default = true];

  // Experimental parameters to disable everything but lns.
  optional bool use_lns_only = 101 [default = false];

  // Size of the top-n different solutions kept by the solver.
  // This parameter must be > 0. Currently, having this larger than one mainly
  // impact the "base" solution chosen for a LNS/LS fragment.
  optional int32 solution_pool_size = 193 [default = 3];

  // If solution_pool_size is <= this, we will use DP to keep a "diverse" set
  // of solutions (the one further apart via hamming distance) in the pool.
  // Setting this to large value might be slow, especially if your solution are
  // large.
  optional int32 solution_pool_diversity_limit = 329 [default = 10];

  // In order to not get stuck in local optima, when this is non-zero, we try to
  // also work on "older" solutions with a worse objective value so we get a
  // chance to follow a different LS/LNS trajectory.
  optional int32 alternative_pool_size = 325 [default = 1];

  // Turns on relaxation induced neighborhood generator.
  optional bool use_rins_lns = 129 [default = true];

  // Adds a feasibility pump subsolver along with lns subsolvers.
  optional bool use_feasibility_pump = 164 [default = true];

  // Turns on neighborhood generator based on local branching LP. Based on Huang
  // et al., "Local Branching Relaxation Heuristics for Integer Linear
  // Programs", 2023.
  optional bool use_lb_relax_lns = 255 [default = true];

  // Only use lb-relax if we have at least that many workers.
  optional int32 lb_relax_num_workers_threshold = 296 [default = 16];

  // Rounding method to use for feasibility pump.
  enum FPRoundingMethod {
    // Rounds to the nearest integer value.
    NEAREST_INTEGER = 0;

    // Counts the number of linear constraints restricting the variable in the
    // increasing values (up locks) and decreasing values (down locks). Rounds
    // the variable in the direction of lesser locks.
    LOCK_BASED = 1;

    // Similar to lock based rounding except this only considers locks of active
    // constraints from the last lp solve.
    ACTIVE_LOCK_BASED = 3;

    // This is expensive rounding algorithm. We round variables one by one and
    // propagate the bounds in between. If none of the rounded values fall in
    // the continuous domain specified by lower and upper bound, we use the
    // current lower/upper bound (whichever one is closest) instead of rounding
    // the fractional lp solution value. If both the rounded values are in the
    // domain, we round to nearest integer.
    PROPAGATION_ASSISTED = 2;
  }
  optional FPRoundingMethod fp_rounding = 165 [default = PROPAGATION_ASSISTED];

  // If true, registers more lns subsolvers with different parameters.
  optional bool diversify_lns_params = 137 [default = false];

  // Randomize fixed search.
  optional bool randomize_search = 103 [default = false];

  // Search randomization will collect the top
  // 'search_random_variable_pool_size' valued variables, and pick one randomly.
  // The value of the variable is specific to each strategy.
  optional int64 search_random_variable_pool_size = 104 [default = 0];

  // Experimental code: specify if the objective pushes all tasks toward the
  // start of the schedule.
  optional bool push_all_tasks_toward_start = 262 [default = false];

  // If true, we automatically detect variables whose constraint are always
  // enforced by the same literal and we mark them as optional. This allows
  // to propagate them as if they were present in some situation.
  //
  // TODO(user): This is experimental and seems to lead to wrong optimal in
  // some situation. It should however gives correct solutions. Fix.
  optional bool use_optional_variables = 108 [default = false];

  // The solver usually exploit the LP relaxation of a model. If this option is
  // true, then whatever is infered by the LP will be used like an heuristic to
  // compute EXACT propagation on the IP. So with this option, there is no
  // numerical imprecision issues.
  optional bool use_exact_lp_reason = 109 [default = true];

  // This can be beneficial if there is a lot of no-overlap constraints but a
  // relatively low number of different intervals in the problem. Like 1000
  // intervals, but 1M intervals in the no-overlap constraints covering them.
  optional bool use_combined_no_overlap = 133 [default = false];

  // All at_most_one constraints with a size <= param will be replaced by a
  // quadratic number of binary implications.
  optional int32 at_most_one_max_expansion_size = 270 [default = 3];

  // Indicates if the CP-SAT layer should catch Control-C (SIGINT) signals
  // when calling solve. If set, catching the SIGINT signal will terminate the
  // search gracefully, as if a time limit was reached.
  optional bool catch_sigint_signal = 135 [default = true];

  // Stores and exploits "implied-bounds" in the solver. That is, relations of
  // the form literal => (var >= bound). This is currently used to derive
  // stronger cuts.
  optional bool use_implied_bounds = 144 [default = true];

  // Whether we try to do a few degenerate iteration at the end of an LP solve
  // to minimize the fractionality of the integer variable in the basis. This
  // helps on some problems, but not so much on others. It also cost of bit of
  // time to do such polish step.
  optional bool polish_lp_solution = 175 [default = false];

  // The internal LP tolerances used by CP-SAT. These applies to the internal
  // and scaled problem. If the domains of your variables are large it might be
  // good to use lower tolerances. If your problem is binary with low
  // coefficients, it might be good to use higher ones to speed-up the lp
  // solves.
  optional double lp_primal_tolerance = 266 [default = 1e-7];
  optional double lp_dual_tolerance = 267 [default = 1e-7];

  // Temporary flag util the feature is more mature. This convert intervals to
  // the newer proto format that support affine start/var/end instead of just
  // variables.
  optional bool convert_intervals = 177 [default = true];

  // Whether we try to automatically detect the symmetries in a model and
  // exploit them. Currently, at level 1 we detect them in presolve and try
  // to fix Booleans. At level 2, we also do some form of dynamic symmetry
  // breaking during search. At level 3, we also detect symmetries for very
  // large models, which can be slow. At level 4, we try to break as much
  // symmetry as possible in presolve.
  optional int32 symmetry_level = 183 [default = 2];

  // When we have symmetry, it is possible to "fold" all variables from the same
  // orbit into a single variable, while having the same power of LP relaxation.
  // This can help significantly on symmetric problem. However there is
  // currently a bit of overhead as the rest of the solver need to do some
  // translation between the folded LP and the rest of the problem.
  optional bool use_symmetry_in_lp = 301 [default = false];

  // Experimental. This will compute the symmetry of the problem once and for
  // all. All presolve operations we do should keep the symmetry group intact
  // or modify it properly. For now we have really little support for this. We
  // will disable a bunch of presolve operations that could be supported.
  optional bool keep_symmetry_in_presolve = 303 [default = false];

  // Deterministic time limit for symmetry detection.
  optional double symmetry_detection_deterministic_time_limit = 302
      [default = 1.0];

  // The new linear propagation code treat all constraints at once and use
  // an adaptation of Bellman-Ford-Tarjan to propagate constraint in a smarter
  // order and potentially detect propagation cycle earlier.
  optional bool new_linear_propagation = 224 [default = true];

  // Linear constraints that are not pseudo-Boolean and that are longer than
  // this size will be split into sqrt(size) intermediate sums in order to have
  // faster propation in the CP engine.
  optional int32 linear_split_size = 256 [default = 100];

  // ==========================================================================
  // Linear programming relaxation
  // ==========================================================================

  // A non-negative level indicating the type of constraints we consider in the
  // LP relaxation. At level zero, no LP relaxation is used. At level 1, only
  // the linear constraint and full encoding are added. At level 2, we also add
  // all the Boolean constraints.
  optional int32 linearization_level = 90 [default = 1];

  // A non-negative level indicating how much we should try to fully encode
  // Integer variables as Boolean.
  optional int32 boolean_encoding_level = 107 [default = 1];

  // When loading a*x + b*y ==/!= c when x and y are both fully encoded.
  // The solver may decide to replace the linear equation by a set of clauses.
  // This is triggered if the sizes of the domains of x and y are below the
  // threshold.
  optional int32 max_domain_size_when_encoding_eq_neq_constraints = 191
      [default = 16];

  // The limit on the number of cuts in our cut pool. When this is reached we do
  // not generate cuts anymore.
  //
  // TODO(user): We should probably remove this parameters, and just always
  // generate cuts but only keep the best n or something.
  optional int32 max_num_cuts = 91 [default = 10000];

  // Control the global cut effort. Zero will turn off all cut. For now we just
  // have one level. Note also that most cuts are only used at linearization
  // level >= 2.
  optional int32 cut_level = 196 [default = 1];

  // For the cut that can be generated at any level, this control if we only
  // try to generate them at the root node.
  optional bool only_add_cuts_at_level_zero = 92 [default = false];

  // When the LP objective is fractional, do we add the cut that forces the
  // linear objective expression to be greater or equal to this fractional value
  // rounded up? We can always do that since our objective is integer, and
  // combined with MIR heuristic to reduce the coefficient of such cut, it can
  // help.
  optional bool add_objective_cut = 197 [default = false];

  // Whether we generate and add Chvatal-Gomory cuts to the LP at root node.
  // Note that for now, this is not heavily tuned.
  optional bool add_cg_cuts = 117 [default = true];

  // Whether we generate MIR cuts at root node.
  // Note that for now, this is not heavily tuned.
  optional bool add_mir_cuts = 120 [default = true];

  // Whether we generate Zero-Half cuts at root node.
  // Note that for now, this is not heavily tuned.
  optional bool add_zero_half_cuts = 169 [default = true];

  // Whether we generate clique cuts from the binary implication graph. Note
  // that as the search goes on, this graph will contains new binary clauses
  // learned by the SAT engine.
  optional bool add_clique_cuts = 172 [default = true];

  // Whether we generate RLT cuts. This is still experimental but can help on
  // binary problem with a lot of clauses of size 3.
  optional bool add_rlt_cuts = 279 [default = true];

  // Cut generator for all diffs can add too many cuts for large all_diff
  // constraints. This parameter restricts the large all_diff constraints to
  // have a cut generator.
  optional int32 max_all_diff_cut_size = 148 [default = 64];

  // For the lin max constraints, generates the cuts described in "Strong
  // mixed-integer programming formulations for trained neural networks" by Ross
  // Anderson et. (https://arxiv.org/pdf/1811.01988.pdf)
  optional bool add_lin_max_cuts = 152 [default = true];

  // In the integer rounding procedure used for MIR and Gomory cut, the maximum
  // "scaling" we use (must be positive). The lower this is, the lower the
  // integer coefficients of the cut will be. Note that cut generated by lower
  // values are not necessarily worse than cut generated by larger value. There
  // is no strict dominance relationship.
  //
  // Setting this to 2 result in the "strong fractional rouding" of Letchford
  // and Lodi.
  optional int32 max_integer_rounding_scaling = 119 [default = 600];

  // If true, we start by an empty LP, and only add constraints not satisfied
  // by the current LP solution batch by batch. A constraint that is only added
  // like this is known as a "lazy" constraint in the literature, except that we
  // currently consider all constraints as lazy here.
  optional bool add_lp_constraints_lazily = 112 [default = true];

  // Even at the root node, we do not want to spend too much time on the LP if
  // it is "difficult". So we solve it in "chunks" of that many iterations. The
  // solve will be continued down in the tree or the next time we go back to the
  // root node.
  optional int32 root_lp_iterations = 227 [default = 2000];

  // While adding constraints, skip the constraints which have orthogonality
  // less than 'min_orthogonality_for_lp_constraints' with already added
  // constraints during current call. Orthogonality is defined as 1 -
  // cosine(vector angle between constraints). A value of zero disable this
  // feature.
  optional double min_orthogonality_for_lp_constraints = 115 [default = 0.05];

  // Max number of time we perform cut generation and resolve the LP at level 0.
  optional int32 max_cut_rounds_at_level_zero = 154 [default = 1];

  // If a constraint/cut in LP is not active for that many consecutive OPTIMAL
  // solves, remove it from the LP. Note that it might be added again later if
  // it become violated by the current LP solution.
  optional int32 max_consecutive_inactive_count = 121 [default = 100];

  // These parameters are similar to sat clause management activity parameters.
  // They are effective only if the number of generated cuts exceed the storage
  // limit. Default values are based on a few experiments on miplib instances.
  optional double cut_max_active_count_value = 155 [default = 1e10];
  optional double cut_active_count_decay = 156 [default = 0.8];

  // Target number of constraints to remove during cleanup.
  optional int32 cut_cleanup_target = 157 [default = 1000];

  // Add that many lazy constraints (or cuts) at once in the LP. Note that at
  // the beginning of the solve, we do add more than this.
  optional int32 new_constraints_batch_size = 122 [default = 50];

  // All the "exploit_*" parameters below work in the same way: when branching
  // on an IntegerVariable, these parameters affect the value the variable is
  // branched on. Currently the first heuristic that triggers win in the order
  // in which they appear below.
  //
  // TODO(user): Maybe do like for the restart algorithm, introduce an enum
  // and a repeated field that control the order on which these are applied?

  // If true and the Lp relaxation of the problem has an integer optimal
  // solution, try to exploit it. Note that since the LP relaxation may not
  // contain all the constraints, such a solution is not necessarily a solution
  // of the full problem.
  optional bool exploit_integer_lp_solution = 94 [default = true];

  // If true and the Lp relaxation of the problem has a solution, try to exploit
  // it. This is same as above except in this case the lp solution might not be
  // an integer solution.
  optional bool exploit_all_lp_solution = 116 [default = true];

  // When branching on a variable, follow the last best solution value.
  optional bool exploit_best_solution = 130 [default = false];

  // When branching on a variable, follow the last best relaxation solution
  // value. We use the relaxation with the tightest bound on the objective as
  // the best relaxation solution.
  optional bool exploit_relaxation_solution = 161 [default = false];

  // When branching an a variable that directly affect the objective,
  // branch on the value that lead to the best objective first.
  optional bool exploit_objective = 131 [default = true];

  // Infer products of Boolean or of Boolean time IntegerVariable from the
  // linear constrainst in the problem. This can be used in some cuts, altough
  // for now we don't really exploit it.
  optional bool detect_linearized_product = 277 [default = false];

  // This should be better on integer problems.
  // But it is still work in progress.
  optional bool use_new_integer_conflict_resolution = 336 [default = false];

  // If true, and during integer conflict resolution (icr) the 1-UIP is an
  // integer literal for which we do not have an associated Boolean. Create one.
  optional bool create_1uip_boolean_during_icr = 341 [default = true];

  // ==========================================================================
  // MIP -> CP-SAT (i.e. IP with integer coeff) conversion parameters that are
  // used by our automatic "scaling" algorithm.
  //
  // Note that it is hard to do a meaningful conversion automatically and if
  // you have a model with continuous variables, it is best if you scale the
  // domain of the variable yourself so that you have a relevant precision for
  // the application at hand. Same for the coefficients and constraint bounds.
  // ==========================================================================

  // We need to bound the maximum magnitude of the variables for CP-SAT, and
  // that is the bound we use. If the MIP model expect larger variable value in
  // the solution, then the converted model will likely not be relevant.
  optional double mip_max_bound = 124 [default = 1e7];

  // All continuous variable of the problem will be multiplied by this factor.
  // By default, we don't do any variable scaling and rely on the MIP model to
  // specify continuous variable domain with the wanted precision.
  optional double mip_var_scaling = 125 [default = 1.0];

  // If this is false, then mip_var_scaling is only applied to variables with
  // "small" domain. If it is true, we scale all floating point variable
  // independenlty of their domain.
  optional bool mip_scale_large_domain = 225 [default = false];

  // If true, some continuous variable might be automatically scaled. For now,
  // this is only the case where we detect that a variable is actually an
  // integer multiple of a constant. For instance, variables of the form k * 0.5
  // are quite frequent, and if we detect this, we will scale such variable
  // domain by 2 to make it implied integer.
  optional bool mip_automatically_scale_variables = 166 [default = true];

  // If one try to solve a MIP model with CP-SAT, because we assume all variable
  // to be integer after scaling, we will not necessarily have the correct
  // optimal. Note however that all feasible solutions are valid since we will
  // just solve a more restricted version of the original problem.
  //
  // This parameters is here to prevent user to think the solution is optimal
  // when it might not be. One will need to manually set this to false to solve
  // a MIP model where the optimal might be different.
  //
  // Note that this is tested after some MIP presolve steps, so even if not
  // all original variable are integer, we might end up with a pure IP after
  // presolve and after implied integer detection.
  optional bool only_solve_ip = 222 [default = false];

  // When scaling constraint with double coefficients to integer coefficients,
  // we will multiply by a power of 2 and round the coefficients. We will choose
  // the lowest power such that we have no potential overflow (see
  // mip_max_activity_exponent) and the worst case constraint activity error
  // does not exceed this threshold.
  //
  // Note that we also detect constraint with rational coefficients and scale
  // them accordingly when it seems better instead of using a power of 2.
  //
  // We also relax all constraint bounds by this absolute value. For pure
  // integer constraint, if this value if lower than one, this will not change
  // anything. However it is needed when scaling MIP problems.
  //
  // If we manage to scale a constraint correctly, the maximum error we can make
  // will be twice this value (once for the scaling error and once for the
  // relaxed bounds). If we are not able to scale that well, we will display
  // that fact but still scale as best as we can.
  optional double mip_wanted_precision = 126 [default = 1e-6];

  // To avoid integer overflow, we always force the maximum possible constraint
  // activity (and objective value) according to the initial variable domain to
  // be smaller than 2 to this given power. Because of this, we cannot always
  // reach the "mip_wanted_precision" parameter above.
  //
  // This can go as high as 62, but some internal algo currently abort early if
  // they might run into integer overflow, so it is better to keep it a bit
  // lower than this.
  optional int32 mip_max_activity_exponent = 127 [default = 53];

  // As explained in mip_precision and mip_max_activity_exponent, we cannot
  // always reach the wanted precision during scaling. We use this threshold to
  // enphasize in the logs when the precision seems bad.
  optional double mip_check_precision = 128 [default = 1e-4];

  // Even if we make big error when scaling the objective, we can always derive
  // a correct lower bound on the original objective by using the exact lower
  // bound on the scaled integer version of the objective. This should be fast,
  // but if you don't care about having a precise lower bound, you can turn it
  // off.
  optional bool mip_compute_true_objective_bound = 198 [default = true];

  // Any finite values in the input MIP must be below this threshold, otherwise
  // the model will be reported invalid. This is needed to avoid floating point
  // overflow when evaluating bounds * coeff for instance. We are a bit more
  // defensive, but in practice, users shouldn't use super large values in a
  // MIP.
  optional double mip_max_valid_magnitude = 199 [default = 1e20];

  // By default, any variable/constraint bound with a finite value and a
  // magnitude greater than the mip_max_valid_magnitude will result with a
  // invalid model. This flags change the behavior such that such bounds are
  // silently transformed to +∞ or -∞.
  //
  // It is recommended to keep it at false, and create valid bounds.
  optional bool mip_treat_high_magnitude_bounds_as_infinity = 278
      [default = false];

  // Any value in the input mip with a magnitude lower than this will be set to
  // zero. This is to avoid some issue in LP presolving.
  optional double mip_drop_tolerance = 232 [default = 1e-16];

  // When solving a MIP, we do some basic floating point presolving before
  // scaling the problem to integer to be handled by CP-SAT. This control how
  // much of that presolve we do. It can help to better scale floating point
  // model, but it is not always behaving nicely.
  optional int32 mip_presolve_level = 261 [default = 2];
}
`,pr=typeof window<`u`&&typeof document<`u`,mr=typeof Worker<`u`;function hr(e=`auto`){let t=typeof e==`string`?{type:e}:e;return t.type===`auto`?{type:pr&&mr?`worker`:`direct`}:t}var gr=/* @__PURE__ */ Symbol.for(`or-tools-wasm.cloud-notice`),_r=globalThis;function vr(){return _r[gr]??(_r[gr]={printed:!1})}function yr(e){vr().enabled=e}function br(){let e=vr();if(e.printed||!(e.enabled??Vn(`ORTOOLS_WASM_CLOUD_NOTICE`)!==`0`))return;e.printed=!0;let t=[`OR-Tools WASM Cloud`,``,`Build your app. Let us run the solvers.`,`Send optimization jobs through an API.`,`We handle the compute, queues, and scaling.`,``,`Explore cloud / early access:`,`https://or-tools-wasm-api.axelwickman.com/info`],n=Math.max(...t.map(e=>e.length)),r=`+-${`-`.repeat(n)}-+`,i=[r,...t.map(e=>`| ${e.padEnd(n)} |`),r].join(`
`);try{console.info(Bn()?`\x1B[36m${i}\x1B[0m`:i)}catch{}}function xr(e){if(e.reason instanceof Error)return e.reason;let t=e.reason===void 0?`The solver job was aborted.`:String(e.reason);if(typeof DOMException<`u`)return new DOMException(t,`AbortError`);let n=Error(t);return n.name=`AbortError`,n}async function Sr(e,t,n){if(n.signal?.aborted)throw xr(n.signal);let r,i=Promise.resolve(),a=e.execute(t,{resources:n.resources,onEvent:e=>(i=i.then(async()=>{if(!r)try{await n.onEvent?.(e)}catch(e){r={error:e}}}),i)}),o,s=()=>{!n.signal||o||(o={error:xr(n.signal)},a.cancel().catch(()=>{}))};n.signal?.addEventListener(`abort`,s,{once:!0}),n.signal?.aborted&&s();try{let e;try{e=await a.result}catch(e){throw await i,e}if(await i,await n.onSuccess?.(e),r)throw r.error;if(o)throw o.error;return n.showCloudNotice&&br(),e}finally{n.signal?.removeEventListener(`abort`,s)}}var Cr=null;try{Cr=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function K(e,t,n){this.low=e|0,this.high=t|0,this.unsigned=!!n}K.prototype.__isLong__,Object.defineProperty(K.prototype,"__isLong__",{value:!0});function wr(e){return(e&&e.__isLong__)===!0}function Tr(e){var t=Math.clz32(e&-e);return e?31-t:t}K.isLong=wr;var Er={},Dr={};function Or(e,t){var n,r,i;return t?(e>>>=0,(i=0<=e&&e<256)&&(r=Dr[e],r)?r:(n=q(e,0,!0),i&&(Dr[e]=n),n)):(e|=0,(i=-128<=e&&e<128)&&(r=Er[e],r)?r:(n=q(e,e<0?-1:0,!1),i&&(Er[e]=n),n))}K.fromInt=Or;function kr(e,t){if(isNaN(e))return t?Br:zr;if(t){if(e<0)return Br;if(e>=Ir)return Gr}else{if(e<=-Lr)return Kr;if(e+1>=Lr)return Wr}return e<0?kr(-e,t).neg():q(e%Fr|0,e/Fr|0,t)}K.fromNumber=kr;function q(e,t,n){return new K(e,t,n)}K.fromBits=q;var Ar=Math.pow;function jr(e,t,n){if(e.length===0)throw Error(`empty string`);if(typeof t==`number`?(n=t,t=!1):t=!!t,e===`NaN`||e===`Infinity`||e===`+Infinity`||e===`-Infinity`)return t?Br:zr;if(n||=10,n<2||36<n)throw RangeError(`radix`);var r;if((r=e.indexOf(`-`))>0)throw Error(`interior hyphen`);if(r===0)return jr(e.substring(1),t,n).neg();for(var i=kr(Ar(n,8)),a=zr,o=0;o<e.length;o+=8){var s=Math.min(8,e.length-o),c=parseInt(e.substring(o,o+s),n);if(s<8){var l=kr(Ar(n,s));a=a.mul(l).add(kr(c))}else a=a.mul(i),a=a.add(kr(c))}return a.unsigned=t,a}K.fromString=jr;function Mr(e,t){return typeof e==`number`?kr(e,t):typeof e==`string`?jr(e,t):q(e.low,e.high,typeof t==`boolean`?t:e.unsigned)}K.fromValue=Mr;var Nr=65536,Pr=1<<24,Fr=Nr*Nr,Ir=Fr*Fr,Lr=Ir/2,Rr=Or(Pr),zr=Or(0);K.ZERO=zr;var Br=Or(0,!0);K.UZERO=Br;var Vr=Or(1);K.ONE=Vr;var Hr=Or(1,!0);K.UONE=Hr;var Ur=Or(-1);K.NEG_ONE=Ur;var Wr=q(-1,2147483647,!1);K.MAX_VALUE=Wr;var Gr=q(-1,-1,!0);K.MAX_UNSIGNED_VALUE=Gr;var Kr=q(0,-2147483648,!1);K.MIN_VALUE=Kr;var J=K.prototype;J.toInt=function(){return this.unsigned?this.low>>>0:this.low},J.toNumber=function(){return this.unsigned?(this.high>>>0)*Fr+(this.low>>>0):this.high*Fr+(this.low>>>0)},J.toString=function(e){if(e||=10,e<2||36<e)throw RangeError(`radix`);if(this.isZero())return`0`;if(this.isNegative()){if(this.eq(Kr)){var t=kr(e),n=this.div(t),r=n.mul(t).sub(this);return n.toString(e)+r.toInt().toString(e)}return`-`+this.neg().toString(e)}for(var i=kr(Ar(e,6),this.unsigned),a=this,o=``;;){var s=a.div(i),c=(a.sub(s.mul(i)).toInt()>>>0).toString(e);if(a=s,a.isZero())return c+o;for(;c.length<6;)c=`0`+c;o=``+c+o}},J.getHighBits=function(){return this.high},J.getHighBitsUnsigned=function(){return this.high>>>0},J.getLowBits=function(){return this.low},J.getLowBitsUnsigned=function(){return this.low>>>0},J.getNumBitsAbs=function(){if(this.isNegative())return this.eq(Kr)?64:this.neg().getNumBitsAbs();for(var e=this.high==0?this.low:this.high,t=31;t>0&&!(e&1<<t);t--);return this.high==0?t+1:t+33},J.isSafeInteger=function(){var e=this.high>>21;return!e||!this.unsigned&&e===-1&&(this.low!==0||this.high!==-2097152)},J.isZero=function(){return this.high===0&&this.low===0},J.eqz=J.isZero,J.isNegative=function(){return!this.unsigned&&this.high<0},J.isPositive=function(){return this.unsigned||this.high>=0},J.isOdd=function(){return(this.low&1)==1},J.isEven=function(){return!(this.low&1)},J.equals=function(e){return wr(e)||(e=Mr(e)),this.unsigned!==e.unsigned&&this.high>>>31==1&&e.high>>>31==1?!1:this.high===e.high&&this.low===e.low},J.eq=J.equals,J.notEquals=function(e){return!this.eq(e)},J.neq=J.notEquals,J.ne=J.notEquals,J.lessThan=function(e){return this.comp(e)<0},J.lt=J.lessThan,J.lessThanOrEqual=function(e){return this.comp(e)<=0},J.lte=J.lessThanOrEqual,J.le=J.lessThanOrEqual,J.greaterThan=function(e){return this.comp(e)>0},J.gt=J.greaterThan,J.greaterThanOrEqual=function(e){return this.comp(e)>=0},J.gte=J.greaterThanOrEqual,J.ge=J.greaterThanOrEqual,J.compare=function(e){if(wr(e)||(e=Mr(e)),this.eq(e))return 0;var t=this.isNegative(),n=e.isNegative();return t&&!n?-1:!t&&n?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1},J.comp=J.compare,J.negate=function(){return!this.unsigned&&this.eq(Kr)?Kr:this.not().add(Vr)},J.neg=J.negate,J.add=function(e){wr(e)||(e=Mr(e));var t=this.high>>>16,n=this.high&65535,r=this.low>>>16,i=this.low&65535,a=e.high>>>16,o=e.high&65535,s=e.low>>>16,c=e.low&65535,l=0,u=0,d=0,f=0;return f+=i+c,d+=f>>>16,f&=65535,d+=r+s,u+=d>>>16,d&=65535,u+=n+o,l+=u>>>16,u&=65535,l+=t+a,l&=65535,q(d<<16|f,l<<16|u,this.unsigned)},J.subtract=function(e){return wr(e)||(e=Mr(e)),this.add(e.neg())},J.sub=J.subtract,J.multiply=function(e){if(this.isZero())return this;if(wr(e)||(e=Mr(e)),Cr)return q(Cr.mul(this.low,this.high,e.low,e.high),Cr.get_high(),this.unsigned);if(e.isZero())return this.unsigned?Br:zr;if(this.eq(Kr))return e.isOdd()?Kr:zr;if(e.eq(Kr))return this.isOdd()?Kr:zr;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(Rr)&&e.lt(Rr))return kr(this.toNumber()*e.toNumber(),this.unsigned);var t=this.high>>>16,n=this.high&65535,r=this.low>>>16,i=this.low&65535,a=e.high>>>16,o=e.high&65535,s=e.low>>>16,c=e.low&65535,l=0,u=0,d=0,f=0;return f+=i*c,d+=f>>>16,f&=65535,d+=r*c,u+=d>>>16,d&=65535,d+=i*s,u+=d>>>16,d&=65535,u+=n*c,l+=u>>>16,u&=65535,u+=r*s,l+=u>>>16,u&=65535,u+=i*o,l+=u>>>16,u&=65535,l+=t*c+n*s+r*o+i*a,l&=65535,q(d<<16|f,l<<16|u,this.unsigned)},J.mul=J.multiply,J.divide=function(e){if(wr(e)||(e=Mr(e)),e.isZero())throw Error(`division by zero`);if(Cr)return!this.unsigned&&this.high===-2147483648&&e.low===-1&&e.high===-1?this:q((this.unsigned?Cr.div_u:Cr.div_s)(this.low,this.high,e.low,e.high),Cr.get_high(),this.unsigned);if(this.isZero())return this.unsigned?Br:zr;var t,n,r;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return Br;if(e.gt(this.shru(1)))return Hr;r=Br}else{if(this.eq(Kr))return e.eq(Vr)||e.eq(Ur)?Kr:e.eq(Kr)?Vr:(t=this.shr(1).div(e).shl(1),t.eq(zr)?e.isNegative()?Vr:Ur:(n=this.sub(e.mul(t)),r=t.add(n.div(e)),r));if(e.eq(Kr))return this.unsigned?Br:zr;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();r=zr}for(n=this;n.gte(e);){t=Math.max(1,Math.floor(n.toNumber()/e.toNumber()));for(var i=Math.ceil(Math.log(t)/Math.LN2),a=i<=48?1:Ar(2,i-48),o=kr(t),s=o.mul(e);s.isNegative()||s.gt(n);)t-=a,o=kr(t,this.unsigned),s=o.mul(e);o.isZero()&&(o=Vr),r=r.add(o),n=n.sub(s)}return r},J.div=J.divide,J.modulo=function(e){return wr(e)||(e=Mr(e)),Cr?q((this.unsigned?Cr.rem_u:Cr.rem_s)(this.low,this.high,e.low,e.high),Cr.get_high(),this.unsigned):this.sub(this.div(e).mul(e))},J.mod=J.modulo,J.rem=J.modulo,J.not=function(){return q(~this.low,~this.high,this.unsigned)},J.countLeadingZeros=function(){return this.high?Math.clz32(this.high):Math.clz32(this.low)+32},J.clz=J.countLeadingZeros,J.countTrailingZeros=function(){return this.low?Tr(this.low):Tr(this.high)+32},J.ctz=J.countTrailingZeros,J.and=function(e){return wr(e)||(e=Mr(e)),q(this.low&e.low,this.high&e.high,this.unsigned)},J.or=function(e){return wr(e)||(e=Mr(e)),q(this.low|e.low,this.high|e.high,this.unsigned)},J.xor=function(e){return wr(e)||(e=Mr(e)),q(this.low^e.low,this.high^e.high,this.unsigned)},J.shiftLeft=function(e){return wr(e)&&(e=e.toInt()),(e&=63)==0?this:e<32?q(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):q(0,this.low<<e-32,this.unsigned)},J.shl=J.shiftLeft,J.shiftRight=function(e){return wr(e)&&(e=e.toInt()),(e&=63)==0?this:e<32?q(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):q(this.high>>e-32,this.high>=0?0:-1,this.unsigned)},J.shr=J.shiftRight,J.shiftRightUnsigned=function(e){return wr(e)&&(e=e.toInt()),(e&=63)==0?this:e<32?q(this.low>>>e|this.high<<32-e,this.high>>>e,this.unsigned):q(e===32?this.high:this.high>>>e-32,0,this.unsigned)},J.shru=J.shiftRightUnsigned,J.shr_u=J.shiftRightUnsigned,J.rotateLeft=function(e){var t;return wr(e)&&(e=e.toInt()),(e&=63)==0?this:e===32?q(this.high,this.low,this.unsigned):e<32?(t=32-e,q(this.low<<e|this.high>>>t,this.high<<e|this.low>>>t,this.unsigned)):(e-=32,t=32-e,q(this.high<<e|this.low>>>t,this.low<<e|this.high>>>t,this.unsigned))},J.rotl=J.rotateLeft,J.rotateRight=function(e){var t;return wr(e)&&(e=e.toInt()),(e&=63)==0?this:e===32?q(this.high,this.low,this.unsigned):e<32?(t=32-e,q(this.high<<t|this.low>>>e,this.low<<t|this.high>>>e,this.unsigned)):(e-=32,t=32-e,q(this.low<<t|this.high>>>e,this.high<<t|this.low>>>e,this.unsigned))},J.rotr=J.rotateRight,J.toSigned=function(){return this.unsigned?q(this.low,this.high,!1):this},J.toUnsigned=function(){return this.unsigned?this:q(this.low,this.high,!0)},J.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()},J.toBytesLE=function(){var e=this.high,t=this.low;return[t&255,t>>>8&255,t>>>16&255,t>>>24,e&255,e>>>8&255,e>>>16&255,e>>>24]},J.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,e&255,t>>>24,t>>>16&255,t>>>8&255,t&255]},K.fromBytes=function(e,t,n){return n?K.fromBytesLE(e,t):K.fromBytesBE(e,t)},K.fromBytesLE=function(e,t){return new K(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)},K.fromBytesBE=function(e,t){return new K(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)},typeof BigInt==`function`&&(K.fromBigInt=function(e,t){return q(Number(BigInt.asIntN(32,e)),Number(BigInt.asIntN(32,e>>BigInt(32))),t)},K.fromValue=function(e,t){return typeof e==`bigint`?K.fromBigInt(e,t):Mr(e,t)},J.toBigInt=function(){var e=BigInt(this.low>>>0);return BigInt(this.unsigned?this.high>>>0:this.high)<<BigInt(32)|e});var qr=K,Jr=g(kt(),1);Jr.util.Long=qr,Jr.configure();var Yr=-(1n<<63n),Xr=(1n<<63n)-1n;function Zr(e){return typeof e==`object`&&!!e&&typeof e.low==`number`&&typeof e.high==`number`&&typeof e.unsigned==`boolean`}function Qr(e){return e.unsigned?BigInt(e.high>>>0)<<32n|BigInt(e.low>>>0):BigInt(e.high)*4294967296n+BigInt(e.low>>>0)}function $r(e){if(e<Yr||e>Xr)throw RangeError(`BigInt value ${e} is outside the signed 64-bit integer range.`);return{low:Number(BigInt.asIntN(32,e)),high:Number(BigInt.asIntN(32,e>>32n)),unsigned:!1}}function ei(e,t){if(t instanceof Jr.Enum&&typeof e==`string`){if(!Object.prototype.hasOwnProperty.call(t.values,e))throw TypeError(`Unknown ${t.fullName} enum name: ${e}`);return t.values[e]}if(t===`int64`&&typeof e==`number`&&!Number.isSafeInteger(e))throw RangeError(`int64 value ${e} must be a safe integer number; use bigint for larger integers.`);if(t===`int32`&&typeof e==`number`&&(!Number.isInteger(e)||e<-2147483648||e>2147483647))throw RangeError(`int32 value ${e} must be an integer in the signed 32-bit range.`);return typeof e==`bigint`?$r(e):e instanceof Uint8Array?e:Array.isArray(e)?e.map(e=>ei(e,t)):e&&typeof e==`object`?Object.fromEntries(Object.entries(e).map(([e,n])=>{let r=t instanceof Jr.Type?t.fields[e]?.resolve():void 0;return[e,ei(n,r?.resolvedType??r?.type)]})):e}function ti(e){return Zr(e)?Qr(e):e instanceof Uint8Array?e:Array.isArray(e)?e.map(ti):e&&typeof e==`object`?Object.fromEntries(Object.entries(e).map(([e,t])=>[e,ti(t)])):e}function ni(e,t){return ti(e.toObject(e.decode(t),{enums:String,defaults:!0,arrays:!0,objects:!0}))}var ri=g(kt(),1),ii=-9223372036854775808n,ai=9223372036854775807n;function oi(e,t=`integer`){let n;if(typeof e==`number`){if(!Number.isSafeInteger(e))throw RangeError(`${t} must be a safe integer or bigint, got ${e}`);n=BigInt(e)}else if(typeof e==`bigint`)n=e;else throw TypeError(`${t} must be a safe integer or bigint`);if(n<ii||n>ai)throw RangeError(`${t} is outside signed int64 range: ${n}`);return n}var si=ii,ci=ai;function li(e,t){if(!e)throw Error(t)}function Y(e,t){if(!e)throw RangeError(t)}function ui(e,t){if(!e)throw Error(t)}function X(e){let t=oi(e);return t>=BigInt(-(2**53-1))&&t<=BigInt(2**53-1)?Number(t):t}function Z(e){return oi(e)}function di(e){return Z(e).toString()}function fi(e,t){let n=Z(e),r=Z(t);return n<r?-1:+(n>r)}function pi(e){return Z(e)===ii}function mi(e){return Z(e)===ai}function hi(e){return typeof e==`number`||typeof e==`bigint`}function gi(e,t){return Y(Q(t),`integer bounds require an integer expression offset`),Z(e)-t}function _i(e,t){return Q(t)?gi(e,t).toString():String(bi(e)-t)}function vi(e,t,n){if(!Q(n)){let r=bi(e)-n,i=bi(t)-n;return r<i?-1:+(r>i)}let r=gi(e,n),i=gi(t,n);return r<i?-1:+(r>i)}function yi(e,t){return pi(e)||mi(e)?e:(Y(Q(t),`integer constraints require an integer expression offset`),X(Z(e)-t))}function bi(e){if(e===void 0)return 0;let t=Z(e);return Y(t>=BigInt(-(2**53-1))&&t<=BigInt(2**53-1),`integer cannot be represented exactly as a JavaScript number: ${t}`),Number(t)}function xi(e){return structuredClone(e)}var Si=/* @__PURE__ */ new WeakMap;function Ci(e){let t=Si.get(e);return li(t,`CpModel has no internal proto`),t}function wi(e){if(typeof e==`bigint`)return oi(e);if(!Number.isFinite(e))throw TypeError(`expected finite numeric value, got ${e}`);return Number.isInteger(e)?oi(e):e}function Q(e){return typeof e==`bigint`}function Ti(e){return e===0||e===0n}function Ei(e){return e===1||e===1n}function Di(e){return e===-1||e===-1n}function Oi(e,t){if(Q(e)&&Q(t))return e+t;if(Q(e)||Q(t)){let n=Q(e)?e:t,r=Q(e)?t:e;return Y(n>=BigInt(-(2**53-1))&&n<=BigInt(2**53-1),`cannot combine an out-of-safe-range integer with a floating-point value`),Number(n)+r}return e+t}function ki(e,t){if(Q(e)&&Q(t))return e*t;if(Q(e)||Q(t)){let n=Q(e)?e:t,r=Q(e)?t:e;return Y(n>=BigInt(-(2**53-1))&&n<=BigInt(2**53-1),`cannot combine an out-of-safe-range integer with a floating-point value`),Number(n)*r}return e*t}function Ai(e){return-e}function ji(e){return typeof e==`bigint`?e<0n?-e:e:Math.abs(e)}function Mi(e){return typeof e==`bigint`?e<0n:e<0}function Ni(e){return typeof e==`number`?e:(Y(e>=BigInt(-(2**53-1))&&e<=BigInt(2**53-1),`integer cannot be represented exactly as a JavaScript number: ${e}`),Number(e))}function Pi(e,t){let n=$.from(t),r=n.offset;for(let[t,i]of n.terms){let n=e.solution?.[t];li(typeof n==`bigint`,`missing exact integer solution value for variable ${t}`),r=Oi(r,ki(i,n))}return r}function Fi(e,t){if(typeof t==`number`)return t!==0;if(t===!0||t===!1)return t;let n=t instanceof ea?t.variable.index:t.index,r=e.solution?.[n];li(typeof r==`bigint`,`missing exact integer solution value for literal ${n}`);let i=r!==0n;return t instanceof ea?!i:i}function Ii(e){if(typeof e==`number`){if(e===0)return!1;if(e===1)return!0;throw TypeError(`literal numeric constants must be 0 or 1`)}if(e===!0)return!0;if(e===!1)return!1;if(!(e instanceof Qi||e instanceof ea))throw TypeError(`literal must be a Boolean variable or its negation`);return e.index}function Li(e,t){return Array.from(t,t=>{let n=Ii(t);return n===!0?e.newConstant(1).index:n===!1?e.newConstant(0).index:(li(t instanceof Qi||t instanceof ea,`literal must be a Boolean variable or its negation`),Ri(e,t.model,`literal`),n)})}function Ri(e,t,n){if(e!==t)throw Error(`${n} belongs to a different CpModel`)}function zi(e,t,n){let r=Oi(e.get(t)??0n,n);Ti(r)?e.delete(t):e.set(t,r)}function Bi(e,t){return e===null?`var${t}`:Ci(e).variables?.[t]?.name||`var${t}`}function Vi(e,t){switch(e.kind){case`const`:return String(e.value);case`var`:return Bi(t,e.index);case`not`:return`not(${Bi(t,e.index)})`;case`mul`:{let n=Vi(e.value,t);return Ei(e.coeff)?n:Di(e.coeff)?`(-${n})`:`(${e.coeff} * ${n})`}case`sum`:return Ui(e.values,t);case`weighted`:return Wi(e.values,e.coeffs,t)}}function Hi(e,t){switch(e.kind){case`const`:return Q(e.value)?`IntConstant(${e.value})`:`FloatConstant(${e.value})`;case`var`:return t?.getIntVarFromProtoIndex(e.index)?.repr()??`var${e.index}`;case`not`:return`NotBooleanVariable(var_index=${e.index})`;case`mul`:{let n=Hi(e.value,t);return`${Q(e.coeff)?`IntAffine`:`FloatAffine`}(expr=${n}, coeff=${e.coeff}, offset=0)`}case`sum`:{let n=[],r=0n,i=0,a=!1;for(let o of e.values)o.kind===`const`?Q(o.value)&&!a?r+=o.value:(a=!0,i+=Ni(o.value)):n.push(Hi(o,t));return a?`SumArray(${n.join(`, `)}, float_offset=${i+Number(r)})`:r===0n?`SumArray(${n.join(`, `)})`:`SumArray(${n.join(`, `)}, int_offset=${r})`}case`weighted`:return`WeightedSum(${e.values.map(e=>Hi(e,t)).join(`, `)}, coeffs=[${e.coeffs.join(`, `)}])`}}function Ui(e,t){let n=[],r=0n;for(let t of e)t.kind===`const`?r=Oi(r,t.value):n.push(t);if((!Ti(r)||n.length===0)&&n.push({kind:`const`,value:r}),n.length===0)return`0`;let[i,...a]=n,o=Vi(i,t);for(let e of a)e.kind===`const`&&Mi(e.value)?o+=` - ${ji(e.value)}`:o+=` + ${Vi(e,t)}`;return n.length>1?`(${o})`:o}function Wi(e,t,n){let r=[];for(let i=0;i<e.length;i+=1){let a=t[i];if(Ti(a))continue;let o=e[i];if(o.kind===`const`){let e=ki(o.value,a);Ti(e)||r.push({sign:Mi(e)?-1:1,text:String(ji(e))});continue}let s=Mi(a)?-1:1,c=ji(a),l=Vi(o,n);r.push({sign:s,text:Ei(c)?l:`${c} * ${l}`})}if(r.length===0)return`0`;let[i,...a]=r,o=i.sign<0?`-${i.text}`:i.text;for(let e of a)o+=e.sign<0?` - ${e.text}`:` + ${e.text}`;return r.length>1||r[0].sign<0?`(${o})`:o}function Gi(e,t){t.kind===`sum`?e.push(...t.values):e.push(t)}function Ki(){throw TypeError(`native JavaScript operators are not supported for CP-SAT expressions; use the explicit high-level API methods`)}function qi(e,t){return t.length>0?[e,...t]:typeof e==`number`||typeof e==`bigint`||e instanceof Zi||e instanceof ea||e instanceof $?[e]:Array.from(e)}function Ji(e,t){return t.length>0?[e,...t]:typeof e==`number`||typeof e==`bigint`||e instanceof Zi||e instanceof ea||e instanceof $?[e]:Array.from(e)}function Yi(e,t){return t.length>0?[e,...t]:typeof e==`number`||typeof e==`boolean`||e instanceof Qi||e instanceof ea?[e]:Array.from(e)}var $=class e{constructor(e,t=/* @__PURE__ */ new Map,n=0n,r=null){this.model=e,this.terms=new Map(t),this.offset=n,this.display=r}static constant(t){let n=wi(t);return new e(null,/* @__PURE__ */ new Map,n,{kind:`const`,value:n})}static sum(e,...t){return aa(e,...t)}static weightedSum(e,t){return oa(e,t)}static term(e,t){return sa(e,t)}static affine(t,n,r){return e.from(t).times(n).plus(r)}static from(t){if(typeof t==`number`||typeof t==`bigint`)return e.constant(t);if(t instanceof e)return t;if(t instanceof ea)return t.expr();if(!(t instanceof Zi))throw TypeError(`expected integer variable or linear expression`);return t.expr()}plus(t,n=1n){let r=wi(n),i=Ei(r)?e.from(t):e.from(t).times(r),a=this.model??i.model;this.model&&i.model&&Ri(this.model,i.model,`linear expression`);let o=new Map(this.terms);for(let[e,t]of i.terms)zi(o,e,t);let s=[];return Gi(s,this.displayNodeForRendering()),Gi(s,i.displayNodeForRendering()),new e(a,o,Oi(this.offset,i.offset),{kind:`sum`,values:s})}minus(e){return this.plus(e,-1n)}times(t){let n=wi(t),r=/* @__PURE__ */ new Map;for(let[e,t]of this.terms)zi(r,e,ki(t,n));let i=n,a=this.displayNodeForRendering();return a.kind===`mul`&&(i=ki(i,a.coeff),a=a.value),new e(this.model,r,ki(this.offset,n),{kind:`mul`,coeff:i,value:a})}neg(){return this.times(-1n)}eq(e){return new Xi(this.minus(e),0,0)}ne(e){return hi(e)&&pi(e)?new Xi(this,X(-9223372036854775807n),ci):hi(e)&&mi(e)?new Xi(this,si,X(9223372036854775806n)):new Xi(this.minus(e),si,-1,[si,-1,1,ci])}le(e){return hi(e)?new Xi(this,si,e):new Xi(this.minus(e),si,0)}lt(e){if(hi(e)&&pi(e))throw RangeError(`integer expressions cannot be less than INT_MIN`);return new Xi(this.minus(e),si,-1)}ge(e){return hi(e)?new Xi(this,e,ci):new Xi(this.minus(e),0,ci)}gt(e){if(hi(e)&&mi(e))throw RangeError(`integer expressions cannot be greater than INT_MAX`);return new Xi(this.minus(e),1,ci)}toProto(){let e=[],t=[];for(let[n,r]of this.terms)e.push(n),Y(Q(r),`integer constraints require integer coefficients`),t.push(X(r));let n={vars:e,coeffs:t};return Ti(this.offset)||(Y(Q(this.offset),`integer constraints require an integer offset`),n.offset=X(this.offset)),n}toString(){if(this.display)return Vi(this.display,this.model);if(this.terms.size===1&&!Ti(this.offset)){let[[e,t]]=Array.from(this.terms),n=this.model?.getIntVarFromProtoIndex(e);if(n instanceof Qi&&t===Ai(this.offset))return`(${this.offset} * not(${n}))`}let e=[],t=!1;for(let[n,r]of this.terms){let i=this.model===null?`var${n}`:Ci(this.model).variables?.[n]?.name||`var${n}`;Ei(r)?e.push(i):Di(r)?(e.push(`-${i}`),t=!0):(e.push(`${r} * ${i}`),t=!0)}(!Ti(this.offset)||e.length===0)&&(e.push(String(this.offset)),t=!1);let[n,...r]=e,i=r.reduce((e,t)=>t.startsWith(`-`)?`${e} - ${t.slice(1)}`:`${e} + ${t}`,n);return e.length>1||t?`(${i})`:i}[Symbol.toPrimitive](e){return e===`string`?this.toString():Ki()}displayNodeForRendering(){if(this.display)return this.display;if(this.terms.size===0)return{kind:`const`,value:this.offset};let e=Array.from(this.terms,([e,t])=>{let n={kind:`var`,index:e};return Ei(t)?n:{kind:`mul`,coeff:t,value:n}});return Ti(this.offset)||e.push({kind:`const`,value:this.offset}),e.length===1?e[0]:{kind:`sum`,values:e}}hasFloatingPointTerms(){return!Q(this.offset)||Array.from(this.terms.values()).some(e=>!Q(e))}isInteger(){return!this.hasFloatingPointTerms()}repr(){if(this.terms.size===0)return Q(this.offset)?`IntConstant(${this.offset})`:`FloatConstant(${this.offset})`;if(this.terms.size===1){let[[e,t]]=Array.from(this.terms);if(Ei(t)&&Ti(this.offset))return this.model?.getIntVarFromProtoIndex(e)?.repr()??String(this);let n=this.model?.getIntVarFromProtoIndex(e)?.repr()??`var${e}`;return Q(t)&&Q(this.offset)?`IntAffine(expr=${n}, coeff=${t}, offset=${this.offset})`:`FloatAffine(expr=${n}, coeff=${t}, offset=${this.offset})`}if(this.display?.kind===`sum`)return Hi(this.display,this.model);let e=Array.from(this.terms,([e])=>this.model?.getIntVarFromProtoIndex(e)?.repr()??`var${e}`),t=Array.from(this.terms.values());return Ti(this.offset)&&t.every(Ei)?`SumArray(${e.join(`, `)})`:t.every(Q)&&Q(this.offset)?`IntWeightedSum([${e.join(`, `)}], [${t.join(`, `)}], ${this.offset})`:`FloatWeightedSum([${e.join(`, `)}], [${t.join(`, `)}], ${this.offset})`}toFloatObjective(e=!1){return{vars:Array.from(this.terms.keys()),coeffs:Array.from(this.terms.values(),Ni),offset:Ni(this.offset),maximize:e}}},Xi=class{constructor(e,t,n,r){this.expression=e,this.lowerBound=t,this.upperBound=n,this.domain=r}toString(){let e=new $(this.expression.model,this.expression.terms,0),t=String(e),n=_i(this.lowerBound,this.expression.offset),r=_i(this.upperBound,this.expression.offset);if(this.domain!==void 0){if(this.domain.length===4&&pi(this.domain[0])&&bi(this.domain[1])===-1&&bi(this.domain[2])===1&&mi(this.domain[3]))return`${t} != ${Ai(this.expression.offset)}`;let[e,n,r,i]=this.domain.map(e=>_i(e,this.expression.offset));return pi(this.domain[0])&&r!==void 0&&mi(this.domain[3])?`(${t}) not in [${(BigInt(n)+1n).toString()}, ${(BigInt(r)-1n).toString()}]`:`${t} in [${[e,n,r,i].filter(e=>e!==void 0).join(`, `)}]`}return pi(this.lowerBound)&&mi(this.upperBound)?`True (unbounded expr ${t})`:pi(this.lowerBound)?`${t} <= ${r}`:mi(this.upperBound)?`${t} >= ${n}`:vi(this.lowerBound,this.upperBound,this.expression.offset)===0?`${t} == ${n}`:`${n} <= ${t} <= ${r}`}[Symbol.toPrimitive](e){return e===`string`?this.toString():Ki()}},Zi=class{constructor(e,t,n=``){this.model=e,this.index=t}get name(){return Ci(this.model).variables?.[this.index]?.name??``}get modelProto(){return this.model.modelProto}expr(){return new $(this.model,/* @__PURE__ */ new Map([[this.index,1n]]),0n,{kind:`var`,index:this.index})}plus(e,t=1n){return this.expr().plus(e,t)}minus(e){return this.expr().minus(e)}times(e){return this.expr().times(e)}neg(){return this.expr().neg()}isInteger(){return!0}isBoolean(){return la(Ci(this.model).variables?.[this.index]?.domain??[])}negated(){if(!this.isBoolean())throw TypeError(`negated() is only supported for Boolean variables.`);return new ea(this)}toString(){let e=Ci(this.model).variables?.[this.index];if(e?.name)return e.name;let t=e?.domain??[];return t.length>=2&&di(t[0])===di(t[1])?di(t[0]):this.isBoolean()?`b${this.index}`:`x${this.index}`}[Symbol.toPrimitive](e){return e===`string`?this.toString():Ki()}debugString(){return`${String(this)}(${ca(Ci(this.model).variables?.[this.index]?.domain??[])})`}repr(){return this.debugString()}eq(e){return this.expr().eq(e)}ne(e){return this.expr().ne(e)}le(e){return this.expr().le(e)}lt(e){return this.expr().lt(e)}ge(e){return this.expr().ge(e)}gt(e){return this.expr().gt(e)}},Qi=class extends Zi{get literalIndex(){return this.index}not(){return this.negated()}};function $i(e){return e instanceof Qi||e instanceof ea}var ea=class{constructor(e){this.variable=e,this.model=e.model,this.index=-e.index-1,this.name=e.name?`not(${e.name})`:``}get modelProto(){return this.model.modelProto}not(){return this.variable}negated(){return this.variable}plus(e,t=1n){return this.expr().plus(e,t)}minus(e){return this.expr().minus(e)}times(e){return this.expr().times(e)}neg(){return this.expr().neg()}isInteger(){return!0}expr(){return new $(this.model,/* @__PURE__ */ new Map([[this.variable.index,-1n]]),1n,{kind:`not`,index:this.variable.index})}toString(){return`not(${this.variable})`}[Symbol.toPrimitive](e){return e===`string`?this.toString():Ki()}repr(){return`NotBooleanVariable(var_index=${this.variable.index})`}},ta=class{constructor(e,t,n=``,r,i,a,o){this.model=e,this.index=t,this.name=n,this.start=r,this.size=i,this.end=a,this.isPresent=o}get modelProto(){return this.model.modelProto}startExpr(){return this.start}sizeExpr(){return this.size}endExpr(){return this.end}presenceLiterals(){return this.isPresent===void 0?[]:[this.isPresent]}toString(){return this.name||`interval${this.index}`}repr(){let e=[`start = ${this.start}`,`size = ${this.size}`,`end = ${this.end}`];return this.isPresent!==void 0&&e.push(`is_present = ${this.isPresent}`),`${this}(${e.join(`, `)})`}},na=class{constructor(e,t){this.model=e,this.index=t}get name(){return Ci(this.model).constraints?.[this.index]?.name??``}withName(e){let t=Ci(this.model).constraints?.[this.index];return li(t,`constraint no longer exists in model`),t.name=e,this}onlyEnforceIf(e,...t){let n=Yi(e,t),r=Ci(this.model).constraints?.[this.index];return li(r,`constraint no longer exists in model`),r.enforcementLiteral=[...r.enforcementLiteral??[],...Li(this.model,n)],this}};function ra(e){let t=0n,n=[];for(let r of e)typeof r==`number`||typeof r==`bigint`?t=Oi(t,wi(r)):n.push(r);return n.length===0?$.constant(t):Ti(t)&&n.length===1?n[0]:null}function ia(e,t,n){let r=null,i=/* @__PURE__ */ new Map,a=0n,o=0;for(let n of e){let e=wi(t?.(o)??1n),s=$.from(n);r&&s.model&&Ri(r,s.model,`linear expression`),r??=s.model;for(let[t,n]of s.terms)zi(i,t,ki(n,e));a=Oi(a,ki(s.offset,e)),o+=1}return new $(r,i,a,n??null)}function aa(e,...t){let n=Ji(e,t),r=ra(n);return r===null?ia(n,void 0,{kind:`sum`,values:n.map(e=>$.from(e).displayNodeForRendering())}):r}function oa(e,t){let n=Array.from(e),r=Array.from(t);Y(n.length===r.length,`weightedSum requires the same number of expressions and coefficients`);let i=ia(n,e=>r[e],{kind:`weighted`,values:n.map(e=>$.from(e).displayNodeForRendering()),coeffs:r}),a=ra([i]);return a===null?i:a}function sa(e,t){return e.times(t)}function ca(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1];if(i===void 0)break;let a=di(r),o=di(i);t.push(a===o?a:`${a}..${o}`)}return t.join(`, `)}function la(e){return e.length===2&&fi(e[0],0)>=0&&fi(e[1],1)<=0}var ua=class e{constructor(e){this.constantIndexes=/* @__PURE__ */ new Map,this.intVariables=/* @__PURE__ */ new Map,this.model=e===void 0?{variables:[],constraints:[]}:xi(e),Si.set(this,this.model);for(let[e,t]of(this.model.variables??[]).entries()){let n=t.domain??[];n.length===2&&fi(n[0],n[1])===0&&this.constantIndexes.set(Z(n[0]),e)}}get name(){return this.model.name??``}set name(e){this.model.name=e}get modelProto(){return xi(this.model)}clone(){return new e(this.model)}removeAllNames(){this.model.name=``;for(let e of this.model.variables??[])e.name=``;for(let e of this.model.constraints??[])e.name=``}newIntVar(e,t,n=``){let r=this.model.variables?.length??0,i=[X(e),X(t)];this.model.variables?.push(fi(i[0],i[1])<=0?{name:n,domain:i}:{name:n});let a=new Zi(this,r,n);return this.intVariables.set(r,a),a}newIntVarFromDomain(e,t=``){let n=this.model.variables?.length??0,r=[...e.flatIntervals];this.model.variables?.push({name:t,domain:r});let i=new Zi(this,n,t);return this.intVariables.set(n,i),i}newBoolVar(e=``){let t=this.model.variables?.length??0;this.model.variables?.push({name:e,domain:[0,1]});let n=new Qi(this,t,e);return this.intVariables.set(t,n),n}newConstant(e,t=``){return t?this.newIntVar(e,e,t):this.getIntVarFromProtoIndex(this.constantIndex(e))}getIntVarFromProtoIndex(e){Y(Number.isInteger(e),`variable index must be an integer, got ${e}`);let t=this.model.variables??[];Y(e>=0&&e<t.length,`getIntVarFromProtoIndex: out of bound index ${e}`);let n=this.intVariables.get(e);if(n!==void 0)return n;let r=new Zi(this,e,t[e]?.name??``);return this.intVariables.set(e,r),r}getBoolVarFromProtoIndex(e){let t=this.getIntVarFromProtoIndex(e);if(!t.isBoolean())throw TypeError(`getBoolVarFromProtoIndex: index ${e} is not Boolean`);if(t instanceof Qi)return t;let n=new Qi(this,e);return this.intVariables.set(e,n),n}getIntervalVarFromProtoIndex(e){Y(Number.isInteger(e),`interval index must be an integer, got ${e}`);let t=this.model.constraints??[];Y(e>=0&&e<t.length,`getIntervalVarFromProtoIndex: out of bound index ${e}`);let n=t[e];if(n?.interval===void 0)throw TypeError(`getIntervalVarFromProtoIndex: index ${e} is not an interval`);let r=n.interval;return new ta(this,e,n.name??``,this.expressionFromProto(r.start),this.expressionFromProto(r.size),this.expressionFromProto(r.end),n.enforcementLiteral?.[0]===void 0?void 0:this.literalFromProtoIndex(n.enforcementLiteral[0]))}constantIndex(e){let t=oi(e),n=this.constantIndexes.get(t);if(n!==void 0)return n;let r=this.model.variables?.length??0,i=X(t),a=[i,i];return this.model.variables?.push({domain:a}),this.constantIndexes.set(t,r),r}add(e){return e===!0?this.addBoolOr([!0]):e===!1?this.addBoolOr([]):this.addLinearConstraint(e.expression,Z(e.lowerBound),Z(e.upperBound),e.domain)}addLinearConstraint(e,t,n,r){let i=$.from(e);this.checkExpressionModel(i),Y(i.isInteger(),`linear constraints require integer expressions`);let a=X(t),o=X(n);if(i.terms.size===0&&r===void 0){let e=i.offset;return e>=Z(a)&&e<=Z(o)?this.pushConstraint({boolAnd:{literals:[]}}):this.pushConstraint({boolOr:{literals:[]}})}let s=i.toProto(),c=(r??[a,o]).map(e=>yi(e,i.offset));return this.pushConstraint({linear:{vars:s.vars,coeffs:s.coeffs,domain:c}})}addEquality(e,t){return this.add($.from(e).eq(t))}addAllDifferent(e,...t){return this.pushConstraint({allDiff:{exprs:this.expressionProtos(qi(e,t))}})}addElement(e,t,n){let r=Array.from(t);if(Y(r.length>0,`addElement requires at least one expression`),typeof e==`number`||typeof e==`bigint`){let t=oi(e,`element index`);return Y(t>=0n&&t<BigInt(r.length),`element index ${e} is out of range`),this.add($.from(n).eq(r[Number(t)]))}return this.pushConstraint({element:{linearIndex:this.expressionProto(e),exprs:this.expressionProtos(r),linearTarget:this.expressionProto(n)}})}addAllowedAssignments(e,t){let n=this.expressionProtos(e);Y(n.length>0,`addAllowedAssignments requires at least one expression`);let r=Array.from(t,e=>Array.from(e));for(let e of r)Y(e.length===n.length,`tuple arity does not match expression count`);return this.pushConstraint({table:{exprs:n,values:r.flat().map(X)}})}addForbiddenAssignments(e,t){let n=this.addAllowedAssignments(e,t),r=this.model.constraints?.[n.index];return li(r?.table,`table constraint was not created`),r.table.negated=!0,n}addAutomaton(e,t,n,r){let i=this.expressionProtos(e),a=Array.from(n,X),o=Array.from(r);Y(i.length>0,`addAutomaton requires at least one expression`),Y(a.length>0,`addAutomaton requires at least one final state`),Y(o.length>0,`addAutomaton requires at least one transition`);let s=[],c=[],l=[];for(let e of o){Y(e.length===3,`automaton transitions must contain tail, label, and head`);let[t,n,r]=e;s.push(X(t)),c.push(X(n)),l.push(X(r))}return this.pushConstraint({automaton:{exprs:i,startingState:X(t),finalStates:a,transitionTail:s,transitionLabel:c,transitionHead:l}})}addCircuit(e){let t=Array.from(e);Y(t.length>0,`addCircuit requires at least one arc`);let n=[],r=[],i=[];for(let[e,a,o]of t){let[t]=Li(this,[o]);n.push(e),r.push(a),i.push(t)}return this.pushConstraint({circuit:{tails:n,heads:r,literals:i}})}addMultipleCircuit(e){let t=Array.from(e);Y(t.length>0,`addMultipleCircuit requires at least one arc`);let n=[],r=[],i=[];for(let[e,a,o]of t){let[t]=Li(this,[o]);n.push(e),r.push(a),i.push(t)}return this.pushConstraint({routes:{tails:n,heads:r,literals:i}})}addInverse(e,t){return this.pushConstraint({inverse:{fDirect:this.variableIndexes(e),fInverse:this.variableIndexes(t)}})}addMaxEquality(e,t,...n){return this.pushConstraint({linMax:{target:this.expressionProto(e),exprs:this.expressionProtos(qi(t,n))}})}addMinEquality(e,t,...n){let r=qi(t,n);return this.pushConstraint({linMax:{target:$.from(e).neg().toProto(),exprs:r.map(e=>$.from(e).neg().toProto())}})}addAbsEquality(e,t){let n=$.from(t);return this.addMaxEquality(e,[n,n.neg()])}addDivisionEquality(e,t,n){return this.pushConstraint({intDiv:{target:this.expressionProto(e),exprs:[this.expressionProto(t),this.expressionProto(n)]}})}addModuloEquality(e,t,n){return this.pushConstraint({intMod:{target:this.expressionProto(e),exprs:[this.expressionProto(t),this.expressionProto(n)]}})}addMultiplicationEquality(e,t,...n){return this.pushConstraint({intProd:{target:this.expressionProto(e),exprs:this.expressionProtos(qi(t,n))}})}addImplication(e,t){return this.pushConstraint({enforcementLiteral:Li(this,[e]),boolAnd:{literals:Li(this,[t])}})}addBoolOr(e,...t){return this.pushConstraint({boolOr:{literals:Li(this,Yi(e,t))}})}addAtLeastOne(e,...t){return this.addBoolOr(e,...t)}addBoolAnd(e){return this.pushConstraint({boolAnd:{literals:Li(this,e)}})}addBoolXor(e){return this.pushConstraint({boolXor:{literals:Li(this,e)}})}addAtMostOne(e){return this.pushConstraint({atMostOne:{literals:Li(this,e)}})}addExactlyOne(e){return this.pushConstraint({exactlyOne:{literals:Li(this,e)}})}addMapDomain(e,t,n=0n){Ri(this,e.model,`map domain variable`);let r=oi(n);for(let[n,i]of Array.from(t).entries()){Ri(this,i.model,`map domain literal`);let t=r+BigInt(n);this.pushConstraint({enforcementLiteral:[i.index],linear:{vars:[e.index],coeffs:[1],domain:[X(t),X(t)]}}),this.pushConstraint({enforcementLiteral:[i.negated().index],linear:{vars:[e.index],coeffs:[1],domain:[si,X(t-1n),X(t+1n),ci]}})}}newIntervalVar(e,t,n,r=``){return this.pushInterval({start:e,size:t,end:n,name:r})}newFixedSizeIntervalVar(e,t,n=``){return this.pushInterval({start:e,size:t,end:$.from(e).plus(t),name:n})}newOptionalFixedSizeIntervalVar(e,t,n,r=``){return this.newOptionalIntervalVar(e,t,$.from(e).plus(t),n,r)}newOptionalIntervalVar(e,t,n,r,i=``){if(!(r instanceof Qi||r instanceof ea||typeof r==`boolean`||r===0||r===1))throw TypeError(`optional interval presence literal must be Boolean`);if(this.hasBooleanExpressionTerm(e)||this.hasBooleanExpressionTerm(t)||this.hasBooleanExpressionTerm(n))throw TypeError(`optional interval start, size, and end must be integer expressions`);return this.pushInterval({start:e,size:t,end:n,isPresent:r,name:i})}addNoOverlap(e){return this.pushConstraint({noOverlap:{intervals:this.intervalIndexes(e)}})}addNoOverlap2D(e,t){return this.pushConstraint({noOverlap2d:{xIntervals:this.intervalIndexes(e),yIntervals:this.intervalIndexes(t)}})}addCumulative(e,t,n){return this.pushConstraint({cumulative:{intervals:this.intervalIndexes(e),demands:this.expressionProtos(t),capacity:this.expressionProto(n)}})}addReservoirConstraint(e,t,n,r,i){let a=oi(n),o=oi(r);Y(o>=a,`reservoir max level must be greater than or equal to min level`),Y(o>=0n,`reservoir max level must be nonnegative`),Y(a<=0n,`reservoir min level must be nonpositive`);let s=Array.from(e),c=Array.from(t),l=i===void 0?void 0:Array.from(i);return Y(s.length===c.length,`reservoir times and level changes must have the same length`),Y(l===void 0||l.length===s.length,`reservoir active literals and times must have the same length`),this.pushConstraint({reservoir:{timeExprs:this.expressionProtos(s),levelChanges:this.expressionProtos(c),minLevel:X(a),maxLevel:X(o),activeLiterals:l===void 0?void 0:Li(this,l)}})}addDecisionStrategy(e,t,n){var r;(r=this.model).searchStrategy??(r.searchStrategy=[]),this.model.searchStrategy.push({exprs:this.expressionProtos(e),variableSelectionStrategy:t,domainReductionStrategy:n})}addHint(e,t){var n;let r=typeof t==`boolean`?t?1n:0n:oi(t),i=e instanceof ea?e.variable:e,a=e instanceof ea?1n-r:r;Ri(this,i.model,`hint variable`),(n=this.model).solutionHint??(n.solutionHint={vars:[],values:[]}),this.model.solutionHint.vars?.push(i.index),this.model.solutionHint.values?.push(X(a))}addAssumption(e){var t;let n=Ii(e);li(typeof n==`number`,`assumptions require variable literals`),li(e instanceof Qi||e instanceof ea,`assumptions require variable literals`),Ri(this,e.model,`assumption literal`),(t=this.model).assumptions??(t.assumptions=[]),this.model.assumptions.push(n)}addAssumptions(e){for(let t of e)this.addAssumption(t)}clearAssumptions(){this.model.assumptions=[]}minimize(e){let t=$.from(e);if(this.checkExpressionModel(t),t.hasFloatingPointTerms()){this.model.objective=void 0,this.model.floatingPointObjective=t.toFloatObjective(!1);return}let n=t.toProto();this.model.floatingPointObjective=void 0,this.model.objective={vars:n.vars,coeffs:n.coeffs,offset:n.offset===void 0?void 0:Ni(Z(n.offset))}}maximize(e){let t=$.from(e);if(this.checkExpressionModel(t),t.hasFloatingPointTerms()){this.model.objective=void 0,this.model.floatingPointObjective=t.toFloatObjective(!0);return}let n=t.neg();this.checkExpressionModel(n);let r=n.toProto();this.model.floatingPointObjective=void 0,this.model.objective={vars:r.vars,coeffs:r.coeffs,offset:r.offset===void 0?void 0:Ni(Z(r.offset)),scalingFactor:-1}}hasObjective(){return this.model.objective!==void 0||this.model.floatingPointObjective!==void 0}modelStats(){return JSON.stringify({variables:this.model.variables?.length??0,constraints:this.model.constraints?.length??0,hasObjective:this.hasObjective()})}async validate(){let e=await Pa.createModel(this.model),t=await Pa.validate(e);return t.ok?``:t.message}pushInterval(e){let t={name:e.name,interval:{start:this.expressionProto(e.start),size:this.expressionProto(e.size),end:this.expressionProto(e.end)}};e.isPresent!==void 0&&(t.enforcementLiteral=Li(this,[e.isPresent]));let n=this.model.constraints?.length??0;return this.model.constraints?.push(t),new ta(this,n,e.name,e.start,e.size,e.end,e.isPresent)}pushConstraint(e){let t=this.model.constraints?.length??0;return this.model.constraints?.push(e),new na(this,t)}checkExpressionModel(e){e.model&&Ri(this,e.model,`linear expression`)}expressionProto(e){let t=$.from(e);return this.checkExpressionModel(t),t.toProto()}expressionFromProto(e){if(e===void 0)return 0n;let t=/* @__PURE__ */ new Map,n=e.vars??[],r=e.coeffs??[];for(let e=0;e<n.length;e+=1)zi(t,n[e],Z(r[e]));return new $(this,t,Z(e.offset??0))}literalFromProtoIndex(e){return e>=0?this.getBoolVarFromProtoIndex(e):this.getBoolVarFromProtoIndex(-e-1).negated()}expressionProtos(e){return Array.from(e,e=>this.expressionProto(e))}variableIndexes(e){return Array.from(e,e=>(Ri(this,e.model,`variable`),e.index))}intervalIndexes(e){return Array.from(e,e=>{if(!(e instanceof ta))throw TypeError(`expected interval variable`);return Ri(this,e.model,`interval`),e.index})}hasBooleanExpressionTerm(e){if($i(e))return!0;let t=$.from(e);return this.checkExpressionModel(t),Array.from(t.terms.keys()).some(e=>la(this.model.variables?.[e]?.domain??[]))}},da=class{constructor(e,t,n){this.model=e,this.variableCount=n,this.answer=t===null?null:xi(t),this.status=this.answer?.status}get response(){return this.answer===null?null:xi(this.answer)}get hasSolution(){return this.status===4||this.status===2||this.status===`OPTIMAL`||this.status===`FEASIBLE`}value(e){let t=$.from(e);if(t.model!==null&&t.model!==this.model)throw Error(`Expression belongs to a different CpModel.`);if([...t.terms.keys()].some(e=>e>=this.variableCount))throw Error(`Expression uses a variable added after this solve.`);return Pi(this.requireSolution(),e)}booleanValue(e){if(e instanceof Zi&&e.model!==this.model||e instanceof ea&&e.variable.model!==this.model)throw Error(`Literal belongs to a different CpModel.`);if((e instanceof ea?e.variable.index:e instanceof Zi?e.index:-1)>=this.variableCount)throw Error(`Literal was added after this solve.`);return Fi(this.requireSolution(),e)}get objectiveValue(){return this.hasSolution?this.answer?.objectiveValue??null:null}get bestObjectiveBound(){return this.answer?.bestObjectiveBound??null}requireSolution(){return ui(this.hasSolution&&this.answer!==null,`solve result has no solution`),this.answer}},fa=typeof window<`u`&&typeof document<`u`;async function pa(){return new Worker(new URL(
/* @vite-ignore */
new URL(`worker-bdVor7Rt.js`,import.meta.url).href,``+import.meta.url),{type:`module`,name:`ortools-executor-cp-sat`})}var ma=new Pn,ha=new ur(Ut,pa,!0),ga=()=>{};function _a(e=`auto`){return va(hr(e))}function va(e){switch(e.type){case`direct`:return ma;case`worker`:return ha;case`server`:return new sr(Ut,e);case`cloud`:return new Hn(`cp-sat`,{test:e.test})}}var ya;function ba(){let e={cp_model:dr,sat_parameters:fr},t=ri.parse(e.cp_model).root,n=ri.parse(e.sat_parameters).root;return{schemas:e,modelType:t.lookupType(`operations_research.sat.CpModelProto`),responseType:t.lookupType(`operations_research.sat.CpSolverResponse`),parametersType:n.lookupType(`operations_research.sat.SatParameters`)}}function xa(){return ya??=ba()}async function Sa(){return xa().schemas}function Ca(e,t){let n=Object.keys(t).find(t=>e.fields[t]===void 0);if(n)throw Error(`CpSat.solve: unknown solver parameter "${n}".`);let r=ei(t,e),i=e.verify(r);if(i)throw Error(`CpSat.solve: ${i}`);let a=e.create(r);return e.encode(a).finish()}function wa(e,t){return ni(e,t)}function Ta(e,t){if(t.type===`solution`){let n=t.response;return{type:`solution`,response:wa(e,n),bytes:n}}return t}function Ea(e){return{...e,constraints:e.constraints?.map(e=>{if(!e.noOverlap2d)return e;let t={...e,noOverlap_2d:e.noOverlap2d};return delete t.noOverlap2d,t})}}async function Da(e){let{modelType:t}=xa(),n=ei(Ea(e),t),r=t.verify(n);if(r)throw Error(`CpSat.createModel: ${r}`);let i=t.create(n);return t.encode(i).finish()}async function Oa(e){let{modelType:t}=xa(),n=t.decode(e),r=t.toObject(n,{enums:String,longs:Number,defaults:!0,arrays:!0,objects:!0});return JSON.stringify({name:r.name??``,variables:r.variables?.length??0,constraints:r.constraints?.length??0,hasObjective:r.objective!=null||r.floatingPointObjective!=null})}async function ka(e,t){let n=t.onEvent?t.eventMask??{solution:!0,bestBound:!0,log:!0}:{},r=t.executor,i=await Sr(r,{type:`solve`,model:e,parameters:t.solverParametersBytes,callbacks:{solution:!!n.solution,bestBound:!!n.bestBound,log:!!n.log}},{showCloudNotice:!(r instanceof sr),resources:t.resources,onEvent:async e=>{let n=Ta(t.solverType,e);await t.onEvent?.(n)},signal:t.signal});if(i.type!==`solve`)throw Error(`CP-SAT executor returned the wrong solve payload.`);return i.response}function Aa(e){let t=e.numWorkers;return t!==void 0&&t>0?{threads:t}:void 0}async function ja(e,t={}){let{executor:n,onEvent:r,eventMask:i,signal:a,...o}=t;if(o.numSearchWorkers!==void 0)throw Error(`numSearchWorkers is not supported; use numWorkers.`);let{parametersType:s,responseType:c}=xa(),l=Ca(s,o),u=await ka(e,{executor:_a(n),solverParametersBytes:l,solverType:c,onEvent:r,eventMask:i,resources:Aa(o),signal:a});return{bytes:u,response:u.length>0?wa(c,u):null}}async function Ma(e,t={}){if(e instanceof Uint8Array)throw TypeError(`CpSat.solve() accepts a CpModel; use CpSat.solveProto() for serialized models.`);let{solutionCallback:n,onEvent:r,eventMask:i,...a}=t,o=e.modelProto;return new da(e,(await ja(await Da(o),{...a,eventMask:n?{...i,solution:!0}:i,onEvent:n||r?async e=>{e.type===`solution`&&n?._run(e.response),await r?.(e)}:void 0})).response,o.variables?.length??0)}async function Na(e,t={}){let n=await Sr(_a(t.executor),{type:`validate`,model:e},{onEvent:ga,signal:t.signal});if(n.type!==`validate`)throw Error(`CP-SAT executor returned the wrong validate payload.`);return{ok:n.ok,message:n.message}}var Pa={solve:Ma,solveProto:ja,validate:Na,modelStats:Oa,getSchemas:Sa,createModel:Da};
/*! Bundled license information:

long/umd/index.js:
long/index.js:
(**
* @license
* Copyright 2009 The Closure Library Authors
* Copyright 2020 Daniel Wirtz / The long.js Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* SPDX-License-Identifier: Apache-2.0
*)
*/
fa&&(window.CpSat=Pa),yr(!1);const Fa=[],Ia=self.fetch.bind(self);self.fetch=async(e,t)=>{let n=typeof e==`string`?e:e instanceof URL?e.href:e.url,r=n.split(`?`)[0].split(`/`).pop()??n;if(!r.endsWith(`.wasm`))return Ia(e,t);let i=performance.now(),a=await Ia(e,t),o=await a.arrayBuffer(),s=a.headers.get(`content-length`);return Fa.push({name:r,bytes:o.byteLength,ms:performance.now()-i,encoding:a.headers.get(`content-encoding`),contentLength:s===null?null:Number(s)}),new Response(o,{status:a.status,statusText:a.statusText,headers:a.headers})};const La=[],Ra=WebAssembly.Memory,za=function(e){let t=new Ra(e);return La.push(t),t};za.prototype=Ra.prototype,WebAssembly.Memory=za;function Ba(){return La.length===0?null:La.reduce((e,t)=>e+t.buffer.byteLength,0)}function Va(e){return typeof e==`number`?e:typeof e==`bigint`?Number(e):null}function Ha(e){self.postMessage(e)}let Ua=null;self.onmessage=async e=>{let t=e.data;try{if(t.type===`init`){Ua=t.pool;let e=typeof WebAssembly.promising==`function`;t.forceAsyncify&&e&&Object.defineProperty(WebAssembly,"promising",{value:void 0,configurable:!0,writable:!0}),Ua===`none`&&Object.defineProperty(self.navigator,"hardwareConcurrency",{value:0,configurable:!0}),Ha({id:t.id,type:`ready`,isolated:self.crossOriginIsolated===!0,sab:typeof SharedArrayBuffer==`function`,jspi:e,flavor:typeof WebAssembly.promising==`function`?`jspi`:`asyncify`,poolThreads:self.navigator.hardwareConcurrency,pool:Ua});return}if(t.type===`tiny`){let e=new ua,n=e.newIntVar(0,10,`x`);e.addLinearConstraint(n.times(3),0,20),e.maximize(n);let r=performance.now(),i=await Pa.solve(e,{numWorkers:1,randomSeed:1,maxTimeInSeconds:5,executor:`direct`}),a=performance.now()-r;Ha({id:t.id,type:`tiny`,ms:a,status:String(i.status),value:i.hasSolution?Number(i.value(n)):null,downloads:[...Fa]});return}if(t.type===`solve`){let e=performance.now(),n=await Pa.solveProto(t.bytes,{...t.params,executor:`direct`}),r=performance.now()-e,i=n.response??null,a=Array.isArray(i?.solution)?i.solution.map(e=>Number(e)):[];Ha({id:t.id,type:`solved`,ms:r,status:String(i?.status??`NO_RESPONSE`),objective:Va(i?.objectiveValue),bound:Va(i?.bestObjectiveBound),solverWallS:Va(i?.wallTime),solution:a});return}if(t.type===`heap`){Ha({id:t.id,type:`heap`,bytes:Ba()});return}}catch(e){Ha({id:t.id,type:`error`,message:e instanceof Error?e.message:String(e)})}};