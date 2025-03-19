"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Edit, Eye, Trash } from "./icons"
import type { Property, Municipality } from "../types"
import { formatCurrency } from "../utils/format"
import { useToast } from "./ui/Toast"
import { deleteProperty } from "../api/api"

interface PropertiesTableProps {
  properties: Property[]
  municipalities: Municipality[]
  page: number
  setPage: (page: number) => void
  search: string
  municipalId: string
}

export default function PropertiesTable({
  properties,
  municipalities,
  page,
  setPage,
  search,
  municipalId,
}: PropertiesTableProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteProperty(id)
      showToast("Property deleted", "The property has been successfully deleted.")
      // Refresh the page to get updated data
      window.location.reload()
    } catch (error) {
      showToast("Error", "Failed to delete property. Please try again.", "error")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (properties.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500 mb-4">No properties found</p>
        <Link to="/properties/new">
          <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md">Add Property</button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Municipality
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assessment Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Annual Tax
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => {
              const municipality = municipalities?.find?.((m) => m.municipal_id === property.municipal_id)

              const taxRate = municipality ? municipality.municipal_rate + municipality.education_rate : 0

              const annualTax = (property.assessment_value * taxRate) / 100

              return (
                <tr key={property.assessment_roll_number} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {property.assessment_roll_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {municipality?.municipal_name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(property.assessment_value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(annualTax)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => navigate(`/properties/${property.assessment_roll_number}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/properties/${property.assessment_roll_number}/edit`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(property.assessment_roll_number)}
                        className="text-destructive hover:text-destructive-dark"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <button
          className={`border border-gray-300 px-3 py-1 rounded-md flex items-center ${
            page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        <button
          className={`border border-gray-300 px-3 py-1 rounded-md flex items-center ${
            properties.length < 10 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
          onClick={() => setPage(page + 1)}
          disabled={properties.length < 10}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {deleteId && (
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
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-destructive hover:bg-destructive-dark text-white px-4 py-2 rounded-md"
                onClick={() => deleteId && handleDelete(deleteId)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

