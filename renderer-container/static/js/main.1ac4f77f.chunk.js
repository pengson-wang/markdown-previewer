(this["webpackJsonpextension-app"] = this["webpackJsonpextension-app"] || []).push([["main"],{

/***/ 125:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-dom/index.js
var react_dom = __webpack_require__(32);
var react_dom_default = /*#__PURE__*/__webpack_require__.n(react_dom);

// EXTERNAL MODULE: ./src/index.sass
var src_0 = __webpack_require__(125);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/@babel/runtime/helpers/esm/slicedToArray.js + 3 modules
var slicedToArray = __webpack_require__(5);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js
var regeneratorRuntime = __webpack_require__(11);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(24);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(44);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(45);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/styled-components/dist/styled-components.browser.esm.js
var styled_components_browser_esm = __webpack_require__(84);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js + 3 modules
var combineLatest = __webpack_require__(146);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/operators/distinctUntilChanged.js
var distinctUntilChanged = __webpack_require__(143);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/operators/map.js
var map = __webpack_require__(71);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/operators/filter.js
var filter = __webpack_require__(142);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/nanoid/index.browser.js + 1 modules
var index_browser = __webpack_require__(102);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/observable/fromEvent.js + 2 modules
var fromEvent = __webpack_require__(147);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/scheduler/async.js + 5 modules
var scheduler_async = __webpack_require__(94);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/operators/tap.js
var tap = __webpack_require__(141);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/operators/shareReplay.js + 1 modules
var shareReplay = __webpack_require__(149);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/operators/throttleTime.js + 3 modules
var throttleTime = __webpack_require__(145);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/operators/take.js + 1 modules
var take = __webpack_require__(120);

// EXTERNAL MODULE: ../shared/lib/index.js
var lib = __webpack_require__(26);

// CONCATENATED MODULE: ./src/states/general.ts
function makeMsg(type,content){return{id:Object(index_browser["nanoid"])(),type:type,content:content};}function isValidMsg(msg){if(msg){return typeof msg.id==='string'&&msg.type instanceof Array&&msg.type.length>=2;}return false;}var $fromMsg=Object(fromEvent["a" /* fromEvent */])(window,'message').pipe(Object(map["a" /* map */])(function(e){return e.data;}),Object(tap["a" /* tap */])(function(data){console.log("Received Message(Not verified):\n");console.log(data);}),Object(filter["a" /* filter */])(function(data){return isValidMsg(data);}),Object(tap["a" /* tap */])(function(data){console.log("Received Message:\n");console.log(data);}),Object(shareReplay["a" /* shareReplay */])(10));function send(msg){window.parent.postMessage(msg,'*');}function sendReadySignal(){console.log('send appready signal');send(makeMsg([lib["Msg"].From.Iframe,lib["Msg"].Category.IframeReady],true));}var $input=$fromMsg.pipe(Object(filter["a" /* filter */])(function(_ref){var _ref$type=Object(slicedToArray["a" /* default */])(_ref.type,2),category=_ref$type[1];return category===lib["Msg"].Category.InputChange;}),Object(map["a" /* map */])(function(_ref2){var content=_ref2.content;return content;}),Object(throttleTime["a" /* throttleTime */])(100,scheduler_async["b" /* asyncScheduler */],{leading:true,trailing:true}),Object(distinctUntilChanged["a" /* distinctUntilChanged */])());//eslint-disable-next-line
var editURLSchema=/^https?:\/{2}([^\/]+)\/([^\/]+)\/([^\/]+)\/edit\/([\w\W]+)/;// editURL is like https//{{host}}/{{owner}}/{{repo}}/edit/{{branch_name}}
// e.g. https://github.com/wangpin34/materials/edit/main/README.md
var $parent=$fromMsg.pipe(Object(filter["a" /* filter */])(function(_ref3){var type=_ref3.type;return type[1]===lib["Msg"].Category.Path;}),Object(map["a" /* map */])(function(_ref4){var content=_ref4.content;return content;}),Object(map["a" /* map */])(function(href){var _ref5=href.match(editURLSchema),_ref6=Object(slicedToArray["a" /* default */])(_ref5,5),host=_ref6[1],owner=_ref6[2],repo=_ref6[3],path=_ref6[4];return{host:host,owner:owner,repo:repo,path:path};}),Object(shareReplay["a" /* shareReplay */])(1),Object(take["a" /* take */])(1));var $host=$parent.pipe(Object(map["a" /* map */])(function(p){return p.host;}));var $owner=$parent.pipe(Object(map["a" /* map */])(function(p){return p.owner;}));var $repo=$parent.pipe(Object(map["a" /* map */])(function(p){return p.repo;}));// path is like {{branch_name}}{{file_path}}
var $path=$parent.pipe(Object(map["a" /* map */])(function(parent){return parent.path;}),Object(tap["a" /* tap */])(function(path){return console.log("path=".concat(path));}));
// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/@babel/runtime/helpers/esm/createForOfIteratorHelper.js
var createForOfIteratorHelper = __webpack_require__(83);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
var BehaviorSubject = __webpack_require__(144);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs/dist/esm5/internal/ReplaySubject.js
var ReplaySubject = __webpack_require__(111);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/@babel/runtime/helpers/esm/objectSpread2.js
var objectSpread2 = __webpack_require__(2);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/url-join/lib/url-join.js
var url_join = __webpack_require__(56);
var url_join_default = /*#__PURE__*/__webpack_require__.n(url_join);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/base-64/base64.js
var base64 = __webpack_require__(112);
var base64_default = /*#__PURE__*/__webpack_require__.n(base64);

// CONCATENATED MODULE: ./src/services/github/index.ts
/*
 * Author: Wang Pin <pin.wang@hp.com>
 *
 * © Copyright 2021 HP Development Company, L.P.
 */var BASE='https://api.github.com';var _baseHeaders;function getHeaders(additionHeaders){if(!_baseHeaders){_baseHeaders={//Authorization: `Basic ${base64.encode(`${getUsername()}:${getPassword()}`)}`,
};}return additionHeaders?Object(objectSpread2["a" /* default */])(Object(objectSpread2["a" /* default */])({},additionHeaders),_baseHeaders):Object(objectSpread2["a" /* default */])({},_baseHeaders);}function makeURL(){for(var _len=arguments.length,parts=new Array(_len),_key=0;_key<_len;_key++){parts[_key]=arguments[_key];}return new URL(url_join_default.a.apply(void 0,[''].concat(parts)),BASE).toString();}function get(_x,_x2){return _get.apply(this,arguments);}function _get(){_get=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee(from,options){var _options$query;var query;return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:query=options===null||options===void 0?void 0:(_options$query=options.query)===null||_options$query===void 0?void 0:_options$query.toString();return _context.abrupt("return",fetch(makeURL(from,query?"?".concat(query):''),{method:'GET',headers:getHeaders(options&&options.headers)}));case 2:case"end":return _context.stop();}}},_callee);}));return _get.apply(this,arguments);}function getRepoContents(_x3,_x4,_x5){return _getRepoContents.apply(this,arguments);}function _getRepoContents(){_getRepoContents=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee2(path,repo,branch){return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:return _context2.abrupt("return",get(url_join_default()('/repos',repo,'contents',path),{query:new URLSearchParams([['branch',branch]]),headers:{Accept:'application/vnd.github.VERSION.raw'}}));case 1:case"end":return _context2.stop();}}},_callee2);}));return _getRepoContents.apply(this,arguments);}function getJson(_x6,_x7){return _getJson.apply(this,arguments);}function _getJson(){_getJson=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee3(path,options){var resp,body;return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.prev=0;_context3.next=3;return get(path,options);case 3:resp=_context3.sent;if(!(resp.status<400&&resp.headers.get('content-type').indexOf('application/json')>-1)){_context3.next=11;break;}_context3.next=7;return resp.json();case 7:body=_context3.sent;return _context3.abrupt("return",body);case 11:_context3.t0=Error;_context3.t1="".concat(resp.status," ").concat(resp.statusText,"\n");_context3.next=15;return resp.text();case 15:_context3.t2=_context3.sent;_context3.t3=_context3.t1.concat.call(_context3.t1,_context3.t2);throw new _context3.t0(_context3.t3);case 18:_context3.next=23;break;case 20:_context3.prev=20;_context3.t4=_context3["catch"](0);throw _context3.t4;case 23:case"end":return _context3.stop();}}},_callee3,null,[[0,20]]);}));return _getJson.apply(this,arguments);}function getBranches(_x8){return _getBranches.apply(this,arguments);}function _getBranches(){_getBranches=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee4(repo){var perPage,page,_args4=arguments;return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:perPage=_args4.length>1&&_args4[1]!==undefined?_args4[1]:30;page=_args4.length>2&&_args4[2]!==undefined?_args4[2]:1;return _context4.abrupt("return",getJson(url_join_default()('/repos',repo,'branches'),{query:new URLSearchParams([['per_page',perPage+''],['page',page+'']])}));case 3:case"end":return _context4.stop();}}},_callee4);}));return _getBranches.apply(this,arguments);}function getFileContent(_x9,_x10,_x11){return _getFileContent.apply(this,arguments);}function _getFileContent(){_getFileContent=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee5(repo,from,options){var body;return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:_context5.prev=0;_context5.next=3;return getJson(url_join_default()('/repos',repo,'contents',from),options);case 3:body=_context5.sent;if(!(body.encoding==='base64')){_context5.next=8;break;}return _context5.abrupt("return",base64_default.a.decode(body.content));case 8:throw new Error("encoding format ".concat(body.encoding," is not supported"));case 9:_context5.next=14;break;case 11:_context5.prev=11;_context5.t0=_context5["catch"](0);throw _context5.t0;case 14:case"end":return _context5.stop();}}},_callee5,null,[[0,11]]);}));return _getFileContent.apply(this,arguments);}var _allTree;function getTree(_x12,_x13,_x14){return _getTree.apply(this,arguments);}function _getTree(){_getTree=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee6(repo,branch,path){var resp,regExp;return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee6$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:if(_allTree){_context6.next=5;break;}_context6.next=3;return getJson(url_join_default()('/repos',repo,'git/trees',branch),{query:new URLSearchParams([['recursive',"true"]])});case 3:resp=_context6.sent;_allTree=resp.tree;case 5:if(!path){_context6.next=8;break;}regExp=new RegExp("^".concat(path,"/"),'');return _context6.abrupt("return",_allTree.filter(function(tree){return regExp.test(tree.path);}));case 8:return _context6.abrupt("return",_allTree);case 9:case"end":return _context6.stop();}}},_callee6);}));return _getTree.apply(this,arguments);}
// CONCATENATED MODULE: ./src/states/github.ts
var github_owner=new BehaviorSubject["a" /* BehaviorSubject */]('');$owner.subscribe(github_owner);var github_repo=new BehaviorSubject["a" /* BehaviorSubject */]('');$repo.subscribe(github_repo);var $branches=new ReplaySubject["a" /* ReplaySubject */](1);Object(combineLatest["a" /* combineLatest */])([github_owner,github_repo]).pipe(Object(filter["a" /* filter */])(function(_ref){var _ref2=Object(slicedToArray["a" /* default */])(_ref,2),owner=_ref2[0],repo=_ref2[1];return!!owner&&!!repo;}),Object(map["a" /* map */])(function(_ref3){var _ref4=Object(slicedToArray["a" /* default */])(_ref3,2),owner=_ref4[0],repo=_ref4[1];return"".concat(owner,"/").concat(repo);})).subscribe(function(op){;Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee(){var branches;return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.prev=0;_context.next=3;return getBranches(op);case 3:branches=_context.sent;$branches.next(branches);_context.next=11;break;case 7:_context.prev=7;_context.t0=_context["catch"](0);console.error('failed to list branches');console.error(_context.t0);case 11:case"end":return _context.stop();}}},_callee,null,[[0,7]]);}))();});// const $tree = new ReplaySubject<Map<string, TreeNode>>(1)
// ;(async () => {
//   const tree = await getTree()
//   const map = new Map(tree.map((node) => [node.path, node]))
//   $tree.next(map)
// })()
var $branchNames=$branches.pipe(Object(filter["a" /* filter */])(function(branches){return Boolean(branches)&&branches.length>0;}),Object(map["a" /* map */])(function(branches){return branches.map(function(branch){return branch.name;});}),Object(tap["a" /* tap */])(function(names){console.log("branch list:\n");console.log(names);}),Object(map["a" /* map */])(function(names){return names.reduce(function(a,c){var segments=c.split('/').filter(function(p){return p;});var current=a;var _iterator=Object(createForOfIteratorHelper["a" /* default */])(segments),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var segName=_step.value;if(!current[segName]){current[segName]={};}current=current[segName];}}catch(err){_iterator.e(err);}finally{_iterator.f();}return a;},{});}),Object(tap["a" /* tap */])(function(nameTree){return console.log(nameTree);}));// file path is the path without branch
var $branch=Object(combineLatest["a" /* combineLatest */])([$branchNames,$path]).pipe(Object(tap["a" /* tap */])(function(_ref6){var _ref7=Object(slicedToArray["a" /* default */])(_ref6,2),branchNames=_ref7[0],path=_ref7[1];console.log('Start log $branch...\nbranchNames:\n');console.log(branchNames);console.log("path=".concat(path));console.log('End log $branch');}),Object(map["a" /* map */])(function(_ref8){var _ref9=Object(slicedToArray["a" /* default */])(_ref8,2),branchNames=_ref9[0],path=_ref9[1];// find the longest match from branch name to path, and that's is the current working branch
var pathSegs=path.split('/').filter(function(p){return p;});var i=0;var branchSegs=[];var nameTree=branchNames;while(nameTree[pathSegs[i]]){branchSegs.push(pathSegs[i]);i++;}return branchSegs.join('/');}));var $fileRelativePath=Object(combineLatest["a" /* combineLatest */])([$path,$branch]).pipe(Object(map["a" /* map */])(function(_ref10){var _ref11=Object(slicedToArray["a" /* default */])(_ref10,2),path=_ref11[0],branch=_ref11[1];return path.replace("".concat(branch,"/"),'');}));var $filePath=Object(combineLatest["a" /* combineLatest */])([$path,$branch]).pipe(Object(map["a" /* map */])(function(_ref12){var _ref13=Object(slicedToArray["a" /* default */])(_ref12,2),path=_ref13[0],branch=_ref13[1];return path.replace("".concat(branch),'');}));
// CONCATENATED MODULE: ./src/states/markdown.ts
/**
 * resolved markdown, such as replace relative path of image as public url
 */// Internal link could be relative or absolute, ends with or without .md
