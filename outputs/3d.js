(() => {
  const canvas = document.getElementById('city3d');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
  if (!gl) { canvas.insertAdjacentHTML('afterend','<p class="notice">This browser does not support WebGL.</p>'); return; }
  const vertex = [
    'attribute vec3 aPosition; attribute vec3 aNormal; attribute vec3 aColor;',
    'uniform mat4 uViewProjection; varying vec3 vColor;',
    'void main(){ gl_Position=uViewProjection*vec4(aPosition,1.0);',
    'float light=0.50+0.50*max(dot(normalize(aNormal),normalize(vec3(-0.4,0.85,0.55))),0.0);',
    'vColor=aColor*light; }'
  ].join('\n');
  const fragment = ['precision mediump float; varying vec3 vColor;','void main(){gl_FragColor=vec4(vColor,1.0);}'].join('\n');
  function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const pos=[],nor=[],col=[],V=(x,y,z)=>[x,y,z];
  function tri(a,b,c,k){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],m=Math.hypot(...n)||1;n=n.map(x=>x/m);for(const p of [a,b,c]){pos.push(...p);nor.push(...n);col.push(...k)}}
  function quad(a,b,c,d,k){tri(a,b,c,k);tri(a,c,d,k)}
  function box(x,y,z,w,h,d,k){const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;quad(V(x0,y0,z1),V(x1,y0,z1),V(x1,y1,z1),V(x0,y1,z1),k);quad(V(x1,y0,z0),V(x0,y0,z0),V(x0,y1,z0),V(x1,y1,z0),k);quad(V(x1,y0,z1),V(x1,y0,z0),V(x1,y1,z0),V(x1,y1,z1),k);quad(V(x0,y0,z0),V(x0,y0,z1),V(x0,y1,z1),V(x0,y1,z0),k);quad(V(x0,y1,z1),V(x1,y1,z1),V(x1,y1,z0),V(x0,y1,z0),k);quad(V(x0,y0,z0),V(x1,y0,z0),V(x1,y0,z1),V(x0,y0,z1),k)}
  function roof(x,y,z,w,h,d,k){const l=V(x-w/2,y,z+d/2),r=V(x+w/2,y,z+d/2),p=V(x,y+h,z+d/2),l2=V(x-w/2,y,z-d/2),r2=V(x+w/2,y,z-d/2),p2=V(x,y+h,z-d/2);tri(l,r,p,k);tri(r2,l2,p2,k);quad(l,l2,p2,p,k);quad(p,p2,r2,r,k)}
  function sphere(x,y,z,r,k){const rows=10,cols=16;for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const p=(a,b)=>{const t=Math.PI*a/rows,q=2*Math.PI*b/cols;return V(x+r*Math.sin(t)*Math.cos(q),y+r*Math.cos(t),z+r*Math.sin(t)*Math.sin(q))};quad(p(i,j),p(i+1,j),p(i+1,j+1),p(i,j+1),k)}}
  function house(x,z,w,h,d,wall,top){box(x,h/2,z,w,h,d,wall);roof(x,h,z,w*1.12,h*.36,d*1.06,top);const nx=Math.max(2,Math.floor(w/.65)),ny=Math.max(2,Math.floor(h/.7));for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const wx=x-w/2+.35+i*(w-.7)/(nx-1),wy=.4+j*(h-.7)/(ny-1);box(wx,wy,z+d/2+.02,.24,.33,.035,(i+j)%3?[.9,.62,.3]:[.48,.58,.66])}box(x,h*.36,z+d/2+.05,.42,.7,.07,[.18,.2,.24])}
  function tree(x,z,s=1){box(x,.6*s,z,.24*s,1.2*s,.24*s,[.25,.19,.15]);for(let i=0;i<9;i++){const a=i*Math.PI*2/9,b=(i+1)*Math.PI*2/9;tri(V(x,2.8*s,z),V(x+Math.cos(a)*.8*s,1*s,z+Math.sin(a)*.8*s),V(x+Math.cos(b)*.8*s,1*s,z+Math.sin(b)*.8*s),[.14,.3,.25])}}
  // Street, sidewalks, lane markings and buildings are generated as lit 3D meshes.
  box(0,-.2,-4,42,.35,34,[.055,.075,.105]);box(0,-.015,-4,4.5,.08,34,[.12,.13,.16]);box(-2.38,.015,-4,.18,.08,34,[.68,.59,.41]);box(2.38,.015,-4,.18,.08,34,[.68,.59,.41]);
  for(let z=10;z>-19;z-=3.2)box(0,.04,z,.12,.018,1.25,[.64,.55,.38]);
  const blocks=[[-5.1,1.7,1.8,3.2,3.3,2.6,[.24,.28,.34],[.39,.31,.23]],[-8.6,-1.8,2.1,4.8,4.2,3,[.2,.24,.31],[.35,.27,.22]],[-5,-6.8,1.4,2.8,3.6,2.5,[.27,.3,.36],[.42,.31,.23]],[-10.8,-8.1,2.4,3.8,3.1,3.2,[.23,.27,.34],[.38,.28,.23]],[5.4,1.6,1.9,3.5,3.5,2.8,[.24,.28,.34],[.38,.3,.22]],[8.7,-2.5,2,4.5,4.4,3,[.19,.23,.3],[.34,.27,.22]],[5.1,-7.2,1.3,2.9,3.3,2.3,[.27,.29,.35],[.43,.32,.22]],[11,-8,2.4,4,3.6,3.2,[.22,.25,.32],[.37,.28,.22]]];
  for(const b of blocks)house(b[0],b[1],b[3],b[4],b[5],b[6],b[7]);
  for(const z of [3,-3,-9]){tree(-3.4,z,.78);tree(3.4,z,.78)}
  for(const z of [6,-1,-8])for(const x of [-2.85,2.85]){box(x,1.35,z,.08,2.7,.08,[.31,.34,.38]);box(x,2.68,z-.12,.55,.08,.4,[.69,.51,.28]);sphere(x,2.58,z-.12,.13,[1,.72,.38])}
  sphere(5.5,9,-16,1.15,[.79,.71,.53]);
  let seed=128;const rand=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};for(let i=0;i<140;i++)box((rand()-.5)*34,4+rand()*11,-3-rand()*20,.035,.035,.035,[.56,.65,.75]);
  function attrib(name,data,size){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const l=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,0,0)}
  attrib('aPosition',pos,3);attrib('aNormal',nor,3);attrib('aColor',col,3);const vpLoc=gl.getUniformLocation(program,'uViewProjection');
  function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o}
  function perspective(f,aspect,n,far){const q=1/Math.tan(f/2),nf=1/(n-far);return new Float32Array([q/aspect,0,0,0,0,q,0,0,0,0,(far+n)*nf,-1,0,0,2*far*n*nf,0])}
  function look(eye,c,up){let z=eye.map((x,i)=>x-c[i]),m=Math.hypot(...z);z=z.map(x=>x/m);let x=[up[1]*z[2]-up[2]*z[1],up[2]*z[0]-up[0]*z[2],up[0]*z[1]-up[1]*z[0]];m=Math.hypot(...x);x=x.map(v=>v/m);const y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((s,v,i)=>s+v*eye[i],0),-y.reduce((s,v,i)=>s+v*eye[i],0),-z.reduce((s,v,i)=>s+v*eye[i],0),1])}
  let yaw=0,zoom=1,drag=null;canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,yaw];canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(drag)yaw=drag[1]+(e.clientX-drag[0])*.006});canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('wheel',e=>{zoom=Math.max(.75,Math.min(1.4,zoom+e.deltaY*.0008));e.preventDefault()},{passive:false});
  function resize(){const d=Math.min(devicePixelRatio||1,2),w=Math.floor(canvas.clientWidth*d),h=Math.floor(canvas.clientHeight*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
  function frame(ms){resize();gl.enable(gl.DEPTH_TEST);gl.clearColor(.055,.075,.11,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const a=yaw+Math.sin(ms*.00012)*.035,eye=[Math.sin(a)*17*zoom,8.4*zoom,Math.cos(a)*17*zoom],vp=mul(perspective(.78,canvas.width/canvas.height,.1,90),look(eye,[0,1,-4],[0,1,0]));gl.uniformMatrix4fv(vpLoc,false,vp);gl.drawArrays(gl.TRIANGLES,0,pos.length/3);requestAnimationFrame(frame)}
  requestAnimationFrame(frame);
})();
