import React, { useRef } from "react";
import VisualizerLayout from "../shared/VisualizerLayout";
import Stack from "../DataStructures/Stack";
import StackVisualizer3D from "../components/StackVisualizer3D";

const StackPage: React.FC = () => {
  const ref = useRef(new Stack<string | number>());
  return (
    <VisualizerLayout
      title="Stack Visualizer"
      description="Στοίβα (LIFO) — Push προσθέτει στο πάνω μέρος, Pop αφαιρεί από πάνω."
      mode="stack"
      dataStructureRef={ref}
      VisualizerComponent={StackVisualizer3D}
      addLabel="Push"
      removeLabel="Pop"
    />
  );
};

export default StackPage;