function computePath(path,pwd){if(path.charAt(0)==='/'){return path;}var i=0;var j=0;while(i<path.length){var indexP=path.indexOf('/',i);if(indexP<0){break;}var ep=path.slice(i,indexP);if(ep==='..'){i=indexP+1;j++;}else if(ep==='.'){i=indexP+1;}else{break;}}var resolvedPath=path.slice(i);var resolvedParent=pwd.charAt(pwd.length-1)==='/'?pwd:pwd+'/';while(j>0){resolvedParent=resolvedParent.slice(0,-1);if(resolvedParent.length<1){break;}resolvedParent=resolvedParent.slice(0,-1*resolvedParent.lastIndexOf('/'));}return"".concat(resolvedParent).concat(resolvedPath);}function getAbsolutePath(path,pwd){if(!!path&&!!pwd){if(path.charAt(0)==='/'){return path;}else{return computePath(path,pwd);}}return'/';}var linkMap=new Map();var imageRegex=/(?<=!)\[([^\[\]]+)\]\(([^\(\)]*)\)/gi;var isPublicURL=function isPublicURL(src){return /^(https?:)?\/\//.test(src);};var markdown$=new BehaviorSubject["a" /* BehaviorSubject */]('');Object(combineLatest["a" /* combineLatest */])([$input,$filePath]).pipe(Object(map["a" /* map */])(function(_ref){var _ref2=Object(slicedToArray["a" /* default */])(_ref,2),input=_ref2[0],filePath=_ref2[1];return{input:input,filePath:filePath};})).subscribe(function(_ref3){var input=_ref3.input,filePath=_ref3.filePath;;Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee2(){var links,pwd,resolvedLink,markdown;return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:links=Array.from(input.matchAll(imageRegex)).map(function(_ref5){var _ref6=Object(slicedToArray["a" /* default */])(_ref5,3),alt=_ref6[1],src=_ref6[2];return{alt:alt,src:src};});pwd=filePath===null||filePath===void 0?void 0:filePath.substring(0,filePath.lastIndexOf('/')+1);_context2.next=4;return Promise.all(links.map(/*#__PURE__*/function(){var _ref8=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee(_ref7){var alt,src,imagePath;return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:alt=_ref7.alt,src=_ref7.src;if(!isPublicURL(src)){_context.next=3;break;}return _context.abrupt("return",{alt:alt,src:src,origin:src});case 3:if(!linkMap.has(src)){_context.next=5;break;}return _context.abrupt("return",{alt:alt,src:linkMap.get(src),origin:src});case 5:imagePath=getAbsolutePath(src,pwd);linkMap.set(src,imagePath);return _context.abrupt("return",{alt:alt,src:imagePath,origin:src});case 8:case"end":return _context.stop();}}},_callee);}));return function(_x){return _ref8.apply(this,arguments);};}()));case 4:resolvedLink=_context2.sent;// modifiy markdown
markdown=input;resolvedLink.forEach(function(_ref9){var alt=_ref9.alt,src=_ref9.src,origin=_ref9.origin;markdown=markdown.replace("![".concat(alt,"](").concat(origin,")"),"![".concat(alt,"](").concat(src,")"));});markdown$.next(markdown);case 8:case"end":return _context2.stop();}}},_callee2);}))();});/* harmony default export */ var states_markdown = (markdown$);
// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/rxjs-hooks/dist/esm/use-observable.js + 1 modules
var use_observable = __webpack_require__(148);

