import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

function FloatingShape() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2
      ref.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={ref} scale={1.4}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#c9a84c" wireframe transparent opacity={0.4} />
      </mesh>
    </Float>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-maroon">
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#fefae0" />
          <FloatingShape />
        </Canvas>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-maroon via-transparent to-maroon" />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        className="relative z-10 text-center px-6">
        <p className="text-gold uppercase tracking-[0.4em] text-sm mb-4">Wyra Road, Khammam</p>
        <h1 className="text-6xl md:text-8xl font-heading text-ivory mb-6">Hotel Grand<br/>Gayathri</h1>
        <p className="text-xl text-ivory/80 max-w-xl mx-auto mb-10">
          Where luxury meets heritage — experience world-class hospitality in the heart of Telangana.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#rooms" className="bg-gold text-maroon px-8 py-3 rounded-full font-semibold hover:bg-ivory transition-all hover:scale-105">
            Explore Rooms
          </a>
          <a href="#booking" className="border-2 border-gold text-gold px-8 py-3 rounded-full font-semibold hover:bg-gold hover:text-maroon transition-all">
            Book Now
          </a>
        </div>
        <div className="mt-12 flex justify-center gap-8 text-ivory/70 text-sm">
          <span>★ 4.1 / 5 on Google</span>
          <span>|</span>
          <span>3,309 Reviews</span>
        </div>
      </motion.div>
    </section>
  )
}
