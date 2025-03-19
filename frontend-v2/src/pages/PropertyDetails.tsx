"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Edit, Trash, ChevronLeft } from "../components/icons"
import { getProperty, getMunicipalities, deleteProperty } from "../api/api"
import type { Property, Municipality } from "../types"
import { formatCurrency } from "../utils/format"
import { useToast } from "../components/ui/Toast"

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [property, setProperty] = useState<Property | null>(null)
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const [propertyData, municipalitiesData] = await Promise.all([getProperty(id), getMunicipalities()])
        setProperty(propertyData)
        setMunicipalities(municipalitiesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!id) return

    setIsDeleting(true)
    try {
      await deleteProperty(id)
      showToast("Property deleted", "The property has been successfully deleted.")
      navigate("/")
    } catch (error) {
      showToast("Error", "Failed to delete property. Please try again.", "error")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return <div className="py-10 text-center">Loading property details...</div>
  }

  if (!property) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
        <p className="text-gray-500 mb-4">The property you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  const municipality = municipalities.find((m) => m.municipal_id === property.municipal_id)

  const municipalRate = municipality?.municipal_rate || 0
  const educationRate = municipality?.education_rate || 0
  const totalRate = municipalRate + educationRate

  const municipalTax = (property.assessment_value * municipalRate) / 100
  const educationTax = (property.assessment_value * educationRate) / 100
  const totalTax = municipalTax + educationTax

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/">
          <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-md">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Property Details</h1>
      </div>

      <div className="rounded-lg border bg-white shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Property Information</h2>
            <p className="text-sm text-gray-500 mb-4">Basic details about this property</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assessment Roll Number</h3>
                <p className="text-lg">{property.assessment_roll_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assessment Value</h3>
                <p className="text-lg">{formatCurrency(property.assessment_value)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Municipality</h3>
                <p className="text-lg">{municipality?.municipal_name || "Unknown"}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Tax Calculation</h2>
            <p className="text-sm text-gray-500 mb-4">Annual property tax breakdown</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Municipal Tax Rate</h3>
                <p className="text-lg">{municipalRate.toFixed(2)}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Education Tax Rate</h3>
                <p className="text-lg">{educationRate.toFixed(2)}%</p>
              </div>
              <hr className="my-2" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Municipal Tax</h3>
                <p className="text-lg">{formatCurrency(municipalTax)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Education Tax</h3>
                <p className="text-lg">{formatCurrency(educationTax)}</p>
              </div>
              <hr className="my-2" />
              <div>
                <h3 className="text-sm font-medium">Total Annual Tax</h3>
                <p className="text-xl font-bold">{formatCurrency(totalTax)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6">
          <Link to={`/properties/${id}/edit`}>
            <button className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Property
            </button>
          </Link>
          <button
            className="bg-destructive hover:bg-destructive-dark text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Property
          </button>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-4">
              This action cannot be undone. This will permanently delete the property and remove the data from our
              servers.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </button>
              <button
                className="bg-destructive hover:bg-destructive-dark text-white px-4 py-2 rounded-md"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

