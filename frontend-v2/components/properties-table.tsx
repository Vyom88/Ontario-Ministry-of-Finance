"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { useProperties } from "@/lib/hooks/use-properties"
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

export default function PropertiesTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const search = searchParams.get("search") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const municipalId = searchParams.get("municipalId") || ""

  const {
    properties = [],
    municipalities = [],
    isLoading,
    deleteProperty,
  } = useProperties({
    search,
    page,
    municipalId,
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id)
      toast({
        title: "Property deleted",
        description: "The property has been successfully deleted.",
      })
      setDeleteId(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="py-10 text-center">Loading properties...</div>
  }

  if (properties.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground mb-4">No properties found</p>
        <Link href="/properties/new">
          <Button>Add Property</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll Number</TableHead>
              <TableHead>Municipality</TableHead>
              <TableHead className="text-right">Assessment Value</TableHead>
              <TableHead className="text-right">Annual Tax</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => {
              const municipality = municipalities?.find?.((m) => m.municipal_id === property.municipal_id) || null

              const taxRate = municipality ? municipality.municipal_rate + municipality.education_rate : 0

              const annualTax = (property.assessment_value * taxRate) / 100

              return (
                <TableRow key={property.assessment_roll_number}>
                  <TableCell className="font-medium">{property.assessment_roll_number}</TableCell>
                  <TableCell>{municipality?.municipal_name || "Unknown"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(property.assessment_value)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(annualTax)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/properties/${property.assessment_roll_number}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/properties/${property.assessment_roll_number}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(property.assessment_roll_number)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newPage = Math.max(1, page - 1)
            router.push(`/?page=${newPage}&search=${search}&municipalId=${municipalId}`)
          }}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newPage = page + 1
            router.push(`/?page=${newPage}&search=${search}&municipalId=${municipalId}`)
          }}
          disabled={properties.length < 10}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
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
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

