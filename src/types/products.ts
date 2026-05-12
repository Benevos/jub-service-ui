type ProductMetadataType = {
    extension: string | null
}

export type VariableType = {
  code: number
  name: string
  value: string
  description: string
}

export type ProductType = {
  product_id: string
  name: string
  description: string
  tags: string[]
  attributes: string[]
  spatial_variable: VariableType
  temporal_variable: VariableType
  interest_variable: VariableType[]
  metadata: ProductMetadataType | null
  created_at: string
  updated_at: string
}

export default ProductType;