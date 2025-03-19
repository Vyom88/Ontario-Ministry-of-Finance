"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { useMunicipalities } from "@/lib/hooks/use-municipalities"

export function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { municipalities } = useMunicipalities()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [municipalId, setMunicipalId] = useState(searchParams.get("municipalId") || "")

  // Update the URL when filters change
  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (municipalId) params.set("municipalId", municipalId)
    params.set("page", "1") // Reset to first page on filter change

    router.push(`/?${params.toString()}`)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearch("")
    setMunicipalId("")
    router.push("/")
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by roll number..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={municipalId} onValueChange={setMunicipalId}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All municipalities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All municipalities</SelectItem>
            {municipalities.map((municipality) => (
              <SelectItem key={municipality.municipal_id} value={municipality.municipal_id}>
                {municipality.municipal_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button type="submit">Apply Filters</Button>
          <Button type="button" variant="outline" onClick={resetFilters} className="flex items-center">
            <X className="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </form>
  )
}

