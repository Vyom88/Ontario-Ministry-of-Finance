import { PropertyForm } from "@/components/property-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`/properties/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Property</h1>
      </div>

      <div className="rounded-lg border bg-card shadow-sm p-6">
        <PropertyForm id={params.id} />
      </div>
    </div>
  )
}

