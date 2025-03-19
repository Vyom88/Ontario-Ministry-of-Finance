"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { useProperty } from "@/lib/hooks/use-property"
import { useMunicipalities } from "@/lib/hooks/use-municipalities"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function PropertyDetails({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { property, isLoading } = useProperty(id)
  const { municipalities } = useMunicipalities()

  if (isLoading) {
    return <div className="py-10 text-center">Loading property details...</div>
  }

  if (!property) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
        <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
      </div>
    )
  }

  const municipality = municipalities?.find?.((m) => m.municipal_id === property.municipal_id) || null

  const municipalRate = municipality?.municipal_rate || 0
  const educationRate = municipality?.education_rate || 0
  const totalRate = municipalRate + educationRate

  const municipalTax = (property.assessment_value * municipalRate) / 100
  const educationTax = (property.assessment_value * educationRate) / 100
  const totalTax = municipalTax + educationTax

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // In a real app, this would be an actual API call
      // For this demo, we'll simulate a successful response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Property deleted",
        description: "The property has been successfully deleted.",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            <CardDescription>Basic details about this property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Assessment Roll Number</h3>
              <p className="text-lg">{property.assessment_roll_number}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Assessment Value</h3>
              <p className="text-lg">{formatCurrency(property.assessment_value)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Municipality</h3>
              <p className="text-lg">{municipality?.municipal_name || "Unknown"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Calculation</CardTitle>
            <CardDescription>Annual property tax breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Municipal Tax Rate</h3>
              <p className="text-lg">{municipalRate.toFixed(2)}%</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Education Tax Rate</h3>
              <p className="text-lg">{educationRate.toFixed(2)}%</p>
            </div>
            <Separator className="my-2" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Municipal Tax</h3>
              <p className="text-lg">{formatCurrency(municipalTax)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Education Tax</h3>
              <p className="text-lg">{formatCurrency(educationTax)}</p>
            </div>
            <Separator className="my-2" />
            <div>
              <h3 className="text-sm font-medium">Total Annual Tax</h3>
              <p className="text-xl font-bold">{formatCurrency(totalTax)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CardFooter className="flex justify-end gap-2 pt-6">
        <Button variant="outline" onClick={() => router.push(`/properties/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Property
        </Button>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          <Trash className="mr-2 h-4 w-4" />
          Delete Property
        </Button>
      </CardFooter>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property and remove the data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

