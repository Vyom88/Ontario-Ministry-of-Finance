"use client"

import { useState, useEffect } from "react"
import { useMunicipalities } from "./use-municipalities"

export interface Property {
  assessment_roll_number: string
  assessment_value: number
  municipal_id: string
}

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

interface UsePropertiesOptions {
  search?: string
  page?: number
  municipalId?: string
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const { search = "", page = 1, municipalId = "" } = options
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { municipalities } = useMunicipalities()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // In a real app, this would be an API call
        // For this demo, we'll use the mock data and filter it
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

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

        setProperties(paginatedProperties)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch properties"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [search, page, municipalId])

  const deleteProperty = async (id: string) => {
    // In a real app, this would be an API call
    // For this demo, we'll just filter out the property from our local state
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

    setProperties((prevProperties) => prevProperties.filter((property) => property.assessment_roll_number !== id))

    return true
  }

  return { properties, municipalities, isLoading, error, deleteProperty }
}

