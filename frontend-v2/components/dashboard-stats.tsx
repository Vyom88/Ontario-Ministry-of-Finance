"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Home, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useProperties } from "@/lib/hooks/use-properties"
import { useMunicipalities } from "@/lib/hooks/use-municipalities"

export function DashboardStats() {
  const { properties, isLoading: isLoadingProperties } = useProperties({})
  const { municipalities, isLoading: isLoadingMunicipalities } = useMunicipalities()

  if (isLoadingProperties || isLoadingMunicipalities) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium bg-muted h-4 w-24 rounded"></CardTitle>
              <div className="h-8 w-8 rounded-full bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted h-6 w-32 rounded mb-1"></div>
              <div className="bg-muted h-4 w-20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calculate total assessment value
  const totalAssessmentValue = properties?.reduce((sum, property) => sum + property.assessment_value, 0) || 0

  // Calculate total annual tax
  const totalAnnualTax =
    properties?.reduce((sum, property) => {
      const municipality = municipalities?.find?.((m) => m.municipal_id === property.municipal_id)
      if (!municipality) return sum

      const taxRate = municipality.municipal_rate + municipality.education_rate
      return sum + (property.assessment_value * taxRate) / 100
    }, 0) || 0

  // Get average tax rate
  const avgTaxRate = municipalities?.length
    ? municipalities.reduce((sum, m) => sum + m.municipal_rate + m.education_rate, 0) / municipalities.length
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{properties?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Across {municipalities?.length || 0} municipalities</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assessment Value</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalAssessmentValue)}</div>
          <p className="text-xs text-muted-foreground">
            Avg: {formatCurrency(totalAssessmentValue / (properties.length || 1))}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Annual Tax</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalAnnualTax)}</div>
          <p className="text-xs text-muted-foreground">Avg Tax Rate: {avgTaxRate.toFixed(2)}%</p>
        </CardContent>
      </Card>
    </div>
  )
}

