import React, { useState } from "react";
import { Text } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";

interface BlockProps {
  position: [number, number, number];
  color: string;
  value: string | number;
  isNew?: boolean;
  isRemoving?: boolean;
  isSelected?: boolean;
  onAnimationEnd?: () => void;
  onClick?: () => void;
  scaleOverride?: number;
}

const Block3D: React.FC<BlockProps> = ({
  position,
  color,
  value,
  isNew = false,
  isRemoving = false,
  isSelected = false,
  onAnimationEnd,
  onClick,
  scaleOverride,
}) => {
  const [active, setActive] = useState(true);

  const targetScale = scaleOverride ?? (isSelected ? 1.2 : 1);
  // when new: we want small -> targetScale; when removing: move up and shrink
  const { rotY, posY, scale } = useSpring({
    // initial values
    from: {
      rotY: isNew ? Math.PI * 2 : 0,
      posY: position[1] + (isNew ? 1 : 0),
      scale: isNew ? 0.001 : (scaleOverride ?? 1),
    },
    // to values depend on state
    to: {
      rotY: 0,
      posY: isRemoving ? position[1] + 2 : position[1],
      scale: isRemoving ? 0.001 : targetScale,
    },
    config: { mass: 1, tension: 170, friction: 20 },
    onRest: () => {
      if (isRemoving) {
        // after removal animation finished
        setActive(false);
        onAnimationEnd?.();
      }
    },
  });

  if (!active) return null;

  return (
    <a.group
      rotation-y={rotY}
      position-x={position[0]}
      position-y={posY}
      position-z={position[2]}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <mesh>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={isSelected ? "orange" : "black"}
          emissiveIntensity={isSelected ? 0.8 : 0}
        />
      </mesh>

      <Text
        position={[0, 0, 0.51]}
        fontSize={0.22}
        color={isSelected ? "black" : "#fff"}
        anchorX="center"
        anchorY="middle"
      >
        {String(value)}
      </Text>
    </a.group>
  );
};

export default Block3D;