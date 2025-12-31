"use client"

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Box(props: any) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)

    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * 0.2
        mesh.current.rotation.y += delta * 0.2
    })

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh
                {...props}
                ref={mesh}
                scale={hovered ? 1.2 : 1}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry args={[2.5, 2.5, 2.5]} />
                <MeshDistortMaterial
                    color={hovered ? "#06b6d4" : "#3b82f6"} // Cyan on hover, Blue default
                    emissive={hovered ? "#06b6d4" : "#1d4ed8"}
                    emissiveIntensity={0.5}
                    roughness={0.1}
                    metalness={1}
                    distort={0.4}
                    speed={2}
                />
            </mesh>
        </Float>
    )
}

export function Hero3D() {
    return (
        <div className="h-[400px] w-full md:h-[600px] absolute inset-0 md:relative z-0 opacity-50 md:opacity-100 mix-blend-screen pointer-events-none md:pointer-events-auto">
            <Canvas className="bg-transparent">
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={5} color="#06b6d4" />
                <Box position={[0, 0, 0]} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    )
}
