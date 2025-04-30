"use strict";(()=>{function u(t,...e){try{t(...e)}catch(n){console.error(n)}}var i=class{constructor(){this.listeners=new Set}get size(){return this.listeners.size}addListener(e){this.listeners.add(e)}removeListener(e){this.listeners.delete(e)}has(e){return this.listeners.has(e)}emit(e){for(let n of this.listeners)u(n,e)}},m=class{constructor(){this.listeners=new Map}addListener(e,n){let r=this.listeners.get(e);r===void 0&&(r=new i,this.listeners.set(e,r)),r.addListener(n)}removeListener(e,n){let r=this.listeners.get(e);r!==void 0&&(r.removeListener(n),r.size===0&&this.listeners.delete(e))}emit(e,n){let r=this.listeners.get(e);r!==void 0&&r.emit(n)}};var f=(t,e,n)=>t+(e-t)*n;function k(){let t=O(document.documentElement);if(t[3]===0&&document.body&&(t=O(document.body)),t[3]===0)return"rgb(255, 255, 255)";let e=t[3],n=f(255,t[0],e)>>0,r=f(255,t[1],e)>>0,o=f(255,t[2],e)>>0;return`rgb(${n}, ${r}, ${o})`}function O(t){return t instanceof HTMLElement?K(getComputedStyle(t).backgroundColor):[0,0,0,0]}function K(t){let e=t.indexOf("("),n=t.indexOf(")"),[r,o,l,c]=t.substring(e+1,n).split(",");return[p(r),p(o),p(l),p(c,1)]}function p(t,e=0){if(t===void 0)return e;let n=parseInt(t,10);return isNaN(n)?e:n}var g=0,h=class extends i{constructor(){super();this.timeout=void 0;this.tick=()=>{g===0&&(this.timeout=requestAnimationFrame(this.tick));let n=k();n!==this.currentColor&&(this.currentColor=n,this.emit(this.currentColor))};this.currentColor=k()}get listening(){return this.timeout!==void 0}listen(){this.listening||(g===0?this.tick():this.timeout=setInterval(this.tick,g))}stopListening(){this.listening&&(g===0?cancelAnimationFrame(this.timeout):clearInterval(this.timeout),this.timeout=void 0)}addListener(n){this.has(n)||(super.addListener(n),this.listen(),u(n,this.currentColor))}removeListener(n){super.removeListener(n),this.size===0&&this.stopListening()}};var s=new h,x={get current(){return s.currentColor},addListener:s.addListener.bind(s),removeListener:s.removeListener.bind(s)};var T=new Map;function R(t){if(T.has(t))return T.get(t)}function N(t,e){T.set(t,e)}function S(t){let e=t();if(e!==void 0)return e;let n=R(t);if(n!==void 0)return n;let r=new Promise(o=>{let l=()=>{let c=t();if(c!==void 0){o(c);return}requestAnimationFrame(l)};l()});return N(t,r),r}var $=()=>document.body??void 0,z=()=>S($),q=()=>document.head??void 0,I=()=>S(q);var b=document.createElement("style"),v=!0,V="display: block; content: ''; position: fixed; inset: 0; z-index: -999999;";async function P(t=x.current){if(!v){b.innerHTML="";return}b.innerHTML=`@layer lowest { html::before { background-color: ${t}; ${V} } }`;let e=await I();e.children[0]!==b&&e.prepend(b)}function w(){x.addListener(P)}function M(t){v!==t&&(v=t,P())}var C="chroma_dark_mode",F="enabled",D="disabled",B=document.documentElement,Y={enabled:!1,ignoreMedia:!0,defaultValue:D},a=class extends i{constructor(e){super(),this.config={...Y,...e},this.config.ignoreMedia&&this.setIgnoreMedia(!0),this.config.enabled=(localStorage.getItem(C)??this.config.defaultValue)===F,this.config.enabled&&this.enable(!0)}toggle(){this.config.enabled?this.disable():this.enable()}disable(){this.config.enabled=!1,localStorage.setItem(C,D),B.removeAttribute("data-ldm"),this.emit(this.config.enabled)}enable(e=!1){this.config.enabled=!0,e||localStorage.setItem(C,F),B.setAttribute("data-ldm",this.dataAttr),this.emit(this.config.enabled)}get dataAttr(){return`invert${this.config.ignoreMedia?"-no-media":""}`}setIgnoreMedia(e){this.config.ignoreMedia=e,this.config.enabled&&this.enable()}};var A=`<style>
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
</dialog>`;var d=class{constructor(e){this.isOpen=!1;this.handleIgnoreMediaToggle=e=>{if(!e.target)return;let r=!!e.target.checked;this.ldm.setIgnoreMedia(r),chrome.storage.sync.set({ignoreMedia:r})};this.ldm=e,this.shadowRoot=this.createElement(),this.appendToBody()}async appendToBody(){(await z()).append(this.container)}createElement(){this.container=this.container??document.createElement("div"),this.container.style.position="absolute !important",this.container.style.width="0",this.container.style.height="0",this.container.style.left="0",this.container.style.top="0";let e=this.container.attachShadow({mode:"open"});e.innerHTML=A,this.dialog=e.querySelector("dialog"),this.dialog.addEventListener("click",r=>{this.isClosed||this.isInsideElement(r.clientX,r.clientY,this.dialog)||this.close()});let n=e.querySelector("#\u2202-ignore-media");return n.checked=this.ldm.config.ignoreMedia,n.addEventListener("change",this.handleIgnoreMediaToggle),e}isOutsideElement(e,n,r){let o=r.getBoundingClientRect();return e<o.left||e>o.right||n<o.top||n>o.bottom}isInsideElement(e,n,r){return!this.isOutsideElement(e,n,r)}get isClosed(){return!this.isOpen}toggle(){this.isOpen?this.close():this.open()}open(){this.isOpen||!this.shadowRoot||(this.isOpen=!0,this.dialog.showModal())}close(){!this.isOpen||!this.shadowRoot||(this.isOpen=!1,this.dialog.close())}};var y=class extends m{constructor(){super();this.handleMessage=n=>{try{let r=JSON.parse(n.data);if(r.chroma!=="scripts"||typeof r.key!="string")return;this.emit(r.key)}catch{}};this.handleKeyPress=n=>{this.emit(n.key)};window.addEventListener("keydown",this.handleKeyPress,{capture:!0,passive:!0}),window.addEventListener("message",this.handleMessage)}destructor(){window.removeEventListener("keydown",this.handleKeyPress),window.removeEventListener("message",this.handleMessage)}};var L=new y,E=L.addListener.bind(L),ve=L.removeListener.bind(L);var H=new a,U=new d(H);w();H.addListener(M);E("\u2202",()=>H.toggle());E("\xCE",()=>U.toggle());})();