// CONCATENATED MODULE: ./src/states/preferences.ts
var plugins$=new BehaviorSubject["a" /* BehaviorSubject */]([]);var selectedPlugin$=new BehaviorSubject["a" /* BehaviorSubject */](null);var preferences$=Object(combineLatest["a" /* combineLatest */])([plugins$,selectedPlugin$]).pipe(Object(map["a" /* map */])(function(_ref){var _ref2=Object(slicedToArray["a" /* default */])(_ref,2),plugins=_ref2[0],selectedPlugin=_ref2[1];return{plugins:plugins,selectedPlugin:selectedPlugin};}),Object(distinctUntilChanged["a" /* distinctUntilChanged */])(),Object(shareReplay["a" /* shareReplay */])(2));
// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(1);

// CONCATENATED MODULE: ./src/pages/home.tsx
var LoadState;(function(LoadState){LoadState[LoadState["Loading"]=0]="Loading";LoadState[LoadState["Loaded"]=1]="Loaded";LoadState[LoadState["Failed"]=2]="Failed";})(LoadState||(LoadState={}));var home_PluginsLoader=/*#__PURE__*/function(){function PluginsLoader(){Object(classCallCheck["a" /* default */])(this,PluginsLoader);this.cache=void 0;this.cache={};}Object(createClass["a" /* default */])(PluginsLoader,[{key:"load",value:function(){var _load=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee(plugin){var tagName,resp,text,script,_args=arguments;return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:tagName=_args.length>1&&_args[1]!==undefined?_args[1]:"markdown-renderer-".concat(plugin.id);if(!(this.cache[plugin.id]===LoadState.Loading||this.cache[plugin.id]===LoadState.Loaded)){_context.next=3;break;}return _context.abrupt("return",tagName);case 3:_context.prev=3;this.cache[plugin.id]=LoadState.Loading;_context.next=7;return fetch(plugin.url);case 7:resp=_context.sent;_context.next=10;return resp.text();case 10:text=_context.sent;script=document.createElement('script');script.type='text/javascript';script.text=text;document.body.appendChild(script);//@ts-ignore
window.setup_markdown_renderer(tagName);this.cache[plugin.id]=LoadState.Loaded;_context.next=23;break;case 19:_context.prev=19;_context.t0=_context["catch"](3);this.cache[plugin.id]=LoadState.Failed;throw _context.t0;case 23:_context.prev=23;return _context.abrupt("return",tagName);case 26:case"end":return _context.stop();}}},_callee,this,[[3,19,23,26]]);}));function load(_x){return _load.apply(this,arguments);}return load;}()},{key:"isLoaded",value:function isLoaded(plugin){return this.cache[plugin.id]===LoadState.Loaded;}},{key:"isLoading",value:function isLoading(plugin){return this.cache[plugin.id]===LoadState.Loading;}}]);return PluginsLoader;}();var pluginLoader=new home_PluginsLoader();var plugin$=Object(combineLatest["a" /* combineLatest */])([plugins$,selectedPlugin$.pipe(Object(distinctUntilChanged["a" /* distinctUntilChanged */])())]).pipe(Object(map["a" /* map */])(function(_ref){var _ref2=Object(slicedToArray["a" /* default */])(_ref,2),plugins=_ref2[0],id=_ref2[1];return plugins.find(function(p){return p.id===id;});}),Object(filter["a" /* filter */])(function(p){return!!p;}),Object(map["a" /* map */])(function(p){return p;}));function pluginToTag(plugin){return"markdown-renderer-".concat(plugin.id);}plugin$.subscribe(function(plugin){if(pluginLoader.isLoading(plugin)||pluginLoader.isLoaded(plugin)){console.debug('skip load plugin since it is loading or loaded');}else{pluginLoader.load(plugin,pluginToTag(plugin)).catch(function(err){alert(err);});}});var tag$=plugin$.pipe(Object(map["a" /* map */])(function(p){return pluginToTag(p);}));var msg$=Object(combineLatest["a" /* combineLatest */])([$owner,$repo,$branch,states_markdown.pipe(Object(distinctUntilChanged["a" /* distinctUntilChanged */])())]).pipe(Object(map["a" /* map */])(function(_ref3){var _ref4=Object(slicedToArray["a" /* default */])(_ref3,4),owner=_ref4[0],repo=_ref4[1],branch=_ref4[2],markdown=_ref4[3];return{markdown:markdown,metadata:{owner:owner,repo:repo,branch:branch}};}));function Home(){var msg=Object(use_observable["a" /* useObservable */])(function(){return msg$;});var Tag=Object(use_observable["a" /* useObservable */])(function(){return tag$;},'div');Object(react["useEffect"])(function(){sendReadySignal();},[]);return/*#__PURE__*/Object(jsx_runtime["jsx"])(_StyledDiv,{children:/*#__PURE__*/Object(jsx_runtime["jsx"])("div",{id:"renderer-box",children:/*#__PURE__*/Object(jsx_runtime["jsx"])(Tag,{markdown:msg===null||msg===void 0?void 0:msg.markdown})})});}/* harmony default export */ var home = (Home);var _StyledDiv=Object(styled_components_browser_esm["a" /* default */])("div").withConfig({displayName:"home___StyledDiv"})(["width:100%;overflow:auto;background-color:#fff;"]);
// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js + 3 modules
var toConsumableArray = __webpack_require__(95);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-bootstrap/esm/Card.js + 2 modules
var Card = __webpack_require__(64);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-bootstrap/esm/Tab.js + 1 modules
var Tab = __webpack_require__(105);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-bootstrap/esm/Tabs.js + 18 modules
var Tabs = __webpack_require__(119);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-bootstrap/esm/Button.js
var Button = __webpack_require__(98);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-bootstrap/esm/Modal.js + 30 modules
var Modal = __webpack_require__(57);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-bootstrap/esm/Form.js + 13 modules
var Form = __webpack_require__(104);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-bootstrap/esm/InputGroup.js + 1 modules
var InputGroup = __webpack_require__(65);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/md5/md5.js
var md5 = __webpack_require__(117);
var md5_default = /*#__PURE__*/__webpack_require__.n(md5);

