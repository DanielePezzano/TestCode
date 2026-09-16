import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

// Dati dei pianeti (distanze e dimensioni non in scala reale per migliore visualizzazione)
const planetsData = [
  { name: 'Mercurio', color: '#B5A5A5', radius: 0.4, distance: 10, speed: 4.1, info: 'Il pianeta più vicino al Sole' },
  { name: 'Venere', color: '#E6C87A', radius: 0.9, distance: 15, speed: 1.6, info: 'Il pianeta più caldo del sistema solare' },
  { name: 'Terra', color: '#6B93D6', radius: 1, distance: 20, speed: 1, info: 'Il nostro pianeta casa' },
  { name: 'Marte', color: '#C1440E', radius: 0.5, distance: 25, speed: 0.53, info: 'Il pianeta rosso' },
  { name: 'Giove', color: '#D8CA9D', radius: 3, distance: 35, speed: 0.084, info: 'Il pianeta più grande' },
  { name: 'Saturno', color: '#F4D59E', radius: 2.5, distance: 45, speed: 0.034, hasRings: true, info: 'Famoso per i suoi anelli' },
  { name: 'Urano', color: '#D1F5F8', radius: 1.8, distance: 55, speed: 0.012, info: 'Il gigante di ghiaccio' },
  { name: 'Nettuno', color: '#5B5DDF', radius: 1.7, distance: 65, speed: 0.006, info: 'Il pianeta più ventoso' },
]

function Sun() {
  const sunRef = useRef()
  
  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshStandardMaterial 
        emissive="#FFD700" 
        emissiveIntensity={2}
        color="#FFA500"
      />
      <pointLight intensity={2} distance={100} decay={2} color="#FFF" />
    </mesh>
  )
}

function Planet({ data, time }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Calcola la posizione attuale del pianeta basata sul tempo
  const angle = (time / 1000) * data.speed * 0.1
  const x = Math.cos(angle) * data.distance
  const z = Math.sin(angle) * data.distance
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.x = x
      meshRef.current.position.z = z
    }
  })

  return (
    <group>
      {/* Orbita */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
      </mesh>
      
      {/* Pianeta */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshStandardMaterial 
          color={data.color}
          emissive={hovered ? data.color : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
        
        {/* Anelli di Saturno */}
        {data.hasRings && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[data.radius * 1.4, data.radius * 2.2, 64]} />
            <meshStandardMaterial color="#C9B896" opacity={0.7} transparent side={THREE.DoubleSide} />
          </mesh>
        )}
        
        {/* Tooltip */}
        {hovered && (
          <Html position={[0, data.radius + 1, 0]} center>
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}>
              <strong>{data.name}</strong><br/>
              {data.info}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  )
}

function SolarSystem() {
  const [time, setTime] = useState(Date.now())
  
  useFrame(() => {
    setTime(Date.now())
  })

  return (
    <>
      <Sun />
      {planetsData.map((planet, index) => (
        <Planet key={index} data={planet} time={time} />
      ))}
    </>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 30, 80], fov: 60 }}>
        <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.1} />
        <SolarSystem />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={150}
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        zIndex: 100
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Sistema Solare</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
          Passa il mouse sui pianeti per vedere le informazioni<br/>
          Usa il mouse per ruotare, zoomare e spostare la vista
        </p>
      </div>
    </div>
  )
}

export default App
