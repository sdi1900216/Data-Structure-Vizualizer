import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { v4 as uuidv4 } from "uuid";
import type { DisplayedBlock } from "../components/StackVisualizer3D";
import { useNavigate } from "react-router-dom";

interface VisualizerLayoutProps {
  title: string;
  description: string;
  mode: "stack" | "queue" | "linkedlist"; 
  dataStructureRef: React.MutableRefObject<any>; // θα κρατήσει instance
  VisualizerComponent: React.FC<any>;
  addLabel: string;
  removeLabel: string;
}

const VisualizerLayout: React.FC<VisualizerLayoutProps> = ({
  title,
  description,
  mode,
  dataStructureRef,
  VisualizerComponent,
  addLabel,
  removeLabel,
}) => {
  const navigate = useNavigate();

  // displayedItems κρατά id + value για rendering & animation
  const [displayedItems, setDisplayedItems] = useState<DisplayedBlock[]>([]);
  const [lastAddedId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<{ id: string; index: number; value: string | number } | null>(null);
  const [input, setInput] = useState("");

  // helper: push/enqueue
  const handleAdd = () => {
    const value = input || Math.floor(Math.random() * 100);
    const id = uuidv4();
  if (mode === "stack") {
    dataStructureRef.current.push(value);
    setDisplayedItems(prev => [...prev, { id, value }]);
  } else if (mode === "queue") {
    dataStructureRef.current.enqueue(value);
    setDisplayedItems(prev => [...prev, { id, value }]);
  } else if (mode === "linkedlist") {
    dataStructureRef.current.append(value);
    setDisplayedItems(prev => [...prev, { id, value }]);
  }
  }; 

  // remove: mark removing (first for queue, last for stack)
  const handleRemove = () => {
    if (displayedItems.length === 0) return;
    const candidate = mode === "stack" ? displayedItems[displayedItems.length - 1] : displayedItems[0];
    setRemovingId(candidate.id);

    if (selectedBlock?.id === candidate.id) {
      setSelectedBlock(null);
    }
  };

  const onBlockRemoved = (id: string) => {
    if (mode === "stack") {
  dataStructureRef.current.pop();
  setDisplayedItems(prev => prev.filter(b => b.id !== id));
} else if (mode === "queue") {
  dataStructureRef.current.dequeue();
  setDisplayedItems(prev => prev.filter(b => b.id !== id));
} else if (mode === "linkedlist") {
    //Αφαιρούμε μόνο το node που τελείωσε το animation
    setDisplayedItems(prev => prev.filter(item => item.id !== id));
    dataStructureRef.current.removeHead(); // αφαιρούμε το head μετά το animation
    setRemovingId(null);
}
  };

  const onBlockClicked = (id: string, index: number, value: string | number) => {
    setSelectedBlock({ id, index, value });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
        background: "#0e0e13",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Canvas area (80%) */}
      <div
        style={{
          flex: 0.8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 20,
          height: "100%",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter value"
            style={{
              marginRight: 10,
              padding: 6,
              borderRadius: 4,
              border: "1px solid #555",
              background: "#1c1c28",
              color: "white",
            }}
          />
          <button onClick={handleAdd} style={{ marginRight: 8 }}>{addLabel}</button>
          <button onClick={handleRemove}>{removeLabel}</button>
          <button onClick={() => navigate("/")} style={{ marginLeft: 16 }}>Back</button>
        </div>

        <div style={{ width: "100%", height: "100%" }}>
          <Canvas style={{ width: "100%", height: "100%" }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <VisualizerComponent
              items={displayedItems}
              removingId={removingId ?? undefined}
              lastAddedId={lastAddedId ?? undefined}
              selectedId={selectedBlock?.id ?? undefined}
              onBlockRemoved={onBlockRemoved}
              onBlockClicked={onBlockClicked}
            />
            <OrbitControls enablePan={true} enableZoom={true} minDistance={2} maxDistance={20} />
            <Environment preset="sunset" />
          </Canvas>
        </div>
      </div>

      {/* Info panel (20%) */}
      <div
        style={{
          flex: 0.2,
          padding: 20,
          background: "#1a1a25",
          borderLeft: "2px solid #222",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          overflowY: "auto",
        }}
      >
        <h2>{title}</h2>
        <p>{description}</p>

        {!selectedBlock && <p>Κάνε click σε ένα block για πληροφορίες.</p>}

        {selectedBlock && (
          <>
            <h3>Selected</h3>
            <p><strong>Index:</strong> {selectedBlock.index}</p>
            <p><strong>Value:</strong> {selectedBlock.value}</p>
          </>
        )}

        <h4 style={{ marginTop: 14 }}>Elements</h4>
        {displayedItems.length === 0 ? <p>Empty</p> : (
          <ul>
            {displayedItems.map((b, idx) => <li key={b.id}>{idx}: {b.value}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VisualizerLayout;
