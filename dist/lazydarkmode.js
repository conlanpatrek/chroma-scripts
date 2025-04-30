"use strict";(()=>{function u(t,...e){try{t(...e)}catch(n){console.error(n)}}var i=class{constructor(){this.listeners=new Set}get size(){return this.listeners.size}addListener(e){this.listeners.add(e)}removeListener(e){this.listeners.delete(e)}has(e){return this.listeners.has(e)}emit(e){for(let n of this.listeners)u(n,e)}},m=class{constructor(){this.listeners=new Map}addListener(e,n){let r=this.listeners.get(e);r===void 0&&(r=new i,this.listeners.set(e,r)),r.addListener(n)}removeListener(e,n){let r=this.listeners.get(e);r!==void 0&&(r.removeListener(n),r.size===0&&this.listeners.delete(e))}emit(e,n){let r=this.listeners.get(e);r!==void 0&&r.emit(n)}};var f=(t,e,n)=>t+(e-t)*n;function L(){let t=H(document.documentElement);if(t[3]===0&&document.body&&(t=H(document.body)),t[3]===0)return"rgb(255, 255, 255)";let e=t[3],n=f(255,t[0],e)>>0,r=f(255,t[1],e)>>0,o=f(255,t[2],e)>>0;return`rgb(${n}, ${r}, ${o})`}function H(t){return t instanceof HTMLElement?F(getComputedStyle(t).backgroundColor):[0,0,0,0]}function F(t){let e=t.indexOf("("),n=t.indexOf(")"),[r,o,l,c]=t.substring(e+1,n).split(",");return[p(r),p(o),p(l),p(c,1)]}function p(t,e=0){if(t===void 0)return e;let n=parseInt(t,10);return isNaN(n)?e:n}var A=1e3,g=class extends i{constructor(){super();this.timeout=void 0;this.tick=()=>{let n=L();n!==this.currentColor&&(this.currentColor=n,this.emit(this.currentColor))};this.currentColor=L()}get listening(){return this.timeout!==void 0}listen(){this.listening||(this.timeout=setInterval(this.tick,A))}stopListening(){this.listening&&(clearInterval(this.timeout),this.timeout=void 0)}addListener(n){this.has(n)||(super.addListener(n),this.listen(),u(n,this.currentColor))}removeListener(n){super.removeListener(n),this.size===0&&this.stopListening()}};var s=new g,T={get current(){return s.currentColor},addListener:s.addListener.bind(s),removeListener:s.removeListener.bind(s)};var k=new Map;function N(t){if(k.has(t))return k.get(t)}function $(t,e){k.set(t,e)}function z(t){let e=t();if(e!==void 0)return e;let n=N(t);if(n!==void 0)return n;let r=new Promise(o=>{let l=()=>{let c=t();if(c!==void 0){o(c);return}requestAnimationFrame(l)};l()});return $(t,r),r}var V=()=>document.body??void 0,O=()=>z(V),Y=()=>document.head??void 0,I=()=>z(Y);var h=document.createElement("style"),x=!0,_="display: block; content: ''; position: fixed; inset: 0; z-index: -999999;";async function P(t=T.current){if(!x){h.innerHTML="";return}h.innerHTML=`@layer lowest { html::before { background-color: ${t}; ${_} } }`;let e=await I();e.children[0]!==h&&e.prepend(h)}function v(){T.addListener(P)}function M(t){x!==t&&(x=t,P())}var C="chroma_dark_mode",D="enabled",B="disabled",S=document.documentElement,R={enabled:!1,ignoreMedia:!0,defaultValue:B},a=class extends i{constructor(e){super(),this.config={...R,...e},this.config.ignoreMedia&&this.setIgnoreMedia(!0),this.config.enabled=(localStorage.getItem(C)??this.config.defaultValue)===D,this.config.enabled&&this.enable(!0)}toggle(){this.config.enabled?this.disable():this.enable()}disable(){this.config.enabled=!1,localStorage.setItem(C,B),S.removeAttribute("data-ldm"),this.emit(this.config.enabled)}enable(e=!1){this.config.enabled=!0,e||localStorage.setItem(C,D),S.setAttribute("data-ldm",this.dataAttr),this.emit(this.config.enabled)}get dataAttr(){return`invert${this.config.ignoreMedia?"-no-media":""}`}setIgnoreMedia(e){this.config.ignoreMedia=e,this.config.enabled&&this.enable()}};var K=`<style>
    .\u2202, .\u2202 * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        border: none;
        background: transparent;
        font-size: inherit;
    }

    .\u2202 {
        border: none;
        transition:
            display 0.15s allow-discrete,
            overlay 0.15s allow-discrete,
            opacity 0.15s ease-in-out,
            transform 0.15s ease-in-out;

        transform: translateY(10px);
        opacity: 0;
    }

    .\u2202::backdrop {
        transition:
            background-color 0.15s ease-in-out,
            backdrop-filter 0.15s ease-in-out;
        backdrop-filter: blur(0);
        background-color: rgba(0, 0, 0, 0);
        opacity: 1;
    }

    .\u2202[open] {
        opacity: 1;
        transform: translateY(0) scale(1);

        @starting-style {
            transform: translateY(10px);
            opacity: 0;
        }
    }

    .\u2202[open]::backdrop {
        backdrop-filter: blur(20px);
        background-color: rgba(0, 0, 0, 0.05);

        @starting-style {
            backdrop-filter: blur(0);
            background-color: rgba(0, 0, 0, 0);
        }
    }

    .\u2202 {
        border-radius: 4px;
        box-shadow: 5px 10px 10px rgba(0,0,0,0.4);
        padding: 20px;
        background: #0a0a0a;
        color: white;
        margin: auto;
        font-size: 16px;
        border: 1px solid #333;
    }

    .\u2202-content {
        all: unset;
    }

    .\u2202-content strong {
        display: block;
        margin-bottom: 1em;
        font-size: 1.2em;
        color: #246789;
    }

    .\u2202-content label {
        display: block;
        margin-top: 0.4em;
    }

    .\u2202-content input {
        margin-right: 5px;
    }

    .\u2202-content button {
        display: block;
        width: 100%;
        margin: 0;
        margin-top: 1em;
        border-radius: 4px;
        background: #222;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.8em;
    }
</style>

<form method="dialog" class="\u2202-content">
    <strong>Lazy Dark Mode Setting</strong>
    <label>
        <input type="checkbox" id="\u2202-ignore-media"/>
        Preserve images and videos
    </label>
    <button>Close</button>
</form>`;var d=class{constructor(e){this.isOpen=!1;this.handleIgnoreMediaToggle=e=>{if(!e.target)return;let r=!!e.target.checked;this.ldm.setIgnoreMedia(r),chrome.storage.sync.set({ignoreMedia:r})};this.ldm=e,this.element=this.createElement(),this.appendToBody()}async appendToBody(){(await O()).append(this.element)}createElement(){let e=document.createElement("dialog");e.className="\u2202",e.innerHTML=K,e.addEventListener("click",r=>{this.isClosed||this.isInsideElement(r.clientX,r.clientY,e)||this.close()});let n=e.querySelector("#\u2202-ignore-media");return n.checked=this.ldm.config.ignoreMedia,n.addEventListener("change",this.handleIgnoreMediaToggle),e}isOutsideElement(e,n,r){let o=r.getBoundingClientRect();return e<o.left||e>o.right||n<o.top||n>o.bottom}isInsideElement(e,n,r){return!this.isOutsideElement(e,n,r)}get isClosed(){return!this.isOpen}toggle(){this.isOpen?this.close():this.open()}open(){this.isOpen||!this.element||(this.isOpen=!0,this.element.showModal())}close(){!this.isOpen||!this.element||(this.isOpen=!1,this.element.close())}};var b=class extends m{constructor(){super();this.handleMessage=n=>{try{let r=JSON.parse(n.data);if(r.chroma!=="scripts"||typeof r.key!="string")return;this.emit(r.key)}catch{}};this.handleKeyPress=n=>{this.emit(n.key)};window.addEventListener("keydown",this.handleKeyPress,{capture:!0,passive:!0}),window.addEventListener("message",this.handleMessage)}destructor(){window.removeEventListener("keydown",this.handleKeyPress),window.removeEventListener("message",this.handleMessage)}};var y=new b,w=y.addListener.bind(y),ve=y.removeListener.bind(y);var E=new a,J=new d(E);v();E.addListener(M);w("\u2202",()=>E.toggle());w("\xCE",()=>J.toggle());})();
