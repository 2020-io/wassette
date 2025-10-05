export function instantiate(getCoreModule, imports, instantiateCore = WebAssembly.instantiate) {
  
  let curResourceBorrows = [];
  
  let dv = new DataView(new ArrayBuffer());
  const dataView = mem => dv.buffer === mem.buffer ? dv : dv = new DataView(mem.buffer);
  
  const emptyFunc = () => {};
  
  function finalizationRegistryCreate (unregister) {
    if (typeof FinalizationRegistry === 'undefined') {
      return { unregister () {} };
    }
    return new FinalizationRegistry(unregister);
  }
  
  function getErrorPayload(e) {
    if (e && hasOwnProperty.call(e, 'payload')) return e.payload;
    if (e instanceof Error) throw e;
    return e;
  }
  
  const handleTables = [];
  
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  
  const T_FLAG = 1 << 30;
  
  function rscTableCreateBorrow (table, rep) {
    const free = table[0] & ~T_FLAG;
    if (free === 0) {
      table.push(scopeId);
      table.push(rep);
      return (table.length >> 1) - 1;
    }
    table[0] = table[free];
    table[free << 1] = scopeId;
    table[(free << 1) + 1] = rep;
    return free;
  }
  
  function rscTableCreateOwn (table, rep) {
    const free = table[0] & ~T_FLAG;
    if (free === 0) {
      table.push(0);
      table.push(rep | T_FLAG);
      return (table.length >> 1) - 1;
    }
    table[0] = table[free << 1];
    table[free << 1] = 0;
    table[(free << 1) + 1] = rep | T_FLAG;
    return free;
  }
  
  function rscTableRemove (table, handle) {
    const scope = table[handle << 1];
    const val = table[(handle << 1) + 1];
    const own = (val & T_FLAG) !== 0;
    const rep = val & ~T_FLAG;
    if (val === 0 || (scope & T_FLAG) !== 0) throw new TypeError('Invalid handle');
    table[handle << 1] = table[0] | T_FLAG;
    table[0] = handle | T_FLAG;
    return { rep, scope, own };
  }
  let resourceCallBorrows = [];
  function resourceTransferBorrowValidLifting(handle, fromTid, toTid) {
    const fromTable = handleTables[fromTid];
    const isOwn = (fromTable[(handle << 1) + 1] & T_FLAG) !== 0;
    const rep = isOwn ? fromTable[(handle << 1) + 1] & ~T_FLAG : rscTableRemove(fromTable, handle).rep;
    if (definedResourceTables[toTid]) return rep;
    const toTable = handleTables[toTid] || (handleTables[toTid] = [T_FLAG, 0]);
    return rscTableCreateBorrow(toTable, rep);
  }
  
  function resourceTransferOwn(handle, fromTid, toTid) {
    const { rep } = rscTableRemove(handleTables[fromTid], handle);
    const toTable = handleTables[toTid] || (handleTables[toTid] = [T_FLAG, 0]);
    return rscTableCreateOwn(toTable, rep);
  }
  
  let scopeId = 0;
  
  const symbolCabiDispose = Symbol.for('cabiDispose');
  
  const symbolRscHandle = Symbol('handle');
  
  const symbolRscRep = Symbol.for('cabiRep');
  
  const symbolDispose = Symbol.dispose || Symbol.for('dispose');
  
  const toUint64 = val => BigInt.asUintN(64, BigInt(val));
  
  function toUint32(val) {
    return val >>> 0;
  }
  
  const utf8Decoder = new TextDecoder();
  
  const utf8Encoder = new TextEncoder();
  
  let utf8EncodedLen = 0;
  function utf8Encode(s, realloc, memory) {
    if (typeof s !== 'string') throw new TypeError('expected a string');
    if (s.length === 0) {
      utf8EncodedLen = 0;
      return 1;
    }
    let buf = utf8Encoder.encode(s);
    let ptr = realloc(0, 0, 1, buf.length);
    new Uint8Array(memory.buffer).set(buf, ptr);
    utf8EncodedLen = buf.length;
    return ptr;
  }
  
  const definedResourceTables = [,,,,,,,,,,,,,,,,,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,,true,,];
  
  const module0 = getCoreModule('ruby.component.core.wasm');
  const module1 = getCoreModule('ruby.component.core2.wasm');
  const module2 = getCoreModule('ruby.component.core3.wasm');
  const module3 = getCoreModule('ruby.component.core4.wasm');
  const module4 = getCoreModule('ruby.component.core5.wasm');
  const module5 = getCoreModule('ruby.component.core6.wasm');
  const module6 = getCoreModule('ruby.component.core7.wasm');
  const module7 = getCoreModule('ruby.component.core8.wasm');
  const module8 = getCoreModule('ruby.component.core9.wasm');
  const module9 = getCoreModule('ruby.component.core10.wasm');
  const module10 = getCoreModule('ruby.component.core11.wasm');
  const module11 = getCoreModule('ruby.component.core12.wasm');
  const module12 = getCoreModule('ruby.component.core13.wasm');
  const module13 = getCoreModule('ruby.component.core14.wasm');
  const module14 = getCoreModule('ruby.component.core15.wasm');
  const module15 = getCoreModule('ruby.component.core16.wasm');
  const module16 = getCoreModule('ruby.component.core17.wasm');
  const module17 = getCoreModule('ruby.component.core18.wasm');
  const module18 = getCoreModule('ruby.component.core19.wasm');
  const module19 = getCoreModule('ruby.component.core20.wasm');
  const module20 = getCoreModule('ruby.component.core21.wasm');
  const module21 = getCoreModule('ruby.component.core22.wasm');
  const module22 = getCoreModule('ruby.component.core23.wasm');
  const module23 = getCoreModule('ruby.component.core24.wasm');
  const module24 = getCoreModule('ruby.component.core25.wasm');
  const module25 = getCoreModule('ruby.component.core26.wasm');
  const module26 = getCoreModule('ruby.component.core27.wasm');
  const module27 = getCoreModule('ruby.component.core28.wasm');
  const module28 = getCoreModule('ruby.component.core29.wasm');
  const module29 = getCoreModule('ruby.component.core30.wasm');
  const module30 = getCoreModule('ruby.component.core31.wasm');
  const module31 = getCoreModule('ruby.component.core32.wasm');
  const module32 = getCoreModule('ruby.component.core33.wasm');
  const module33 = getCoreModule('ruby.component.core34.wasm');
  const module34 = getCoreModule('ruby.component.core35.wasm');
  const module35 = getCoreModule('ruby.component.core36.wasm');
  const module36 = getCoreModule('ruby.component.core37.wasm');
  const module37 = getCoreModule('ruby.component.core38.wasm');
  const module38 = getCoreModule('ruby.component.core39.wasm');
  const module39 = getCoreModule('ruby.component.core40.wasm');
  const module40 = getCoreModule('ruby.component.core41.wasm');
  const module41 = getCoreModule('ruby.component.core42.wasm');
  const module42 = getCoreModule('ruby.component.core43.wasm');
  const module43 = getCoreModule('ruby.component.core44.wasm');
  const module44 = getCoreModule('ruby.component.core45.wasm');
  const module45 = getCoreModule('ruby.component.core46.wasm');
  const module46 = getCoreModule('ruby.component.core47.wasm');
  const module47 = getCoreModule('ruby.component.core48.wasm');
  const module48 = getCoreModule('ruby.component.core49.wasm');
  const module49 = getCoreModule('ruby.component.core50.wasm');
  const module50 = getCoreModule('ruby.component.core51.wasm');
  const module51 = getCoreModule('ruby.component.core52.wasm');
  const module52 = getCoreModule('ruby.component.core53.wasm');
  const module53 = getCoreModule('ruby.component.core54.wasm');
  const module54 = getCoreModule('ruby.component.core55.wasm');
  const module55 = getCoreModule('ruby.component.core56.wasm');
  const module56 = getCoreModule('ruby.component.core57.wasm');
  const module57 = getCoreModule('ruby.component.core58.wasm');
  const module58 = getCoreModule('ruby.component.core59.wasm');
  const module59 = getCoreModule('ruby.component.core60.wasm');
  const module60 = getCoreModule('ruby.component.core61.wasm');
  const module61 = getCoreModule('ruby.component.core62.wasm');
  const module62 = getCoreModule('ruby.component.core63.wasm');
  const module63 = getCoreModule('ruby.component.core64.wasm');
  const module64 = getCoreModule('ruby.component.core65.wasm');
  const module65 = getCoreModule('ruby.component.core66.wasm');
  const module66 = getCoreModule('ruby.component.core67.wasm');
  const module67 = getCoreModule('ruby.component.core68.wasm');
  const module68 = getCoreModule('ruby.component.core69.wasm');
  const module69 = getCoreModule('ruby.component.core70.wasm');
  const module70 = getCoreModule('ruby.component.core71.wasm');
  const module71 = getCoreModule('ruby.component.core72.wasm');
  const module72 = getCoreModule('ruby.component.core73.wasm');
  const module73 = getCoreModule('ruby.component.core74.wasm');
  const module74 = getCoreModule('ruby.component.core75.wasm');
  const module75 = getCoreModule('ruby.component.core76.wasm');
  const module76 = getCoreModule('ruby.component.core77.wasm');
  const module77 = getCoreModule('ruby.component.core78.wasm');
  const module78 = getCoreModule('ruby.component.core79.wasm');
  const module79 = getCoreModule('ruby.component.core80.wasm');
  const module80 = getCoreModule('ruby.component.core81.wasm');
  const module81 = getCoreModule('ruby.component.core82.wasm');
  const module82 = getCoreModule('ruby.component.core83.wasm');
  const module83 = getCoreModule('ruby.component.core84.wasm');
  const module84 = getCoreModule('ruby.component.core85.wasm');
  const module85 = getCoreModule('ruby.component.core86.wasm');
  const module86 = getCoreModule('ruby.component.core87.wasm');
  const module87 = getCoreModule('ruby.component.core88.wasm');
  const module88 = getCoreModule('ruby.component.core89.wasm');
  const module89 = getCoreModule('ruby.component.core90.wasm');
  const module90 = getCoreModule('ruby.component.core91.wasm');
  const module91 = getCoreModule('ruby.component.core92.wasm');
  const module92 = getCoreModule('ruby.component.core93.wasm');
  const module93 = getCoreModule('ruby.component.core94.wasm');
  const module94 = getCoreModule('ruby.component.core95.wasm');
  const module95 = getCoreModule('ruby.component.core96.wasm');
  const module96 = getCoreModule('ruby.component.core97.wasm');
  const module97 = getCoreModule('ruby.component.core98.wasm');
  const module98 = getCoreModule('ruby.component.core99.wasm');
  const module99 = getCoreModule('ruby.component.core100.wasm');
  const module100 = getCoreModule('ruby.component.core101.wasm');
  const module101 = getCoreModule('ruby.component.core102.wasm');
  
  const { JsAbiValue, boolToJsBool, evalJs, exportJsValueToHost, floatToJsNumber, globalThis, importJsValueFromHost, instanceOf, intToJsNumber, isJs, jsValueEqual, jsValueStrictlyEqual, jsValueToInteger, jsValueToString, jsValueTypeof, procToJsFunction, rbObjectToJsRbValue, reflectApply, reflectGet, reflectSet, stringToJsString, throwProhibitRewindException } = imports['ruby:js/js-runtime'];
  const { getArguments, getEnvironment, initialCwd } = imports['wasi:cli/environment'];
  const { exit } = imports['wasi:cli/exit'];
  const { getStderr } = imports['wasi:cli/stderr'];
  const { getStdin } = imports['wasi:cli/stdin'];
  const { getStdout } = imports['wasi:cli/stdout'];
  const { TerminalInput } = imports['wasi:cli/terminal-input'];
  const { TerminalOutput } = imports['wasi:cli/terminal-output'];
  const { getTerminalStderr } = imports['wasi:cli/terminal-stderr'];
  const { getTerminalStdin } = imports['wasi:cli/terminal-stdin'];
  const { getTerminalStdout } = imports['wasi:cli/terminal-stdout'];
  const { now, resolution, subscribeDuration, subscribeInstant } = imports['wasi:clocks/monotonic-clock'];
  const { now: now$1, resolution: resolution$1 } = imports['wasi:clocks/wall-clock'];
  const { getDirectories } = imports['wasi:filesystem/preopens'];
  const { Descriptor, DirectoryEntryStream } = imports['wasi:filesystem/types'];
  const { Error: Error$1 } = imports['wasi:io/error'];
  const { Pollable, poll } = imports['wasi:io/poll'];
  const { InputStream, OutputStream } = imports['wasi:io/streams'];
  const { getRandomBytes } = imports['wasi:random/random'];
  let gen = (function* init () {
    const instanceFlags1 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
    const instanceFlags27 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
    let exports0;
    const handleTable13 = [T_FLAG, 0];
    const captureTable2= new Map();
    let captureCnt2 = 0;
    handleTables[13] = handleTable13;
    
    function trampoline24(arg0) {
      var handle1 = arg0;
      var rep2 = handleTable13[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable2.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Pollable.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = rsc0.ready();
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      return ret ? 1 : 0;
    }
    
    function trampoline25(arg0) {
      var handle1 = arg0;
      var rep2 = handleTable13[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable2.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Pollable.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      rsc0.block();
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
    }
    const handleTable11 = [T_FLAG, 0];
    const captureTable3= new Map();
    let captureCnt3 = 0;
    handleTables[11] = handleTable11;
    
    function trampoline27(arg0) {
      var handle1 = arg0;
      var rep2 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable3.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(InputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = rsc0.subscribe();
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      if (!(ret instanceof Pollable)) {
        throw new TypeError('Resource error: Not a valid "Pollable" resource.');
      }
      var handle3 = ret[symbolRscHandle];
      if (!handle3) {
        const rep = ret[symbolRscRep] || ++captureCnt2;
        captureTable2.set(rep, ret);
        handle3 = rscTableCreateOwn(handleTable13, rep);
      }
      return handle3;
    }
    const handleTable12 = [T_FLAG, 0];
    const captureTable4= new Map();
    let captureCnt4 = 0;
    handleTables[12] = handleTable12;
    
    function trampoline28(arg0) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = rsc0.subscribe();
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      if (!(ret instanceof Pollable)) {
        throw new TypeError('Resource error: Not a valid "Pollable" resource.');
      }
      var handle3 = ret[symbolRscHandle];
      if (!handle3) {
        const rep = ret[symbolRscRep] || ++captureCnt2;
        captureTable2.set(rep, ret);
        handle3 = rscTableCreateOwn(handleTable13, rep);
      }
      return handle3;
    }
    const handleTable9 = [T_FLAG, 0];
    const captureTable7= new Map();
    let captureCnt7 = 0;
    handleTables[9] = handleTable9;
    
    function trampoline34(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var handle4 = arg1;
      var rep5 = handleTable9[(handle4 << 1) + 1] & ~T_FLAG;
      var rsc3 = captureTable7.get(rep5);
      if (!rsc3) {
        rsc3 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
        Object.defineProperty(rsc3, symbolRscRep, { writable: true, value: rep5});
      }
      curResourceBorrows.push(rsc3);
      const ret = rsc0.isSameObject(rsc3);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      return ret ? 1 : 0;
    }
    
    function trampoline36() {
      const ret = getStdin();
      if (!(ret instanceof InputStream)) {
        throw new TypeError('Resource error: Not a valid "InputStream" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt3;
        captureTable3.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable11, rep);
      }
      return handle0;
    }
    
    function trampoline37() {
      const ret = getStdout();
      if (!(ret instanceof OutputStream)) {
        throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt4;
        captureTable4.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable12, rep);
      }
      return handle0;
    }
    
    function trampoline38() {
      const ret = getStderr();
      if (!(ret instanceof OutputStream)) {
        throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt4;
        captureTable4.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable12, rep);
      }
      return handle0;
    }
    
    function trampoline43() {
      const ret = now();
      return toUint64(ret);
    }
    
    function trampoline44() {
      const ret = resolution();
      return toUint64(ret);
    }
    
    function trampoline45(arg0) {
      const ret = subscribeInstant(BigInt.asUintN(64, arg0));
      if (!(ret instanceof Pollable)) {
        throw new TypeError('Resource error: Not a valid "Pollable" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt2;
        captureTable2.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable13, rep);
      }
      return handle0;
    }
    
    function trampoline46(arg0) {
      const ret = subscribeDuration(BigInt.asUintN(64, arg0));
      if (!(ret instanceof Pollable)) {
        throw new TypeError('Resource error: Not a valid "Pollable" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt2;
        captureTable2.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable13, rep);
      }
      return handle0;
    }
    let exports1;
    let memory0;
    let realloc0;
    
    function trampoline71(arg0, arg1, arg2) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.readViaStream(BigInt.asUintN(64, arg1))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 0, true);
          if (!(e instanceof InputStream)) {
            throw new TypeError('Resource error: Not a valid "InputStream" resource.');
          }
          var handle3 = e[symbolRscHandle];
          if (!handle3) {
            const rep = e[symbolRscRep] || ++captureCnt3;
            captureTable3.set(rep, e);
            handle3 = rscTableCreateOwn(handleTable11, rep);
          }
          dataView(memory0).setInt32(arg2 + 4, handle3, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 1, true);
          var val4 = e;
          let enum4;
          switch (val4) {
            case 'access': {
              enum4 = 0;
              break;
            }
            case 'would-block': {
              enum4 = 1;
              break;
            }
            case 'already': {
              enum4 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum4 = 3;
              break;
            }
            case 'busy': {
              enum4 = 4;
              break;
            }
            case 'deadlock': {
              enum4 = 5;
              break;
            }
            case 'quota': {
              enum4 = 6;
              break;
            }
            case 'exist': {
              enum4 = 7;
              break;
            }
            case 'file-too-large': {
              enum4 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum4 = 9;
              break;
            }
            case 'in-progress': {
              enum4 = 10;
              break;
            }
            case 'interrupted': {
              enum4 = 11;
              break;
            }
            case 'invalid': {
              enum4 = 12;
              break;
            }
            case 'io': {
              enum4 = 13;
              break;
            }
            case 'is-directory': {
              enum4 = 14;
              break;
            }
            case 'loop': {
              enum4 = 15;
              break;
            }
            case 'too-many-links': {
              enum4 = 16;
              break;
            }
            case 'message-size': {
              enum4 = 17;
              break;
            }
            case 'name-too-long': {
              enum4 = 18;
              break;
            }
            case 'no-device': {
              enum4 = 19;
              break;
            }
            case 'no-entry': {
              enum4 = 20;
              break;
            }
            case 'no-lock': {
              enum4 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum4 = 22;
              break;
            }
            case 'insufficient-space': {
              enum4 = 23;
              break;
            }
            case 'not-directory': {
              enum4 = 24;
              break;
            }
            case 'not-empty': {
              enum4 = 25;
              break;
            }
            case 'not-recoverable': {
              enum4 = 26;
              break;
            }
            case 'unsupported': {
              enum4 = 27;
              break;
            }
            case 'no-tty': {
              enum4 = 28;
              break;
            }
            case 'no-such-device': {
              enum4 = 29;
              break;
            }
            case 'overflow': {
              enum4 = 30;
              break;
            }
            case 'not-permitted': {
              enum4 = 31;
              break;
            }
            case 'pipe': {
              enum4 = 32;
              break;
            }
            case 'read-only': {
              enum4 = 33;
              break;
            }
            case 'invalid-seek': {
              enum4 = 34;
              break;
            }
            case 'text-file-busy': {
              enum4 = 35;
              break;
            }
            case 'cross-device': {
              enum4 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val4}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg2 + 4, enum4, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline72(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.getType()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          var val3 = e;
          let enum3;
          switch (val3) {
            case 'unknown': {
              enum3 = 0;
              break;
            }
            case 'block-device': {
              enum3 = 1;
              break;
            }
            case 'character-device': {
              enum3 = 2;
              break;
            }
            case 'directory': {
              enum3 = 3;
              break;
            }
            case 'fifo': {
              enum3 = 4;
              break;
            }
            case 'symbolic-link': {
              enum3 = 5;
              break;
            }
            case 'regular-file': {
              enum3 = 6;
              break;
            }
            case 'socket': {
              enum3 = 7;
              break;
            }
            default: {
              
              throw new TypeError(`"${val3}" is not one of the cases of descriptor-type`);
            }
          }
          dataView(memory0).setInt8(arg1 + 1, enum3, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val4 = e;
          let enum4;
          switch (val4) {
            case 'access': {
              enum4 = 0;
              break;
            }
            case 'would-block': {
              enum4 = 1;
              break;
            }
            case 'already': {
              enum4 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum4 = 3;
              break;
            }
            case 'busy': {
              enum4 = 4;
              break;
            }
            case 'deadlock': {
              enum4 = 5;
              break;
            }
            case 'quota': {
              enum4 = 6;
              break;
            }
            case 'exist': {
              enum4 = 7;
              break;
            }
            case 'file-too-large': {
              enum4 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum4 = 9;
              break;
            }
            case 'in-progress': {
              enum4 = 10;
              break;
            }
            case 'interrupted': {
              enum4 = 11;
              break;
            }
            case 'invalid': {
              enum4 = 12;
              break;
            }
            case 'io': {
              enum4 = 13;
              break;
            }
            case 'is-directory': {
              enum4 = 14;
              break;
            }
            case 'loop': {
              enum4 = 15;
              break;
            }
            case 'too-many-links': {
              enum4 = 16;
              break;
            }
            case 'message-size': {
              enum4 = 17;
              break;
            }
            case 'name-too-long': {
              enum4 = 18;
              break;
            }
            case 'no-device': {
              enum4 = 19;
              break;
            }
            case 'no-entry': {
              enum4 = 20;
              break;
            }
            case 'no-lock': {
              enum4 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum4 = 22;
              break;
            }
            case 'insufficient-space': {
              enum4 = 23;
              break;
            }
            case 'not-directory': {
              enum4 = 24;
              break;
            }
            case 'not-empty': {
              enum4 = 25;
              break;
            }
            case 'not-recoverable': {
              enum4 = 26;
              break;
            }
            case 'unsupported': {
              enum4 = 27;
              break;
            }
            case 'no-tty': {
              enum4 = 28;
              break;
            }
            case 'no-such-device': {
              enum4 = 29;
              break;
            }
            case 'overflow': {
              enum4 = 30;
              break;
            }
            case 'not-permitted': {
              enum4 = 31;
              break;
            }
            case 'pipe': {
              enum4 = 32;
              break;
            }
            case 'read-only': {
              enum4 = 33;
              break;
            }
            case 'invalid-seek': {
              enum4 = 34;
              break;
            }
            case 'text-file-busy': {
              enum4 = 35;
              break;
            }
            case 'cross-device': {
              enum4 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val4}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 1, enum4, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    const handleTable10 = [T_FLAG, 0];
    const captureTable8= new Map();
    let captureCnt8 = 0;
    handleTables[10] = handleTable10;
    
    function trampoline73(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.readDirectory()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          if (!(e instanceof DirectoryEntryStream)) {
            throw new TypeError('Resource error: Not a valid "DirectoryEntryStream" resource.');
          }
          var handle3 = e[symbolRscHandle];
          if (!handle3) {
            const rep = e[symbolRscRep] || ++captureCnt8;
            captureTable8.set(rep, e);
            handle3 = rscTableCreateOwn(handleTable10, rep);
          }
          dataView(memory0).setInt32(arg1 + 4, handle3, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val4 = e;
          let enum4;
          switch (val4) {
            case 'access': {
              enum4 = 0;
              break;
            }
            case 'would-block': {
              enum4 = 1;
              break;
            }
            case 'already': {
              enum4 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum4 = 3;
              break;
            }
            case 'busy': {
              enum4 = 4;
              break;
            }
            case 'deadlock': {
              enum4 = 5;
              break;
            }
            case 'quota': {
              enum4 = 6;
              break;
            }
            case 'exist': {
              enum4 = 7;
              break;
            }
            case 'file-too-large': {
              enum4 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum4 = 9;
              break;
            }
            case 'in-progress': {
              enum4 = 10;
              break;
            }
            case 'interrupted': {
              enum4 = 11;
              break;
            }
            case 'invalid': {
              enum4 = 12;
              break;
            }
            case 'io': {
              enum4 = 13;
              break;
            }
            case 'is-directory': {
              enum4 = 14;
              break;
            }
            case 'loop': {
              enum4 = 15;
              break;
            }
            case 'too-many-links': {
              enum4 = 16;
              break;
            }
            case 'message-size': {
              enum4 = 17;
              break;
            }
            case 'name-too-long': {
              enum4 = 18;
              break;
            }
            case 'no-device': {
              enum4 = 19;
              break;
            }
            case 'no-entry': {
              enum4 = 20;
              break;
            }
            case 'no-lock': {
              enum4 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum4 = 22;
              break;
            }
            case 'insufficient-space': {
              enum4 = 23;
              break;
            }
            case 'not-directory': {
              enum4 = 24;
              break;
            }
            case 'not-empty': {
              enum4 = 25;
              break;
            }
            case 'not-recoverable': {
              enum4 = 26;
              break;
            }
            case 'unsupported': {
              enum4 = 27;
              break;
            }
            case 'no-tty': {
              enum4 = 28;
              break;
            }
            case 'no-such-device': {
              enum4 = 29;
              break;
            }
            case 'overflow': {
              enum4 = 30;
              break;
            }
            case 'not-permitted': {
              enum4 = 31;
              break;
            }
            case 'pipe': {
              enum4 = 32;
              break;
            }
            case 'read-only': {
              enum4 = 33;
              break;
            }
            case 'invalid-seek': {
              enum4 = 34;
              break;
            }
            case 'text-file-busy': {
              enum4 = 35;
              break;
            }
            case 'cross-device': {
              enum4 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val4}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 4, enum4, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline74(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.stat()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant12 = ret;
      switch (variant12.tag) {
        case 'ok': {
          const e = variant12.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          var {type: v3_0, linkCount: v3_1, size: v3_2, dataAccessTimestamp: v3_3, dataModificationTimestamp: v3_4, statusChangeTimestamp: v3_5 } = e;
          var val4 = v3_0;
          let enum4;
          switch (val4) {
            case 'unknown': {
              enum4 = 0;
              break;
            }
            case 'block-device': {
              enum4 = 1;
              break;
            }
            case 'character-device': {
              enum4 = 2;
              break;
            }
            case 'directory': {
              enum4 = 3;
              break;
            }
            case 'fifo': {
              enum4 = 4;
              break;
            }
            case 'symbolic-link': {
              enum4 = 5;
              break;
            }
            case 'regular-file': {
              enum4 = 6;
              break;
            }
            case 'socket': {
              enum4 = 7;
              break;
            }
            default: {
              
              throw new TypeError(`"${val4}" is not one of the cases of descriptor-type`);
            }
          }
          dataView(memory0).setInt8(arg1 + 8, enum4, true);
          dataView(memory0).setBigInt64(arg1 + 16, toUint64(v3_1), true);
          dataView(memory0).setBigInt64(arg1 + 24, toUint64(v3_2), true);
          var variant6 = v3_3;
          if (variant6 === null || variant6=== undefined) {
            dataView(memory0).setInt8(arg1 + 32, 0, true);
          } else {
            const e = variant6;
            dataView(memory0).setInt8(arg1 + 32, 1, true);
            var {seconds: v5_0, nanoseconds: v5_1 } = e;
            dataView(memory0).setBigInt64(arg1 + 40, toUint64(v5_0), true);
            dataView(memory0).setInt32(arg1 + 48, toUint32(v5_1), true);
          }
          var variant8 = v3_4;
          if (variant8 === null || variant8=== undefined) {
            dataView(memory0).setInt8(arg1 + 56, 0, true);
          } else {
            const e = variant8;
            dataView(memory0).setInt8(arg1 + 56, 1, true);
            var {seconds: v7_0, nanoseconds: v7_1 } = e;
            dataView(memory0).setBigInt64(arg1 + 64, toUint64(v7_0), true);
            dataView(memory0).setInt32(arg1 + 72, toUint32(v7_1), true);
          }
          var variant10 = v3_5;
          if (variant10 === null || variant10=== undefined) {
            dataView(memory0).setInt8(arg1 + 80, 0, true);
          } else {
            const e = variant10;
            dataView(memory0).setInt8(arg1 + 80, 1, true);
            var {seconds: v9_0, nanoseconds: v9_1 } = e;
            dataView(memory0).setBigInt64(arg1 + 88, toUint64(v9_0), true);
            dataView(memory0).setInt32(arg1 + 96, toUint32(v9_1), true);
          }
          break;
        }
        case 'err': {
          const e = variant12.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val11 = e;
          let enum11;
          switch (val11) {
            case 'access': {
              enum11 = 0;
              break;
            }
            case 'would-block': {
              enum11 = 1;
              break;
            }
            case 'already': {
              enum11 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum11 = 3;
              break;
            }
            case 'busy': {
              enum11 = 4;
              break;
            }
            case 'deadlock': {
              enum11 = 5;
              break;
            }
            case 'quota': {
              enum11 = 6;
              break;
            }
            case 'exist': {
              enum11 = 7;
              break;
            }
            case 'file-too-large': {
              enum11 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum11 = 9;
              break;
            }
            case 'in-progress': {
              enum11 = 10;
              break;
            }
            case 'interrupted': {
              enum11 = 11;
              break;
            }
            case 'invalid': {
              enum11 = 12;
              break;
            }
            case 'io': {
              enum11 = 13;
              break;
            }
            case 'is-directory': {
              enum11 = 14;
              break;
            }
            case 'loop': {
              enum11 = 15;
              break;
            }
            case 'too-many-links': {
              enum11 = 16;
              break;
            }
            case 'message-size': {
              enum11 = 17;
              break;
            }
            case 'name-too-long': {
              enum11 = 18;
              break;
            }
            case 'no-device': {
              enum11 = 19;
              break;
            }
            case 'no-entry': {
              enum11 = 20;
              break;
            }
            case 'no-lock': {
              enum11 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum11 = 22;
              break;
            }
            case 'insufficient-space': {
              enum11 = 23;
              break;
            }
            case 'not-directory': {
              enum11 = 24;
              break;
            }
            case 'not-empty': {
              enum11 = 25;
              break;
            }
            case 'not-recoverable': {
              enum11 = 26;
              break;
            }
            case 'unsupported': {
              enum11 = 27;
              break;
            }
            case 'no-tty': {
              enum11 = 28;
              break;
            }
            case 'no-such-device': {
              enum11 = 29;
              break;
            }
            case 'overflow': {
              enum11 = 30;
              break;
            }
            case 'not-permitted': {
              enum11 = 31;
              break;
            }
            case 'pipe': {
              enum11 = 32;
              break;
            }
            case 'read-only': {
              enum11 = 33;
              break;
            }
            case 'invalid-seek': {
              enum11 = 34;
              break;
            }
            case 'text-file-busy': {
              enum11 = 35;
              break;
            }
            case 'cross-device': {
              enum11 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val11}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 8, enum11, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline75(arg0, arg1, arg2, arg3, arg4) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var flags3 = {
        symlinkFollow: Boolean(arg1 & 1),
      };
      var ptr4 = arg2;
      var len4 = arg3;
      var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.statAt(flags3, result4)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant14 = ret;
      switch (variant14.tag) {
        case 'ok': {
          const e = variant14.val;
          dataView(memory0).setInt8(arg4 + 0, 0, true);
          var {type: v5_0, linkCount: v5_1, size: v5_2, dataAccessTimestamp: v5_3, dataModificationTimestamp: v5_4, statusChangeTimestamp: v5_5 } = e;
          var val6 = v5_0;
          let enum6;
          switch (val6) {
            case 'unknown': {
              enum6 = 0;
              break;
            }
            case 'block-device': {
              enum6 = 1;
              break;
            }
            case 'character-device': {
              enum6 = 2;
              break;
            }
            case 'directory': {
              enum6 = 3;
              break;
            }
            case 'fifo': {
              enum6 = 4;
              break;
            }
            case 'symbolic-link': {
              enum6 = 5;
              break;
            }
            case 'regular-file': {
              enum6 = 6;
              break;
            }
            case 'socket': {
              enum6 = 7;
              break;
            }
            default: {
              
              throw new TypeError(`"${val6}" is not one of the cases of descriptor-type`);
            }
          }
          dataView(memory0).setInt8(arg4 + 8, enum6, true);
          dataView(memory0).setBigInt64(arg4 + 16, toUint64(v5_1), true);
          dataView(memory0).setBigInt64(arg4 + 24, toUint64(v5_2), true);
          var variant8 = v5_3;
          if (variant8 === null || variant8=== undefined) {
            dataView(memory0).setInt8(arg4 + 32, 0, true);
          } else {
            const e = variant8;
            dataView(memory0).setInt8(arg4 + 32, 1, true);
            var {seconds: v7_0, nanoseconds: v7_1 } = e;
            dataView(memory0).setBigInt64(arg4 + 40, toUint64(v7_0), true);
            dataView(memory0).setInt32(arg4 + 48, toUint32(v7_1), true);
          }
          var variant10 = v5_4;
          if (variant10 === null || variant10=== undefined) {
            dataView(memory0).setInt8(arg4 + 56, 0, true);
          } else {
            const e = variant10;
            dataView(memory0).setInt8(arg4 + 56, 1, true);
            var {seconds: v9_0, nanoseconds: v9_1 } = e;
            dataView(memory0).setBigInt64(arg4 + 64, toUint64(v9_0), true);
            dataView(memory0).setInt32(arg4 + 72, toUint32(v9_1), true);
          }
          var variant12 = v5_5;
          if (variant12 === null || variant12=== undefined) {
            dataView(memory0).setInt8(arg4 + 80, 0, true);
          } else {
            const e = variant12;
            dataView(memory0).setInt8(arg4 + 80, 1, true);
            var {seconds: v11_0, nanoseconds: v11_1 } = e;
            dataView(memory0).setBigInt64(arg4 + 88, toUint64(v11_0), true);
            dataView(memory0).setInt32(arg4 + 96, toUint32(v11_1), true);
          }
          break;
        }
        case 'err': {
          const e = variant14.val;
          dataView(memory0).setInt8(arg4 + 0, 1, true);
          var val13 = e;
          let enum13;
          switch (val13) {
            case 'access': {
              enum13 = 0;
              break;
            }
            case 'would-block': {
              enum13 = 1;
              break;
            }
            case 'already': {
              enum13 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum13 = 3;
              break;
            }
            case 'busy': {
              enum13 = 4;
              break;
            }
            case 'deadlock': {
              enum13 = 5;
              break;
            }
            case 'quota': {
              enum13 = 6;
              break;
            }
            case 'exist': {
              enum13 = 7;
              break;
            }
            case 'file-too-large': {
              enum13 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum13 = 9;
              break;
            }
            case 'in-progress': {
              enum13 = 10;
              break;
            }
            case 'interrupted': {
              enum13 = 11;
              break;
            }
            case 'invalid': {
              enum13 = 12;
              break;
            }
            case 'io': {
              enum13 = 13;
              break;
            }
            case 'is-directory': {
              enum13 = 14;
              break;
            }
            case 'loop': {
              enum13 = 15;
              break;
            }
            case 'too-many-links': {
              enum13 = 16;
              break;
            }
            case 'message-size': {
              enum13 = 17;
              break;
            }
            case 'name-too-long': {
              enum13 = 18;
              break;
            }
            case 'no-device': {
              enum13 = 19;
              break;
            }
            case 'no-entry': {
              enum13 = 20;
              break;
            }
            case 'no-lock': {
              enum13 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum13 = 22;
              break;
            }
            case 'insufficient-space': {
              enum13 = 23;
              break;
            }
            case 'not-directory': {
              enum13 = 24;
              break;
            }
            case 'not-empty': {
              enum13 = 25;
              break;
            }
            case 'not-recoverable': {
              enum13 = 26;
              break;
            }
            case 'unsupported': {
              enum13 = 27;
              break;
            }
            case 'no-tty': {
              enum13 = 28;
              break;
            }
            case 'no-such-device': {
              enum13 = 29;
              break;
            }
            case 'overflow': {
              enum13 = 30;
              break;
            }
            case 'not-permitted': {
              enum13 = 31;
              break;
            }
            case 'pipe': {
              enum13 = 32;
              break;
            }
            case 'read-only': {
              enum13 = 33;
              break;
            }
            case 'invalid-seek': {
              enum13 = 34;
              break;
            }
            case 'text-file-busy': {
              enum13 = 35;
              break;
            }
            case 'cross-device': {
              enum13 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val13}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg4 + 8, enum13, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline76(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var flags3 = {
        symlinkFollow: Boolean(arg1 & 1),
      };
      var ptr4 = arg2;
      var len4 = arg3;
      var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
      var flags5 = {
        create: Boolean(arg4 & 1),
        directory: Boolean(arg4 & 2),
        exclusive: Boolean(arg4 & 4),
        truncate: Boolean(arg4 & 8),
      };
      var flags6 = {
        read: Boolean(arg5 & 1),
        write: Boolean(arg5 & 2),
        fileIntegritySync: Boolean(arg5 & 4),
        dataIntegritySync: Boolean(arg5 & 8),
        requestedWriteSync: Boolean(arg5 & 16),
        mutateDirectory: Boolean(arg5 & 32),
      };
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.openAt(flags3, result4, flags5, flags6)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant9 = ret;
      switch (variant9.tag) {
        case 'ok': {
          const e = variant9.val;
          dataView(memory0).setInt8(arg6 + 0, 0, true);
          if (!(e instanceof Descriptor)) {
            throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
          }
          var handle7 = e[symbolRscHandle];
          if (!handle7) {
            const rep = e[symbolRscRep] || ++captureCnt7;
            captureTable7.set(rep, e);
            handle7 = rscTableCreateOwn(handleTable9, rep);
          }
          dataView(memory0).setInt32(arg6 + 4, handle7, true);
          break;
        }
        case 'err': {
          const e = variant9.val;
          dataView(memory0).setInt8(arg6 + 0, 1, true);
          var val8 = e;
          let enum8;
          switch (val8) {
            case 'access': {
              enum8 = 0;
              break;
            }
            case 'would-block': {
              enum8 = 1;
              break;
            }
            case 'already': {
              enum8 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum8 = 3;
              break;
            }
            case 'busy': {
              enum8 = 4;
              break;
            }
            case 'deadlock': {
              enum8 = 5;
              break;
            }
            case 'quota': {
              enum8 = 6;
              break;
            }
            case 'exist': {
              enum8 = 7;
              break;
            }
            case 'file-too-large': {
              enum8 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum8 = 9;
              break;
            }
            case 'in-progress': {
              enum8 = 10;
              break;
            }
            case 'interrupted': {
              enum8 = 11;
              break;
            }
            case 'invalid': {
              enum8 = 12;
              break;
            }
            case 'io': {
              enum8 = 13;
              break;
            }
            case 'is-directory': {
              enum8 = 14;
              break;
            }
            case 'loop': {
              enum8 = 15;
              break;
            }
            case 'too-many-links': {
              enum8 = 16;
              break;
            }
            case 'message-size': {
              enum8 = 17;
              break;
            }
            case 'name-too-long': {
              enum8 = 18;
              break;
            }
            case 'no-device': {
              enum8 = 19;
              break;
            }
            case 'no-entry': {
              enum8 = 20;
              break;
            }
            case 'no-lock': {
              enum8 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum8 = 22;
              break;
            }
            case 'insufficient-space': {
              enum8 = 23;
              break;
            }
            case 'not-directory': {
              enum8 = 24;
              break;
            }
            case 'not-empty': {
              enum8 = 25;
              break;
            }
            case 'not-recoverable': {
              enum8 = 26;
              break;
            }
            case 'unsupported': {
              enum8 = 27;
              break;
            }
            case 'no-tty': {
              enum8 = 28;
              break;
            }
            case 'no-such-device': {
              enum8 = 29;
              break;
            }
            case 'overflow': {
              enum8 = 30;
              break;
            }
            case 'not-permitted': {
              enum8 = 31;
              break;
            }
            case 'pipe': {
              enum8 = 32;
              break;
            }
            case 'read-only': {
              enum8 = 33;
              break;
            }
            case 'invalid-seek': {
              enum8 = 34;
              break;
            }
            case 'text-file-busy': {
              enum8 = 35;
              break;
            }
            case 'cross-device': {
              enum8 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val8}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg6 + 4, enum8, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline77(arg0, arg1, arg2, arg3) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var ptr3 = arg1;
      var len3 = arg2;
      var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.readlinkAt(result3)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant6 = ret;
      switch (variant6.tag) {
        case 'ok': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 0, true);
          var ptr4 = utf8Encode(e, realloc0, memory0);
          var len4 = utf8EncodedLen;
          dataView(memory0).setInt32(arg3 + 8, len4, true);
          dataView(memory0).setInt32(arg3 + 4, ptr4, true);
          break;
        }
        case 'err': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 1, true);
          var val5 = e;
          let enum5;
          switch (val5) {
            case 'access': {
              enum5 = 0;
              break;
            }
            case 'would-block': {
              enum5 = 1;
              break;
            }
            case 'already': {
              enum5 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum5 = 3;
              break;
            }
            case 'busy': {
              enum5 = 4;
              break;
            }
            case 'deadlock': {
              enum5 = 5;
              break;
            }
            case 'quota': {
              enum5 = 6;
              break;
            }
            case 'exist': {
              enum5 = 7;
              break;
            }
            case 'file-too-large': {
              enum5 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum5 = 9;
              break;
            }
            case 'in-progress': {
              enum5 = 10;
              break;
            }
            case 'interrupted': {
              enum5 = 11;
              break;
            }
            case 'invalid': {
              enum5 = 12;
              break;
            }
            case 'io': {
              enum5 = 13;
              break;
            }
            case 'is-directory': {
              enum5 = 14;
              break;
            }
            case 'loop': {
              enum5 = 15;
              break;
            }
            case 'too-many-links': {
              enum5 = 16;
              break;
            }
            case 'message-size': {
              enum5 = 17;
              break;
            }
            case 'name-too-long': {
              enum5 = 18;
              break;
            }
            case 'no-device': {
              enum5 = 19;
              break;
            }
            case 'no-entry': {
              enum5 = 20;
              break;
            }
            case 'no-lock': {
              enum5 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum5 = 22;
              break;
            }
            case 'insufficient-space': {
              enum5 = 23;
              break;
            }
            case 'not-directory': {
              enum5 = 24;
              break;
            }
            case 'not-empty': {
              enum5 = 25;
              break;
            }
            case 'not-recoverable': {
              enum5 = 26;
              break;
            }
            case 'unsupported': {
              enum5 = 27;
              break;
            }
            case 'no-tty': {
              enum5 = 28;
              break;
            }
            case 'no-such-device': {
              enum5 = 29;
              break;
            }
            case 'overflow': {
              enum5 = 30;
              break;
            }
            case 'not-permitted': {
              enum5 = 31;
              break;
            }
            case 'pipe': {
              enum5 = 32;
              break;
            }
            case 'read-only': {
              enum5 = 33;
              break;
            }
            case 'invalid-seek': {
              enum5 = 34;
              break;
            }
            case 'text-file-busy': {
              enum5 = 35;
              break;
            }
            case 'cross-device': {
              enum5 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val5}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg3 + 4, enum5, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline78(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.metadataHash()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          var {lower: v3_0, upper: v3_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 8, toUint64(v3_0), true);
          dataView(memory0).setBigInt64(arg1 + 16, toUint64(v3_1), true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val4 = e;
          let enum4;
          switch (val4) {
            case 'access': {
              enum4 = 0;
              break;
            }
            case 'would-block': {
              enum4 = 1;
              break;
            }
            case 'already': {
              enum4 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum4 = 3;
              break;
            }
            case 'busy': {
              enum4 = 4;
              break;
            }
            case 'deadlock': {
              enum4 = 5;
              break;
            }
            case 'quota': {
              enum4 = 6;
              break;
            }
            case 'exist': {
              enum4 = 7;
              break;
            }
            case 'file-too-large': {
              enum4 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum4 = 9;
              break;
            }
            case 'in-progress': {
              enum4 = 10;
              break;
            }
            case 'interrupted': {
              enum4 = 11;
              break;
            }
            case 'invalid': {
              enum4 = 12;
              break;
            }
            case 'io': {
              enum4 = 13;
              break;
            }
            case 'is-directory': {
              enum4 = 14;
              break;
            }
            case 'loop': {
              enum4 = 15;
              break;
            }
            case 'too-many-links': {
              enum4 = 16;
              break;
            }
            case 'message-size': {
              enum4 = 17;
              break;
            }
            case 'name-too-long': {
              enum4 = 18;
              break;
            }
            case 'no-device': {
              enum4 = 19;
              break;
            }
            case 'no-entry': {
              enum4 = 20;
              break;
            }
            case 'no-lock': {
              enum4 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum4 = 22;
              break;
            }
            case 'insufficient-space': {
              enum4 = 23;
              break;
            }
            case 'not-directory': {
              enum4 = 24;
              break;
            }
            case 'not-empty': {
              enum4 = 25;
              break;
            }
            case 'not-recoverable': {
              enum4 = 26;
              break;
            }
            case 'unsupported': {
              enum4 = 27;
              break;
            }
            case 'no-tty': {
              enum4 = 28;
              break;
            }
            case 'no-such-device': {
              enum4 = 29;
              break;
            }
            case 'overflow': {
              enum4 = 30;
              break;
            }
            case 'not-permitted': {
              enum4 = 31;
              break;
            }
            case 'pipe': {
              enum4 = 32;
              break;
            }
            case 'read-only': {
              enum4 = 33;
              break;
            }
            case 'invalid-seek': {
              enum4 = 34;
              break;
            }
            case 'text-file-busy': {
              enum4 = 35;
              break;
            }
            case 'cross-device': {
              enum4 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val4}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 8, enum4, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline79(arg0, arg1, arg2, arg3, arg4) {
      var handle1 = arg0;
      var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable7.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var flags3 = {
        symlinkFollow: Boolean(arg1 & 1),
      };
      var ptr4 = arg2;
      var len4 = arg3;
      var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.metadataHashAt(flags3, result4)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant7 = ret;
      switch (variant7.tag) {
        case 'ok': {
          const e = variant7.val;
          dataView(memory0).setInt8(arg4 + 0, 0, true);
          var {lower: v5_0, upper: v5_1 } = e;
          dataView(memory0).setBigInt64(arg4 + 8, toUint64(v5_0), true);
          dataView(memory0).setBigInt64(arg4 + 16, toUint64(v5_1), true);
          break;
        }
        case 'err': {
          const e = variant7.val;
          dataView(memory0).setInt8(arg4 + 0, 1, true);
          var val6 = e;
          let enum6;
          switch (val6) {
            case 'access': {
              enum6 = 0;
              break;
            }
            case 'would-block': {
              enum6 = 1;
              break;
            }
            case 'already': {
              enum6 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum6 = 3;
              break;
            }
            case 'busy': {
              enum6 = 4;
              break;
            }
            case 'deadlock': {
              enum6 = 5;
              break;
            }
            case 'quota': {
              enum6 = 6;
              break;
            }
            case 'exist': {
              enum6 = 7;
              break;
            }
            case 'file-too-large': {
              enum6 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum6 = 9;
              break;
            }
            case 'in-progress': {
              enum6 = 10;
              break;
            }
            case 'interrupted': {
              enum6 = 11;
              break;
            }
            case 'invalid': {
              enum6 = 12;
              break;
            }
            case 'io': {
              enum6 = 13;
              break;
            }
            case 'is-directory': {
              enum6 = 14;
              break;
            }
            case 'loop': {
              enum6 = 15;
              break;
            }
            case 'too-many-links': {
              enum6 = 16;
              break;
            }
            case 'message-size': {
              enum6 = 17;
              break;
            }
            case 'name-too-long': {
              enum6 = 18;
              break;
            }
            case 'no-device': {
              enum6 = 19;
              break;
            }
            case 'no-entry': {
              enum6 = 20;
              break;
            }
            case 'no-lock': {
              enum6 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum6 = 22;
              break;
            }
            case 'insufficient-space': {
              enum6 = 23;
              break;
            }
            case 'not-directory': {
              enum6 = 24;
              break;
            }
            case 'not-empty': {
              enum6 = 25;
              break;
            }
            case 'not-recoverable': {
              enum6 = 26;
              break;
            }
            case 'unsupported': {
              enum6 = 27;
              break;
            }
            case 'no-tty': {
              enum6 = 28;
              break;
            }
            case 'no-such-device': {
              enum6 = 29;
              break;
            }
            case 'overflow': {
              enum6 = 30;
              break;
            }
            case 'not-permitted': {
              enum6 = 31;
              break;
            }
            case 'pipe': {
              enum6 = 32;
              break;
            }
            case 'read-only': {
              enum6 = 33;
              break;
            }
            case 'invalid-seek': {
              enum6 = 34;
              break;
            }
            case 'text-file-busy': {
              enum6 = 35;
              break;
            }
            case 'cross-device': {
              enum6 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val6}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg4 + 8, enum6, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline80(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable10[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable8.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(DirectoryEntryStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.readDirectoryEntry()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant8 = ret;
      switch (variant8.tag) {
        case 'ok': {
          const e = variant8.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          var variant6 = e;
          if (variant6 === null || variant6=== undefined) {
            dataView(memory0).setInt8(arg1 + 4, 0, true);
          } else {
            const e = variant6;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            var {type: v3_0, name: v3_1 } = e;
            var val4 = v3_0;
            let enum4;
            switch (val4) {
              case 'unknown': {
                enum4 = 0;
                break;
              }
              case 'block-device': {
                enum4 = 1;
                break;
              }
              case 'character-device': {
                enum4 = 2;
                break;
              }
              case 'directory': {
                enum4 = 3;
                break;
              }
              case 'fifo': {
                enum4 = 4;
                break;
              }
              case 'symbolic-link': {
                enum4 = 5;
                break;
              }
              case 'regular-file': {
                enum4 = 6;
                break;
              }
              case 'socket': {
                enum4 = 7;
                break;
              }
              default: {
                
                throw new TypeError(`"${val4}" is not one of the cases of descriptor-type`);
              }
            }
            dataView(memory0).setInt8(arg1 + 8, enum4, true);
            var ptr5 = utf8Encode(v3_1, realloc0, memory0);
            var len5 = utf8EncodedLen;
            dataView(memory0).setInt32(arg1 + 16, len5, true);
            dataView(memory0).setInt32(arg1 + 12, ptr5, true);
          }
          break;
        }
        case 'err': {
          const e = variant8.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val7 = e;
          let enum7;
          switch (val7) {
            case 'access': {
              enum7 = 0;
              break;
            }
            case 'would-block': {
              enum7 = 1;
              break;
            }
            case 'already': {
              enum7 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum7 = 3;
              break;
            }
            case 'busy': {
              enum7 = 4;
              break;
            }
            case 'deadlock': {
              enum7 = 5;
              break;
            }
            case 'quota': {
              enum7 = 6;
              break;
            }
            case 'exist': {
              enum7 = 7;
              break;
            }
            case 'file-too-large': {
              enum7 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum7 = 9;
              break;
            }
            case 'in-progress': {
              enum7 = 10;
              break;
            }
            case 'interrupted': {
              enum7 = 11;
              break;
            }
            case 'invalid': {
              enum7 = 12;
              break;
            }
            case 'io': {
              enum7 = 13;
              break;
            }
            case 'is-directory': {
              enum7 = 14;
              break;
            }
            case 'loop': {
              enum7 = 15;
              break;
            }
            case 'too-many-links': {
              enum7 = 16;
              break;
            }
            case 'message-size': {
              enum7 = 17;
              break;
            }
            case 'name-too-long': {
              enum7 = 18;
              break;
            }
            case 'no-device': {
              enum7 = 19;
              break;
            }
            case 'no-entry': {
              enum7 = 20;
              break;
            }
            case 'no-lock': {
              enum7 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum7 = 22;
              break;
            }
            case 'insufficient-space': {
              enum7 = 23;
              break;
            }
            case 'not-directory': {
              enum7 = 24;
              break;
            }
            case 'not-empty': {
              enum7 = 25;
              break;
            }
            case 'not-recoverable': {
              enum7 = 26;
              break;
            }
            case 'unsupported': {
              enum7 = 27;
              break;
            }
            case 'no-tty': {
              enum7 = 28;
              break;
            }
            case 'no-such-device': {
              enum7 = 29;
              break;
            }
            case 'overflow': {
              enum7 = 30;
              break;
            }
            case 'not-permitted': {
              enum7 = 31;
              break;
            }
            case 'pipe': {
              enum7 = 32;
              break;
            }
            case 'read-only': {
              enum7 = 33;
              break;
            }
            case 'invalid-seek': {
              enum7 = 34;
              break;
            }
            case 'text-file-busy': {
              enum7 = 35;
              break;
            }
            case 'cross-device': {
              enum7 = 36;
              break;
            }
            default: {
              
              throw new TypeError(`"${val7}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 4, enum7, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    const handleTable14 = [T_FLAG, 0];
    const captureTable1= new Map();
    let captureCnt1 = 0;
    handleTables[14] = handleTable14;
    
    function trampoline81(arg0, arg1, arg2) {
      var handle1 = arg0;
      var rep2 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable3.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(InputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.read(BigInt.asUintN(64, arg1))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant6 = ret;
      switch (variant6.tag) {
        case 'ok': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg2 + 0, 0, true);
          var val3 = e;
          var len3 = val3.byteLength;
          var ptr3 = realloc0(0, 0, 1, len3 * 1);
          var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
          (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
          dataView(memory0).setInt32(arg2 + 8, len3, true);
          dataView(memory0).setInt32(arg2 + 4, ptr3, true);
          break;
        }
        case 'err': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg2 + 0, 1, true);
          var variant5 = e;
          switch (variant5.tag) {
            case 'last-operation-failed': {
              const e = variant5.val;
              dataView(memory0).setInt8(arg2 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle4 = e[symbolRscHandle];
              if (!handle4) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg2 + 8, handle4, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg2 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline82(arg0, arg1, arg2) {
      var handle1 = arg0;
      var rep2 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable3.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(InputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.blockingRead(BigInt.asUintN(64, arg1))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant6 = ret;
      switch (variant6.tag) {
        case 'ok': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg2 + 0, 0, true);
          var val3 = e;
          var len3 = val3.byteLength;
          var ptr3 = realloc0(0, 0, 1, len3 * 1);
          var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
          (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
          dataView(memory0).setInt32(arg2 + 8, len3, true);
          dataView(memory0).setInt32(arg2 + 4, ptr3, true);
          break;
        }
        case 'err': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg2 + 0, 1, true);
          var variant5 = e;
          switch (variant5.tag) {
            case 'last-operation-failed': {
              const e = variant5.val;
              dataView(memory0).setInt8(arg2 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle4 = e[symbolRscHandle];
              if (!handle4) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg2 + 8, handle4, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg2 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline83(arg0, arg1, arg2) {
      var handle1 = arg0;
      var rep2 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable3.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(InputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.skip(BigInt.asUintN(64, arg1))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 0, true);
          dataView(memory0).setBigInt64(arg2 + 8, toUint64(e), true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'last-operation-failed': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg2 + 8, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle3 = e[symbolRscHandle];
              if (!handle3) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg2 + 12, handle3, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg2 + 8, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline84(arg0, arg1, arg2) {
      var handle1 = arg0;
      var rep2 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable3.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(InputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.blockingSkip(BigInt.asUintN(64, arg1))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 0, true);
          dataView(memory0).setBigInt64(arg2 + 8, toUint64(e), true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'last-operation-failed': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg2 + 8, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle3 = e[symbolRscHandle];
              if (!handle3) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg2 + 12, handle3, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg2 + 8, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline85(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.checkWrite()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          dataView(memory0).setBigInt64(arg1 + 8, toUint64(e), true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'last-operation-failed': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg1 + 8, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle3 = e[symbolRscHandle];
              if (!handle3) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg1 + 12, handle3, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg1 + 8, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline86(arg0, arg1, arg2, arg3) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var ptr3 = arg1;
      var len3 = arg2;
      var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.write(result3)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant6 = ret;
      switch (variant6.tag) {
        case 'ok': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 0, true);
          break;
        }
        case 'err': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 1, true);
          var variant5 = e;
          switch (variant5.tag) {
            case 'last-operation-failed': {
              const e = variant5.val;
              dataView(memory0).setInt8(arg3 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle4 = e[symbolRscHandle];
              if (!handle4) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg3 + 8, handle4, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg3 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline87(arg0, arg1, arg2, arg3) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var ptr3 = arg1;
      var len3 = arg2;
      var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.blockingWriteAndFlush(result3)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant6 = ret;
      switch (variant6.tag) {
        case 'ok': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 0, true);
          break;
        }
        case 'err': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 1, true);
          var variant5 = e;
          switch (variant5.tag) {
            case 'last-operation-failed': {
              const e = variant5.val;
              dataView(memory0).setInt8(arg3 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle4 = e[symbolRscHandle];
              if (!handle4) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg3 + 8, handle4, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg3 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline88(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.flush()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'last-operation-failed': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg1 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle3 = e[symbolRscHandle];
              if (!handle3) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg1 + 8, handle3, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg1 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline89(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.blockingFlush()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'last-operation-failed': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg1 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle3 = e[symbolRscHandle];
              if (!handle3) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg1 + 8, handle3, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg1 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline90(arg0, arg1, arg2) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.writeZeroes(BigInt.asUintN(64, arg1))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 0, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'last-operation-failed': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg2 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle3 = e[symbolRscHandle];
              if (!handle3) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg2 + 8, handle3, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg2 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline91(arg0, arg1, arg2) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.blockingWriteZeroesAndFlush(BigInt.asUintN(64, arg1))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 0, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'last-operation-failed': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg2 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle3 = e[symbolRscHandle];
              if (!handle3) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg2 + 8, handle3, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg2 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline92(arg0, arg1, arg2, arg3) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var handle4 = arg1;
      var rep5 = handleTable11[(handle4 << 1) + 1] & ~T_FLAG;
      var rsc3 = captureTable3.get(rep5);
      if (!rsc3) {
        rsc3 = Object.create(InputStream.prototype);
        Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
        Object.defineProperty(rsc3, symbolRscRep, { writable: true, value: rep5});
      }
      curResourceBorrows.push(rsc3);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.splice(rsc3, BigInt.asUintN(64, arg2))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant8 = ret;
      switch (variant8.tag) {
        case 'ok': {
          const e = variant8.val;
          dataView(memory0).setInt8(arg3 + 0, 0, true);
          dataView(memory0).setBigInt64(arg3 + 8, toUint64(e), true);
          break;
        }
        case 'err': {
          const e = variant8.val;
          dataView(memory0).setInt8(arg3 + 0, 1, true);
          var variant7 = e;
          switch (variant7.tag) {
            case 'last-operation-failed': {
              const e = variant7.val;
              dataView(memory0).setInt8(arg3 + 8, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle6 = e[symbolRscHandle];
              if (!handle6) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle6 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg3 + 12, handle6, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg3 + 8, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant7.tag)}\` (received \`${variant7}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline93(arg0, arg1, arg2, arg3) {
      var handle1 = arg0;
      var rep2 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var handle4 = arg1;
      var rep5 = handleTable11[(handle4 << 1) + 1] & ~T_FLAG;
      var rsc3 = captureTable3.get(rep5);
      if (!rsc3) {
        rsc3 = Object.create(InputStream.prototype);
        Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
        Object.defineProperty(rsc3, symbolRscRep, { writable: true, value: rep5});
      }
      curResourceBorrows.push(rsc3);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.blockingSplice(rsc3, BigInt.asUintN(64, arg2))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant8 = ret;
      switch (variant8.tag) {
        case 'ok': {
          const e = variant8.val;
          dataView(memory0).setInt8(arg3 + 0, 0, true);
          dataView(memory0).setBigInt64(arg3 + 8, toUint64(e), true);
          break;
        }
        case 'err': {
          const e = variant8.val;
          dataView(memory0).setInt8(arg3 + 0, 1, true);
          var variant7 = e;
          switch (variant7.tag) {
            case 'last-operation-failed': {
              const e = variant7.val;
              dataView(memory0).setInt8(arg3 + 8, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle6 = e[symbolRscHandle];
              if (!handle6) {
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle6 = rscTableCreateOwn(handleTable14, rep);
              }
              dataView(memory0).setInt32(arg3 + 12, handle6, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg3 + 8, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant7.tag)}\` (received \`${variant7}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline94(arg0, arg1, arg2) {
      var len3 = arg1;
      var base3 = arg0;
      var result3 = [];
      for (let i = 0; i < len3; i++) {
        const base = base3 + i * 4;
        var handle1 = dataView(memory0).getInt32(base + 0, true);
        var rep2 = handleTable13[(handle1 << 1) + 1] & ~T_FLAG;
        var rsc0 = captureTable2.get(rep2);
        if (!rsc0) {
          rsc0 = Object.create(Pollable.prototype);
          Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
          Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
        }
        curResourceBorrows.push(rsc0);
        result3.push(rsc0);
      }
      const ret = poll(result3);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var val4 = ret;
      var len4 = val4.length;
      var ptr4 = realloc0(0, 0, 4, len4 * 4);
      var src4 = new Uint8Array(val4.buffer, val4.byteOffset, len4 * 4);
      (new Uint8Array(memory0.buffer, ptr4, len4 * 4)).set(src4);
      dataView(memory0).setInt32(arg2 + 4, len4, true);
      dataView(memory0).setInt32(arg2 + 0, ptr4, true);
    }
    
    function trampoline95(arg0) {
      const ret = getEnvironment();
      var vec3 = ret;
      var len3 = vec3.length;
      var result3 = realloc0(0, 0, 4, len3 * 16);
      for (let i = 0; i < vec3.length; i++) {
        const e = vec3[i];
        const base = result3 + i * 16;var [tuple0_0, tuple0_1] = e;
        var ptr1 = utf8Encode(tuple0_0, realloc0, memory0);
        var len1 = utf8EncodedLen;
        dataView(memory0).setInt32(base + 4, len1, true);
        dataView(memory0).setInt32(base + 0, ptr1, true);
        var ptr2 = utf8Encode(tuple0_1, realloc0, memory0);
        var len2 = utf8EncodedLen;
        dataView(memory0).setInt32(base + 12, len2, true);
        dataView(memory0).setInt32(base + 8, ptr2, true);
      }
      dataView(memory0).setInt32(arg0 + 4, len3, true);
      dataView(memory0).setInt32(arg0 + 0, result3, true);
    }
    
    function trampoline96(arg0) {
      const ret = getArguments();
      var vec1 = ret;
      var len1 = vec1.length;
      var result1 = realloc0(0, 0, 4, len1 * 8);
      for (let i = 0; i < vec1.length; i++) {
        const e = vec1[i];
        const base = result1 + i * 8;var ptr0 = utf8Encode(e, realloc0, memory0);
        var len0 = utf8EncodedLen;
        dataView(memory0).setInt32(base + 4, len0, true);
        dataView(memory0).setInt32(base + 0, ptr0, true);
      }
      dataView(memory0).setInt32(arg0 + 4, len1, true);
      dataView(memory0).setInt32(arg0 + 0, result1, true);
    }
    
    function trampoline97(arg0) {
      const ret = initialCwd();
      var variant1 = ret;
      if (variant1 === null || variant1=== undefined) {
        dataView(memory0).setInt8(arg0 + 0, 0, true);
      } else {
        const e = variant1;
        dataView(memory0).setInt8(arg0 + 0, 1, true);
        var ptr0 = utf8Encode(e, realloc0, memory0);
        var len0 = utf8EncodedLen;
        dataView(memory0).setInt32(arg0 + 8, len0, true);
        dataView(memory0).setInt32(arg0 + 4, ptr0, true);
      }
    }
    
    function trampoline98(arg0) {
      const ret = getDirectories();
      var vec3 = ret;
      var len3 = vec3.length;
      var result3 = realloc0(0, 0, 4, len3 * 12);
      for (let i = 0; i < vec3.length; i++) {
        const e = vec3[i];
        const base = result3 + i * 12;var [tuple0_0, tuple0_1] = e;
        if (!(tuple0_0 instanceof Descriptor)) {
          throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
        }
        var handle1 = tuple0_0[symbolRscHandle];
        if (!handle1) {
          const rep = tuple0_0[symbolRscRep] || ++captureCnt7;
          captureTable7.set(rep, tuple0_0);
          handle1 = rscTableCreateOwn(handleTable9, rep);
        }
        dataView(memory0).setInt32(base + 0, handle1, true);
        var ptr2 = utf8Encode(tuple0_1, realloc0, memory0);
        var len2 = utf8EncodedLen;
        dataView(memory0).setInt32(base + 8, len2, true);
        dataView(memory0).setInt32(base + 4, ptr2, true);
      }
      dataView(memory0).setInt32(arg0 + 4, len3, true);
      dataView(memory0).setInt32(arg0 + 0, result3, true);
    }
    const handleTable15 = [T_FLAG, 0];
    const captureTable5= new Map();
    let captureCnt5 = 0;
    handleTables[15] = handleTable15;
    
    function trampoline99(arg0) {
      const ret = getTerminalStdin();
      var variant1 = ret;
      if (variant1 === null || variant1=== undefined) {
        dataView(memory0).setInt8(arg0 + 0, 0, true);
      } else {
        const e = variant1;
        dataView(memory0).setInt8(arg0 + 0, 1, true);
        if (!(e instanceof TerminalInput)) {
          throw new TypeError('Resource error: Not a valid "TerminalInput" resource.');
        }
        var handle0 = e[symbolRscHandle];
        if (!handle0) {
          const rep = e[symbolRscRep] || ++captureCnt5;
          captureTable5.set(rep, e);
          handle0 = rscTableCreateOwn(handleTable15, rep);
        }
        dataView(memory0).setInt32(arg0 + 4, handle0, true);
      }
    }
    const handleTable16 = [T_FLAG, 0];
    const captureTable6= new Map();
    let captureCnt6 = 0;
    handleTables[16] = handleTable16;
    
    function trampoline100(arg0) {
      const ret = getTerminalStdout();
      var variant1 = ret;
      if (variant1 === null || variant1=== undefined) {
        dataView(memory0).setInt8(arg0 + 0, 0, true);
      } else {
        const e = variant1;
        dataView(memory0).setInt8(arg0 + 0, 1, true);
        if (!(e instanceof TerminalOutput)) {
          throw new TypeError('Resource error: Not a valid "TerminalOutput" resource.');
        }
        var handle0 = e[symbolRscHandle];
        if (!handle0) {
          const rep = e[symbolRscRep] || ++captureCnt6;
          captureTable6.set(rep, e);
          handle0 = rscTableCreateOwn(handleTable16, rep);
        }
        dataView(memory0).setInt32(arg0 + 4, handle0, true);
      }
    }
    
    function trampoline101(arg0) {
      const ret = getTerminalStderr();
      var variant1 = ret;
      if (variant1 === null || variant1=== undefined) {
        dataView(memory0).setInt8(arg0 + 0, 0, true);
      } else {
        const e = variant1;
        dataView(memory0).setInt8(arg0 + 0, 1, true);
        if (!(e instanceof TerminalOutput)) {
          throw new TypeError('Resource error: Not a valid "TerminalOutput" resource.');
        }
        var handle0 = e[symbolRscHandle];
        if (!handle0) {
          const rep = e[symbolRscRep] || ++captureCnt6;
          captureTable6.set(rep, e);
          handle0 = rscTableCreateOwn(handleTable16, rep);
        }
        dataView(memory0).setInt32(arg0 + 4, handle0, true);
      }
    }
    let exports2;
    let exports3;
    let exports4;
    let exports5;
    
    function trampoline112(arg0) {
      let variant0;
      if (arg0) {
        variant0= {
          tag: 'err',
          val: undefined
        };
      } else {
        variant0= {
          tag: 'ok',
          val: undefined
        };
      }
      exit(variant0);
    }
    let exports6;
    let exports7;
    let exports8;
    let exports9;
    let exports10;
    let exports11;
    let exports12;
    let exports13;
    let exports14;
    let exports15;
    let exports16;
    let exports17;
    let exports18;
    let exports19;
    let exports20;
    let exports21;
    let exports22;
    let exports23;
    let exports24;
    let exports25;
    let exports26;
    let exports27;
    let exports28;
    let exports29;
    let exports30;
    let exports31;
    let exports32;
    let exports33;
    let exports34;
    let exports35;
    let exports36;
    let exports37;
    let exports38;
    let exports39;
    let exports40;
    let exports41;
    let exports42;
    let exports43;
    let exports44;
    let exports45;
    let exports46;
    let exports47;
    let exports48;
    let exports49;
    let exports50;
    let exports51;
    let exports52;
    let exports53;
    let exports54;
    let exports55;
    let exports56;
    let exports57;
    let exports58;
    let exports59;
    let exports60;
    let exports61;
    let exports62;
    let exports63;
    let exports64;
    let exports65;
    let exports66;
    let exports67;
    let exports68;
    let exports69;
    let exports70;
    let exports71;
    let exports72;
    let exports73;
    let exports74;
    let exports75;
    let exports76;
    let exports77;
    let exports78;
    let exports79;
    let exports80;
    let exports81;
    let exports82;
    let exports83;
    let exports84;
    let exports85;
    let exports86;
    let exports87;
    let exports88;
    let exports89;
    let exports90;
    let exports91;
    let exports92;
    let exports93;
    let exports94;
    let exports95;
    let exports96;
    let exports97;
    const handleTable135 = [T_FLAG, 0];
    const captureTable0= new Map();
    let captureCnt0 = 0;
    handleTables[135] = handleTable135;
    
    function trampoline119(arg0) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = isJs(rsc0);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      return ret ? 1 : 0;
    }
    
    function trampoline120(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var handle4 = arg1;
      var rep5 = handleTable135[(handle4 << 1) + 1] & ~T_FLAG;
      var rsc3 = captureTable0.get(rep5);
      if (!rsc3) {
        rsc3 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
        Object.defineProperty(rsc3, symbolRscRep, { writable: true, value: rep5});
      }
      curResourceBorrows.push(rsc3);
      const ret = instanceOf(rsc0, rsc3);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      return ret ? 1 : 0;
    }
    
    function trampoline121() {
      const ret = globalThis();
      if (!(ret instanceof JsAbiValue)) {
        throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable135, rep);
      }
      return handle0;
    }
    
    function trampoline122(arg0) {
      const ret = intToJsNumber(arg0);
      if (!(ret instanceof JsAbiValue)) {
        throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable135, rep);
      }
      return handle0;
    }
    
    function trampoline123(arg0) {
      const ret = floatToJsNumber(arg0);
      if (!(ret instanceof JsAbiValue)) {
        throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable135, rep);
      }
      return handle0;
    }
    
    function trampoline124(arg0) {
      var bool0 = arg0;
      const ret = boolToJsBool(!!bool0);
      if (!(ret instanceof JsAbiValue)) {
        throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
      }
      var handle1 = ret[symbolRscHandle];
      if (!handle1) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle1 = rscTableCreateOwn(handleTable135, rep);
      }
      return handle1;
    }
    
    function trampoline125() {
      const ret = procToJsFunction();
      if (!(ret instanceof JsAbiValue)) {
        throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable135, rep);
      }
      return handle0;
    }
    
    function trampoline126() {
      const ret = rbObjectToJsRbValue();
      if (!(ret instanceof JsAbiValue)) {
        throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable135, rep);
      }
      return handle0;
    }
    
    function trampoline127(arg0) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      exportJsValueToHost(rsc0);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
    }
    
    function trampoline128() {
      const ret = importJsValueFromHost();
      if (!(ret instanceof JsAbiValue)) {
        throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable135, rep);
      }
      return handle0;
    }
    
    function trampoline129(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var handle4 = arg1;
      var rep5 = handleTable135[(handle4 << 1) + 1] & ~T_FLAG;
      var rsc3 = captureTable0.get(rep5);
      if (!rsc3) {
        rsc3 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
        Object.defineProperty(rsc3, symbolRscRep, { writable: true, value: rep5});
      }
      curResourceBorrows.push(rsc3);
      const ret = jsValueEqual(rsc0, rsc3);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      return ret ? 1 : 0;
    }
    
    function trampoline130(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var handle4 = arg1;
      var rep5 = handleTable135[(handle4 << 1) + 1] & ~T_FLAG;
      var rsc3 = captureTable0.get(rep5);
      if (!rsc3) {
        rsc3 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
        Object.defineProperty(rsc3, symbolRscRep, { writable: true, value: rep5});
      }
      curResourceBorrows.push(rsc3);
      const ret = jsValueStrictlyEqual(rsc0, rsc3);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      return ret ? 1 : 0;
    }
    let exports98;
    let memory1;
    let exports99;
    let realloc1;
    let realloc2;
    
    function trampoline133(arg0) {
      const ret = now$1();
      var {seconds: v0_0, nanoseconds: v0_1 } = ret;
      dataView(memory1).setBigInt64(arg0 + 0, toUint64(v0_0), true);
      dataView(memory1).setInt32(arg0 + 8, toUint32(v0_1), true);
    }
    
    function trampoline134(arg0) {
      const ret = resolution$1();
      var {seconds: v0_0, nanoseconds: v0_1 } = ret;
      dataView(memory1).setBigInt64(arg0 + 0, toUint64(v0_0), true);
      dataView(memory1).setInt32(arg0 + 8, toUint32(v0_1), true);
    }
    
    function trampoline135(arg0, arg1) {
      const ret = getRandomBytes(BigInt.asUintN(64, arg0));
      var val0 = ret;
      var len0 = val0.byteLength;
      var ptr0 = realloc1(0, 0, 1, len0 * 1);
      var src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory1.buffer, ptr0, len0 * 1)).set(src0);
      dataView(memory1).setInt32(arg1 + 4, len0, true);
      dataView(memory1).setInt32(arg1 + 0, ptr0, true);
    }
    
    function trampoline136(arg0, arg1, arg2) {
      var ptr0 = arg0;
      var len0 = arg1;
      var result0 = utf8Decoder.decode(new Uint8Array(memory1.buffer, ptr0, len0));
      const ret = evalJs(result0);
      var variant3 = ret;
      switch (variant3.tag) {
        case 'success': {
          const e = variant3.val;
          dataView(memory1).setInt8(arg2 + 0, 0, true);
          if (!(e instanceof JsAbiValue)) {
            throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
          }
          var handle1 = e[symbolRscHandle];
          if (!handle1) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle1 = rscTableCreateOwn(handleTable135, rep);
          }
          dataView(memory1).setInt32(arg2 + 4, handle1, true);
          break;
        }
        case 'failure': {
          const e = variant3.val;
          dataView(memory1).setInt8(arg2 + 0, 1, true);
          if (!(e instanceof JsAbiValue)) {
            throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
          }
          var handle2 = e[symbolRscHandle];
          if (!handle2) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle2 = rscTableCreateOwn(handleTable135, rep);
          }
          dataView(memory1).setInt32(arg2 + 4, handle2, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant3.tag)}\` (received \`${variant3}\`) specified for \`JsAbiResult\``);
        }
      }
    }
    
    function trampoline137(arg0, arg1) {
      var ptr0 = arg0;
      var len0 = arg1;
      var result0 = utf8Decoder.decode(new Uint8Array(memory1.buffer, ptr0, len0));
      const ret = stringToJsString(result0);
      if (!(ret instanceof JsAbiValue)) {
        throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
      }
      var handle1 = ret[symbolRscHandle];
      if (!handle1) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle1 = rscTableCreateOwn(handleTable135, rep);
      }
      return handle1;
    }
    
    function trampoline138(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = jsValueToString(rsc0);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var ptr3 = utf8Encode(ret, realloc2, memory1);
      var len3 = utf8EncodedLen;
      dataView(memory1).setInt32(arg1 + 4, len3, true);
      dataView(memory1).setInt32(arg1 + 0, ptr3, true);
    }
    
    function trampoline139(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = jsValueToInteger(rsc0);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant4 = ret;
      switch (variant4.tag) {
        case 'as-float': {
          const e = variant4.val;
          dataView(memory1).setInt8(arg1 + 0, 0, true);
          dataView(memory1).setFloat64(arg1 + 8, +e, true);
          break;
        }
        case 'bignum': {
          const e = variant4.val;
          dataView(memory1).setInt8(arg1 + 0, 1, true);
          var ptr3 = utf8Encode(e, realloc2, memory1);
          var len3 = utf8EncodedLen;
          dataView(memory1).setInt32(arg1 + 12, len3, true);
          dataView(memory1).setInt32(arg1 + 8, ptr3, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`RawInteger\``);
        }
      }
    }
    
    function trampoline140(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = jsValueTypeof(rsc0);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var ptr3 = utf8Encode(ret, realloc2, memory1);
      var len3 = utf8EncodedLen;
      dataView(memory1).setInt32(arg1 + 4, len3, true);
      dataView(memory1).setInt32(arg1 + 0, ptr3, true);
    }
    
    function trampoline141(arg0, arg1, arg2, arg3, arg4) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var handle4 = arg1;
      var rep5 = handleTable135[(handle4 << 1) + 1] & ~T_FLAG;
      var rsc3 = captureTable0.get(rep5);
      if (!rsc3) {
        rsc3 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
        Object.defineProperty(rsc3, symbolRscRep, { writable: true, value: rep5});
      }
      curResourceBorrows.push(rsc3);
      var len9 = arg3;
      var base9 = arg2;
      var result9 = [];
      for (let i = 0; i < len9; i++) {
        const base = base9 + i * 4;
        var handle7 = dataView(memory1).getInt32(base + 0, true);
        var rep8 = handleTable135[(handle7 << 1) + 1] & ~T_FLAG;
        var rsc6 = captureTable0.get(rep8);
        if (!rsc6) {
          rsc6 = Object.create(JsAbiValue.prototype);
          Object.defineProperty(rsc6, symbolRscHandle, { writable: true, value: handle7});
          Object.defineProperty(rsc6, symbolRscRep, { writable: true, value: rep8});
        }
        curResourceBorrows.push(rsc6);
        result9.push(rsc6);
      }
      const ret = reflectApply(rsc0, rsc3, result9);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant12 = ret;
      switch (variant12.tag) {
        case 'success': {
          const e = variant12.val;
          dataView(memory1).setInt8(arg4 + 0, 0, true);
          if (!(e instanceof JsAbiValue)) {
            throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
          }
          var handle10 = e[symbolRscHandle];
          if (!handle10) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle10 = rscTableCreateOwn(handleTable135, rep);
          }
          dataView(memory1).setInt32(arg4 + 4, handle10, true);
          break;
        }
        case 'failure': {
          const e = variant12.val;
          dataView(memory1).setInt8(arg4 + 0, 1, true);
          if (!(e instanceof JsAbiValue)) {
            throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
          }
          var handle11 = e[symbolRscHandle];
          if (!handle11) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle11 = rscTableCreateOwn(handleTable135, rep);
          }
          dataView(memory1).setInt32(arg4 + 4, handle11, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant12.tag)}\` (received \`${variant12}\`) specified for \`JsAbiResult\``);
        }
      }
    }
    
    function trampoline142(arg0, arg1, arg2, arg3) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var ptr3 = arg1;
      var len3 = arg2;
      var result3 = utf8Decoder.decode(new Uint8Array(memory1.buffer, ptr3, len3));
      const ret = reflectGet(rsc0, result3);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant6 = ret;
      switch (variant6.tag) {
        case 'success': {
          const e = variant6.val;
          dataView(memory1).setInt8(arg3 + 0, 0, true);
          if (!(e instanceof JsAbiValue)) {
            throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
          }
          var handle4 = e[symbolRscHandle];
          if (!handle4) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle4 = rscTableCreateOwn(handleTable135, rep);
          }
          dataView(memory1).setInt32(arg3 + 4, handle4, true);
          break;
        }
        case 'failure': {
          const e = variant6.val;
          dataView(memory1).setInt8(arg3 + 0, 1, true);
          if (!(e instanceof JsAbiValue)) {
            throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
          }
          var handle5 = e[symbolRscHandle];
          if (!handle5) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle5 = rscTableCreateOwn(handleTable135, rep);
          }
          dataView(memory1).setInt32(arg3 + 4, handle5, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`JsAbiResult\``);
        }
      }
    }
    
    function trampoline143(arg0, arg1, arg2, arg3, arg4) {
      var handle1 = arg0;
      var rep2 = handleTable135[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var ptr3 = arg1;
      var len3 = arg2;
      var result3 = utf8Decoder.decode(new Uint8Array(memory1.buffer, ptr3, len3));
      var handle5 = arg3;
      var rep6 = handleTable135[(handle5 << 1) + 1] & ~T_FLAG;
      var rsc4 = captureTable0.get(rep6);
      if (!rsc4) {
        rsc4 = Object.create(JsAbiValue.prototype);
        Object.defineProperty(rsc4, symbolRscHandle, { writable: true, value: handle5});
        Object.defineProperty(rsc4, symbolRscRep, { writable: true, value: rep6});
      }
      curResourceBorrows.push(rsc4);
      const ret = reflectSet(rsc0, result3, rsc4);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant9 = ret;
      switch (variant9.tag) {
        case 'success': {
          const e = variant9.val;
          dataView(memory1).setInt8(arg4 + 0, 0, true);
          if (!(e instanceof JsAbiValue)) {
            throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
          }
          var handle7 = e[symbolRscHandle];
          if (!handle7) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle7 = rscTableCreateOwn(handleTable135, rep);
          }
          dataView(memory1).setInt32(arg4 + 4, handle7, true);
          break;
        }
        case 'failure': {
          const e = variant9.val;
          dataView(memory1).setInt8(arg4 + 0, 1, true);
          if (!(e instanceof JsAbiValue)) {
            throw new TypeError('Resource error: Not a valid "JsAbiValue" resource.');
          }
          var handle8 = e[symbolRscHandle];
          if (!handle8) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle8 = rscTableCreateOwn(handleTable135, rep);
          }
          dataView(memory1).setInt32(arg4 + 4, handle8, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant9.tag)}\` (received \`${variant9}\`) specified for \`JsAbiResult\``);
        }
      }
    }
    
    function trampoline144(arg0, arg1) {
      var ptr0 = arg0;
      var len0 = arg1;
      var result0 = utf8Decoder.decode(new Uint8Array(memory1.buffer, ptr0, len0));
      throwProhibitRewindException(result0);
    }
    let exports100;
    let exports101;
    let postReturn0;
    const handleTable17 = [T_FLAG, 0];
    const finalizationRegistry17 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable17, handle);
      exports0['31'](rep);
    });
    
    handleTables[17] = handleTable17;
    function trampoline0(handle) {
      const handleEntry = rscTableRemove(handleTable17, handle);
      if (handleEntry.own) {
        
        exports0['31'](handleEntry.rep);
      }
    }
    const handleTable18 = [T_FLAG, 0];
    const finalizationRegistry18 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable18, handle);
      exports0['32'](rep);
    });
    
    handleTables[18] = handleTable18;
    function trampoline1(handle) {
      const handleEntry = rscTableRemove(handleTable18, handle);
      if (handleEntry.own) {
        
        exports0['32'](handleEntry.rep);
      }
    }
    const handleTable25 = [T_FLAG, 0];
    const finalizationRegistry25 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable25, handle);
      exports0['40'](rep);
    });
    
    handleTables[25] = handleTable25;
    function trampoline2(handle) {
      const handleEntry = rscTableRemove(handleTable25, handle);
      if (handleEntry.own) {
        
        exports0['40'](handleEntry.rep);
      }
    }
    function trampoline3(handle) {
      const handleEntry = rscTableRemove(handleTable9, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable7.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable7.delete(handleEntry.rep);
        } else if (Descriptor[symbolCabiDispose]) {
          Descriptor[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    const handleTable19 = [T_FLAG, 0];
    const finalizationRegistry19 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable19, handle);
      exports0['33'](rep);
    });
    
    handleTables[19] = handleTable19;
    function trampoline4(handle) {
      const handleEntry = rscTableRemove(handleTable19, handle);
      if (handleEntry.own) {
        
        exports0['33'](handleEntry.rep);
      }
    }
    const handleTable30 = [T_FLAG, 0];
    const finalizationRegistry30 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable30, handle);
      exports0['46'](rep);
    });
    
    handleTables[30] = handleTable30;
    function trampoline5(handle) {
      const handleEntry = rscTableRemove(handleTable30, handle);
      if (handleEntry.own) {
        
        exports0['46'](handleEntry.rep);
      }
    }
    const handleTable33 = [T_FLAG, 0];
    const finalizationRegistry33 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable33, handle);
      exports0['49'](rep);
    });
    
    handleTables[33] = handleTable33;
    function trampoline6(handle) {
      const handleEntry = rscTableRemove(handleTable33, handle);
      if (handleEntry.own) {
        
        exports0['49'](handleEntry.rep);
      }
    }
    const handleTable20 = [T_FLAG, 0];
    const finalizationRegistry20 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable20, handle);
      exports0['34'](rep);
    });
    
    handleTables[20] = handleTable20;
    function trampoline7(handle) {
      const handleEntry = rscTableRemove(handleTable20, handle);
      if (handleEntry.own) {
        
        exports0['34'](handleEntry.rep);
      }
    }
    const handleTable27 = [T_FLAG, 0];
    const finalizationRegistry27 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable27, handle);
      exports0['43'](rep);
    });
    
    handleTables[27] = handleTable27;
    function trampoline8(handle) {
      const handleEntry = rscTableRemove(handleTable27, handle);
      if (handleEntry.own) {
        
        exports0['43'](handleEntry.rep);
      }
    }
    const handleTable26 = [T_FLAG, 0];
    const finalizationRegistry26 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable26, handle);
      exports0['42'](rep);
    });
    
    handleTables[26] = handleTable26;
    function trampoline9(handle) {
      const handleEntry = rscTableRemove(handleTable26, handle);
      if (handleEntry.own) {
        
        exports0['42'](handleEntry.rep);
      }
    }
    const handleTable37 = [T_FLAG, 0];
    const finalizationRegistry37 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable37, handle);
      exports0['53'](rep);
    });
    
    handleTables[37] = handleTable37;
    function trampoline10(handle) {
      const handleEntry = rscTableRemove(handleTable37, handle);
      if (handleEntry.own) {
        
        exports0['53'](handleEntry.rep);
      }
    }
    const handleTable32 = [T_FLAG, 0];
    const finalizationRegistry32 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable32, handle);
      exports0['48'](rep);
    });
    
    handleTables[32] = handleTable32;
    function trampoline11(handle) {
      const handleEntry = rscTableRemove(handleTable32, handle);
      if (handleEntry.own) {
        
        exports0['48'](handleEntry.rep);
      }
    }
    const handleTable36 = [T_FLAG, 0];
    const finalizationRegistry36 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable36, handle);
      exports0['52'](rep);
    });
    
    handleTables[36] = handleTable36;
    function trampoline12(handle) {
      const handleEntry = rscTableRemove(handleTable36, handle);
      if (handleEntry.own) {
        
        exports0['52'](handleEntry.rep);
      }
    }
    const trampoline13 = rscTableCreateOwn.bind(null, handleTable36);
    const trampoline14 = rscTableCreateOwn.bind(null, handleTable37);
    const trampoline15 = rscTableCreateOwn.bind(null, handleTable25);
    function trampoline16(handle) {
      return handleTable25[(handle << 1) + 1] & ~T_FLAG;
    }
    const trampoline17 = rscTableCreateOwn.bind(null, handleTable30);
    const trampoline18 = rscTableCreateOwn.bind(null, handleTable33);
    const trampoline19 = rscTableCreateOwn.bind(null, handleTable17);
    const trampoline20 = rscTableCreateOwn.bind(null, handleTable18);
    const trampoline21 = rscTableCreateOwn.bind(null, handleTable19);
    const trampoline22 = rscTableCreateOwn.bind(null, handleTable20);
    function trampoline23(handle) {
      const handleEntry = rscTableRemove(handleTable14, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable1.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable1.delete(handleEntry.rep);
        } else if (Error$1[symbolCabiDispose]) {
          Error$1[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline26(handle) {
      const handleEntry = rscTableRemove(handleTable13, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable2.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable2.delete(handleEntry.rep);
        } else if (Pollable[symbolCabiDispose]) {
          Pollable[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline29(handle) {
      const handleEntry = rscTableRemove(handleTable11, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable3.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable3.delete(handleEntry.rep);
        } else if (InputStream[symbolCabiDispose]) {
          InputStream[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline30(handle) {
      const handleEntry = rscTableRemove(handleTable12, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable4.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable4.delete(handleEntry.rep);
        } else if (OutputStream[symbolCabiDispose]) {
          OutputStream[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline31(handle) {
      return handleTable19[(handle << 1) + 1] & ~T_FLAG;
    }
    const handleTable38 = [T_FLAG, 0];
    const finalizationRegistry38 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable38, handle);
      exports0['54'](rep);
    });
    
    handleTables[38] = handleTable38;
    const trampoline32 = rscTableCreateOwn.bind(null, handleTable38);
    function trampoline33(handle) {
      const handleEntry = rscTableRemove(handleTable38, handle);
      if (handleEntry.own) {
        
        exports0['54'](handleEntry.rep);
      }
    }
    function trampoline35(handle) {
      const handleEntry = rscTableRemove(handleTable10, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable8.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable8.delete(handleEntry.rep);
        } else if (DirectoryEntryStream[symbolCabiDispose]) {
          DirectoryEntryStream[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline39(handle) {
      const handleEntry = rscTableRemove(handleTable15, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable5.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable5.delete(handleEntry.rep);
        } else if (TerminalInput[symbolCabiDispose]) {
          TerminalInput[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline40(handle) {
      const handleEntry = rscTableRemove(handleTable16, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable6.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable6.delete(handleEntry.rep);
        } else if (TerminalOutput[symbolCabiDispose]) {
          TerminalOutput[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    const handleTable35 = [T_FLAG, 0];
    const finalizationRegistry35 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable35, handle);
      exports0['51'](rep);
    });
    
    handleTables[35] = handleTable35;
    const trampoline41 = rscTableCreateOwn.bind(null, handleTable35);
    function trampoline42(handle) {
      const handleEntry = rscTableRemove(handleTable35, handle);
      if (handleEntry.own) {
        
        exports0['51'](handleEntry.rep);
      }
    }
    const trampoline47 = rscTableCreateOwn.bind(null, handleTable26);
    const trampoline48 = rscTableCreateOwn.bind(null, handleTable27);
    const handleTable28 = [T_FLAG, 0];
    const finalizationRegistry28 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable28, handle);
      exports0['44'](rep);
    });
    
    handleTables[28] = handleTable28;
    function trampoline49(handle) {
      return handleTable28[(handle << 1) + 1] & ~T_FLAG;
    }
    function trampoline50(handle) {
      const handleEntry = rscTableRemove(handleTable28, handle);
      if (handleEntry.own) {
        
        exports0['44'](handleEntry.rep);
      }
    }
    function trampoline51(handle) {
      return handleTable32[(handle << 1) + 1] & ~T_FLAG;
    }
    function trampoline52(handle) {
      return handleTable30[(handle << 1) + 1] & ~T_FLAG;
    }
    const handleTable31 = [T_FLAG, 0];
    const finalizationRegistry31 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable31, handle);
      exports0['47'](rep);
    });
    
    handleTables[31] = handleTable31;
    const trampoline53 = rscTableCreateOwn.bind(null, handleTable31);
    function trampoline54(handle) {
      const handleEntry = rscTableRemove(handleTable31, handle);
      if (handleEntry.own) {
        
        exports0['47'](handleEntry.rep);
      }
    }
    const trampoline55 = rscTableCreateOwn.bind(null, handleTable32);
    function trampoline56(handle) {
      return handleTable33[(handle << 1) + 1] & ~T_FLAG;
    }
    const handleTable29 = [T_FLAG, 0];
    const finalizationRegistry29 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable29, handle);
      exports0['45'](rep);
    });
    
    handleTables[29] = handleTable29;
    const trampoline57 = rscTableCreateOwn.bind(null, handleTable29);
    function trampoline58(handle) {
      const handleEntry = rscTableRemove(handleTable29, handle);
      if (handleEntry.own) {
        
        exports0['45'](handleEntry.rep);
      }
    }
    function trampoline59(handle) {
      return handleTable26[(handle << 1) + 1] & ~T_FLAG;
    }
    function trampoline60(handle) {
      return handleTable27[(handle << 1) + 1] & ~T_FLAG;
    }
    const handleTable34 = [T_FLAG, 0];
    const finalizationRegistry34 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable34, handle);
      exports0['50'](rep);
    });
    
    handleTables[34] = handleTable34;
    const trampoline61 = rscTableCreateOwn.bind(null, handleTable34);
    function trampoline62(handle) {
      const handleEntry = rscTableRemove(handleTable34, handle);
      if (handleEntry.own) {
        
        exports0['50'](handleEntry.rep);
      }
    }
    const handleTable21 = [T_FLAG, 0];
    const finalizationRegistry21 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable21, handle);
      exports0['35'](rep);
    });
    
    handleTables[21] = handleTable21;
    const trampoline63 = rscTableCreateOwn.bind(null, handleTable21);
    function trampoline64(handle) {
      const handleEntry = rscTableRemove(handleTable21, handle);
      if (handleEntry.own) {
        
        exports0['35'](handleEntry.rep);
      }
    }
    const handleTable22 = [T_FLAG, 0];
    const finalizationRegistry22 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable22, handle);
      exports0['36'](rep);
    });
    
    handleTables[22] = handleTable22;
    const trampoline65 = rscTableCreateOwn.bind(null, handleTable22);
    function trampoline66(handle) {
      const handleEntry = rscTableRemove(handleTable22, handle);
      if (handleEntry.own) {
        
        exports0['36'](handleEntry.rep);
      }
    }
    const handleTable23 = [T_FLAG, 0];
    const finalizationRegistry23 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable23, handle);
      exports0['38'](rep);
    });
    
    handleTables[23] = handleTable23;
    const trampoline67 = rscTableCreateOwn.bind(null, handleTable23);
    const handleTable24 = [T_FLAG, 0];
    const finalizationRegistry24 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable24, handle);
      exports0['39'](rep);
    });
    
    handleTables[24] = handleTable24;
    const trampoline68 = rscTableCreateOwn.bind(null, handleTable24);
    function trampoline69(handle) {
      const handleEntry = rscTableRemove(handleTable24, handle);
      if (handleEntry.own) {
        
        exports0['39'](handleEntry.rep);
      }
    }
    function trampoline70(handle) {
      const handleEntry = rscTableRemove(handleTable23, handle);
      if (handleEntry.own) {
        
        exports0['38'](handleEntry.rep);
      }
    }
    const trampoline102 = resourceTransferOwn;
    function trampoline103() {
      scopeId++;
    }
    const trampoline104 = resourceTransferBorrowValidLifting;
    function trampoline105() {
      scopeId--;
      for (const { rid, handle } of resourceCallBorrows) {
        if (handleTables[rid][handle << 1] === scopeId)
        throw new TypeError('borrows not dropped for resource call');
      }
      resourceCallBorrows= [];
    }
    const handleTable129 = [T_FLAG, 0];
    const finalizationRegistry129 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable129, handle);
      exports0['54'](rep);
    });
    
    handleTables[129] = handleTable129;
    function trampoline106(handle) {
      const handleEntry = rscTableRemove(handleTable129, handle);
      if (handleEntry.own) {
        
        exports0['54'](handleEntry.rep);
      }
    }
    const handleTable130 = [T_FLAG, 0];
    const finalizationRegistry130 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable130, handle);
      exports0['31'](rep);
    });
    
    handleTables[130] = handleTable130;
    function trampoline107(handle) {
      const handleEntry = rscTableRemove(handleTable130, handle);
      if (handleEntry.own) {
        
        exports0['31'](handleEntry.rep);
      }
    }
    const handleTable131 = [T_FLAG, 0];
    const finalizationRegistry131 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable131, handle);
      exports0['33'](rep);
    });
    
    handleTables[131] = handleTable131;
    function trampoline108(handle) {
      const handleEntry = rscTableRemove(handleTable131, handle);
      if (handleEntry.own) {
        
        exports0['33'](handleEntry.rep);
      }
    }
    const handleTable132 = [T_FLAG, 0];
    const finalizationRegistry132 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable132, handle);
      exports0['34'](rep);
    });
    
    handleTables[132] = handleTable132;
    function trampoline109(handle) {
      const handleEntry = rscTableRemove(handleTable132, handle);
      if (handleEntry.own) {
        
        exports0['34'](handleEntry.rep);
      }
    }
    const handleTable128 = [T_FLAG, 0];
    const finalizationRegistry128 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable128, handle);
      exports0['53'](rep);
    });
    
    handleTables[128] = handleTable128;
    function trampoline110(handle) {
      const handleEntry = rscTableRemove(handleTable128, handle);
      if (handleEntry.own) {
        
        exports0['53'](handleEntry.rep);
      }
    }
    const handleTable127 = [T_FLAG, 0];
    const finalizationRegistry127 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable127, handle);
      exports0['32'](rep);
    });
    
    handleTables[127] = handleTable127;
    function trampoline111(handle) {
      const handleEntry = rscTableRemove(handleTable127, handle);
      if (handleEntry.own) {
        
        exports0['32'](handleEntry.rep);
      }
    }
    const handleTable133 = [T_FLAG, 0];
    const finalizationRegistry133 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable133, handle);
      exports0['51'](rep);
    });
    
    handleTables[133] = handleTable133;
    function trampoline113(handle) {
      const handleEntry = rscTableRemove(handleTable133, handle);
      if (handleEntry.own) {
        
        exports0['51'](handleEntry.rep);
      }
    }
    const handleTable134 = [T_FLAG, 0];
    const finalizationRegistry134 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable134, handle);
      exports0['52'](rep);
    });
    
    handleTables[134] = handleTable134;
    function trampoline114(handle) {
      const handleEntry = rscTableRemove(handleTable134, handle);
      if (handleEntry.own) {
        
        exports0['52'](handleEntry.rep);
      }
    }
    function trampoline115(handle) {
      const handleEntry = rscTableRemove(handleTable135, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable0.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable0.delete(handleEntry.rep);
        } else if (JsAbiValue[symbolCabiDispose]) {
          JsAbiValue[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    const handleTable136 = [T_FLAG, 0];
    const finalizationRegistry136 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable136, handle);
    });
    
    handleTables[136] = handleTable136;
    function trampoline116(handle) {
      const handleEntry = rscTableRemove(handleTable136, handle);
      if (handleEntry.own) {
        
      }
    }
    const trampoline117 = rscTableCreateOwn.bind(null, handleTable136);
    function trampoline118(handle) {
      return handleTable136[(handle << 1) + 1] & ~T_FLAG;
    }
    function trampoline131(from_ptr, len, to_ptr) {
      new Uint8Array(memory1.buffer, to_ptr, len).set(new Uint8Array(memory0.buffer, from_ptr, len));
    }
    
    function trampoline132(from_ptr, len, to_ptr) {
      new Uint8Array(memory0.buffer, to_ptr, len).set(new Uint8Array(memory1.buffer, from_ptr, len));
    }
    
    Promise.all([module0, module1, module2, module3, module4, module5, module6, module7, module8, module9, module10, module11, module12, module13, module14, module15, module16, module17, module18, module19, module20, module21, module22, module23, module24, module25, module26, module27, module28, module29, module30, module31, module32, module33, module34, module35, module36, module37, module38, module39, module40, module41, module42, module43, module44, module45, module46, module47, module48, module49, module50, module51, module52, module53, module54, module55, module56, module57, module58, module59, module60, module61, module62, module63, module64, module65, module66, module67, module68, module69, module70, module71, module72, module73, module74, module75, module76, module77, module78, module79, module80, module81, module82, module83, module84, module85, module86, module87, module88, module89, module90, module91, module92, module93, module94, module95, module96, module97, module98, module99, module100, module101]).catch(() => {});
    ({ exports: exports0 } = yield instantiateCore(yield module98));
    ({ exports: exports1 } = yield instantiateCore(yield module97, {
      '[export]wasi:cli/terminal-input@0.2.0': {
        '[resource-drop]terminal-input': trampoline42,
        '[resource-new]terminal-input': trampoline41,
      },
      '[export]wasi:cli/terminal-output@0.2.0': {
        '[resource-drop]terminal-output': trampoline12,
        '[resource-new]terminal-output': trampoline13,
      },
      '[export]wasi:filesystem/types@0.2.0': {
        '[resource-drop]descriptor': trampoline10,
        '[resource-drop]directory-entry-stream': trampoline33,
        '[resource-new]descriptor': trampoline14,
        '[resource-new]directory-entry-stream': trampoline32,
      },
      '[export]wasi:http/types@0.2.0': {
        '[resource-drop]fields': trampoline2,
        '[resource-drop]future-incoming-response': trampoline62,
        '[resource-drop]future-trailers': trampoline54,
        '[resource-drop]incoming-body': trampoline5,
        '[resource-drop]incoming-response': trampoline58,
        '[resource-drop]outgoing-body': trampoline6,
        '[resource-drop]outgoing-request': trampoline9,
        '[resource-drop]outgoing-response': trampoline11,
        '[resource-drop]request-options': trampoline8,
        '[resource-drop]response-outparam': trampoline50,
        '[resource-new]fields': trampoline15,
        '[resource-new]future-incoming-response': trampoline61,
        '[resource-new]future-trailers': trampoline53,
        '[resource-new]incoming-body': trampoline17,
        '[resource-new]incoming-response': trampoline57,
        '[resource-new]outgoing-body': trampoline18,
        '[resource-new]outgoing-request': trampoline47,
        '[resource-new]outgoing-response': trampoline55,
        '[resource-new]request-options': trampoline48,
        '[resource-rep]fields': trampoline16,
        '[resource-rep]incoming-body': trampoline52,
        '[resource-rep]outgoing-body': trampoline56,
        '[resource-rep]outgoing-request': trampoline59,
        '[resource-rep]outgoing-response': trampoline51,
        '[resource-rep]request-options': trampoline60,
        '[resource-rep]response-outparam': trampoline49,
      },
      '[export]wasi:io/error@0.2.0': {
        '[resource-drop]error': trampoline0,
        '[resource-new]error': trampoline19,
      },
      '[export]wasi:io/poll@0.2.0': {
        '[resource-drop]pollable': trampoline1,
        '[resource-new]pollable': trampoline20,
      },
      '[export]wasi:io/streams@0.2.0': {
        '[resource-drop]input-stream': trampoline4,
        '[resource-drop]output-stream': trampoline7,
        '[resource-new]input-stream': trampoline21,
        '[resource-new]output-stream': trampoline22,
        '[resource-rep]input-stream': trampoline31,
      },
      '[export]wasi:sockets/ip-name-lookup@0.2.0': {
        '[resource-drop]resolve-address-stream': trampoline64,
        '[resource-new]resolve-address-stream': trampoline63,
      },
      '[export]wasi:sockets/tcp@0.2.0': {
        '[resource-drop]tcp-socket': trampoline66,
        '[resource-new]tcp-socket': trampoline65,
      },
      '[export]wasi:sockets/udp@0.2.0': {
        '[resource-drop]incoming-datagram-stream': trampoline70,
        '[resource-drop]outgoing-datagram-stream': trampoline69,
        '[resource-new]incoming-datagram-stream': trampoline67,
        '[resource-new]outgoing-datagram-stream': trampoline68,
      },
      'wasi:cli/environment@0.2.0': {
        'get-arguments': exports0['25'],
        'get-environment': exports0['24'],
        'initial-cwd': exports0['26'],
      },
      'wasi:cli/stderr@0.2.0': {
        'get-stderr': trampoline38,
      },
      'wasi:cli/stdin@0.2.0': {
        'get-stdin': trampoline36,
      },
      'wasi:cli/stdout@0.2.0': {
        'get-stdout': trampoline37,
      },
      'wasi:cli/terminal-input@0.2.0': {
        '[resource-drop]terminal-input': trampoline39,
      },
      'wasi:cli/terminal-output@0.2.0': {
        '[resource-drop]terminal-output': trampoline40,
      },
      'wasi:cli/terminal-stderr@0.2.0': {
        'get-terminal-stderr': exports0['30'],
      },
      'wasi:cli/terminal-stdin@0.2.0': {
        'get-terminal-stdin': exports0['28'],
      },
      'wasi:cli/terminal-stdout@0.2.0': {
        'get-terminal-stdout': exports0['29'],
      },
      'wasi:clocks/monotonic-clock@0.2.0': {
        now: trampoline43,
        resolution: trampoline44,
        'subscribe-duration': trampoline46,
        'subscribe-instant': trampoline45,
      },
      'wasi:filesystem/preopens@0.2.0': {
        'get-directories': exports0['27'],
      },
      'wasi:filesystem/types@0.2.0': {
        '[method]descriptor.get-type': exports0['1'],
        '[method]descriptor.is-same-object': trampoline34,
        '[method]descriptor.metadata-hash': exports0['7'],
        '[method]descriptor.metadata-hash-at': exports0['8'],
        '[method]descriptor.open-at': exports0['5'],
        '[method]descriptor.read-directory': exports0['2'],
        '[method]descriptor.read-via-stream': exports0['0'],
        '[method]descriptor.readlink-at': exports0['6'],
        '[method]descriptor.stat': exports0['3'],
        '[method]descriptor.stat-at': exports0['4'],
        '[method]directory-entry-stream.read-directory-entry': exports0['9'],
        '[resource-drop]descriptor': trampoline3,
        '[resource-drop]directory-entry-stream': trampoline35,
      },
      'wasi:io/error@0.2.0': {
        '[resource-drop]error': trampoline23,
      },
      'wasi:io/poll@0.2.0': {
        '[method]pollable.block': trampoline25,
        '[method]pollable.ready': trampoline24,
        '[resource-drop]pollable': trampoline26,
        poll: exports0['23'],
      },
      'wasi:io/streams@0.2.0': {
        '[method]input-stream.blocking-read': exports0['11'],
        '[method]input-stream.blocking-skip': exports0['13'],
        '[method]input-stream.read': exports0['10'],
        '[method]input-stream.skip': exports0['12'],
        '[method]input-stream.subscribe': trampoline27,
        '[method]output-stream.blocking-flush': exports0['18'],
        '[method]output-stream.blocking-splice': exports0['22'],
        '[method]output-stream.blocking-write-and-flush': exports0['16'],
        '[method]output-stream.blocking-write-zeroes-and-flush': exports0['20'],
        '[method]output-stream.check-write': exports0['14'],
        '[method]output-stream.flush': exports0['17'],
        '[method]output-stream.splice': exports0['21'],
        '[method]output-stream.subscribe': trampoline28,
        '[method]output-stream.write': exports0['15'],
        '[method]output-stream.write-zeroes': exports0['19'],
        '[resource-drop]input-stream': trampoline29,
        '[resource-drop]output-stream': trampoline30,
      },
    }));
    memory0 = exports1.memory;
    realloc0 = exports1.cabi_realloc;
    ({ exports: exports2 } = yield instantiateCore(yield module99, {
      '': {
        $imports: exports0.$imports,
        '0': trampoline71,
        '1': trampoline72,
        '10': trampoline81,
        '11': trampoline82,
        '12': trampoline83,
        '13': trampoline84,
        '14': trampoline85,
        '15': trampoline86,
        '16': trampoline87,
        '17': trampoline88,
        '18': trampoline89,
        '19': trampoline90,
        '2': trampoline73,
        '20': trampoline91,
        '21': trampoline92,
        '22': trampoline93,
        '23': trampoline94,
        '24': trampoline95,
        '25': trampoline96,
        '26': trampoline97,
        '27': trampoline98,
        '28': trampoline99,
        '29': trampoline100,
        '3': trampoline74,
        '30': trampoline101,
        '31': exports1['wasi:io/error@0.2.0#[dtor]error'],
        '32': exports1['wasi:io/poll@0.2.0#[dtor]pollable'],
        '33': exports1['wasi:io/streams@0.2.0#[dtor]input-stream'],
        '34': exports1['wasi:io/streams@0.2.0#[dtor]output-stream'],
        '35': exports1['wasi:sockets/ip-name-lookup@0.2.0#[dtor]resolve-address-stream'],
        '36': exports1['wasi:sockets/tcp@0.2.0#[dtor]tcp-socket'],
        '37': exports1['wasi:sockets/udp@0.2.0#[dtor]udp-socket'],
        '38': exports1['wasi:sockets/udp@0.2.0#[dtor]incoming-datagram-stream'],
        '39': exports1['wasi:sockets/udp@0.2.0#[dtor]outgoing-datagram-stream'],
        '4': trampoline75,
        '40': exports1['wasi:http/types@0.2.0#[dtor]fields'],
        '41': exports1['wasi:http/types@0.2.0#[dtor]incoming-request'],
        '42': exports1['wasi:http/types@0.2.0#[dtor]outgoing-request'],
        '43': exports1['wasi:http/types@0.2.0#[dtor]request-options'],
        '44': exports1['wasi:http/types@0.2.0#[dtor]response-outparam'],
        '45': exports1['wasi:http/types@0.2.0#[dtor]incoming-response'],
        '46': exports1['wasi:http/types@0.2.0#[dtor]incoming-body'],
        '47': exports1['wasi:http/types@0.2.0#[dtor]future-trailers'],
        '48': exports1['wasi:http/types@0.2.0#[dtor]outgoing-response'],
        '49': exports1['wasi:http/types@0.2.0#[dtor]outgoing-body'],
        '5': trampoline76,
        '50': exports1['wasi:http/types@0.2.0#[dtor]future-incoming-response'],
        '51': exports1['wasi:cli/terminal-input@0.2.0#[dtor]terminal-input'],
        '52': exports1['wasi:cli/terminal-output@0.2.0#[dtor]terminal-output'],
        '53': exports1['wasi:filesystem/types@0.2.0#[dtor]descriptor'],
        '54': exports1['wasi:filesystem/types@0.2.0#[dtor]directory-entry-stream'],
        '6': trampoline77,
        '7': trampoline78,
        '8': trampoline79,
        '9': trampoline80,
      },
    }));
    ({ exports: exports3 } = yield instantiateCore(yield module95));
    ({ exports: exports4 } = yield instantiateCore(yield module0, {
      ruby: {
        _start: exports3['89'],
      },
      wasi_snapshot_preview1: {
        args_get: exports3['44'],
        args_sizes_get: exports3['45'],
        clock_res_get: exports3['46'],
        clock_time_get: exports3['47'],
        environ_get: exports3['48'],
        environ_sizes_get: exports3['49'],
        fd_advise: exports3['50'],
        fd_allocate: exports3['51'],
        fd_close: exports3['52'],
        fd_datasync: exports3['53'],
        fd_fdstat_get: exports3['54'],
        fd_fdstat_set_flags: exports3['55'],
        fd_fdstat_set_rights: exports3['56'],
        fd_filestat_get: exports3['57'],
        fd_filestat_set_size: exports3['58'],
        fd_filestat_set_times: exports3['59'],
        fd_pread: exports3['60'],
        fd_prestat_dir_name: exports3['61'],
        fd_prestat_get: exports3['62'],
        fd_pwrite: exports3['63'],
        fd_read: exports3['64'],
        fd_readdir: exports3['65'],
        fd_renumber: exports3['66'],
        fd_seek: exports3['67'],
        fd_sync: exports3['68'],
        fd_tell: exports3['69'],
        fd_write: exports3['70'],
        path_create_directory: exports3['71'],
        path_filestat_get: exports3['72'],
        path_filestat_set_times: exports3['73'],
        path_link: exports3['74'],
        path_open: exports3['75'],
        path_readlink: exports3['76'],
        path_remove_directory: exports3['77'],
        path_rename: exports3['78'],
        path_symlink: exports3['79'],
        path_unlink_file: exports3['80'],
        poll_oneoff: exports3['81'],
        proc_exit: exports3['82'],
        random_get: exports3['83'],
        sched_yield: exports3['84'],
        sock_accept: exports3['85'],
        sock_recv: exports3['86'],
        sock_send: exports3['87'],
        sock_shutdown: exports3['88'],
      },
    }));
    ({ exports: exports5 } = yield instantiateCore(yield module100, {
      callee: {
        adapter0: exports1['wasi:clocks/monotonic-clock@0.2.0#now'],
        adapter1: exports1['wasi:clocks/monotonic-clock@0.2.0#resolution'],
        adapter2: exports1['wasi:clocks/monotonic-clock@0.2.0#subscribe-instant'],
        adapter3: exports1['wasi:clocks/monotonic-clock@0.2.0#subscribe-duration'],
        adapter4: exports1['wasi:io/streams@0.2.0#[method]input-stream.subscribe'],
        adapter5: exports1['wasi:io/streams@0.2.0#[method]output-stream.subscribe'],
        adapter6: exports1['wasi:cli/stderr@0.2.0#get-stderr'],
        adapter7: exports1['wasi:cli/stdin@0.2.0#get-stdin'],
        adapter8: exports1['wasi:cli/stdout@0.2.0#get-stdout'],
      },
      flags: {
        instance1: instanceFlags1,
        instance27: instanceFlags27,
      },
      resource: {
        'enter-call': trampoline103,
        'exit-call': trampoline105,
        'transfer-borrow': trampoline104,
        'transfer-own': trampoline102,
      },
    }));
    ({ exports: exports6 } = yield instantiateCore(yield module1, {
      __main_module__: {
        cabi_realloc: exports4.cabi_realloc,
      },
      env: {
        memory: exports4.memory,
      },
      'wasi:cli/environment@0.2.0': {
        'get-arguments': exports3['40'],
        'get-environment': exports3['39'],
      },
      'wasi:cli/exit@0.2.0': {
        exit: trampoline112,
      },
      'wasi:cli/stderr@0.2.0': {
        'get-stderr': exports5.adapter6,
      },
      'wasi:cli/stdin@0.2.0': {
        'get-stdin': exports5.adapter7,
      },
      'wasi:cli/stdout@0.2.0': {
        'get-stdout': exports5.adapter8,
      },
      'wasi:cli/terminal-input@0.2.0': {
        '[resource-drop]terminal-input': trampoline113,
      },
      'wasi:cli/terminal-output@0.2.0': {
        '[resource-drop]terminal-output': trampoline114,
      },
      'wasi:cli/terminal-stderr@0.2.0': {
        'get-terminal-stderr': exports3['43'],
      },
      'wasi:cli/terminal-stdin@0.2.0': {
        'get-terminal-stdin': exports3['41'],
      },
      'wasi:cli/terminal-stdout@0.2.0': {
        'get-terminal-stdout': exports3['42'],
      },
      'wasi:clocks/monotonic-clock@0.2.0': {
        now: exports5.adapter0,
        resolution: exports5.adapter1,
        'subscribe-duration': exports5.adapter3,
        'subscribe-instant': exports5.adapter2,
      },
      'wasi:clocks/wall-clock@0.2.0': {
        now: exports3['1'],
        resolution: exports3['2'],
      },
      'wasi:filesystem/preopens@0.2.0': {
        'get-directories': exports3['0'],
      },
      'wasi:filesystem/types@0.2.0': {
        '[method]descriptor.advise': exports3['6'],
        '[method]descriptor.append-via-stream': exports3['5'],
        '[method]descriptor.create-directory-at': exports3['16'],
        '[method]descriptor.get-flags': exports3['8'],
        '[method]descriptor.get-type': exports3['9'],
        '[method]descriptor.link-at': exports3['20'],
        '[method]descriptor.metadata-hash': exports3['27'],
        '[method]descriptor.metadata-hash-at': exports3['28'],
        '[method]descriptor.open-at': exports3['21'],
        '[method]descriptor.read': exports3['12'],
        '[method]descriptor.read-directory': exports3['14'],
        '[method]descriptor.read-via-stream': exports3['3'],
        '[method]descriptor.readlink-at': exports3['22'],
        '[method]descriptor.remove-directory-at': exports3['23'],
        '[method]descriptor.rename-at': exports3['24'],
        '[method]descriptor.set-size': exports3['10'],
        '[method]descriptor.set-times': exports3['11'],
        '[method]descriptor.set-times-at': exports3['19'],
        '[method]descriptor.stat': exports3['17'],
        '[method]descriptor.stat-at': exports3['18'],
        '[method]descriptor.symlink-at': exports3['25'],
        '[method]descriptor.sync': exports3['15'],
        '[method]descriptor.sync-data': exports3['7'],
        '[method]descriptor.unlink-file-at': exports3['26'],
        '[method]descriptor.write': exports3['13'],
        '[method]descriptor.write-via-stream': exports3['4'],
        '[method]directory-entry-stream.read-directory-entry': exports3['29'],
        '[resource-drop]descriptor': trampoline110,
        '[resource-drop]directory-entry-stream': trampoline106,
        'filesystem-error-code': exports3['30'],
      },
      'wasi:io/error@0.2.0': {
        '[resource-drop]error': trampoline107,
      },
      'wasi:io/poll@0.2.0': {
        '[resource-drop]pollable': trampoline111,
        poll: exports3['37'],
      },
      'wasi:io/streams@0.2.0': {
        '[method]input-stream.blocking-read': exports3['32'],
        '[method]input-stream.read': exports3['31'],
        '[method]input-stream.subscribe': exports5.adapter4,
        '[method]output-stream.blocking-flush': exports3['36'],
        '[method]output-stream.blocking-write-and-flush': exports3['35'],
        '[method]output-stream.check-write': exports3['33'],
        '[method]output-stream.subscribe': exports5.adapter5,
        '[method]output-stream.write': exports3['34'],
        '[resource-drop]input-stream': trampoline108,
        '[resource-drop]output-stream': trampoline109,
      },
      'wasi:random/random@0.2.0': {
        'get-random-bytes': exports3['38'],
      },
    }));
    ({ exports: exports7 } = yield instantiateCore(yield module2, {
      env: {
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['libwasi-emulated-getpid.so:memory_base'],
        __table_base: exports4['libwasi-emulated-getpid.so:table_base'],
        memory: exports4.memory,
      },
    }));
    ({ exports: exports8 } = yield instantiateCore(yield module3, {
      'GOT.func': {
        Init_prism: exports4['ruby:Init_prism'],
        __SIG_ERR: exports4['ruby:__SIG_ERR'],
        __SIG_IGN: exports4['ruby:__SIG_IGN'],
        onig_null_warn: exports4['ruby:onig_null_warn'],
        onigenc_always_true_is_allowed_reverse_match: exports4['ruby:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_ascii_apply_all_case_fold: exports4['ruby:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['ruby:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_is_code_ctype: exports4['ruby:onigenc_ascii_is_code_ctype'],
        onigenc_ascii_mbc_case_fold: exports4['ruby:onigenc_ascii_mbc_case_fold'],
        onigenc_is_mbc_newline_0x0a: exports4['ruby:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['ruby:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['ruby:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_ascii_only_case_map: exports4['ruby:onigenc_single_byte_ascii_only_case_map'],
        onigenc_single_byte_code_to_mbc: exports4['ruby:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['ruby:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['ruby:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['ruby:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['ruby:onigenc_single_byte_mbc_to_code'],
        onigenc_unicode_apply_all_case_fold: exports4['ruby:onigenc_unicode_apply_all_case_fold'],
        onigenc_unicode_case_map: exports4['ruby:onigenc_unicode_case_map'],
        onigenc_unicode_is_code_ctype: exports4['ruby:onigenc_unicode_is_code_ctype'],
        onigenc_unicode_property_name_to_ctype: exports4['ruby:onigenc_unicode_property_name_to_ctype'],
        rb_any_to_s: exports4['ruby:rb_any_to_s'],
        rb_ary_aref: exports4['ruby:rb_ary_aref'],
        rb_ary_assoc: exports4['ruby:rb_ary_assoc'],
        rb_ary_clear: exports4['ruby:rb_ary_clear'],
        rb_ary_cmp: exports4['ruby:rb_ary_cmp'],
        rb_ary_delete: exports4['ruby:rb_ary_delete'],
        rb_ary_each: exports4['ruby:rb_ary_each'],
        rb_ary_freeze: exports4['ruby:rb_ary_freeze'],
        rb_ary_includes: exports4['ruby:rb_ary_includes'],
        rb_ary_plus: exports4['ruby:rb_ary_plus'],
        rb_ary_push: exports4['ruby:rb_ary_push'],
        rb_ary_rassoc: exports4['ruby:rb_ary_rassoc'],
        rb_ary_replace: exports4['ruby:rb_ary_replace'],
        rb_ary_sort: exports4['ruby:rb_ary_sort'],
        rb_ary_sort_bang: exports4['ruby:rb_ary_sort_bang'],
        rb_check_to_int: exports4['ruby:rb_check_to_int'],
        rb_class_attached_object: exports4['ruby:rb_class_attached_object'],
        rb_class_inherited_p: exports4['ruby:rb_class_inherited_p'],
        rb_class_instance_methods: exports4['ruby:rb_class_instance_methods'],
        rb_class_new_instance: exports4['ruby:rb_class_new_instance'],
        rb_class_new_instance_pass_kw: exports4['ruby:rb_class_new_instance_pass_kw'],
        rb_class_private_instance_methods: exports4['ruby:rb_class_private_instance_methods'],
        rb_class_protected_instance_methods: exports4['ruby:rb_class_protected_instance_methods'],
        rb_class_public_instance_methods: exports4['ruby:rb_class_public_instance_methods'],
        rb_class_subclasses: exports4['ruby:rb_class_subclasses'],
        rb_class_superclass: exports4['ruby:rb_class_superclass'],
        rb_complex_abs: exports4['ruby:rb_complex_abs'],
        rb_complex_arg: exports4['ruby:rb_complex_arg'],
        rb_complex_conjugate: exports4['ruby:rb_complex_conjugate'],
        rb_complex_div: exports4['ruby:rb_complex_div'],
        rb_complex_imag: exports4['ruby:rb_complex_imag'],
        rb_complex_minus: exports4['ruby:rb_complex_minus'],
        rb_complex_mul: exports4['ruby:rb_complex_mul'],
        rb_complex_plus: exports4['ruby:rb_complex_plus'],
        rb_complex_pow: exports4['ruby:rb_complex_pow'],
        rb_complex_real: exports4['ruby:rb_complex_real'],
        rb_complex_uminus: exports4['ruby:rb_complex_uminus'],
        rb_equal: exports4['ruby:rb_equal'],
        rb_f_notimplement: exports4['ruby:rb_f_notimplement'],
        rb_f_require: exports4['ruby:rb_f_require'],
        rb_fiber_alive_p: exports4['ruby:rb_fiber_alive_p'],
        rb_file_directory_p: exports4['ruby:rb_file_directory_p'],
        rb_gcd: exports4['ruby:rb_gcd'],
        rb_gvar_readonly_setter: exports4['ruby:rb_gvar_readonly_setter'],
        rb_gvar_undef_getter: exports4['ruby:rb_gvar_undef_getter'],
        rb_gvar_undef_marker: exports4['ruby:rb_gvar_undef_marker'],
        rb_gvar_undef_setter: exports4['ruby:rb_gvar_undef_setter'],
        rb_gvar_val_getter: exports4['ruby:rb_gvar_val_getter'],
        rb_gvar_val_marker: exports4['ruby:rb_gvar_val_marker'],
        rb_gvar_val_setter: exports4['ruby:rb_gvar_val_setter'],
        rb_gvar_var_getter: exports4['ruby:rb_gvar_var_getter'],
        rb_gvar_var_marker: exports4['ruby:rb_gvar_var_marker'],
        rb_gvar_var_setter: exports4['ruby:rb_gvar_var_setter'],
        rb_hash_aref: exports4['ruby:rb_hash_aref'],
        rb_hash_aset: exports4['ruby:rb_hash_aset'],
        rb_hash_clear: exports4['ruby:rb_hash_clear'],
        rb_hash_delete_if: exports4['ruby:rb_hash_delete_if'],
        rb_hash_freeze: exports4['ruby:rb_hash_freeze'],
        rb_hash_size: exports4['ruby:rb_hash_size'],
        rb_inspect: exports4['ruby:rb_inspect'],
        rb_io_addstr: exports4['ruby:rb_io_addstr'],
        rb_io_buffer_free: exports4['ruby:rb_io_buffer_free'],
        rb_io_buffer_transfer: exports4['ruby:rb_io_buffer_transfer'],
        rb_io_close: exports4['ruby:rb_io_close'],
        rb_io_closed_p: exports4['ruby:rb_io_closed_p'],
        rb_io_eof: exports4['ruby:rb_io_eof'],
        rb_io_flush: exports4['ruby:rb_io_flush'],
        rb_io_getbyte: exports4['ruby:rb_io_getbyte'],
        rb_io_path: exports4['ruby:rb_io_path'],
        rb_io_print: exports4['ruby:rb_io_print'],
        rb_io_printf: exports4['ruby:rb_io_printf'],
        rb_io_puts: exports4['ruby:rb_io_puts'],
        rb_io_set_timeout: exports4['ruby:rb_io_set_timeout'],
        rb_io_timeout: exports4['ruby:rb_io_timeout'],
        rb_io_ungetbyte: exports4['ruby:rb_io_ungetbyte'],
        rb_io_ungetc: exports4['ruby:rb_io_ungetc'],
        rb_locale_charmap: exports4['ruby:rb_locale_charmap'],
        rb_mark_set: exports4['ruby:rb_mark_set'],
        rb_mark_tbl: exports4['ruby:rb_mark_tbl'],
        rb_mod_ancestors: exports4['ruby:rb_mod_ancestors'],
        rb_mod_class_variables: exports4['ruby:rb_mod_class_variables'],
        rb_mod_constants: exports4['ruby:rb_mod_constants'],
        rb_mod_include_p: exports4['ruby:rb_mod_include_p'],
        rb_mod_included_modules: exports4['ruby:rb_mod_included_modules'],
        rb_mod_name: exports4['ruby:rb_mod_name'],
        rb_mod_remove_const: exports4['ruby:rb_mod_remove_const'],
        rb_mod_remove_cvar: exports4['ruby:rb_mod_remove_cvar'],
        rb_mutex_lock: exports4['ruby:rb_mutex_lock'],
        rb_mutex_locked_p: exports4['ruby:rb_mutex_locked_p'],
        rb_mutex_trylock: exports4['ruby:rb_mutex_trylock'],
        rb_mutex_unlock: exports4['ruby:rb_mutex_unlock'],
        rb_obj_dup: exports4['ruby:rb_obj_dup'],
        rb_obj_encoding: exports4['ruby:rb_obj_encoding'],
        rb_obj_freeze: exports4['ruby:rb_obj_freeze'],
        rb_obj_id: exports4['ruby:rb_obj_id'],
        rb_obj_init_copy: exports4['ruby:rb_obj_init_copy'],
        rb_obj_instance_variables: exports4['ruby:rb_obj_instance_variables'],
        rb_obj_is_instance_of: exports4['ruby:rb_obj_is_instance_of'],
        rb_obj_is_kind_of: exports4['ruby:rb_obj_is_kind_of'],
        rb_obj_method: exports4['ruby:rb_obj_method'],
        rb_obj_remove_instance_variable: exports4['ruby:rb_obj_remove_instance_variable'],
        rb_obj_singleton_methods: exports4['ruby:rb_obj_singleton_methods'],
        rb_parser_compile_string_path: exports4['ruby:rb_parser_compile_string_path'],
        rb_parser_st_numcmp: exports4['ruby:rb_parser_st_numcmp'],
        rb_parser_st_numhash: exports4['ruby:rb_parser_st_numhash'],
        rb_proc_lambda_p: exports4['ruby:rb_proc_lambda_p'],
        rb_proc_times: exports4['ruby:rb_proc_times'],
        rb_random_mark: exports4['ruby:rb_random_mark'],
        rb_reg_match: exports4['ruby:rb_reg_match'],
        rb_reg_match2: exports4['ruby:rb_reg_match2'],
        rb_reg_match_post: exports4['ruby:rb_reg_match_post'],
        rb_reg_match_pre: exports4['ruby:rb_reg_match_pre'],
        rb_st_free_table: exports4['ruby:rb_st_free_table'],
        rb_st_numcmp: exports4['ruby:rb_st_numcmp'],
        rb_st_numhash: exports4['ruby:rb_st_numhash'],
        rb_str_append: exports4['ruby:rb_str_append'],
        rb_str_concat: exports4['ruby:rb_str_concat'],
        rb_str_dump: exports4['ruby:rb_str_dump'],
        rb_str_equal: exports4['ruby:rb_str_equal'],
        rb_str_freeze: exports4['ruby:rb_str_freeze'],
        rb_str_inspect: exports4['ruby:rb_str_inspect'],
        rb_str_intern: exports4['ruby:rb_str_intern'],
        rb_str_length: exports4['ruby:rb_str_length'],
        rb_str_plus: exports4['ruby:rb_str_plus'],
        rb_str_replace: exports4['ruby:rb_str_replace'],
        rb_str_succ: exports4['ruby:rb_str_succ'],
        rb_str_times: exports4['ruby:rb_str_times'],
        rb_str_unlocktmp: exports4['ruby:rb_str_unlocktmp'],
        rb_struct_aref: exports4['ruby:rb_struct_aref'],
        rb_struct_aset: exports4['ruby:rb_struct_aset'],
        rb_struct_size: exports4['ruby:rb_struct_size'],
        rb_thread_kill: exports4['ruby:rb_thread_kill'],
        rb_thread_run: exports4['ruby:rb_thread_run'],
        rb_thread_wakeup: exports4['ruby:rb_thread_wakeup'],
        rb_time_utc_offset: exports4['ruby:rb_time_utc_offset'],
        rb_tracepoint_disable: exports4['ruby:rb_tracepoint_disable'],
        rb_tracepoint_enable: exports4['ruby:rb_tracepoint_enable'],
        rb_yield: exports4['ruby:rb_yield'],
        ruby_xfree: exports4['ruby:ruby_xfree'],
        ruby_xmalloc: exports4['ruby:ruby_xmalloc'],
      },
      'GOT.mem': {
        OnigDefaultCaseFoldFlag: exports4['ruby:OnigDefaultCaseFoldFlag'],
        OnigDefaultSyntax: exports4['ruby:OnigDefaultSyntax'],
        OnigEncAsciiCtypeTable: exports4['ruby:OnigEncAsciiCtypeTable'],
        OnigEncAsciiToLowerCaseTable: exports4['ruby:OnigEncAsciiToLowerCaseTable'],
        OnigEncAsciiToUpperCaseTable: exports4['ruby:OnigEncAsciiToUpperCaseTable'],
        OnigEncDefaultCharEncoding: exports4['ruby:OnigEncDefaultCharEncoding'],
        OnigEncodingASCII: exports4['ruby:OnigEncodingASCII'],
        OnigSyntaxRuby: exports4['ruby:OnigSyntaxRuby'],
        RUBY_IO_BUFFER_DEFAULT_SIZE: exports4['ruby:RUBY_IO_BUFFER_DEFAULT_SIZE'],
        RUBY_IO_BUFFER_PAGE_SIZE: exports4['ruby:RUBY_IO_BUFFER_PAGE_SIZE'],
        _CLOCK_MONOTONIC: exports4['ruby:_CLOCK_MONOTONIC'],
        _CLOCK_REALTIME: exports4['ruby:_CLOCK_REALTIME'],
        environ: exports4['ruby:environ'],
        errno: exports4['ruby:errno'],
        rb_argv0: exports4['ruby:rb_argv0'],
        rb_block_param_proxy: exports4['ruby:rb_block_param_proxy'],
        rb_cArray: exports4['ruby:rb_cArray'],
        rb_cBasicObject: exports4['ruby:rb_cBasicObject'],
        rb_cBinding: exports4['ruby:rb_cBinding'],
        rb_cClass: exports4['ruby:rb_cClass'],
        rb_cComplex: exports4['ruby:rb_cComplex'],
        rb_cDir: exports4['ruby:rb_cDir'],
        rb_cEncoding: exports4['ruby:rb_cEncoding'],
        rb_cEnumerator: exports4['ruby:rb_cEnumerator'],
        rb_cFalseClass: exports4['ruby:rb_cFalseClass'],
        rb_cFile: exports4['ruby:rb_cFile'],
        rb_cFloat: exports4['ruby:rb_cFloat'],
        rb_cHash: exports4['ruby:rb_cHash'],
        rb_cIO: exports4['ruby:rb_cIO'],
        rb_cIOBuffer: exports4['ruby:rb_cIOBuffer'],
        rb_cISeq: exports4['ruby:rb_cISeq'],
        rb_cInteger: exports4['ruby:rb_cInteger'],
        rb_cMatch: exports4['ruby:rb_cMatch'],
        rb_cMethod: exports4['ruby:rb_cMethod'],
        rb_cModule: exports4['ruby:rb_cModule'],
        rb_cNameErrorMesg: exports4['ruby:rb_cNameErrorMesg'],
        rb_cNamespace: exports4['ruby:rb_cNamespace'],
        rb_cNilClass: exports4['ruby:rb_cNilClass'],
        rb_cNumeric: exports4['ruby:rb_cNumeric'],
        rb_cObject: exports4['ruby:rb_cObject'],
        rb_cProc: exports4['ruby:rb_cProc'],
        rb_cRactor: exports4['ruby:rb_cRactor'],
        rb_cRandom: exports4['ruby:rb_cRandom'],
        rb_cRange: exports4['ruby:rb_cRange'],
        rb_cRational: exports4['ruby:rb_cRational'],
        rb_cRefinement: exports4['ruby:rb_cRefinement'],
        rb_cRegexp: exports4['ruby:rb_cRegexp'],
        rb_cRubyVM: exports4['ruby:rb_cRubyVM'],
        rb_cSet: exports4['ruby:rb_cSet'],
        rb_cStat: exports4['ruby:rb_cStat'],
        rb_cString: exports4['ruby:rb_cString'],
        rb_cStruct: exports4['ruby:rb_cStruct'],
        rb_cSymbol: exports4['ruby:rb_cSymbol'],
        rb_cThread: exports4['ruby:rb_cThread'],
        rb_cTime: exports4['ruby:rb_cTime'],
        rb_cTrueClass: exports4['ruby:rb_cTrueClass'],
        rb_cUnboundMethod: exports4['ruby:rb_cUnboundMethod'],
        rb_default_rs: exports4['ruby:rb_default_rs'],
        rb_eArgError: exports4['ruby:rb_eArgError'],
        rb_eEOFError: exports4['ruby:rb_eEOFError'],
        rb_eEncCompatError: exports4['ruby:rb_eEncCompatError'],
        rb_eEncodingError: exports4['ruby:rb_eEncodingError'],
        rb_eException: exports4['ruby:rb_eException'],
        rb_eFatal: exports4['ruby:rb_eFatal'],
        rb_eFloatDomainError: exports4['ruby:rb_eFloatDomainError'],
        rb_eFrozenError: exports4['ruby:rb_eFrozenError'],
        rb_eIOError: exports4['ruby:rb_eIOError'],
        rb_eIOTimeoutError: exports4['ruby:rb_eIOTimeoutError'],
        rb_eIndexError: exports4['ruby:rb_eIndexError'],
        rb_eInterrupt: exports4['ruby:rb_eInterrupt'],
        rb_eKeyError: exports4['ruby:rb_eKeyError'],
        rb_eLoadError: exports4['ruby:rb_eLoadError'],
        rb_eLocalJumpError: exports4['ruby:rb_eLocalJumpError'],
        rb_eMathDomainError: exports4['ruby:rb_eMathDomainError'],
        rb_eNameError: exports4['ruby:rb_eNameError'],
        rb_eNoMatchingPatternError: exports4['ruby:rb_eNoMatchingPatternError'],
        rb_eNoMatchingPatternKeyError: exports4['ruby:rb_eNoMatchingPatternKeyError'],
        rb_eNoMemError: exports4['ruby:rb_eNoMemError'],
        rb_eNoMethodError: exports4['ruby:rb_eNoMethodError'],
        rb_eNotImpError: exports4['ruby:rb_eNotImpError'],
        rb_eRactorIsolationError: exports4['ruby:rb_eRactorIsolationError'],
        rb_eRactorUnsafeError: exports4['ruby:rb_eRactorUnsafeError'],
        rb_eRangeError: exports4['ruby:rb_eRangeError'],
        rb_eRegexpError: exports4['ruby:rb_eRegexpError'],
        rb_eRuntimeError: exports4['ruby:rb_eRuntimeError'],
        rb_eScriptError: exports4['ruby:rb_eScriptError'],
        rb_eSecurityError: exports4['ruby:rb_eSecurityError'],
        rb_eSignal: exports4['ruby:rb_eSignal'],
        rb_eStandardError: exports4['ruby:rb_eStandardError'],
        rb_eStopIteration: exports4['ruby:rb_eStopIteration'],
        rb_eSyntaxError: exports4['ruby:rb_eSyntaxError'],
        rb_eSysStackError: exports4['ruby:rb_eSysStackError'],
        rb_eSystemCallError: exports4['ruby:rb_eSystemCallError'],
        rb_eSystemExit: exports4['ruby:rb_eSystemExit'],
        rb_eThreadError: exports4['ruby:rb_eThreadError'],
        rb_eTypeError: exports4['ruby:rb_eTypeError'],
        rb_eZeroDivError: exports4['ruby:rb_eZeroDivError'],
        rb_fs: exports4['ruby:rb_fs'],
        rb_mComparable: exports4['ruby:rb_mComparable'],
        rb_mEnumerable: exports4['ruby:rb_mEnumerable'],
        rb_mErrno: exports4['ruby:rb_mErrno'],
        rb_mFileTest: exports4['ruby:rb_mFileTest'],
        rb_mGC: exports4['ruby:rb_mGC'],
        rb_mKernel: exports4['ruby:rb_mKernel'],
        rb_mMath: exports4['ruby:rb_mMath'],
        rb_mProcess: exports4['ruby:rb_mProcess'],
        rb_mRubyVMFrozenCore: exports4['ruby:rb_mRubyVMFrozenCore'],
        rb_mWaitReadable: exports4['ruby:rb_mWaitReadable'],
        rb_mWaitWritable: exports4['ruby:rb_mWaitWritable'],
        rb_memory_view_exported_object_registry: exports4['ruby:rb_memory_view_exported_object_registry'],
        rb_memory_view_exported_object_registry_data_type: exports4['ruby:rb_memory_view_exported_object_registry_data_type'],
        rb_output_fs: exports4['ruby:rb_output_fs'],
        rb_output_rs: exports4['ruby:rb_output_rs'],
        rb_random_data_type_1_0: exports4['ruby:rb_random_data_type_1_0'],
        rb_rs: exports4['ruby:rb_rs'],
        rb_shape_tree: exports4['ruby:rb_shape_tree'],
        rb_stderr: exports4['ruby:rb_stderr'],
        rb_stdin: exports4['ruby:rb_stdin'],
        rb_stdout: exports4['ruby:rb_stdout'],
        rb_vm_insn_len_info: exports4['ruby:rb_vm_insn_len_info'],
        rb_vm_insn_name_base: exports4['ruby:rb_vm_insn_name_base'],
        rb_vm_insn_name_offset: exports4['ruby:rb_vm_insn_name_offset'],
        rb_vm_insn_op_base: exports4['ruby:rb_vm_insn_op_base'],
        rb_vm_insn_op_offset: exports4['ruby:rb_vm_insn_op_offset'],
        ruby_api_version: exports4['ruby:ruby_api_version'],
        ruby_copyright: exports4['ruby:ruby_copyright'],
        ruby_description: exports4['ruby:ruby_description'],
        ruby_digit36_to_number_table: exports4['ruby:ruby_digit36_to_number_table'],
        ruby_engine: exports4['ruby:ruby_engine'],
        ruby_global_name_punct_bits: exports4['ruby:ruby_global_name_punct_bits'],
        ruby_hexdigits: exports4['ruby:ruby_hexdigits'],
        ruby_platform: exports4['ruby:ruby_platform'],
        ruby_release_date: exports4['ruby:ruby_release_date'],
        ruby_version: exports4['ruby:ruby_version'],
        stderr: exports4['ruby:stderr'],
        stdin: exports4['ruby:stdin'],
        stdout: exports4['ruby:stdout'],
      },
      env: {
        __assert_fail: exports4.__assert_fail,
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __main_void: exports4.__main_void,
        __memory_base: exports4['ruby:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['ruby:table_base'],
        __wasi_proc_exit: exports4.__wasi_proc_exit,
        __wasilibc_iftodt: exports4.__wasilibc_iftodt,
        __wasilibc_tell: exports4.__wasilibc_tell,
        __wasm_call_dtors: exports4.__wasm_call_dtors,
        _exit: exports4._exit,
        abort: exports4.abort,
        access: exports4.access,
        acos: exports4.acos,
        acosh: exports4.acosh,
        asin: exports4.asin,
        asinh: exports4.asinh,
        atan: exports4.atan,
        atan2: exports4.atan2,
        atanh: exports4.atanh,
        atoi: exports4.atoi,
        atol: exports4.atol,
        bsearch: exports4.bsearch,
        calloc: exports4.calloc,
        cbrt: exports4.cbrt,
        chdir: exports4.chdir,
        chmod: exports4.chmod,
        chown: exports4.chown,
        clock: exports4.clock,
        clock_getres: exports4.clock_getres,
        clock_gettime: exports4.clock_gettime,
        clock_nanosleep: exports4.clock_nanosleep,
        close: exports4.close,
        closedir: exports4.closedir,
        cos: exports4.cos,
        cosh: exports4.cosh,
        crypt_r: exports4.crypt_r,
        dirfd: exports4.dirfd,
        dlclose: exports4.dlclose,
        dlerror: exports4.dlerror,
        dlopen: exports4.dlopen,
        dlsym: exports4.dlsym,
        dup: exports4.dup,
        dup2: exports4.dup2,
        erf: exports4.erf,
        erfc: exports4.erfc,
        execl: exports4.execl,
        execle: exports4.execle,
        execv: exports4.execv,
        execve: exports4.execve,
        exit: exports4.exit,
        exp: exports4.exp,
        explicit_bzero: exports4.explicit_bzero,
        expm1: exports4.expm1,
        fclose: exports4.fclose,
        fcntl: exports4.fcntl,
        fdatasync: exports4.fdatasync,
        fdopen: exports4.fdopen,
        fdopendir: exports4.fdopendir,
        feof: exports4.feof,
        ferror: exports4.ferror,
        fflush: exports4.fflush,
        fileno: exports4.fileno,
        fmod: exports4.fmod,
        fopen: exports4.fopen,
        fprintf: exports4.fprintf,
        fputs: exports4.fputs,
        fread: exports4.fread,
        free: exports4.free,
        freopen: exports4.freopen,
        frexp: exports4.frexp,
        fstat: exports4.fstat,
        fstatat: exports4.fstatat,
        fsync: exports4.fsync,
        ftruncate: exports4.ftruncate,
        fwrite: exports4.fwrite,
        getcwd: exports4.getcwd,
        getegid: exports4.getegid,
        getentropy: exports4.getentropy,
        getenv: exports4.getenv,
        geteuid: exports4.geteuid,
        getgid: exports4.getgid,
        getlogin: exports4.getlogin,
        getpid: exports7.getpid,
        getppid: exports4.getppid,
        getrusage: exports4.getrusage,
        gettimeofday: exports4.gettimeofday,
        getuid: exports4.getuid,
        gmtime_r: exports4.gmtime_r,
        hypot: exports4.hypot,
        ioctl: exports4.ioctl,
        isatty: exports4.isatty,
        kill: exports4.kill,
        ldexp: exports4.ldexp,
        lgamma_r: exports4.lgamma_r,
        link: exports4.link,
        localeconv: exports4.localeconv,
        localtime_r: exports4.localtime_r,
        log: exports4.log,
        log10: exports4.log10,
        log1p: exports4.log1p,
        log2: exports4.log2,
        lseek: exports4.lseek,
        lstat: exports4.lstat,
        malloc: exports4.malloc,
        malloc_usable_size: exports4.malloc_usable_size,
        mblen: exports4.mblen,
        memchr: exports4.memchr,
        memcpy: exports4.memcpy,
        memmem: exports4.memmem,
        memmove: exports4.memmove,
        memory: exports4.memory,
        memrchr: exports4.memrchr,
        memset: exports4.memset,
        mkdir: exports4.mkdir,
        mktime: exports4.mktime,
        mmap: exports4.mmap,
        modf: exports4.modf,
        munmap: exports4.munmap,
        nan: exports4.nan,
        nextafter: exports4.nextafter,
        nl_langinfo: exports4.nl_langinfo,
        open: exports4.open,
        openat: exports4.openat,
        opendir: exports4.opendir,
        pclose: exports4.pclose,
        perror: exports4.perror,
        pipe: exports4.pipe,
        popen: exports4.popen,
        posix_fadvise: exports4.posix_fadvise,
        posix_memalign: exports4.posix_memalign,
        pow: exports4.pow,
        pread: exports4.pread,
        printf: exports4.printf,
        puts: exports4.puts,
        pwrite: exports4.pwrite,
        qsort: exports4.qsort,
        raise: exports4.raise,
        read: exports4.read,
        readdir: exports4.readdir,
        readlink: exports4.readlink,
        realloc: exports4.realloc,
        rename: exports4.rename,
        rewinddir: exports4.rewinddir,
        rmdir: exports4.rmdir,
        round: exports4.round,
        seekdir: exports4.seekdir,
        select: exports4.select,
        setenv: exports4.setenv,
        setlocale: exports4.setlocale,
        setvbuf: exports4.setvbuf,
        signal: exports4.signal,
        sin: exports4.sin,
        sinh: exports4.sinh,
        sleep: exports4.sleep,
        stat: exports4.stat,
        strcasecmp: exports4.strcasecmp,
        strchr: exports4.strchr,
        strcmp: exports4.strcmp,
        strcspn: exports4.strcspn,
        strdup: exports4.strdup,
        strerror: exports4.strerror,
        strlcat: exports4.strlcat,
        strlcpy: exports4.strlcpy,
        strlen: exports4.strlen,
        strncasecmp: exports4.strncasecmp,
        strncmp: exports4.strncmp,
        strpbrk: exports4.strpbrk,
        strrchr: exports4.strrchr,
        strstr: exports4.strstr,
        strtod: exports4.strtod,
        strtol: exports4.strtol,
        strtoul: exports4.strtoul,
        symlink: exports4.symlink,
        sysconf: exports4.sysconf,
        system: exports4.system,
        tan: exports4.tan,
        tanh: exports4.tanh,
        telldir: exports4.telldir,
        tgamma: exports4.tgamma,
        time: exports4.time,
        times: exports4.times,
        truncate: exports4.truncate,
        tzset: exports4.tzset,
        umask: exports4.umask,
        unlink: exports4.unlink,
        unsetenv: exports4.unsetenv,
        utimensat: exports4.utimensat,
        utimes: exports4.utimes,
        vfprintf: exports4.vfprintf,
        vsnprintf: exports4.vsnprintf,
        waitpid: exports4.waitpid,
        write: exports4.write,
        writev: exports4.writev,
      },
    }));
    ({ exports: exports9 } = yield instantiateCore(yield module4, {
      env: {
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['libdl.so:memory_base'],
        __table_base: exports4['libdl.so:table_base'],
        memcmp: exports8.memcmp,
        memory: exports4.memory,
        strlen: exports4.strlen,
      },
    }));
    ({ exports: exports10 } = yield instantiateCore(yield module5, {
      'GOT.func': {
        __wasilibc_find_relpath_alloc: exports4['libc.so:__wasilibc_find_relpath_alloc'],
      },
      'GOT.mem': {
        _CLOCK_REALTIME: exports4['libc.so:_CLOCK_REALTIME'],
        __heap_base: exports4.__heap_base,
        __heap_end: exports4.__heap_end,
        __optpos: exports4['libc.so:__optpos'],
        __optreset: exports4['libc.so:__optreset'],
        __signgam: exports4['libc.so:__signgam'],
        __stack_chk_guard: exports4['libc.so:__stack_chk_guard'],
        __wasilibc_cwd: exports4['libc.so:__wasilibc_cwd'],
        __wasilibc_environ: exports4['libc.so:__wasilibc_environ'],
        errno: exports4['libc.so:errno'],
        getdate_err: exports4['libc.so:getdate_err'],
        optarg: exports4['libc.so:optarg'],
        opterr: exports4['libc.so:opterr'],
        optind: exports4['libc.so:optind'],
        optopt: exports4['libc.so:optopt'],
      },
      env: {
        _IO_feof_unlocked: exports4._IO_feof_unlocked,
        _IO_ferror_unlocked: exports4._IO_ferror_unlocked,
        _IO_getc: exports4._IO_getc,
        _IO_getc_unlocked: exports4._IO_getc_unlocked,
        _IO_putc: exports4._IO_putc,
        _IO_putc_unlocked: exports4._IO_putc_unlocked,
        __freelocale: exports4.__freelocale,
        __getdelim: exports4.__getdelim,
        __indirect_function_table: exports4.__indirect_function_table,
        __isoc99_fscanf: exports4.__isoc99_fscanf,
        __isoc99_fwscanf: exports4.__isoc99_fwscanf,
        __isoc99_scanf: exports4.__isoc99_scanf,
        __isoc99_sscanf: exports4.__isoc99_sscanf,
        __isoc99_swscanf: exports4.__isoc99_swscanf,
        __isoc99_vfscanf: exports4.__isoc99_vfscanf,
        __isoc99_vfwscanf: exports4.__isoc99_vfwscanf,
        __isoc99_vscanf: exports4.__isoc99_vscanf,
        __isoc99_vsscanf: exports4.__isoc99_vsscanf,
        __isoc99_vswscanf: exports4.__isoc99_vswscanf,
        __isoc99_vwscanf: exports4.__isoc99_vwscanf,
        __isoc99_wscanf: exports4.__isoc99_wscanf,
        __main_argc_argv: exports8.__main_argc_argv,
        __main_void: exports4.__main_void,
        __memory_base: exports4['libc.so:memory_base'],
        __posix_getopt: exports4.__posix_getopt,
        __small_printf: exports4.__small_printf,
        __stack_pointer: exports4.__stack_pointer,
        __strtod_l: exports4.__strtod_l,
        __strtof_l: exports4.__strtof_l,
        __strtoimax_internal: exports4.__strtoimax_internal,
        __strtol_internal: exports4.__strtol_internal,
        __strtold_l: exports4.__strtold_l,
        __strtoll_internal: exports4.__strtoll_internal,
        __strtoul_internal: exports4.__strtoul_internal,
        __strtoull_internal: exports4.__strtoull_internal,
        __strtoumax_internal: exports4.__strtoumax_internal,
        __table_base: exports4['libc.so:table_base'],
        __wasilibc_find_relpath_alloc: exports4.__wasilibc_find_relpath_alloc,
        __xpg_basename: exports4.__xpg_basename,
        __xpg_strerror_r: exports4.__xpg_strerror_r,
        alphasort64: exports4.alphasort64,
        asctime_r: exports4.asctime_r,
        clearerr_unlocked: exports4.clearerr_unlocked,
        clock_gettime: exports4.clock_gettime,
        creat64: exports4.creat64,
        crypt_r: exports4.crypt_r,
        drem: exports4.drem,
        dremf: exports4.dremf,
        duplocale: exports4.duplocale,
        fdopen: exports4.fdopen,
        feof_unlocked: exports4.feof_unlocked,
        ferror_unlocked: exports4.ferror_unlocked,
        fflush_unlocked: exports4.fflush_unlocked,
        fgetc_unlocked: exports4.fgetc_unlocked,
        fgetpos64: exports4.fgetpos64,
        fgets_unlocked: exports4.fgets_unlocked,
        fgetwc_unlocked: exports4.fgetwc_unlocked,
        fgetws_unlocked: exports4.fgetws_unlocked,
        fileno_unlocked: exports4.fileno_unlocked,
        fopen64: exports4.fopen64,
        fpurge: exports4.fpurge,
        fputc_unlocked: exports4.fputc_unlocked,
        fputs_unlocked: exports4.fputs_unlocked,
        fputwc_unlocked: exports4.fputwc_unlocked,
        fputws_unlocked: exports4.fputws_unlocked,
        fread_unlocked: exports4.fread_unlocked,
        freopen64: exports4.freopen64,
        fseeko: exports4.fseeko,
        fseeko64: exports4.fseeko64,
        fsetpos64: exports4.fsetpos64,
        ftello: exports4.ftello,
        ftello64: exports4.ftello64,
        futimesat: exports4.futimesat,
        fwrite_unlocked: exports4.fwrite_unlocked,
        getentropy: exports4.getentropy,
        getwc_unlocked: exports4.getwc_unlocked,
        getwchar_unlocked: exports4.getwchar_unlocked,
        glob64: exports4.glob64,
        globfree64: exports4.globfree64,
        gmtime_r: exports4.gmtime_r,
        hcreate_r: exports4.hcreate_r,
        hdestroy_r: exports4.hdestroy_r,
        hsearch_r: exports4.hsearch_r,
        inet_aton: exports4.inet_aton,
        iprintf: exports4.iprintf,
        isalnum_l: exports4.isalnum_l,
        isalpha_l: exports4.isalpha_l,
        isatty: exports4.isatty,
        isblank_l: exports4.isblank_l,
        iscntrl_l: exports4.iscntrl_l,
        isdigit_l: exports4.isdigit_l,
        isgraph_l: exports4.isgraph_l,
        islower_l: exports4.islower_l,
        isprint_l: exports4.isprint_l,
        ispunct_l: exports4.ispunct_l,
        isspace_l: exports4.isspace_l,
        isupper_l: exports4.isupper_l,
        iswalnum_l: exports4.iswalnum_l,
        iswalpha_l: exports4.iswalpha_l,
        iswblank_l: exports4.iswblank_l,
        iswcntrl_l: exports4.iswcntrl_l,
        iswctype_l: exports4.iswctype_l,
        iswdigit_l: exports4.iswdigit_l,
        iswgraph_l: exports4.iswgraph_l,
        iswlower_l: exports4.iswlower_l,
        iswprint_l: exports4.iswprint_l,
        iswpunct_l: exports4.iswpunct_l,
        iswspace_l: exports4.iswspace_l,
        iswupper_l: exports4.iswupper_l,
        iswxdigit_l: exports4.iswxdigit_l,
        isxdigit_l: exports4.isxdigit_l,
        lgamma_r: exports4.lgamma_r,
        lgammaf_r: exports4.lgammaf_r,
        lgammal_r: exports4.lgammal_r,
        localtime_r: exports4.localtime_r,
        lseek: exports4.lseek,
        memory: exports4.memory,
        memrchr: exports4.memrchr,
        newlocale: exports4.newlocale,
        nftw64: exports4.nftw64,
        nl_langinfo: exports4.nl_langinfo,
        nl_langinfo_l: exports4.nl_langinfo_l,
        pow10: exports4.pow10,
        pow10f: exports4.pow10f,
        pow10l: exports4.pow10l,
        putwc_unlocked: exports4.putwc_unlocked,
        putwchar_unlocked: exports4.putwchar_unlocked,
        qsort_r: exports4.qsort_r,
        reallocarray: exports4.reallocarray,
        stpcpy: exports4.stpcpy,
        stpncpy: exports4.stpncpy,
        strcasecmp_l: exports4.strcasecmp_l,
        strchrnul: exports4.strchrnul,
        strcoll_l: exports4.strcoll_l,
        strerror_l: exports4.strerror_l,
        strftime_l: exports4.strftime_l,
        strncasecmp_l: exports4.strncasecmp_l,
        strxfrm_l: exports4.strxfrm_l,
        tolower_l: exports4.tolower_l,
        toupper_l: exports4.toupper_l,
        towctrans_l: exports4.towctrans_l,
        towlower_l: exports4.towlower_l,
        towupper_l: exports4.towupper_l,
        uselocale: exports4.uselocale,
        versionsort64: exports4.versionsort64,
        wcscoll_l: exports4.wcscoll_l,
        wcsftime_l: exports4.wcsftime_l,
        wcsxfrm_l: exports4.wcsxfrm_l,
        wctrans_l: exports4.wctrans_l,
        wctype_l: exports4.wctype_l,
      },
      wasi_snapshot_preview1: {
        args_get: exports4['wasi_snapshot_preview1:args_get'],
        args_sizes_get: exports4['wasi_snapshot_preview1:args_sizes_get'],
        clock_res_get: exports4['wasi_snapshot_preview1:clock_res_get'],
        clock_time_get: exports4['wasi_snapshot_preview1:clock_time_get'],
        environ_get: exports4['wasi_snapshot_preview1:environ_get'],
        environ_sizes_get: exports4['wasi_snapshot_preview1:environ_sizes_get'],
        fd_advise: exports4['wasi_snapshot_preview1:fd_advise'],
        fd_allocate: exports4['wasi_snapshot_preview1:fd_allocate'],
        fd_close: exports4['wasi_snapshot_preview1:fd_close'],
        fd_datasync: exports4['wasi_snapshot_preview1:fd_datasync'],
        fd_fdstat_get: exports4['wasi_snapshot_preview1:fd_fdstat_get'],
        fd_fdstat_set_flags: exports4['wasi_snapshot_preview1:fd_fdstat_set_flags'],
        fd_fdstat_set_rights: exports4['wasi_snapshot_preview1:fd_fdstat_set_rights'],
        fd_filestat_get: exports4['wasi_snapshot_preview1:fd_filestat_get'],
        fd_filestat_set_size: exports4['wasi_snapshot_preview1:fd_filestat_set_size'],
        fd_filestat_set_times: exports4['wasi_snapshot_preview1:fd_filestat_set_times'],
        fd_pread: exports4['wasi_snapshot_preview1:fd_pread'],
        fd_prestat_dir_name: exports4['wasi_snapshot_preview1:fd_prestat_dir_name'],
        fd_prestat_get: exports4['wasi_snapshot_preview1:fd_prestat_get'],
        fd_pwrite: exports4['wasi_snapshot_preview1:fd_pwrite'],
        fd_read: exports4['wasi_snapshot_preview1:fd_read'],
        fd_readdir: exports4['wasi_snapshot_preview1:fd_readdir'],
        fd_renumber: exports4['wasi_snapshot_preview1:fd_renumber'],
        fd_seek: exports4['wasi_snapshot_preview1:fd_seek'],
        fd_sync: exports4['wasi_snapshot_preview1:fd_sync'],
        fd_tell: exports4['wasi_snapshot_preview1:fd_tell'],
        fd_write: exports4['wasi_snapshot_preview1:fd_write'],
        path_create_directory: exports4['wasi_snapshot_preview1:path_create_directory'],
        path_filestat_get: exports4['wasi_snapshot_preview1:path_filestat_get'],
        path_filestat_set_times: exports4['wasi_snapshot_preview1:path_filestat_set_times'],
        path_link: exports4['wasi_snapshot_preview1:path_link'],
        path_open: exports4['wasi_snapshot_preview1:path_open'],
        path_readlink: exports4['wasi_snapshot_preview1:path_readlink'],
        path_remove_directory: exports4['wasi_snapshot_preview1:path_remove_directory'],
        path_rename: exports4['wasi_snapshot_preview1:path_rename'],
        path_symlink: exports4['wasi_snapshot_preview1:path_symlink'],
        path_unlink_file: exports4['wasi_snapshot_preview1:path_unlink_file'],
        poll_oneoff: exports4['wasi_snapshot_preview1:poll_oneoff'],
        proc_exit: exports4['wasi_snapshot_preview1:proc_exit'],
        random_get: exports4['wasi_snapshot_preview1:random_get'],
        sched_yield: exports4['wasi_snapshot_preview1:sched_yield'],
        sock_accept: exports4['wasi_snapshot_preview1:sock_accept'],
        sock_recv: exports4['wasi_snapshot_preview1:sock_recv'],
        sock_send: exports4['wasi_snapshot_preview1:sock_send'],
        sock_shutdown: exports4['wasi_snapshot_preview1:sock_shutdown'],
      },
    }));
    ({ exports: exports11 } = yield instantiateCore(yield module6, {
      'GOT.mem': {
        errno: exports4['libwasi-emulated-mman.so:errno'],
      },
      env: {
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['libwasi-emulated-mman.so:memory_base'],
        __table_base: exports4['libwasi-emulated-mman.so:table_base'],
        free: exports10.free,
        malloc: exports10.malloc,
        memory: exports4.memory,
        memset: exports10.memset,
        pread: exports10.pread,
      },
    }));
    ({ exports: exports12 } = yield instantiateCore(yield module7, {
      'GOT.func': {
        __SIG_ERR: exports4['libwasi-emulated-signal.so:__SIG_ERR'],
        __SIG_IGN: exports4['libwasi-emulated-signal.so:__SIG_IGN'],
      },
      'GOT.mem': {
        errno: exports4['libwasi-emulated-signal.so:errno'],
        stderr: exports4['libwasi-emulated-signal.so:stderr'],
      },
      env: {
        __indirect_function_table: exports4.__indirect_function_table,
        __lctrans_cur: exports10.__lctrans_cur,
        __memory_base: exports4['libwasi-emulated-signal.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __sysv_signal: exports4.__sysv_signal,
        __table_base: exports4['libwasi-emulated-signal.so:table_base'],
        abort: exports10.abort,
        bsd_signal: exports4.bsd_signal,
        fprintf: exports10.fprintf,
        memory: exports4.memory,
      },
    }));
    ({ exports: exports13 } = yield instantiateCore(yield module8, {
      'GOT.mem': {
        errno: exports4['libwasi-emulated-process-clocks.so:errno'],
      },
      env: {
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['libwasi-emulated-process-clocks.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['libwasi-emulated-process-clocks.so:table_base'],
        __wasi_clock_time_get: exports10.__wasi_clock_time_get,
        clock: exports4.clock,
        memory: exports4.memory,
      },
    }));
    ({ exports: exports14 } = yield instantiateCore(yield module9, {
      'GOT.mem': {
        rb_cFalseClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cFalseClass'],
        rb_cInteger: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cInteger'],
        rb_cNilClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cNilClass'],
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cObject'],
        rb_cSymbol: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cSymbol'],
        rb_cTrueClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cTrueClass'],
        ruby_digit36_to_number_table: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:ruby_digit36_to_number_table'],
        ruby_hexdigits: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:ruby_hexdigits'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:table_base'],
        memcmp: exports8.memcmp,
        memcpy: exports10.memcpy,
        memory: exports4.memory,
        rb_alloc_tmp_buffer_with_count: exports8.rb_alloc_tmp_buffer_with_count,
        rb_call_super: exports8.rb_call_super,
        rb_cvar_get: exports8.rb_cvar_get,
        rb_define_alias: exports8.rb_define_alias,
        rb_define_class: exports8.rb_define_class,
        rb_define_method: exports8.rb_define_method,
        rb_define_module_under: exports8.rb_define_module_under,
        rb_enc_associate: exports8.rb_enc_associate,
        rb_enc_associate_index: exports8.rb_enc_associate_index,
        rb_enc_dummy_p: exports8.rb_enc_dummy_p,
        rb_enc_get: exports8.rb_enc_get,
        rb_enc_get_index: exports8.rb_enc_get_index,
        rb_enc_str_coderange: exports8.rb_enc_str_coderange,
        rb_enc_to_index: exports8.rb_enc_to_index,
        rb_error_arity: exports8.rb_error_arity,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_extend_object: exports8.rb_extend_object,
        rb_free_tmp_buffer: exports8.rb_free_tmp_buffer,
        rb_intern2: exports8.rb_intern2,
        rb_prepend_module: exports8.rb_prepend_module,
        rb_str_buf_new: exports8.rb_str_buf_new,
        rb_str_cat: exports8.rb_str_cat,
        rb_str_dup: exports8.rb_str_dup,
        rb_str_new: exports8.rb_str_new,
        rb_string_value: exports8.rb_string_value,
        rb_to_encoding: exports8.rb_to_encoding,
        ruby_malloc_size_overflow: exports8.ruby_malloc_size_overflow,
        ruby_scan_digits: exports8.ruby_scan_digits,
        strcasecmp: exports10.strcasecmp,
      },
    }));
    ({ exports: exports15 } = yield instantiateCore(yield module10, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/continuation.so:memory_base'],
        memory: exports4.memory,
        rb_warn: exports8.rb_warn,
        ruby_Init_Continuation_body: exports8.ruby_Init_Continuation_body,
      },
    }));
    ({ exports: exports16 } = yield instantiateCore(yield module11, {
      'GOT.func': {
        rb_coverage_resume: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/coverage.so:rb_coverage_resume'],
        rb_coverage_suspend: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/coverage.so:rb_coverage_suspend'],
      },
      'GOT.mem': {
        rb_eRuntimeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/coverage.so:rb_eRuntimeError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/coverage.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/coverage.so:table_base'],
        memory: exports4.memory,
        rb_ary_dup: exports8.rb_ary_dup,
        rb_ary_freeze: exports8.rb_ary_freeze,
        rb_ary_new_from_args: exports8.rb_ary_new_from_args,
        rb_bug: exports8.rb_bug,
        rb_clear_coverages: exports8.rb_clear_coverages,
        rb_convert_type: exports8.rb_convert_type,
        rb_define_module: exports8.rb_define_module,
        rb_define_module_function: exports8.rb_define_module_function,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_error_arity: exports8.rb_error_arity,
        rb_gc_writebarrier_unprotect: exports8.rb_gc_writebarrier_unprotect,
        rb_get_coverages: exports8.rb_get_coverages,
        rb_global_variable: exports8.rb_global_variable,
        rb_hash_aref: exports8.rb_hash_aref,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_foreach: exports8.rb_hash_foreach,
        rb_hash_freeze: exports8.rb_hash_freeze,
        rb_hash_lookup: exports8.rb_hash_lookup,
        rb_hash_new: exports8.rb_hash_new,
        rb_id2sym: exports8.rb_id2sym,
        rb_ident_hash_new: exports8.rb_ident_hash_new,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_obj_hide: exports8.rb_obj_hide,
        rb_objspace_each_objects: exports8.rb_objspace_each_objects,
        rb_raise: exports8.rb_raise,
        rb_reset_coverages: exports8.rb_reset_coverages,
        rb_resolve_me_location: exports8.rb_resolve_me_location,
        rb_resume_coverages: exports8.rb_resume_coverages,
        rb_set_coverages: exports8.rb_set_coverages,
        rb_suspend_coverages: exports8.rb_suspend_coverages,
        rb_sym2id: exports8.rb_sym2id,
        rb_warn: exports8.rb_warn,
      },
    }));
    ({ exports: exports17 } = yield instantiateCore(yield module12, {
      'GOT.mem': {
        _CLOCK_REALTIME: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:_CLOCK_REALTIME'],
        rb_cFalseClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cFalseClass'],
        rb_cInteger: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cInteger'],
        rb_cNilClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cNilClass'],
        rb_cNumeric: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cNumeric'],
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cObject'],
        rb_cRational: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cRational'],
        rb_cSymbol: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cSymbol'],
        rb_cTime: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cTime'],
        rb_cTrueClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cTrueClass'],
        rb_eArgError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_eArgError'],
        rb_eTypeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_eTypeError'],
        rb_mComparable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_mComparable'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:table_base'],
        clock_gettime: exports10.clock_gettime,
        localtime_r: exports10.localtime_r,
        memchr: exports10.memchr,
        memcpy: exports10.memcpy,
        memmove: exports10.memmove,
        memory: exports4.memory,
        memset: exports10.memset,
        modf: exports10.modf,
        rb_alloc_tmp_buffer_with_count: exports8.rb_alloc_tmp_buffer_with_count,
        rb_ary_freeze: exports8.rb_ary_freeze,
        rb_ary_new_capa: exports8.rb_ary_new_capa,
        rb_ary_new_from_args: exports8.rb_ary_new_from_args,
        rb_ary_push: exports8.rb_ary_push,
        rb_backref_get: exports8.rb_backref_get,
        rb_backref_set: exports8.rb_backref_set,
        rb_block_given_p: exports8.rb_block_given_p,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_cmpint: exports8.rb_cmpint,
        rb_copy_generic_ivar: exports8.rb_copy_generic_ivar,
        rb_cstr_to_inum: exports8.rb_cstr_to_inum,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class: exports8.rb_define_class,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_const: exports8.rb_define_const,
        rb_define_method: exports8.rb_define_method,
        rb_define_private_method: exports8.rb_define_private_method,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_enc_copy: exports8.rb_enc_copy,
        rb_enc_dummy_p: exports8.rb_enc_dummy_p,
        rb_enc_get: exports8.rb_enc_get,
        rb_enc_sprintf: exports8.rb_enc_sprintf,
        rb_enumeratorize_with_size: exports8.rb_enumeratorize_with_size,
        rb_errno_ptr: exports8.rb_errno_ptr,
        rb_error_arity: exports8.rb_error_arity,
        rb_error_frozen_object: exports8.rb_error_frozen_object,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_float_new: exports8.rb_float_new,
        rb_float_value: exports8.rb_float_value,
        rb_frame_this_func: exports8.rb_frame_this_func,
        rb_free_tmp_buffer: exports8.rb_free_tmp_buffer,
        rb_funcall: exports8.rb_funcall,
        rb_funcallv: exports8.rb_funcallv,
        rb_gc_mark: exports8.rb_gc_mark,
        rb_gc_register_mark_object: exports8.rb_gc_register_mark_object,
        rb_gc_writebarrier: exports8.rb_gc_writebarrier,
        rb_hash: exports8.rb_hash,
        rb_hash_aref: exports8.rb_hash_aref,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_delete: exports8.rb_hash_delete,
        rb_hash_dup: exports8.rb_hash_dup,
        rb_hash_new: exports8.rb_hash_new,
        rb_id2sym: exports8.rb_id2sym,
        rb_include_module: exports8.rb_include_module,
        rb_int2big: exports8.rb_int2big,
        rb_int_positive_pow: exports8.rb_int_positive_pow,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_keyword_given_p: exports8.rb_keyword_given_p,
        rb_ll2inum: exports8.rb_ll2inum,
        rb_marshal_load: exports8.rb_marshal_load,
        rb_match_busy: exports8.rb_match_busy,
        rb_memhash: exports8.rb_memhash,
        rb_num2dbl: exports8.rb_num2dbl,
        rb_num2long: exports8.rb_num2long,
        rb_num2ulong: exports8.rb_num2ulong,
        rb_num_coerce_cmp: exports8.rb_num_coerce_cmp,
        rb_obj_class: exports8.rb_obj_class,
        rb_obj_freeze: exports8.rb_obj_freeze,
        rb_obj_is_kind_of: exports8.rb_obj_is_kind_of,
        rb_raise: exports8.rb_raise,
        rb_rational_den: exports8.rb_rational_den,
        rb_rational_new: exports8.rb_rational_new,
        rb_rational_num: exports8.rb_rational_num,
        rb_reg_new: exports8.rb_reg_new,
        rb_reg_nth_match: exports8.rb_reg_nth_match,
        rb_st_locale_insensitive_strncasecmp: exports8.rb_st_locale_insensitive_strncasecmp,
        rb_str_append: exports8.rb_str_append,
        rb_str_cat: exports8.rb_str_cat,
        rb_str_dup: exports8.rb_str_dup,
        rb_str_format: exports8.rb_str_format,
        rb_str_modify: exports8.rb_str_modify,
        rb_str_new: exports8.rb_str_new,
        rb_str_new_static: exports8.rb_str_new_static,
        rb_str_subseq: exports8.rb_str_subseq,
        rb_str_to_inum: exports8.rb_str_to_inum,
        rb_string_value: exports8.rb_string_value,
        rb_string_value_cstr: exports8.rb_string_value_cstr,
        rb_sym2id: exports8.rb_sym2id,
        rb_sys_fail: exports8.rb_sys_fail,
        rb_uint2big: exports8.rb_uint2big,
        rb_undef_method: exports8.rb_undef_method,
        rb_unexpected_type: exports8.rb_unexpected_type,
        rb_usascii_encoding: exports8.rb_usascii_encoding,
        rb_usascii_str_new: exports8.rb_usascii_str_new,
        rb_usascii_str_new_cstr: exports8.rb_usascii_str_new_cstr,
        rb_usascii_str_new_static: exports8.rb_usascii_str_new_static,
        rb_warning: exports8.rb_warning,
        rb_yield: exports8.rb_yield,
        round: exports10.round,
        ruby_scan_digits: exports8.ruby_scan_digits,
        ruby_snprintf: exports8.ruby_snprintf,
        ruby_strtoul: exports8.ruby_strtoul,
        ruby_xfree: exports8.ruby_xfree,
        ruby_xmalloc: exports8.ruby_xmalloc,
        ruby_xrealloc: exports8.ruby_xrealloc,
        strchr: exports10.strchr,
        strcmp: exports10.strcmp,
        strlcpy: exports10.strlcpy,
        strlen: exports10.strlen,
        strspn: exports10.strspn,
        strtoul: exports10.strtoul,
        time: exports10.time,
        tzset: exports8.tzset,
      },
    }));
    ({ exports: exports18 } = yield instantiateCore(yield module13, {
      'GOT.mem': {
        rb_eRuntimeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/bubblebabble.so:rb_eRuntimeError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/bubblebabble.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/bubblebabble.so:table_base'],
        memory: exports4.memory,
        rb_const_get: exports8.rb_const_get,
        rb_define_method: exports8.rb_define_method,
        rb_define_module_function: exports8.rb_define_module_function,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_funcall: exports8.rb_funcall,
        rb_funcallv: exports8.rb_funcallv,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_path2class: exports8.rb_path2class,
        rb_raise: exports8.rb_raise,
        rb_require: exports8.rb_require,
        rb_str_new: exports8.rb_str_new,
        rb_string_value: exports8.rb_string_value,
      },
    }));
    ({ exports: exports19 } = yield instantiateCore(yield module14, {
      'GOT.func': {
        rb_Digest_MD5_Finish: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/md5.so:rb_Digest_MD5_Finish'],
        rb_Digest_MD5_Init: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/md5.so:rb_Digest_MD5_Init'],
        rb_Digest_MD5_Update: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/md5.so:rb_Digest_MD5_Update'],
      },
      'GOT.mem': {
        rb_eLoadError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/md5.so:rb_eLoadError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/md5.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        memcpy: exports10.memcpy,
        memory: exports4.memory,
        rb_const_get: exports8.rb_const_get,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_ext_resolve_symbol: exports8.rb_ext_resolve_symbol,
        rb_intern2: exports8.rb_intern2,
        rb_iv_set: exports8.rb_iv_set,
        rb_path2class: exports8.rb_path2class,
        rb_raise: exports8.rb_raise,
        rb_require: exports8.rb_require,
      },
    }));
    ({ exports: exports20 } = yield instantiateCore(yield module15, {
      'GOT.func': {
        rb_Digest_RMD160_Finish: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/rmd160.so:rb_Digest_RMD160_Finish'],
        rb_Digest_RMD160_Init: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/rmd160.so:rb_Digest_RMD160_Init'],
        rb_Digest_RMD160_Update: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/rmd160.so:rb_Digest_RMD160_Update'],
      },
      'GOT.mem': {
        rb_eLoadError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/rmd160.so:rb_eLoadError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/rmd160.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        memcpy: exports10.memcpy,
        memory: exports4.memory,
        memset: exports10.memset,
        rb_const_get: exports8.rb_const_get,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_ext_resolve_symbol: exports8.rb_ext_resolve_symbol,
        rb_intern2: exports8.rb_intern2,
        rb_iv_set: exports8.rb_iv_set,
        rb_path2class: exports8.rb_path2class,
        rb_raise: exports8.rb_raise,
        rb_require: exports8.rb_require,
      },
    }));
    ({ exports: exports21 } = yield instantiateCore(yield module16, {
      'GOT.func': {
        rb_Digest_SHA1_Finish: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha1.so:rb_Digest_SHA1_Finish'],
        rb_Digest_SHA1_Init: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha1.so:rb_Digest_SHA1_Init'],
        rb_Digest_SHA1_Update: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha1.so:rb_Digest_SHA1_Update'],
      },
      'GOT.mem': {
        rb_eLoadError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha1.so:rb_eLoadError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha1.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        memcpy: exports10.memcpy,
        memory: exports4.memory,
        rb_const_get: exports8.rb_const_get,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_ext_resolve_symbol: exports8.rb_ext_resolve_symbol,
        rb_intern2: exports8.rb_intern2,
        rb_iv_set: exports8.rb_iv_set,
        rb_path2class: exports8.rb_path2class,
        rb_raise: exports8.rb_raise,
        rb_require: exports8.rb_require,
      },
    }));
    ({ exports: exports22 } = yield instantiateCore(yield module17, {
      'GOT.func': {
        rb_Digest_SHA256_Finish: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_Digest_SHA256_Finish'],
        rb_Digest_SHA256_Init: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_Digest_SHA256_Init'],
        rb_Digest_SHA256_Update: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_Digest_SHA256_Update'],
        rb_Digest_SHA384_Finish: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_Digest_SHA384_Finish'],
        rb_Digest_SHA384_Init: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_Digest_SHA384_Init'],
        rb_Digest_SHA384_Update: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_Digest_SHA384_Update'],
        rb_Digest_SHA512_Finish: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_Digest_SHA512_Finish'],
        rb_Digest_SHA512_Init: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_Digest_SHA512_Init'],
        rb_Digest_SHA512_Update: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_Digest_SHA512_Update'],
      },
      'GOT.mem': {
        rb_eLoadError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_eLoadError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        memcpy: exports10.memcpy,
        memory: exports4.memory,
        memset: exports10.memset,
        rb_const_get: exports8.rb_const_get,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_ext_resolve_symbol: exports8.rb_ext_resolve_symbol,
        rb_intern2: exports8.rb_intern2,
        rb_ivar_set: exports8.rb_ivar_set,
        rb_path2class: exports8.rb_path2class,
        rb_raise: exports8.rb_raise,
        rb_require: exports8.rb_require,
      },
    }));
    ({ exports: exports23 } = yield instantiateCore(yield module18, {
      'GOT.mem': {
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_cObject'],
        rb_eArgError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eArgError'],
        rb_eNotImpError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eNotImpError'],
        rb_eRuntimeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eRuntimeError'],
        rb_eTypeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eTypeError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:table_base'],
        memcpy: exports10.memcpy,
        memory: exports4.memory,
        rb_check_string_type: exports8.rb_check_string_type,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_class_superclass: exports8.rb_class_superclass,
        rb_data_typed_object_wrap: exports8.rb_data_typed_object_wrap,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_method: exports8.rb_define_method,
        rb_define_module: exports8.rb_define_module,
        rb_define_module_function: exports8.rb_define_module_function,
        rb_define_module_under: exports8.rb_define_module_under,
        rb_define_private_method: exports8.rb_define_private_method,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_error_arity: exports8.rb_error_arity,
        rb_error_frozen_object: exports8.rb_error_frozen_object,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_funcall: exports8.rb_funcall,
        rb_funcallv: exports8.rb_funcallv,
        rb_include_module: exports8.rb_include_module,
        rb_int2big: exports8.rb_int2big,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_ivar_defined: exports8.rb_ivar_defined,
        rb_ivar_get: exports8.rb_ivar_get,
        rb_obj_alloc: exports8.rb_obj_alloc,
        rb_obj_call_init: exports8.rb_obj_call_init,
        rb_obj_class: exports8.rb_obj_class,
        rb_obj_classname: exports8.rb_obj_classname,
        rb_obj_clone: exports8.rb_obj_clone,
        rb_obj_freeze: exports8.rb_obj_freeze,
        rb_obj_is_kind_of: exports8.rb_obj_is_kind_of,
        rb_raise: exports8.rb_raise,
        rb_str_buf_append: exports8.rb_str_buf_append,
        rb_str_buf_new: exports8.rb_str_buf_new,
        rb_str_cat: exports8.rb_str_cat,
        rb_str_cat_cstr: exports8.rb_str_cat_cstr,
        rb_str_cmp: exports8.rb_str_cmp,
        rb_str_modify: exports8.rb_str_modify,
        rb_str_new: exports8.rb_str_new,
        rb_string_value: exports8.rb_string_value,
        rb_typeddata_is_kind_of: exports8.rb_typeddata_is_kind_of,
        rb_uint2big: exports8.rb_uint2big,
        rb_usascii_str_new: exports8.rb_usascii_str_new,
        strlen: exports10.strlen,
      },
    }));
    ({ exports: exports24 } = yield instantiateCore(yield module19, {
      'GOT.func': {
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_mb2_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so:onigenc_mb2_code_to_mbclen'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so:onigenc_not_support_get_ctype_code_range'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so:table_base'],
        memory: exports4.memory,
        onigenc_mb2_code_to_mbc: exports8.onigenc_mb2_code_to_mbc,
        onigenc_mb2_is_code_ctype: exports8.onigenc_mb2_is_code_ctype,
        onigenc_mbclen: exports8.onigenc_mbclen,
        onigenc_mbn_mbc_case_fold: exports8.onigenc_mbn_mbc_case_fold,
        onigenc_mbn_mbc_to_code: exports8.onigenc_mbn_mbc_to_code,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports25 } = yield instantiateCore(yield module20, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_unicode_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:onigenc_unicode_apply_all_case_fold'],
        onigenc_unicode_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:onigenc_unicode_case_map'],
        onigenc_unicode_is_code_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:onigenc_unicode_is_code_ctype'],
        onigenc_unicode_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:onigenc_unicode_property_name_to_ctype'],
      },
      'GOT.mem': {
        OnigEncAsciiToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:OnigEncAsciiToLowerCaseTable'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:table_base'],
        memory: exports4.memory,
        onigenc_unicode_ctype_code_range: exports8.onigenc_unicode_ctype_code_range,
        onigenc_unicode_get_case_fold_codes_by_str: exports8.onigenc_unicode_get_case_fold_codes_by_str,
        onigenc_unicode_mbc_case_fold: exports8.onigenc_unicode_mbc_case_fold,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports26 } = yield instantiateCore(yield module21, {
      'GOT.func': {
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_mb2_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so:onigenc_mb2_code_to_mbclen'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so:onigenc_not_support_get_ctype_code_range'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so:table_base'],
        memory: exports4.memory,
        onigenc_mb2_code_to_mbc: exports8.onigenc_mb2_code_to_mbc,
        onigenc_mb2_is_code_ctype: exports8.onigenc_mb2_is_code_ctype,
        onigenc_mbclen: exports8.onigenc_mbclen,
        onigenc_mbn_mbc_case_fold: exports8.onigenc_mbn_mbc_case_fold,
        onigenc_mbn_mbc_to_code: exports8.onigenc_mbn_mbc_to_code,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports27 } = yield instantiateCore(yield module22, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:onigenc_not_support_get_ctype_code_range'],
      },
      'GOT.mem': {
        OnigEncAsciiCtypeTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:OnigEncAsciiCtypeTable'],
        OnigEncAsciiToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:OnigEncAsciiToLowerCaseTable'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:table_base'],
        memory: exports4.memory,
        onigenc_mbclen: exports8.onigenc_mbclen,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports28 } = yield instantiateCore(yield module23, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/encdb.so:memory_base'],
        memory: exports4.memory,
        rb_enc_set_base: exports8.rb_enc_set_base,
        rb_encdb_alias: exports8.rb_encdb_alias,
        rb_encdb_declare: exports8.rb_encdb_declare,
        rb_encdb_dummy: exports8.rb_encdb_dummy,
        rb_encdb_replicate: exports8.rb_encdb_replicate,
      },
    }));
    ({ exports: exports29 } = yield instantiateCore(yield module24, {
      'GOT.func': {
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:onigenc_is_mbc_newline_0x0a'],
      },
      'GOT.mem': {
        OnigEncAsciiCtypeTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:OnigEncAsciiCtypeTable'],
        OnigEncAsciiToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:OnigEncAsciiToLowerCaseTable'],
        OnigEncodingASCII: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:OnigEncodingASCII'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:table_base'],
        memory: exports4.memory,
        onig_is_in_code_range: exports8.onig_is_in_code_range,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_ascii_get_case_fold_codes_by_str: exports8.onigenc_ascii_get_case_fold_codes_by_str,
        onigenc_minimum_property_name_to_ctype: exports8.onigenc_minimum_property_name_to_ctype,
        onigenc_with_ascii_strnicmp: exports8.onigenc_with_ascii_strnicmp,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports30 } = yield instantiateCore(yield module25, {
      'GOT.func': {
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_mb2_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so:onigenc_mb2_code_to_mbclen'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so:onigenc_not_support_get_ctype_code_range'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so:table_base'],
        memory: exports4.memory,
        onigenc_mb2_code_to_mbc: exports8.onigenc_mb2_code_to_mbc,
        onigenc_mb2_is_code_ctype: exports8.onigenc_mb2_is_code_ctype,
        onigenc_mbclen: exports8.onigenc_mbclen,
        onigenc_mbn_mbc_case_fold: exports8.onigenc_mbn_mbc_case_fold,
        onigenc_mbn_mbc_to_code: exports8.onigenc_mbn_mbc_to_code,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports31 } = yield instantiateCore(yield module26, {
      'GOT.func': {
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_mb4_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so:onigenc_mb4_code_to_mbclen'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so:onigenc_not_support_get_ctype_code_range'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so:table_base'],
        memory: exports4.memory,
        onigenc_mb4_code_to_mbc: exports8.onigenc_mb4_code_to_mbc,
        onigenc_mb4_is_code_ctype: exports8.onigenc_mb4_is_code_ctype,
        onigenc_mbclen: exports8.onigenc_mbclen,
        onigenc_mbn_mbc_case_fold: exports8.onigenc_mbn_mbc_case_fold,
        onigenc_mbn_mbc_to_code: exports8.onigenc_mbn_mbc_to_code,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports32 } = yield instantiateCore(yield module27, {
      'GOT.func': {
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_mb4_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so:onigenc_mb4_code_to_mbclen'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so:onigenc_not_support_get_ctype_code_range'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so:table_base'],
        memory: exports4.memory,
        onigenc_mb4_code_to_mbc: exports8.onigenc_mb4_code_to_mbc,
        onigenc_mb4_is_code_ctype: exports8.onigenc_mb4_is_code_ctype,
        onigenc_mbclen: exports8.onigenc_mbclen,
        onigenc_mbn_mbc_case_fold: exports8.onigenc_mbn_mbc_case_fold,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports33 } = yield instantiateCore(yield module28, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb2312.so:memory_base'],
        memory: exports4.memory,
      },
    }));
    ({ exports: exports34 } = yield instantiateCore(yield module29, {
      'GOT.func': {
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_mb2_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so:onigenc_mb2_code_to_mbclen'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so:onigenc_not_support_get_ctype_code_range'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so:table_base'],
        memory: exports4.memory,
        onigenc_mb2_code_to_mbc: exports8.onigenc_mb2_code_to_mbc,
        onigenc_mb2_is_code_ctype: exports8.onigenc_mb2_is_code_ctype,
        onigenc_mbclen: exports8.onigenc_mbclen,
        onigenc_mbn_mbc_case_fold: exports8.onigenc_mbn_mbc_case_fold,
        onigenc_mbn_mbc_to_code: exports8.onigenc_mbn_mbc_to_code,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports35 } = yield instantiateCore(yield module30, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:onigenc_single_byte_mbc_to_code'],
      },
      'GOT.mem': {
        OnigEncISO_8859_1_ToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:OnigEncISO_8859_1_ToLowerCaseTable'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports36 } = yield instantiateCore(yield module31, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports37 } = yield instantiateCore(yield module32, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_mbc_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_ascii_mbc_case_fold'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_single_byte_ascii_only_case_map'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so:table_base'],
        memory: exports4.memory,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports38 } = yield instantiateCore(yield module33, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports39 } = yield instantiateCore(yield module34, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports40 } = yield instantiateCore(yield module35, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports41 } = yield instantiateCore(yield module36, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports42 } = yield instantiateCore(yield module37, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports43 } = yield instantiateCore(yield module38, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports44 } = yield instantiateCore(yield module39, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports45 } = yield instantiateCore(yield module40, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports46 } = yield instantiateCore(yield module41, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_mbc_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_ascii_mbc_case_fold'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_single_byte_ascii_only_case_map'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so:table_base'],
        memory: exports4.memory,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports47 } = yield instantiateCore(yield module42, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports48 } = yield instantiateCore(yield module43, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_ascii_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_ascii_apply_all_case_fold'],
        onigenc_ascii_get_case_fold_codes_by_str: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_ascii_get_case_fold_codes_by_str'],
        onigenc_ascii_mbc_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_ascii_mbc_case_fold'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_single_byte_ascii_only_case_map'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so:table_base'],
        memory: exports4.memory,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports49 } = yield instantiateCore(yield module44, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports50 } = yield instantiateCore(yield module45, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_single_byte_ascii_only_case_map'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports51 } = yield instantiateCore(yield module46, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_single_byte_ascii_only_case_map'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports52 } = yield instantiateCore(yield module47, {
      'GOT.func': {
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:onigenc_is_mbc_newline_0x0a'],
      },
      'GOT.mem': {
        OnigEncAsciiCtypeTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:OnigEncAsciiCtypeTable'],
        OnigEncAsciiToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:OnigEncAsciiToLowerCaseTable'],
        OnigEncodingASCII: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:OnigEncodingASCII'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:table_base'],
        memory: exports4.memory,
        onig_is_in_code_range: exports8.onig_is_in_code_range,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_ascii_get_case_fold_codes_by_str: exports8.onigenc_ascii_get_case_fold_codes_by_str,
        onigenc_minimum_property_name_to_ctype: exports8.onigenc_minimum_property_name_to_ctype,
        onigenc_with_ascii_strnicmp: exports8.onigenc_with_ascii_strnicmp,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports53 } = yield instantiateCore(yield module48, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/big5.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports54 } = yield instantiateCore(yield module49, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/cesu_8.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/cesu_8.so:table_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports55 } = yield instantiateCore(yield module50, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/chinese.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports56 } = yield instantiateCore(yield module51, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/ebcdic.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports57 } = yield instantiateCore(yield module52, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports58 } = yield instantiateCore(yield module53, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji_iso2022_kddi.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji_iso2022_kddi.so:table_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports59 } = yield instantiateCore(yield module54, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji_sjis_docomo.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports60 } = yield instantiateCore(yield module55, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji_sjis_kddi.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports61 } = yield instantiateCore(yield module56, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji_sjis_softbank.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports62 } = yield instantiateCore(yield module57, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/escape.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/escape.so:table_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports63 } = yield instantiateCore(yield module58, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/gb18030.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/gb18030.so:table_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports64 } = yield instantiateCore(yield module59, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/gbk.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports65 } = yield instantiateCore(yield module60, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/iso2022.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/iso2022.so:table_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports66 } = yield instantiateCore(yield module61, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/japanese.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/japanese.so:table_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports67 } = yield instantiateCore(yield module62, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/japanese_euc.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports68 } = yield instantiateCore(yield module63, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/japanese_sjis.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports69 } = yield instantiateCore(yield module64, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/korean.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports70 } = yield instantiateCore(yield module65, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/single_byte.so:memory_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports71 } = yield instantiateCore(yield module66, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/transdb.so:memory_base'],
        memory: exports4.memory,
        rb_declare_transcoder: exports8.rb_declare_transcoder,
      },
    }));
    ({ exports: exports72 } = yield instantiateCore(yield module67, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/utf8_mac.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/utf8_mac.so:table_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports73 } = yield instantiateCore(yield module68, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/utf_16_32.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/utf_16_32.so:table_base'],
        memory: exports4.memory,
        rb_register_transcoder: exports8.rb_register_transcoder,
      },
    }));
    ({ exports: exports74 } = yield instantiateCore(yield module69, {
      'GOT.func': {
        onigenc_always_false_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:onigenc_always_false_is_allowed_reverse_match'],
        onigenc_unicode_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:onigenc_unicode_apply_all_case_fold'],
        onigenc_unicode_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:onigenc_unicode_case_map'],
        onigenc_unicode_is_code_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:onigenc_unicode_is_code_ctype'],
        onigenc_unicode_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:onigenc_unicode_property_name_to_ctype'],
        onigenc_utf16_32_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:onigenc_utf16_32_get_ctype_code_range'],
      },
      'GOT.mem': {
        OnigEncAsciiToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:OnigEncAsciiToLowerCaseTable'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:table_base'],
        memory: exports4.memory,
        onigenc_unicode_get_case_fold_codes_by_str: exports8.onigenc_unicode_get_case_fold_codes_by_str,
        onigenc_unicode_mbc_case_fold: exports8.onigenc_unicode_mbc_case_fold,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports75 } = yield instantiateCore(yield module70, {
      'GOT.func': {
        onigenc_always_false_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:onigenc_always_false_is_allowed_reverse_match'],
        onigenc_unicode_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:onigenc_unicode_apply_all_case_fold'],
        onigenc_unicode_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:onigenc_unicode_case_map'],
        onigenc_unicode_is_code_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:onigenc_unicode_is_code_ctype'],
        onigenc_unicode_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:onigenc_unicode_property_name_to_ctype'],
        onigenc_utf16_32_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:onigenc_utf16_32_get_ctype_code_range'],
      },
      'GOT.mem': {
        OnigEncAsciiToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:OnigEncAsciiToLowerCaseTable'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:table_base'],
        memory: exports4.memory,
        onigenc_unicode_get_case_fold_codes_by_str: exports8.onigenc_unicode_get_case_fold_codes_by_str,
        onigenc_unicode_mbc_case_fold: exports8.onigenc_unicode_mbc_case_fold,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports76 } = yield instantiateCore(yield module71, {
      'GOT.func': {
        onigenc_always_false_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:onigenc_always_false_is_allowed_reverse_match'],
        onigenc_unicode_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:onigenc_unicode_apply_all_case_fold'],
        onigenc_unicode_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:onigenc_unicode_case_map'],
        onigenc_unicode_is_code_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:onigenc_unicode_is_code_ctype'],
        onigenc_unicode_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:onigenc_unicode_property_name_to_ctype'],
        onigenc_utf16_32_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:onigenc_utf16_32_get_ctype_code_range'],
      },
      'GOT.mem': {
        OnigEncAsciiToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:OnigEncAsciiToLowerCaseTable'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:table_base'],
        memory: exports4.memory,
        onigenc_unicode_get_case_fold_codes_by_str: exports8.onigenc_unicode_get_case_fold_codes_by_str,
        onigenc_unicode_mbc_case_fold: exports8.onigenc_unicode_mbc_case_fold,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports77 } = yield instantiateCore(yield module72, {
      'GOT.func': {
        onigenc_always_false_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:onigenc_always_false_is_allowed_reverse_match'],
        onigenc_unicode_apply_all_case_fold: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:onigenc_unicode_apply_all_case_fold'],
        onigenc_unicode_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:onigenc_unicode_case_map'],
        onigenc_unicode_is_code_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:onigenc_unicode_is_code_ctype'],
        onigenc_unicode_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:onigenc_unicode_property_name_to_ctype'],
        onigenc_utf16_32_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:onigenc_utf16_32_get_ctype_code_range'],
      },
      'GOT.mem': {
        OnigEncAsciiToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:OnigEncAsciiToLowerCaseTable'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:table_base'],
        memory: exports4.memory,
        onigenc_unicode_get_case_fold_codes_by_str: exports8.onigenc_unicode_get_case_fold_codes_by_str,
        onigenc_unicode_mbc_case_fold: exports8.onigenc_unicode_mbc_case_fold,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports78 } = yield instantiateCore(yield module73, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports79 } = yield instantiateCore(yield module74, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports80 } = yield instantiateCore(yield module75, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports81 } = yield instantiateCore(yield module76, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports82 } = yield instantiateCore(yield module77, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports83 } = yield instantiateCore(yield module78, {
      'GOT.func': {
        onigenc_always_true_is_allowed_reverse_match: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:onigenc_always_true_is_allowed_reverse_match'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:onigenc_is_mbc_newline_0x0a'],
        onigenc_minimum_property_name_to_ctype: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:onigenc_minimum_property_name_to_ctype'],
        onigenc_not_support_get_ctype_code_range: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:onigenc_not_support_get_ctype_code_range'],
        onigenc_single_byte_code_to_mbc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:onigenc_single_byte_code_to_mbc'],
        onigenc_single_byte_code_to_mbclen: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:onigenc_single_byte_code_to_mbclen'],
        onigenc_single_byte_left_adjust_char_head: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:onigenc_single_byte_left_adjust_char_head'],
        onigenc_single_byte_mbc_enc_len: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:onigenc_single_byte_mbc_enc_len'],
        onigenc_single_byte_mbc_to_code: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:onigenc_single_byte_mbc_to_code'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so:table_base'],
        memory: exports4.memory,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_get_case_fold_codes_by_str_with_map: exports8.onigenc_get_case_fold_codes_by_str_with_map,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports84 } = yield instantiateCore(yield module79, {
      'GOT.func': {
        onigenc_ascii_only_case_map: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:onigenc_ascii_only_case_map'],
        onigenc_is_mbc_newline_0x0a: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:onigenc_is_mbc_newline_0x0a'],
      },
      'GOT.mem': {
        OnigEncAsciiCtypeTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:OnigEncAsciiCtypeTable'],
        OnigEncAsciiToLowerCaseTable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:OnigEncAsciiToLowerCaseTable'],
        OnigEncodingASCII: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:OnigEncodingASCII'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:memory_base'],
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:table_base'],
        memory: exports4.memory,
        onig_is_in_code_range: exports8.onig_is_in_code_range,
        onigenc_apply_all_case_fold_with_map: exports8.onigenc_apply_all_case_fold_with_map,
        onigenc_ascii_get_case_fold_codes_by_str: exports8.onigenc_ascii_get_case_fold_codes_by_str,
        onigenc_minimum_property_name_to_ctype: exports8.onigenc_minimum_property_name_to_ctype,
        onigenc_with_ascii_strnicmp: exports8.onigenc_with_ascii_strnicmp,
        rb_enc_register: exports8.rb_enc_register,
      },
    }));
    ({ exports: exports85 } = yield instantiateCore(yield module80, {
      'GOT.mem': {
        rb_cIO: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/etc.so:rb_cIO'],
        rb_mEnumerable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/etc.so:rb_mEnumerable'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/etc.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/etc.so:table_base'],
        confstr: exports10.confstr,
        fpathconf: exports10.fpathconf,
        getenv: exports10.getenv,
        getlogin: exports8.getlogin,
        memory: exports4.memory,
        rb_alloc_tmp_buffer_with_count: exports8.rb_alloc_tmp_buffer_with_count,
        rb_bug: exports8.rb_bug,
        rb_define_const: exports8.rb_define_const,
        rb_define_method: exports8.rb_define_method,
        rb_define_module: exports8.rb_define_module,
        rb_define_module_function: exports8.rb_define_module_function,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_errno_ptr: exports8.rb_errno_ptr,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_extend_object: exports8.rb_extend_object,
        rb_external_str_new_with_enc: exports8.rb_external_str_new_with_enc,
        rb_filesystem_str_new: exports8.rb_filesystem_str_new,
        rb_filesystem_str_new_cstr: exports8.rb_filesystem_str_new_cstr,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_new: exports8.rb_hash_new,
        rb_id2sym: exports8.rb_id2sym,
        rb_int2big: exports8.rb_int2big,
        rb_intern2: exports8.rb_intern2,
        rb_io_descriptor: exports8.rb_io_descriptor,
        rb_locale_encoding: exports8.rb_locale_encoding,
        rb_num2long: exports8.rb_num2long,
        rb_str_new_cstr: exports8.rb_str_new_cstr,
        rb_str_new_static: exports8.rb_str_new_static,
        rb_struct_define_under: exports8.rb_struct_define_under,
        rb_sys_fail: exports8.rb_sys_fail,
        strlen: exports10.strlen,
        sysconf: exports10.sysconf,
        uname: exports10.uname,
      },
    }));
    ({ exports: exports86 } = yield instantiateCore(yield module81, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/fcntl.so:memory_base'],
        memory: exports4.memory,
        rb_define_const: exports8.rb_define_const,
        rb_define_module: exports8.rb_define_module,
        rb_str_new_static: exports8.rb_str_new_static,
      },
    }));
    ({ exports: exports87 } = yield instantiateCore(yield module82, {
      'GOT.mem': {
        rb_cArray: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cArray'],
        rb_cFalseClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cFalseClass'],
        rb_cFloat: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cFloat'],
        rb_cHash: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cHash'],
        rb_cInteger: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cInteger'],
        rb_cNilClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cNilClass'],
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cObject'],
        rb_cString: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cString'],
        rb_cSymbol: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cSymbol'],
        rb_cTrueClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cTrueClass'],
        rb_eArgError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_eArgError'],
        rb_eTypeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_eTypeError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:table_base'],
        memcpy: exports10.memcpy,
        memory: exports4.memory,
        memset: exports10.memset,
        rb_ascii8bit_encindex: exports8.rb_ascii8bit_encindex,
        rb_bug: exports8.rb_bug,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_class_new_instance: exports8.rb_class_new_instance,
        rb_const_get: exports8.rb_const_get,
        rb_convert_type: exports8.rb_convert_type,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_define_alias: exports8.rb_define_alias,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_method: exports8.rb_define_method,
        rb_define_module: exports8.rb_define_module,
        rb_define_module_under: exports8.rb_define_module_under,
        rb_define_private_method: exports8.rb_define_private_method,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_enc_associate_index: exports8.rb_enc_associate_index,
        rb_enc_get_index: exports8.rb_enc_get_index,
        rb_enc_str_coderange: exports8.rb_enc_str_coderange,
        rb_error_arity: exports8.rb_error_arity,
        rb_exc_new_str: exports8.rb_exc_new_str,
        rb_exc_raise: exports8.rb_exc_raise,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_float_value: exports8.rb_float_value,
        rb_funcall: exports8.rb_funcall,
        rb_gc_location: exports8.rb_gc_location,
        rb_gc_mark_movable: exports8.rb_gc_mark_movable,
        rb_gc_writebarrier: exports8.rb_gc_writebarrier,
        rb_global_variable: exports8.rb_global_variable,
        rb_hash_foreach: exports8.rb_hash_foreach,
        rb_hash_size_num: exports8.rb_hash_size_num,
        rb_id2sym: exports8.rb_id2sym,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_io_flush: exports8.rb_io_flush,
        rb_io_write: exports8.rb_io_write,
        rb_ivar_set: exports8.rb_ivar_set,
        rb_obj_class: exports8.rb_obj_class,
        rb_obj_is_kind_of: exports8.rb_obj_is_kind_of,
        rb_path2class: exports8.rb_path2class,
        rb_proc_arity: exports8.rb_proc_arity,
        rb_proc_call_with_block: exports8.rb_proc_call_with_block,
        rb_raise: exports8.rb_raise,
        rb_require: exports8.rb_require,
        rb_rescue: exports8.rb_rescue,
        rb_respond_to: exports8.rb_respond_to,
        rb_str_dup: exports8.rb_str_dup,
        rb_str_freeze: exports8.rb_str_freeze,
        rb_str_new_frozen: exports8.rb_str_new_frozen,
        rb_string_value_ptr: exports8.rb_string_value_ptr,
        rb_struct_aref: exports8.rb_struct_aref,
        rb_sym2str: exports8.rb_sym2str,
        rb_unexpected_type: exports8.rb_unexpected_type,
        rb_usascii_encindex: exports8.rb_usascii_encindex,
        rb_utf8_encindex: exports8.rb_utf8_encindex,
        rb_utf8_str_new: exports8.rb_utf8_str_new,
        rb_utf8_str_new_static: exports8.rb_utf8_str_new_static,
        rb_vsprintf: exports8.rb_vsprintf,
        rb_warn: exports8.rb_warn,
        ruby_xfree: exports8.ruby_xfree,
        ruby_xmalloc2: exports8.ruby_xmalloc2,
        ruby_xrealloc2: exports8.ruby_xrealloc2,
        strlen: exports10.strlen,
      },
    }));
    ({ exports: exports88 } = yield instantiateCore(yield module83, {
      'GOT.mem': {
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/parser.so:rb_cObject'],
        rb_mKernel: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/parser.so:rb_mKernel'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/parser.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/parser.so:table_base'],
        memchr: exports10.memchr,
        memcmp: exports8.memcmp,
        memcpy: exports10.memcpy,
        memmove: exports10.memmove,
        memory: exports4.memory,
        memset: exports10.memset,
        rb_alloc_tmp_buffer_with_count: exports8.rb_alloc_tmp_buffer_with_count,
        rb_ary_new_from_values: exports8.rb_ary_new_from_values,
        rb_ascii8bit_encindex: exports8.rb_ascii8bit_encindex,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_class_name: exports8.rb_class_name,
        rb_const_get: exports8.rb_const_get,
        rb_cstr2inum: exports8.rb_cstr2inum,
        rb_cstr_to_dbl: exports8.rb_cstr_to_dbl,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_method: exports8.rb_define_method,
        rb_define_module: exports8.rb_define_module,
        rb_define_module_under: exports8.rb_define_module_under,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_enc_associate_index: exports8.rb_enc_associate_index,
        rb_enc_get_index: exports8.rb_enc_get_index,
        rb_enc_interned_str: exports8.rb_enc_interned_str,
        rb_enc_sprintf: exports8.rb_enc_sprintf,
        rb_exc_new_str: exports8.rb_exc_new_str,
        rb_exc_raise: exports8.rb_exc_raise,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_float_new: exports8.rb_float_new,
        rb_free_tmp_buffer: exports8.rb_free_tmp_buffer,
        rb_funcall: exports8.rb_funcall,
        rb_funcallv: exports8.rb_funcallv,
        rb_gc_mark: exports8.rb_gc_mark,
        rb_gc_register_mark_object: exports8.rb_gc_register_mark_object,
        rb_gc_writebarrier: exports8.rb_gc_writebarrier,
        rb_global_variable: exports8.rb_global_variable,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_bulk_insert: exports8.rb_hash_bulk_insert,
        rb_hash_foreach: exports8.rb_hash_foreach,
        rb_hash_new_capa: exports8.rb_hash_new_capa,
        rb_hash_size_num: exports8.rb_hash_size_num,
        rb_id2sym: exports8.rb_id2sym,
        rb_inspect: exports8.rb_inspect,
        rb_int2big: exports8.rb_int2big,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_ivar_set: exports8.rb_ivar_set,
        rb_ll2inum: exports8.rb_ll2inum,
        rb_obj_freeze_inline: exports8.rb_obj_freeze_inline,
        rb_path2class: exports8.rb_path2class,
        rb_path_to_class: exports8.rb_path_to_class,
        rb_proc_call_with_block: exports8.rb_proc_call_with_block,
        rb_raise: exports8.rb_raise,
        rb_require: exports8.rb_require,
        rb_respond_to: exports8.rb_respond_to,
        rb_sprintf: exports8.rb_sprintf,
        rb_str_buf_new: exports8.rb_str_buf_new,
        rb_str_dup: exports8.rb_str_dup,
        rb_str_freeze: exports8.rb_str_freeze,
        rb_str_intern: exports8.rb_str_intern,
        rb_str_new: exports8.rb_str_new,
        rb_str_set_len: exports8.rb_str_set_len,
        rb_str_substr: exports8.rb_str_substr,
        rb_string_value: exports8.rb_string_value,
        rb_sym2id: exports8.rb_sym2id,
        rb_sym2str: exports8.rb_sym2str,
        rb_unexpected_type: exports8.rb_unexpected_type,
        rb_utf8_encindex: exports8.rb_utf8_encindex,
        rb_utf8_encoding: exports8.rb_utf8_encoding,
        rb_utf8_str_new: exports8.rb_utf8_str_new,
        ruby_malloc_size_overflow: exports8.ruby_malloc_size_overflow,
        ruby_xfree: exports8.ruby_xfree,
        ruby_xmalloc2: exports8.ruby_xmalloc2,
        ruby_xrealloc2: exports8.ruby_xrealloc2,
        strlen: exports10.strlen,
        strrchr: exports10.strrchr,
      },
    }));
    ({ exports: exports89 } = yield instantiateCore(yield module84, {
      'GOT.mem': {
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/monitor.so:rb_cObject'],
        rb_eThreadError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/monitor.so:rb_eThreadError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/monitor.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/monitor.so:table_base'],
        memory: exports4.memory,
        rb_bug: exports8.rb_bug,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class: exports8.rb_define_class,
        rb_define_method: exports8.rb_define_method,
        rb_ensure: exports8.rb_ensure,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_fiber_current: exports8.rb_fiber_current,
        rb_funcall: exports8.rb_funcall,
        rb_gc_mark: exports8.rb_gc_mark,
        rb_gc_writebarrier: exports8.rb_gc_writebarrier,
        rb_int2big: exports8.rb_int2big,
        rb_intern2: exports8.rb_intern2,
        rb_mutex_lock: exports8.rb_mutex_lock,
        rb_mutex_locked_p: exports8.rb_mutex_locked_p,
        rb_mutex_new: exports8.rb_mutex_new,
        rb_mutex_trylock: exports8.rb_mutex_trylock,
        rb_mutex_unlock: exports8.rb_mutex_unlock,
        rb_num2long: exports8.rb_num2long,
        rb_raise: exports8.rb_raise,
        rb_yield_values: exports8.rb_yield_values,
      },
    }));
    ({ exports: exports90 } = yield instantiateCore(yield module85, {
      'GOT.func': {
        rb_yield: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_yield'],
      },
      'GOT.mem': {
        rb_cFalseClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cFalseClass'],
        rb_cInteger: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cInteger'],
        rb_cNilClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cNilClass'],
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cObject'],
        rb_cSymbol: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cSymbol'],
        rb_cTrueClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cTrueClass'],
        rb_eArgError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eArgError'],
        rb_eIOError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eIOError'],
        rb_eRuntimeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eRuntimeError'],
        rb_eTypeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eTypeError'],
        rb_shape_tree: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_shape_tree'],
        ruby_hexdigits: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:ruby_hexdigits'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:table_base'],
        fflush: exports10.fflush,
        fprintf: exports10.fprintf,
        fwrite: exports10.fwrite,
        memcpy: exports10.memcpy,
        memmove: exports10.memmove,
        memory: exports4.memory,
        memset: exports10.memset,
        rb_ary_new: exports8.rb_ary_new,
        rb_ary_push: exports8.rb_ary_push,
        rb_ascii8bit_encindex: exports8.rb_ascii8bit_encindex,
        rb_bug: exports8.rb_bug,
        rb_bug_reporter_add: exports8.rb_bug_reporter_add,
        rb_class_get_superclass: exports8.rb_class_get_superclass,
        rb_class_path_cached: exports8.rb_class_path_cached,
        rb_class_real: exports8.rb_class_real,
        rb_class_singleton_p: exports8.rb_class_singleton_p,
        rb_class_super_of: exports8.rb_class_super_of,
        rb_class_variation_count: exports8.rb_class_variation_count,
        rb_const_get: exports8.rb_const_get,
        rb_data_typed_object_wrap: exports8.rb_data_typed_object_wrap,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_method: exports8.rb_define_method,
        rb_define_module_function: exports8.rb_define_module_function,
        rb_enc_dummy_p: exports8.rb_enc_dummy_p,
        rb_enc_from_index: exports8.rb_enc_from_index,
        rb_enc_get_index: exports8.rb_enc_get_index,
        rb_ensure: exports8.rb_ensure,
        rb_error_arity: exports8.rb_error_arity,
        rb_float_value: exports8.rb_float_value,
        rb_gc_count: exports8.rb_gc_count,
        rb_gc_disable_no_rest: exports8.rb_gc_disable_no_rest,
        rb_gc_enable: exports8.rb_gc_enable,
        rb_gc_location: exports8.rb_gc_location,
        rb_gc_mark: exports8.rb_gc_mark,
        rb_gc_obj_slot_size: exports8.rb_gc_obj_slot_size,
        rb_gc_object_metadata: exports8.rb_gc_object_metadata,
        rb_gc_pointer_to_heap_p: exports8.rb_gc_pointer_to_heap_p,
        rb_gc_register_mark_object: exports8.rb_gc_register_mark_object,
        rb_hash_aref: exports8.rb_hash_aref,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_foreach: exports8.rb_hash_foreach,
        rb_hash_lookup: exports8.rb_hash_lookup,
        rb_hash_new: exports8.rb_hash_new,
        rb_id2name: exports8.rb_id2name,
        rb_id2sym: exports8.rb_id2sym,
        rb_ident_hash_new: exports8.rb_ident_hash_new,
        rb_imemo_name: exports8.rb_imemo_name,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_io_check_closed: exports8.rb_io_check_closed,
        rb_io_flush: exports8.rb_io_flush,
        rb_io_get_io: exports8.rb_io_get_io,
        rb_io_get_write_io: exports8.rb_io_get_write_io,
        rb_io_stdio_file: exports8.rb_io_stdio_file,
        rb_io_taint_check: exports8.rb_io_taint_check,
        rb_mod_name: exports8.rb_mod_name,
        rb_num2long: exports8.rb_num2long,
        rb_num2ulong: exports8.rb_num2ulong,
        rb_obj_frozen_p: exports8.rb_obj_frozen_p,
        rb_obj_hide: exports8.rb_obj_hide,
        rb_obj_id: exports8.rb_obj_id,
        rb_obj_is_kind_of: exports8.rb_obj_is_kind_of,
        rb_obj_memsize_of: exports8.rb_obj_memsize_of,
        rb_obj_shape_id: exports8.rb_obj_shape_id,
        rb_objspace_data_type_name: exports8.rb_objspace_data_type_name,
        rb_objspace_each_objects: exports8.rb_objspace_each_objects,
        rb_objspace_garbage_object_p: exports8.rb_objspace_garbage_object_p,
        rb_objspace_internal_object_p: exports8.rb_objspace_internal_object_p,
        rb_objspace_reachable_objects_from: exports8.rb_objspace_reachable_objects_from,
        rb_objspace_reachable_objects_from_root: exports8.rb_objspace_reachable_objects_from_root,
        rb_raise: exports8.rb_raise,
        rb_shape_depth: exports8.rb_shape_depth,
        rb_shape_each_shape_id: exports8.rb_shape_each_shape_id,
        rb_shape_edges_count: exports8.rb_shape_edges_count,
        rb_shape_memsize: exports8.rb_shape_memsize,
        rb_sprintf: exports8.rb_sprintf,
        rb_st_add_direct: exports8.rb_st_add_direct,
        rb_st_clear: exports8.rb_st_clear,
        rb_st_delete: exports8.rb_st_delete,
        rb_st_foreach: exports8.rb_st_foreach,
        rb_st_free_table: exports8.rb_st_free_table,
        rb_st_get_key: exports8.rb_st_get_key,
        rb_st_init_numtable: exports8.rb_st_init_numtable,
        rb_st_init_strtable: exports8.rb_st_init_strtable,
        rb_st_insert: exports8.rb_st_insert,
        rb_st_lookup: exports8.rb_st_lookup,
        rb_st_memsize: exports8.rb_st_memsize,
        rb_st_table_size: exports8.rb_st_table_size,
        rb_st_update: exports8.rb_st_update,
        rb_str_capacity: exports8.rb_str_capacity,
        rb_str_cat: exports8.rb_str_cat,
        rb_str_new_cstr: exports8.rb_str_new_cstr,
        rb_sym2str: exports8.rb_sym2str,
        rb_sym_immortal_count: exports8.rb_sym_immortal_count,
        rb_tracearg_defined_class: exports8.rb_tracearg_defined_class,
        rb_tracearg_from_tracepoint: exports8.rb_tracearg_from_tracepoint,
        rb_tracearg_lineno: exports8.rb_tracearg_lineno,
        rb_tracearg_method_id: exports8.rb_tracearg_method_id,
        rb_tracearg_object: exports8.rb_tracearg_object,
        rb_tracearg_path: exports8.rb_tracearg_path,
        rb_tracepoint_disable: exports8.rb_tracepoint_disable,
        rb_tracepoint_enable: exports8.rb_tracepoint_enable,
        rb_tracepoint_new: exports8.rb_tracepoint_new,
        rb_typeddata_is_kind_of: exports8.rb_typeddata_is_kind_of,
        rb_uint2big: exports8.rb_uint2big,
        rb_undef_alloc_func: exports8.rb_undef_alloc_func,
        ruby_snprintf: exports8.ruby_snprintf,
        ruby_xfree: exports8.ruby_xfree,
        ruby_xmalloc: exports8.ruby_xmalloc,
        strlen: exports10.strlen,
        strncpy: exports10.strncpy,
      },
    }));
    ({ exports: exports91 } = yield instantiateCore(yield module86, {
      'GOT.func': {
        memset: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:memset'],
        ossl_pem_passwd_cb: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:ossl_pem_passwd_cb'],
        ossl_to_der: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:ossl_to_der'],
        ossl_x509_ary2sk0: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:ossl_x509_ary2sk0'],
        strcmp: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:strcmp'],
      },
      'GOT.mem': {
        _CLOCK_REALTIME: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:_CLOCK_REALTIME'],
        cASN1Data: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cASN1Data'],
        cBN: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cBN'],
        cDH: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cDH'],
        cDSA: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cDSA'],
        cEC: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cEC'],
        cPKey: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cPKey'],
        cRSA: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cRSA'],
        cX509Attr: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Attr'],
        cX509Cert: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Cert'],
        cX509Ext: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Ext'],
        cX509Rev: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Rev'],
        dOSSL: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:dOSSL'],
        eASN1Error: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:eASN1Error'],
        eOSSLError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:eOSSLError'],
        ePKeyError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:ePKeyError'],
        errno: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:errno'],
        mASN1: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mASN1'],
        mOSSL: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mOSSL'],
        mPKey: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mPKey'],
        mX509: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mX509'],
        ossl_evp_pkey_type: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:ossl_evp_pkey_type'],
        rb_cArray: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cArray'],
        rb_cFalseClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cFalseClass'],
        rb_cInteger: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cInteger'],
        rb_cNilClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cNilClass'],
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cObject'],
        rb_cSymbol: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cSymbol'],
        rb_cTime: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cTime'],
        rb_cTrueClass: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cTrueClass'],
        rb_eArgError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eArgError'],
        rb_eNotImpError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eNotImpError'],
        rb_eRangeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eRangeError'],
        rb_eRuntimeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eRuntimeError'],
        rb_eStandardError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eStandardError'],
        rb_eTypeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eTypeError'],
        rb_mComparable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_mComparable'],
        rb_mEnumerable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_mEnumerable'],
        stderr: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:stderr'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:table_base'],
        abort: exports10.abort,
        atexit: exports10.atexit,
        atoi: exports10.atoi,
        calloc: exports10.calloc,
        clearerr: exports10.clearerr,
        clock_gettime: exports10.clock_gettime,
        close: exports10.close,
        closedir: exports10.closedir,
        fclose: exports10.fclose,
        fdopen: exports10.fdopen,
        feof: exports10.feof,
        ferror: exports10.ferror,
        fflush: exports10.fflush,
        fgets: exports10.fgets,
        fileno: exports10.fileno,
        fopen: exports10.fopen,
        fprintf: exports10.fprintf,
        fread: exports10.fread,
        free: exports10.free,
        fseek: exports10.fseek,
        fstat: exports10.fstat,
        ftell: exports10.ftell,
        fwrite: exports10.fwrite,
        getentropy: exports10.__getentropy,
        getenv: exports10.getenv,
        getpid: exports7.getpid,
        gettimeofday: exports10.gettimeofday,
        gmtime: exports10.gmtime,
        malloc: exports10.malloc,
        memchr: exports10.memchr,
        memcmp: exports8.memcmp,
        memcpy: exports10.memcpy,
        memmove: exports10.memmove,
        memory: exports4.memory,
        memset: exports10.memset,
        munmap: exports11.munmap,
        open: exports10.open,
        opendir: exports10.opendir,
        qsort: exports10.qsort,
        rb_Integer: exports8.rb_Integer,
        rb_String: exports8.rb_String,
        rb_absint_size: exports8.rb_absint_size,
        rb_alloc_tmp_buffer: exports8.rb_alloc_tmp_buffer,
        rb_alloc_tmp_buffer_with_count: exports8.rb_alloc_tmp_buffer_with_count,
        rb_ary_entry: exports8.rb_ary_entry,
        rb_ary_new: exports8.rb_ary_new,
        rb_ary_new_capa: exports8.rb_ary_new_capa,
        rb_ary_new_from_args: exports8.rb_ary_new_from_args,
        rb_ary_push: exports8.rb_ary_push,
        rb_ary_store: exports8.rb_ary_store,
        rb_assoc_new: exports8.rb_assoc_new,
        rb_attr: exports8.rb_attr,
        rb_attr_get: exports8.rb_attr_get,
        rb_block_call: exports8.rb_block_call,
        rb_block_given_p: exports8.rb_block_given_p,
        rb_block_proc: exports8.rb_block_proc,
        rb_check_array_type: exports8.rb_check_array_type,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_class2name: exports8.rb_class2name,
        rb_class_superclass: exports8.rb_class_superclass,
        rb_const_get: exports8.rb_const_get,
        rb_convert_type: exports8.rb_convert_type,
        rb_cstr_to_inum: exports8.rb_cstr_to_inum,
        rb_data_typed_object_wrap: exports8.rb_data_typed_object_wrap,
        rb_define_alias: exports8.rb_define_alias,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_const: exports8.rb_define_const,
        rb_define_method: exports8.rb_define_method,
        rb_define_module: exports8.rb_define_module,
        rb_define_module_function: exports8.rb_define_module_function,
        rb_define_module_under: exports8.rb_define_module_under,
        rb_define_private_method: exports8.rb_define_private_method,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_enc_associate_index: exports8.rb_enc_associate_index,
        rb_enc_sprintf: exports8.rb_enc_sprintf,
        rb_ensure: exports8.rb_ensure,
        rb_enumeratorize_with_size: exports8.rb_enumeratorize_with_size,
        rb_error_arity: exports8.rb_error_arity,
        rb_error_frozen_object: exports8.rb_error_frozen_object,
        rb_exc_new_str: exports8.rb_exc_new_str,
        rb_exc_raise: exports8.rb_exc_raise,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_frame_this_func: exports8.rb_frame_this_func,
        rb_free_tmp_buffer: exports8.rb_free_tmp_buffer,
        rb_funcall: exports8.rb_funcall,
        rb_funcallv: exports8.rb_funcallv,
        rb_funcallv_public: exports8.rb_funcallv_public,
        rb_gc_mark: exports8.rb_gc_mark,
        rb_gc_writebarrier: exports8.rb_gc_writebarrier,
        rb_get_kwargs: exports8.rb_get_kwargs,
        rb_global_variable: exports8.rb_global_variable,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_dup: exports8.rb_hash_dup,
        rb_hash_lookup: exports8.rb_hash_lookup,
        rb_hash_new: exports8.rb_hash_new,
        rb_hash_set_ifnone: exports8.rb_hash_set_ifnone,
        rb_id2sym: exports8.rb_id2sym,
        rb_include_module: exports8.rb_include_module,
        rb_inspect: exports8.rb_inspect,
        rb_int2big: exports8.rb_int2big,
        rb_integer_pack: exports8.rb_integer_pack,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_iv_get: exports8.rb_iv_get,
        rb_iv_set: exports8.rb_iv_set,
        rb_ivar_set: exports8.rb_ivar_set,
        rb_jump_tag: exports8.rb_jump_tag,
        rb_keyword_given_p: exports8.rb_keyword_given_p,
        rb_memhash: exports8.rb_memhash,
        rb_num2dbl: exports8.rb_num2dbl,
        rb_num2ll: exports8.rb_num2ll,
        rb_num2long: exports8.rb_num2long,
        rb_num2ull: exports8.rb_num2ull,
        rb_num2ulong: exports8.rb_num2ulong,
        rb_obj_alloc: exports8.rb_obj_alloc,
        rb_obj_class: exports8.rb_obj_class,
        rb_obj_dup: exports8.rb_obj_dup,
        rb_obj_freeze: exports8.rb_obj_freeze,
        rb_obj_is_instance_of: exports8.rb_obj_is_instance_of,
        rb_obj_is_kind_of: exports8.rb_obj_is_kind_of,
        rb_path2class: exports8.rb_path2class,
        rb_protect: exports8.rb_protect,
        rb_ractor_local_storage_ptr: exports8.rb_ractor_local_storage_ptr,
        rb_ractor_local_storage_ptr_newkey: exports8.rb_ractor_local_storage_ptr_newkey,
        rb_ractor_local_storage_ptr_set: exports8.rb_ractor_local_storage_ptr_set,
        rb_raise: exports8.rb_raise,
        rb_respond_to: exports8.rb_respond_to,
        rb_set_errinfo: exports8.rb_set_errinfo,
        rb_singleton_class: exports8.rb_singleton_class,
        rb_sprintf: exports8.rb_sprintf,
        rb_str_append: exports8.rb_str_append,
        rb_str_capacity: exports8.rb_str_capacity,
        rb_str_cat: exports8.rb_str_cat,
        rb_str_cat_cstr: exports8.rb_str_cat_cstr,
        rb_str_catf: exports8.rb_str_catf,
        rb_str_drop_bytes: exports8.rb_str_drop_bytes,
        rb_str_equal: exports8.rb_str_equal,
        rb_str_modify: exports8.rb_str_modify,
        rb_str_modify_expand: exports8.rb_str_modify_expand,
        rb_str_new: exports8.rb_str_new,
        rb_str_new_cstr: exports8.rb_str_new_cstr,
        rb_str_new_frozen: exports8.rb_str_new_frozen,
        rb_str_new_static: exports8.rb_str_new_static,
        rb_str_resize: exports8.rb_str_resize,
        rb_str_set_len: exports8.rb_str_set_len,
        rb_string_value: exports8.rb_string_value,
        rb_string_value_cstr: exports8.rb_string_value_cstr,
        rb_string_value_ptr: exports8.rb_string_value_ptr,
        rb_sym2str: exports8.rb_sym2str,
        rb_thread_call_with_gvl: exports8.rb_thread_call_with_gvl,
        rb_thread_call_without_gvl: exports8.rb_thread_call_without_gvl,
        rb_thread_check_ints: exports8.rb_thread_check_ints,
        rb_uint2big: exports8.rb_uint2big,
        rb_undef_alloc_func: exports8.rb_undef_alloc_func,
        rb_undef_method: exports8.rb_undef_method,
        rb_unexpected_type: exports8.rb_unexpected_type,
        rb_usascii_str_new_static: exports8.rb_usascii_str_new_static,
        rb_utf8_encindex: exports8.rb_utf8_encindex,
        rb_utf8_encoding: exports8.rb_utf8_encoding,
        rb_vsprintf: exports8.rb_vsprintf,
        rb_warn: exports8.rb_warn,
        rb_warning: exports8.rb_warning,
        rb_yield: exports8.rb_yield,
        rb_yield_values2: exports8.rb_yield_values2,
        read: exports10.read,
        readdir: exports10.readdir,
        realloc: exports10.realloc,
        ruby_malloc_size_overflow: exports8.ruby_malloc_size_overflow,
        ruby_snprintf: exports8.ruby_snprintf,
        setbuf: exports10.setbuf,
        sscanf: exports10.sscanf,
        stat: exports10.stat,
        strchr: exports10.strchr,
        strcmp: exports10.strcmp,
        strcpy: exports10.strcpy,
        strcspn: exports10.strcspn,
        strerror_r: exports10.strerror_r,
        strlen: exports10.strlen,
        strncmp: exports10.strncmp,
        strncpy: exports10.strncpy,
        strrchr: exports10.strrchr,
        strspn: exports10.strspn,
        strstr: exports10.strstr,
        strtol: exports10.strtol,
        strtoul: exports10.strtoul,
        time: exports10.time,
        tolower: exports10.tolower,
        vfprintf: exports10.vfprintf,
      },
    }));
    ({ exports: exports92 } = yield instantiateCore(yield module87, {
      'GOT.mem': {
        cPsychEmitter: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychEmitter'],
        cPsychParser: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychParser'],
        cPsychVisitorsToRuby: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychVisitorsToRuby'],
        cPsychVisitorsYamlTree: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychVisitorsYamlTree'],
        mPsych: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:mPsych'],
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:rb_cObject'],
        rb_eNoMemError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:rb_eNoMemError'],
        rb_eRuntimeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:rb_eRuntimeError'],
      },
      env: {
        __assert_fail: exports10.__assert_fail,
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:table_base'],
        free: exports10.free,
        malloc: exports10.malloc,
        memcmp: exports8.memcmp,
        memcpy: exports10.memcpy,
        memmove: exports10.memmove,
        memory: exports4.memory,
        memset: exports10.memset,
        rb_ary_entry: exports8.rb_ary_entry,
        rb_ary_new: exports8.rb_ary_new,
        rb_ary_new_capa: exports8.rb_ary_new_capa,
        rb_ary_new_from_args: exports8.rb_ary_new_from_args,
        rb_ary_new_from_values: exports8.rb_ary_new_from_values,
        rb_ary_push: exports8.rb_ary_push,
        rb_ascii8bit_encindex: exports8.rb_ascii8bit_encindex,
        rb_attr_get: exports8.rb_attr_get,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_class_new_instance: exports8.rb_class_new_instance,
        rb_const_get: exports8.rb_const_get,
        rb_const_get_at: exports8.rb_const_get_at,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_default_internal_encoding: exports8.rb_default_internal_encoding,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_const: exports8.rb_define_const,
        rb_define_method: exports8.rb_define_method,
        rb_define_module: exports8.rb_define_module,
        rb_define_module_under: exports8.rb_define_module_under,
        rb_define_private_method: exports8.rb_define_private_method,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_enc_associate_index: exports8.rb_enc_associate_index,
        rb_enc_find_index: exports8.rb_enc_find_index,
        rb_enc_get_index: exports8.rb_enc_get_index,
        rb_enc_str_new: exports8.rb_enc_str_new,
        rb_ensure: exports8.rb_ensure,
        rb_error_arity: exports8.rb_error_arity,
        rb_exc_raise: exports8.rb_exc_raise,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_funcall: exports8.rb_funcall,
        rb_funcallv_public: exports8.rb_funcallv_public,
        rb_int2big: exports8.rb_int2big,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_iv_set: exports8.rb_iv_set,
        rb_ivar_set: exports8.rb_ivar_set,
        rb_jump_tag: exports8.rb_jump_tag,
        rb_num2long: exports8.rb_num2long,
        rb_obj_alloc: exports8.rb_obj_alloc,
        rb_path_to_class: exports8.rb_path_to_class,
        rb_protect: exports8.rb_protect,
        rb_raise: exports8.rb_raise,
        rb_require: exports8.rb_require,
        rb_respond_to: exports8.rb_respond_to,
        rb_str_export_to_enc: exports8.rb_str_export_to_enc,
        rb_str_new: exports8.rb_str_new,
        rb_str_new_cstr: exports8.rb_str_new_cstr,
        rb_string_value: exports8.rb_string_value,
        rb_string_value_cstr: exports8.rb_string_value_cstr,
        rb_string_value_ptr: exports8.rb_string_value_ptr,
        rb_struct_initialize: exports8.rb_struct_initialize,
        rb_to_encoding_index: exports8.rb_to_encoding_index,
        rb_uint2big: exports8.rb_uint2big,
        rb_unexpected_type: exports8.rb_unexpected_type,
        rb_usascii_encindex: exports8.rb_usascii_encindex,
        rb_usascii_str_new_cstr: exports8.rb_usascii_str_new_cstr,
        rb_utf8_encindex: exports8.rb_utf8_encindex,
        rb_utf8_encoding: exports8.rb_utf8_encoding,
        realloc: exports10.realloc,
        ruby_xcalloc: exports8.ruby_xcalloc,
        ruby_xfree: exports8.ruby_xfree,
        strcmp: exports10.strcmp,
        strdup: exports10.strdup,
        strlen: exports10.strlen,
        strncmp: exports10.strncmp,
      },
    }));
    ({ exports: exports93 } = yield instantiateCore(yield module88, {
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/rbconfig/sizeof.so:memory_base'],
        memory: exports4.memory,
        rb_define_const: exports8.rb_define_const,
        rb_define_module: exports8.rb_define_module,
        rb_float_new: exports8.rb_float_new,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_new: exports8.rb_hash_new,
        rb_int2big: exports8.rb_int2big,
        rb_ll2inum: exports8.rb_ll2inum,
        rb_obj_freeze_inline: exports8.rb_obj_freeze_inline,
        rb_ull2inum: exports8.rb_ull2inum,
        rb_usascii_str_new_static: exports8.rb_usascii_str_new_static,
      },
    }));
    ({ exports: exports94 } = yield instantiateCore(yield module89, {
      'GOT.mem': {
        id_assoc: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_assoc'],
        id_gets: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_gets'],
        id_warn: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_warn'],
        id_warning: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_warning'],
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_cObject'],
        rb_eArgError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_eArgError'],
        rb_eRuntimeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_eRuntimeError'],
        rb_eTypeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_eTypeError'],
        ripper_parser_ids: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:ripper_parser_ids'],
        ruby_global_name_punct_bits: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:ruby_global_name_punct_bits'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:table_base'],
        free: exports10.free,
        malloc: exports10.malloc,
        memcmp: exports8.memcmp,
        memcpy: exports10.memcpy,
        memmove: exports10.memmove,
        memory: exports4.memory,
        onig_foreach_name: exports8.onig_foreach_name,
        rb_ary_concat: exports8.rb_ary_concat,
        rb_ary_entry: exports8.rb_ary_entry,
        rb_ary_new: exports8.rb_ary_new,
        rb_ary_new_from_args: exports8.rb_ary_new_from_args,
        rb_ary_pop: exports8.rb_ary_pop,
        rb_ary_push: exports8.rb_ary_push,
        rb_ary_unshift: exports8.rb_ary_unshift,
        rb_ascii8bit_encoding: exports8.rb_ascii8bit_encoding,
        rb_ast_delete_node: exports8.rb_ast_delete_node,
        rb_ast_free: exports8.rb_ast_free,
        rb_ast_new: exports8.rb_ast_new,
        rb_ast_new_local_table: exports8.rb_ast_new_local_table,
        rb_ast_newnode: exports8.rb_ast_newnode,
        rb_ast_resize_latest_local_table: exports8.rb_ast_resize_latest_local_table,
        rb_attr_get: exports8.rb_attr_get,
        rb_bug: exports8.rb_bug,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class: exports8.rb_define_class,
        rb_define_const: exports8.rb_define_const,
        rb_define_method: exports8.rb_define_method,
        rb_define_private_method: exports8.rb_define_private_method,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_enc_codelen: exports8.rb_enc_codelen,
        rb_enc_dummy_p: exports8.rb_enc_dummy_p,
        rb_enc_find_index: exports8.rb_enc_find_index,
        rb_enc_from_encoding: exports8.rb_enc_from_encoding,
        rb_enc_from_index: exports8.rb_enc_from_index,
        rb_enc_get: exports8.rb_enc_get,
        rb_enc_precise_mbclen: exports8.rb_enc_precise_mbclen,
        rb_enc_str_new: exports8.rb_enc_str_new,
        rb_enc_str_new_static: exports8.rb_enc_str_new_static,
        rb_enc_symname_type: exports8.rb_enc_symname_type,
        rb_ensure: exports8.rb_ensure,
        rb_errinfo: exports8.rb_errinfo,
        rb_errno_ptr: exports8.rb_errno_ptr,
        rb_error_arity: exports8.rb_error_arity,
        rb_exc_raise: exports8.rb_exc_raise,
        rb_funcall: exports8.rb_funcall,
        rb_funcallv_public: exports8.rb_funcallv_public,
        rb_gc_mark: exports8.rb_gc_mark,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_new: exports8.rb_hash_new,
        rb_id2name: exports8.rb_id2name,
        rb_id2str: exports8.rb_id2str,
        rb_id2sym: exports8.rb_id2sym,
        rb_id_attrset: exports8.rb_id_attrset,
        rb_int2big: exports8.rb_int2big,
        rb_intern2: exports8.rb_intern2,
        rb_intern3: exports8.rb_intern3,
        rb_intern_str: exports8.rb_intern_str,
        rb_io_gets: exports8.rb_io_gets,
        rb_make_backtrace: exports8.rb_make_backtrace,
        rb_make_exception: exports8.rb_make_exception,
        rb_memcicmp: exports8.rb_memcicmp,
        rb_node_encoding_val: exports8.rb_node_encoding_val,
        rb_node_file_path_val: exports8.rb_node_file_path_val,
        rb_node_float_literal_val: exports8.rb_node_float_literal_val,
        rb_node_imaginary_literal_val: exports8.rb_node_imaginary_literal_val,
        rb_node_init: exports8.rb_node_init,
        rb_node_integer_literal_val: exports8.rb_node_integer_literal_val,
        rb_node_line_lineno_val: exports8.rb_node_line_lineno_val,
        rb_node_rational_literal_val: exports8.rb_node_rational_literal_val,
        rb_node_regx_string_val: exports8.rb_node_regx_string_val,
        rb_node_set_type: exports8.rb_node_set_type,
        rb_node_str_string_val: exports8.rb_node_str_string_val,
        rb_node_sym_string_val: exports8.rb_node_sym_string_val,
        rb_num2long: exports8.rb_num2long,
        rb_num2ulong: exports8.rb_num2ulong,
        rb_obj_class: exports8.rb_obj_class,
        rb_obj_freeze_inline: exports8.rb_obj_freeze_inline,
        rb_parser_dvar_defined_ref: exports8.rb_parser_dvar_defined_ref,
        rb_parser_fatal: exports8.rb_parser_fatal,
        rb_parser_internal_id: exports8.rb_parser_internal_id,
        rb_parser_lex_get_str: exports8.rb_parser_lex_get_str,
        rb_parser_lex_state_name: exports8.rb_parser_lex_state_name,
        rb_parser_local_defined: exports8.rb_parser_local_defined,
        rb_parser_printf: exports8.rb_parser_printf,
        rb_parser_reg_compile: exports8.rb_parser_reg_compile,
        rb_parser_set_location: exports8.rb_parser_set_location,
        rb_parser_set_location_from_strterm_heredoc: exports8.rb_parser_set_location_from_strterm_heredoc,
        rb_parser_set_location_of_none: exports8.rb_parser_set_location_of_none,
        rb_parser_show_bitstack: exports8.rb_parser_show_bitstack,
        rb_parser_st_locale_insensitive_strcasecmp: exports8.rb_parser_st_locale_insensitive_strcasecmp,
        rb_parser_st_locale_insensitive_strncasecmp: exports8.rb_parser_st_locale_insensitive_strncasecmp,
        rb_parser_string_free: exports8.rb_parser_string_free,
        rb_parser_trace_lex_state: exports8.rb_parser_trace_lex_state,
        rb_ractor_stdout: exports8.rb_ractor_stdout,
        rb_raise: exports8.rb_raise,
        rb_reg_fragment_setenc: exports8.rb_reg_fragment_setenc,
        rb_reg_named_capture_assign_iter_impl: exports8.rb_reg_named_capture_assign_iter_impl,
        rb_reserved_word: exports8.rb_reserved_word,
        rb_respond_to: exports8.rb_respond_to,
        rb_ruby_parser_encoding: exports8.rb_ruby_parser_encoding,
        rb_ruby_parser_end_seen_p: exports8.rb_ruby_parser_end_seen_p,
        rb_ruby_parser_set_yydebug: exports8.rb_ruby_parser_set_yydebug,
        rb_ruby_verbose_ptr: exports8.rb_ruby_verbose_ptr,
        rb_set_errinfo: exports8.rb_set_errinfo,
        rb_sprintf: exports8.rb_sprintf,
        rb_st_delete: exports8.rb_st_delete,
        rb_st_free_table: exports8.rb_st_free_table,
        rb_st_init_numtable: exports8.rb_st_init_numtable,
        rb_st_init_table: exports8.rb_st_init_table,
        rb_st_init_table_with_size: exports8.rb_st_init_table_with_size,
        rb_st_insert: exports8.rb_st_insert,
        rb_st_lookup: exports8.rb_st_lookup,
        rb_str_coderange_scan_restartable: exports8.rb_str_coderange_scan_restartable,
        rb_str_new: exports8.rb_str_new,
        rb_str_new_frozen: exports8.rb_str_new_frozen,
        rb_str_new_mutable_parser_string: exports8.rb_str_new_mutable_parser_string,
        rb_str_new_parser_string: exports8.rb_str_new_parser_string,
        rb_str_new_static: exports8.rb_str_new_static,
        rb_str_replace: exports8.rb_str_replace,
        rb_str_resize: exports8.rb_str_resize,
        rb_str_subseq: exports8.rb_str_subseq,
        rb_str_to_parser_string: exports8.rb_str_to_parser_string,
        rb_string_value: exports8.rb_string_value,
        rb_string_value_cstr: exports8.rb_string_value_cstr,
        rb_sym2id: exports8.rb_sym2id,
        rb_thread_current: exports8.rb_thread_current,
        rb_usascii_encoding: exports8.rb_usascii_encoding,
        rb_usascii_str_new: exports8.rb_usascii_str_new,
        rb_usascii_str_new_static: exports8.rb_usascii_str_new_static,
        rb_utf8_encoding: exports8.rb_utf8_encoding,
        rb_vsprintf: exports8.rb_vsprintf,
        rb_yytnamerr: exports8.rb_yytnamerr,
        ruby_malloc_size_overflow: exports8.ruby_malloc_size_overflow,
        ruby_node_name: exports8.ruby_node_name,
        ruby_scan_digits: exports8.ruby_scan_digits,
        ruby_scan_hex: exports8.ruby_scan_hex,
        ruby_scan_oct: exports8.ruby_scan_oct,
        ruby_show_error_line: exports8.ruby_show_error_line,
        ruby_strdup: exports8.ruby_strdup,
        ruby_strtod: exports8.ruby_strtod,
        ruby_xcalloc: exports8.ruby_xcalloc,
        ruby_xfree: exports8.ruby_xfree,
        ruby_xmalloc: exports8.ruby_xmalloc,
        ruby_xmalloc2: exports8.ruby_xmalloc2,
        ruby_xrealloc: exports8.ruby_xrealloc,
        ruby_xrealloc2: exports8.ruby_xrealloc2,
        strcmp: exports10.strcmp,
        strlen: exports10.strlen,
        strncmp: exports10.strncmp,
      },
    }));
    ({ exports: exports95 } = yield instantiateCore(yield module90, {
      'GOT.func': {
        rb_io_addstr: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_io_addstr'],
        rb_io_print: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_io_print'],
        rb_io_printf: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_io_printf'],
        rb_io_puts: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_io_puts'],
        rb_io_write: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_io_write'],
        rb_yield: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_yield'],
      },
      'GOT.mem': {
        rb_cIO: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_cIO'],
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_cObject'],
        rb_eArgError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_eArgError'],
        rb_eIOError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_eIOError'],
        rb_mEnumerable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_mEnumerable'],
        rb_rs: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_rs'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:table_base'],
        memchr: exports10.memchr,
        memcmp: exports8.memcmp,
        memcpy: exports10.memcpy,
        memmove: exports10.memmove,
        memory: exports4.memory,
        memset: exports10.memset,
        onigenc_get_right_adjust_char_head: exports8.onigenc_get_right_adjust_char_head,
        rb_ary_new: exports8.rb_ary_new,
        rb_ary_push: exports8.rb_ary_push,
        rb_ascii8bit_encoding: exports8.rb_ascii8bit_encoding,
        rb_block_given_p: exports8.rb_block_given_p,
        rb_call_super: exports8.rb_call_super,
        rb_check_string_type: exports8.rb_check_string_type,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_class_new_instance_kw: exports8.rb_class_new_instance_kw,
        rb_convert_type: exports8.rb_convert_type,
        rb_data_typed_object_wrap: exports8.rb_data_typed_object_wrap,
        rb_default_external_encoding: exports8.rb_default_external_encoding,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class: exports8.rb_define_class,
        rb_define_const: exports8.rb_define_const,
        rb_define_method: exports8.rb_define_method,
        rb_define_module_under: exports8.rb_define_module_under,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_enc_associate: exports8.rb_enc_associate,
        rb_enc_associate_index: exports8.rb_enc_associate_index,
        rb_enc_check: exports8.rb_enc_check,
        rb_enc_codelen: exports8.rb_enc_codelen,
        rb_enc_codepoint_len: exports8.rb_enc_codepoint_len,
        rb_enc_copy: exports8.rb_enc_copy,
        rb_enc_dummy_p: exports8.rb_enc_dummy_p,
        rb_enc_find_index: exports8.rb_enc_find_index,
        rb_enc_from_encoding: exports8.rb_enc_from_encoding,
        rb_enc_from_index: exports8.rb_enc_from_index,
        rb_enc_get: exports8.rb_enc_get,
        rb_enc_mbclen: exports8.rb_enc_mbclen,
        rb_enc_str_buf_cat: exports8.rb_enc_str_buf_cat,
        rb_enc_str_coderange: exports8.rb_enc_str_coderange,
        rb_enc_str_new_static: exports8.rb_enc_str_new_static,
        rb_enc_uint_chr: exports8.rb_enc_uint_chr,
        rb_ensure: exports8.rb_ensure,
        rb_enumeratorize_with_size: exports8.rb_enumeratorize_with_size,
        rb_eof_error: exports8.rb_eof_error,
        rb_error_arity: exports8.rb_error_arity,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_find_encoding: exports8.rb_find_encoding,
        rb_frame_this_func: exports8.rb_frame_this_func,
        rb_funcall: exports8.rb_funcall,
        rb_funcallv: exports8.rb_funcallv,
        rb_funcallv_kw: exports8.rb_funcallv_kw,
        rb_gc_mark: exports8.rb_gc_mark,
        rb_gc_writebarrier: exports8.rb_gc_writebarrier,
        rb_get_kwargs: exports8.rb_get_kwargs,
        rb_hash_dup: exports8.rb_hash_dup,
        rb_hash_lookup2: exports8.rb_hash_lookup2,
        rb_id2sym: exports8.rb_id2sym,
        rb_include_module: exports8.rb_include_module,
        rb_int2big: exports8.rb_int2big,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_io_extract_modeenc: exports8.rb_io_extract_modeenc,
        rb_io_taint_check: exports8.rb_io_taint_check,
        rb_io_write: exports8.rb_io_write,
        rb_keyword_given_p: exports8.rb_keyword_given_p,
        rb_lastline_set: exports8.rb_lastline_set,
        rb_notimplement: exports8.rb_notimplement,
        rb_num2long: exports8.rb_num2long,
        rb_obj_as_string: exports8.rb_obj_as_string,
        rb_raise: exports8.rb_raise,
        rb_sprintf: exports8.rb_sprintf,
        rb_str_append: exports8.rb_str_append,
        rb_str_buf_append: exports8.rb_str_buf_append,
        rb_str_buf_cat_ascii: exports8.rb_str_buf_cat_ascii,
        rb_str_conv_enc: exports8.rb_str_conv_enc,
        rb_str_modify: exports8.rb_str_modify,
        rb_str_modify_expand: exports8.rb_str_modify_expand,
        rb_str_new: exports8.rb_str_new,
        rb_str_new_static: exports8.rb_str_new_static,
        rb_str_resize: exports8.rb_str_resize,
        rb_str_set_len: exports8.rb_str_set_len,
        rb_str_subseq: exports8.rb_str_subseq,
        rb_str_substr: exports8.rb_str_substr,
        rb_string_value: exports8.rb_string_value,
        rb_syserr_fail: exports8.rb_syserr_fail,
        rb_syserr_fail_str: exports8.rb_syserr_fail_str,
        rb_uint2big: exports8.rb_uint2big,
        rb_usascii_encoding: exports8.rb_usascii_encoding,
        rb_utf8_encindex: exports8.rb_utf8_encindex,
        rb_warn: exports8.rb_warn,
        rb_yield: exports8.rb_yield,
        ruby_xfree: exports8.ruby_xfree,
        ruby_xmalloc: exports8.ruby_xmalloc,
      },
    }));
    ({ exports: exports96 } = yield instantiateCore(yield module91, {
      'GOT.mem': {
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_cObject'],
        rb_eArgError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eArgError'],
        rb_eIndexError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eIndexError'],
        rb_eRangeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eRangeError'],
        rb_eStandardError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eStandardError'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:table_base'],
        memcmp: exports8.memcmp,
        memcpy: exports10.memcpy,
        memory: exports4.memory,
        onig_foreach_name: exports8.onig_foreach_name,
        onig_match: exports8.onig_match,
        onig_name_to_backref_number: exports8.onig_name_to_backref_number,
        onig_region_clear: exports8.onig_region_clear,
        onig_region_free: exports8.onig_region_free,
        onig_region_init: exports8.onig_region_init,
        onig_region_set: exports8.onig_region_set,
        onig_search: exports8.onig_search,
        rb_alias: exports8.rb_alias,
        rb_alloc_tmp_buffer_with_count: exports8.rb_alloc_tmp_buffer_with_count,
        rb_ary_new_capa: exports8.rb_ary_new_capa,
        rb_ary_push: exports8.rb_ary_push,
        rb_ascii8bit_encindex: exports8.rb_ascii8bit_encindex,
        rb_check_hash_type: exports8.rb_check_hash_type,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_const_defined: exports8.rb_const_defined,
        rb_const_set: exports8.rb_const_set,
        rb_cstr2inum: exports8.rb_cstr2inum,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class: exports8.rb_define_class,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_method: exports8.rb_define_method,
        rb_define_private_method: exports8.rb_define_private_method,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_enc_check: exports8.rb_enc_check,
        rb_enc_copy: exports8.rb_enc_copy,
        rb_enc_get: exports8.rb_enc_get,
        rb_enc_get_index: exports8.rb_enc_get_index,
        rb_enc_mbclen: exports8.rb_enc_mbclen,
        rb_enc_raise: exports8.rb_enc_raise,
        rb_enc_strlen: exports8.rb_enc_strlen,
        rb_error_arity: exports8.rb_error_arity,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_free_tmp_buffer: exports8.rb_free_tmp_buffer,
        rb_gc_mark: exports8.rb_gc_mark,
        rb_gc_writebarrier: exports8.rb_gc_writebarrier,
        rb_get_kwargs: exports8.rb_get_kwargs,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_new: exports8.rb_hash_new,
        rb_int2big: exports8.rb_int2big,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_memerror: exports8.rb_memerror,
        rb_memsearch: exports8.rb_memsearch,
        rb_must_asciicompat: exports8.rb_must_asciicompat,
        rb_num2long: exports8.rb_num2long,
        rb_obj_class: exports8.rb_obj_class,
        rb_obj_freeze: exports8.rb_obj_freeze,
        rb_raise: exports8.rb_raise,
        rb_reg_onig_match: exports8.rb_reg_onig_match,
        rb_reg_region_copy: exports8.rb_reg_region_copy,
        rb_require: exports8.rb_require,
        rb_sprintf: exports8.rb_sprintf,
        rb_str_append: exports8.rb_str_append,
        rb_str_cat: exports8.rb_str_cat,
        rb_str_dump: exports8.rb_str_dump,
        rb_str_new: exports8.rb_str_new,
        rb_str_new_static: exports8.rb_str_new_static,
        rb_string_value: exports8.rb_string_value,
        rb_sym2str: exports8.rb_sym2str,
        rb_usascii_encindex: exports8.rb_usascii_encindex,
        rb_utf8_encindex: exports8.rb_utf8_encindex,
        rb_warning: exports8.rb_warning,
        ruby_xfree: exports8.ruby_xfree,
      },
    }));
    ({ exports: exports97 } = yield instantiateCore(yield module92, {
      'GOT.func': {
        rb_io_addstr: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_io_addstr'],
        rb_io_print: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_io_print'],
        rb_io_printf: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_io_printf'],
        rb_io_puts: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_io_puts'],
        rb_yield: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_yield'],
      },
      'GOT.mem': {
        rb_cIO: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_cIO'],
        rb_cObject: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_cObject'],
        rb_cString: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_cString'],
        rb_eArgError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eArgError'],
        rb_eEOFError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eEOFError'],
        rb_eIOError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eIOError'],
        rb_eNoMethodError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eNoMethodError'],
        rb_eRuntimeError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eRuntimeError'],
        rb_eStandardError: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eStandardError'],
        rb_mEnumerable: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_mEnumerable'],
        rb_rs: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_rs'],
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:table_base'],
        free: exports10.free,
        malloc: exports10.malloc,
        memchr: exports10.memchr,
        memcmp: exports8.memcmp,
        memcpy: exports10.memcpy,
        memmove: exports10.memmove,
        memory: exports4.memory,
        memset: exports10.memset,
        onigenc_get_left_adjust_char_head: exports8.onigenc_get_left_adjust_char_head,
        rb_Integer: exports8.rb_Integer,
        rb_ary_new: exports8.rb_ary_new,
        rb_ary_new_capa: exports8.rb_ary_new_capa,
        rb_ary_push: exports8.rb_ary_push,
        rb_ascii8bit_encoding: exports8.rb_ascii8bit_encoding,
        rb_attr_get: exports8.rb_attr_get,
        rb_block_given_p: exports8.rb_block_given_p,
        rb_call_super: exports8.rb_call_super,
        rb_check_convert_type: exports8.rb_check_convert_type,
        rb_check_hash_type: exports8.rb_check_hash_type,
        rb_check_string_type: exports8.rb_check_string_type,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_class_new_instance_kw: exports8.rb_class_new_instance_kw,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_default_external_encoding: exports8.rb_default_external_encoding,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_attr: exports8.rb_define_attr,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_const: exports8.rb_define_const,
        rb_define_method: exports8.rb_define_method,
        rb_define_module: exports8.rb_define_module,
        rb_define_module_function: exports8.rb_define_module_function,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_econv_check_error: exports8.rb_econv_check_error,
        rb_econv_close: exports8.rb_econv_close,
        rb_econv_convert: exports8.rb_econv_convert,
        rb_econv_open_opts: exports8.rb_econv_open_opts,
        rb_econv_prepare_opts: exports8.rb_econv_prepare_opts,
        rb_econv_str_convert: exports8.rb_econv_str_convert,
        rb_enc_associate: exports8.rb_enc_associate,
        rb_enc_dummy_p: exports8.rb_enc_dummy_p,
        rb_enc_from_encoding: exports8.rb_enc_from_encoding,
        rb_enc_get: exports8.rb_enc_get,
        rb_enc_mbclen: exports8.rb_enc_mbclen,
        rb_enc_precise_mbclen: exports8.rb_enc_precise_mbclen,
        rb_enc_str_new_static: exports8.rb_enc_str_new_static,
        rb_ensure: exports8.rb_ensure,
        rb_enumeratorize_with_size: exports8.rb_enumeratorize_with_size,
        rb_errinfo: exports8.rb_errinfo,
        rb_error_arity: exports8.rb_error_arity,
        rb_exc_new_cstr: exports8.rb_exc_new_cstr,
        rb_exc_new_str: exports8.rb_exc_new_str,
        rb_exc_raise: exports8.rb_exc_raise,
        rb_ext_ractor_safe: exports8.rb_ext_ractor_safe,
        rb_file_open_str: exports8.rb_file_open_str,
        rb_frame_this_func: exports8.rb_frame_this_func,
        rb_funcall: exports8.rb_funcall,
        rb_funcallv: exports8.rb_funcallv,
        rb_gc_mark: exports8.rb_gc_mark,
        rb_get_kwargs: exports8.rb_get_kwargs,
        rb_hash_aref: exports8.rb_hash_aref,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_dup: exports8.rb_hash_dup,
        rb_hash_new: exports8.rb_hash_new,
        rb_id2sym: exports8.rb_id2sym,
        rb_include_module: exports8.rb_include_module,
        rb_int2big: exports8.rb_int2big,
        rb_int2inum: exports8.rb_int2inum,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_io_close: exports8.rb_io_close,
        rb_io_extract_encoding_option: exports8.rb_io_extract_encoding_option,
        rb_ivar_get: exports8.rb_ivar_get,
        rb_ivar_set: exports8.rb_ivar_set,
        rb_jump_tag: exports8.rb_jump_tag,
        rb_keyword_given_p: exports8.rb_keyword_given_p,
        rb_lastline_set: exports8.rb_lastline_set,
        rb_mutex_new: exports8.rb_mutex_new,
        rb_mutex_synchronize: exports8.rb_mutex_synchronize,
        rb_nogvl: exports8.rb_nogvl,
        rb_num2long: exports8.rb_num2long,
        rb_num2ulong: exports8.rb_num2ulong,
        rb_obj_as_string: exports8.rb_obj_as_string,
        rb_obj_hide: exports8.rb_obj_hide,
        rb_obj_is_kind_of: exports8.rb_obj_is_kind_of,
        rb_obj_reveal: exports8.rb_obj_reveal,
        rb_protect: exports8.rb_protect,
        rb_raise: exports8.rb_raise,
        rb_rescue: exports8.rb_rescue,
        rb_rescue2: exports8.rb_rescue2,
        rb_respond_to: exports8.rb_respond_to,
        rb_sprintf: exports8.rb_sprintf,
        rb_str_append: exports8.rb_str_append,
        rb_str_buf_new: exports8.rb_str_buf_new,
        rb_str_capacity: exports8.rb_str_capacity,
        rb_str_cat: exports8.rb_str_cat,
        rb_str_conv_enc: exports8.rb_str_conv_enc,
        rb_str_conv_enc_opts: exports8.rb_str_conv_enc_opts,
        rb_str_dup: exports8.rb_str_dup,
        rb_str_inspect: exports8.rb_str_inspect,
        rb_str_locktmp: exports8.rb_str_locktmp,
        rb_str_modify: exports8.rb_str_modify,
        rb_str_modify_expand: exports8.rb_str_modify_expand,
        rb_str_new: exports8.rb_str_new,
        rb_str_new_cstr: exports8.rb_str_new_cstr,
        rb_str_new_static: exports8.rb_str_new_static,
        rb_str_resize: exports8.rb_str_resize,
        rb_str_resurrect: exports8.rb_str_resurrect,
        rb_str_set_len: exports8.rb_str_set_len,
        rb_str_subseq: exports8.rb_str_subseq,
        rb_str_to_str: exports8.rb_str_to_str,
        rb_str_unlocktmp: exports8.rb_str_unlocktmp,
        rb_string_value: exports8.rb_string_value,
        rb_sys_fail: exports8.rb_sys_fail,
        rb_time_new: exports8.rb_time_new,
        rb_uint2big: exports8.rb_uint2big,
        rb_uint2inum: exports8.rb_uint2inum,
        rb_undef_alloc_func: exports8.rb_undef_alloc_func,
        rb_unexpected_type: exports8.rb_unexpected_type,
        rb_warning: exports8.rb_warning,
        rb_yield: exports8.rb_yield,
        ruby_xfree: exports8.ruby_xfree,
        ruby_xmalloc2: exports8.ruby_xmalloc2,
        time: exports10.time,
      },
    }));
    ({ exports: exports98 } = yield instantiateCore(yield module93, {
      'GOT.func': {
        _rb_js_try_convert: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:_rb_js_try_convert'],
        rb_funcallv_thunk: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_funcallv_thunk'],
      },
      'GOT.mem': {
        rb_asyncify_unwind_buf: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_asyncify_unwind_buf'],
        rb_cBasicObject: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cBasicObject'],
        rb_cFalseClass: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cFalseClass'],
        rb_cFloat: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cFloat'],
        rb_cInteger: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cInteger'],
        rb_cObject: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cObject'],
        rb_cProc: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cProc'],
        rb_cString: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cString'],
        rb_cTrueClass: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cTrueClass'],
        rb_eArgError: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_eArgError'],
        rb_eStandardError: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_eStandardError'],
        rb_eTypeError: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_eTypeError'],
        rb_mKernel: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_mKernel'],
        stderr: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:stderr'],
      },
      '[export]ruby:js/ruby-runtime': {
        '[resource-drop]rb-abi-value': trampoline116,
        '[resource-new]rb-abi-value': trampoline117,
        '[resource-rep]rb-abi-value': trampoline118,
      },
      env: {
        __asyncify_data: exports4.__asyncify_data,
        __asyncify_state: exports4.__asyncify_state,
        __indirect_function_table: exports4.__indirect_function_table,
        __memory_base: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:memory_base'],
        __stack_pointer: exports4.__stack_pointer,
        __table_base: exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:table_base'],
        abort: exports10.abort,
        cabi_realloc: exports4.cabi_realloc,
        free: exports10.free,
        memcpy: exports10.memcpy,
        memory: exports4.memory,
        rb_ary_hidden_new: exports8.rb_ary_hidden_new,
        rb_ary_push: exports8.rb_ary_push,
        rb_block_given_p: exports8.rb_block_given_p,
        rb_block_proc: exports8.rb_block_proc,
        rb_check_typeddata: exports8.rb_check_typeddata,
        rb_class2name: exports8.rb_class2name,
        rb_class_new_instance: exports8.rb_class_new_instance,
        rb_const_get: exports8.rb_const_get,
        rb_cstr2inum: exports8.rb_cstr2inum,
        rb_cstr_to_dbl: exports8.rb_cstr_to_dbl,
        rb_data_typed_object_zalloc: exports8.rb_data_typed_object_zalloc,
        rb_dbl2big: exports8.rb_dbl2big,
        rb_define_alias: exports8.rb_define_alias,
        rb_define_alloc_func: exports8.rb_define_alloc_func,
        rb_define_class_under: exports8.rb_define_class_under,
        rb_define_method: exports8.rb_define_method,
        rb_define_module: exports8.rb_define_module,
        rb_define_module_function: exports8.rb_define_module_function,
        rb_define_private_method: exports8.rb_define_private_method,
        rb_define_singleton_method: exports8.rb_define_singleton_method,
        rb_errinfo: exports8.rb_errinfo,
        rb_exc_raise: exports8.rb_exc_raise,
        rb_float_new: exports8.rb_float_new,
        rb_float_value: exports8.rb_float_value,
        rb_funcallv: exports8.rb_funcallv,
        rb_gc_disable_no_rest: exports8.rb_gc_disable_no_rest,
        rb_gc_enable: exports8.rb_gc_enable,
        rb_gc_register_mark_object: exports8.rb_gc_register_mark_object,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_delete: exports8.rb_hash_delete,
        rb_hash_lookup: exports8.rb_hash_lookup,
        rb_hash_new: exports8.rb_hash_new,
        rb_intern: exports8.rb_intern,
        rb_intern2: exports8.rb_intern2,
        rb_obj_as_string: exports8.rb_obj_as_string,
        rb_obj_class: exports8.rb_obj_class,
        rb_obj_id: exports8.rb_obj_id,
        rb_obj_is_kind_of: exports8.rb_obj_is_kind_of,
        rb_protect: exports8.rb_protect,
        rb_raise: exports8.rb_raise,
        rb_respond_to: exports8.rb_respond_to,
        rb_set_errinfo: exports8.rb_set_errinfo,
        rb_singleton_class: exports8.rb_singleton_class,
        rb_str_new: exports8.rb_str_new,
        rb_typeddata_is_kind_of: exports8.rb_typeddata_is_kind_of,
        rb_utf8_str_new: exports8.rb_utf8_str_new,
        rb_utf8_str_new_static: exports8.rb_utf8_str_new_static,
        rb_vm_bugreport: exports8.rb_vm_bugreport,
        rb_warning: exports8.rb_warning,
        rb_wasm_handle_fiber_unwind: exports8.rb_wasm_handle_fiber_unwind,
        rb_wasm_handle_jmp_unwind: exports8.rb_wasm_handle_jmp_unwind,
        rb_wasm_handle_scan_unwind: exports8.rb_wasm_handle_scan_unwind,
        realloc: exports10.realloc,
        ruby_init: exports8.ruby_init,
        ruby_init_loadpath: exports8.ruby_init_loadpath,
        ruby_malloc_size_overflow: exports8.ruby_malloc_size_overflow,
        ruby_options: exports8.ruby_options,
        ruby_show_version: exports8.ruby_show_version,
        ruby_sysinit: exports8.ruby_sysinit,
        ruby_xfree: exports8.ruby_xfree,
        ruby_xmalloc: exports8.ruby_xmalloc,
        strlen: exports10.strlen,
      },
      'ruby:js/js-runtime': {
        '[resource-drop]js-abi-value': trampoline115,
        'bool-to-js-bool': trampoline124,
        'eval-js': exports3['90'],
        'export-js-value-to-host': trampoline127,
        'float-to-js-number': trampoline123,
        'global-this': trampoline121,
        'import-js-value-from-host': trampoline128,
        'instance-of': trampoline120,
        'int-to-js-number': trampoline122,
        'is-js': trampoline119,
        'js-value-equal': trampoline129,
        'js-value-strictly-equal': trampoline130,
        'js-value-to-integer': exports3['93'],
        'js-value-to-string': exports3['92'],
        'js-value-typeof': exports3['94'],
        'proc-to-js-function': trampoline125,
        'rb-object-to-js-rb-value': trampoline126,
        'reflect-apply': exports3['95'],
        'reflect-get': exports3['96'],
        'reflect-set': exports3['97'],
        'string-to-js-string': exports3['91'],
        'throw-prohibit-rewind-exception': exports3['98'],
      },
    }));
    memory1 = exports4.memory;
    ({ exports: exports99 } = yield instantiateCore(yield module101, {
      augments: {
        'mem1 I32Load': (ptr, off) => new DataView(exports4.memory.buffer).getInt32(ptr + off, true),
        'mem1 I32Load8U': (ptr, off) => new DataView(exports4.memory.buffer).getUint8(ptr + off, true),
        'mem1 I32Store': (ptr, val, offset) => {
          new DataView(exports4.memory.buffer).setInt32(ptr + offset, val, true);
        },
        'mem1 I32Store8': (ptr, val, offset) => {
          new DataView(exports4.memory.buffer).setInt8(ptr + offset, val, true);
        },
        'mem1 I64Store': (ptr, val, offset) => {
          new DataView(exports4.memory.buffer).setBigInt64(ptr + offset, val, true);
        },
        'mem1 MemorySize': ptr => exports4.memory.buffer.byteLength / 65536,
      },
      callee: {
        adapter10: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.read-via-stream'],
        adapter11: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.write-via-stream'],
        adapter12: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.append-via-stream'],
        adapter13: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.advise'],
        adapter14: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.sync'],
        adapter15: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.get-flags'],
        adapter16: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.get-type'],
        adapter17: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.set-size'],
        adapter18: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.set-times'],
        adapter19: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.read'],
        adapter20: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.write'],
        adapter21: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.read-directory'],
        adapter22: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.create-directory-at'],
        adapter23: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.stat'],
        adapter24: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.stat-at'],
        adapter25: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.set-times-at'],
        adapter26: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.link-at'],
        adapter27: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.open-at'],
        adapter28: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.readlink-at'],
        adapter29: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.rename-at'],
        adapter30: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.symlink-at'],
        adapter31: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.metadata-hash'],
        adapter32: exports1['wasi:filesystem/types@0.2.0#[method]descriptor.metadata-hash-at'],
        adapter33: exports1['wasi:filesystem/types@0.2.0#[method]directory-entry-stream.read-directory-entry'],
        adapter34: exports1['wasi:filesystem/types@0.2.0#filesystem-error-code'],
        adapter35: exports1['wasi:io/streams@0.2.0#[method]input-stream.read'],
        adapter36: exports1['wasi:io/streams@0.2.0#[method]input-stream.blocking-read'],
        adapter37: exports1['wasi:io/streams@0.2.0#[method]output-stream.check-write'],
        adapter38: exports1['wasi:io/streams@0.2.0#[method]output-stream.write'],
        adapter39: exports1['wasi:io/streams@0.2.0#[method]output-stream.blocking-write-and-flush'],
        adapter40: exports1['wasi:io/streams@0.2.0#[method]output-stream.blocking-flush'],
        adapter41: exports1['wasi:io/poll@0.2.0#poll'],
        adapter42: exports1['wasi:cli/environment@0.2.0#get-environment'],
        adapter43: exports1['wasi:cli/environment@0.2.0#get-arguments'],
        adapter44: exports1['wasi:cli/terminal-stdin@0.2.0#get-terminal-stdin'],
        adapter45: exports1['wasi:cli/terminal-stdout@0.2.0#get-terminal-stdout'],
        adapter46: exports1['wasi:cli/terminal-stderr@0.2.0#get-terminal-stderr'],
        adapter9: exports1['wasi:filesystem/preopens@0.2.0#get-directories'],
      },
      flags: {
        instance1: instanceFlags1,
        instance27: instanceFlags27,
      },
      memory: {
        m0: exports1.memory,
      },
      post_return: {
        adapter19: exports1['cabi_post_wasi:filesystem/types@0.2.0#[method]descriptor.read'],
        adapter33: exports1['cabi_post_wasi:filesystem/types@0.2.0#[method]directory-entry-stream.read-directory-entry'],
        adapter41: exports1['cabi_post_wasi:io/poll@0.2.0#poll'],
        adapter42: exports1['cabi_post_wasi:cli/environment@0.2.0#get-environment'],
        adapter43: exports1['cabi_post_wasi:cli/environment@0.2.0#get-arguments'],
        adapter9: exports1['cabi_post_wasi:filesystem/preopens@0.2.0#get-directories'],
      },
      realloc: {
        f0: exports6.cabi_import_realloc,
        f19: exports1.cabi_realloc,
      },
      resource: {
        'enter-call': trampoline103,
        'exit-call': trampoline105,
        'transfer-borrow': trampoline104,
        'transfer-own': trampoline102,
      },
      transcode: {
        'utf8-to-utf8 (mem0 => mem1)': trampoline131,
        'utf8-to-utf8 (mem1 => mem0)': trampoline132,
      },
    }));
    realloc1 = exports6.cabi_import_realloc;
    realloc2 = exports98.cabi_realloc;
    ({ exports: exports100 } = yield instantiateCore(yield module96, {
      '': {
        $imports: exports3.$imports,
        '0': exports99.adapter9,
        '1': trampoline133,
        '10': exports99.adapter17,
        '11': exports99.adapter18,
        '12': exports99.adapter19,
        '13': exports99.adapter20,
        '14': exports99.adapter21,
        '15': exports99.adapter14,
        '16': exports99.adapter22,
        '17': exports99.adapter23,
        '18': exports99.adapter24,
        '19': exports99.adapter25,
        '2': trampoline134,
        '20': exports99.adapter26,
        '21': exports99.adapter27,
        '22': exports99.adapter28,
        '23': exports99.adapter22,
        '24': exports99.adapter29,
        '25': exports99.adapter30,
        '26': exports99.adapter22,
        '27': exports99.adapter31,
        '28': exports99.adapter32,
        '29': exports99.adapter33,
        '3': exports99.adapter10,
        '30': exports99.adapter34,
        '31': exports99.adapter35,
        '32': exports99.adapter36,
        '33': exports99.adapter37,
        '34': exports99.adapter38,
        '35': exports99.adapter39,
        '36': exports99.adapter40,
        '37': exports99.adapter41,
        '38': trampoline135,
        '39': exports99.adapter42,
        '4': exports99.adapter11,
        '40': exports99.adapter43,
        '41': exports99.adapter44,
        '42': exports99.adapter45,
        '43': exports99.adapter46,
        '44': exports6.args_get,
        '45': exports6.args_sizes_get,
        '46': exports6.clock_res_get,
        '47': exports6.clock_time_get,
        '48': exports6.environ_get,
        '49': exports6.environ_sizes_get,
        '5': exports99.adapter12,
        '50': exports6.fd_advise,
        '51': exports6.fd_allocate,
        '52': exports6.fd_close,
        '53': exports6.fd_datasync,
        '54': exports6.fd_fdstat_get,
        '55': exports6.fd_fdstat_set_flags,
        '56': exports6.fd_fdstat_set_rights,
        '57': exports6.fd_filestat_get,
        '58': exports6.fd_filestat_set_size,
        '59': exports6.fd_filestat_set_times,
        '6': exports99.adapter13,
        '60': exports6.fd_pread,
        '61': exports6.fd_prestat_dir_name,
        '62': exports6.fd_prestat_get,
        '63': exports6.fd_pwrite,
        '64': exports6.fd_read,
        '65': exports6.fd_readdir,
        '66': exports6.fd_renumber,
        '67': exports6.fd_seek,
        '68': exports6.fd_sync,
        '69': exports6.fd_tell,
        '7': exports99.adapter14,
        '70': exports6.fd_write,
        '71': exports6.path_create_directory,
        '72': exports6.path_filestat_get,
        '73': exports6.path_filestat_set_times,
        '74': exports6.path_link,
        '75': exports6.path_open,
        '76': exports6.path_readlink,
        '77': exports6.path_remove_directory,
        '78': exports6.path_rename,
        '79': exports6.path_symlink,
        '8': exports99.adapter15,
        '80': exports6.path_unlink_file,
        '81': exports6.poll_oneoff,
        '82': exports6.proc_exit,
        '83': exports6.random_get,
        '84': exports6.sched_yield,
        '85': exports6.sock_accept,
        '86': exports6.sock_recv,
        '87': exports6.sock_send,
        '88': exports6.sock_shutdown,
        '89': exports8._start,
        '9': exports99.adapter16,
        '90': trampoline136,
        '91': trampoline137,
        '92': trampoline138,
        '93': trampoline139,
        '94': trampoline140,
        '95': trampoline141,
        '96': trampoline142,
        '97': trampoline143,
        '98': trampoline144,
      },
    }));
    ({ exports: exports101 } = yield instantiateCore(yield module94, {
      '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so': {
        Init_js: exports98.Init_js,
        Init_witapi: exports98.Init_witapi,
        __component_type_object_force_link_ext: exports98.__component_type_object_force_link_ext,
        __component_type_object_force_link_ext_public_use_in_this_compilation_unit: exports98.__component_type_object_force_link_ext_public_use_in_this_compilation_unit,
        __wasm_apply_data_relocs: exports98.__wasm_apply_data_relocs,
        _initialize: exports98._initialize,
        _rb_js_try_convert: exports98._rb_js_try_convert,
        asyncify_get_state: exports98.asyncify_get_state,
        asyncify_start_rewind: exports98.asyncify_start_rewind,
        asyncify_start_unwind: exports98.asyncify_start_unwind,
        asyncify_stop_rewind: exports98.asyncify_stop_rewind,
        asyncify_stop_unwind: exports98.asyncify_stop_unwind,
        'cabi_post_ruby:js/ruby-runtime#rstring-ptr': exports98['cabi_post_ruby:js/ruby-runtime#rstring-ptr'],
        cabi_realloc: exports98.cabi_realloc,
        exports_ruby_js_ruby_runtime_export_rb_value_to_js: exports98.exports_ruby_js_ruby_runtime_export_rb_value_to_js,
        exports_ruby_js_ruby_runtime_list_borrow_rb_abi_value_free: exports98.exports_ruby_js_ruby_runtime_list_borrow_rb_abi_value_free,
        exports_ruby_js_ruby_runtime_rb_abi_value_destructor: exports98.exports_ruby_js_ruby_runtime_rb_abi_value_destructor,
        exports_ruby_js_ruby_runtime_rb_abi_value_drop_own: exports98.exports_ruby_js_ruby_runtime_rb_abi_value_drop_own,
        exports_ruby_js_ruby_runtime_rb_abi_value_new: exports98.exports_ruby_js_ruby_runtime_rb_abi_value_new,
        exports_ruby_js_ruby_runtime_rb_abi_value_rep: exports98.exports_ruby_js_ruby_runtime_rb_abi_value_rep,
        exports_ruby_js_ruby_runtime_rb_clear_errinfo: exports98.exports_ruby_js_ruby_runtime_rb_clear_errinfo,
        exports_ruby_js_ruby_runtime_rb_errinfo: exports98.exports_ruby_js_ruby_runtime_rb_errinfo,
        exports_ruby_js_ruby_runtime_rb_eval_string_protect: exports98.exports_ruby_js_ruby_runtime_rb_eval_string_protect,
        exports_ruby_js_ruby_runtime_rb_funcallv_protect: exports98.exports_ruby_js_ruby_runtime_rb_funcallv_protect,
        exports_ruby_js_ruby_runtime_rb_gc_disable: exports98.exports_ruby_js_ruby_runtime_rb_gc_disable,
        exports_ruby_js_ruby_runtime_rb_gc_enable: exports98.exports_ruby_js_ruby_runtime_rb_gc_enable,
        exports_ruby_js_ruby_runtime_rb_intern: exports98.exports_ruby_js_ruby_runtime_rb_intern,
        exports_ruby_js_ruby_runtime_rb_set_should_prohibit_rewind: exports98.exports_ruby_js_ruby_runtime_rb_set_should_prohibit_rewind,
        exports_ruby_js_ruby_runtime_rb_vm_bugreport: exports98.exports_ruby_js_ruby_runtime_rb_vm_bugreport,
        exports_ruby_js_ruby_runtime_rstring_ptr: exports98.exports_ruby_js_ruby_runtime_rstring_ptr,
        exports_ruby_js_ruby_runtime_ruby_init: exports98.exports_ruby_js_ruby_runtime_ruby_init,
        exports_ruby_js_ruby_runtime_ruby_init_loadpath: exports98.exports_ruby_js_ruby_runtime_ruby_init_loadpath,
        exports_ruby_js_ruby_runtime_ruby_show_version: exports98.exports_ruby_js_ruby_runtime_ruby_show_version,
        ext_list_string_free: exports98.ext_list_string_free,
        ext_string_dup: exports98.ext_string_dup,
        ext_string_free: exports98.ext_string_free,
        ext_string_set: exports98.ext_string_set,
        rb_abi_guest_rb_abi_value_data_ptr: exports98.rb_abi_guest_rb_abi_value_data_ptr,
        rb_abi_guest_rb_abi_value_dtor: exports98.rb_abi_guest_rb_abi_value_dtor,
        rb_abi_guest_rb_clear_errinfo: exports98.rb_abi_guest_rb_clear_errinfo,
        rb_abi_guest_rb_errinfo: exports98.rb_abi_guest_rb_errinfo,
        rb_abi_guest_rb_eval_string_protect: exports98.rb_abi_guest_rb_eval_string_protect,
        rb_abi_guest_rb_funcallv_protect: exports98.rb_abi_guest_rb_funcallv_protect,
        rb_abi_guest_rb_gc_disable: exports98.rb_abi_guest_rb_gc_disable,
        rb_abi_guest_rb_gc_enable: exports98.rb_abi_guest_rb_gc_enable,
        rb_abi_guest_rb_intern: exports98.rb_abi_guest_rb_intern,
        rb_abi_guest_rb_set_should_prohibit_rewind: exports98.rb_abi_guest_rb_set_should_prohibit_rewind,
        rb_abi_guest_rb_vm_bugreport: exports98.rb_abi_guest_rb_vm_bugreport,
        rb_abi_guest_rstring_ptr: exports98.rb_abi_guest_rstring_ptr,
        rb_abi_guest_ruby_init: exports98.rb_abi_guest_ruby_init,
        rb_abi_guest_ruby_init_loadpath: exports98.rb_abi_guest_ruby_init_loadpath,
        rb_abi_guest_ruby_show_version: exports98.rb_abi_guest_ruby_show_version,
        rb_abi_lend_object: exports98.rb_abi_lend_object,
        rb_abi_stage_rb_value_to_js: exports98.rb_abi_stage_rb_value_to_js,
        rb_funcallv_thunk: exports98.rb_funcallv_thunk,
        rb_wasm_throw_prohibit_rewind_exception: exports98.rb_wasm_throw_prohibit_rewind_exception,
        'ruby:js/ruby-runtime#[dtor]rb_abi_value': exports98['ruby:js/ruby-runtime#[dtor]rb_abi_value'],
        'ruby:js/ruby-runtime#export-rb-value-to-js': exports98['ruby:js/ruby-runtime#export-rb-value-to-js'],
        'ruby:js/ruby-runtime#rb-clear-errinfo': exports98['ruby:js/ruby-runtime#rb-clear-errinfo'],
        'ruby:js/ruby-runtime#rb-errinfo': exports98['ruby:js/ruby-runtime#rb-errinfo'],
        'ruby:js/ruby-runtime#rb-eval-string-protect': exports98['ruby:js/ruby-runtime#rb-eval-string-protect'],
        'ruby:js/ruby-runtime#rb-funcallv-protect': exports98['ruby:js/ruby-runtime#rb-funcallv-protect'],
        'ruby:js/ruby-runtime#rb-gc-disable': exports98['ruby:js/ruby-runtime#rb-gc-disable'],
        'ruby:js/ruby-runtime#rb-gc-enable': exports98['ruby:js/ruby-runtime#rb-gc-enable'],
        'ruby:js/ruby-runtime#rb-intern': exports98['ruby:js/ruby-runtime#rb-intern'],
        'ruby:js/ruby-runtime#rb-set-should-prohibit-rewind': exports98['ruby:js/ruby-runtime#rb-set-should-prohibit-rewind'],
        'ruby:js/ruby-runtime#rb-vm-bugreport': exports98['ruby:js/ruby-runtime#rb-vm-bugreport'],
        'ruby:js/ruby-runtime#rstring-ptr': exports98['ruby:js/ruby-runtime#rstring-ptr'],
        'ruby:js/ruby-runtime#ruby-init': exports98['ruby:js/ruby-runtime#ruby-init'],
        'ruby:js/ruby-runtime#ruby-init-loadpath': exports98['ruby:js/ruby-runtime#ruby-init-loadpath'],
        'ruby:js/ruby-runtime#ruby-show-version': exports98['ruby:js/ruby-runtime#ruby-show-version'],
        ruby_abi_version: exports98.ruby_abi_version,
        ruby_js_js_runtime_bool_to_js_bool: exports98.ruby_js_js_runtime_bool_to_js_bool,
        ruby_js_js_runtime_borrow_js_abi_value: exports98.ruby_js_js_runtime_borrow_js_abi_value,
        ruby_js_js_runtime_eval_js: exports98.ruby_js_js_runtime_eval_js,
        ruby_js_js_runtime_export_js_value_to_host: exports98.ruby_js_js_runtime_export_js_value_to_host,
        ruby_js_js_runtime_float_to_js_number: exports98.ruby_js_js_runtime_float_to_js_number,
        ruby_js_js_runtime_global_this: exports98.ruby_js_js_runtime_global_this,
        ruby_js_js_runtime_import_js_value_from_host: exports98.ruby_js_js_runtime_import_js_value_from_host,
        ruby_js_js_runtime_instance_of: exports98.ruby_js_js_runtime_instance_of,
        ruby_js_js_runtime_int_to_js_number: exports98.ruby_js_js_runtime_int_to_js_number,
        ruby_js_js_runtime_is_js: exports98.ruby_js_js_runtime_is_js,
        ruby_js_js_runtime_js_abi_result_free: exports98.ruby_js_js_runtime_js_abi_result_free,
        ruby_js_js_runtime_js_abi_value_drop_own: exports98.ruby_js_js_runtime_js_abi_value_drop_own,
        ruby_js_js_runtime_js_value_equal: exports98.ruby_js_js_runtime_js_value_equal,
        ruby_js_js_runtime_js_value_strictly_equal: exports98.ruby_js_js_runtime_js_value_strictly_equal,
        ruby_js_js_runtime_js_value_to_integer: exports98.ruby_js_js_runtime_js_value_to_integer,
        ruby_js_js_runtime_js_value_to_string: exports98.ruby_js_js_runtime_js_value_to_string,
        ruby_js_js_runtime_js_value_typeof: exports98.ruby_js_js_runtime_js_value_typeof,
        ruby_js_js_runtime_list_borrow_js_abi_value_free: exports98.ruby_js_js_runtime_list_borrow_js_abi_value_free,
        ruby_js_js_runtime_proc_to_js_function: exports98.ruby_js_js_runtime_proc_to_js_function,
        ruby_js_js_runtime_raw_integer_free: exports98.ruby_js_js_runtime_raw_integer_free,
        ruby_js_js_runtime_rb_object_to_js_rb_value: exports98.ruby_js_js_runtime_rb_object_to_js_rb_value,
        ruby_js_js_runtime_reflect_apply: exports98.ruby_js_js_runtime_reflect_apply,
        ruby_js_js_runtime_reflect_get: exports98.ruby_js_js_runtime_reflect_get,
        ruby_js_js_runtime_reflect_set: exports98.ruby_js_js_runtime_reflect_set,
        ruby_js_js_runtime_string_to_js_string: exports98.ruby_js_js_runtime_string_to_js_string,
        ruby_js_js_runtime_throw_prohibit_rewind_exception: exports98.ruby_js_js_runtime_throw_prohibit_rewind_exception,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so': {
        InitVM_escape: exports14.InitVM_escape,
        Init_escape: exports14.Init_escape,
        __wasm_apply_data_relocs: exports14.__wasm_apply_data_relocs,
        _initialize: exports14._initialize,
        asyncify_get_state: exports14.asyncify_get_state,
        asyncify_start_rewind: exports14.asyncify_start_rewind,
        asyncify_start_unwind: exports14.asyncify_start_unwind,
        asyncify_stop_rewind: exports14.asyncify_stop_rewind,
        asyncify_stop_unwind: exports14.asyncify_stop_unwind,
        ruby_abi_version: exports14.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/continuation.so': {
        Init_continuation: exports15.Init_continuation,
        __wasm_apply_data_relocs: exports15.__wasm_apply_data_relocs,
        _initialize: exports15._initialize,
        asyncify_get_state: exports15.asyncify_get_state,
        asyncify_start_rewind: exports15.asyncify_start_rewind,
        asyncify_start_unwind: exports15.asyncify_start_unwind,
        asyncify_stop_rewind: exports15.asyncify_stop_rewind,
        asyncify_stop_unwind: exports15.asyncify_stop_unwind,
        ruby_abi_version: exports15.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/coverage.so': {
        Init_coverage: exports16.Init_coverage,
        __wasm_apply_data_relocs: exports16.__wasm_apply_data_relocs,
        _initialize: exports16._initialize,
        asyncify_get_state: exports16.asyncify_get_state,
        asyncify_start_rewind: exports16.asyncify_start_rewind,
        asyncify_start_unwind: exports16.asyncify_start_unwind,
        asyncify_stop_rewind: exports16.asyncify_stop_rewind,
        asyncify_stop_unwind: exports16.asyncify_stop_unwind,
        rb_coverage_resume: exports16.rb_coverage_resume,
        rb_coverage_suspend: exports16.rb_coverage_suspend,
        ruby_abi_version: exports16.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so': {
        Init_date_core: exports17.Init_date_core,
        __wasm_apply_data_relocs: exports17.__wasm_apply_data_relocs,
        _initialize: exports17._initialize,
        asyncify_get_state: exports17.asyncify_get_state,
        asyncify_start_rewind: exports17.asyncify_start_rewind,
        asyncify_start_unwind: exports17.asyncify_start_unwind,
        asyncify_stop_rewind: exports17.asyncify_stop_rewind,
        asyncify_stop_unwind: exports17.asyncify_stop_unwind,
        date__httpdate: exports17.date__httpdate,
        date__iso8601: exports17.date__iso8601,
        date__jisx0301: exports17.date__jisx0301,
        date__parse: exports17.date__parse,
        date__rfc2822: exports17.date__rfc2822,
        date__rfc3339: exports17.date__rfc3339,
        date__strptime: exports17.date__strptime,
        date__xmlschema: exports17.date__xmlschema,
        date_strftime: exports17.date_strftime,
        date_zone_to_diff: exports17.date_zone_to_diff,
        ruby_abi_version: exports17.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so': {
        InitVM_digest: exports23.InitVM_digest,
        Init_digest: exports23.Init_digest,
        __wasm_apply_data_relocs: exports23.__wasm_apply_data_relocs,
        _initialize: exports23._initialize,
        asyncify_get_state: exports23.asyncify_get_state,
        asyncify_start_rewind: exports23.asyncify_start_rewind,
        asyncify_start_unwind: exports23.asyncify_start_unwind,
        asyncify_stop_rewind: exports23.asyncify_stop_rewind,
        asyncify_stop_unwind: exports23.asyncify_stop_unwind,
        rb_digest_wrap_metadata: exports23.rb_digest_wrap_metadata,
        ruby_abi_version: exports23.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/bubblebabble.so': {
        Init_bubblebabble: exports18.Init_bubblebabble,
        __wasm_apply_data_relocs: exports18.__wasm_apply_data_relocs,
        _initialize: exports18._initialize,
        asyncify_get_state: exports18.asyncify_get_state,
        asyncify_start_rewind: exports18.asyncify_start_rewind,
        asyncify_start_unwind: exports18.asyncify_start_unwind,
        asyncify_stop_rewind: exports18.asyncify_stop_rewind,
        asyncify_stop_unwind: exports18.asyncify_stop_unwind,
        ruby_abi_version: exports18.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/md5.so': {
        Init_md5: exports19.Init_md5,
        __wasm_apply_data_relocs: exports19.__wasm_apply_data_relocs,
        _initialize: exports19._initialize,
        asyncify_get_state: exports19.asyncify_get_state,
        asyncify_start_rewind: exports19.asyncify_start_rewind,
        asyncify_start_unwind: exports19.asyncify_start_unwind,
        asyncify_stop_rewind: exports19.asyncify_stop_rewind,
        asyncify_stop_unwind: exports19.asyncify_stop_unwind,
        rb_Digest_MD5_Finish: exports19.rb_Digest_MD5_Finish,
        rb_Digest_MD5_Init: exports19.rb_Digest_MD5_Init,
        rb_Digest_MD5_Update: exports19.rb_Digest_MD5_Update,
        ruby_abi_version: exports19.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/rmd160.so': {
        Init_rmd160: exports20.Init_rmd160,
        __wasm_apply_data_relocs: exports20.__wasm_apply_data_relocs,
        _initialize: exports20._initialize,
        asyncify_get_state: exports20.asyncify_get_state,
        asyncify_start_rewind: exports20.asyncify_start_rewind,
        asyncify_start_unwind: exports20.asyncify_start_unwind,
        asyncify_stop_rewind: exports20.asyncify_stop_rewind,
        asyncify_stop_unwind: exports20.asyncify_stop_unwind,
        rb_Digest_RMD160_Finish: exports20.rb_Digest_RMD160_Finish,
        rb_Digest_RMD160_Init: exports20.rb_Digest_RMD160_Init,
        rb_Digest_RMD160_Transform: exports20.rb_Digest_RMD160_Transform,
        rb_Digest_RMD160_Update: exports20.rb_Digest_RMD160_Update,
        ruby_abi_version: exports20.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha1.so': {
        Init_sha1: exports21.Init_sha1,
        __wasm_apply_data_relocs: exports21.__wasm_apply_data_relocs,
        _initialize: exports21._initialize,
        asyncify_get_state: exports21.asyncify_get_state,
        asyncify_start_rewind: exports21.asyncify_start_rewind,
        asyncify_start_unwind: exports21.asyncify_start_unwind,
        asyncify_stop_rewind: exports21.asyncify_stop_rewind,
        asyncify_stop_unwind: exports21.asyncify_stop_unwind,
        rb_Digest_SHA1_Finish: exports21.rb_Digest_SHA1_Finish,
        rb_Digest_SHA1_Init: exports21.rb_Digest_SHA1_Init,
        rb_Digest_SHA1_Transform: exports21.rb_Digest_SHA1_Transform,
        rb_Digest_SHA1_Update: exports21.rb_Digest_SHA1_Update,
        ruby_abi_version: exports21.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so': {
        Init_sha2: exports22.Init_sha2,
        __wasm_apply_data_relocs: exports22.__wasm_apply_data_relocs,
        _initialize: exports22._initialize,
        asyncify_get_state: exports22.asyncify_get_state,
        asyncify_start_rewind: exports22.asyncify_start_rewind,
        asyncify_start_unwind: exports22.asyncify_start_unwind,
        asyncify_stop_rewind: exports22.asyncify_stop_rewind,
        asyncify_stop_unwind: exports22.asyncify_stop_unwind,
        rb_Digest_SHA256_Data: exports22.rb_Digest_SHA256_Data,
        rb_Digest_SHA256_End: exports22.rb_Digest_SHA256_End,
        rb_Digest_SHA256_Finish: exports22.rb_Digest_SHA256_Finish,
        rb_Digest_SHA256_Init: exports22.rb_Digest_SHA256_Init,
        rb_Digest_SHA256_Transform: exports22.rb_Digest_SHA256_Transform,
        rb_Digest_SHA256_Update: exports22.rb_Digest_SHA256_Update,
        rb_Digest_SHA384_Data: exports22.rb_Digest_SHA384_Data,
        rb_Digest_SHA384_End: exports22.rb_Digest_SHA384_End,
        rb_Digest_SHA384_Finish: exports22.rb_Digest_SHA384_Finish,
        rb_Digest_SHA384_Init: exports22.rb_Digest_SHA384_Init,
        rb_Digest_SHA384_Update: exports22.rb_Digest_SHA384_Update,
        rb_Digest_SHA512_Data: exports22.rb_Digest_SHA512_Data,
        rb_Digest_SHA512_End: exports22.rb_Digest_SHA512_End,
        rb_Digest_SHA512_Finish: exports22.rb_Digest_SHA512_Finish,
        rb_Digest_SHA512_Init: exports22.rb_Digest_SHA512_Init,
        rb_Digest_SHA512_Last: exports22.rb_Digest_SHA512_Last,
        rb_Digest_SHA512_Transform: exports22.rb_Digest_SHA512_Transform,
        rb_Digest_SHA512_Update: exports22.rb_Digest_SHA512_Update,
        ruby_abi_version: exports22.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/big5.so': {
        Init_big5: exports24.Init_big5,
        Init_big5_hkscs: exports24.Init_big5_hkscs,
        Init_big5_uao: exports24.Init_big5_uao,
        __wasm_apply_data_relocs: exports24.__wasm_apply_data_relocs,
        _initialize: exports24._initialize,
        asyncify_get_state: exports24.asyncify_get_state,
        asyncify_start_rewind: exports24.asyncify_start_rewind,
        asyncify_start_unwind: exports24.asyncify_start_unwind,
        asyncify_stop_rewind: exports24.asyncify_stop_rewind,
        asyncify_stop_unwind: exports24.asyncify_stop_unwind,
        ruby_abi_version: exports24.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so': {
        Init_cesu_8: exports25.Init_cesu_8,
        __wasm_apply_data_relocs: exports25.__wasm_apply_data_relocs,
        _initialize: exports25._initialize,
        asyncify_get_state: exports25.asyncify_get_state,
        asyncify_start_rewind: exports25.asyncify_start_rewind,
        asyncify_start_unwind: exports25.asyncify_start_unwind,
        asyncify_stop_rewind: exports25.asyncify_stop_rewind,
        asyncify_stop_unwind: exports25.asyncify_stop_unwind,
        ruby_abi_version: exports25.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cp949.so': {
        Init_cp949: exports26.Init_cp949,
        __wasm_apply_data_relocs: exports26.__wasm_apply_data_relocs,
        _initialize: exports26._initialize,
        asyncify_get_state: exports26.asyncify_get_state,
        asyncify_start_rewind: exports26.asyncify_start_rewind,
        asyncify_start_unwind: exports26.asyncify_start_unwind,
        asyncify_stop_rewind: exports26.asyncify_stop_rewind,
        asyncify_stop_unwind: exports26.asyncify_stop_unwind,
        ruby_abi_version: exports26.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so': {
        Init_emacs_mule: exports27.Init_emacs_mule,
        __wasm_apply_data_relocs: exports27.__wasm_apply_data_relocs,
        _initialize: exports27._initialize,
        asyncify_get_state: exports27.asyncify_get_state,
        asyncify_start_rewind: exports27.asyncify_start_rewind,
        asyncify_start_unwind: exports27.asyncify_start_unwind,
        asyncify_stop_rewind: exports27.asyncify_stop_rewind,
        asyncify_stop_unwind: exports27.asyncify_stop_unwind,
        ruby_abi_version: exports27.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/encdb.so': {
        Init_encdb: exports28.Init_encdb,
        __wasm_apply_data_relocs: exports28.__wasm_apply_data_relocs,
        _initialize: exports28._initialize,
        asyncify_get_state: exports28.asyncify_get_state,
        asyncify_start_rewind: exports28.asyncify_start_rewind,
        asyncify_start_unwind: exports28.asyncify_start_unwind,
        asyncify_stop_rewind: exports28.asyncify_stop_rewind,
        asyncify_stop_unwind: exports28.asyncify_stop_unwind,
        ruby_abi_version: exports28.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so': {
        Init_euc_jp: exports29.Init_euc_jp,
        __wasm_apply_data_relocs: exports29.__wasm_apply_data_relocs,
        _initialize: exports29._initialize,
        asyncify_get_state: exports29.asyncify_get_state,
        asyncify_start_rewind: exports29.asyncify_start_rewind,
        asyncify_start_unwind: exports29.asyncify_start_unwind,
        asyncify_stop_rewind: exports29.asyncify_stop_rewind,
        asyncify_stop_unwind: exports29.asyncify_stop_unwind,
        ruby_abi_version: exports29.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_kr.so': {
        Init_euc_kr: exports30.Init_euc_kr,
        __wasm_apply_data_relocs: exports30.__wasm_apply_data_relocs,
        _initialize: exports30._initialize,
        asyncify_get_state: exports30.asyncify_get_state,
        asyncify_start_rewind: exports30.asyncify_start_rewind,
        asyncify_start_unwind: exports30.asyncify_start_unwind,
        asyncify_stop_rewind: exports30.asyncify_stop_rewind,
        asyncify_stop_unwind: exports30.asyncify_stop_unwind,
        ruby_abi_version: exports30.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_tw.so': {
        Init_euc_tw: exports31.Init_euc_tw,
        __wasm_apply_data_relocs: exports31.__wasm_apply_data_relocs,
        _initialize: exports31._initialize,
        asyncify_get_state: exports31.asyncify_get_state,
        asyncify_start_rewind: exports31.asyncify_start_rewind,
        asyncify_start_unwind: exports31.asyncify_start_unwind,
        asyncify_stop_rewind: exports31.asyncify_stop_rewind,
        asyncify_stop_unwind: exports31.asyncify_stop_unwind,
        ruby_abi_version: exports31.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb18030.so': {
        Init_gb18030: exports32.Init_gb18030,
        __wasm_apply_data_relocs: exports32.__wasm_apply_data_relocs,
        _initialize: exports32._initialize,
        asyncify_get_state: exports32.asyncify_get_state,
        asyncify_start_rewind: exports32.asyncify_start_rewind,
        asyncify_start_unwind: exports32.asyncify_start_unwind,
        asyncify_stop_rewind: exports32.asyncify_stop_rewind,
        asyncify_stop_unwind: exports32.asyncify_stop_unwind,
        ruby_abi_version: exports32.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gb2312.so': {
        Init_gb2312: exports33.Init_gb2312,
        __wasm_apply_data_relocs: exports33.__wasm_apply_data_relocs,
        _initialize: exports33._initialize,
        asyncify_get_state: exports33.asyncify_get_state,
        asyncify_start_rewind: exports33.asyncify_start_rewind,
        asyncify_start_unwind: exports33.asyncify_start_unwind,
        asyncify_stop_rewind: exports33.asyncify_stop_rewind,
        asyncify_stop_unwind: exports33.asyncify_stop_unwind,
        ruby_abi_version: exports33.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/gbk.so': {
        Init_gbk: exports34.Init_gbk,
        __wasm_apply_data_relocs: exports34.__wasm_apply_data_relocs,
        _initialize: exports34._initialize,
        asyncify_get_state: exports34.asyncify_get_state,
        asyncify_start_rewind: exports34.asyncify_start_rewind,
        asyncify_start_unwind: exports34.asyncify_start_unwind,
        asyncify_stop_rewind: exports34.asyncify_stop_rewind,
        asyncify_stop_unwind: exports34.asyncify_stop_unwind,
        ruby_abi_version: exports34.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so': {
        Init_iso_8859_1: exports35.Init_iso_8859_1,
        __wasm_apply_data_relocs: exports35.__wasm_apply_data_relocs,
        _initialize: exports35._initialize,
        asyncify_get_state: exports35.asyncify_get_state,
        asyncify_start_rewind: exports35.asyncify_start_rewind,
        asyncify_start_unwind: exports35.asyncify_start_unwind,
        asyncify_stop_rewind: exports35.asyncify_stop_rewind,
        asyncify_stop_unwind: exports35.asyncify_stop_unwind,
        ruby_abi_version: exports35.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_10.so': {
        Init_iso_8859_10: exports36.Init_iso_8859_10,
        __wasm_apply_data_relocs: exports36.__wasm_apply_data_relocs,
        _initialize: exports36._initialize,
        asyncify_get_state: exports36.asyncify_get_state,
        asyncify_start_rewind: exports36.asyncify_start_rewind,
        asyncify_start_unwind: exports36.asyncify_start_unwind,
        asyncify_stop_rewind: exports36.asyncify_stop_rewind,
        asyncify_stop_unwind: exports36.asyncify_stop_unwind,
        ruby_abi_version: exports36.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_11.so': {
        Init_iso_8859_11: exports37.Init_iso_8859_11,
        __wasm_apply_data_relocs: exports37.__wasm_apply_data_relocs,
        _initialize: exports37._initialize,
        asyncify_get_state: exports37.asyncify_get_state,
        asyncify_start_rewind: exports37.asyncify_start_rewind,
        asyncify_start_unwind: exports37.asyncify_start_unwind,
        asyncify_stop_rewind: exports37.asyncify_stop_rewind,
        asyncify_stop_unwind: exports37.asyncify_stop_unwind,
        ruby_abi_version: exports37.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_13.so': {
        Init_iso_8859_13: exports38.Init_iso_8859_13,
        __wasm_apply_data_relocs: exports38.__wasm_apply_data_relocs,
        _initialize: exports38._initialize,
        asyncify_get_state: exports38.asyncify_get_state,
        asyncify_start_rewind: exports38.asyncify_start_rewind,
        asyncify_start_unwind: exports38.asyncify_start_unwind,
        asyncify_stop_rewind: exports38.asyncify_stop_rewind,
        asyncify_stop_unwind: exports38.asyncify_stop_unwind,
        ruby_abi_version: exports38.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_14.so': {
        Init_iso_8859_14: exports39.Init_iso_8859_14,
        __wasm_apply_data_relocs: exports39.__wasm_apply_data_relocs,
        _initialize: exports39._initialize,
        asyncify_get_state: exports39.asyncify_get_state,
        asyncify_start_rewind: exports39.asyncify_start_rewind,
        asyncify_start_unwind: exports39.asyncify_start_unwind,
        asyncify_stop_rewind: exports39.asyncify_stop_rewind,
        asyncify_stop_unwind: exports39.asyncify_stop_unwind,
        ruby_abi_version: exports39.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_15.so': {
        Init_iso_8859_15: exports40.Init_iso_8859_15,
        __wasm_apply_data_relocs: exports40.__wasm_apply_data_relocs,
        _initialize: exports40._initialize,
        asyncify_get_state: exports40.asyncify_get_state,
        asyncify_start_rewind: exports40.asyncify_start_rewind,
        asyncify_start_unwind: exports40.asyncify_start_unwind,
        asyncify_stop_rewind: exports40.asyncify_stop_rewind,
        asyncify_stop_unwind: exports40.asyncify_stop_unwind,
        ruby_abi_version: exports40.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_16.so': {
        Init_iso_8859_16: exports41.Init_iso_8859_16,
        __wasm_apply_data_relocs: exports41.__wasm_apply_data_relocs,
        _initialize: exports41._initialize,
        asyncify_get_state: exports41.asyncify_get_state,
        asyncify_start_rewind: exports41.asyncify_start_rewind,
        asyncify_start_unwind: exports41.asyncify_start_unwind,
        asyncify_stop_rewind: exports41.asyncify_stop_rewind,
        asyncify_stop_unwind: exports41.asyncify_stop_unwind,
        ruby_abi_version: exports41.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_2.so': {
        Init_iso_8859_2: exports42.Init_iso_8859_2,
        __wasm_apply_data_relocs: exports42.__wasm_apply_data_relocs,
        _initialize: exports42._initialize,
        asyncify_get_state: exports42.asyncify_get_state,
        asyncify_start_rewind: exports42.asyncify_start_rewind,
        asyncify_start_unwind: exports42.asyncify_start_unwind,
        asyncify_stop_rewind: exports42.asyncify_stop_rewind,
        asyncify_stop_unwind: exports42.asyncify_stop_unwind,
        ruby_abi_version: exports42.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_3.so': {
        Init_iso_8859_3: exports43.Init_iso_8859_3,
        __wasm_apply_data_relocs: exports43.__wasm_apply_data_relocs,
        _initialize: exports43._initialize,
        asyncify_get_state: exports43.asyncify_get_state,
        asyncify_start_rewind: exports43.asyncify_start_rewind,
        asyncify_start_unwind: exports43.asyncify_start_unwind,
        asyncify_stop_rewind: exports43.asyncify_stop_rewind,
        asyncify_stop_unwind: exports43.asyncify_stop_unwind,
        ruby_abi_version: exports43.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_4.so': {
        Init_iso_8859_4: exports44.Init_iso_8859_4,
        __wasm_apply_data_relocs: exports44.__wasm_apply_data_relocs,
        _initialize: exports44._initialize,
        asyncify_get_state: exports44.asyncify_get_state,
        asyncify_start_rewind: exports44.asyncify_start_rewind,
        asyncify_start_unwind: exports44.asyncify_start_unwind,
        asyncify_stop_rewind: exports44.asyncify_stop_rewind,
        asyncify_stop_unwind: exports44.asyncify_stop_unwind,
        ruby_abi_version: exports44.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_5.so': {
        Init_iso_8859_5: exports45.Init_iso_8859_5,
        __wasm_apply_data_relocs: exports45.__wasm_apply_data_relocs,
        _initialize: exports45._initialize,
        asyncify_get_state: exports45.asyncify_get_state,
        asyncify_start_rewind: exports45.asyncify_start_rewind,
        asyncify_start_unwind: exports45.asyncify_start_unwind,
        asyncify_stop_rewind: exports45.asyncify_stop_rewind,
        asyncify_stop_unwind: exports45.asyncify_stop_unwind,
        ruby_abi_version: exports45.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_6.so': {
        Init_iso_8859_6: exports46.Init_iso_8859_6,
        __wasm_apply_data_relocs: exports46.__wasm_apply_data_relocs,
        _initialize: exports46._initialize,
        asyncify_get_state: exports46.asyncify_get_state,
        asyncify_start_rewind: exports46.asyncify_start_rewind,
        asyncify_start_unwind: exports46.asyncify_start_unwind,
        asyncify_stop_rewind: exports46.asyncify_stop_rewind,
        asyncify_stop_unwind: exports46.asyncify_stop_unwind,
        ruby_abi_version: exports46.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_7.so': {
        Init_iso_8859_7: exports47.Init_iso_8859_7,
        __wasm_apply_data_relocs: exports47.__wasm_apply_data_relocs,
        _initialize: exports47._initialize,
        asyncify_get_state: exports47.asyncify_get_state,
        asyncify_start_rewind: exports47.asyncify_start_rewind,
        asyncify_start_unwind: exports47.asyncify_start_unwind,
        asyncify_stop_rewind: exports47.asyncify_stop_rewind,
        asyncify_stop_unwind: exports47.asyncify_stop_unwind,
        ruby_abi_version: exports47.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_8.so': {
        Init_iso_8859_8: exports48.Init_iso_8859_8,
        __wasm_apply_data_relocs: exports48.__wasm_apply_data_relocs,
        _initialize: exports48._initialize,
        asyncify_get_state: exports48.asyncify_get_state,
        asyncify_start_rewind: exports48.asyncify_start_rewind,
        asyncify_start_unwind: exports48.asyncify_start_unwind,
        asyncify_stop_rewind: exports48.asyncify_stop_rewind,
        asyncify_stop_unwind: exports48.asyncify_stop_unwind,
        ruby_abi_version: exports48.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_9.so': {
        Init_iso_8859_9: exports49.Init_iso_8859_9,
        __wasm_apply_data_relocs: exports49.__wasm_apply_data_relocs,
        _initialize: exports49._initialize,
        asyncify_get_state: exports49.asyncify_get_state,
        asyncify_start_rewind: exports49.asyncify_start_rewind,
        asyncify_start_unwind: exports49.asyncify_start_unwind,
        asyncify_stop_rewind: exports49.asyncify_stop_rewind,
        asyncify_stop_unwind: exports49.asyncify_stop_unwind,
        ruby_abi_version: exports49.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_r.so': {
        Init_koi8_r: exports50.Init_koi8_r,
        __wasm_apply_data_relocs: exports50.__wasm_apply_data_relocs,
        _initialize: exports50._initialize,
        asyncify_get_state: exports50.asyncify_get_state,
        asyncify_start_rewind: exports50.asyncify_start_rewind,
        asyncify_start_unwind: exports50.asyncify_start_unwind,
        asyncify_stop_rewind: exports50.asyncify_stop_rewind,
        asyncify_stop_unwind: exports50.asyncify_stop_unwind,
        ruby_abi_version: exports50.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/koi8_u.so': {
        Init_koi8_u: exports51.Init_koi8_u,
        __wasm_apply_data_relocs: exports51.__wasm_apply_data_relocs,
        _initialize: exports51._initialize,
        asyncify_get_state: exports51.asyncify_get_state,
        asyncify_start_rewind: exports51.asyncify_start_rewind,
        asyncify_start_unwind: exports51.asyncify_start_unwind,
        asyncify_stop_rewind: exports51.asyncify_stop_rewind,
        asyncify_stop_unwind: exports51.asyncify_stop_unwind,
        ruby_abi_version: exports51.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so': {
        Init_shift_jis: exports52.Init_shift_jis,
        __wasm_apply_data_relocs: exports52.__wasm_apply_data_relocs,
        _initialize: exports52._initialize,
        asyncify_get_state: exports52.asyncify_get_state,
        asyncify_start_rewind: exports52.asyncify_start_rewind,
        asyncify_start_unwind: exports52.asyncify_start_unwind,
        asyncify_stop_rewind: exports52.asyncify_stop_rewind,
        asyncify_stop_unwind: exports52.asyncify_stop_unwind,
        ruby_abi_version: exports52.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/big5.so': {
        Init_big5: exports53.Init_big5,
        __wasm_apply_data_relocs: exports53.__wasm_apply_data_relocs,
        _initialize: exports53._initialize,
        asyncify_get_state: exports53.asyncify_get_state,
        asyncify_start_rewind: exports53.asyncify_start_rewind,
        asyncify_start_unwind: exports53.asyncify_start_unwind,
        asyncify_stop_rewind: exports53.asyncify_stop_rewind,
        asyncify_stop_unwind: exports53.asyncify_stop_unwind,
        ruby_abi_version: exports53.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/cesu_8.so': {
        Init_cesu_8: exports54.Init_cesu_8,
        __wasm_apply_data_relocs: exports54.__wasm_apply_data_relocs,
        _initialize: exports54._initialize,
        asyncify_get_state: exports54.asyncify_get_state,
        asyncify_start_rewind: exports54.asyncify_start_rewind,
        asyncify_start_unwind: exports54.asyncify_start_unwind,
        asyncify_stop_rewind: exports54.asyncify_stop_rewind,
        asyncify_stop_unwind: exports54.asyncify_stop_unwind,
        ruby_abi_version: exports54.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/chinese.so': {
        Init_chinese: exports55.Init_chinese,
        __wasm_apply_data_relocs: exports55.__wasm_apply_data_relocs,
        _initialize: exports55._initialize,
        asyncify_get_state: exports55.asyncify_get_state,
        asyncify_start_rewind: exports55.asyncify_start_rewind,
        asyncify_start_unwind: exports55.asyncify_start_unwind,
        asyncify_stop_rewind: exports55.asyncify_stop_rewind,
        asyncify_stop_unwind: exports55.asyncify_stop_unwind,
        ruby_abi_version: exports55.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/ebcdic.so': {
        Init_ebcdic: exports56.Init_ebcdic,
        __wasm_apply_data_relocs: exports56.__wasm_apply_data_relocs,
        _initialize: exports56._initialize,
        asyncify_get_state: exports56.asyncify_get_state,
        asyncify_start_rewind: exports56.asyncify_start_rewind,
        asyncify_start_unwind: exports56.asyncify_start_unwind,
        asyncify_stop_rewind: exports56.asyncify_stop_rewind,
        asyncify_stop_unwind: exports56.asyncify_stop_unwind,
        ruby_abi_version: exports56.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji.so': {
        Init_emoji: exports57.Init_emoji,
        __wasm_apply_data_relocs: exports57.__wasm_apply_data_relocs,
        _initialize: exports57._initialize,
        asyncify_get_state: exports57.asyncify_get_state,
        asyncify_start_rewind: exports57.asyncify_start_rewind,
        asyncify_start_unwind: exports57.asyncify_start_unwind,
        asyncify_stop_rewind: exports57.asyncify_stop_rewind,
        asyncify_stop_unwind: exports57.asyncify_stop_unwind,
        ruby_abi_version: exports57.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji_iso2022_kddi.so': {
        Init_emoji_iso2022_kddi: exports58.Init_emoji_iso2022_kddi,
        __wasm_apply_data_relocs: exports58.__wasm_apply_data_relocs,
        _initialize: exports58._initialize,
        asyncify_get_state: exports58.asyncify_get_state,
        asyncify_start_rewind: exports58.asyncify_start_rewind,
        asyncify_start_unwind: exports58.asyncify_start_unwind,
        asyncify_stop_rewind: exports58.asyncify_stop_rewind,
        asyncify_stop_unwind: exports58.asyncify_stop_unwind,
        ruby_abi_version: exports58.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji_sjis_docomo.so': {
        Init_emoji_sjis_docomo: exports59.Init_emoji_sjis_docomo,
        __wasm_apply_data_relocs: exports59.__wasm_apply_data_relocs,
        _initialize: exports59._initialize,
        asyncify_get_state: exports59.asyncify_get_state,
        asyncify_start_rewind: exports59.asyncify_start_rewind,
        asyncify_start_unwind: exports59.asyncify_start_unwind,
        asyncify_stop_rewind: exports59.asyncify_stop_rewind,
        asyncify_stop_unwind: exports59.asyncify_stop_unwind,
        ruby_abi_version: exports59.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji_sjis_kddi.so': {
        Init_emoji_sjis_kddi: exports60.Init_emoji_sjis_kddi,
        __wasm_apply_data_relocs: exports60.__wasm_apply_data_relocs,
        _initialize: exports60._initialize,
        asyncify_get_state: exports60.asyncify_get_state,
        asyncify_start_rewind: exports60.asyncify_start_rewind,
        asyncify_start_unwind: exports60.asyncify_start_unwind,
        asyncify_stop_rewind: exports60.asyncify_stop_rewind,
        asyncify_stop_unwind: exports60.asyncify_stop_unwind,
        ruby_abi_version: exports60.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/emoji_sjis_softbank.so': {
        Init_emoji_sjis_softbank: exports61.Init_emoji_sjis_softbank,
        __wasm_apply_data_relocs: exports61.__wasm_apply_data_relocs,
        _initialize: exports61._initialize,
        asyncify_get_state: exports61.asyncify_get_state,
        asyncify_start_rewind: exports61.asyncify_start_rewind,
        asyncify_start_unwind: exports61.asyncify_start_unwind,
        asyncify_stop_rewind: exports61.asyncify_stop_rewind,
        asyncify_stop_unwind: exports61.asyncify_stop_unwind,
        ruby_abi_version: exports61.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/escape.so': {
        Init_escape: exports62.Init_escape,
        __wasm_apply_data_relocs: exports62.__wasm_apply_data_relocs,
        _initialize: exports62._initialize,
        asyncify_get_state: exports62.asyncify_get_state,
        asyncify_start_rewind: exports62.asyncify_start_rewind,
        asyncify_start_unwind: exports62.asyncify_start_unwind,
        asyncify_stop_rewind: exports62.asyncify_stop_rewind,
        asyncify_stop_unwind: exports62.asyncify_stop_unwind,
        ruby_abi_version: exports62.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/gb18030.so': {
        Init_gb18030: exports63.Init_gb18030,
        __wasm_apply_data_relocs: exports63.__wasm_apply_data_relocs,
        _initialize: exports63._initialize,
        asyncify_get_state: exports63.asyncify_get_state,
        asyncify_start_rewind: exports63.asyncify_start_rewind,
        asyncify_start_unwind: exports63.asyncify_start_unwind,
        asyncify_stop_rewind: exports63.asyncify_stop_rewind,
        asyncify_stop_unwind: exports63.asyncify_stop_unwind,
        ruby_abi_version: exports63.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/gbk.so': {
        Init_gbk: exports64.Init_gbk,
        __wasm_apply_data_relocs: exports64.__wasm_apply_data_relocs,
        _initialize: exports64._initialize,
        asyncify_get_state: exports64.asyncify_get_state,
        asyncify_start_rewind: exports64.asyncify_start_rewind,
        asyncify_start_unwind: exports64.asyncify_start_unwind,
        asyncify_stop_rewind: exports64.asyncify_stop_rewind,
        asyncify_stop_unwind: exports64.asyncify_stop_unwind,
        ruby_abi_version: exports64.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/iso2022.so': {
        Init_iso2022: exports65.Init_iso2022,
        __wasm_apply_data_relocs: exports65.__wasm_apply_data_relocs,
        _initialize: exports65._initialize,
        asyncify_get_state: exports65.asyncify_get_state,
        asyncify_start_rewind: exports65.asyncify_start_rewind,
        asyncify_start_unwind: exports65.asyncify_start_unwind,
        asyncify_stop_rewind: exports65.asyncify_stop_rewind,
        asyncify_stop_unwind: exports65.asyncify_stop_unwind,
        ruby_abi_version: exports65.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/japanese.so': {
        Init_japanese: exports66.Init_japanese,
        __wasm_apply_data_relocs: exports66.__wasm_apply_data_relocs,
        _initialize: exports66._initialize,
        asyncify_get_state: exports66.asyncify_get_state,
        asyncify_start_rewind: exports66.asyncify_start_rewind,
        asyncify_start_unwind: exports66.asyncify_start_unwind,
        asyncify_stop_rewind: exports66.asyncify_stop_rewind,
        asyncify_stop_unwind: exports66.asyncify_stop_unwind,
        ruby_abi_version: exports66.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/japanese_euc.so': {
        Init_japanese_euc: exports67.Init_japanese_euc,
        __wasm_apply_data_relocs: exports67.__wasm_apply_data_relocs,
        _initialize: exports67._initialize,
        asyncify_get_state: exports67.asyncify_get_state,
        asyncify_start_rewind: exports67.asyncify_start_rewind,
        asyncify_start_unwind: exports67.asyncify_start_unwind,
        asyncify_stop_rewind: exports67.asyncify_stop_rewind,
        asyncify_stop_unwind: exports67.asyncify_stop_unwind,
        ruby_abi_version: exports67.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/japanese_sjis.so': {
        Init_japanese_sjis: exports68.Init_japanese_sjis,
        __wasm_apply_data_relocs: exports68.__wasm_apply_data_relocs,
        _initialize: exports68._initialize,
        asyncify_get_state: exports68.asyncify_get_state,
        asyncify_start_rewind: exports68.asyncify_start_rewind,
        asyncify_start_unwind: exports68.asyncify_start_unwind,
        asyncify_stop_rewind: exports68.asyncify_stop_rewind,
        asyncify_stop_unwind: exports68.asyncify_stop_unwind,
        ruby_abi_version: exports68.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/korean.so': {
        Init_korean: exports69.Init_korean,
        __wasm_apply_data_relocs: exports69.__wasm_apply_data_relocs,
        _initialize: exports69._initialize,
        asyncify_get_state: exports69.asyncify_get_state,
        asyncify_start_rewind: exports69.asyncify_start_rewind,
        asyncify_start_unwind: exports69.asyncify_start_unwind,
        asyncify_stop_rewind: exports69.asyncify_stop_rewind,
        asyncify_stop_unwind: exports69.asyncify_stop_unwind,
        ruby_abi_version: exports69.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/single_byte.so': {
        Init_single_byte: exports70.Init_single_byte,
        __wasm_apply_data_relocs: exports70.__wasm_apply_data_relocs,
        _initialize: exports70._initialize,
        asyncify_get_state: exports70.asyncify_get_state,
        asyncify_start_rewind: exports70.asyncify_start_rewind,
        asyncify_start_unwind: exports70.asyncify_start_unwind,
        asyncify_stop_rewind: exports70.asyncify_stop_rewind,
        asyncify_stop_unwind: exports70.asyncify_stop_unwind,
        ruby_abi_version: exports70.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/transdb.so': {
        Init_transdb: exports71.Init_transdb,
        __wasm_apply_data_relocs: exports71.__wasm_apply_data_relocs,
        _initialize: exports71._initialize,
        asyncify_get_state: exports71.asyncify_get_state,
        asyncify_start_rewind: exports71.asyncify_start_rewind,
        asyncify_start_unwind: exports71.asyncify_start_unwind,
        asyncify_stop_rewind: exports71.asyncify_stop_rewind,
        asyncify_stop_unwind: exports71.asyncify_stop_unwind,
        ruby_abi_version: exports71.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/utf8_mac.so': {
        Init_utf8_mac: exports72.Init_utf8_mac,
        __wasm_apply_data_relocs: exports72.__wasm_apply_data_relocs,
        _initialize: exports72._initialize,
        asyncify_get_state: exports72.asyncify_get_state,
        asyncify_start_rewind: exports72.asyncify_start_rewind,
        asyncify_start_unwind: exports72.asyncify_start_unwind,
        asyncify_stop_rewind: exports72.asyncify_stop_rewind,
        asyncify_stop_unwind: exports72.asyncify_stop_unwind,
        ruby_abi_version: exports72.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/trans/utf_16_32.so': {
        Init_utf_16_32: exports73.Init_utf_16_32,
        __wasm_apply_data_relocs: exports73.__wasm_apply_data_relocs,
        _initialize: exports73._initialize,
        asyncify_get_state: exports73.asyncify_get_state,
        asyncify_start_rewind: exports73.asyncify_start_rewind,
        asyncify_start_unwind: exports73.asyncify_start_unwind,
        asyncify_stop_rewind: exports73.asyncify_stop_rewind,
        asyncify_stop_unwind: exports73.asyncify_stop_unwind,
        ruby_abi_version: exports73.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so': {
        Init_utf_16be: exports74.Init_utf_16be,
        __wasm_apply_data_relocs: exports74.__wasm_apply_data_relocs,
        _initialize: exports74._initialize,
        asyncify_get_state: exports74.asyncify_get_state,
        asyncify_start_rewind: exports74.asyncify_start_rewind,
        asyncify_start_unwind: exports74.asyncify_start_unwind,
        asyncify_stop_rewind: exports74.asyncify_stop_rewind,
        asyncify_stop_unwind: exports74.asyncify_stop_unwind,
        ruby_abi_version: exports74.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so': {
        Init_utf_16le: exports75.Init_utf_16le,
        __wasm_apply_data_relocs: exports75.__wasm_apply_data_relocs,
        _initialize: exports75._initialize,
        asyncify_get_state: exports75.asyncify_get_state,
        asyncify_start_rewind: exports75.asyncify_start_rewind,
        asyncify_start_unwind: exports75.asyncify_start_unwind,
        asyncify_stop_rewind: exports75.asyncify_stop_rewind,
        asyncify_stop_unwind: exports75.asyncify_stop_unwind,
        ruby_abi_version: exports75.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so': {
        Init_utf_32be: exports76.Init_utf_32be,
        __wasm_apply_data_relocs: exports76.__wasm_apply_data_relocs,
        _initialize: exports76._initialize,
        asyncify_get_state: exports76.asyncify_get_state,
        asyncify_start_rewind: exports76.asyncify_start_rewind,
        asyncify_start_unwind: exports76.asyncify_start_unwind,
        asyncify_stop_rewind: exports76.asyncify_stop_rewind,
        asyncify_stop_unwind: exports76.asyncify_stop_unwind,
        ruby_abi_version: exports76.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so': {
        Init_utf_32le: exports77.Init_utf_32le,
        __wasm_apply_data_relocs: exports77.__wasm_apply_data_relocs,
        _initialize: exports77._initialize,
        asyncify_get_state: exports77.asyncify_get_state,
        asyncify_start_rewind: exports77.asyncify_start_rewind,
        asyncify_start_unwind: exports77.asyncify_start_unwind,
        asyncify_stop_rewind: exports77.asyncify_stop_rewind,
        asyncify_stop_unwind: exports77.asyncify_stop_unwind,
        ruby_abi_version: exports77.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1250.so': {
        Init_windows_1250: exports78.Init_windows_1250,
        __wasm_apply_data_relocs: exports78.__wasm_apply_data_relocs,
        _initialize: exports78._initialize,
        asyncify_get_state: exports78.asyncify_get_state,
        asyncify_start_rewind: exports78.asyncify_start_rewind,
        asyncify_start_unwind: exports78.asyncify_start_unwind,
        asyncify_stop_rewind: exports78.asyncify_stop_rewind,
        asyncify_stop_unwind: exports78.asyncify_stop_unwind,
        ruby_abi_version: exports78.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1251.so': {
        Init_windows_1251: exports79.Init_windows_1251,
        __wasm_apply_data_relocs: exports79.__wasm_apply_data_relocs,
        _initialize: exports79._initialize,
        asyncify_get_state: exports79.asyncify_get_state,
        asyncify_start_rewind: exports79.asyncify_start_rewind,
        asyncify_start_unwind: exports79.asyncify_start_unwind,
        asyncify_stop_rewind: exports79.asyncify_stop_rewind,
        asyncify_stop_unwind: exports79.asyncify_stop_unwind,
        ruby_abi_version: exports79.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1252.so': {
        Init_windows_1252: exports80.Init_windows_1252,
        __wasm_apply_data_relocs: exports80.__wasm_apply_data_relocs,
        _initialize: exports80._initialize,
        asyncify_get_state: exports80.asyncify_get_state,
        asyncify_start_rewind: exports80.asyncify_start_rewind,
        asyncify_start_unwind: exports80.asyncify_start_unwind,
        asyncify_stop_rewind: exports80.asyncify_stop_rewind,
        asyncify_stop_unwind: exports80.asyncify_stop_unwind,
        ruby_abi_version: exports80.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1253.so': {
        Init_windows_1253: exports81.Init_windows_1253,
        __wasm_apply_data_relocs: exports81.__wasm_apply_data_relocs,
        _initialize: exports81._initialize,
        asyncify_get_state: exports81.asyncify_get_state,
        asyncify_start_rewind: exports81.asyncify_start_rewind,
        asyncify_start_unwind: exports81.asyncify_start_unwind,
        asyncify_stop_rewind: exports81.asyncify_stop_rewind,
        asyncify_stop_unwind: exports81.asyncify_stop_unwind,
        ruby_abi_version: exports81.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1254.so': {
        Init_windows_1254: exports82.Init_windows_1254,
        __wasm_apply_data_relocs: exports82.__wasm_apply_data_relocs,
        _initialize: exports82._initialize,
        asyncify_get_state: exports82.asyncify_get_state,
        asyncify_start_rewind: exports82.asyncify_start_rewind,
        asyncify_start_unwind: exports82.asyncify_start_unwind,
        asyncify_stop_rewind: exports82.asyncify_stop_rewind,
        asyncify_stop_unwind: exports82.asyncify_stop_unwind,
        ruby_abi_version: exports82.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_1257.so': {
        Init_windows_1257: exports83.Init_windows_1257,
        __wasm_apply_data_relocs: exports83.__wasm_apply_data_relocs,
        _initialize: exports83._initialize,
        asyncify_get_state: exports83.asyncify_get_state,
        asyncify_start_rewind: exports83.asyncify_start_rewind,
        asyncify_start_unwind: exports83.asyncify_start_unwind,
        asyncify_stop_rewind: exports83.asyncify_stop_rewind,
        asyncify_stop_unwind: exports83.asyncify_stop_unwind,
        ruby_abi_version: exports83.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so': {
        Init_windows_31j: exports84.Init_windows_31j,
        __wasm_apply_data_relocs: exports84.__wasm_apply_data_relocs,
        _initialize: exports84._initialize,
        asyncify_get_state: exports84.asyncify_get_state,
        asyncify_start_rewind: exports84.asyncify_start_rewind,
        asyncify_start_unwind: exports84.asyncify_start_unwind,
        asyncify_stop_rewind: exports84.asyncify_stop_rewind,
        asyncify_stop_unwind: exports84.asyncify_stop_unwind,
        ruby_abi_version: exports84.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/etc.so': {
        Init_etc: exports85.Init_etc,
        __wasm_apply_data_relocs: exports85.__wasm_apply_data_relocs,
        _initialize: exports85._initialize,
        asyncify_get_state: exports85.asyncify_get_state,
        asyncify_start_rewind: exports85.asyncify_start_rewind,
        asyncify_start_unwind: exports85.asyncify_start_unwind,
        asyncify_stop_rewind: exports85.asyncify_stop_rewind,
        asyncify_stop_unwind: exports85.asyncify_stop_unwind,
        ruby_abi_version: exports85.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/fcntl.so': {
        Init_fcntl: exports86.Init_fcntl,
        __wasm_apply_data_relocs: exports86.__wasm_apply_data_relocs,
        _initialize: exports86._initialize,
        asyncify_get_state: exports86.asyncify_get_state,
        asyncify_start_rewind: exports86.asyncify_start_rewind,
        asyncify_start_unwind: exports86.asyncify_start_unwind,
        asyncify_stop_rewind: exports86.asyncify_stop_rewind,
        asyncify_stop_unwind: exports86.asyncify_stop_unwind,
        ruby_abi_version: exports86.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so': {
        Init_generator: exports87.Init_generator,
        __wasm_apply_data_relocs: exports87.__wasm_apply_data_relocs,
        _initialize: exports87._initialize,
        asyncify_get_state: exports87.asyncify_get_state,
        asyncify_start_rewind: exports87.asyncify_start_rewind,
        asyncify_start_unwind: exports87.asyncify_start_unwind,
        asyncify_stop_rewind: exports87.asyncify_stop_rewind,
        asyncify_stop_unwind: exports87.asyncify_stop_unwind,
        ruby_abi_version: exports87.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/parser.so': {
        Init_parser: exports88.Init_parser,
        __wasm_apply_data_relocs: exports88.__wasm_apply_data_relocs,
        _initialize: exports88._initialize,
        asyncify_get_state: exports88.asyncify_get_state,
        asyncify_start_rewind: exports88.asyncify_start_rewind,
        asyncify_start_unwind: exports88.asyncify_start_unwind,
        asyncify_stop_rewind: exports88.asyncify_stop_rewind,
        asyncify_stop_unwind: exports88.asyncify_stop_unwind,
        ruby_abi_version: exports88.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/monitor.so': {
        Init_monitor: exports89.Init_monitor,
        __wasm_apply_data_relocs: exports89.__wasm_apply_data_relocs,
        _initialize: exports89._initialize,
        asyncify_get_state: exports89.asyncify_get_state,
        asyncify_start_rewind: exports89.asyncify_start_rewind,
        asyncify_start_unwind: exports89.asyncify_start_unwind,
        asyncify_stop_rewind: exports89.asyncify_stop_rewind,
        asyncify_stop_unwind: exports89.asyncify_stop_unwind,
        ruby_abi_version: exports89.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so': {
        Init_object_tracing: exports90.Init_object_tracing,
        Init_objspace: exports90.Init_objspace,
        Init_objspace_dump: exports90.Init_objspace_dump,
        __wasm_apply_data_relocs: exports90.__wasm_apply_data_relocs,
        _initialize: exports90._initialize,
        asyncify_get_state: exports90.asyncify_get_state,
        asyncify_start_rewind: exports90.asyncify_start_rewind,
        asyncify_start_unwind: exports90.asyncify_start_unwind,
        asyncify_stop_rewind: exports90.asyncify_stop_rewind,
        asyncify_stop_unwind: exports90.asyncify_stop_unwind,
        objspace_lookup_allocation_info: exports90.objspace_lookup_allocation_info,
        ruby_abi_version: exports90.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so': {
        DupPKeyPtr: exports91.DupPKeyPtr,
        DupX509CertPtr: exports91.DupX509CertPtr,
        DupX509RevokedPtr: exports91.DupX509RevokedPtr,
        GetConfig: exports91.GetConfig,
        GetPKeyPtr: exports91.GetPKeyPtr,
        GetPrivPKeyPtr: exports91.GetPrivPKeyPtr,
        GetX509AttrPtr: exports91.GetX509AttrPtr,
        GetX509CRLPtr: exports91.GetX509CRLPtr,
        GetX509CertPtr: exports91.GetX509CertPtr,
        GetX509ExtPtr: exports91.GetX509ExtPtr,
        GetX509NamePtr: exports91.GetX509NamePtr,
        GetX509ReqPtr: exports91.GetX509ReqPtr,
        GetX509StorePtr: exports91.GetX509StorePtr,
        Init_openssl: exports91.Init_openssl,
        Init_ossl_asn1: exports91.Init_ossl_asn1,
        Init_ossl_bn: exports91.Init_ossl_bn,
        Init_ossl_cipher: exports91.Init_ossl_cipher,
        Init_ossl_config: exports91.Init_ossl_config,
        Init_ossl_dh: exports91.Init_ossl_dh,
        Init_ossl_digest: exports91.Init_ossl_digest,
        Init_ossl_dsa: exports91.Init_ossl_dsa,
        Init_ossl_ec: exports91.Init_ossl_ec,
        Init_ossl_engine: exports91.Init_ossl_engine,
        Init_ossl_hmac: exports91.Init_ossl_hmac,
        Init_ossl_kdf: exports91.Init_ossl_kdf,
        Init_ossl_ns_spki: exports91.Init_ossl_ns_spki,
        Init_ossl_ocsp: exports91.Init_ossl_ocsp,
        Init_ossl_pkcs12: exports91.Init_ossl_pkcs12,
        Init_ossl_pkcs7: exports91.Init_ossl_pkcs7,
        Init_ossl_pkey: exports91.Init_ossl_pkey,
        Init_ossl_provider: exports91.Init_ossl_provider,
        Init_ossl_rand: exports91.Init_ossl_rand,
        Init_ossl_rsa: exports91.Init_ossl_rsa,
        Init_ossl_ssl: exports91.Init_ossl_ssl,
        Init_ossl_ssl_session: exports91.Init_ossl_ssl_session,
        Init_ossl_ts: exports91.Init_ossl_ts,
        Init_ossl_x509: exports91.Init_ossl_x509,
        Init_ossl_x509attr: exports91.Init_ossl_x509attr,
        Init_ossl_x509cert: exports91.Init_ossl_x509cert,
        Init_ossl_x509crl: exports91.Init_ossl_x509crl,
        Init_ossl_x509ext: exports91.Init_ossl_x509ext,
        Init_ossl_x509name: exports91.Init_ossl_x509name,
        Init_ossl_x509req: exports91.Init_ossl_x509req,
        Init_ossl_x509revoked: exports91.Init_ossl_x509revoked,
        Init_ossl_x509store: exports91.Init_ossl_x509store,
        __wasm_apply_data_relocs: exports91.__wasm_apply_data_relocs,
        _initialize: exports91._initialize,
        asn1integer_to_num: exports91.asn1integer_to_num,
        asn1str_to_str: exports91.asn1str_to_str,
        asn1time_to_time: exports91.asn1time_to_time,
        asyncify_get_state: exports91.asyncify_get_state,
        asyncify_start_rewind: exports91.asyncify_start_rewind,
        asyncify_start_unwind: exports91.asyncify_start_unwind,
        asyncify_stop_rewind: exports91.asyncify_stop_rewind,
        asyncify_stop_unwind: exports91.asyncify_stop_unwind,
        cASN1Data: exports91.cASN1Data,
        cBN: exports91.cBN,
        cDH: exports91.cDH,
        cDSA: exports91.cDSA,
        cEC: exports91.cEC,
        cPKey: exports91.cPKey,
        cRSA: exports91.cRSA,
        cX509Attr: exports91.cX509Attr,
        cX509Cert: exports91.cX509Cert,
        cX509Ext: exports91.cX509Ext,
        cX509Rev: exports91.cX509Rev,
        dOSSL: exports91.dOSSL,
        eASN1Error: exports91.eASN1Error,
        eOSSLError: exports91.eOSSLError,
        ePKeyError: exports91.ePKeyError,
        mASN1: exports91.mASN1,
        mOSSL: exports91.mOSSL,
        mPKey: exports91.mPKey,
        mX509: exports91.mX509,
        num_to_asn1integer: exports91.num_to_asn1integer,
        ossl_bin2hex: exports91.ossl_bin2hex,
        ossl_bn_ctx_get: exports91.ossl_bn_ctx_get,
        ossl_bn_new: exports91.ossl_bn_new,
        ossl_bn_value_ptr: exports91.ossl_bn_value_ptr,
        ossl_buf2str: exports91.ossl_buf2str,
        ossl_cipher_new: exports91.ossl_cipher_new,
        ossl_clear_error: exports91.ossl_clear_error,
        ossl_digest_new: exports91.ossl_digest_new,
        ossl_evp_get_cipherbyname: exports91.ossl_evp_get_cipherbyname,
        ossl_evp_get_digestbyname: exports91.ossl_evp_get_digestbyname,
        ossl_evp_pkey_type: exports91.ossl_evp_pkey_type,
        ossl_make_error: exports91.ossl_make_error,
        ossl_membio2str: exports91.ossl_membio2str,
        ossl_obj2bio: exports91.ossl_obj2bio,
        ossl_pem_passwd_cb: exports91.ossl_pem_passwd_cb,
        ossl_pem_passwd_value: exports91.ossl_pem_passwd_value,
        ossl_pkcs7_new: exports91.ossl_pkcs7_new,
        ossl_pkey_check_public_key: exports91.ossl_pkey_check_public_key,
        ossl_pkey_export_spki: exports91.ossl_pkey_export_spki,
        ossl_pkey_export_traditional: exports91.ossl_pkey_export_traditional,
        ossl_pkey_read_generic: exports91.ossl_pkey_read_generic,
        ossl_pkey_wrap: exports91.ossl_pkey_wrap,
        ossl_protect_x509_ary2sk: exports91.ossl_protect_x509_ary2sk,
        ossl_raise: exports91.ossl_raise,
        ossl_str_new: exports91.ossl_str_new,
        ossl_time_split: exports91.ossl_time_split,
        ossl_to_der: exports91.ossl_to_der,
        ossl_to_der_if_possible: exports91.ossl_to_der_if_possible,
        ossl_verify_cb_call: exports91.ossl_verify_cb_call,
        ossl_x509_ary2sk: exports91.ossl_x509_ary2sk,
        ossl_x509_ary2sk0: exports91.ossl_x509_ary2sk0,
        ossl_x509_new: exports91.ossl_x509_new,
        ossl_x509_sk2ary: exports91.ossl_x509_sk2ary,
        ossl_x509_time_adjust: exports91.ossl_x509_time_adjust,
        ossl_x509attr_new: exports91.ossl_x509attr_new,
        ossl_x509crl_new: exports91.ossl_x509crl_new,
        ossl_x509crl_sk2ary: exports91.ossl_x509crl_sk2ary,
        ossl_x509ext_new: exports91.ossl_x509ext_new,
        ossl_x509name_new: exports91.ossl_x509name_new,
        ossl_x509name_sk2ary: exports91.ossl_x509name_sk2ary,
        ossl_x509revoked_new: exports91.ossl_x509revoked_new,
        ruby_abi_version: exports91.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so': {
        Init_psych: exports92.Init_psych,
        Init_psych_emitter: exports92.Init_psych_emitter,
        Init_psych_parser: exports92.Init_psych_parser,
        Init_psych_to_ruby: exports92.Init_psych_to_ruby,
        Init_psych_yaml_tree: exports92.Init_psych_yaml_tree,
        __wasm_apply_data_relocs: exports92.__wasm_apply_data_relocs,
        _initialize: exports92._initialize,
        asyncify_get_state: exports92.asyncify_get_state,
        asyncify_start_rewind: exports92.asyncify_start_rewind,
        asyncify_start_unwind: exports92.asyncify_start_unwind,
        asyncify_stop_rewind: exports92.asyncify_stop_rewind,
        asyncify_stop_unwind: exports92.asyncify_stop_unwind,
        cPsychEmitter: exports92.cPsychEmitter,
        cPsychParser: exports92.cPsychParser,
        cPsychVisitorsToRuby: exports92.cPsychVisitorsToRuby,
        cPsychVisitorsYamlTree: exports92.cPsychVisitorsYamlTree,
        mPsych: exports92.mPsych,
        ruby_abi_version: exports92.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/rbconfig/sizeof.so': {
        Init_limits: exports93.Init_limits,
        Init_sizeof: exports93.Init_sizeof,
        __wasm_apply_data_relocs: exports93.__wasm_apply_data_relocs,
        _initialize: exports93._initialize,
        asyncify_get_state: exports93.asyncify_get_state,
        asyncify_start_rewind: exports93.asyncify_start_rewind,
        asyncify_start_unwind: exports93.asyncify_start_unwind,
        asyncify_stop_rewind: exports93.asyncify_stop_rewind,
        asyncify_stop_unwind: exports93.asyncify_stop_unwind,
        ruby_abi_version: exports93.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so': {
        InitVM_ripper: exports94.InitVM_ripper,
        Init_ripper: exports94.Init_ripper,
        __wasm_apply_data_relocs: exports94.__wasm_apply_data_relocs,
        _initialize: exports94._initialize,
        asyncify_get_state: exports94.asyncify_get_state,
        asyncify_start_rewind: exports94.asyncify_start_rewind,
        asyncify_start_unwind: exports94.asyncify_start_unwind,
        asyncify_stop_rewind: exports94.asyncify_stop_rewind,
        asyncify_stop_unwind: exports94.asyncify_stop_unwind,
        id_assoc: exports94.id_assoc,
        id_gets: exports94.id_gets,
        id_warn: exports94.id_warn,
        id_warning: exports94.id_warning,
        rb_ruby_parser_debug_output: exports94.rb_ruby_parser_debug_output,
        rb_ruby_parser_enc: exports94.rb_ruby_parser_enc,
        rb_ruby_parser_error_p: exports94.rb_ruby_parser_error_p,
        rb_ruby_parser_get_yydebug: exports94.rb_ruby_parser_get_yydebug,
        rb_ruby_parser_lex_state: exports94.rb_ruby_parser_lex_state,
        rb_ruby_parser_parsing_thread: exports94.rb_ruby_parser_parsing_thread,
        rb_ruby_parser_result: exports94.rb_ruby_parser_result,
        rb_ruby_parser_ripper_initialize: exports94.rb_ruby_parser_ripper_initialize,
        rb_ruby_parser_ruby_sourcefile_string: exports94.rb_ruby_parser_ruby_sourcefile_string,
        rb_ruby_parser_ruby_sourceline: exports94.rb_ruby_parser_ruby_sourceline,
        rb_ruby_parser_set_debug_output: exports94.rb_ruby_parser_set_debug_output,
        rb_ruby_parser_set_parsing_thread: exports94.rb_ruby_parser_set_parsing_thread,
        rb_ruby_parser_set_value: exports94.rb_ruby_parser_set_value,
        rb_ruby_ripper_column: exports94.rb_ruby_ripper_column,
        rb_ruby_ripper_dedent_string: exports94.rb_ruby_ripper_dedent_string,
        rb_ruby_ripper_initialized_p: exports94.rb_ruby_ripper_initialized_p,
        rb_ruby_ripper_lex_lastline: exports94.rb_ruby_ripper_lex_lastline,
        rb_ruby_ripper_lex_state_name: exports94.rb_ruby_ripper_lex_state_name,
        rb_ruby_ripper_parse0: exports94.rb_ruby_ripper_parse0,
        rb_ruby_ripper_parser_allocate: exports94.rb_ruby_ripper_parser_allocate,
        rb_ruby_ripper_parser_initialize: exports94.rb_ruby_ripper_parser_initialize,
        rb_ruby_ripper_token_len: exports94.rb_ruby_ripper_token_len,
        ripper_compile_error: exports94.ripper_compile_error,
        ripper_error: exports94.ripper_error,
        ripper_init_eventids1: exports94.ripper_init_eventids1,
        ripper_init_eventids1_table: exports94.ripper_init_eventids1_table,
        ripper_init_eventids2: exports94.ripper_init_eventids2,
        ripper_init_eventids2_table: exports94.ripper_init_eventids2_table,
        ripper_parser_free: exports94.ripper_parser_free,
        ripper_parser_ids: exports94.ripper_parser_ids,
        ripper_parser_mark: exports94.ripper_parser_mark,
        ripper_parser_memsize: exports94.ripper_parser_memsize,
        ripper_token2eventid: exports94.ripper_token2eventid,
        ripper_value: exports94.ripper_value,
        ripper_yyparse: exports94.ripper_yyparse,
        ruby_abi_version: exports94.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so': {
        Init_stringio: exports95.Init_stringio,
        __wasm_apply_data_relocs: exports95.__wasm_apply_data_relocs,
        _initialize: exports95._initialize,
        asyncify_get_state: exports95.asyncify_get_state,
        asyncify_start_rewind: exports95.asyncify_start_rewind,
        asyncify_start_unwind: exports95.asyncify_start_unwind,
        asyncify_stop_rewind: exports95.asyncify_stop_rewind,
        asyncify_stop_unwind: exports95.asyncify_stop_unwind,
        ruby_abi_version: exports95.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so': {
        Init_strscan: exports96.Init_strscan,
        __wasm_apply_data_relocs: exports96.__wasm_apply_data_relocs,
        _initialize: exports96._initialize,
        asyncify_get_state: exports96.asyncify_get_state,
        asyncify_start_rewind: exports96.asyncify_start_rewind,
        asyncify_start_unwind: exports96.asyncify_start_unwind,
        asyncify_stop_rewind: exports96.asyncify_stop_rewind,
        asyncify_stop_unwind: exports96.asyncify_stop_unwind,
        ruby_abi_version: exports96.ruby_abi_version,
      },
      '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so': {
        Init_zlib: exports97.Init_zlib,
        __wasm_apply_data_relocs: exports97.__wasm_apply_data_relocs,
        _initialize: exports97._initialize,
        asyncify_get_state: exports97.asyncify_get_state,
        asyncify_start_rewind: exports97.asyncify_start_rewind,
        asyncify_start_unwind: exports97.asyncify_start_unwind,
        asyncify_stop_rewind: exports97.asyncify_stop_rewind,
        asyncify_stop_unwind: exports97.asyncify_stop_unwind,
        ruby_abi_version: exports97.ruby_abi_version,
      },
      env: {
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_asyncify_unwind_buf': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_asyncify_unwind_buf'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cBasicObject': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cBasicObject'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cFalseClass': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cFalseClass'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cFloat': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cFloat'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cInteger': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cInteger'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cObject': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cObject'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cProc': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cProc'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cString': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cString'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cTrueClass': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_cTrueClass'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_eArgError': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_eArgError'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_eStandardError': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_eStandardError'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_eTypeError': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_eTypeError'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_mKernel': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:rb_mKernel'],
        '/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:stderr': exports4['/bundle/ruby/3.5.0+4/extensions/wasm32-wasi/3.5.0+4-static/js-2.7.2/js.so:stderr'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cFalseClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cFalseClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cInteger': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cInteger'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cNilClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cNilClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cSymbol': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cSymbol'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cTrueClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:rb_cTrueClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:ruby_digit36_to_number_table': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:ruby_digit36_to_number_table'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:ruby_hexdigits': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/cgi/escape.so:ruby_hexdigits'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/coverage.so:rb_eRuntimeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/coverage.so:rb_eRuntimeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:_CLOCK_REALTIME': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:_CLOCK_REALTIME'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cFalseClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cFalseClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cInteger': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cInteger'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cNilClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cNilClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cNumeric': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cNumeric'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cRational': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cRational'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cSymbol': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cSymbol'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cTime': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cTime'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cTrueClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_cTrueClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_eArgError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_eArgError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_eTypeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_eTypeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_mComparable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/date_core.so:rb_mComparable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eArgError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eArgError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eNotImpError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eNotImpError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eRuntimeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eRuntimeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eTypeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest.so:rb_eTypeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/bubblebabble.so:rb_eRuntimeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/bubblebabble.so:rb_eRuntimeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/md5.so:rb_eLoadError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/md5.so:rb_eLoadError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/rmd160.so:rb_eLoadError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/rmd160.so:rb_eLoadError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha1.so:rb_eLoadError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha1.so:rb_eLoadError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_eLoadError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/digest/sha2.so:rb_eLoadError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:OnigEncAsciiToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/cesu_8.so:OnigEncAsciiToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:OnigEncAsciiCtypeTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:OnigEncAsciiCtypeTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:OnigEncAsciiToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/emacs_mule.so:OnigEncAsciiToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:OnigEncAsciiCtypeTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:OnigEncAsciiCtypeTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:OnigEncAsciiToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:OnigEncAsciiToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:OnigEncodingASCII': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/euc_jp.so:OnigEncodingASCII'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:OnigEncISO_8859_1_ToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/iso_8859_1.so:OnigEncISO_8859_1_ToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:OnigEncAsciiCtypeTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:OnigEncAsciiCtypeTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:OnigEncAsciiToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:OnigEncAsciiToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:OnigEncodingASCII': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/shift_jis.so:OnigEncodingASCII'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:OnigEncAsciiToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16be.so:OnigEncAsciiToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:OnigEncAsciiToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_16le.so:OnigEncAsciiToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:OnigEncAsciiToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32be.so:OnigEncAsciiToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:OnigEncAsciiToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/utf_32le.so:OnigEncAsciiToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:OnigEncAsciiCtypeTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:OnigEncAsciiCtypeTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:OnigEncAsciiToLowerCaseTable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:OnigEncAsciiToLowerCaseTable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:OnigEncodingASCII': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/enc/windows_31j.so:OnigEncodingASCII'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/etc.so:rb_cIO': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/etc.so:rb_cIO'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/etc.so:rb_mEnumerable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/etc.so:rb_mEnumerable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cArray': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cArray'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cFalseClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cFalseClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cFloat': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cFloat'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cHash': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cHash'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cInteger': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cInteger'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cNilClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cNilClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cString': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cString'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cSymbol': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cSymbol'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cTrueClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_cTrueClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_eArgError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_eArgError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_eTypeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/generator.so:rb_eTypeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/parser.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/parser.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/parser.so:rb_mKernel': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/json/ext/parser.so:rb_mKernel'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/monitor.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/monitor.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/monitor.so:rb_eThreadError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/monitor.so:rb_eThreadError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cFalseClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cFalseClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cInteger': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cInteger'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cNilClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cNilClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cSymbol': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cSymbol'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cTrueClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_cTrueClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eArgError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eArgError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eIOError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eIOError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eRuntimeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eRuntimeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eTypeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_eTypeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_shape_tree': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:rb_shape_tree'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:ruby_hexdigits': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/objspace.so:ruby_hexdigits'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:_CLOCK_REALTIME': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:_CLOCK_REALTIME'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cASN1Data': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cASN1Data'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cBN': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cBN'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cDH': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cDH'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cDSA': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cDSA'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cEC': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cEC'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cPKey': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cPKey'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cRSA': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cRSA'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Attr': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Attr'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Cert': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Cert'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Ext': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Ext'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Rev': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:cX509Rev'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:dOSSL': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:dOSSL'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:eASN1Error': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:eASN1Error'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:eOSSLError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:eOSSLError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:ePKeyError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:ePKeyError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:errno': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:errno'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mASN1': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mASN1'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mOSSL': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mOSSL'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mPKey': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mPKey'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mX509': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:mX509'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:memory_base': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:memory_base'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:ossl_evp_pkey_type': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:ossl_evp_pkey_type'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cArray': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cArray'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cFalseClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cFalseClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cInteger': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cInteger'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cNilClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cNilClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cSymbol': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cSymbol'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cTime': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cTime'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cTrueClass': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_cTrueClass'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eArgError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eArgError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eNotImpError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eNotImpError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eRangeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eRangeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eRuntimeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eRuntimeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eStandardError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eStandardError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eTypeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_eTypeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_mComparable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_mComparable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_mEnumerable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:rb_mEnumerable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:stderr': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/openssl.so:stderr'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychEmitter': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychEmitter'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychParser': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychParser'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychVisitorsToRuby': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychVisitorsToRuby'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychVisitorsYamlTree': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:cPsychVisitorsYamlTree'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:mPsych': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:mPsych'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:memory_base': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:memory_base'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:rb_eNoMemError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:rb_eNoMemError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:rb_eRuntimeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/psych.so:rb_eRuntimeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_assoc': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_assoc'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_gets': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_gets'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_warn': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_warn'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_warning': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:id_warning'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:memory_base': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:memory_base'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_eArgError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_eArgError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_eRuntimeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_eRuntimeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_eTypeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:rb_eTypeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:ripper_parser_ids': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:ripper_parser_ids'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:ruby_global_name_punct_bits': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/ripper.so:ruby_global_name_punct_bits'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_cIO': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_cIO'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_eArgError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_eArgError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_eIOError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_eIOError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_mEnumerable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_mEnumerable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_rs': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/stringio.so:rb_rs'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eArgError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eArgError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eIndexError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eIndexError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eRangeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eRangeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eStandardError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/strscan.so:rb_eStandardError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_cIO': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_cIO'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_cObject': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_cObject'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_cString': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_cString'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eArgError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eArgError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eEOFError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eEOFError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eIOError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eIOError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eNoMethodError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eNoMethodError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eRuntimeError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eRuntimeError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eStandardError': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_eStandardError'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_mEnumerable': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_mEnumerable'],
        '/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_rs': exports4['/usr/local/lib/ruby/3.5.0+4/wasm32-wasi/zlib.so:rb_rs'],
        __indirect_function_table: exports4.__indirect_function_table,
        'libc.so:_CLOCK_REALTIME': exports4['libc.so:_CLOCK_REALTIME'],
        'libc.so:__optpos': exports4['libc.so:__optpos'],
        'libc.so:__optreset': exports4['libc.so:__optreset'],
        'libc.so:__signgam': exports4['libc.so:__signgam'],
        'libc.so:__stack_chk_guard': exports4['libc.so:__stack_chk_guard'],
        'libc.so:__wasilibc_cwd': exports4['libc.so:__wasilibc_cwd'],
        'libc.so:__wasilibc_environ': exports4['libc.so:__wasilibc_environ'],
        'libc.so:errno': exports4['libc.so:errno'],
        'libc.so:getdate_err': exports4['libc.so:getdate_err'],
        'libc.so:memory_base': exports4['libc.so:memory_base'],
        'libc.so:optarg': exports4['libc.so:optarg'],
        'libc.so:opterr': exports4['libc.so:opterr'],
        'libc.so:optind': exports4['libc.so:optind'],
        'libc.so:optopt': exports4['libc.so:optopt'],
        'libwasi-emulated-mman.so:errno': exports4['libwasi-emulated-mman.so:errno'],
        'libwasi-emulated-process-clocks.so:errno': exports4['libwasi-emulated-process-clocks.so:errno'],
        'libwasi-emulated-signal.so:errno': exports4['libwasi-emulated-signal.so:errno'],
        'libwasi-emulated-signal.so:stderr': exports4['libwasi-emulated-signal.so:stderr'],
        memory: exports4.memory,
        'ruby:OnigDefaultCaseFoldFlag': exports4['ruby:OnigDefaultCaseFoldFlag'],
        'ruby:OnigDefaultSyntax': exports4['ruby:OnigDefaultSyntax'],
        'ruby:OnigEncAsciiCtypeTable': exports4['ruby:OnigEncAsciiCtypeTable'],
        'ruby:OnigEncAsciiToLowerCaseTable': exports4['ruby:OnigEncAsciiToLowerCaseTable'],
        'ruby:OnigEncAsciiToUpperCaseTable': exports4['ruby:OnigEncAsciiToUpperCaseTable'],
        'ruby:OnigEncDefaultCharEncoding': exports4['ruby:OnigEncDefaultCharEncoding'],
        'ruby:OnigEncodingASCII': exports4['ruby:OnigEncodingASCII'],
        'ruby:OnigSyntaxRuby': exports4['ruby:OnigSyntaxRuby'],
        'ruby:RUBY_IO_BUFFER_DEFAULT_SIZE': exports4['ruby:RUBY_IO_BUFFER_DEFAULT_SIZE'],
        'ruby:RUBY_IO_BUFFER_PAGE_SIZE': exports4['ruby:RUBY_IO_BUFFER_PAGE_SIZE'],
        'ruby:_CLOCK_MONOTONIC': exports4['ruby:_CLOCK_MONOTONIC'],
        'ruby:_CLOCK_REALTIME': exports4['ruby:_CLOCK_REALTIME'],
        'ruby:environ': exports4['ruby:environ'],
        'ruby:errno': exports4['ruby:errno'],
        'ruby:memory_base': exports4['ruby:memory_base'],
        'ruby:rb_argv0': exports4['ruby:rb_argv0'],
        'ruby:rb_block_param_proxy': exports4['ruby:rb_block_param_proxy'],
        'ruby:rb_cArray': exports4['ruby:rb_cArray'],
        'ruby:rb_cBasicObject': exports4['ruby:rb_cBasicObject'],
        'ruby:rb_cBinding': exports4['ruby:rb_cBinding'],
        'ruby:rb_cClass': exports4['ruby:rb_cClass'],
        'ruby:rb_cComplex': exports4['ruby:rb_cComplex'],
        'ruby:rb_cDir': exports4['ruby:rb_cDir'],
        'ruby:rb_cEncoding': exports4['ruby:rb_cEncoding'],
        'ruby:rb_cEnumerator': exports4['ruby:rb_cEnumerator'],
        'ruby:rb_cFalseClass': exports4['ruby:rb_cFalseClass'],
        'ruby:rb_cFile': exports4['ruby:rb_cFile'],
        'ruby:rb_cFloat': exports4['ruby:rb_cFloat'],
        'ruby:rb_cHash': exports4['ruby:rb_cHash'],
        'ruby:rb_cIO': exports4['ruby:rb_cIO'],
        'ruby:rb_cIOBuffer': exports4['ruby:rb_cIOBuffer'],
        'ruby:rb_cISeq': exports4['ruby:rb_cISeq'],
        'ruby:rb_cInteger': exports4['ruby:rb_cInteger'],
        'ruby:rb_cMatch': exports4['ruby:rb_cMatch'],
        'ruby:rb_cMethod': exports4['ruby:rb_cMethod'],
        'ruby:rb_cModule': exports4['ruby:rb_cModule'],
        'ruby:rb_cNameErrorMesg': exports4['ruby:rb_cNameErrorMesg'],
        'ruby:rb_cNamespace': exports4['ruby:rb_cNamespace'],
        'ruby:rb_cNilClass': exports4['ruby:rb_cNilClass'],
        'ruby:rb_cNumeric': exports4['ruby:rb_cNumeric'],
        'ruby:rb_cObject': exports4['ruby:rb_cObject'],
        'ruby:rb_cProc': exports4['ruby:rb_cProc'],
        'ruby:rb_cRactor': exports4['ruby:rb_cRactor'],
        'ruby:rb_cRandom': exports4['ruby:rb_cRandom'],
        'ruby:rb_cRange': exports4['ruby:rb_cRange'],
        'ruby:rb_cRational': exports4['ruby:rb_cRational'],
        'ruby:rb_cRefinement': exports4['ruby:rb_cRefinement'],
        'ruby:rb_cRegexp': exports4['ruby:rb_cRegexp'],
        'ruby:rb_cRubyVM': exports4['ruby:rb_cRubyVM'],
        'ruby:rb_cSet': exports4['ruby:rb_cSet'],
        'ruby:rb_cStat': exports4['ruby:rb_cStat'],
        'ruby:rb_cString': exports4['ruby:rb_cString'],
        'ruby:rb_cStruct': exports4['ruby:rb_cStruct'],
        'ruby:rb_cSymbol': exports4['ruby:rb_cSymbol'],
        'ruby:rb_cThread': exports4['ruby:rb_cThread'],
        'ruby:rb_cTime': exports4['ruby:rb_cTime'],
        'ruby:rb_cTrueClass': exports4['ruby:rb_cTrueClass'],
        'ruby:rb_cUnboundMethod': exports4['ruby:rb_cUnboundMethod'],
        'ruby:rb_default_rs': exports4['ruby:rb_default_rs'],
        'ruby:rb_eArgError': exports4['ruby:rb_eArgError'],
        'ruby:rb_eEOFError': exports4['ruby:rb_eEOFError'],
        'ruby:rb_eEncCompatError': exports4['ruby:rb_eEncCompatError'],
        'ruby:rb_eEncodingError': exports4['ruby:rb_eEncodingError'],
        'ruby:rb_eException': exports4['ruby:rb_eException'],
        'ruby:rb_eFatal': exports4['ruby:rb_eFatal'],
        'ruby:rb_eFloatDomainError': exports4['ruby:rb_eFloatDomainError'],
        'ruby:rb_eFrozenError': exports4['ruby:rb_eFrozenError'],
        'ruby:rb_eIOError': exports4['ruby:rb_eIOError'],
        'ruby:rb_eIOTimeoutError': exports4['ruby:rb_eIOTimeoutError'],
        'ruby:rb_eIndexError': exports4['ruby:rb_eIndexError'],
        'ruby:rb_eInterrupt': exports4['ruby:rb_eInterrupt'],
        'ruby:rb_eKeyError': exports4['ruby:rb_eKeyError'],
        'ruby:rb_eLoadError': exports4['ruby:rb_eLoadError'],
        'ruby:rb_eLocalJumpError': exports4['ruby:rb_eLocalJumpError'],
        'ruby:rb_eMathDomainError': exports4['ruby:rb_eMathDomainError'],
        'ruby:rb_eNameError': exports4['ruby:rb_eNameError'],
        'ruby:rb_eNoMatchingPatternError': exports4['ruby:rb_eNoMatchingPatternError'],
        'ruby:rb_eNoMatchingPatternKeyError': exports4['ruby:rb_eNoMatchingPatternKeyError'],
        'ruby:rb_eNoMemError': exports4['ruby:rb_eNoMemError'],
        'ruby:rb_eNoMethodError': exports4['ruby:rb_eNoMethodError'],
        'ruby:rb_eNotImpError': exports4['ruby:rb_eNotImpError'],
        'ruby:rb_eRactorIsolationError': exports4['ruby:rb_eRactorIsolationError'],
        'ruby:rb_eRactorUnsafeError': exports4['ruby:rb_eRactorUnsafeError'],
        'ruby:rb_eRangeError': exports4['ruby:rb_eRangeError'],
        'ruby:rb_eRegexpError': exports4['ruby:rb_eRegexpError'],
        'ruby:rb_eRuntimeError': exports4['ruby:rb_eRuntimeError'],
        'ruby:rb_eScriptError': exports4['ruby:rb_eScriptError'],
        'ruby:rb_eSecurityError': exports4['ruby:rb_eSecurityError'],
        'ruby:rb_eSignal': exports4['ruby:rb_eSignal'],
        'ruby:rb_eStandardError': exports4['ruby:rb_eStandardError'],
        'ruby:rb_eStopIteration': exports4['ruby:rb_eStopIteration'],
        'ruby:rb_eSyntaxError': exports4['ruby:rb_eSyntaxError'],
        'ruby:rb_eSysStackError': exports4['ruby:rb_eSysStackError'],
        'ruby:rb_eSystemCallError': exports4['ruby:rb_eSystemCallError'],
        'ruby:rb_eSystemExit': exports4['ruby:rb_eSystemExit'],
        'ruby:rb_eThreadError': exports4['ruby:rb_eThreadError'],
        'ruby:rb_eTypeError': exports4['ruby:rb_eTypeError'],
        'ruby:rb_eZeroDivError': exports4['ruby:rb_eZeroDivError'],
        'ruby:rb_fs': exports4['ruby:rb_fs'],
        'ruby:rb_mComparable': exports4['ruby:rb_mComparable'],
        'ruby:rb_mEnumerable': exports4['ruby:rb_mEnumerable'],
        'ruby:rb_mErrno': exports4['ruby:rb_mErrno'],
        'ruby:rb_mFileTest': exports4['ruby:rb_mFileTest'],
        'ruby:rb_mGC': exports4['ruby:rb_mGC'],
        'ruby:rb_mKernel': exports4['ruby:rb_mKernel'],
        'ruby:rb_mMath': exports4['ruby:rb_mMath'],
        'ruby:rb_mProcess': exports4['ruby:rb_mProcess'],
        'ruby:rb_mRubyVMFrozenCore': exports4['ruby:rb_mRubyVMFrozenCore'],
        'ruby:rb_mWaitReadable': exports4['ruby:rb_mWaitReadable'],
        'ruby:rb_mWaitWritable': exports4['ruby:rb_mWaitWritable'],
        'ruby:rb_memory_view_exported_object_registry': exports4['ruby:rb_memory_view_exported_object_registry'],
        'ruby:rb_memory_view_exported_object_registry_data_type': exports4['ruby:rb_memory_view_exported_object_registry_data_type'],
        'ruby:rb_output_fs': exports4['ruby:rb_output_fs'],
        'ruby:rb_output_rs': exports4['ruby:rb_output_rs'],
        'ruby:rb_random_data_type_1_0': exports4['ruby:rb_random_data_type_1_0'],
        'ruby:rb_rs': exports4['ruby:rb_rs'],
        'ruby:rb_shape_tree': exports4['ruby:rb_shape_tree'],
        'ruby:rb_stderr': exports4['ruby:rb_stderr'],
        'ruby:rb_stdin': exports4['ruby:rb_stdin'],
        'ruby:rb_stdout': exports4['ruby:rb_stdout'],
        'ruby:rb_vm_insn_len_info': exports4['ruby:rb_vm_insn_len_info'],
        'ruby:rb_vm_insn_name_base': exports4['ruby:rb_vm_insn_name_base'],
        'ruby:rb_vm_insn_name_offset': exports4['ruby:rb_vm_insn_name_offset'],
        'ruby:rb_vm_insn_op_base': exports4['ruby:rb_vm_insn_op_base'],
        'ruby:rb_vm_insn_op_offset': exports4['ruby:rb_vm_insn_op_offset'],
        'ruby:ruby_api_version': exports4['ruby:ruby_api_version'],
        'ruby:ruby_copyright': exports4['ruby:ruby_copyright'],
        'ruby:ruby_description': exports4['ruby:ruby_description'],
        'ruby:ruby_digit36_to_number_table': exports4['ruby:ruby_digit36_to_number_table'],
        'ruby:ruby_engine': exports4['ruby:ruby_engine'],
        'ruby:ruby_global_name_punct_bits': exports4['ruby:ruby_global_name_punct_bits'],
        'ruby:ruby_hexdigits': exports4['ruby:ruby_hexdigits'],
        'ruby:ruby_platform': exports4['ruby:ruby_platform'],
        'ruby:ruby_release_date': exports4['ruby:ruby_release_date'],
        'ruby:ruby_version': exports4['ruby:ruby_version'],
        'ruby:stderr': exports4['ruby:stderr'],
        'ruby:stdin': exports4['ruby:stdin'],
        'ruby:stdout': exports4['ruby:stdout'],
      },
      'libc.so': {
        _CLOCK_MONOTONIC: exports10._CLOCK_MONOTONIC,
        _CLOCK_REALTIME: exports10._CLOCK_REALTIME,
        _IO_feof_unlocked: exports10.feof,
        _IO_ferror_unlocked: exports10.ferror,
        _IO_getc: exports10.getc,
        _IO_getc_unlocked: exports10.getc_unlocked,
        _IO_putc: exports10.putc,
        _IO_putc_unlocked: exports10.putc_unlocked,
        __assert_fail: exports10.__assert_fail,
        __freelocale: exports10.freelocale,
        __getdelim: exports10.getdelim,
        __isoc99_fscanf: exports10.fscanf,
        __isoc99_fwscanf: exports10.fwscanf,
        __isoc99_scanf: exports10.scanf,
        __isoc99_sscanf: exports10.sscanf,
        __isoc99_swscanf: exports10.swscanf,
        __isoc99_vfscanf: exports10.vfscanf,
        __isoc99_vfwscanf: exports10.vfwscanf,
        __isoc99_vscanf: exports10.vscanf,
        __isoc99_vsscanf: exports10.vsscanf,
        __isoc99_vswscanf: exports10.vswscanf,
        __isoc99_vwscanf: exports10.vwscanf,
        __isoc99_wscanf: exports10.wscanf,
        __main_void: exports10.__main_void,
        __optpos: exports10.__optpos,
        __optreset: exports10.__optreset,
        __posix_getopt: exports10.getopt,
        __signgam: exports10.__signgam,
        __small_printf: exports10.printf,
        __stack_chk_guard: exports10.__stack_chk_guard,
        __strtod_l: exports10.strtod_l,
        __strtof_l: exports10.strtof_l,
        __strtoimax_internal: exports10.strtoimax,
        __strtol_internal: exports10.strtol,
        __strtold_l: exports10.strtold_l,
        __strtoll_internal: exports10.strtoll,
        __strtoul_internal: exports10.strtoul,
        __strtoull_internal: exports10.strtoull,
        __strtoumax_internal: exports10.strtoumax,
        __wasi_proc_exit: exports10.__wasi_proc_exit,
        __wasilibc_cwd: exports10.__wasilibc_cwd,
        __wasilibc_environ: exports10.__wasilibc_environ,
        __wasilibc_find_relpath_alloc: exports10.__wasilibc_find_relpath_alloc,
        __wasilibc_iftodt: exports10.__wasilibc_iftodt,
        __wasilibc_tell: exports10.__wasilibc_tell,
        __wasm_apply_data_relocs: exports10.__wasm_apply_data_relocs,
        __wasm_call_dtors: exports10.__wasm_call_dtors,
        __xpg_basename: exports10.basename,
        __xpg_strerror_r: exports10.strerror_r,
        _exit: exports10._Exit,
        _initialize: exports10._initialize,
        abort: exports10.abort,
        access: exports10.access,
        acos: exports10.acos,
        acosh: exports10.acosh,
        alphasort64: exports10.alphasort,
        asctime_r: exports10.asctime_r,
        asin: exports10.asin,
        asinh: exports10.asinh,
        atan: exports10.atan,
        atan2: exports10.atan2,
        atanh: exports10.atanh,
        atoi: exports10.atoi,
        atol: exports10.atol,
        bsearch: exports10.bsearch,
        calloc: exports10.calloc,
        cbrt: exports10.cbrt,
        chdir: exports10.chdir,
        clearerr_unlocked: exports10.clearerr,
        clock_getres: exports10.clock_getres,
        clock_gettime: exports10.clock_gettime,
        clock_nanosleep: exports10.clock_nanosleep,
        close: exports10.close,
        closedir: exports10.closedir,
        cos: exports10.cos,
        cosh: exports10.cosh,
        creat64: exports10.creat,
        crypt_r: exports10.crypt_r,
        dirfd: exports10.dirfd,
        drem: exports10.remainder,
        dremf: exports10.remainderf,
        duplocale: exports10.__duplocale,
        environ: exports10.environ,
        erf: exports10.erf,
        erfc: exports10.erfc,
        errno: exports10.errno,
        exit: exports10.exit,
        exp: exports10.exp,
        explicit_bzero: exports10.explicit_bzero,
        expm1: exports10.expm1,
        fclose: exports10.fclose,
        fcntl: exports10.fcntl,
        fdatasync: exports10.fdatasync,
        fdopen: exports10.fdopen,
        fdopendir: exports10.fdopendir,
        feof: exports10.feof,
        feof_unlocked: exports10.feof,
        ferror: exports10.ferror,
        ferror_unlocked: exports10.ferror,
        fflush: exports10.fflush,
        fflush_unlocked: exports10.fflush,
        fgetc_unlocked: exports10.getc_unlocked,
        fgetpos64: exports10.fgetpos,
        fgets_unlocked: exports10.fgets,
        fgetwc_unlocked: exports10.__fgetwc_unlocked,
        fgetws_unlocked: exports10.fgetws,
        fileno: exports10.fileno,
        fileno_unlocked: exports10.fileno,
        fmod: exports10.fmod,
        fopen: exports10.fopen,
        fopen64: exports10.fopen,
        fprintf: exports10.fprintf,
        fpurge: exports10.__fpurge,
        fputc_unlocked: exports10.putc_unlocked,
        fputs: exports10.fputs,
        fputs_unlocked: exports10.fputs,
        fputwc_unlocked: exports10.__fputwc_unlocked,
        fputws_unlocked: exports10.fputws,
        fread: exports10.fread,
        fread_unlocked: exports10.fread,
        free: exports10.free,
        freopen: exports10.freopen,
        freopen64: exports10.freopen,
        frexp: exports10.frexp,
        fseeko: exports10.fseeko,
        fseeko64: exports10.fseeko,
        fsetpos64: exports10.fsetpos,
        fstat: exports10.fstat,
        fstatat: exports10.fstatat,
        fsync: exports10.fsync,
        ftello: exports10.ftello,
        ftello64: exports10.ftello,
        ftruncate: exports10.ftruncate,
        futimesat: exports10.futimesat,
        fwrite: exports10.fwrite,
        fwrite_unlocked: exports10.fwrite,
        getcwd: exports10.getcwd,
        getdate_err: exports10.getdate_err,
        getentropy: exports10.__getentropy,
        getenv: exports10.getenv,
        gettimeofday: exports10.gettimeofday,
        getwc_unlocked: exports10.__fgetwc_unlocked,
        getwchar_unlocked: exports10.getwchar,
        glob64: exports10.glob,
        globfree64: exports10.globfree,
        gmtime_r: exports10.gmtime_r,
        hcreate_r: exports10.hcreate_r,
        hdestroy_r: exports10.hdestroy_r,
        hsearch_r: exports10.hsearch_r,
        hypot: exports10.hypot,
        inet_aton: exports10.inet_aton,
        ioctl: exports10.ioctl,
        iprintf: exports10.printf,
        isalnum_l: exports10.__isalnum_l,
        isalpha_l: exports10.__isalpha_l,
        isatty: exports10.__isatty,
        isblank_l: exports10.__isblank_l,
        iscntrl_l: exports10.__iscntrl_l,
        isdigit_l: exports10.__isdigit_l,
        isgraph_l: exports10.__isgraph_l,
        islower_l: exports10.__islower_l,
        isprint_l: exports10.__isprint_l,
        ispunct_l: exports10.__ispunct_l,
        isspace_l: exports10.__isspace_l,
        isupper_l: exports10.__isupper_l,
        iswalnum_l: exports10.__iswalnum_l,
        iswalpha_l: exports10.__iswalpha_l,
        iswblank_l: exports10.__iswblank_l,
        iswcntrl_l: exports10.__iswcntrl_l,
        iswctype_l: exports10.__iswctype_l,
        iswdigit_l: exports10.__iswdigit_l,
        iswgraph_l: exports10.__iswgraph_l,
        iswlower_l: exports10.__iswlower_l,
        iswprint_l: exports10.__iswprint_l,
        iswpunct_l: exports10.__iswpunct_l,
        iswspace_l: exports10.__iswspace_l,
        iswupper_l: exports10.__iswupper_l,
        iswxdigit_l: exports10.__iswxdigit_l,
        isxdigit_l: exports10.__isxdigit_l,
        ldexp: exports10.ldexp,
        lgamma_r: exports10.lgamma_r,
        lgammaf_r: exports10.lgammaf_r,
        lgammal_r: exports10.__lgammal_r,
        link: exports10.link,
        localeconv: exports10.localeconv,
        localtime_r: exports10.localtime_r,
        log: exports10.log,
        log10: exports10.log10,
        log1p: exports10.log1p,
        log2: exports10.log2,
        lseek: exports10.lseek,
        lstat: exports10.lstat,
        malloc: exports10.malloc,
        malloc_usable_size: exports10.malloc_usable_size,
        mblen: exports10.mblen,
        memchr: exports10.memchr,
        memcpy: exports10.memcpy,
        memmem: exports10.memmem,
        memmove: exports10.memmove,
        memrchr: exports10.memrchr,
        memset: exports10.memset,
        mkdir: exports10.mkdir,
        mktime: exports10.mktime,
        modf: exports10.modf,
        nan: exports10.nan,
        newlocale: exports10.__newlocale,
        nextafter: exports10.nextafter,
        nftw64: exports10.nftw,
        nl_langinfo: exports10.__nl_langinfo,
        nl_langinfo_l: exports10.__nl_langinfo_l,
        open: exports10.open,
        openat: exports10.openat,
        opendir: exports10.opendir,
        optarg: exports10.optarg,
        opterr: exports10.opterr,
        optind: exports10.optind,
        optopt: exports10.optopt,
        perror: exports10.perror,
        posix_fadvise: exports10.posix_fadvise,
        posix_memalign: exports10.posix_memalign,
        pow: exports10.pow,
        pow10: exports10.exp10,
        pow10f: exports10.exp10f,
        pow10l: exports10.exp10l,
        pread: exports10.pread,
        printf: exports10.printf,
        puts: exports10.puts,
        putwc_unlocked: exports10.__fputwc_unlocked,
        putwchar_unlocked: exports10.putwchar,
        pwrite: exports10.pwrite,
        qsort: exports10.qsort,
        qsort_r: exports10.qsort_r,
        read: exports10.read,
        readdir: exports10.readdir,
        readlink: exports10.readlink,
        realloc: exports10.realloc,
        reallocarray: exports10.__reallocarray,
        rename: exports10.rename,
        rewinddir: exports10.rewinddir,
        rmdir: exports10.rmdir,
        round: exports10.round,
        seekdir: exports10.seekdir,
        select: exports10.select,
        setenv: exports10.setenv,
        setlocale: exports10.setlocale,
        setvbuf: exports10.setvbuf,
        sin: exports10.sin,
        sinh: exports10.sinh,
        sleep: exports10.sleep,
        stat: exports10.stat,
        stderr: exports10.stderr,
        stdin: exports10.stdin,
        stdout: exports10.stdout,
        stpcpy: exports10.stpcpy,
        stpncpy: exports10.stpncpy,
        strcasecmp: exports10.strcasecmp,
        strcasecmp_l: exports10.__strcasecmp_l,
        strchr: exports10.strchr,
        strchrnul: exports10.strchrnul,
        strcmp: exports10.strcmp,
        strcoll_l: exports10.__strcoll_l,
        strcspn: exports10.strcspn,
        strdup: exports10.strdup,
        strerror: exports10.strerror,
        strerror_l: exports10.__strerror_l,
        strftime_l: exports10.strftime_l,
        strlcat: exports10.strlcat,
        strlcpy: exports10.strlcpy,
        strlen: exports10.strlen,
        strncasecmp: exports10.strncasecmp,
        strncasecmp_l: exports10.__strncasecmp_l,
        strncmp: exports10.strncmp,
        strpbrk: exports10.strpbrk,
        strrchr: exports10.strrchr,
        strstr: exports10.strstr,
        strtod: exports10.strtod,
        strtol: exports10.strtol,
        strtoul: exports10.strtoul,
        strxfrm_l: exports10.__strxfrm_l,
        symlink: exports10.symlink,
        sysconf: exports10.sysconf,
        tan: exports10.tan,
        tanh: exports10.tanh,
        telldir: exports10.telldir,
        tgamma: exports10.tgamma,
        time: exports10.time,
        tolower_l: exports10.__tolower_l,
        toupper_l: exports10.__toupper_l,
        towctrans_l: exports10.__towctrans_l,
        towlower_l: exports10.__towlower_l,
        towupper_l: exports10.__towupper_l,
        truncate: exports10.truncate,
        unlink: exports10.unlink,
        unsetenv: exports10.unsetenv,
        uselocale: exports10.__uselocale,
        utimensat: exports10.utimensat,
        utimes: exports10.utimes,
        versionsort64: exports10.versionsort,
        vfprintf: exports10.vfprintf,
        vsnprintf: exports10.vsnprintf,
        wcscoll_l: exports10.__wcscoll_l,
        wcsftime_l: exports10.__wcsftime_l,
        wcsxfrm_l: exports10.__wcsxfrm_l,
        wctrans_l: exports10.__wctrans_l,
        wctype_l: exports10.__wctype_l,
        write: exports10.write,
        writev: exports10.writev,
      },
      'libdl.so': {
        __wasm_apply_data_relocs: exports9.__wasm_apply_data_relocs,
        __wasm_set_libraries: exports9.__wasm_set_libraries,
        _initialize: exports9._initialize,
        dlclose: exports9.dlclose,
        dlerror: exports9.dlerror,
        dlopen: exports9.dlopen,
        dlsym: exports9.dlsym,
      },
      'libwasi-emulated-getpid.so': {
        __wasm_apply_data_relocs: exports7.__wasm_apply_data_relocs,
        _initialize: exports7._initialize,
      },
      'libwasi-emulated-mman.so': {
        __wasm_apply_data_relocs: exports11.__wasm_apply_data_relocs,
        _initialize: exports11._initialize,
        mmap: exports11.mmap,
        munmap: exports11.munmap,
      },
      'libwasi-emulated-process-clocks.so': {
        __wasm_apply_data_relocs: exports13.__wasm_apply_data_relocs,
        _initialize: exports13._initialize,
        clock: exports13.__clock,
        getrusage: exports13.getrusage,
        times: exports13.times,
      },
      'libwasi-emulated-signal.so': {
        __SIG_ERR: exports12.__SIG_ERR,
        __SIG_IGN: exports12.__SIG_IGN,
        __sysv_signal: exports12.signal,
        __wasm_apply_data_relocs: exports12.__wasm_apply_data_relocs,
        _initialize: exports12._initialize,
        bsd_signal: exports12.signal,
        raise: exports12.raise,
        signal: exports12.signal,
      },
      ruby: {
        Init_prism: exports8.Init_prism,
        OnigDefaultCaseFoldFlag: exports8.OnigDefaultCaseFoldFlag,
        OnigDefaultSyntax: exports8.OnigDefaultSyntax,
        OnigEncAsciiCtypeTable: exports8.OnigEncAsciiCtypeTable,
        OnigEncAsciiToLowerCaseTable: exports8.OnigEncAsciiToLowerCaseTable,
        OnigEncAsciiToUpperCaseTable: exports8.OnigEncAsciiToUpperCaseTable,
        OnigEncDefaultCharEncoding: exports8.OnigEncDefaultCharEncoding,
        OnigEncISO_8859_1_ToLowerCaseTable: exports8.OnigEncISO_8859_1_ToLowerCaseTable,
        OnigEncodingASCII: exports8.OnigEncodingASCII,
        OnigSyntaxRuby: exports8.OnigSyntaxRuby,
        RUBY_IO_BUFFER_DEFAULT_SIZE: exports8.RUBY_IO_BUFFER_DEFAULT_SIZE,
        RUBY_IO_BUFFER_PAGE_SIZE: exports8.RUBY_IO_BUFFER_PAGE_SIZE,
        __wasm_apply_data_relocs: exports8.__wasm_apply_data_relocs,
        __wasm_call_ctors: exports8.__wasm_call_ctors,
        chmod: exports8.chmod,
        chown: exports8.chown,
        dup: exports8.dup,
        dup2: exports8.dup2,
        execl: exports8.execl,
        execle: exports8.execle,
        execv: exports8.execv,
        execve: exports8.execve,
        getegid: exports8.getegid,
        geteuid: exports8.geteuid,
        getgid: exports8.getgid,
        getlogin: exports8.getlogin,
        getppid: exports8.getppid,
        getuid: exports8.getuid,
        kill: exports8.kill,
        onig_null_warn: exports8.onig_null_warn,
        onigenc_always_false_is_allowed_reverse_match: exports8.onigenc_always_false_is_allowed_reverse_match,
        onigenc_always_true_is_allowed_reverse_match: exports8.onigenc_always_true_is_allowed_reverse_match,
        onigenc_ascii_apply_all_case_fold: exports8.onigenc_ascii_apply_all_case_fold,
        onigenc_ascii_get_case_fold_codes_by_str: exports8.onigenc_ascii_get_case_fold_codes_by_str,
        onigenc_ascii_is_code_ctype: exports8.onigenc_ascii_is_code_ctype,
        onigenc_ascii_mbc_case_fold: exports8.onigenc_ascii_mbc_case_fold,
        onigenc_ascii_only_case_map: exports8.onigenc_ascii_only_case_map,
        onigenc_is_mbc_newline_0x0a: exports8.onigenc_is_mbc_newline_0x0a,
        onigenc_mb2_code_to_mbclen: exports8.onigenc_mb2_code_to_mbclen,
        onigenc_mb4_code_to_mbclen: exports8.onigenc_mb4_code_to_mbclen,
        onigenc_minimum_property_name_to_ctype: exports8.onigenc_minimum_property_name_to_ctype,
        onigenc_not_support_get_ctype_code_range: exports8.onigenc_not_support_get_ctype_code_range,
        onigenc_single_byte_ascii_only_case_map: exports8.onigenc_single_byte_ascii_only_case_map,
        onigenc_single_byte_code_to_mbc: exports8.onigenc_single_byte_code_to_mbc,
        onigenc_single_byte_code_to_mbclen: exports8.onigenc_single_byte_code_to_mbclen,
        onigenc_single_byte_left_adjust_char_head: exports8.onigenc_single_byte_left_adjust_char_head,
        onigenc_single_byte_mbc_enc_len: exports8.onigenc_single_byte_mbc_enc_len,
        onigenc_single_byte_mbc_to_code: exports8.onigenc_single_byte_mbc_to_code,
        onigenc_unicode_apply_all_case_fold: exports8.onigenc_unicode_apply_all_case_fold,
        onigenc_unicode_case_map: exports8.onigenc_unicode_case_map,
        onigenc_unicode_is_code_ctype: exports8.onigenc_unicode_is_code_ctype,
        onigenc_unicode_property_name_to_ctype: exports8.onigenc_unicode_property_name_to_ctype,
        onigenc_utf16_32_get_ctype_code_range: exports8.onigenc_utf16_32_get_ctype_code_range,
        pclose: exports8.pclose,
        pipe: exports8.pipe,
        popen: exports8.popen,
        rb_any_to_s: exports8.rb_any_to_s,
        rb_argv0: exports8.rb_argv0,
        rb_ary_aref: exports8.rb_ary_aref,
        rb_ary_assoc: exports8.rb_ary_assoc,
        rb_ary_clear: exports8.rb_ary_clear,
        rb_ary_cmp: exports8.rb_ary_cmp,
        rb_ary_delete: exports8.rb_ary_delete,
        rb_ary_each: exports8.rb_ary_each,
        rb_ary_freeze: exports8.rb_ary_freeze,
        rb_ary_includes: exports8.rb_ary_includes,
        rb_ary_plus: exports8.rb_ary_plus,
        rb_ary_push: exports8.rb_ary_push,
        rb_ary_rassoc: exports8.rb_ary_rassoc,
        rb_ary_replace: exports8.rb_ary_replace,
        rb_ary_sort: exports8.rb_ary_sort,
        rb_ary_sort_bang: exports8.rb_ary_sort_bang,
        rb_asyncify_unwind_buf: exports8.rb_asyncify_unwind_buf,
        rb_block_param_proxy: exports8.rb_block_param_proxy,
        rb_cArray: exports8.rb_cArray,
        rb_cBasicObject: exports8.rb_cBasicObject,
        rb_cBinding: exports8.rb_cBinding,
        rb_cClass: exports8.rb_cClass,
        rb_cComplex: exports8.rb_cComplex,
        rb_cDir: exports8.rb_cDir,
        rb_cEncoding: exports8.rb_cEncoding,
        rb_cEnumerator: exports8.rb_cEnumerator,
        rb_cFalseClass: exports8.rb_cFalseClass,
        rb_cFile: exports8.rb_cFile,
        rb_cFloat: exports8.rb_cFloat,
        rb_cHash: exports8.rb_cHash,
        rb_cIO: exports8.rb_cIO,
        rb_cIOBuffer: exports8.rb_cIOBuffer,
        rb_cISeq: exports8.rb_cISeq,
        rb_cInteger: exports8.rb_cInteger,
        rb_cMatch: exports8.rb_cMatch,
        rb_cMethod: exports8.rb_cMethod,
        rb_cModule: exports8.rb_cModule,
        rb_cNameErrorMesg: exports8.rb_cNameErrorMesg,
        rb_cNamespace: exports8.rb_cNamespace,
        rb_cNilClass: exports8.rb_cNilClass,
        rb_cNumeric: exports8.rb_cNumeric,
        rb_cObject: exports8.rb_cObject,
        rb_cProc: exports8.rb_cProc,
        rb_cRactor: exports8.rb_cRactor,
        rb_cRandom: exports8.rb_cRandom,
        rb_cRange: exports8.rb_cRange,
        rb_cRational: exports8.rb_cRational,
        rb_cRefinement: exports8.rb_cRefinement,
        rb_cRegexp: exports8.rb_cRegexp,
        rb_cRubyVM: exports8.rb_cRubyVM,
        rb_cSet: exports8.rb_cSet,
        rb_cStat: exports8.rb_cStat,
        rb_cString: exports8.rb_cString,
        rb_cStruct: exports8.rb_cStruct,
        rb_cSymbol: exports8.rb_cSymbol,
        rb_cThread: exports8.rb_cThread,
        rb_cTime: exports8.rb_cTime,
        rb_cTrueClass: exports8.rb_cTrueClass,
        rb_cUnboundMethod: exports8.rb_cUnboundMethod,
        rb_check_to_int: exports8.rb_check_to_int,
        rb_class_attached_object: exports8.rb_class_attached_object,
        rb_class_inherited_p: exports8.rb_class_inherited_p,
        rb_class_instance_methods: exports8.rb_class_instance_methods,
        rb_class_new_instance: exports8.rb_class_new_instance,
        rb_class_new_instance_pass_kw: exports8.rb_class_new_instance_pass_kw,
        rb_class_private_instance_methods: exports8.rb_class_private_instance_methods,
        rb_class_protected_instance_methods: exports8.rb_class_protected_instance_methods,
        rb_class_public_instance_methods: exports8.rb_class_public_instance_methods,
        rb_class_subclasses: exports8.rb_class_subclasses,
        rb_class_superclass: exports8.rb_class_superclass,
        rb_complex_abs: exports8.rb_complex_abs,
        rb_complex_arg: exports8.rb_complex_arg,
        rb_complex_conjugate: exports8.rb_complex_conjugate,
        rb_complex_div: exports8.rb_complex_div,
        rb_complex_imag: exports8.rb_complex_imag,
        rb_complex_minus: exports8.rb_complex_minus,
        rb_complex_mul: exports8.rb_complex_mul,
        rb_complex_plus: exports8.rb_complex_plus,
        rb_complex_pow: exports8.rb_complex_pow,
        rb_complex_real: exports8.rb_complex_real,
        rb_complex_uminus: exports8.rb_complex_uminus,
        rb_default_rs: exports8.rb_default_rs,
        rb_eArgError: exports8.rb_eArgError,
        rb_eEOFError: exports8.rb_eEOFError,
        rb_eEncCompatError: exports8.rb_eEncCompatError,
        rb_eEncodingError: exports8.rb_eEncodingError,
        rb_eException: exports8.rb_eException,
        rb_eFatal: exports8.rb_eFatal,
        rb_eFloatDomainError: exports8.rb_eFloatDomainError,
        rb_eFrozenError: exports8.rb_eFrozenError,
        rb_eIOError: exports8.rb_eIOError,
        rb_eIOTimeoutError: exports8.rb_eIOTimeoutError,
        rb_eIndexError: exports8.rb_eIndexError,
        rb_eInterrupt: exports8.rb_eInterrupt,
        rb_eKeyError: exports8.rb_eKeyError,
        rb_eLoadError: exports8.rb_eLoadError,
        rb_eLocalJumpError: exports8.rb_eLocalJumpError,
        rb_eMathDomainError: exports8.rb_eMathDomainError,
        rb_eNameError: exports8.rb_eNameError,
        rb_eNoMatchingPatternError: exports8.rb_eNoMatchingPatternError,
        rb_eNoMatchingPatternKeyError: exports8.rb_eNoMatchingPatternKeyError,
        rb_eNoMemError: exports8.rb_eNoMemError,
        rb_eNoMethodError: exports8.rb_eNoMethodError,
        rb_eNotImpError: exports8.rb_eNotImpError,
        rb_eRactorIsolationError: exports8.rb_eRactorIsolationError,
        rb_eRactorUnsafeError: exports8.rb_eRactorUnsafeError,
        rb_eRangeError: exports8.rb_eRangeError,
        rb_eRegexpError: exports8.rb_eRegexpError,
        rb_eRuntimeError: exports8.rb_eRuntimeError,
        rb_eScriptError: exports8.rb_eScriptError,
        rb_eSecurityError: exports8.rb_eSecurityError,
        rb_eSignal: exports8.rb_eSignal,
        rb_eStandardError: exports8.rb_eStandardError,
        rb_eStopIteration: exports8.rb_eStopIteration,
        rb_eSyntaxError: exports8.rb_eSyntaxError,
        rb_eSysStackError: exports8.rb_eSysStackError,
        rb_eSystemCallError: exports8.rb_eSystemCallError,
        rb_eSystemExit: exports8.rb_eSystemExit,
        rb_eThreadError: exports8.rb_eThreadError,
        rb_eTypeError: exports8.rb_eTypeError,
        rb_eZeroDivError: exports8.rb_eZeroDivError,
        rb_equal: exports8.rb_equal,
        rb_f_notimplement: exports8.rb_f_notimplement,
        rb_f_require: exports8.rb_f_require,
        rb_fiber_alive_p: exports8.rb_fiber_alive_p,
        rb_file_directory_p: exports8.rb_file_directory_p,
        rb_fs: exports8.rb_fs,
        rb_gcd: exports8.rb_gcd,
        rb_gvar_readonly_setter: exports8.rb_gvar_readonly_setter,
        rb_gvar_undef_getter: exports8.rb_gvar_undef_getter,
        rb_gvar_undef_marker: exports8.rb_gvar_undef_marker,
        rb_gvar_undef_setter: exports8.rb_gvar_undef_setter,
        rb_gvar_val_getter: exports8.rb_gvar_val_getter,
        rb_gvar_val_marker: exports8.rb_gvar_val_marker,
        rb_gvar_val_setter: exports8.rb_gvar_val_setter,
        rb_gvar_var_getter: exports8.rb_gvar_var_getter,
        rb_gvar_var_marker: exports8.rb_gvar_var_marker,
        rb_gvar_var_setter: exports8.rb_gvar_var_setter,
        rb_hash_aref: exports8.rb_hash_aref,
        rb_hash_aset: exports8.rb_hash_aset,
        rb_hash_clear: exports8.rb_hash_clear,
        rb_hash_delete_if: exports8.rb_hash_delete_if,
        rb_hash_freeze: exports8.rb_hash_freeze,
        rb_hash_size: exports8.rb_hash_size,
        rb_inspect: exports8.rb_inspect,
        rb_io_addstr: exports8.rb_io_addstr,
        rb_io_buffer_free: exports8.rb_io_buffer_free,
        rb_io_buffer_transfer: exports8.rb_io_buffer_transfer,
        rb_io_close: exports8.rb_io_close,
        rb_io_closed_p: exports8.rb_io_closed_p,
        rb_io_eof: exports8.rb_io_eof,
        rb_io_flush: exports8.rb_io_flush,
        rb_io_getbyte: exports8.rb_io_getbyte,
        rb_io_path: exports8.rb_io_path,
        rb_io_print: exports8.rb_io_print,
        rb_io_printf: exports8.rb_io_printf,
        rb_io_puts: exports8.rb_io_puts,
        rb_io_set_timeout: exports8.rb_io_set_timeout,
        rb_io_timeout: exports8.rb_io_timeout,
        rb_io_ungetbyte: exports8.rb_io_ungetbyte,
        rb_io_ungetc: exports8.rb_io_ungetc,
        rb_io_write: exports8.rb_io_write,
        rb_locale_charmap: exports8.rb_locale_charmap,
        rb_mComparable: exports8.rb_mComparable,
        rb_mEnumerable: exports8.rb_mEnumerable,
        rb_mErrno: exports8.rb_mErrno,
        rb_mFileTest: exports8.rb_mFileTest,
        rb_mGC: exports8.rb_mGC,
        rb_mKernel: exports8.rb_mKernel,
        rb_mMath: exports8.rb_mMath,
        rb_mProcess: exports8.rb_mProcess,
        rb_mRubyVMFrozenCore: exports8.rb_mRubyVMFrozenCore,
        rb_mWaitReadable: exports8.rb_mWaitReadable,
        rb_mWaitWritable: exports8.rb_mWaitWritable,
        rb_mark_set: exports8.rb_mark_set,
        rb_mark_tbl: exports8.rb_mark_tbl,
        rb_memory_view_exported_object_registry: exports8.rb_memory_view_exported_object_registry,
        rb_memory_view_exported_object_registry_data_type: exports8.rb_memory_view_exported_object_registry_data_type,
        rb_mod_ancestors: exports8.rb_mod_ancestors,
        rb_mod_class_variables: exports8.rb_mod_class_variables,
        rb_mod_constants: exports8.rb_mod_constants,
        rb_mod_include_p: exports8.rb_mod_include_p,
        rb_mod_included_modules: exports8.rb_mod_included_modules,
        rb_mod_name: exports8.rb_mod_name,
        rb_mod_remove_const: exports8.rb_mod_remove_const,
        rb_mod_remove_cvar: exports8.rb_mod_remove_cvar,
        rb_mutex_lock: exports8.rb_mutex_lock,
        rb_mutex_locked_p: exports8.rb_mutex_locked_p,
        rb_mutex_trylock: exports8.rb_mutex_trylock,
        rb_mutex_unlock: exports8.rb_mutex_unlock,
        rb_obj_dup: exports8.rb_obj_dup,
        rb_obj_encoding: exports8.rb_obj_encoding,
        rb_obj_freeze: exports8.rb_obj_freeze,
        rb_obj_id: exports8.rb_obj_id,
        rb_obj_init_copy: exports8.rb_obj_init_copy,
        rb_obj_instance_variables: exports8.rb_obj_instance_variables,
        rb_obj_is_instance_of: exports8.rb_obj_is_instance_of,
        rb_obj_is_kind_of: exports8.rb_obj_is_kind_of,
        rb_obj_method: exports8.rb_obj_method,
        rb_obj_remove_instance_variable: exports8.rb_obj_remove_instance_variable,
        rb_obj_singleton_methods: exports8.rb_obj_singleton_methods,
        rb_output_fs: exports8.rb_output_fs,
        rb_output_rs: exports8.rb_output_rs,
        rb_parser_compile_string_path: exports8.rb_parser_compile_string_path,
        rb_parser_st_numcmp: exports8.rb_parser_st_numcmp,
        rb_parser_st_numhash: exports8.rb_parser_st_numhash,
        rb_proc_lambda_p: exports8.rb_proc_lambda_p,
        rb_proc_times: exports8.rb_proc_times,
        rb_random_data_type_1_0: exports8.rb_random_data_type_1_0,
        rb_random_mark: exports8.rb_random_mark,
        rb_reg_match: exports8.rb_reg_match,
        rb_reg_match2: exports8.rb_reg_match2,
        rb_reg_match_post: exports8.rb_reg_match_post,
        rb_reg_match_pre: exports8.rb_reg_match_pre,
        rb_rs: exports8.rb_rs,
        rb_shape_tree: exports8.rb_shape_tree,
        rb_st_free_table: exports8.rb_st_free_table,
        rb_st_numcmp: exports8.rb_st_numcmp,
        rb_st_numhash: exports8.rb_st_numhash,
        rb_stderr: exports8.rb_stderr,
        rb_stdin: exports8.rb_stdin,
        rb_stdout: exports8.rb_stdout,
        rb_str_append: exports8.rb_str_append,
        rb_str_concat: exports8.rb_str_concat,
        rb_str_dump: exports8.rb_str_dump,
        rb_str_equal: exports8.rb_str_equal,
        rb_str_freeze: exports8.rb_str_freeze,
        rb_str_inspect: exports8.rb_str_inspect,
        rb_str_intern: exports8.rb_str_intern,
        rb_str_length: exports8.rb_str_length,
        rb_str_plus: exports8.rb_str_plus,
        rb_str_replace: exports8.rb_str_replace,
        rb_str_succ: exports8.rb_str_succ,
        rb_str_times: exports8.rb_str_times,
        rb_str_unlocktmp: exports8.rb_str_unlocktmp,
        rb_struct_aref: exports8.rb_struct_aref,
        rb_struct_aset: exports8.rb_struct_aset,
        rb_struct_size: exports8.rb_struct_size,
        rb_thread_kill: exports8.rb_thread_kill,
        rb_thread_run: exports8.rb_thread_run,
        rb_thread_wakeup: exports8.rb_thread_wakeup,
        rb_time_utc_offset: exports8.rb_time_utc_offset,
        rb_tracepoint_disable: exports8.rb_tracepoint_disable,
        rb_tracepoint_enable: exports8.rb_tracepoint_enable,
        rb_vm_insn_len_info: exports8.rb_vm_insn_len_info,
        rb_vm_insn_name_base: exports8.rb_vm_insn_name_base,
        rb_vm_insn_name_offset: exports8.rb_vm_insn_name_offset,
        rb_vm_insn_op_base: exports8.rb_vm_insn_op_base,
        rb_vm_insn_op_offset: exports8.rb_vm_insn_op_offset,
        rb_yield: exports8.rb_yield,
        ruby_api_version: exports8.ruby_api_version,
        ruby_copyright: exports8.ruby_copyright,
        ruby_description: exports8.ruby_description,
        ruby_digit36_to_number_table: exports8.ruby_digit36_to_number_table,
        ruby_engine: exports8.ruby_engine,
        ruby_global_name_punct_bits: exports8.ruby_global_name_punct_bits,
        ruby_hexdigits: exports8.ruby_hexdigits,
        ruby_platform: exports8.ruby_platform,
        ruby_release_date: exports8.ruby_release_date,
        ruby_version: exports8.ruby_version,
        ruby_xfree: exports8.ruby_xfree,
        ruby_xmalloc: exports8.ruby_xmalloc,
        system: exports8.system,
        tzset: exports8.tzset,
        umask: exports8.umask,
        waitpid: exports8.waitpid,
      },
    }));
    postReturn0 = exports98['cabi_post_ruby:js/ruby-runtime#rstring-ptr'];
    
    function rubyShowVersion() {
      exports98['ruby:js/ruby-runtime#ruby-show-version']();
    }
    
    function rubyInit(arg0) {
      var vec1 = arg0;
      var len1 = vec1.length;
      var result1 = realloc2(0, 0, 4, len1 * 8);
      for (let i = 0; i < vec1.length; i++) {
        const e = vec1[i];
        const base = result1 + i * 8;var ptr0 = utf8Encode(e, realloc2, memory1);
        var len0 = utf8EncodedLen;
        dataView(memory1).setInt32(base + 4, len0, true);
        dataView(memory1).setInt32(base + 0, ptr0, true);
      }
      exports98['ruby:js/ruby-runtime#ruby-init'](result1, len1);
    }
    
    function rubyInitLoadpath() {
      exports98['ruby:js/ruby-runtime#ruby-init-loadpath']();
    }
    
    function rbEvalStringProtect(arg0) {
      var ptr0 = utf8Encode(arg0, realloc2, memory1);
      var len0 = utf8EncodedLen;
      const ret = exports98['ruby:js/ruby-runtime#rb-eval-string-protect'](ptr0, len0);
      var handle2 = dataView(memory1).getInt32(ret + 0, true);
      var rsc1 = new.target === RbAbiValue ? this : Object.create(RbAbiValue.prototype);
      Object.defineProperty(rsc1, symbolRscHandle, { writable: true, value: handle2});
      finalizationRegistry136.register(rsc1, handle2, rsc1);
      Object.defineProperty(rsc1, symbolDispose, { writable: true, value: emptyFunc });
      return [rsc1, dataView(memory1).getInt32(ret + 4, true)];
    }
    
    function rbFuncallvProtect(arg0, arg1, arg2) {
      var handle1 = arg0[symbolRscHandle];
      if (!handle1 || (handleTable136[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "RbAbiValue" resource.');
      }
      var handle0 = handleTable136[(handle1 << 1) + 1] & ~T_FLAG;
      var vec4 = arg2;
      var len4 = vec4.length;
      var result4 = realloc2(0, 0, 4, len4 * 4);
      for (let i = 0; i < vec4.length; i++) {
        const e = vec4[i];
        const base = result4 + i * 4;var handle3 = e[symbolRscHandle];
        if (!handle3 || (handleTable136[(handle3 << 1) + 1] & T_FLAG) === 0) {
          throw new TypeError('Resource error: Not a valid "RbAbiValue" resource.');
        }
        var handle2 = handleTable136[(handle3 << 1) + 1] & ~T_FLAG;
        dataView(memory1).setInt32(base + 0, handle2, true);
      }
      const ret = exports98['ruby:js/ruby-runtime#rb-funcallv-protect'](handle0, toUint32(arg1), result4, len4);
      var handle6 = dataView(memory1).getInt32(ret + 0, true);
      var rsc5 = new.target === RbAbiValue ? this : Object.create(RbAbiValue.prototype);
      Object.defineProperty(rsc5, symbolRscHandle, { writable: true, value: handle6});
      finalizationRegistry136.register(rsc5, handle6, rsc5);
      Object.defineProperty(rsc5, symbolDispose, { writable: true, value: emptyFunc });
      return [rsc5, dataView(memory1).getInt32(ret + 4, true)];
    }
    
    function rbIntern(arg0) {
      var ptr0 = utf8Encode(arg0, realloc2, memory1);
      var len0 = utf8EncodedLen;
      const ret = exports98['ruby:js/ruby-runtime#rb-intern'](ptr0, len0);
      return ret >>> 0;
    }
    
    function rbErrinfo() {
      const ret = exports98['ruby:js/ruby-runtime#rb-errinfo']();
      var handle1 = ret;
      var rsc0 = new.target === RbAbiValue ? this : Object.create(RbAbiValue.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      finalizationRegistry136.register(rsc0, handle1, rsc0);
      Object.defineProperty(rsc0, symbolDispose, { writable: true, value: emptyFunc });
      return rsc0;
    }
    
    function rbClearErrinfo() {
      exports98['ruby:js/ruby-runtime#rb-clear-errinfo']();
    }
    
    function rstringPtr(arg0) {
      var handle1 = arg0[symbolRscHandle];
      if (!handle1 || (handleTable136[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "RbAbiValue" resource.');
      }
      var handle0 = handleTable136[(handle1 << 1) + 1] & ~T_FLAG;
      const ret = exports98['ruby:js/ruby-runtime#rstring-ptr'](handle0);
      var ptr2 = dataView(memory1).getInt32(ret + 0, true);
      var len2 = dataView(memory1).getInt32(ret + 4, true);
      var result2 = utf8Decoder.decode(new Uint8Array(memory1.buffer, ptr2, len2));
      const retVal = result2;
      postReturn0(ret);
      return retVal;
    }
    
    function rbVmBugreport() {
      exports98['ruby:js/ruby-runtime#rb-vm-bugreport']();
    }
    
    function rbGcEnable() {
      const ret = exports98['ruby:js/ruby-runtime#rb-gc-enable']();
      var bool0 = ret;
      return !!bool0;
    }
    
    function rbGcDisable() {
      const ret = exports98['ruby:js/ruby-runtime#rb-gc-disable']();
      var bool0 = ret;
      return !!bool0;
    }
    
    function rbSetShouldProhibitRewind(arg0) {
      const ret = exports98['ruby:js/ruby-runtime#rb-set-should-prohibit-rewind'](arg0 ? 1 : 0);
      var bool0 = ret;
      return !!bool0;
    }
    
    function exportRbValueToJs() {
      const ret = exports98['ruby:js/ruby-runtime#export-rb-value-to-js']();
      var handle1 = ret;
      var rsc0 = new.target === RbAbiValue ? this : Object.create(RbAbiValue.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      finalizationRegistry136.register(rsc0, handle1, rsc0);
      Object.defineProperty(rsc0, symbolDispose, { writable: true, value: emptyFunc });
      return rsc0;
    }
    
    class RbAbiValue{
      constructor () {
        throw new Error('"RbAbiValue" resource does not define a constructor');
      }
    }
    const rubyRuntime = {
      exportRbValueToJs: exportRbValueToJs,
      rbClearErrinfo: rbClearErrinfo,
      rbErrinfo: rbErrinfo,
      rbEvalStringProtect: rbEvalStringProtect,
      rbFuncallvProtect: rbFuncallvProtect,
      rbGcDisable: rbGcDisable,
      rbGcEnable: rbGcEnable,
      rbIntern: rbIntern,
      rbSetShouldProhibitRewind: rbSetShouldProhibitRewind,
      rbVmBugreport: rbVmBugreport,
      rstringPtr: rstringPtr,
      rubyInit: rubyInit,
      rubyInitLoadpath: rubyInitLoadpath,
      rubyShowVersion: rubyShowVersion,
      
    };
    
    return { rubyRuntime, 'ruby:js/ruby-runtime': rubyRuntime,  };
  })();
  let promise, resolve, reject;
  function runNext (value) {
    try {
      let done;
      do {
        ({ value, done } = gen.next(value));
      } while (!(value instanceof Promise) && !done);
      if (done) {
        if (resolve) resolve(value);
        else return value;
      }
      if (!promise) promise = new Promise((_resolve, _reject) => (resolve = _resolve, reject = _reject));
      value.then(nextVal => done ? resolve() : runNext(nextVal), reject);
    }
    catch (e) {
      if (reject) reject(e);
      else throw e;
    }
  }
  const maybeSyncReturn = runNext(null);
  return promise || maybeSyncReturn;
}
