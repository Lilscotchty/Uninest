// Original effect: "Blazing Rifts" by Paul (prisoner849)
// Licensed under MIT: https://codepen.io/prisoner849/pen/ZYBKmRN

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as BGU from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAPass } from 'three/examples/jsm/postprocessing/FXAAPass.js';

const noise3d = `
//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

const noise4d = `
//	Simplex 4D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}
`;

const createBlazingRifts = (container: HTMLDivElement) => {
  const mu = THREE.MathUtils;
  let w = container.clientWidth || 1;
  let h = container.clientHeight || 1;
  const gu = {
    time: {value: 0},
    timeDelta:  {value: 0},
    aspect: {value: w / h}
  }

  const setColor = (g: any, color: any) => {
    const c = color.isColor ? color : new THREE.Color(color);
    g.setAttribute("color", new THREE.Float32BufferAttribute(Array.from({length: g.attributes.position.count}, () => [...c]).flat(), 3));
  }

  class Postprocessing extends EffectComposer{
    constructor(renderer: any, scene: any, camera: any){
      super(renderer);
      
      const renderPass = new RenderPass( scene, camera );
      this.addPass( renderPass );

      const outputPass = new OutputPass();
      outputPass.material.onBeforeCompile = (shader: any) => {
        shader.uniforms.time = gu.time;
        shader.uniforms.aspect = gu.aspect;
        shader.fragmentShader = shader.fragmentShader.replace(
          `precision highp float;`,
          `
          #define S(a, b, c) smoothstep(a, b, c)
          precision highp float;
          uniform float time;
          uniform float aspect;
          
          mat2 rot(float a){return mat2(cos(a), -sin(a), sin(a), cos(a));}
          
          ${noise3d}
          
          #include <common>
          `
        ).replace(
          `gl_FragColor = texture2D( tDiffuse, vUv );`,
          `
          vec2 postUV = (vUv - 0.5) * vec2(aspect, 1.) * 2.; //-1..1
          float u = length(postUV);
          float v = (atan(postUV.y, postUV.x) + PI2) / PI2;

          float effectLim = S(1., 1.5, u); // - S(0.95, 1., u);
          vec2 dir = vec2(-postUV.y, postUV.x);
          float noise = snoise(vec3(postUV, time * 0.25));
          //noise = pow(abs(noise), 3.) * sign(noise);
          vec2 shift = dir * noise * effectLim * 0.025; 
                  
          gl_FragColor = texture2D( tDiffuse, vUv + shift);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1, 0.5, 0), effectLim * 0.01);
          `
        );
      }
      this.addPass( outputPass );
      
      const fxaaPass = new FXAAPass();
      this.addPass( fxaaPass );
    }
  }

  class SplitSampler {
    splitPoint: any;
    splitWidth: number;
    axisX: any;
    axisY: any;
    add: number;
    path: any;

    constructor(chamfer: number, roundness: number, splitPoint: any, splitWidth = 0.09875){
      this.splitPoint = splitPoint;
      this.splitWidth = splitWidth;
      
      this.axisX = new THREE.Vector3(1, 0, 0);
      this.axisY = new THREE.Vector3(0, 1, 0);
      
      const shift = 1 - chamfer * 3. - roundness;
      const quart = Math.PI * 0.5;
      const add = 0.5;
      this.add = add;
      this.path = new THREE.Path()
        .absarc( shift, shift, roundness + add, quart * 0, quart * 1)
        .absarc(-shift, shift, roundness + add, quart * 1, quart * 2)
        .absarc(-shift,-shift, roundness + add, quart * 2, quart * 3)
        .absarc( shift,-shift, roundness + add, quart * 3, quart * 4);
      this.path.closePath();
    }
    
    sample(v = new THREE.Vector3(), n = new THREE.Vector3()){
      const quart = Math.PI * 0.5;
      const randVal = Math.random();
      const randFwd = (randVal + 0.001) % 1;
      
      this.path.getPointAt(randVal, v);
      this.path.getPointAt(randFwd, n);
      const diffX = n.x - v.x;
      const diffY = n.y - v.y;
      n.set(diffY, -diffX, 0).normalize();
      
      v.addScaledVector(n, -this.add);
      
      n.x += mu.randFloatSpread(0.1);
      n.y += mu.randFloatSpread(0.1);
      n.z += mu.randFloatSpread(0.1);
      n.normalize();
      
      v.z = (Math.random() - 0.5) * 2 * this.splitWidth;
      const plane = THREE.MathUtils.randInt(0, 2);

      if(plane === 0){
        v.z += this.splitPoint.z;
      } else if(plane === 1) {
        v.applyAxisAngle(this.axisX, quart);
        v.y += this.splitPoint.y;
        n.applyAxisAngle(this.axisX, quart);
      } else if(plane === 2) {
        v.applyAxisAngle(this.axisY, -quart);
        v.x += this.splitPoint.x;
        n.applyAxisAngle(this.axisY, -quart);
      }
      return [v, n];
    }
  }

  class ParticleEmitter extends THREE.Points{
    amount: number;
    splitSampler: any;
    duration: number;
    mediators: any;

    constructor(splitSampler: any, initMatrix: any, amount = 50000){
      super();
      this.amount = amount;
      this.splitSampler = splitSampler;
      
      this.duration = 6;
      this.mediators = {
        p: new THREE.Vector3(),
        n: new THREE.Vector3(),
        normalMatrix: new THREE.Matrix3()
      }
      const pos: number[] = [];
      const nor: number[] = [];
      const timing: number[] = [];
      for(let i = 0; i < amount; i++){
        splitSampler.sample(this.mediators.p, this.mediators.n);
        pos.push(
          ...this.mediators.p.applyMatrix4(
            initMatrix
          ).toArray()
        );
        nor.push(
          ...this.mediators.n.applyNormalMatrix(
            this.mediators.normalMatrix.getNormalMatrix(
              initMatrix
            )
          ).toArray()
        );
        const dur = this.duration * (Math.random() * 0.5 + 0.5);
        const tim = Math.random() * dur;
        const dis = (Math.random() * 0.8 + 0.2) * 2;
        const siz = (Math.random() ** 4) * 0.6 + 0.4;
        timing.push(tim, dur, dis, siz);
      }
      this.geometry = new THREE.BufferGeometry();
      this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3))
      this.geometry.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      this.geometry.setAttribute("timing", new THREE.Float32BufferAttribute(timing, 4));
      
      this.material = new THREE.PointsMaterial({
        size: 0.15,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        onBeforeCompile: shader => {
          shader.vertexShader = `
            attribute vec4 timing;
            varying float action;
            varying float vFinish;
            
            float graphOut(float k){
              float decK = k - 1.;
              return decK * decK * decK + 1.;
            }
            
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
              action = clamp((timing.x / timing.y), 0., 1.);
              transformed = position + normal * graphOut(action) * timing.z;
            `
          ).replace(
            `gl_PointSize = size;`,
            `
            float sizeRatio = smoothstep(0., 0.05, action) - smoothstep(0.75, 1., action);
            vFinish = smoothstep(0.8, 0.85, action) - smoothstep(0.85, 0.9, action);
            sizeRatio = max(sizeRatio, vFinish);
            gl_PointSize = size * sizeRatio * timing.w;
            `
          );
          shader.fragmentShader = `
            varying float action;
            varying float vFinish;
            ${shader.fragmentShader}
          `.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
            vec2 uv = gl_PointCoord.xy - 0.5;
            float dist = length(uv) * 2.;
            
            vec3 col = mix(vec3(1, 0.6, 0.4), vec3(1, 0.75, 0), smoothstep(0., 0.75, action));
            col = mix(col, vec3(1, 0.25, 0), smoothstep(0.1, 1. - 0.5 * action, dist));
            col = mix(col, vec3(0.25, 0.1, 0) * 0.5, smoothstep(0.25, 0.75, action));
            
            float a = 1. - smoothstep(0.5, 1. - 0.2 * action, dist);
            a *= 1. - smoothstep(0.95, 1., action);
            
            a = max(a, 1. - smoothstep(0., 1., dist));
            col = mix(col, vec3(1, 1, 0.5), vFinish);
            
            vec4 diffuseColor = vec4( col, a );
            `
          );
        }
      })
      
    }
    
    update(){
      const dt = gu.timeDelta.value;
      const m = this.mediators;
      const p = m.p;
      const n = m.n;
      const pos = this.geometry.attributes.position;
      const nor = this.geometry.attributes.normal;
      const timings = this.geometry.attributes.timing;
      const nMat = this.mediators.normalMatrix.getNormalMatrix(this.matrixWorld);
      for(let i = 0; i < this.amount; i++){
        const timing = timings.getX(i);
        let durationVal = timings.getY(i);
        let timingVal = timing + dt;
        if (timingVal > durationVal){
          const dur = this.duration * (Math.random() * 0.5 + 0.5);
          timings.setY(i, dur);
          timings.setZ(i, (Math.random() * 0.8 + 0.2) * 2);
          timings.setW(i, (Math.random() ** 4) * 0.6 + 0.4);
          timingVal = 0;
          this.splitSampler.sample(p, n);
          p.applyMatrix4(this.matrixWorld);
          n.applyNormalMatrix(nMat);
          pos.setXYZ(i, ...p.toArray());
          nor.setXYZ(i, ...n.toArray());
        }
        timings.setX(i, timingVal)
      };
      
      pos.needsUpdate = true;
      nor.needsUpdate = true;
      timings.needsUpdate = true;
      
    }
  }

  class EighthGeometry extends THREE.BufferGeometry{
    constructor(aX = 0, aY = 0, aZ = 0, chamfer = 0.05){
      super();
      const c = 1 - chamfer * 2;
        const basePoints = [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [1, c, 0],
          [c, 1, 0],
          [0, c, 1],
          [0, 1, c],
          [1, 0, c],
          [c, 0, 1],
          [1, c, c],
          [c, 1, c],
          [c, c, 1]
        ].map(p => new THREE.Vector3(...p));
        
        const baseMoves = [
          [1, 1, 1],
          [0, 1, 1],
          [1, 0, 1],
          [1, 1, 0],
          [0, 0, 1],
          [0, 0, 1],
          [1, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [0, 1, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ].flat();
        
        const g = new THREE.BufferGeometry().setFromPoints(basePoints);
        g.setAttribute("moves", new THREE.Float32BufferAttribute(baseMoves, 3));
        g.setIndex([
          0, 4, 1,
          0, 2, 5,
          0, 5, 4,
          
          0, 7, 2,
          0, 3, 6,
          0, 6, 7,
          
          0, 1, 8,
          0, 9, 3,
          0, 8, 9,
          
          6, 3, 9,
          6, 9, 12,
          
          8, 1, 4,
          8, 4, 10,
          
          5, 2, 7,
          5, 7, 11,
          
          4, 5, 11,
          4, 11, 10,
          
          7, 6, 12,
          7, 12, 11,
          
          9, 8, 10,
          9, 10, 12,
          
          10, 11, 12
        ]);
        
        const hPI = Math.PI * 0.5;
        const angleX = hPI * aX;
        const angleY = hPI * aY;
        const angleZ = hPI * aZ;
        
        g.rotateX(angleX);
        g.rotateY(angleY);
        g.rotateZ(angleZ);
        
        const m1 = new THREE.Matrix4();
        const rotateMoves = (axis: keyof THREE.Matrix4, angle: number) => {
          (m1 as any)['makeRotation' + axis](angle);
          g.attributes.moves.applyMatrix4(m1);
        }
        rotateMoves("X", angleX);
        rotateMoves("Y", angleY);
        rotateMoves("Z", angleZ);
        
        const finalG = g.toNonIndexed();
        finalG.computeVertexNormals();
        this.copy(finalG);
    }
  }

  class BoxyGeometry extends THREE.BufferGeometry{
    constructor(chamfer = 0.05, roundness = 0.1){
      super();
      
      const setID = (g: any, gID: number) => {
        g.setAttribute("geometryID", new THREE.Float32BufferAttribute(Array.from({length: g.attributes.position.count}, () => gID).flat(), 1));
      }
      const gs = [
        new EighthGeometry(0, 0, 0),
        new EighthGeometry(0, 1, 0),
        new EighthGeometry(0, 2, 0),
        new EighthGeometry(0, 3, 0),
        new EighthGeometry(1, 0, 0),
        new EighthGeometry(1, 1, 0),
        new EighthGeometry(1, 2, 0),
        new EighthGeometry(1, 3, 0)
      ];
      gs.forEach((g, gID) => {
        setColor(g, "#111");
        setID(g, gID);
      });
      
      const innerSize = 2 - chamfer * 6;
      const gInnerBox = new RoundedBoxGeometry(innerSize, innerSize, innerSize, 1, roundness);
      gInnerBox.setAttribute("moves", new THREE.Float32BufferAttribute(new Array(gInnerBox.attributes.position.count * 3).fill(0), 3));
      gInnerBox.deleteAttribute("uv");
      setColor(gInnerBox, "#fca");
      setID(gInnerBox, 8);
      gs.push(gInnerBox);
      
      this.copy(BGU.mergeGeometries(gs) as any);
    }
  }

  class Boxy extends THREE.Mesh{
    uniforms: any;
    chamfer: number;
    roundness: number;
    simplex: any;
    splitSampler: any;
    particleEmitter: any;

    constructor(){
      super();
      
      this.uniforms = {
        splitPoint: {value: new THREE.Vector3()}
      }
      
      this.chamfer = 0.05;
      this.roundness = 0.1;
      this.simplex = new SimplexNoise();
      
      this.splitSampler = new SplitSampler(this.chamfer, this.roundness, this.uniforms.splitPoint.value);
      this.geometry = new BoxyGeometry(this.chamfer, this.roundness);
      
      this.material = new THREE.MeshPhysicalMaterial({
        vertexColors: true, 
        flatShading: false, 
        wireframe: false,
        metalness: 0.95,
        roughness: 0.05,
        clearcoat: 0.25,
      });
      
      this.material.onBeforeCompile = (shader: any) => {
        shader.uniforms.time = gu.time;
        shader.uniforms.splitPoint = this.uniforms.splitPoint;
        shader.vertexShader = `
          uniform vec3 splitPoint;
          attribute vec3 moves;
          attribute float geometryID;
          varying float vGID;
          varying vec3 vPos;
          ${shader.vertexShader}
        `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
          float splitWidth = 0.1;
          vec3 pos = position;
          pos += (splitPoint + moves * splitWidth) * abs(moves);
          transformed = pos;
          vPos = transformed;
          vGID = geometryID;
          `
        );
        
        shader.fragmentShader = `
          uniform float time;
          varying float vGID;
          varying vec3 vPos;
          ${noise4d}
          
          float sdRoundBox( vec3 p, vec3 b, float r ) {
            vec3 q = abs(p) - b + r;
            return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
          }
          
          float getNoise(vec3 pos){
            return snoise(vec4(pos, time * 0.125));
          }
          
          float fbm(vec3 x) {
            float v = 0.0;
            float a = 0.5;
            vec3 shift = vec3(0.5);
            for (int i = 0; i < 5; ++i) {
              v += a * getNoise(x);
              x = x * 2. + shift;
              a *= 0.5;
            }
            return v;
          }
          ${shader.fragmentShader}
        `.replace(
          `#include <opaque_fragment>`,
          `#include <opaque_fragment>
          float nVal = fbm(vPos * 0.5);
          float f = smoothstep(0.0, 0.5, abs(nVal));
          float negF = 1. - f;
          vec3 noiseCol = vec3(1, 0.4 - (pow(negF, 0.25)) * 0.1 * 3., 0.);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, noiseCol, f);
          
          float sBox = sdRoundBox(vPos, vec3(1. - 0.2), 0.05);
          float fBox = 1. - smoothstep(0.05, 0.25, sBox);
          fBox = pow(fBox, 0.75);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1, 0.2, 0), fBox);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1, 0.6, 0.4), 1. - smoothstep(0.05, 0.15, sBox));
          
          if (floor(vGID + 0.1) > 7.){
            gl_FragColor.rgb = vColor.rgb;
          }
          `
        );
      };

      this.rotation.set(Math.PI * 2 * Math.random(), Math.PI * 2 * Math.random(), 0);
      this.setSplitPoint();
      this.updateMatrixWorld();
    }
    
    initParticles(scene: any) {
      const particleEmitter = new ParticleEmitter(this.splitSampler, this.matrixWorld);
      this.particleEmitter = particleEmitter;
      scene.add(particleEmitter);
    }
    
    setSplitPoint(){
      let tloc = gu.time.value;
      tloc *= 0.05;
      const x = this.simplex.noise(tloc, 100);
      const y = this.simplex.noise(tloc, 200);
      const z = this.simplex.noise(tloc, 300);
      this.uniforms.splitPoint.value.set(x, y, z).multiplyScalar(0.75);
    }
    
    update(){
      this.setSplitPoint();
      const dt = gu.timeDelta.value * 0.25;
      this.rotation.x += dt * 0.31;
      this.rotation.y += dt * 0.27;
      this.updateMatrixWorld();
      if (this.particleEmitter) {
        this.particleEmitter.matrixWorld.copy(this.matrixWorld);
        this.particleEmitter.update();
      }
    }
  }

  class BackStuff extends THREE.InstancedMesh{
    proxy: any[];
    constructor(amount = 500){
      const g = new EighthGeometry().translate(-0.5, -0.5, -0.5);
      const m = new THREE.MeshPhysicalMaterial({
        color: "#840",
        metalness: 0.9,
        roughness: 0.6,
        clearcoat: 0.75,
        wireframe: false
      });
      
      super(g, m, amount);
      
      this.proxy = Array.from({length: amount}, () => {
        const o = new THREE.Object3D();
        o.position.setFromSphericalCoords(
          50 + mu.randFloatSpread(6),
          Math.PI * 0.5 + mu.randFloatSpread(Math.PI * 0.5),
          Math.PI * 2 * Math.random()
        );
        o.scale.setScalar(Math.random() * 2 + 1);
        o.rotation.set(
          Math.PI * 2 * Math.random(),
          Math.PI * 2 * Math.random(),
          Math.PI * 2 * Math.random()
        );
        o.userData = {
          rotSpeed: new THREE.Vector3().random().subScalar(0.5).multiplyScalar(Math.PI * 0.25)
        }
        return o;
      });
    }
    
    update(){
      const dt = gu.timeDelta.value;
      this.proxy.forEach((proxy, proxyID) => {
        const ud = proxy.userData;
        proxy.rotation.x += ud.rotSpeed.x * dt;
        proxy.rotation.y += ud.rotSpeed.y * dt;
        proxy.rotation.z += ud.rotSpeed.z * dt;
        proxy.updateMatrix();
        this.setMatrixAt(proxyID, proxy.matrix);
      });
      this.instanceMatrix.needsUpdate = true;
    }
  }

  class Sketch extends THREE.Group{
    updatables: any[];
    constructor(sc: any){
      super();
      const boxy = new Boxy();
      this.add(boxy);
      boxy.initParticles(sc); // pass scene
      
      const backStuff = new BackStuff();
      this.add(backStuff);
      
      this.updatables = [boxy, backStuff];
    }
    
    update(){
      this.updatables.forEach(u => {u.update()});
    }
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, (container.clientWidth || 1) / (container.clientHeight || 1), 1, 1000);
  camera.position.set(0, 0, 1).setLength(7);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(container.clientWidth || 1, container.clientHeight || 1, false);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.outline = 'none';
  container.appendChild(renderer.domElement);

  const postprocessing = new Postprocessing(renderer, scene, camera);

  const resize = (w: number, h: number) => {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    postprocessing.setSize(w, h);
    gu.aspect.value = camera.aspect;
  };

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 10;

  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  const room = new RoomEnvironment();
  const envTex = pmremGenerator.fromScene( room, 0.04 ).texture;
  scene.environment = envTex;

  room.children[0].color.set("#f80");
  (room.children[0] as any).intensity = 100;
  room.traverse((child: any) => {
    if(child.material && child.material.isMeshLambertMaterial){
      child.material.emissive.set("#f80");
      child.material.emissiveIntensity = 0.5;
    }
  });
  
  const bakTex = pmremGenerator.fromScene( room, 0.04 ).texture;
  scene.background = bakTex;

  const sketch = new Sketch(scene);
  scene.add(sketch);

  const clock = new THREE.Clock();
  let t = 0;
  let raf: number;

  let errorCaught = false;

  let targetRotationX = 0;
  let targetRotationY = 0;

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.beta !== null && event.gamma !== null) {
      let gamma = event.gamma; 
      let beta = event.beta;
      
      // Attempt to normalize across landscape/portrait if needed, but general approximation is fine.
      let orientation = window.orientation || 0;
      if (orientation === 90) {
        gamma = event.beta;
        beta = -event.gamma;
      } else if (orientation === -90) {
        gamma = -event.beta;
        beta = event.gamma;
      }

      const maxRot = Math.PI / 4;
      targetRotationY = THREE.MathUtils.clamp((gamma / 45) * maxRot, -maxRot, maxRot);
      targetRotationX = THREE.MathUtils.clamp(((beta - 45) / 45) * maxRot, -maxRot, maxRot);
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      const maxRot = Math.PI / 8;
      targetRotationY = x * maxRot;
      targetRotationX = -y * maxRot;
    }
  };

  window.addEventListener('deviceorientation', handleOrientation);
  window.addEventListener('pointermove', handlePointerMove);

  const animate = () => {
    raf = requestAnimationFrame(animate);
    if (errorCaught) return;
    
    try {
      const dt = clock.getDelta();
      t += dt;
      
      gu.timeDelta.value = dt;
      gu.time.value = t;
      
      controls.update();
      sketch.update();
      
      // Apply parallax effect
      sketch.rotation.x += (targetRotationX - sketch.rotation.x) * 0.05;
      sketch.rotation.y += (targetRotationY - sketch.rotation.y) * 0.05;

      postprocessing.render();
    } catch (err: any) {
      errorCaught = true;
      console.error(err);
      const debugDiv = document.createElement('div');
      debugDiv.style.position = 'absolute';
      debugDiv.style.zIndex = '9999';
      debugDiv.style.background = 'red';
      debugDiv.style.color = 'white';
      debugDiv.style.padding = '10px';
      debugDiv.innerText = 'Render Error: ' + err.message;
      container.appendChild(debugDiv);
    }
  }
  
  animate();

  return {
    resize,
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
      envTex.dispose();
      bakTex.dispose();
      pmremGenerator.dispose();
      container.removeChild(renderer.domElement);
    }
  }
}

export const BlazingRifts: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Ensure container has at least some width/height so dimension is not 0
    let w = container.clientWidth || 1;
    let h = container.clientHeight || 1;
    
    let effect: any;
    let ro: ResizeObserver | null = null;
    
    try {
      effect = createBlazingRifts(container);
      effect.resize(w, h);

      ro = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            effect.resize(width, height);
          }
        }
      });
      ro.observe(container);
    } catch (err: any) {
      console.error(err);
      // Create error text to see why it fails
      const debugDiv = document.createElement('div');
      debugDiv.style.position = 'absolute';
      debugDiv.style.zIndex = '9999';
      debugDiv.style.background = 'red';
      debugDiv.style.color = 'white';
      debugDiv.style.padding = '10px';
      debugDiv.innerText = err.message + '\n' + err.stack;
      container.appendChild(debugDiv);
    }

    return () => {
      if (ro) ro.disconnect();
      if (effect) effect.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`} ref={containerRef}>
      {/* We allow interacting with the 3D scene directly. */}
    </div>
  );
};
