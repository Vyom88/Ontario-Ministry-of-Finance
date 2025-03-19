import type { Property, Municipality } from "../types"

// Mock data based on the CSV file structure
const MOCK_MUNICIPALITIES: Municipality[] = [
  {
    municipal_id: "M001",
    municipal_name: "Springfield",
    municipal_rate: 1.25,
    education_rate: 0.75,
  },
  {
    municipal_id: "M002",
    municipal_name: "Shelbyville",
    municipal_rate: 1.35,
    education_rate: 0.8,
  },
  {
    municipal_id: "M003",
    municipal_name: "Capital City",
    municipal_rate: 1.5,
    education_rate: 0.85,
  },
  {
    municipal_id: "M004",
    municipal_name: "Cypress Creek",
    municipal_rate: 1.15,
    education_rate: 0.7,
  },
  {
    municipal_id: "M005",
    municipal_name: "North Haverbrook",
    municipal_rate: 1.4,
    education_rate: 0.75,
  },
]

// Mock data based on the CSV file structure
const MOCK_PROPERTIES: Property[] = [
  {
    assessment_roll_number: "P001",
    assessment_value: 250000,
    municipal_id: "M001",
  },
  {
    assessment_roll_number: "P002",
    assessment_value: 320000,
    municipal_id: "M001",
  },
  {
    assessment_roll_number: "P003",
    assessment_value: 450000,
    municipal_id: "M002",
  },
  {
    assessment_roll_number: "P004",
    assessment_value: 380000,
    municipal_id: "M002",
  },
  {
    assessment_roll_number: "P005",
    assessment_value: 520000,
    municipal_id: "M003",
  },
  {
    assessment_roll_number: "P006",
    assessment_value: 290000,
    municipal_id: "M003",
  },
  {
    assessment_roll_number: "P007",
    assessment_value: 410000,
    municipal_id: "M004",
  },
  {
    assessment_roll_number: "P008",
    assessment_value: 350000,
    municipal_id: "M004",
  },
  {
    assessment_roll_number: "P009",
    assessment_value: 480000,
    municipal_id: "M005",
  },
  {
    assessment_roll_number: "P010",
    assessment_value: 275000,
    municipal_id: "M005",
  },
  {
    assessment_roll_number: "P011",
    assessment_value: 390000,
    municipal_id: "M001",
  },
  {
    assessment_roll_number: "P012",
    assessment_value: 425000,
    municipal_id: "M002",
  },
]

// In a real app, these would be API calls to your Python backend
// For this demo, we'll use the mock data

interface GetPropertiesOptions {
  search?: string
  page?: number
  municipalId?: string
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get all properties with optional filtering
export async function getProperties(options: GetPropertiesOptions = {}): Promise<Property[]> {
  const { search = "", page = 1, municipalId = "" } = options

  await delay(500) // Simulate API delay

  let filteredProperties = [...MOCK_PROPERTIES]

  // Apply search filter
  if (search) {
    filteredProperties = filteredProperties.filter((property) =>
      property.assessment_roll_number.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // Apply municipality filter
  if (municipalId) {
    filteredProperties = filteredProperties.filter((property) => property.municipal_id === municipalId)
  }

  // Apply pagination (10 items per page)
  const pageSize = 10
  const startIndex = (page - 1) * pageSize
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + pageSize)

  return paginatedProperties
}

// Get a single property by ID
export async function getProperty(id: string): Promise<Property | null> {
  await delay(500) // Simulate API delay

  const property = MOCK_PROPERTIES.find((p) => p.assessment_roll_number === id) || null
  return property
}

// Create a new property
export async function createProperty(propertyData: Omit<Property, "id">): Promise<Property> {
  await delay(500) // Simulate API delay

  // In a real app, this would be an API call to create the property
  // For this demo, we'll just return the data as if it was created
  return {
    ...propertyData,
    assessment_roll_number: propertyData.assessment_roll_number,
  }
}

// Update an existing property
export async function updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
  await delay(500) // Simulate API delay

  // In a real app, this would be an API call to update the property
  // For this demo, we'll just return the updated data
  return {
    assessment_roll_number: id,
    assessment_value: propertyData.assessment_value || 0,
    municipal_id: propertyData.municipal_id || "",
  }
}

// Delete a property
export async function deleteProperty(id: string): Promise<void> {
  await delay(500) // Simulate API delay

  // In a real app, this would be an API call to delete the property
  // For this demo, we'll just simulate a successful deletion
  return
}

// Get all municipalities
export async function getMunicipalities(): Promise<Municipality[]> {
  await delay(500) // Simulate API delay

  return [...MOCK_MUNICIPALITIES]
}

