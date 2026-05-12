type BuldingBlockType = {
    building_block_id: string,
    name: string
}

type TransformationType = {
    name: string,
    pattern: string,
    pattern_id: string,
    building_block: BuldingBlockType
}

type StageType = {
    stage_id: string
    name: string,
    sink: string,
    source: string,
    transformation: TransformationType
}

type WorkflowType = {
    name: string
    stages: StageType[]
    workflow_id: string
}

type ServiceType = {
    name: string,
    provider: string,
    public: boolean,
    service_id: string,
    description: string,
    workflow: WorkflowType
}

export default ServiceType