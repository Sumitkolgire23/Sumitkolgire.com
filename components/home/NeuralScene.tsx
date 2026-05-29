"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate 25 nodes inside a sphere
  const nodes = useMemo(() => {
    const temp = [];
    const count = 25;
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.2; // radius up to 2.2

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      temp.push({
        position: new THREE.Vector3(x, y, z),
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        scale: 0.05 + Math.random() * 0.05,
      });
    }
    return temp;
  }, []);

  // Precompute indices of nodes that are close to each other
  const connections = useMemo(() => {
    const temp = [];
    const threshold = 1.6;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < threshold) {
          temp.push({ i, j });
        }
      }
    }
    return temp;
  }, [nodes]);

  // Float array for line coordinates
  const linePositions = useMemo(() => {
    return new Float32Array(connections.length * 2 * 3); // 2 vertices per line, 3 coords per vertex
  }, [connections]);

  // Instantiate BufferGeometry once
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    return geometry;
  }, [linePositions]);

  // Handle gentle drift and mouse interaction rotation in RAF loop
  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.getElapsedTime();

    // Lerp group rotation towards cursor coords
    const targetRotX = state.pointer.y * 0.25; // invert Y for intuitive drag rotation
    const targetRotY = state.pointer.x * 0.35;

    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, 0.04);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, 0.04);

    // Drifting animation for individual nodes
    // Access meshes inside children
    const children = group.children;
    nodes.forEach((node, idx) => {
      const mesh = children[idx] as THREE.Mesh;
      if (mesh && mesh.position) {
        const offset = Math.sin(time * node.speed + node.phaseX) * 0.06;
        mesh.position.set(
          node.position.x + offset,
          node.position.y + Math.cos(time * node.speed + node.phaseY) * 0.06,
          node.position.z + Math.sin(time * node.speed + node.phaseZ) * 0.04
        );
        // Pulse size slightly to look alive and transmitting data
        const pulse = 1.0 + Math.sin(time * 2.0 + node.phaseX) * 0.15;
        mesh.scale.setScalar(pulse);
      }
    });

    // Update lines positions dynamically to follow drifting nodes
    if (linesRef.current) {
      const lineGeom = linesRef.current.geometry;
      const posAttr = lineGeom.getAttribute("position") as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      connections.forEach((conn, index) => {
        const meshI = children[conn.i] as THREE.Mesh;
        const meshJ = children[conn.j] as THREE.Mesh;

        if (meshI && meshJ) {
          const baseIdx = index * 6;
          // Start point
          array[baseIdx] = meshI.position.x;
          array[baseIdx + 1] = meshI.position.y;
          array[baseIdx + 2] = meshI.position.z;
          // End point
          array[baseIdx + 3] = meshJ.position.x;
          array[baseIdx + 4] = meshJ.position.y;
          array[baseIdx + 5] = meshJ.position.z;
        }
      });

      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Node Spheres */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position.clone()}>
          <sphereGeometry args={[node.scale, 8, 8]} />
          <meshBasicMaterial color="#c41e3a" />
        </mesh>
      ))}

      {/* Connection Lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#c41e3a" transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}

export default function NeuralScene() {
  return (
    <div style={{ width: "100%", height: "320px", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 1.5]} // Cap DPR at 1.5 for performance
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#c41e3a" />
        <NeuralNetwork />
      </Canvas>
    </div>
  );
}
