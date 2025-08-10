var k=Object.defineProperty;var p=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable;var u=(r,a,t)=>a in r?k(r,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[a]=t,v=(r,a)=>{for(var t in a||(a={}))M.call(a,t)&&u(r,t,a[t]);if(p)for(var t of p(a))Y.call(a,t)&&u(r,t,a[t]);return r};import{c as n}from"./createLucideIcon-D_T9sLlP.js";import{X as E,h as c,p as s,q as h,S as o,R as A,Y as T}from"./index-DSYnFDpC.js";/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=n("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=n("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=n("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=n("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=n("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=n("table",[["path",{d:"M12 3v18",key:"108xh3"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}]]),P=E("yearSettings",()=>{const r=c(""),a=c(""),t=c({}),l=c({});function m(){const e=h.value;if(!e||!e.project_name){r.value="",a.value="",t.value={};return}r.value=localStorage.getItem(o("expenseEstimateFromYear"))||"",a.value=localStorage.getItem(o("expenseEstimateToYear"))||"",t.value=JSON.parse(localStorage.getItem(o("expenseEstimateAdvancedModes"))||"{}"),l.value=JSON.parse(localStorage.getItem(o("payrollAnnualIncrementData"))||"{}")}function g(e){r.value=e,localStorage.setItem(o("expenseEstimateFromYear"),e),a.value&&parseInt(a.value)<parseInt(e)&&d("")}function d(e){a.value=e,localStorage.setItem(o("expenseEstimateToYear"),e)}function y(e,i){t.value[e]=i,localStorage.setItem(o("expenseEstimateAdvancedModes"),JSON.stringify(t.value))}function S(e){t.value=v({},e),localStorage.setItem(o("expenseEstimateAdvancedModes"),JSON.stringify(t.value))}function f(){r.value="",a.value="",t.value={},l.value={},localStorage.removeItem(o("expenseEstimateFromYear")),localStorage.removeItem(o("expenseEstimateToYear")),localStorage.removeItem(o("expenseEstimateAdvancedModes")),localStorage.removeItem(o("payrollAnnualIncrementData"))}function I(e){if(!r.value)return e;const i=parseInt(r.value);return e.filter(x=>parseInt(x)>=i)}return s(h,()=>{m()},{deep:!0}),m(),s(r,e=>localStorage.setItem(o("expenseEstimateFromYear"),e)),s(a,e=>localStorage.setItem(o("expenseEstimateToYear"),e)),s(t,e=>localStorage.setItem(o("expenseEstimateAdvancedModes"),JSON.stringify(e)),{deep:!0}),s(l,e=>localStorage.setItem(o("payrollAnnualIncrementData"),JSON.stringify(e)),{deep:!0}),{fromYear:r,toYear:a,advancedModes:t,annualIncrementData:l,setFromYear:g,setToYear:d,setAdvancedMode:y,setAdvancedModes:S,clearYearSettings:f,getFilteredToYears:I,loadProjectSettings:m,clearOldLocalStorageKeys:A,getAllProjectKeys:T}});export{J as C,q as R,D as T,N as a,L as b,F as c,P as u};
