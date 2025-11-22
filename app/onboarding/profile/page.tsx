"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Lock } from "lucide-react"

export default function ProfileOnboarding() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [toast, setToast] = useState<{ title: string, description: string, variant?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    bio: "",
    role: "BUYER",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.name) {
      setFormData(prev => ({ ...prev, name: session.user.name || "" }))
    }
  }, [session])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      setToast({
        title: "Profile updated successfully",
        description: "Proceeding to contract setup...",
      })

      // Redirect to contract creation if they're a seller
      setTimeout(() => {
        if (formData.role === "SELLER" || formData.role === "BOTH") {
          router.push("/onboarding/contract")
        } else {
          router.push("/dashboard")
        }
      }, 1500)
    } catch (error) {
      setToast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative p-4">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10">
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#FF3333"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
      </div>

      <div className="max-w-md mx-auto mt-20">
        {/* Logo/Branding */}
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground border-2 border-border flex size-10 items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Lock className="size-5" />
            </div>
            <span>Cypheron</span>
          </a>
        </div>

        {/* Profile Card */}
        <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="mb-6">
            <h1 className="mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground text-sm">
              Set up your Cypheron profile to get started
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="border-2"
                  rows={4}
                />
              </Field>

              <Field>
                <FieldLabel>Account Type</FieldLabel>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(role) => setFormData({ ...formData, role })}
                  className="gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BUYER" id="buyer" />
                    <FieldLabel htmlFor="buyer" className="cursor-pointer">
                      Buyer - Browse and purchase datasets
                    </FieldLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SELLER" id="seller" />
                    <FieldLabel htmlFor="seller" className="cursor-pointer">
                      Seller - Upload and sell datasets
                    </FieldLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BOTH" id="both" />
                    <FieldLabel htmlFor="both" className="cursor-pointer">
                      Both - Buy and sell datasets
                    </FieldLabel>
                  </div>
                </RadioGroup>
              </Field>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Updating...
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </FieldGroup>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/dashboard" className="text-sm hover:underline underline-offset-4">
            Skip for now →
          </a>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 border-4 ${toast.variant === 'destructive' ? 'border-destructive' : 'border-border'} bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 max-w-sm`}>
          <h3 className="mb-1">{toast.title}</h3>
          <p className="text-sm text-muted-foreground">{toast.description}</p>
          <button
            onClick={() => setToast(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
