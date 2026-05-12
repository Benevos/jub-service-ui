import { Handle, type NodeProps, type Node, Position } from '@xyflow/react'
import React, { useEffect } from 'react'
import { HiOutlinePuzzlePiece } from 'react-icons/hi2'

interface BuldingBlockInterface {
    building_block_id: string
    name: string
}

interface TransformationInterface {
    name: string
    pattern: string
    pattern_id: string
    building_block: BuldingBlockInterface
}

interface StageInterface {
    stage_id: string
    name: string
    sink: string
    source: string
    transformation: TransformationInterface

    //! Injected paremeters
    index: number
    isFirst: boolean
    isLast: boolean
}

interface StageNodeProps {
    id: string
    data: StageInterface
    type: string
}

function StageNode(props: StageNodeProps) 
{
    return (
        <div className='stage-node form-shadow border rounded-lg max-w-[500px] bg-white'>
            
            <div className='flex items-center justify-center pb-1 px-3 pt-3 bg-[#e6e6e6] rounded-lg'>
                 <span className='text font-bold'>{`Etapa ${props.data.index}`}</span>
            </div>

            <div className='pb-3 px-3'>
                <span className='text'>{props.data.name}</span>

                <div>
                    <span className='text text-[#757575]'>{`${props.data.source} → ${props.data.sink}`}</span>
                </div>

                <div className='flex flex-wrap gap-2'>
                    <div className='bg-[#e6e6e6] p-1 rounded-xl flex items-center gap-1'>
                        <HiOutlinePuzzlePiece/> <span className='text-xs'>{props.data.transformation.name}</span>
                    </div>
                    <div className='bg-[#e6e6e6] p-1 rounded-xl flex items-center gap-1'>
                        <HiOutlinePuzzlePiece/> <span className='text-xs'>{props.data.transformation.building_block.name}</span>
                    </div>
                </div>
            </div>
            

            {!props.data.isFirst && (
                <Handle
                    type='target'
                    position={Position.Top}
                />
            )}

            {!props.data.isLast && (
                <Handle
                    type='source'
                    position={Position.Bottom}
                />
            )}
        </div>
    )
}

export default StageNode