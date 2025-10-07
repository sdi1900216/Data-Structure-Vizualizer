import Block3D from "./Block3D";
import type { DisplayedBlock } from "./StackVisualizer3D";

interface Props {
  items: DisplayedBlock[];
  removingId?: string;
  lastAddedId?: string;
  selectedId?: string;
  onBlockRemoved?: (id: string) => void;
  onBlockClicked?: (id: string, index: number, value: string | number) => void;
}

const QueueVisualizer3D: React.FC<Props> = ({
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
            position={[i * 1.2 - (items.length - 1) * 0.6, 0, 0]} // κεντράρισμα οριζόντια
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

export default QueueVisualizer3D;