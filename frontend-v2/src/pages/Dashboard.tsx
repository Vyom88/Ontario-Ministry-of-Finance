"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { PlusCircle, Search, X } from "../components/icons"
import PropertiesTable from "../components/PropertiesTable"
import DashboardStats from "../components/DashboardStats"
import { getMunicipalities, getProperties } from "../api/api"
import type { Municipality, Property } from "../types"

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [municipalId, setMunicipalId] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [propertiesData, municipalitiesData] = await Promise.all([
          getProperties({ search, municipalId, page }),
          getMunicipalities(),
        ])
        setProperties(propertiesData)
        setMunicipalities(municipalitiesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [search, municipalId, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page on search
  }

  const resetFilters = () => {
    setSearch("")
    setMunicipalId("")
    setPage(1)
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Assessment Tracker</h1>
          <p className="text-gray-500">Manage and track property assessments and tax calculations</p>
        </div>
        <Link to="/properties/new">
          <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </button>
        </Link>
      </div>

      {isLoading ? (
        <div className="h-72 flex items-center justify-center">Loading stats...</div>
      ) : (
        <DashboardStats properties={properties} municipalities={municipalities} />
      )}

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Properties</h2>

          <form onSubmit={handleSearch} className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by roll number..."
                  className="pl-8 w-full border border-gray-300 rounded-md p-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={municipalId}
                onChange={(e) => setMunicipalId(e.target.value)}
                className="w-full sm:w-[200px] border border-gray-300 rounded-md p-2"
              >
                <option value="">All municipalities</option>
                {municipalities.map((municipality) => (
                  <option key={municipality.municipal_id} value={municipality.municipal_id}>
                    {municipality.municipal_name}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md">
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md flex items-center"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          </form>

          {isLoading ? (
            <div className="h-72 flex items-center justify-center">Loading properties...</div>
          ) : (
            <PropertiesTable
              properties={properties}
              municipalities={municipalities}
              page={page}
              setPage={setPage}
              search={search}
              municipalId={municipalId}
            />
          )}
        </div>
      </div>
    </div>
  )
}

