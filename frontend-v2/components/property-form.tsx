"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useMunicipalities } from "@/lib/hooks/use-municipalities"
import { useProperty } from "@/lib/hooks/use-property"

const formSchema = z.object({
  assessment_roll_number: z.string().min(1, "Roll number is required"),
  assessment_value: z.coerce.number().positive("Value must be positive"),
  municipal_id: z.string().min(1, "Municipality is required"),
})

type PropertyFormValues = z.infer<typeof formSchema>

export function PropertyForm({ id }: { id?: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { municipalities } = useMunicipalities()
  const { property, isLoading: isLoadingProperty } = useProperty(id)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessment_roll_number: "",
      assessment_value: 0,
      municipal_id: "",
    },
  })

  useEffect(() => {
    if (property && !isLoadingProperty) {
      form.reset({
        assessment_roll_number: property.assessment_roll_number,
        assessment_value: property.assessment_value,
        municipal_id: property.municipal_id,
      })
    }
  }, [property, isLoadingProperty, form])

  async function onSubmit(values: PropertyFormValues) {
    setIsSubmitting(true)
    try {
      const endpoint = id ? `/api/properties/${id}` : "/api/properties"
      const method = id ? "PUT" : "POST"

      // In a real app, this would be an actual API call
      // For this demo, we'll simulate a successful response
      console.log(`${method} ${endpoint}`, values)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: id ? "Property updated" : "Property created",
        description: id
          ? "Your property has been updated successfully."
          : "Your property has been created successfully.",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (id && isLoadingProperty) {
    return <div className="py-10 text-center">Loading property data...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="assessment_roll_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Roll Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter roll number"
                  {...field}
                  disabled={!!id} // Disable editing roll number for existing properties
                />
              </FormControl>
              <FormDescription>The unique identifier for this property.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assessment_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Value ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>The assessed value of the property in dollars.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="municipal_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Municipality</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a municipality" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {municipalities.map((municipality) => (
                    <SelectItem key={municipality.municipal_id} value={municipality.municipal_id}>
                      {municipality.municipal_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>The municipality where this property is located.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : id ? "Update Property" : "Create Property"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

