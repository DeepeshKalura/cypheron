"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Lock } from "lucide-react"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Button } from "@/components/ui/button"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Authentication failed"

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
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

      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground border-2 border-border flex size-10 items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Lock className="size-5" />
            </div>
            <span>Cypheron</span>
          </a>
        </div>

        {/* Error Card */}
        <div className="border-4 border-destructive bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-6 text-destructive" />
              <h1>Authentication Error</h1>
            </div>

            <p className="text-sm text-muted-foreground">
              Something went wrong during authentication
            </p>

            <div className="border-2 border-border bg-muted p-4">
              <p className="text-sm">{error}</p>
            </div>

            <Button asChild className="w-full">
              <a href="/auth/signin">Back to Sign In</a>
            </Button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm hover:underline underline-offset-4">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
