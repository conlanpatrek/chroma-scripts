"use strict";(()=>{function g(n,...e){try{n(...e)}catch(t){console.error(t)}}var a=class{constructor(){this.listeners=new Set}get size(){return this.listeners.size}addListener(e){this.listeners.add(e)}removeListener(e){this.listeners.delete(e)}has(e){return this.listeners.has(e)}emit(e){for(let t of this.listeners)g(t,e)}},d=class{constructor(){this.listeners=new Map}getEmitter(e){return this.listeners.get(e)}addListener(e,t){let o=this.getEmitter(e);o===void 0&&(o=new a,this.listeners.set(e,o)),o.addListener(t)}removeListener(e,t){let o=this.getEmitter(e);o!==void 0&&(o.removeListener(t),o.size===0&&this.listeners.delete(e))}emit(e,t){let o=this.getEmitter(e);o!==void 0&&o.emit(t)}};var b=(n,e,t)=>n+(e-n)*t;function E(){let n=A(document.documentElement);if(n[3]===0&&document.body&&(n=A(document.body)),n[3]===0)return"rgb(255, 255, 255)";let e=n[3],t=b(255,n[0],e)>>0,o=b(255,n[1],e)>>0,r=b(255,n[2],e)>>0;return`rgb(${t}, ${o}, ${r})`}function A(n){return n instanceof HTMLElement?Y(getComputedStyle(n).backgroundColor):[0,0,0,0]}function Y(n){let e=n.indexOf("("),t=n.indexOf(")"),[o,r,i,h]=n.substring(e+1,t).split(",");return[y(o),y(r),y(i),y(h,1)]}function y(n,e=0){if(n===void 0)return e;let t=parseInt(n,10);return isNaN(t)?e:t}var T=0,k=class extends a{constructor(){super();this.timeout=void 0;this.tick=()=>{T===0&&(this.timeout=requestAnimationFrame(this.tick));let t=E();t!==this.currentColor&&(this.currentColor=t,this.emit(this.currentColor))};this.currentColor=E()}get listening(){return this.timeout!==void 0}listen(){this.listening||(T===0?this.tick():this.timeout=setInterval(this.tick,T))}stopListening(){this.listening&&(T===0?cancelAnimationFrame(this.timeout):clearInterval(this.timeout),this.timeout=void 0)}addListener(t){this.has(t)||(super.addListener(t),this.listen(),g(t,this.currentColor))}removeListener(t){super.removeListener(t),this.size===0&&this.stopListening()}};var c=new k,K={get current(){return c.currentColor},addListener:c.addListener.bind(c),removeListener:c.removeListener.bind(c)};var H=new Map;function U(n){if(H.has(n))return H.get(n)}function J(n,e){H.set(n,e)}function I(n){let e=n();if(e!==void 0)return e;let t=U(n);if(t!==void 0)return t;let o=new Promise(r=>{let i=()=>{let h=n();if(h!==void 0){r(h);return}requestAnimationFrame(i)};i()});return J(n,o),o}var X=()=>document.body??void 0,P=()=>I(X),j=()=>document.head??void 0,R=()=>I(j);var w=document.createElement("style"),S=!0,G="display: block; content: ''; position: fixed; inset: 0; z-index: -999999;";async function D(n=K.current){if(!S){w.innerHTML="";return}w.innerHTML=`@layer lowest { html::before { background-color: ${n}; ${G} } }`;let e=await R();e.children[0]!==w&&e.prepend(w)}function O(){K.addListener(D)}function x(n){S!==n&&(S=n,D())}var z="chroma_dark_mode",F="enabled",N="disabled",B=document.documentElement,Q={enabled:!1,ignoreMedia:!0,defaultValue:N},m=class extends a{get enabled(){return this.config.enabled}constructor(e){super(),this.config={...Q,...e},this.config.ignoreMedia&&this.setIgnoreMedia(!0),this.config.enabled=(localStorage.getItem(z)??this.config.defaultValue)===F,this.config.enabled&&this.enable(!0)}toggle(){this.config.enabled?this.disable():this.enable()}disable(e=!1){this.config.enabled=!1,e||localStorage.setItem(z,N),B.removeAttribute("data-ldm"),this.emit(this.config.enabled)}enable(e=!1){this.config.enabled=!0,e||localStorage.setItem(z,F),B.setAttribute("data-ldm",this.dataAttr),this.emit(this.config.enabled)}get dataAttr(){return`invert${this.config.ignoreMedia?"-no-media":""}`}setIgnoreMedia(e){this.config.ignoreMedia=e,this.config.enabled&&this.enable()}};var u="scripts";var l=class extends d{constructor(){super();this.children=new Set;window.addEventListener("message",t=>{let o=t.data.chroma;if(o!==o)return;let r=t.data.type;if(!r)return;let i=`handle${r[0]?.toUpperCase()+r.substring(1)}`;typeof this[i]=="function"&&this[i](t.data.payload,t)})}createMessage(t,o){return{chroma:u,type:t,payload:o}}broadcast(t,o){let r=this.createMessage(t,o);for(let i of this.children)i.postMessage(r)}send(t,o,r){let i=this.createMessage(t,o);r.postMessage(i)}};var v=class extends l{constructor(){super(),this.children.add(window.top),window.addEventListener("pagehide",()=>{window.top?.postMessage({chroma:u,type:"childRemoved"})}),window.top?.postMessage({chroma:u,type:"childAdded"})}handleDarkmode(e){this.emit("darkmode",e)}};var V=`<style>
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
            display 0.1s allow-discrete,
            overlay 0.1s allow-discrete,
            opacity 0.1s ease-in-out,
            transform 0.1s ease-in-out;

        transform: translateY(10px);
        opacity: 0;
    }

    .\u2202::backdrop {
        transition:
            background-color 0.1s ease-in-out,
            backdrop-filter 0.1s ease-in-out;
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
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
    }

    .\u2202-content {
        all: unset;
    }

    .\u2202-content h4 {
        display: block;
        margin-bottom: 2em;
        font-size: 0.8em;
        text-align: center;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: #7fadc4;
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
        margin-top: 2em;
        border-radius: 4px;
        background: #222;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.8em;
    }
</style>

<dialog class="\u2202">
    <form method="dialog" class="\u2202-content">
        <h4>Lazy Settings</h4>
        <label>
            <input type="checkbox" id="\u2202-ignore-media"/>
            Preserve images and videos
        </label>
        <button>Close</button>
    </form>
</dialog>`;var f=class{constructor(e){this.isOpen=!1;this.handleIgnoreMediaToggle=e=>{if(!e.target)return;let o=!!e.target.checked;this.ldm.setIgnoreMedia(o),chrome.storage.sync.set({ignoreMedia:o})};this.ldm=e,this.shadowRoot=this.createElement(),this.appendToBody()}async appendToBody(){(await P()).append(this.container)}createElement(){this.container=this.container??document.createElement("div"),this.container.style.position="absolute !important",this.container.style.width="0",this.container.style.height="0",this.container.style.left="0",this.container.style.top="0";let e=this.container.attachShadow({mode:"open"});e.innerHTML=V,this.dialog=e.querySelector("dialog"),this.dialog.addEventListener("click",o=>{this.isClosed||this.isInsideElement(o.clientX,o.clientY,this.dialog)||this.close()});let t=e.querySelector("#\u2202-ignore-media");return t.checked=this.ldm.config.ignoreMedia,t.addEventListener("change",this.handleIgnoreMediaToggle),e}isOutsideElement(e,t,o){let r=o.getBoundingClientRect();return e<r.left||e>r.right||t<r.top||t>r.bottom}isInsideElement(e,t,o){return!this.isOutsideElement(e,t,o)}get isClosed(){return!this.isOpen}toggle(){this.isOpen?this.close():this.open()}open(){this.isOpen||!this.shadowRoot||(this.isOpen=!0,this.dialog.showModal())}close(){!this.isOpen||!this.shadowRoot||(this.isOpen=!1,this.dialog.close())}};var L=class extends l{handleChildAdded(e,t){t.source&&(this.children.add(t.source),this.emit("childAdded",t.source))}handleChildRemoved(e,t){t.source&&(this.children.delete(t.source),this.emit("childRemoved",t.source))}handleKey(e){this.emit("key",e)}};var M=class extends d{constructor(){super();this.handleMessage=t=>{try{let o=JSON.parse(t.data);if(o.chroma!=="scripts"||typeof o.key!="string")return;this.emit(o.key)}catch{}};this.handleKeyPress=t=>{this.emit(t.key)};window.addEventListener("keydown",this.handleKeyPress,{capture:!0,passive:!0}),window.addEventListener("message",this.handleMessage)}destructor(){window.removeEventListener("keydown",this.handleKeyPress),window.removeEventListener("message",this.handleMessage)}};var C=new M,p=C.addListener.bind(C),$e=C.removeListener.bind(C);function $(){return window.self===window.top}var s=new m,_=new f(s);O();var Z=$();async function ee(){if(Z)return q();try{return await te()}catch{}q()}ee();function q(){let n=new L;n.addListener("childAdded",e=>n.send("darkmode",s.enabled,e)),n.addListener("key",e=>{if(e==="\u2202")return s.toggle();if(e==="\xCE")return _.toggle()}),s.addListener(x),s.addListener(e=>n.broadcast("darkmode",e)),p("\u2202",()=>s.toggle()),p("\xCE",()=>_.toggle())}async function te(){let n=new v;s.addListener(x),n.addListener("darkmode",e=>{e?s.enable(!0):s.disable(!0)}),p("\u2202",()=>n.broadcast("key","\u2202")),p("\xCE",()=>n.broadcast("key","\xCE"))}})();
