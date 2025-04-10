import React, { useRef, useEffect, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

interface HatPreview3DProps {
  font: string;
  colorHex: string;
  text: string;
  // hatModelUrl: string; // We'll use a placeholder path for now
}

// Placeholder path - replace when you have the actual model
const HAT_MODEL_URL = "/models/placeholder-hat.glb";
// Placeholder material name - inspect your model to find the correct name
const TEXT_MATERIAL_NAME = "HatTextMaterial"; // <--- CHANGE THIS LATER

function HatModel({ font, colorHex, text }: HatPreview3DProps) {
  // --- Temporarily Commented Out Model Loading ---
  // const { scene, nodes, materials } = useGLTF(HAT_MODEL_URL);
  // const textMaterial = materials[TEXT_MATERIAL_NAME];
  // --- End Temporary Comment Out ---

  // --- Dynamic Texture Creation (Keep this logic, but it won't apply to anything yet) ---
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const textureSize = 512; // Power of 2, adjust quality vs performance
    const textPadding = 20;
    const fontSize = 64; // Adjust as needed

    canvas.width = textureSize;
    canvas.height = textureSize / 2; // Rectangular texture might fit better

    if (ctx) {
      // Clear canvas (transparent background)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set text style
      ctx.font = `bold ${fontSize}px ${font}`; // Use selected font
      ctx.fillStyle = colorHex; // Use selected color
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Optional: Draw background if needed (e.g., for non-transparent text areas)
      // ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text in the center
      ctx.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width - textPadding * 2
      );
    }

    // Create or update the Three.js texture
    if (!textureRef.current) {
      textureRef.current = new THREE.CanvasTexture(canvas);
      textureRef.current.needsUpdate = true;
    } else {
      textureRef.current.image = canvas; // Update the image source
      textureRef.current.needsUpdate = true; // Crucial: Tell Three.js texture needs update
    }

    // --- Temporarily Commented Out Texture Application ---
    // if (textMaterial && textureRef.current) {
    //   if (
    //     textMaterial instanceof THREE.MeshStandardMaterial ||
    //     textMaterial instanceof THREE.MeshPhysicalMaterial ||
    //     textMaterial instanceof THREE.MeshBasicMaterial
    //   ) {
    //     textMaterial.map = textureRef.current;
    //     textMaterial.needsUpdate = true;
    //   } else {
    //     console.warn(...);
    //   }
    // } else if (!textMaterial) {
    //   console.warn(...);
    // }
    // --- End Temporary Comment Out ---
  }, [font, colorHex, text /*, textMaterial */]); // Removed textMaterial dependency for now

  // --- Temporarily Commented Out Model Rendering ---
  // const clonedScene = useMemo(() => scene.clone(), [scene]);
  // return <primitive object={clonedScene} scale={3} />;
  // --- End Temporary Comment Out ---

  // --- Temporary Placeholder Content ---
  // Displaying the text using Drei's Text component as a visual placeholder
  // This won't look like it's on a hat, just shows the text is updating.
  return (
    <Text
      position={[0, 0, 0]} // Center the text
      fontSize={0.5} // Adjust size
      color={colorHex}
      font={undefined} // Use system default for now to avoid font loading issues
      anchorX="center"
      anchorY="middle"
      maxWidth={4} // Prevent text from becoming too wide
    >
      {text}
    </Text>
  );
  // --- End Temporary Placeholder ---
}

const HatPreview3D: React.FC<HatPreview3DProps> = (props) => {
  return (
    <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-inner overflow-hidden">
      {" "}
      {/* Adjust height as needed */}
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        {" "}
        {/* Adjust camera position/fov */}
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={0.8} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        {/* Suspense is needed for useGLTF while the model loads */}
        <Suspense fallback={null}>
          <HatModel {...props} />
        </Suspense>
        {/* Controls */}
        <OrbitControls enableZoom={true} enablePan={true} />
        {/* Optional: Add a floor or environment */}
        {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}> // Adjust Y position based on model size
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh> */}
      </Canvas>
    </div>
  );
};

export default HatPreview3D;
