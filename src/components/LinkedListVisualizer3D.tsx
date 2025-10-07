import React from "react";
import Block3D from "./Block3D";

interface Item {
  id: string;
  value: string | number;
}

interface LinkedListVisualizerProps {
  items: Item[];
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
                  ? "crimson"
                  : isTraversing
                  ? "gold"
                  : "#3b82f6"
              }
              isNew={isNew}
              isRemoving={isRemoving}
              isSelected={isSelected}
              scaleOverride={item.value === "NULL" ? 0.5 : undefined}
              onClick={() => onBlockClicked(item.id, index, item.value)}
              onAnimationEnd={() => {
                // Block3D calls this after its removal animation finishes
                if (isRemoving) onBlockRemoved(item.id);
              }}
            />

            {/* Arrow προς επόμενο node (μόνο όταν υπάρχει επόμενο πραγματικό node) */}
            {index < items.length - 1 && (
              <group key={`arrow-${item.id}`}>
                {/* compute start and end so arrow doesn't intersect boxes */}
                {(() => {
                  const startX = x + 0.5; // right edge of this node
                  const nextX = (index + 1) * nodeSpacing;
                  const endX = nextX - 0.5; // left edge of next node
                  const length = Math.max(0.1, endX - startX);

                  return (
                    <>
                      {/* cylinder aligned along X: rotate -PI/2 around Z (cyl default Y) */}
                      <mesh
                        position={[startX + length / 2, 0, 0]}
                        rotation={[0, 0, -Math.PI / 2]}
                      >
                        <cylinderGeometry args={[0.03, 0.03, length, 8]} />
                        <meshStandardMaterial color="white" />
                      </mesh>

                      {/* cone at the end */}
                      <mesh position={[endX + 0.125, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.08, 0.25, 8]} />
                        <meshStandardMaterial color="white" />
                      </mesh>
                    </>
                  );
                })()}
              </group>
            )}
          </React.Fragment>
        );
      })}

      {/* Tail NULL box */}
      <Block3D
        position={[items.length * 2, 0, 0]}
        value="NULL"
        color="#888888"
        scaleOverride={0.5}
        onClick={() => {}}
      />
    </>
  );
};

export default LinkedListVisualizer3D;