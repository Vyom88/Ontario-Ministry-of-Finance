import type { Property, Municipality } from "../types"
import { formatCurrency } from "../utils/format"
import { Building, Home, TrendingUp } from "./icons"

interface DashboardStatsProps {
  properties: Property[]
  municipalities: Municipality[]
}

export default function DashboardStats({ properties, municipalities }: DashboardStatsProps) {
  // Calculate total assessment value
  const totalAssessmentValue = properties.reduce((sum, property) => sum + property.assessment_value, 0)

  // Calculate total annual tax
  const totalAnnualTax = properties.reduce((sum, property) => {
    const municipality = municipalities?.find?.((m) => m.municipal_id === property.municipal_id)
    if (!municipality) return sum

    const taxRate = municipality.municipal_rate + municipality.education_rate
    return sum + (property.assessment_value * taxRate) / 100
  }, 0)

  // Get average tax rate
  const avgTaxRate = municipalities?.length
    ? municipalities.reduce((sum, m) => sum + m.municipal_rate + m.education_rate, 0) / municipalities.length
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
          <Home className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold">{properties.length}</div>
        <p className="text-xs text-gray-500">Across {municipalities.length} municipalities</p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-500">Total Assessment Value</h3>
          <Building className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold">{formatCurrency(totalAssessmentValue)}</div>
        <p className="text-xs text-gray-500">Avg: {formatCurrency(totalAssessmentValue / (properties.length || 1))}</p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-500">Total Annual Tax</h3>
          <TrendingUp className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold">{formatCurrency(totalAnnualTax)}</div>
        <p className="text-xs text-gray-500">Avg Tax Rate: {avgTaxRate.toFixed(2)}%</p>
      </div>
    </div>
  )
}

