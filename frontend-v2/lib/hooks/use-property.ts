"use client"

import { useState, useEffect } from "react"
import type { Property } from "./use-properties"

export function useProperty(id?: string) {
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    const fetchProperty = async () => {
      try {
        // In a real app, this would be an API call
        // For this demo, we'll simulate fetching from an API
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

        // Mock data - in a real app this would come from the API
        const mockProperties = [
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
        ]

        const foundProperty = mockProperties.find((p) => p.assessment_roll_number === id) || null
        setProperty(foundProperty)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch property"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  return { property, isLoading, error }
}

