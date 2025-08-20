var b=Object.defineProperty,v=Object.defineProperties;var x=Object.getOwnPropertyDescriptors;var s=Object.getOwnPropertySymbols;var w=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var h=(e,t,o)=>t in e?b(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,a=(e,t)=>{for(var o in t||(t={}))w.call(t,o)&&h(e,o,t[o]);if(s)for(var o of s(t))C.call(t,o)&&h(e,o,t[o]);return e},n=(e,t)=>v(e,x(t));var p=(e,t)=>{var o={};for(var r in e)w.call(e,r)&&t.indexOf(r)<0&&(o[r]=e[r]);if(e!=null&&s)for(var r of s(e))t.indexOf(r)<0&&C.call(e,r)&&(o[r]=e[r]);return o};import{a1 as l}from"./index-BbtVxGeo.js";/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),A=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,o,r)=>r?r.toUpperCase():o.toLowerCase()),$=e=>{const t=A(e);return t.charAt(0).toUpperCase()+t.slice(1)},L=(...e)=>e.filter((t,o,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===o).join(" ").trim();/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var c={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=(I,{slots:u})=>{var d=I,{size:e,strokeWidth:t=2,absoluteStrokeWidth:o,color:r,iconNode:m,name:i,class:B}=d,f=p(d,["size","strokeWidth","absoluteStrokeWidth","color","iconNode","name","class"]);return l("svg",a(n(a({},c),{width:e||c.width,height:e||c.height,stroke:r||c.stroke,"stroke-width":o?Number(t)*24/Number(e):t,class:L("lucide",...i?[`lucide-${g($(i))}-icon`,`lucide-${g(i)}`]:["lucide-icon"])}),f),[...m.map(k=>l(...k)),...u.default?[u.default()]:[]])};/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=(e,t)=>(o,{slots:r})=>l(j,n(a({},o),{iconNode:t,name:e}),r);export{K as c};
