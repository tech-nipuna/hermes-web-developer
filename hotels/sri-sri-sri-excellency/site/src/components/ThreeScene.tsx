import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingGeometries() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Dodecahedron */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[0, 0, 0]}>
          <dodecahedronGeometry args={[2, 0]} />
          <meshStandardMaterial 
            color="#0d9488" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      </Float>

      {/* Inner Sphere with accent color */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial 
            color="#e9a23b" 
            roughness={0.2}
            metalness={0.8}
            emissive="#e9a23b"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Outer Floating Ring */}
      <Float speed={1.2} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-3, 2, -2]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1, 0.1, 16, 100]} />
          <meshStandardMaterial 
            color="#0d9488" 
            roughness={0.1}
            metalness={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>

      {/* Another floating geometric shape */}
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={2}>
        <mesh position={[3, -2, -3]}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial 
            color="#e9a23b" 
            wireframe 
            transparent 
            opacity={0.4}
          />
        </mesh>
      </Float>
      
      {/* Small floating particles/stars */}
      <Particles count={150} />
    </group>
  );
}

function Particles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#e9a23b"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-teal-950/20 to-slate-950">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fefae0" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#0d9488" />
        <spotLight position={[0, 10, 0]} intensity={1} color="#e9a23b" angle={0.6} penumbra={1} />
        <FloatingGeometries />
      </Canvas>
    </div>
  );
}