// CONCATENATED MODULE: ./src/pages/preferences.tsx
function Plugin(_ref){var id=_ref.id,name=_ref.name,createdAt=_ref.createdAt,updatedAt=_ref.updatedAt;var selected=Object(use_observable["a" /* useObservable */])(function(){return selectedPlugin$;},null);var handleClick=Object(react["useCallback"])(function(){selectedPlugin$.next(id);},[]);return/*#__PURE__*/Object(jsx_runtime["jsx"])(_StyledCard,{onClick:handleClick,$_css:selected===id?'#f5f5f5':'#fff',children:/*#__PURE__*/Object(jsx_runtime["jsxs"])(Card["a" /* default */].Body,{children:[/*#__PURE__*/Object(jsx_runtime["jsx"])(Card["a" /* default */].Title,{children:name}),/*#__PURE__*/Object(jsx_runtime["jsxs"])(Card["a" /* default */].Text,{children:[/*#__PURE__*/Object(jsx_runtime["jsxs"])("span",{children:["created at ",createdAt.toLocaleDateString()]}),updatedAt?/*#__PURE__*/Object(jsx_runtime["jsxs"])("span",{children:["last updated at ",updatedAt.toLocaleDateString()]}):null]})]})});}function Plugins(){var plugins=Object(use_observable["a" /* useObservable */])(function(){return plugins$;},[]);var _useState=Object(react["useState"])(false),_useState2=Object(slicedToArray["a" /* default */])(_useState,2),show=_useState2[0],setShow=_useState2[1];var handleCreate=Object(react["useCallback"])(function(){return setShow(true);},[]);var handleClose=Object(react["useCallback"])(function(){return setShow(false);},[]);var _useState3=Object(react["useState"])({name:'',url:''}),_useState4=Object(slicedToArray["a" /* default */])(_useState3,2),plugin=_useState4[0],setPlugin=_useState4[1];var handleOk=Object(react["useCallback"])(function(){if(!(plugin.name&&plugin.url)){return;}var p=Object(objectSpread2["a" /* default */])(Object(objectSpread2["a" /* default */])({},plugin),{},{id:md5_default()(plugin.url),createdAt:new Date()});if(plugin){plugins$.next([].concat(Object(toConsumableArray["a" /* default */])(plugins$.value),[p]));}setPlugin({name:'',url:''});setShow(false);},[plugin]);return/*#__PURE__*/Object(jsx_runtime["jsxs"])("div",{children:[/*#__PURE__*/Object(jsx_runtime["jsxs"])("div",{children:[/*#__PURE__*/Object(jsx_runtime["jsxs"])(Modal["a" /* default */],{show:show,onHide:handleClose,children:[/*#__PURE__*/Object(jsx_runtime["jsx"])(Modal["a" /* default */].Header,{closeButton:true,children:/*#__PURE__*/Object(jsx_runtime["jsx"])(Modal["a" /* default */].Title,{children:"Create you own plugin"})}),/*#__PURE__*/Object(jsx_runtime["jsxs"])(Modal["a" /* default */].Body,{children:[/*#__PURE__*/Object(jsx_runtime["jsxs"])(InputGroup["a" /* default */],{className:"mb-3",children:[/*#__PURE__*/Object(jsx_runtime["jsx"])(InputGroup["a" /* default */].Text,{id:"basic-addon1",children:"Name"}),/*#__PURE__*/Object(jsx_runtime["jsx"])(Form["a" /* default */].Control,{placeholder:"Input a meaningful name","aria-label":"plugin-name","aria-describedby":"name of this plugin",name:"name",value:plugin===null||plugin===void 0?void 0:plugin.name,onChange:function onChange(e){return setPlugin(function(p){return Object(objectSpread2["a" /* default */])(Object(objectSpread2["a" /* default */])({},p),{},{name:e.target.value});});}})]}),/*#__PURE__*/Object(jsx_runtime["jsxs"])(InputGroup["a" /* default */],{children:[/*#__PURE__*/Object(jsx_runtime["jsx"])(InputGroup["a" /* default */].Text,{children:"URL"}),/*#__PURE__*/Object(jsx_runtime["jsx"])(Form["a" /* default */].Control,{as:"textarea","aria-label":"plugin-url",name:"url",value:plugin===null||plugin===void 0?void 0:plugin.url,onChange:function onChange(e){return setPlugin(function(p){return Object(objectSpread2["a" /* default */])(Object(objectSpread2["a" /* default */])({},p),{},{url:e.target.value});});}})]})]}),/*#__PURE__*/Object(jsx_runtime["jsxs"])(Modal["a" /* default */].Footer,{children:[/*#__PURE__*/Object(jsx_runtime["jsx"])(Button["a" /* default */],{variant:"secondary",onClick:handleClose,children:"Close"}),/*#__PURE__*/Object(jsx_runtime["jsx"])(Button["a" /* default */],{variant:"primary",onClick:handleOk,children:"Save"})]})]}),/*#__PURE__*/Object(jsx_runtime["jsx"])(Button["a" /* default */],{onClick:handleCreate,children:"Create"})]}),plugins.map(function(plugin){return/*#__PURE__*/Object(jsx_runtime["jsx"])(Plugin,Object(objectSpread2["a" /* default */])({},plugin),plugin.id);})]});}function Preferences(){return/*#__PURE__*/Object(jsx_runtime["jsxs"])(Tabs["a" /* default */],{defaultActiveKey:"plugins",id:"uncontrolled-tab-example",className:"mb-3",children:[/*#__PURE__*/Object(jsx_runtime["jsx"])(Tab["a" /* default */],{eventKey:"general",title:"General",children:"General information"}),/*#__PURE__*/Object(jsx_runtime["jsx"])(Tab["a" /* default */],{eventKey:"plugins",title:"Plugins",children:/*#__PURE__*/Object(jsx_runtime["jsx"])(Plugins,{})})]});}var _StyledCard=Object(styled_components_browser_esm["a" /* default */])(Card["a" /* default */]).withConfig({displayName:"preferences___StyledCard"})(["background-color:",";"],function(p){return p.$_css;});
// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-router-dom/index.js
var react_router_dom = __webpack_require__(99);

