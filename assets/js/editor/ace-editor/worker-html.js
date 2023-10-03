"no use strict";(function(e){if(typeof e.window!="undefined"&&e.document)return;e.console=function(){var e=Array.prototype.slice.call(arguments,0);postMessage({type:"log",data:e})},e.console.error=e.console.warn=e.console.log=e.console.trace=e.console,e.window=e,e.ace=e,e.onerror=function(e,t,n,r,i){postMessage({type:"error",data:{message:e,file:t,line:n,col:r,stack:i.stack}})},e.normalizeModule=function(t,n){if(n.indexOf("!")!==-1){var r=n.split("!");return e.normalizeModule(t,r[0])+"!"+e.normalizeModule(t,r[1])}if(n.charAt(0)=="."){var i=t.split("/").slice(0,-1).join("/");n=(i?i+"/":"")+n;while(n.indexOf(".")!==-1&&s!=n){var s=n;n=n.replace(/^\.\//,"").replace(/\/\.\//,"/").replace(/[^\/]+\/\.\.\//,"")}}return n},e.require=function(t,n){n||(n=t,t=null);if(!n.charAt)throw new Error("worker.js require() accepts only (parentId, id) as arguments");n=e.normalizeModule(t,n);var r=e.require.modules[n];if(r)return r.initialized||(r.initialized=!0,r.exports=r.factory().exports),r.exports;var i=n.split("/");if(!e.require.tlns)return console.log("unable to load "+n);i[0]=e.require.tlns[i[0]]||i[0];var s=i.join("/")+".js";return e.require.id=n,importScripts(s),e.require(t,n)},e.require.modules={},e.require.tlns={},e.define=function(t,n,r){arguments.length==2?(r=n,typeof t!="string"&&(n=t,t=e.require.id)):arguments.length==1&&(r=t,n=[],t=e.require.id);if(typeof r!="function"){e.require.modules[t]={exports:r,initialized:!0};return}n.length||(n=["require","exports","module"]);var i=function(n){return e.require(t,n)};e.require.modules[t]={exports:{},factory:function(){var e=this,t=r.apply(this,n.map(function(t){switch(t){case"require":return i;case"exports":return e.exports;case"module":return e;default:return i(t)}}));return t&&(e.exports=t),e}}},e.define.amd={},e.initBaseUrls=function(t){require.tlns=t},e.initSender=function(){var n=e.require("ace/lib/event_emitter").EventEmitter,r=e.require("ace/lib/oop"),i=function(){};return function(){r.implement(this,n),this.callback=function(e,t){postMessage({type:"call",id:t,data:e})},this.emit=function(e,t){postMessage({type:"event",name:e,data:t})}}.call(i.prototype),new i};var t=e.main=null,n=e.sender=null;e.onmessage=function(r){var i=r.data;if(i.command){if(!t[i.command])throw new Error("Unknown command:"+i.command);t[i.command].apply(t,i.args)}else if(i.init){initBaseUrls(i.tlns),require("ace/lib/es5-shim"),n=e.sender=initSender();var s=require(i.module)[i.classname];t=e.main=new s(n)}else i.event&&n&&n._signal(i.event,i.data)}})(this),define("ace/lib/oop",["require","exports","module"],function(e,t,n){"use strict";t.inherits=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})},t.mixin=function(e,t){for(var n in t)e[n]=t[n];return e},t.implement=function(e,n){t.mixin(e,n)}}),define("ace/lib/lang",["require","exports","module"],function(e,t,n){"use strict";t.last=function(e){return e[e.length-1]},t.stringReverse=function(e){return e.split("").reverse().join("")},t.stringRepeat=function(e,t){var n="";while(t>0){t&1&&(n+=e);if(t>>=1)e+=e}return n};var r=/^\s\s*/,i=/\s\s*$/;t.stringTrimLeft=function(e){return e.replace(r,"")},t.stringTrimRight=function(e){return e.replace(i,"")},t.copyObject=function(e){var t={};for(var n in e)t[n]=e[n];return t},t.copyArray=function(e){var t=[];for(var n=0,r=e.length;n<r;n++)e[n]&&typeof e[n]=="object"?t[n]=this.copyObject(e[n]):t[n]=e[n];return t},t.deepCopy=function(e){if(typeof e!="object"||!e)return e;var n=e.constructor;if(n===RegExp)return e;var r=n();for(var i in e)typeof e[i]=="object"?r[i]=t.deepCopy(e[i]):r[i]=e[i];return r},t.arrayToMap=function(e){var t={};for(var n=0;n<e.length;n++)t[e[n]]=1;return t},t.createMap=function(e){var t=Object.create(null);for(var n in e)t[n]=e[n];return t},t.arrayRemove=function(e,t){for(var n=0;n<=e.length;n++)t===e[n]&&e.splice(n,1)},t.escapeRegExp=function(e){return e.replace(/([.*+?^${}()|[\]\/\\])/g,"\\$1")},t.escapeHTML=function(e){return e.replace(/&/g,"&#38;").replace(/"/g,"&#34;").replace(/'/g,"&#39;").replace(/</g,"&#60;")},t.getMatchOffsets=function(e,t){var n=[];return e.replace(t,function(e){n.push({offset:arguments[arguments.length-2],length:e.length})}),n},t.deferredCall=function(e){var t=null,n=function(){t=null,e()},r=function(e){return r.cancel(),t=setTimeout(n,e||0),r};return r.schedule=r,r.call=function(){return this.cancel(),e(),r},r.cancel=function(){return clearTimeout(t),t=null,r},r.isPending=function(){return t},r},t.delayedCall=function(e,t){var n=null,r=function(){n=null,e()},i=function(e){n==null&&(n=setTimeout(r,e||t))};return i.delay=function(e){n&&clearTimeout(n),n=setTimeout(r,e||t)},i.schedule=i,i.call=function(){this.cancel(),e()},i.cancel=function(){n&&clearTimeout(n),n=null},i.isPending=function(){return n},i}}),define("ace/lib/event_emitter",["require","exports","module"],function(e,t,n){"use strict";var r={},i=function(){this.propagationStopped=!0},s=function(){this.defaultPrevented=!0};r._emit=r._dispatchEvent=function(e,t){this._eventRegistry||(this._eventRegistry={}),this._defaultHandlers||(this._defaultHandlers={});var n=this._eventRegistry[e]||[],r=this._defaultHandlers[e];if(!n.length&&!r)return;if(typeof t!="object"||!t)t={};t.type||(t.type=e),t.stopPropagation||(t.stopPropagation=i),t.preventDefault||(t.preventDefault=s),n=n.slice();for(var o=0;o<n.length;o++){n[o](t,this);if(t.propagationStopped)break}if(r&&!t.defaultPrevented)return r(t,this)},r._signal=function(e,t){var n=(this._eventRegistry||{})[e];if(!n)return;n=n.slice();for(var r=0;r<n.length;r++)n[r](t,this)},r.once=function(e,t){var n=this;t&&this.addEventListener(e,function r(){n.removeEventListener(e,r),t.apply(null,arguments)})},r.setDefaultHandler=function(e,t){var n=this._defaultHandlers;n||(n=this._defaultHandlers={_disabled_:{}});if(n[e]){var r=n[e],i=n._disabled_[e];i||(n._disabled_[e]=i=[]),i.push(r);var s=i.indexOf(t);s!=-1&&i.splice(s,1)}n[e]=t},r.removeDefaultHandler=function(e,t){var n=this._defaultHandlers;if(!n)return;var r=n._disabled_[e];if(n[e]==t){var i=n[e];r&&this.setDefaultHandler(e,r.pop())}else if(r){var s=r.indexOf(t);s!=-1&&r.splice(s,1)}},r.on=r.addEventListener=function(e,t,n){this._eventRegistry=this._eventRegistry||{};var r=this._eventRegistry[e];return r||(r=this._eventRegistry[e]=[]),r.indexOf(t)==-1&&r[n?"unshift":"push"](t),t},r.off=r.removeListener=r.removeEventListener=function(e,t){this._eventRegistry=this._eventRegistry||{};var n=this._eventRegistry[e];if(!n)return;var r=n.indexOf(t);r!==-1&&n.splice(r,1)},r.removeAllListeners=function(e){this._eventRegistry&&(this._eventRegistry[e]=[])},t.EventEmitter=r}),define("ace/range",["require","exports","module"],function(e,t,n){"use strict";var r=function(e,t){return e.row-t.row||e.column-t.column},i=function(e,t,n,r){this.start={row:e,column:t},this.end={row:n,column:r}};(function(){this.isEqual=function(e){return this.start.row===e.start.row&&this.end.row===e.end.row&&this.start.column===e.start.column&&this.end.column===e.end.column},this.toString=function(){return"Range: ["+this.start.row+"/"+this.start.column+"] -> ["+this.end.row+"/"+this.end.column+"]"},this.contains=function(e,t){return this.compare(e,t)==0},this.compareRange=function(e){var t,n=e.end,r=e.start;return t=this.compare(n.row,n.column),t==1?(t=this.compare(r.row,r.column),t==1?2:t==0?1:0):t==-1?-2:(t=this.compare(r.row,r.column),t==-1?-1:t==1?42:0)},this.comparePoint=function(e){return this.compare(e.row,e.column)},this.containsRange=function(e){return this.comparePoint(e.start)==0&&this.comparePoint(e.end)==0},this.intersects=function(e){var t=this.compareRange(e);return t==-1||t==0||t==1},this.isEnd=function(e,t){return this.end.row==e&&this.end.column==t},this.isStart=function(e,t){return this.start.row==e&&this.start.column==t},this.setStart=function(e,t){typeof e=="object"?(this.start.column=e.column,this.start.row=e.row):(this.start.row=e,this.start.column=t)},this.setEnd=function(e,t){typeof e=="object"?(this.end.column=e.column,this.end.row=e.row):(this.end.row=e,this.end.column=t)},this.inside=function(e,t){return this.compare(e,t)==0?this.isEnd(e,t)||this.isStart(e,t)?!1:!0:!1},this.insideStart=function(e,t){return this.compare(e,t)==0?this.isEnd(e,t)?!1:!0:!1},this.insideEnd=function(e,t){return this.compare(e,t)==0?this.isStart(e,t)?!1:!0:!1},this.compare=function(e,t){return!this.isMultiLine()&&e===this.start.row?t<this.start.column?-1:t>this.end.column?1:0:e<this.start.row?-1:e>this.end.row?1:this.start.row===e?t>=this.start.column?0:-1:this.end.row===e?t<=this.end.column?0:1:0},this.compareStart=function(e,t){return this.start.row==e&&this.start.column==t?-1:this.compare(e,t)},this.compareEnd=function(e,t){return this.end.row==e&&this.end.column==t?1:this.compare(e,t)},this.compareInside=function(e,t){return this.end.row==e&&this.end.column==t?1:this.start.row==e&&this.start.column==t?-1:this.compare(e,t)},this.clipRows=function(e,t){if(this.end.row>t)var n={row:t+1,column:0};else if(this.end.row<e)var n={row:e,column:0};if(this.start.row>t)var r={row:t+1,column:0};else if(this.start.row<e)var r={row:e,column:0};return i.fromPoints(r||this.start,n||this.end)},this.extend=function(e,t){var n=this.compare(e,t);if(n==0)return this;if(n==-1)var r={row:e,column:t};else var s={row:e,column:t};return i.fromPoints(r||this.start,s||this.end)},this.isEmpty=function(){return this.start.row===this.end.row&&this.start.column===this.end.column},this.isMultiLine=function(){return this.start.row!==this.end.row},this.clone=function(){return i.fromPoints(this.start,this.end)},this.collapseRows=function(){return this.end.column==0?new i(this.start.row,0,Math.max(this.start.row,this.end.row-1),0):new i(this.start.row,0,this.end.row,0)},this.toScreenRange=function(e){var t=e.documentToScreenPosition(this.start),n=e.documentToScreenPosition(this.end);return new i(t.row,t.column,n.row,n.column)},this.moveBy=function(e,t){this.start.row+=e,this.start.column+=t,this.end.row+=e,this.end.column+=t}}).call(i.prototype),i.fromPoints=function(e,t){return new i(e.row,e.column,t.row,t.column)},i.comparePoints=r,i.comparePoints=function(e,t){return e.row-t.row||e.column-t.column},t.Range=i}),define("ace/anchor",["require","exports","module","ace/lib/oop","ace/lib/event_emitter"],function(e,t,n){"use strict";var r=e("./lib/oop"),i=e("./lib/event_emitter").EventEmitter,s=t.Anchor=function(e,t,n){this.$onChange=this.onChange.bind(this),this.attach(e),typeof n=="undefined"?this.setPosition(t.row,t.column):this.setPosition(t,n)};(function(){r.implement(this,i),this.getPosition=function(){return this.$clipPositionToDocument(this.row,this.column)},this.getDocument=function(){return this.document},this.$insertRight=!1,this.onChange=function(e){var t=e.data,n=t.range;if(n.start.row==n.end.row&&n.start.row!=this.row)return;if(n.start.row>this.row)return;if(n.start.row==this.row&&n.start.column>this.column)return;var r=this.row,i=this.column,s=n.start,o=n.end;if(t.action==="insertText")if(s.row===r&&s.column<=i){if(s.column!==i||!this.$insertRight)s.row===o.row?i+=o.column-s.column:(i-=s.column,r+=o.row-s.row)}else s.row!==o.row&&s.row<r&&(r+=o.row-s.row);else t.action==="insertLines"?(s.row!==r||i!==0||!this.$insertRight)&&s.row<=r&&(r+=o.row-s.row):t.action==="removeText"?s.row===r&&s.column<i?o.column>=i?i=s.column:i=Math.max(0,i-(o.column-s.column)):s.row!==o.row&&s.row<r?(o.row===r&&(i=Math.max(0,i-o.column)+s.column),r-=o.row-s.row):o.row===r&&(r-=o.row-s.row,i=Math.max(0,i-o.column)+s.column):t.action=="removeLines"&&s.row<=r&&(o.row<=r?r-=o.row-s.row:(r=s.row,i=0));this.setPosition(r,i,!0)},this.setPosition=function(e,t,n){var r;n?r={row:e,column:t}:r=this.$clipPositionToDocument(e,t);if(this.row==r.row&&this.column==r.column)return;var i={row:this.row,column:this.column};this.row=r.row,this.column=r.column,this._signal("change",{old:i,value:r})},this.detach=function(){this.document.removeEventListener("change",this.$onChange)},this.attach=function(e){this.document=e||this.document,this.document.on("change",this.$onChange)},this.$clipPositionToDocument=function(e,t){var n={};return e>=this.document.getLength()?(n.row=Math.max(0,this.document.getLength()-1),n.column=this.document.getLine(n.row).length):e<0?(n.row=0,n.column=0):(n.row=e,n.column=Math.min(this.document.getLine(n.row).length,Math.max(0,t))),t<0&&(n.column=0),n}}).call(s.prototype)}),define("ace/document",["require","exports","module","ace/lib/oop","ace/lib/event_emitter","ace/range","ace/anchor"],function(e,t,n){"use strict";var r=e("./lib/oop"),i=e("./lib/event_emitter").EventEmitter,s=e("./range").Range,o=e("./anchor").Anchor,u=function(e){this.$lines=[],e.length===0?this.$lines=[""]:Array.isArray(e)?this._insertLines(0,e):this.insert({row:0,column:0},e)};(function(){r.implement(this,i),this.setValue=function(e){var t=this.getLength();this.remove(new s(0,0,t,this.getLine(t-1).length)),this.insert({row:0,column:0},e)},this.getValue=function(){return this.getAllLines().join(this.getNewLineCharacter())},this.createAnchor=function(e,t){return new o(this,e,t)},"aaa".split(/a/).length===0?this.$split=function(e){return e.replace(/\r\n|\r/g,"\n").split("\n")}:this.$split=function(e){return e.split(/\r\n|\r|\n/)},this.$detectNewLine=function(e){var t=e.match(/^.*?(\r\n|\r|\n)/m);this.$autoNewLine=t?t[1]:"\n",this._signal("changeNewLineMode")},this.getNewLineCharacter=function(){switch(this.$newLineMode){case"windows":return"\r\n";case"unix":return"\n";default:return this.$autoNewLine||"\n"}},this.$autoNewLine="",this.$newLineMode="auto",this.setNewLineMode=function(e){if(this.$newLineMode===e)return;this.$newLineMode=e,this._signal("changeNewLineMode")},this.getNewLineMode=function(){return this.$newLineMode},this.isNewLine=function(e){return e=="\r\n"||e=="\r"||e=="\n"},this.getLine=function(e){return this.$lines[e]||""},this.getLines=function(e,t){return this.$lines.slice(e,t+1)},this.getAllLines=function(){return this.getLines(0,this.getLength())},this.getLength=function(){return this.$lines.length},this.getTextRange=function(e){if(e.start.row==e.end.row)return this.getLine(e.start.row).substring(e.start.column,e.end.column);var t=this.getLines(e.start.row,e.end.row);t[0]=(t[0]||"").substring(e.start.column);var n=t.length-1;return e.end.row-e.start.row==n&&(t[n]=t[n].substring(0,e.end.column)),t.join(this.getNewLineCharacter())},this.$clipPosition=function(e){var t=this.getLength();return e.row>=t?(e.row=Math.max(0,t-1),e.column=this.getLine(t-1).length):e.row<0&&(e.row=0),e},this.insert=function(e,t){if(!t||t.length===0)return e;e=this.$clipPosition(e),this.getLength()<=1&&this.$detectNewLine(t);var n=this.$split(t),r=n.splice(0,1)[0],i=n.length==0?null:n.splice(n.length-1,1)[0];return e=this.insertInLine(e,r),i!==null&&(e=this.insertNewLine(e),e=this._insertLines(e.row,n),e=this.insertInLine(e,i||"")),e},this.insertLines=function(e,t){return e>=this.getLength()?this.insert({row:e,column:0},"\n"+t.join("\n")):this._insertLines(Math.max(e,0),t)},this._insertLines=function(e,t){if(t.length==0)return{row:e,column:0};while(t.length>61440){var n=this._insertLines(e,t.slice(0,61440));t=t.slice(61440),e=n.row}var r=[e,0];r.push.apply(r,t),this.$lines.splice.apply(this.$lines,r);var i=new s(e,0,e+t.length,0),o={action:"insertLines",range:i,lines:t};return this._signal("change",{data:o}),i.end},this.insertNewLine=function(e){e=this.$clipPosition(e);var t=this.$lines[e.row]||"";this.$lines[e.row]=t.substring(0,e.column),this.$lines.splice(e.row+1,0,t.substring(e.column,t.length));var n={row:e.row+1,column:0},r={action:"insertText",range:s.fromPoints(e,n),text:this.getNewLineCharacter()};return this._signal("change",{data:r}),n},this.insertInLine=function(e,t){if(t.length==0)return e;var n=this.$lines[e.row]||"";this.$lines[e.row]=n.substring(0,e.column)+t+n.substring(e.column);var r={row:e.row,column:e.column+t.length},i={action:"insertText",range:s.fromPoints(e,r),text:t};return this._signal("change",{data:i}),r},this.remove=function(e){e instanceof s||(e=s.fromPoints(e.start,e.end)),e.start=this.$clipPosition(e.start),e.end=this.$clipPosition(e.end);if(e.isEmpty())return e.start;var t=e.start.row,n=e.end.row;if(e.isMultiLine()){var r=e.start.column==0?t:t+1,i=n-1;e.end.column>0&&this.removeInLine(n,0,e.end.column),i>=r&&this._removeLines(r,i),r!=t&&(this.removeInLine(t,e.start.column,this.getLine(t).length),this.removeNewLine(e.start.row))}else this.removeInLine(t,e.start.column,e.end.column);return e.start},this.removeInLine=function(e,t,n){if(t==n)return;var r=new s(e,t,e,n),i=this.getLine(e),o=i.substring(t,n),u=i.substring(0,t)+i.substring(n,i.length);this.$lines.splice(e,1,u);var a={action:"removeText",range:r,text:o};return this._signal("change",{data:a}),r.start},this.removeLines=function(e,t){return e<0||t>=this.getLength()?this.remove(new s(e,0,t+1,0)):this._removeLines(e,t)},this._removeLines=function(e,t){var n=new s(e,0,t+1,0),r=this.$lines.splice(e,t-e+1),i={action:"removeLines",range:n,nl:this.getNewLineCharacter(),lines:r};return this._signal("change",{data:i}),r},this.removeNewLine=function(e){var t=this.getLine(e),n=this.getLine(e+1),r=new s(e,t.length,e+1,0),i=t+n;this.$lines.splice(e,2,i);var o={action:"removeText",range:r,text:this.getNewLineCharacter()};this._signal("change",{data:o})},this.replace=function(e,t){e instanceof s||(e=s.fromPoints(e.start,e.end));if(t.length==0&&e.isEmpty())return e.start;if(t==this.getTextRange(e))return e.end;this.remove(e);if(t)var n=this.insert(e.start,t);else n=e.start;return n},this.applyDeltas=function(e){for(var t=0;t<e.length;t++){var n=e[t],r=s.fromPoints(n.range.start,n.range.end);n.action=="insertLines"?this.insertLines(r.start.row,n.lines):n.action=="insertText"?this.insert(r.start,n.text):n.action=="removeLines"?this._removeLines(r.start.row,r.end.row-1):n.action=="removeText"&&this.remove(r)}},this.revertDeltas=function(e){for(var t=e.length-1;t>=0;t--){var n=e[t],r=s.fromPoints(n.range.start,n.range.end);n.action=="insertLines"?this._removeLines(r.start.row,r.end.row-1):n.action=="insertText"?this.remove(r):n.action=="removeLines"?this._insertLines(r.start.row,n.lines):n.action=="removeText"&&this.insert(r.start,n.text)}},this.indexToPosition=function(e,t){var n=this.$lines||this.getAllLines(),r=this.getNewLineCharacter().length;for(var i=t||0,s=n.length;i<s;i++){e-=n[i].length+r;if(e<0)return{row:i,column:e+n[i].length+r}}return{row:s-1,column:n[s-1].length}},this.positionToIndex=function(e,t){var n=this.$lines||this.getAllLines(),r=this.getNewLineCharacter().length,i=0,s=Math.min(e.row,n.length);for(var o=t||0;o<s;++o)i+=n[o].length+r;return i+e.column}}).call(u.prototype),t.Document=u}),define("ace/worker/mirror",["require","exports","module","ace/document","ace/lib/lang"],function(e,t,n){"use strict";var r=e("../document").Document,i=e("../lib/lang"),s=t.Mirror=function(e){this.sender=e;var t=this.doc=new r(""),n=this.deferredUpdate=i.delayedCall(this.onUpdate.bind(this)),s=this;e.on("change",function(e){t.applyDeltas(e.data);if(s.$timeout)return n.schedule(s.$timeout);s.onUpdate()})};(function(){this.$timeout=500,this.setTimeout=function(e){this.$timeout=e},this.setValue=function(e){this.doc.setValue(e),this.deferredUpdate.schedule(this.$timeout)},this.getValue=function(e){this.sender.callback(this.doc.getValue(),e)},this.onUpdate=function(){},this.isPending=function(){return this.deferredUpdate.isPending()}}).call(s.prototype)}),define("ace/mode/html/saxparser",["require","exports","module"],function(e,t,n){n.exports=function r(t,n,i){function s(u,a){if(!n[u]){if(!t[u]){var f=typeof e=="function"&&e;if(!a&&f)return f(u,!0);if(o)return o(u,!0);throw new Error("Cannot find module '"+u+"'")}var l=n[u]={exports:{}};t[u][0].call(l.exports,function(e){var n=t[u][1][e];return s(n?n:e)},l,l.exports,r,t,n,i)}return n[u].exports}var o=typeof e=="function"&&e;for(var u=0;u<i.length;u++)s(i[u]);return s}({1:[function(e,t,n){function r(e){if(e.namespaceURI==="http://www.w3.org/1999/xhtml")return e.localName==="applet"||e.localName==="caption"||e.localName==="marquee"||e.localName==="object"||e.localName==="table"||e.localName==="td"||e.localName==="th";if(e.namespaceURI==="http://www.w3.org/1998/Math/MathML")return e.localName==="mi"||e.localName==="mo"||e.localName==="mn"||e.localName==="ms"||e.localName==="mtext"||e.localName==="annotation-xml";if(e.namespaceURI==="http://www.w3.org/2000/svg")return e.localName==="foreignObject"||e.localName==="desc"||e.localName==="title"}function i(e){return r(e)||e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="ol"||e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="ul"}function s(e){return e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="table"||e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="html"}function o(e){return e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="tbody"||e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="tfoot"||e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="thead"||e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="html"}function u(e){return e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="tr"||e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="html"}function a(e){return r(e)||e.namespaceURI==="http://www.w3.org/1999/xhtml"&&e.localName==="button"}function f(e){return(e.namespaceURI!=="http://www.w3.org/1999/xhtml"||e.localName!=="optgroup")&&(e.namespaceURI!=="http://www.w3.org/1999/xhtml"||e.localName!=="option")}function l(){this.elements=[],this.rootNode=null,this.headElement=null,this.bodyElement=null}l.prototype._inScope=function(e,t){for(var n=this.elements.length-1;n>=0;n--){var r=this.elements[n];if(r.localName===e)return!0;if(t(r))return!1}},l.prototype.push=function(e){this.elements.push(e)},l.prototype.pushHtmlElement=function(e){this.rootNode=e.node,this.push(e)},l.prototype.pushHeadElement=function(e){this.headElement=e.node,this.push(e)},l.prototype.pushBodyElement=function(e){this.bodyElement=e.node,this.push(e)},l.prototype.pop=function(){return this.elements.pop()},l.prototype.remove=function(e){this.elements.splice(this.elements.indexOf(e),1)},l.prototype.popUntilPopped=function(e){var t;do t=this.pop();while(t.localName!=e)},l.prototype.popUntilTableScopeMarker=function(){while(!s(this.top))this.pop()},l.prototype.popUntilTableBodyScopeMarker=function(){while(!o(this.top))this.pop()},l.prototype.popUntilTableRowScopeMarker=function(){while(!u(this.top))this.pop()},l.prototype.item=function(e){return this.elements[e]},l.prototype.contains=function(e){return this.elements.indexOf(e)!==-1},l.prototype.inScope=function(e){return this._inScope(e,r)},l.prototype.inListItemScope=function(e){return this._inScope(e,i)},l.prototype.inTableScope=function(e){return this._inScope(e,s)},l.prototype.inButtonScope=function(e){return this._inScope(e,a)},l.prototype.inSelectScope=function(e){return this._inScope(e,f)},l.prototype.hasNumberedHeaderElementInScope=function(){for(var e=this.elements.length-1;e>=0;e--){var t=this.elements[e];if(t.isNumberedHeader())return!0;if(r(t))return!1}},l.prototype.furthestBlockForFormattingElement=function(e){var t=null;for(var n=this.elements.length-1;n>=0;n--){var r=this.elements[n];if(r.node===e)break;r.isSpecial()&&(t=r)}return t},l.prototype.findIndex=function(e){for(var t=this.elements.length-1;t>=0;t--)if(this.elements[t].localName==e)return t;return-1},l.prototype.remove_openElements_until=function(e){var t=!1,n;while(!t)n=this.elements.pop(),t=e(n);return n},Object.defineProperty(l.prototype,"top",{get:function(){return this.elements[this.elements.length-1]}}),Object.defineProperty(l.prototype,"length",{get:function(){return this.elements.length}}),n.ElementStack=l},{}],2:[function(e,t,n){function o(e){return e>="0"&&e<="9"||e>="a"&&e<="z"||e>="A"&&e<="Z"}function u(e){return e>="0"&&e<="9"||e>="a"&&e<="f"||e>="A"&&e<="F"}function a(e){return e>="0"&&e<="9"}var r=e("html5-entities"),i=e("./InputStream").InputStream,s={};Object.keys(r).forEach(function(e){for(var t=0;t<e.length;t++)s[e.substring(0,t+1)]=!0});var f={};f.consumeEntity=function(e,t,n){var f="",l="",c=e.char();if(c===i.EOF)return!1;l+=c;if(c=="	"||c=="\n"||c==""||c==" "||c=="<"||c=="&")return e.unget(l),!1;if(n===c)return e.unget(l),!1;if(c=="#"){c=e.shift(1);if(c===i.EOF)return t._parseError("expected-numeric-entity-but-got-eof"),e.unget(l),!1;l+=c;var h=10,p=a;if(c=="x"||c=="X"){h=16,p=u,c=e.shift(1);if(c===i.EOF)return t._parseError("expected-numeric-entity-but-got-eof"),e.unget(l),!1;l+=c}if(p(c)){var d="";while(c!==i.EOF&&p(c))d+=c,c=e.char();d=parseInt(d,h);var v=this.replaceEntityNumbers(d);v&&(t._parseError("invalid-numeric-entity-replaced"),d=v);if(d>65535&&d<=1114111){d-=65536;var m=((1047552&d)>>10)+55296,g=(1023&d)+56320;f=String.fromCharCode(m,g)}else f=String.fromCharCode(d);return c!==";"&&(t._parseError("numeric-entity-without-semicolon"),e.unget(c)),f}return e.unget(l),t._parseError("expected-numeric-entity"),!1}if(c>="a"&&c<="z"||c>="A"&&c<="Z"){var y="";while(s[l]){r[l]&&(y=l);if(c==";")break;c=e.char();if(c===i.EOF)break;l+=c}return y?(f=r[y],c===";"||!n||!o(c)&&c!=="="?(l.length>y.length&&e.unget(l.substring(y.length)),c!==";"&&t._parseError("named-entity-without-semicolon"),f):(e.unget(l),!1)):(t._parseError("expected-named-entity"),e.unget(l),!1)}},f.replaceEntityNumbers=function(e){switch(e){case 0:return 65533;case 19:return 16;case 128:return 8364;case 129:return 129;case 130:return 8218;case 131:return 402;case 132:return 8222;case 133:return 8230;case 134:return 8224;case 135:return 8225;case 136:return 710;case 137:return 8240;case 138:return 352;case 139:return 8249;case 140:return 338;case 141:return 141;case 142:return 381;case 143:return 143;case 144:return 144;case 145:return 8216;case 146:return 8217;case 147:return 8220;case 148:return 8221;case 149:return 8226;case 150:return 8211;case 151:return 8212;case 152:return 732;case 153:return 8482;case 154:return 353;case 155:return 8250;case 156:return 339;case 157:return 157;case 158:return 382;case 159:return 376;default:if(e>=55296&&e<=57343||e>1114111)return 65533;if(e>=1&&e<=8||e>=14&&e<=31||e>=127&&e<=159||e>=64976&&e<=65007||e==11||e==65534||e==131070||e==3145726||e==196607||e==262142||e==262143||e==327678||e==327679||e==393214||e==393215||e==458750||e==458751||e==524286||e==524287||e==589822||e==589823||e==655358||e==655359||e==720894||e==720895||e==786430||e==786431||e==851966||e==851967||e==917502||e==917503||e==983038||e==983039||e==1048574||e==1048575||e==1114110||e==1114111)return e}},n.EntityParser=f},{"./InputStream":3,"html5-entities":12}],3:[function(e,t,n){function r(){this.data="",this.start=0,this.committed=0,this.eof=!1,this.lastLocation={line:0,column:0}}r.EOF=-1,r.DRAIN=-2,r.prototype={slice:function(){if(this.start>=this.data.length){if(!this.eof)throw r.DRAIN;return r.EOF}return this.data.slice(this.start,this.data.length)},"char":function(){if(!this.eof&&this.start>=this.data.length-1)throw r.DRAIN;if(this.start>=this.data.length)return r.EOF;var e=this.data[this.start++];return e==="\r"&&(e="\n"),e},advance:function(e){this.start+=e;if(this.start>=this.data.length){if(!this.eof)throw r.DRAIN;return r.EOF}this.committed>this.data.length/2&&(this.lastLocation=this.location(),this.data=this.data.slice(this.committed),this.start=this.start-this.committed,this.committed=0)},matchWhile:function(e){if(this.eof&&this.start>=this.data.length)return"";var t=new RegExp("^"+e+"+"),n=t.exec(this.slice());if(n){if(!this.eof&&n[0].length==this.data.length-this.start)throw r.DRAIN;return this.advance(n[0].length),n[0]}return""},matchUntil:function(e){var t,n;n=this.slice();if(n===r.EOF)return"";if(t=(new RegExp(e+(this.eof?"|$":""))).exec(n)){var i=this.data.slice(this.start,this.start+t.index);return this.advance(t.index),i.replace(/\r/g,"\n").replace(/\n{2,}/g,"\n")}throw r.DRAIN},append:function(e){this.data+=e},shift:function(e){if(!this.eof&&this.start+e>=this.data.length)throw r.DRAIN;if(this.eof&&this.start>=this.data.length)return r.EOF;var t=this.data.slice(this.start,this.start+e).toString();return this.advance(Math.min(e,this.data.length-this.start)),t},peek:function(e){if(!this.eof&&this.start+e>=this.data.length)throw r.DRAIN;return this.eof&&this.start>=this.data.length?r.EOF:this.data.slice(this.start,Math.min(this.start+e,this.data.length)).toString()},length:function(){return this.data.length-this.start-1},unget:function(e){if(e===r.EOF)return;this.start-=e.length},undo:function(){this.start=this.committed},commit:function(){this.committed=this.start},location:function(){var e=this.lastLocation.line,t=this.lastLocation.column,n=this.data.slice(0,this.committed),r=n.match(/\n/g),i=r?e+r.length:e,s=r?n.length-n.lastIndexOf("\n")-1:t+n.length;return{line:i,column:s}}},n.InputStream=r},{}],4:[function(e,t,n){function i(e,t,n,r){this.localName=t,this.namespaceURI=e,this.attributes=n,this.node=r}function s(e,t){for(var n=0;n<e.attributes.length;n++)if(e.attributes[n].nodeName==t)return e.attributes[n].nodeValue;return null}var r={"http://www.w3.org/1999/xhtml":["address","applet","area","article","aside","base","basefont","bgsound","blockquote","body","br","button","caption","center","col","colgroup","dd","details","dir","div","dl","dt","embed","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","iframe","img","input","isindex","li","link","listing","main","marquee","menu","menuitem","meta","nav","noembed","noframes","noscript","object","ol","p","param","plaintext","pre","script","section","select","source","style","summary","table","tbody","td","textarea","tfoot","th","thead","title","tr","track","ul","wbr","xmp"],"http://www.w3.org/1998/Math/MathML":["mi","mo","mn","ms","mtext","annotation-xml"],"http://www.w3.org/2000/svg":["foreignObject","desc","title"]};i.prototype.isSpecial=function(){return this.namespaceURI in r&&r[this.namespaceURI].indexOf(this.localName)>-1},i.prototype.isFosterParenting=function(){return this.namespaceURI==="http://www.w3.org/1999/xhtml"?this.localName==="table"||this.localName==="tbody"||this.localName==="tfoot"||this.localName==="thead"||this.localName==="tr":!1},i.prototype.isNumberedHeader=function(){return this.namespaceURI==="http://www.w3.org/1999/xhtml"?this.localName==="h1"||this.localName==="h2"||this.localName==="h3"||this.localName==="h4"||this.localName==="h5"||this.localName==="h6":!1},i.prototype.isForeign=function(){return this.namespaceURI!="http://www.w3.org/1999/xhtml"},i.prototype.isHtmlIntegrationPoint=function(){if(this.namespaceURI==="http://www.w3.org/1998/Math/MathML"){if(this.localName!=="annotation-xml")return!1;var e=s(this,"encoding");return e?(e=e.toLowerCase(),e==="text/html"||e==="application/xhtml+xml"):!1}return this.namespaceURI==="http://www.w3.org/2000/svg"?this.localName==="foreignObject"||this.localName==="desc"||this.localName==="title":!1},i.prototype.isMathMLTextIntegrationPoint=function(){return this.namespaceURI==="http://www.w3.org/1998/Math/MathML"?this.localName==="mi"||this.localName==="mo"||this.localName==="mn"||this.localName==="ms"||this.localName==="mtext":!1},n.StackItem=i},{}],5:[function(e,t,n){function s(e){return e===" "||e==="\n"||e==="	"||e==="\r"||e==="\f"}function o(e){return e>="A"&&e<="Z"||e>="a"&&e<="z"}function u(e){this._tokenHandler=e,this._state=u.DATA,this._inputStream=new r,this._currentToken=null,this._temporaryBuffer="",this._additionalAllowedCharacter=""}var r=e("./InputStream").InputStream,i=e("./EntityParser").EntityParser;u.prototype._parseError=function(e,t){this._tokenHandler.parseError(e,t)},u.prototype._emitToken=function(e){if(e.type==="StartTag")for(var t=1;t<e.data.length;t++)e.data[t].nodeName||e.data.splice(t--,1);else e.type==="EndTag"&&(e.selfClosing&&this._parseError("self-closing-flag-on-end-tag"),e.data.length!==0&&this._parseError("attributes-in-end-tag"));this._tokenHandler.processToken(e),e.type==="StartTag"&&e.selfClosing&&!this._tokenHandler.isSelfClosingFlagAcknowledged()&&this._parseError("non-void-element-with-trailing-solidus",{name:e.name})},u.prototype._emitCurrentToken=function(){this._state=u.DATA,this._emitToken(this._currentToken)},u.prototype._currentAttribute=function(){return this._currentToken.data[this._currentToken.data.length-1]},u.prototype.setState=function(e){this._state=e},u.prototype.tokenize=function(e){function n(e){var n=e.char();if(n===r.EOF)return t._emitToken({type:"EOF",data:null}),!1;if(n==="&")t.setState(a);else if(n==="<")t.setState(j);else if(n==="\0")t._emitToken({type:"Characters",data:n}),e.commit();else{var i=e.matchUntil("&|<|\0");t._emitToken({type:"Characters",data:n+i}),e.commit()}return!0}function a(e){var r=i.consumeEntity(e,t);return t.setState(n),t._emitToken({type:"Characters",data:r||"&"}),!0}function f(e){var n=e.char();if(n===r.EOF)return t._emitToken({type:"EOF",data:null}),!1;if(n==="&")t.setState(l);else if(n==="<")t.setState(d);else if(n==="\0")t._parseError("invalid-codepoint"),t._emitToken({type:"Characters",data:"\ufffd"}),e.commit();else{var i=e.matchUntil("&|<|\0");t._emitToken({type:"Characters",data:n+i}),e.commit()}return!0}function l(e){var n=i.consumeEntity(e,t);return t.setState(f),t._emitToken({type:"Characters",data:n||"&"}),!0}function c(e){var n=e.char();if(n===r.EOF)return t._emitToken({type:"EOF",data:null}),!1;if(n==="<")t.setState(g);else if(n==="\0")t._parseError("invalid-codepoint"),t._emitToken({type:"Characters",data:"\ufffd"}),e.commit();else{var i=e.matchUntil("<|\0");t._emitToken({type:"Characters",data:n+i})}return!0}function h(e){var n=e.char();if(n===r.EOF)return t._emitToken({type:"EOF",data:null}),!1;if(n==="\0")t._parseError("invalid-codepoint"),t._emitToken({type:"Characters",data:"\ufffd"}),e.commit();else{var i=e.matchUntil("\0");t._emitToken({type:"Characters",data:n+i})}return!0}function p(e){var n=e.char();if(n===r.EOF)return t._emitToken({type:"EOF",data:null}),!1;if(n==="<")t.setState(w);else if(n==="\0")t._parseError("invalid-codepoint"),t._emitToken({type:"Characters",data:"\ufffd"}),e.commit();else{var i=e.matchUntil("<|\0");t._emitToken({type:"Characters",data:n+i})}return!0}function d(e){var n=e.char();return n==="/"?(this._temporaryBuffer="",t.setState(v)):(t._emitToken({type:"Characters",data:"<"}),e.unget(n),t.setState(f)),!0}function v(e){var n=e.char();return o(n)?(this._temporaryBuffer+=n,t.setState(m)):(t._emitToken({type:"Characters",data:"</"}),e.unget(n),t.setState(f)),!0}function m(e){var r=t._currentToken&&t._currentToken.name===this._temporaryBuffer.toLowerCase(),i=e.char();return s(i)&&r?(t._currentToken={type:"EndTag",name:this._temporaryBuffer,data:[],selfClosing:!1},t.setState(q)):i==="/"&&r?(t._currentToken={type:"EndTag",name:this._temporaryBuffer,data:[],selfClosing:!1},t.setState(K)):i===">"&&r?(t._currentToken={type:"EndTag",name:this._temporaryBuffer,data:[],selfClosing:!1},t._emitCurrentToken(),t.setState(n)):o(i)?(this._temporaryBuffer+=i,e.commit()):(t._emitToken({type:"Characters",data:"</"