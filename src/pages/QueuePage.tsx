import React, { useRef } from "react";
import VisualizerLayout from "../shared/VisualizerLayout";
import Queue from "../DataStructures/Queue";
import QueueVisualizer3D from "../components/QueueVisualizer3D";

const QueuePage: React.FC = () => {
  const ref = useRef(new Queue<string | number>());
  return (
    <VisualizerLayout
      title="Queue Visualizer"
      description="Ουρά (FIFO) — Enqueue προσθέτει στο τέλος, Dequeue αφαιρεί από την αρχή."
      mode="queue"
      dataStructureRef={ref}
      VisualizerComponent={QueueVisualizer3D}
      addLabel="Enqueue"
      removeLabel="Dequeue"
    />
  );
};

export default QueuePage;