import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Animated topographic contour shader plane. Sits behind the hero.
 * Renders client-only (gracefully no-ops on SSR / reduced motion).
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uInk;
  uniform vec3 uVellum;
  uniform vec3 uRust;

  // simple 2D value noise + fbm
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02; a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 4.0;
    p += (uMouse - 0.5) * 0.6;
    float h = fbm(p + uTime * 0.04);
    h += 0.15 * fbm(p * 2.5 - uTime * 0.02);

    // contour lines via fract on elevation
    float lines = abs(fract(h * 14.0) - 0.5);
    float contour = 1.0 - smoothstep(0.0, 0.04, lines);

    // accent line every 5th
    float major = abs(fract(h * 2.8) - 0.5);
    float majorLine = 1.0 - smoothstep(0.0, 0.02, major);

    vec3 col = uVellum;
    col = mix(col, uInk, contour * 0.18);
    col = mix(col, uRust, majorLine * 0.35);

    // soft vignette
    float vign = smoothstep(1.1, 0.3, length(uv - 0.5));
    col = mix(uVellum, col, vign);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function TopoMesh() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    const cur = m.uniforms.uMouse.value as THREE.Vector2;
    cur.x += (mouse.current.x - cur.x) * 0.04;
    cur.y += (mouse.current.y - cur.y) * 0.04;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uInk: { value: new THREE.Color("#332e26") },
          uVellum: { value: new THREE.Color("#f3ecdb") },
          uRust: { value: new THREE.Color("#b6562d") },
        }}
      />
    </mesh>
  );
}

export function HeroTopo() {
  const reduce = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || reduce) return null;
  return (
    <div className="absolute inset-0 -z-0 opacity-60 pointer-events-none mix-blend-multiply">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.6]}
      >
        <TopoMesh />
      </Canvas>
    </div>
  );
}
