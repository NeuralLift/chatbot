// import React, { useCallback } from 'react';
// import {
//   addEdge,
//   Background,
//   Controls,
//   MiniMap,
//   ReactFlow,
//   useEdgesState,
//   useNodesState,
// } from '@xyflow/react';

// import '@xyflow/react/dist/style.css';

// import { useTheme } from '@/components/ThemeProvider';

// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const { theme } = useTheme();

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges]
  // );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={theme}>
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow> */}
    </div>
  );
}
