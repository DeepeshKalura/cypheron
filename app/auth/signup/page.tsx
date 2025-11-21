"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export default function SignUp() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/onboarding/profile",
      })

      if (result?.error) {
        toast({
          title: "Sign Up Failed",
          description: result.error,
          variant: "destructive",
        })
      } else if (result?.ok) {
        router.push("/onboarding/profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Create CryptoVault Account</CardTitle>
          <CardDescription>Join the decentralized data marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-slate-100"
          >
            {isLoading ? "Creating account..." : "Sign Up with Google"}
          </Button>

          <Separator className="bg-slate-700" />

          <div className="space-y-2">
            <p className="text-sm text-slate-400">Or connect your wallet</p>
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-full border-slate-700 hover:bg-slate-800 bg-transparent"
            >
              Connect Sui Wallet
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-blue-400 hover:underline">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
