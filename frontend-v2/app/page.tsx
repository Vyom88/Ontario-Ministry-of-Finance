import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import PropertiesTable from "@/components/properties-table"
import { DashboardStats } from "@/components/dashboard-stats"
import { SearchFilter } from "@/components/search-filter"

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Assessment Tracker</h1>
          <p className="text-muted-foreground">Manage and track property assessments and tax calculations</p>
        </div>
        <Link href="/properties/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="h-72 flex items-center justify-center">Loading stats...</div>}>
        <DashboardStats />
      </Suspense>

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Properties</h2>
          <SearchFilter />
          <Suspense fallback={<div className="h-72 flex items-center justify-center">Loading properties...</div>}>
            <PropertiesTable />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

