import React from "react";
import Block3D from "./Block3D";

interface LinkedListVisualizerProps {
  items: { id: string; value: string | number }[];
  removingId?: string;
  traversingId?: string;
  lastAddedId?: string;
  selectedId?: string;
  onBlockRemoved: (id: string) => void;
  onBlockClicked: (id: string, index: number, value: string | number) => void;
}

const LinkedListVisualizer3D: React.FC<LinkedListVisualizerProps> = ({
  items,
  removingId,
  traversingId,
  lastAddedId,
  selectedId,
  onBlockRemoved,
  onBlockClicked,
}) => {
  const nodeSpacing = 2;

  return (
    <>
      {items.map((item, index) => {
        const isSelected = selectedId === item.id;
        const isNew = lastAddedId === item.id;
        const isRemoving = removingId === item.id;
        const isTraversing = traversingId === item.id;

        const blockX = index * nodeSpacing;

        return (
          <React.Fragment key={item.id}>
            {/* Node */}
            <Block3D
              position={[blockX, 0, 0]}
              value={item.value}
              color={
                isRemoving
                  ? "red"
                  : isTraversing
                  ? "#f59e0b"
                  : isSelected
                  ? "goldenrod"
                  : "#3b82f6"
              }
              isNew={isNew}
              isRemoving={isRemoving}
              isSelected={isSelected}
              onClick={() => onBlockClicked(item.id, index, item.value)}
              onAnimationEnd={() => {
                if (removingId === item.id) onBlockRemoved(item.id);
              }}
            />

            {/* Arrow προς επόμενο node */}
            {index < items.length - 1 && (
              <group key={`arrow-${index}`}>
                {/* Cylinder κορμός (οριζόντιος, μικρότερος για κενό) */}
                <mesh
                  position={[blockX + 0.9, 0, 0]}
                  rotation={[0, 0, -Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
                  <meshStandardMaterial color="white" />
                </mesh>

                {/* Cone μύτη */}
                <mesh
                  position={[blockX + 1.25, 0, 0]}
                  rotation={[0, 0, -Math.PI / 2]}
                >
                  <coneGeometry args={[0.08, 0.25, 8]} />
                  <meshStandardMaterial color="white" />
                </mesh>
              </group>
            )}
          </React.Fragment>
        );
      })}

      {/* Arrow από τελευταίο node προς NULL */}
      {items.length > 0 && (
        <group key={`arrow-null`}>
          <mesh
            position={[items.length * nodeSpacing - 1.05, 0, 0]}
            rotation={[0, 0, -Math.PI / 2]}
          >
            <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh
            position={[items.length * nodeSpacing - 0.55, 0, 0]}
            rotation={[0, 0, -Math.PI / 2]}
          >
            <coneGeometry args={[0.08, 0.25, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      )}

      {/* Tail NULL box */}
      <Block3D
        position={[items.length * nodeSpacing , 0, 0]}
        value="NULL"
        color="#888888"
        scaleOverride={0.5}
      />
    </>
  );
};

export default LinkedListVisualizer3D;
