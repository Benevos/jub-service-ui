import { DataSourceType } from "./datasource"
import ServiceType from "./service"

export type ObservatoryType = {
    observatory_id: string
    title: string
    description: string
    image_url: string
    metadata: {type?: "datasource" | "sink"}
    view_count: number
    created_at: string
    updated_at: string
}

export type ObservatoryDetailsType = {
    observatory_id: string
    avg_rating: number
    review_count: number
    services: ServiceType[]
    data_sources: DataSourceType[] | null
}

export default ObservatoryType;