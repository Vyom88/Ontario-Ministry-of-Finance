"use client"

import { useState, useEffect } from "react"

export interface Municipality {
  municipal_id: string
  municipal_name: string
  municipal_rate: number
  education_rate: number
}

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

export function useMunicipalities() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        // In a real app, this would be an API call
        // For this demo, we'll use the mock data
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
        setMunicipalities(MOCK_MUNICIPALITIES)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch municipalities"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchMunicipalities()
  }, [])

  return { municipalities, isLoading, error }
}

