import{AmbientLight as e,BufferGeometry as t,Color as n,DataTexture as r,DataUtils as i,Float32BufferAttribute as a,Group as o,HalfFloatType as s,LinearFilter as c,Mesh as l,MeshPhysicalMaterial as u,OrthographicCamera as d,PMREMGenerator as ee,PlaneGeometry as f,RGBAFormat as p,RepeatWrapping as m,SRGBColorSpace as h,Scene as g,ShaderChunk as _,ShaderMaterial as v,Texture as y,Vector2 as b,Vector4 as x,WebGLRenderTarget as S,WebGLRenderer as C}from"./three.module.DovdcSIR.js";var w=16,T=.115;function te(){let e=document.createElement(`canvas`);e.width=2048,e.height=1024;let t=e.getContext(`2d`),n=t.createLinearGradient(0,0,0,1024);n.addColorStop(0,`#cad5e3`),n.addColorStop(.42,`#67768b`),n.addColorStop(.6,`#4e6078`),n.addColorStop(1,`#aab9ca`),t.fillStyle=n,t.fillRect(0,0,2048,1024);function a(e,n,r,i,a){for(let o of[-2048,0,2048]){t.save(),t.translate(e+o,n),t.scale(r,i);let s=t.createRadialGradient(0,0,0,0,0,1);s.addColorStop(0,`rgba(${a},${a},${a},1)`),s.addColorStop(.46,`rgba(${a},${a},${a},.62)`),s.addColorStop(.78,`rgba(${a},${a},${a},.16)`),s.addColorStop(1,`rgba(${a},${a},${a},0)`),t.fillStyle=s,t.beginPath(),t.arc(0,0,1,0,Math.PI*2),t.fill(),t.restore()}}a(400,175,490,155,255),a(1260,200,280,100,244),a(720,715,660,100,255),a(1780,470,95,360,250),a(1265,460,32,190,234),a(1510,535,80,22,236);let o=t.getImageData(0,0,2048,1024).data,l=new Uint16Array(8388608);for(let e=0;e<o.length;e+=4){let t=(o[e]+o[e+1]+o[e+2])/765,n=t>.86?1+((t-.86)/.14)**2*7.5:1;for(let t=0;t<3;t++)l[e+t]=i.toHalfFloat((o[e+t]/255)**2.2*n);l[e+3]=i.toHalfFloat(1)}let u=new r(l,2048,1024,p,s);return u.minFilter=c,u.magFilter=c,u.wrapS=m,u.mapping=303,u.needsUpdate=!0,u}function E(e,t,n,r,i){let a=[],o=Math.max(0,e-n),s=Math.max(0,t-n),c=(e,t,n,i,o,s)=>{for(let c=0;c<r;c++){let l=c/r;a.push([e+(n-e)*l,t+(i-t)*l,o,s])}},l=(e,t,r)=>{for(let o=0;o<i;o++){let s=Math.PI/2*(r+o/i);a.push([e+n*Math.cos(s),t+n*Math.sin(s),Math.cos(s),Math.sin(s)])}};return c(e,-s,e,s,1,0),l(o,s,0),c(o,t,-o,t,0,1),l(-o,s,1),c(-e,s,-e,-s,-1,0),l(-o,-s,2),c(-o,-t,o,-t,0,-1),l(o,-s,3),a}function D(e,n,r,i){let o=Math.min(Math.max(r,.01),e,n),s=Math.max(.5,e-i),c=Math.max(.5,n-i),l=Math.max(.01,Math.min(o-i,s,c)),u=i/T,d=.195*u,ee=.08*u,f=-.12*u,p=-.235*u,m=.055*u,h=E(s,c,l,12,8),g=h.length,_=[],v=[],y=(e,t,n)=>(_.push(e,t,n),_.length/3-1),b=(e,t,n=1)=>{let r=_.length/3;for(let[r,i,a,o]of h)y((r+e*a)*n,(i+e*o)*n,t);return r},x=(e,t)=>{for(let n=0;n<g;n++){let r=(n+1)%g;v.push(e+n,t+n,t+r,e+n,t+r,e+r)}},S=y(0,0,d+m),C=-1;for(let e=1;e<=12;e++){let t=e/12,n=b(0,d+m*(1-t*t)**2,t);if(C<0)for(let e=0;e<g;e++)v.push(S,n+e,n+(e+1)%g);else x(C,n);C=n}for(let e=1;e<=6;e++){let t=Math.PI*.5*e/6,n=b(i*Math.sin(t),ee+i*Math.cos(t));x(C,n),C=n}let w=b(i,f);x(C,w),C=w;for(let e=1;e<=6;e++){let t=Math.PI*.5*e/6,n=b(i*Math.cos(t),f-i*Math.sin(t));x(C,n),C=n}let te=y(0,0,p);for(let e=0;e<g;e++)v.push(C+e,te,C+(e+1)%g);let D=new t;return D.setAttribute(`position`,new a(_,3)),D.setIndex(v),D.computeVertexNormals(),D.computeBoundingSphere(),{geometry:D,depth:d+m-p}}var ne=`
varying vec2 vUv;
uniform vec2 uRep;   // 自定义 ShaderMaterial 不会自动套 texture.repeat / texture.offset，
uniform vec2 uOff;   // 那两样只对内置材质生效。不自己乘一遍，画布就把整张画铺进平面里。
void main(){ vUv = uv * uRep + uOff; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,re=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tWall;
uniform vec4 uRects[${w}];   // 中心 xy + 半宽高 zw，世界像素
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
  for (int i = 0; i < ${w}; i++) {
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
}`,ie=`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,ae=`
varying vec2 vUv; uniform sampler2D tMap; uniform vec2 uStep; uniform float uThreshold;
vec3 sampleLight(vec2 uv){ vec3 c = texture2D(tMap, uv).rgb; float l = max(max(c.r, c.g), c.b); return c * max(l - uThreshold, 0.) / max(l, .0001); }
void main(){
  vec3 c = sampleLight(vUv) * .227027;
  c += (sampleLight(vUv + uStep * 1.384615) + sampleLight(vUv - uStep * 1.384615)) * .316216;
  c += (sampleLight(vUv + uStep * 3.230769) + sampleLight(vUv - uStep * 3.230769)) * .070270;
  gl_FragColor = vec4(c, 1.);
}`,oe=`
varying vec2 vUv; uniform sampler2D tScene; uniform sampler2D tBloom;
void main(){
  vec3 col = texture2D(tScene, vUv).rgb + texture2D(tBloom, vUv).rgb * .16;
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - .5) * .0007;
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,se=`
varying vec3 vNormal; varying vec3 vView;
void main(){
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position + normal * .0015, 1.);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`,ce=`
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
}`;async function O(t,r,i){let a=new C({canvas:t,antialias:!0,alpha:!1,powerPreference:`high-performance`});_.transmission_pars_fragment=_.transmission_pars_fragment.replace(`return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );`,`return textureLod( transmissionSamplerMap, fragCoord.xy, lod );`);let p=new g,m=new d(-1,1,1,-1,-2e3,2e3),T=new o;p.add(T),p.add(new e(`#d5ddea`,.65));let E=te(),O=new ee(a);p.environment=O.fromEquirectangular(E).texture,O.dispose();let le={uHover:{value:0},uPulse:{value:0}},k=await new Promise((e,t)=>{let n=new Image;n.onload=()=>e(n),n.onerror=()=>t(Error(`壁纸读不出来`)),n.src=r}),A=new y(k);A.colorSpace=h,A.minFilter=c,A.magFilter=c,A.generateMipmaps=!1,A.needsUpdate=!0;let j=new v({uniforms:{tWall:{value:A},uRep:{value:new b(1,1)},uOff:{value:new b(0,0)},uRects:{value:Array.from({length:w},()=>new x)},uCorner:{value:22},uCount:{value:0},...le},vertexShader:ne,fragmentShader:re,depthWrite:!0}),M=new l(new f(1,1),j);p.add(M);let N=new u({color:`#ffffff`,depthWrite:!1,envMap:p.environment,metalness:0,specularIntensity:1,specularColor:new n(1,1,1),roughness:.09,transmission:1,thickness:1,ior:1.52,dispersion:0,envMapIntensity:.95,clearcoat:.35,clearcoatRoughness:.18,attenuationColor:new n(`#eef4ff`),attenuationDistance:6}),ue=new v({uniforms:{...le,uEnvironment:{value:E}},transparent:!0,depthWrite:!1,depthTest:!0,blending:2,vertexShader:se,fragmentShader:ce,side:0}),P=new S(1,1,{type:s,depthBuffer:!0}),F=new S(1,1,{type:s,depthBuffer:!1}),I=new S(1,1,{type:s,depthBuffer:!1}),L=new g,R=new d(-1,1,1,-1,0,1),z=new v({depthWrite:!1,depthTest:!1,uniforms:{tMap:{value:null},uStep:{value:new b},uThreshold:{value:.9}},vertexShader:ie,fragmentShader:ae}),de=new v({depthWrite:!1,depthTest:!1,uniforms:{tScene:{value:P.texture},tBloom:{value:I.texture}},vertexShader:ie,fragmentShader:oe}),B=new l(new f(2,2),de);L.add(B);let V=new Map,H=new Set,fe=(e,t,n)=>{let r=Math.min(12,Math.max(5,Math.min(e,t)*.06)),i=`${Math.round(e*2)}x${Math.round(t*2)}x${Math.round(n*2)}x${Math.round(r*2)}`;H.add(i);let a=V.get(i);return a||(a=D(e/2,t/2,n,r),V.set(i,a)),a};function pe(){if(!(V.size<=48))for(let[e,t]of V){if(V.size<=48)break;H.has(e)||(t.geometry.dispose(),V.delete(e))}}let U=0,W=0,G=1,K=[],q=[],J=[],me=``,Y=!0,X=!1,Z=0,Q=performance.now(),he=0;function ge(){U=innerWidth,W=innerHeight,G=Math.min(devicePixelRatio||1,U*W>22e5?1:1.3),a.setPixelRatio(G),a.setSize(U,W,!1),a.outputColorSpace=h,a.toneMapping=0,a.toneMappingExposure=1,a.transmissionResolutionScale=.5,m.left=-U/2,m.right=U/2,m.top=W/2,m.bottom=-W/2,m.updateProjectionMatrix();let e=U*1.12,n=W*1.12,r=Math.max(e/k.naturalWidth,n/k.naturalHeight),i=k.naturalWidth*r,o=k.naturalHeight*r;A.repeat.set(e/i,n/o),A.offset.set(.62*(1-e/i),.62*(1-n/o)),j.uniforms.uRep.value.copy(A.repeat),j.uniforms.uOff.value.copy(A.offset),M.scale.set(e,n,1),M.position.set(0,0,-160),t.dataset.glassMap=[U,W,e.toFixed(1),n.toFixed(1),i.toFixed(1),o.toFixed(1),A.repeat.x.toFixed(3),A.repeat.y.toFixed(3),A.offset.x.toFixed(3),A.offset.y.toFixed(3)].join(`/`);let s=Math.round(U*G),c=Math.round(W*G);P.samples=s*c>25e5?0:2,P.setSize(s,c),F.setSize(Math.max(1,Math.round(s/3)),Math.max(1,Math.round(c/3))),I.setSize(F.width,F.height),Y=!0}function _e(){J.length=0;for(let e of document.querySelectorAll(`.g`)){if(!e.querySelector(`:scope > .fx`))continue;let t=e.getBoundingClientRect();if(t.width<24||t.height<24||t.bottom<-40||t.top>W+40||t.right<-40||t.left>U+40)continue;let n=getComputedStyle(e);if(n.visibility===`hidden`||n.display===`none`||parseFloat(n.opacity)<.04)continue;let r=parseFloat(n.borderTopLeftRadius)||22;J.push({el:e,x:t.left+t.width/2-U/2,y:-(t.top+t.height/2-W/2),w:t.width,h:t.height,r})}J.sort((e,t)=>t.w*t.h-e.w*e.h),J.length>w&&(J.length=w)}function ve(){let e=J.map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)},${e.w.toFixed(1)},${e.h.toFixed(1)},${e.r.toFixed(1)}`).join(`|`);if(e===me)return!1;me=e,he++,H.clear();let t=document.documentElement.dataset.scheme===`light`?`light`:`dark`;N.attenuationColor.set(t===`light`?`#e2ebf6`:`#26303f`),N.attenuationDistance=t===`light`?480:120,N.envMapIntensity=t===`light`?.9:.95,N.thickness=J.length?fe(J[0].w,J[0].h,J[0].r).depth:40;for(let e=0;e<J.length;e++){let t=J[e],n=fe(t.w,t.h,t.r),r=K[e];r?r.geometry!==n.geometry&&(r.geometry=n.geometry):(r=new l(n.geometry,N),r.renderOrder=2,T.add(r),K[e]=r),r.position.set(t.x,t.y,0),r.visible=!0;let i=q[e];i?i.geometry!==n.geometry&&(i.geometry=n.geometry):(i=new l(n.geometry,ue),i.renderOrder=6,T.add(i),q[e]=i),i.position.copy(r.position),i.visible=!0}for(let e=J.length;e<K.length;e++)K[e].visible=!1,q[e].visible=!1;let n=j.uniforms.uRects.value;for(let e=0;e<J.length;e++)n[e].set(J[e].x,J[e].y,J[e].w/2,J[e].h/2);j.uniforms.uCount.value=J.length;let r=J.reduce((e,t)=>Math.max(e,t.r),0);return j.uniforms.uCorner.value=r||22,pe(),Y=!0,!0}function ye(){a.setRenderTarget(P),a.render(p,m),B.material=z,z.uniforms.tMap.value=P.texture,z.uniforms.uThreshold.value=1.2,z.uniforms.uStep.value.set(2/F.width,0),a.setRenderTarget(F),a.render(L,R),z.uniforms.tMap.value=F.texture,z.uniforms.uThreshold.value=0,z.uniforms.uStep.value.set(0,2/F.height),a.setRenderTarget(I),a.render(L,R),B.material=de,a.setRenderTarget(null),a.render(L,R),Z++}function be(){if(!X)return;requestAnimationFrame(be);let e=performance.now();e-Q>1e3&&(t.dataset.glassPanels=String(J.length),t.dataset.glassFps=String(Math.round(Z*1e3/(e-Q))),t.dataset.glassChanges=String(he),Z=0,he=0,Q=e),!document.hidden&&(_e(),ve(),Y&&=(ye(),!1))}let xe=()=>{Y=!0},$=new AbortController;addEventListener(`scroll`,xe,{passive:!0,signal:$.signal}),addEventListener(`resize`,()=>{ge(),xe()},{signal:$.signal}),addEventListener(`visibilitychange`,()=>{document.hidden||xe()},{signal:$.signal}),t.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),Se(),$.abort(),i?.()}),ge(),_e(),ve(),X=!0,requestAnimationFrame(be);function Se(){X=!1}return{refresh(){ge(),_e(),ve()},dispose(){Se(),$.abort();for(let e of[...K,...q])e&&T.remove(e);for(let e of V.values())e.geometry.dispose();V.clear(),M.geometry.dispose(),P.dispose(),F.dispose(),I.dispose(),E.dispose(),p.environment&&p.environment.dispose(),A.dispose(),a.dispose()}}}export{O as createGlassLayer};