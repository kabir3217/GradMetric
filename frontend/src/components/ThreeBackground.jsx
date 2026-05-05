"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PresentationControls, Environment } from "@react-three/drei";


function FloatingSphere({ position, color, speed = 1.0, scale = 1 }) {
const ref = useRef();
useFrame(({ clock }) => {
const t = clock.getElapsedTime();
ref.current.position.y = position[1] + Math.sin(t * speed) * 0.6;
ref.current.rotation.y = t * 0.2;
});
return (
<Float floatIntensity={0.6} rotationIntensity={0.6} >
<mesh ref={ref} position={position} scale={scale}>
<sphereGeometry args={[1, 64, 64]} />
<meshStandardMaterial metalness={0.2} roughness={0.2} color={color} envMapIntensity={1.2} transparent opacity={0.95} />
</mesh>
</Float>
);
}


export default function ThreeBackground() {
return (
<div className="absolute inset-0 -z-10">
<Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
<ambientLight intensity={0.8} />
<directionalLight intensity={0.6} position={[5, 10, 5]} />
<PresentationControls global rotation={[0, 0.1, 0]} polar={[-0.2, 0.2]} azimuth={[-0.3, 0.3]}>
<group position={[0, -1.5, 0]}>
<FloatingSphere position={[-3.3, 0.2, -1]} color="#60a5fa" speed={0.8} scale={1.6} />
<FloatingSphere position={[0.8, -0.1, -0.5]} color="#fb7185" speed={1.1} scale={1.2} />
<FloatingSphere position={[2.8, 0.3, 0.3]} color="#a78bfa" speed={0.9} scale={1.4} />
</group>
</PresentationControls>
<Environment preset="city" />
</Canvas>
</div>
);
}