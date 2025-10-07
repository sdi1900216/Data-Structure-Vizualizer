import React, { useRef } from "react";
import VisualizerLayout from "../shared/VisualizerLayout";
import LinkedListVisualizer3D from "../components/LinkedListVisualizer3D";
import { LinkedList } from "../DataStructures/LinkedList";

const LinkedListPage: React.FC = () => {
  const linkedListRef = useRef(new LinkedList());
  return (
    <VisualizerLayout
      title="Linked List Visualizer"
      description="Κάθε κόμβος δείχνει στον επόμενο. Remove Head αφαιρεί το πρώτο."
      mode="linkedlist"                    // ΠΡΟΤΕΡΑΙΟ: linkedlist
      dataStructureRef={linkedListRef}     // περνάμε το ref (useRef)
      VisualizerComponent={LinkedListVisualizer3D}
      addLabel="Append"
      removeLabel="Remove Head"
    />
  );
};

export default LinkedListPage;