export type DataSourceType = {
    record_id: string
    source_id: string
    spatial_id: string
    temporal_id: string
    interest_ids: string[],
    numerical_interest_ids: Record<string, string | number>
    raw_payload: Record<string, string | number | boolean>
}