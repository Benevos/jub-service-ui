'use client'

import { useState, useCallback, useEffect } from 'react';

import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
} from '@xyflow/react';
import { useAppSelector } from '@/lib/hooks';
import ServiceType from '@/types/service';
import nodeTypes from '@/types/nodeTypes';
import { useMediaQuery, useTheme } from '@mui/material';


export default function App() {

    const selectedService = useAppSelector((state) => state.services.selected)

    const theme = useTheme();
    const isOnMoblieSize = useMediaQuery(theme.breakpoints.down('md'));

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const buildNodes = (service: ServiceType | null): Node[] => {
        
        if (!service) return []
 
        const y_margin = isOnMoblieSize ? 250 : 200;

        return service.workflow.stages.map((stage, index) => ({
            id: stage.stage_id,
            type: "stage",
            position: {x: 0, y: index * y_margin},
            data: {
                ...stage,
                index: index+1,
                isFirst: index === 0,
                isLast: index === service.workflow.stages.length - 1
            }
        }))
    }

    const buildEdges = (service: ServiceType | null): Edge[] => {

        if (!service) return []

        const stages = service.workflow.stages

        return stages.slice(0, -1).map((stage, index) => ({
            id: `${stage.stage_id}-${stages[index + 1].stage_id}`,
            source: stage.stage_id,
            target: stages[index + 1].stage_id,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#757575" },
            style: {
                strokeWidth: 4,
                stroke: "#757575"
            }
        }))
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNodes(buildNodes(selectedService))
        setEdges(buildEdges(selectedService))
    }, [selectedService])

    /* useEffect(() => {
        console.log(nodes)
        console.log(edges)
    }, [nodes, edges]) */

    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nodesSnapshot) =>
                applyNodeChanges(changes, nodesSnapshot)
        ),
    [],);

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((edgesSnapshot) =>
                applyEdgeChanges(changes, edgesSnapshot)
            ),
        [],
    );

    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((edgesSnapshot) =>
                addEdge(params, edgesSnapshot)
            ),
        [],
    );

    return (
        <div className='h-[400px] w-full my-4'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                edgesReconnectable={false}
                proOptions={{ hideAttribution: true }}
                fitView
            >
                <Controls/>
                <Background variant={BackgroundVariant.Dots} size={2} gap={10}/>
            </ReactFlow>
        </div>
    );
}