import React from "react";
import Block3D from "./Block3D";

export interface DisplayedBlock {
  id: string;
  value: string | number;
}

interface Props {
  items: DisplayedBlock[];
  removingId?: string;
  lastAddedId?: string;
  selectedId?: string;
  onBlockRemoved?: (id: string) => void;
  onBlockClicked?: (id: string, index: number, value: string | number) => void;
}

const StackVisualizer3D: React.FC<Props> = ({
  items,
  removingId,
  lastAddedId,
  selectedId,
  onBlockRemoved,
  onBlockClicked,
}) => {
  return (
    <>
      {items.map((b, i) => {
        const isRemoving = removingId === b.id;
        const isNew = lastAddedId === b.id;
        return (
          <Block3D
            key={b.id}
            value={b.value}
            position={[0, i * 0.6, 0]}
            color={`hsl(${(i * 45) % 360},70%,50%)`}
            isNew={isNew}
            isRemoving={isRemoving}
            isSelected={selectedId === b.id}
            onAnimationEnd={isRemoving ? () => onBlockRemoved?.(b.id) : undefined}
            onClick={() => onBlockClicked?.(b.id, i, b.value)}
          />
        );
      })}
    </>
  );
};

export default StackVisualizer3D;