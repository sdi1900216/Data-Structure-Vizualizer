import React, { useEffect } from "react";
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

  // Trigger onBlockRemoved όταν τελειώσει το animation
  useEffect(() => {
    if (removingId) {
      const timeout = setTimeout(() => {
        onBlockRemoved(removingId);
      }, 600); // αντιστοιχεί με την διάρκεια animation στο Block3D
      return () => clearTimeout(timeout);
    }
  }, [removingId]);

  return (
    <>
      {items.map((item, index) => {
        const isSelected = selectedId === item.id;
        const isNew = lastAddedId === item.id;
        const isRemoving = removingId === item.id;
        const isTraversing = traversingId === item.id;
        const x = index * nodeSpacing;

        return (
          <React.Fragment key={item.id}>
            <Block3D
              position={[x, 0, 0]}
              value={item.value}
              color={
                isSelected
                  ? "goldenrod"
                  : isRemoving
                  ? "red"
                  : isTraversing
                  ? "yellow"
                  : "#3b82f6"
              }
              isNew={isNew}
              isRemoving={isRemoving}
              isSelected={isSelected}
              onClick={() => onBlockClicked(item.id, index, item.value)}
              onAnimationEnd={() => {}}
            />

            {/* Arrow προς επόμενο node */}
            {index < items.length && (
              <group key={`arrow-${index}`}>
                {index < items.length - 1 && (
                  <>
                    {/* Cylinder */}
                    <mesh
                      position={[x + nodeSpacing / 2, 0, 0]}
                      rotation={[0, 0, -Math.PI / 2]}
                    >
                      <cylinderGeometry args={[0.03, 0.03, nodeSpacing - 1, 8]} />
                      <meshStandardMaterial color="white" />
                    </mesh>
                    {/* Cone */}
                    <mesh
                      position={[x + nodeSpacing - 0.125, 0, 0]}
                      rotation={[0, 0, -Math.PI / 2]}
                    >
                      <coneGeometry args={[0.08, 0.25, 8]} />
                      <meshStandardMaterial color="white" />
                    </mesh>
                  </>
                )}
              </group>
            )}
          </React.Fragment>
        );
      })}

      {/* Tail NULL box */}
      <Block3D
        position={[items.length * nodeSpacing, 0, 0]}
        value="NULL"
        color="#888888"
        scaleOverride={0.5}
      />
    </>
  );
};

export default LinkedListVisualizer3D;