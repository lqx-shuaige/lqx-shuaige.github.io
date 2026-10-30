import{AmbientLight as e,BufferGeometry as t,Color as n,DataTexture as r,DataUtils as i,Float32BufferAttribute as a,Group as o,HalfFloatType as s,LinearFilter as c,Mesh as l,MeshPhysicalMaterial as u,OrthographicCamera as d,PMREMGenerator as ee,PlaneGeometry as te,RGBAFormat as f,RepeatWrapping as p,SRGBColorSpace as m,Scene as h,ShaderChunk as g,ShaderMaterial as _,Texture as v,Vector2 as y,Vector4 as b,WebGLRenderTarget as ne,WebGLRenderer as x}from"./three.module.DovdcSIR.js";var S=16,C=.115;function re(){let e=document.createElement(`canvas`);e.width=2048,e.height=1024;let t=e.getContext(`2d`),n=t.createLinearGradient(0,0,0,1024);n.addColorStop(0,`#cad5e3`),n.addColorStop(.42,`#67768b`),n.addColorStop(.6,`#4e6078`),n.addColorStop(1,`#aab9ca`),t.fillStyle=n,t.fillRect(0,0,2048,1024);function a(e,n,r,i,a){for(let o of[-2048,0,2048]){t.save(),t.translate(e+o,n),t.scale(r,i);let s=t.createRadialGradient(0,0,0,0,0,1);s.addColorStop(0,`rgba(${a},${a},${a},1)`),s.addColorStop(.46,`rgba(${a},${a},${a},.62)`),s.addColorStop(.78,`rgba(${a},${a},${a},.16)`),s.addColorStop(1,`rgba(${a},${a},${a},0)`),t.fillStyle=s,t.beginPath(),t.arc(0,0,1,0,Math.PI*2),t.fill(),t.restore()}}a(400,175,490,155,255),a(1260,200,280,100,244),a(720,715,660,100,255),a(1780,470,95,360,250),a(1265,460,32,190,234),a(1510,535,80,22,236);let o=t.getImageData(0,0,2048,1024).data,l=new Uint16Array(8388608);for(let e=0;e<o.length;e+=4){let t=(o[e]+o[e+1]+o[e+2])/765,n=t>.86?1+((t-.86)/.14)**2*7.5:1;for(let t=0;t<3;t++)l[e+t]=i.toHalfFloat((o[e+t]/255)**2.2*n);l[e+3]=i.toHalfFloat(1)}let u=new r(l,2048,1024,f,s);return u.minFilter=c,u.magFilter=c,u.wrapS=p,u.mapping=303,u.needsUpdate=!0,u}function w(e,t,n,r,i){let a=[],o=Math.max(0,e-n),s=Math.max(0,t-n),c=(e,t,n,i,o,s)=>{for(let c=0;c<r;c++){let l=c/r;a.push([e+(n-e)*l,t+(i-t)*l,o,s])}},l=(e,t,r)=>{for(let o=0;o<i;o++){let s=Math.PI/2*(r+o/i);a.push([e+n*Math.cos(s),t+n*Math.sin(s),Math.cos(s),Math.sin(s)])}};return c(e,-s,e,s,1,0),l(o,s,0),c(o,t,-o,t,0,1),l(-o,s,1),c(-e,s,-e,-s,-1,0),l(-o,-s,2),c(-o,-t,o,-t,0,-1),l(o,-s,3),a}function T(e,n,r,i){let o=Math.min(Math.max(r,.01),e,n),s=Math.max(.5,e-i),c=Math.max(.5,n-i),l=Math.max(.01,Math.min(o-i,s,c)),u=i/C,d=.195*u,ee=.08*u,te=-.12*u,f=-.235*u,p=.055*u,m=w(s,c,l,12,8),h=m.length,g=[],_=[],v=(e,t,n)=>(g.push(e,t,n),g.length/3-1),y=(e,t,n=1)=>{let r=g.length/3;for(let[r,i,a,o]of m)v((r+e*a)*n,(i+e*o)*n,t);return r},b=(e,t)=>{for(let n=0;n<h;n++){let r=(n+1)%h;_.push(e+n,t+n,t+r,e+n,t+r,e+r)}},ne=v(0,0,d+p),x=-1;for(let e=1;e<=12;e++){let t=e/12,n=y(0,d+p*(1-t*t)**2,t);if(x<0)for(let e=0;e<h;e++)_.push(ne,n+e,n+(e+1)%h);else b(x,n);x=n}for(let e=1;e<=6;e++){let t=Math.PI*.5*e/6,n=y(i*Math.sin(t),ee+i*Math.cos(t));b(x,n),x=n}let S=y(i,te);b(x,S),x=S;for(let e=1;e<=6;e++){let t=Math.PI*.5*e/6,n=y(i*Math.cos(t),te-i*Math.sin(t));b(x,n),x=n}let re=v(0,0,f);for(let e=0;e<h;e++)_.push(x+e,re,x+(e+1)%h);let T=new t;return T.setAttribute(`position`,new a(g,3)),T.setIndex(_),T.computeVertexNormals(),T.computeBoundingSphere(),{geometry:T,depth:d+p-f}}var ie=`
varying vec2 vUv;
uniform vec2 uRep;   // 自定义 ShaderMaterial 不会自动套 texture.repeat / texture.offset，
uniform vec2 uOff;   // 那两样只对内置材质生效。不自己乘一遍，画布就把整张画铺进平面里。
void main(){ vUv = uv * uRep + uOff; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,ae=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tWall;
uniform vec4 uRects[${S}];   // 中心 xy + 半宽高 zw，世界像素
uniform float uCorner;
uniform int uCount;
uniform float uHover;

float roundedRect(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.) + length(max(q, 0.)) - r;
}
vec3 spectrum(float t){ return .55 + .45 * cos(6.28318 * (vec3(0., .33, .67) + t)); }

void main(){
  vec3 col = texture2D(tWall, vUv).rgb;
  for (int i = 0; i < ${S}; i++) {
    if (i >= uCount) break;
    vec4 rc = uRects[i];
    float r = min(uCorner, min(rc.z, rc.w));
    float d = roundedRect(vUv.xy - rc.xy, rc.zw, r);
    // 贴地阴影：越靠近边缘越实，源文件是 exp(-d*3.0)，距离单位换成像素后按倒角归一
    float k = 3.0 / max(rc.w * .12, 6.0);
    col *= 1. - exp(-max(d, 0.) * k) * .19;
    // 边缘那圈散开的暖光，只留在板子下半部
    float nearEdge = exp(-pow((d - .025 * rc.w) / (.10 * rc.w), 2.));
    float lower = 1. - smoothstep(-rc.w * .87, -rc.w * .27, vUv.y - rc.y);
    col += nearEdge * lower * vec3(.026, .034, .046) * (1. + uHover * .85);
    col += .004 * spectrum(float(i) * .17) * nearEdge * lower;
  }
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,oe=`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,se=`
varying vec2 vUv; uniform sampler2D tMap; uniform vec2 uStep; uniform float uThreshold;
vec3 sampleLight(vec2 uv){ vec3 c = texture2D(tMap, uv).rgb; float l = max(max(c.r, c.g), c.b); return c * max(l - uThreshold, 0.) / max(l, .0001); }
void main(){
  vec3 c = sampleLight(vUv) * .227027;
  c += (sampleLight(vUv + uStep * 1.384615) + sampleLight(vUv - uStep * 1.384615)) * .316216;
  c += (sampleLight(vUv + uStep * 3.230769) + sampleLight(vUv - uStep * 3.230769)) * .070270;
  gl_FragColor = vec4(c, 1.);
}`,ce=`
varying vec2 vUv; uniform sampler2D tScene; uniform sampler2D tBloom;
void main(){
  vec3 col = texture2D(tScene, vUv).rgb + texture2D(tBloom, vUv).rgb * .16;
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - .5) * .0007;
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,le=`
varying vec3 vNormal; varying vec3 vView;
void main(){
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position + normal * .0015, 1.);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`,ue=`
varying vec3 vNormal; varying vec3 vView;
uniform sampler2D uEnvironment; uniform float uHover; uniform float uPulse;
void main(){
  vec3 N = normalize(vNormal), V = normalize(vView);
  float ndv = clamp(dot(N, V), 0., 1.);
  float grazing = pow(max(0., 1. - ndv), 3.2);
  vec3 R = reflect(-V, N);
  vec3 worldR = normalize((vec4(R, 0.) * viewMatrix).xyz);
  float longitude = length(worldR.xz) > 1e-5 ? atan(worldR.z, worldR.x) : 0.;
  vec2 uv = vec2(longitude * .15915494 + .5, asin(clamp(worldR.y, -1., 1.)) * .31830989 + .5);
  vec3 reflected = texture2D(uEnvironment, uv).rgb;
  vec3 color = reflected * .16;
  float alpha = grazing * (.28 + uHover * .10 + uPulse * .10);
  gl_FragColor = vec4(color, max(alpha, 0.));
}`;async function E(t,r,i,a){let f=()=>{if(a?.aborted)throw new DOMException(`玻璃层初始化已取消`,`AbortError`)};f();try{await r.decode()}finally{f()}document.hidden&&(await new Promise((e,t)=>{let n=()=>{document.removeEventListener(`visibilitychange`,r),a?.removeEventListener(`abort`,i)},r=()=>{document.hidden||(n(),e())},i=()=>{n(),t(new DOMException(`玻璃层初始化已取消`,`AbortError`))};document.addEventListener(`visibilitychange`,r),a?.addEventListener(`abort`,i,{once:!0})}),f());let p=new x({canvas:t,antialias:!0,alpha:!1,powerPreference:`high-performance`});g.transmission_pars_fragment=g.transmission_pars_fragment.replace(`return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );`,`return textureLod( transmissionSamplerMap, fragCoord.xy, lod );`);let C=new h,w=new d(-1,1,1,-1,-2e3,2e3),E=new o;C.add(E),C.add(new e(`#d5ddea`,.65));let de=re(),fe=new ee(p),pe=fe.fromEquirectangular(de);C.environment=pe.texture,fe.dispose();let me={uHover:{value:0},uPulse:{value:0}},D=new v(r);D.colorSpace=m,D.minFilter=c,D.magFilter=c,D.generateMipmaps=!1,D.needsUpdate=!0;let O=new _({uniforms:{tWall:{value:D},uRep:{value:new y(1,1)},uOff:{value:new y(0,0)},uRects:{value:Array.from({length:S},()=>new b)},uCorner:{value:22},uCount:{value:0},...me},vertexShader:ie,fragmentShader:ae,depthWrite:!0}),k=new l(new te(1,1),O);C.add(k);let A=new u({color:`#ffffff`,depthWrite:!1,envMap:C.environment,metalness:0,specularIntensity:1,specularColor:new n(1,1,1),roughness:.06,transmission:1,thickness:1,ior:1.52,dispersion:.05,envMapIntensity:.95,clearcoat:.5,clearcoatRoughness:.1,attenuationColor:new n(`#eef4ff`),attenuationDistance:6}),he=new _({uniforms:{...me,uEnvironment:{value:de}},transparent:!0,depthWrite:!1,depthTest:!0,blending:2,vertexShader:le,fragmentShader:ue,side:0}),j=new ne(1,1,{type:s,depthBuffer:!0}),M=new ne(1,1,{type:s,depthBuffer:!1}),N=new ne(1,1,{type:s,depthBuffer:!1}),P=new h,ge=new d(-1,1,1,-1,0,1),F=new _({depthWrite:!1,depthTest:!1,uniforms:{tMap:{value:null},uStep:{value:new y},uThreshold:{value:.9}},vertexShader:oe,fragmentShader:se}),_e=new _({depthWrite:!1,depthTest:!1,uniforms:{tScene:{value:j.texture},tBloom:{value:N.texture}},vertexShader:oe,fragmentShader:ce}),I=new l(new te(2,2),_e);P.add(I);let L=new Map,ve=new Set,ye=(e,t,n)=>{let r=Math.min(12,Math.max(5,Math.min(e,t)*.06)),i=`${Math.round(e*2)}x${Math.round(t*2)}x${Math.round(n*2)}x${Math.round(r*2)}`;ve.add(i);let a=L.get(i);return a||(a=T(e/2,t/2,n,r),L.set(i,a)),a};function be(){if(!(L.size<=48))for(let[e,t]of L){if(L.size<=48)break;ve.has(e)||(t.geometry.dispose(),L.delete(e))}}let R=0,z=0,B=1,V=[],H=[],U=[],W=[],G=!0,K=new Set,q=new Set,xe,Se=``,J=!0,Y=!1,Ce=!1,X=0,we=0,Te=0,Ee=performance.now(),De=0;function Oe(){let e=innerWidth,n=innerHeight,i=Math.min(devicePixelRatio||1,e*n>22e5?1:1.3);if(e===R&&n===z&&i===B)return;R=e,z=n,B=i,p.setPixelRatio(B),p.setSize(R,z,!1),p.outputColorSpace=m,p.toneMapping=0,p.toneMappingExposure=1,p.transmissionResolutionScale=.5,w.left=-R/2,w.right=R/2,w.top=z/2,w.bottom=-z/2,w.updateProjectionMatrix();let a=R*1.12,o=z*1.12,s=Math.max(a/r.naturalWidth,o/r.naturalHeight),c=r.naturalWidth*s,l=r.naturalHeight*s;D.repeat.set(a/c,o/l),D.offset.set(.62*(1-a/c),.62*(1-o/l)),O.uniforms.uRep.value.copy(D.repeat),O.uniforms.uOff.value.copy(D.offset),k.scale.set(a,o,1),k.position.set(0,0,-160),t.dataset.glassMap=[R,z,a.toFixed(1),o.toFixed(1),c.toFixed(1),l.toFixed(1),D.repeat.x.toFixed(3),D.repeat.y.toFixed(3),D.offset.x.toFixed(3),D.offset.y.toFixed(3)].join(`/`);let u=Math.round(R*B),d=Math.round(z*B);j.samples=u*d>25e5?0:2,j.setSize(u,d),M.setSize(Math.max(1,Math.round(u/3)),Math.max(1,Math.round(d/3))),N.setSize(M.width,M.height),J=!0}function ke(){G=!1;let e=document.body;e!==xe&&($.disconnect(),$.observe(document.documentElement,{childList:!0,attributes:!0,attributeFilter:[`data-scheme`,`class`,`hidden`]}),e&&$.observe(e,{subtree:!0,childList:!0,attributes:!0,attributeFilter:[`class`,`hidden`,`open`,`data-open`]}),xe=e),W=Array.from(document.querySelectorAll(`.g`)).filter(e=>e.querySelector(`:scope > .fx`)),K.clear();for(let e of W)for(let t=e;t;t=t.parentElement)K.add(t);let t=new Set(W);e&&t.add(e);for(let e of q)t.has(e)||(Le.unobserve(e),q.delete(e));for(let e of t)q.has(e)||(Le.observe(e),q.add(e))}function Ae(){U.length=0;for(let e of W){let t=e.getBoundingClientRect();if(t.width<24||t.height<24||t.bottom<-40||t.top>z+40||t.right<-40||t.left>R+40)continue;let n=getComputedStyle(e);if(n.visibility===`hidden`||n.display===`none`||parseFloat(n.opacity)<.04)continue;let r=parseFloat(n.borderTopLeftRadius)||22;U.push({el:e,x:t.left+t.width/2-R/2,y:-(t.top+t.height/2-z/2),w:t.width,h:t.height,r})}U.sort((e,t)=>t.w*t.h-e.w*e.h),U.length>S&&(U.length=S)}function je(){let e=document.documentElement.dataset.scheme===`light`?`light`:`dark`,t=e+`|`+U.map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)},${e.w.toFixed(1)},${e.h.toFixed(1)},${e.r.toFixed(1)}`).join(`|`);if(t===Se)return!1;Se=t,De++,ve.clear(),A.attenuationColor.set(e===`light`?`#e2ebf6`:`#26303f`),A.attenuationDistance=e===`light`?480:120,A.envMapIntensity=e===`light`?.9:.95,A.thickness=U.length?ye(U[0].w,U[0].h,U[0].r).depth:40;for(let e=0;e<U.length;e++){let t=U[e],n=ye(t.w,t.h,t.r),r=V[e];r?r.geometry!==n.geometry&&(r.geometry=n.geometry):(r=new l(n.geometry,A),r.renderOrder=2,E.add(r),V[e]=r),r.position.set(t.x,t.y,0),r.visible=!0;let i=H[e];i?i.geometry!==n.geometry&&(i.geometry=n.geometry):(i=new l(n.geometry,he),i.renderOrder=6,E.add(i),H[e]=i),i.position.copy(r.position),i.visible=!0}for(let e=U.length;e<V.length;e++)V[e].visible=!1,H[e].visible=!1;let n=O.uniforms.uRects.value;for(let e=0;e<U.length;e++)n[e].set(U[e].x,U[e].y,U[e].w/2,U[e].h/2);O.uniforms.uCount.value=U.length;let r=U.reduce((e,t)=>Math.max(e,t.r),0);return O.uniforms.uCorner.value=r||22,be(),J=!0,!0}function Me(){p.setRenderTarget(j),p.render(C,w),I.material=F,F.uniforms.tMap.value=j.texture,F.uniforms.uThreshold.value=1.2,F.uniforms.uStep.value.set(2/M.width,0),p.setRenderTarget(M),p.render(P,ge),F.uniforms.tMap.value=M.texture,F.uniforms.uThreshold.value=0,F.uniforms.uStep.value.set(0,2/M.height),p.setRenderTarget(N),p.render(P,ge),I.material=_e,p.setRenderTarget(null),p.render(P,ge),we++,t.dataset.glassFrames=String(++Te)}function Ne(){Oe(),G&&ke(),Ae(),je(),J&&=(Me(),!1)}function Pe(){return document.getAnimations().some(e=>{if(!e.pending&&e.playState!==`running`||e.playbackRate===0)return!1;let t=e.effect?.target;return t instanceof Element&&K.has(t)})}function Z(){Y||document.hidden||X||(X=requestAnimationFrame(Ie))}function Fe(){X&&cancelAnimationFrame(X),X=0}function Ie(){X=0,!(Y||document.hidden)&&(Ne(),Pe()&&Z())}let Q=new AbortController,Le=new ResizeObserver(Z),$=new MutationObserver(e=>{Y||(e.some(e=>e.type===`childList`||e.attributeName===`class`)&&(G=!0),Z())});addEventListener(`scroll`,Z,{passive:!0,capture:!0,signal:Q.signal}),addEventListener(`resize`,Z,{signal:Q.signal}),document.addEventListener(`visibilitychange`,()=>{document.hidden?Fe():(J=!0,Z())},{signal:Q.signal});let Re=e=>{e.target instanceof Element&&(G||K.has(e.target))&&Z()};for(let e of[`transitionrun`,`transitionend`,`transitioncancel`,`animationstart`,`animationend`,`animationcancel`])document.addEventListener(e,Re,{capture:!0,signal:Q.signal});t.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),Be(),i?.()},{signal:Q.signal});let ze=window.setInterval(()=>{let e=performance.now();t.dataset.glassPanels=String(U.length),t.dataset.glassFps=String(Math.round(we*1e3/(e-Ee))),t.dataset.glassChanges=String(De),we=0,De=0,Ee=e},1e3);function Be(){if(!Ce){Ce=!0,Y=!0,Fe(),clearInterval(ze),Le.disconnect(),$.disconnect(),Q.abort(),q.clear(),K.clear(),W=[],U.length=0;for(let e of[...V,...H])e&&E.remove(e);for(let e of L.values())e.geometry.dispose();L.clear(),k.geometry.dispose(),I.geometry.dispose(),A.dispose(),he.dispose(),O.dispose(),F.dispose(),_e.dispose(),j.dispose(),M.dispose(),N.dispose(),pe.dispose(),C.environment=null,de.dispose(),D.dispose(),p.dispose()}}try{Ne(),t.dataset.glassPanels=String(U.length),t.dataset.glassFps=`0`,t.dataset.glassChanges=String(De),Pe()&&Z()}catch(e){throw Be(),e}return{refresh(){Y||(G=!0,J=!0,Z())},dispose:Be}}export{E as createGlassLayer};