// EXTERNAL MODULE: C:/Users/wangpi/workspace/pengson/chrome-extension-previewer/node_modules/react-router/index.js
var react_router = __webpack_require__(9);

// CONCATENATED MODULE: ./src/states/send-msg.ts
function send_msg_send(msg){window.parent.postMessage(msg,'*');}function send_msg_sendReadySignal(){console.log('send appready signal');send_msg_send(Object(lib["makeMsg"])([lib["Msg"].From.Iframe,lib["Msg"].Category.IframeReady],true));}function sendPreferences(info){console.log('send preferences',info);send_msg_send(Object(lib["makeMsg"])([lib["Msg"].From.Iframe,lib["Msg"].Category.Preferences],info));}preferences$.subscribe(function(p){sendPreferences(p);});
// EXTERNAL MODULE: ./src/app.sass
var app = __webpack_require__(137);

// CONCATENATED MODULE: ./src/App.tsx
function Toolbar(){var plugins=Object(use_observable["a" /* useObservable */])(function(){return plugins$;},[]);return/*#__PURE__*/Object(jsx_runtime["jsxs"])("div",{children:["Toolbar",/*#__PURE__*/Object(jsx_runtime["jsx"])(react_router_dom["b" /* Link */],{to:"/",children:"Home"}),/*#__PURE__*/Object(jsx_runtime["jsx"])(react_router_dom["b" /* Link */],{to:"/preferences",children:"Preferences"}),/*#__PURE__*/Object(jsx_runtime["jsxs"])("span",{children:[plugins.length," plugins available"]})]});}function App(){return/*#__PURE__*/Object(jsx_runtime["jsx"])("main",{children:/*#__PURE__*/Object(jsx_runtime["jsxs"])(react_router_dom["a" /* BrowserRouter */],{children:[/*#__PURE__*/Object(jsx_runtime["jsx"])(Toolbar,{}),/*#__PURE__*/Object(jsx_runtime["jsx"])(react_router["c" /* Routes */],{children:/*#__PURE__*/Object(jsx_runtime["jsxs"])(react_router["a" /* Route */],{path:"/",children:[/*#__PURE__*/Object(jsx_runtime["jsx"])(react_router["a" /* Route */],{index:true,element:/*#__PURE__*/Object(jsx_runtime["jsx"])(home,{})}),/*#__PURE__*/Object(jsx_runtime["jsx"])(react_router["a" /* Route */],{path:"preferences",element:/*#__PURE__*/Object(jsx_runtime["jsx"])(Preferences,{})})]})})]})});}
// CONCATENATED MODULE: ./src/index.tsx
react_dom_default.a.render(/*#__PURE__*/Object(jsx_runtime["jsx"])(react_default.a.StrictMode,{children:/*#__PURE__*/Object(jsx_runtime["jsx"])(App,{})}),document.getElementById('root'));

