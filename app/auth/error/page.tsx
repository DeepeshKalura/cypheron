"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Authentication failed"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Card className="w-full max-w-md border-red-700 bg-slate-900">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
          </div>
          <CardDescription>Something went wrong during authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-300 bg-slate-800 p-3 rounded">{error}</p>
          <Button asChild className="w-full">
            <a href="/auth/signin">Back to Sign In</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
