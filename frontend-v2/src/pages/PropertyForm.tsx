"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ChevronLeft } from "../components/icons"
import { getProperty, getMunicipalities, createProperty, updateProperty } from "../api/api"
import type { Municipality } from "../types"
import { useToast } from "../components/ui/Toast"

export default function PropertyForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])

  const [formData, setFormData] = useState<{
    assessment_roll_number: string
    assessment_value: number
    municipal_id: string
  }>({
    assessment_roll_number: "",
    assessment_value: 0,
    municipal_id: "",
  })

  const [errors, setErrors] = useState<{
    assessment_roll_number?: string
    assessment_value?: string
    municipal_id?: string
  }>({})

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const municipalitiesData = await getMunicipalities()
        setMunicipalities(municipalitiesData)

        if (id) {
          const propertyData = await getProperty(id)
          if (propertyData) {
            setFormData({
              assessment_roll_number: propertyData.assessment_roll_number,
              assessment_value: propertyData.assessment_value,
              municipal_id: propertyData.municipal_id,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const validateForm = () => {
    const newErrors: {
      assessment_roll_number?: string
      assessment_value?: string
      municipal_id?: string
    } = {}

    if (!formData.assessment_roll_number) {
      newErrors.assessment_roll_number = "Roll number is required"
    }

    if (formData.assessment_value <= 0) {
      newErrors.assessment_value = "Value must be positive"
    }

    if (!formData.municipal_id) {
      newErrors.municipal_id = "Municipality is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      if (id) {
        await updateProperty(id, formData)
        showToast("Property updated", "Your property has been updated successfully.")
      } else {
        await createProperty(formData)
        showToast("Property created", "Your property has been created successfully.")
      }
      navigate("/")
    } catch (error) {
      showToast("Error", "Something went wrong. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "assessment_value" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  if (isLoading) {
    return <div className="py-10 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-2">
        <Link to={id ? `/properties/${id}` : "/"}>
          <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-md">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{id ? "Edit Property" : "Add New Property"}</h1>
      </div>

      <div className="rounded-lg border bg-white shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="assessment_roll_number" className="block text-sm font-medium">
              Assessment Roll Number
            </label>
            <input
              id="assessment_roll_number"
              name="assessment_roll_number"
              type="text"
              placeholder="Enter roll number"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.assessment_roll_number}
              onChange={handleChange}
              disabled={!!id} // Disable editing roll number for existing properties
            />
            {errors.assessment_roll_number && (
              <p className="text-destructive text-sm">{errors.assessment_roll_number}</p>
            )}
            <p className="text-sm text-gray-500">The unique identifier for this property.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="assessment_value" className="block text-sm font-medium">
              Assessment Value ($)
            </label>
            <input
              id="assessment_value"
              name="assessment_value"
              type="number"
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.assessment_value}
              onChange={handleChange}
            />
            {errors.assessment_value && <p className="text-destructive text-sm">{errors.assessment_value}</p>}
            <p className="text-sm text-gray-500">The assessed value of the property in dollars.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="municipal_id" className="block text-sm font-medium">
              Municipality
            </label>
            <select
              id="municipal_id"
              name="municipal_id"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.municipal_id}
              onChange={handleChange}
            >
              <option value="">Select a municipality</option>
              {municipalities.map((municipality) => (
                <option key={municipality.municipal_id} value={municipality.municipal_id}>
                  {municipality.municipal_name}
                </option>
              ))}
            </select>
            {errors.municipal_id && <p className="text-destructive text-sm">{errors.municipal_id}</p>}
            <p className="text-sm text-gray-500">The municipality where this property is located.</p>
          </div>

          <div className="flex justify-end gap-2">
            <Link to={id ? `/properties/${id}` : "/"}>
              <button type="button" className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : id ? "Update Property" : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