/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Msg = void 0;
exports.makeMsg = makeMsg;

var _nanoid = __webpack_require__(102);

var Msg;
exports.Msg = Msg;

(function (_Msg) {
  var From;

  (function (From) {
    From[From["Content"] = 0] = "Content";
    From[From["Iframe"] = 1] = "Iframe";
    From[From["Renderer"] = 2] = "Renderer";
  })(From || (From = {}));

  _Msg.From = From;
  var Category;

  (function (Category) {
    Category[Category["CMD"] = 0] = "CMD";
    Category[Category["InputChange"] = 1] = "InputChange";
    Category[Category["Path"] = 2] = "Path";
    Category[Category["General"] = 3] = "General";
    Category[Category["IframeReady"] = 4] = "IframeReady";
    Category[Category["Preferences"] = 5] = "Preferences";
  })(Category || (Category = {}));

  _Msg.Category = Category;
  var Phase;

  (function (Phase) {
    Phase[Phase["Request"] = 0] = "Request";
    Phase[Phase["Response"] = 1] = "Response";
  })(Phase || (Phase = {}));

  _Msg.Phase = Phase;
})(Msg || (exports.Msg = Msg = {}));

function makeMsg(type, content) {
  return {
    id: (0, _nanoid.nanoid)(),
    type: type,
    content: content
  };
}

/***/ })

},[[138,"runtime-main",0]]]);
//# sourceMappingURL=main.1ac4f77f.chunk.js.map