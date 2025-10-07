import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export type DisplayedBlock = { id: string; value: any };

interface VisualizerLayoutProps {
  title: string;
  description: string;
  mode: "stack" | "queue" | "linkedlist";
  dataStructureRef: React.MutableRefObject<any>;
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

  const [displayedItems, setDisplayedItems] = useState<DisplayedBlock[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [traversingId, setTraversingId] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<{ id: string; index: number; value: any } | null>(null);
  const [input, setInput] = useState("");
  const [deleteInput, setDeleteInput] = useState("");

  const handleAdd = () => {
    const value = input !== "" ? input : Math.floor(Math.random() * 100);
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

    setInput("");
    setLastAddedId(id);
    setTimeout(() => setLastAddedId(null), 800);
  };

  const handleRemove = () => {
    if (displayedItems.length === 0) return;
    const candidate =
      mode === "stack"
        ? displayedItems[displayedItems.length - 1]
        : displayedItems[0];
    setRemovingId(candidate.id);
    if (selectedBlock?.id === candidate.id) setSelectedBlock(null);
  };

  const handleDeleteTail = () => {
    if (displayedItems.length === 0) return;
    const tail = displayedItems[displayedItems.length - 1];
    setRemovingId(tail.id);
  };

  const handleDeleteSelectedValue = () => {
    if (deleteInput === "") return;
    traverseToDelete(0, deleteInput);
  };

  const traverseToDelete = (index: number, valueToDelete: any) => {
    if (index >= displayedItems.length) {
      setTraversingId(null);
      return;
    }
    const node = displayedItems[index];
    setTraversingId(node.id);

    setTimeout(() => {
      if (String(node.value) === String(valueToDelete)) {
        setTraversingId(null);
        setRemovingId(node.id);
      } else {
        traverseToDelete(index + 1, valueToDelete);
      }
    }, 500);
  };

  const onBlockRemoved = (id: string) => {
    const item = displayedItems.find(b => b.id === id);
    if (!item) {
      setRemovingId(null);
      return;
    }

    if (mode === "stack") {
      dataStructureRef.current.pop?.();
      setDisplayedItems(prev => prev.filter(b => b.id !== id));
    } else if (mode === "queue") {
      dataStructureRef.current.dequeue?.();
      setDisplayedItems(prev => prev.filter(b => b.id !== id));
    } else if (mode === "linkedlist") {
      dataStructureRef.current.removeByValue?.(item.value);
      setDisplayedItems(prev => prev.filter(b => b.id !== id));
    }

    setRemovingId(null);
    setTraversingId(null);
    setSelectedBlock(null);
    setDeleteInput("");
  };

  const onBlockClicked = (id: string, index: number, value: any) => {
    setSelectedBlock(prev => (prev?.id === id ? null : { id, index, value }));
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", background: "#0e0e13", color: "white" }}>
      {/* LEFT - CANVAS */}
      <div style={{ flex: 0.8, position: "relative", padding: 20 }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "6px 12px",
            borderRadius: 6,
            background: "#222",
            color: "white",
            border: "1px solid #555",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ← Back
        </button>

        {/* CONTROLS */}
        <div style={{ marginTop: 40, marginBottom: 10 }}>
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
          <button onClick={handleAdd} style={{ marginRight: 8 }}>
            {addLabel}
          </button>
          <button onClick={handleRemove} style={{ marginRight: 8 }}>
            {removeLabel}
          </button>

          {/* Μόνο για linked list */}
          {mode === "linkedlist" && (
            <>
              <button onClick={handleDeleteTail} style={{ marginRight: 8 }}>
                Delete Tail
              </button>
              <button onClick={handleDeleteSelectedValue}>Delete Selected</button>
              <div style={{ marginTop: 6 }}>
                <input
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value)}
                  placeholder="Value to delete"
                  style={{
                    marginTop: 6,
                    padding: 6,
                    borderRadius: 4,
                    border: "1px solid #555",
                    background: "#1c1c28",
                    color: "white",
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* CANVAS */}
        <Canvas style={{ width: "100%", height: "100%" }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <VisualizerComponent
            items={displayedItems}
            removingId={removingId ?? undefined}
            traversingId={traversingId ?? undefined}
            lastAddedId={lastAddedId ?? undefined}
            selectedId={selectedBlock?.id ?? undefined}
            onBlockRemoved={onBlockRemoved}
            onBlockClicked={onBlockClicked}
          />
          <OrbitControls enablePan enableZoom minDistance={2} maxDistance={30} />
          <Environment preset="sunset" />
        </Canvas>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flex: 0.2,
          padding: 20,
          background: "#1a1a25",
          borderLeft: "2px solid #222",
          overflowY: "auto",
        }}
      >
        <h2>{title}</h2>
        <p>{description}</p>

        {!selectedBlock && <p>Click a block to select it.</p>}
        {selectedBlock && (
          <>
            <h3>Selected</h3>
            <p><strong>Index:</strong> {selectedBlock.index}</p>
            <p><strong>Value:</strong> {selectedBlock.value}</p>
          </>
        )}

        <h4 style={{ marginTop: 14 }}>Elements</h4>
        {displayedItems.length === 0 ? (
          <p>Empty</p>
        ) : (
          <ul>
            {displayedItems.map((b, idx) => (
              <li key={b.id}>
                {idx}: {String(b.value)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VisualizerLayout;
