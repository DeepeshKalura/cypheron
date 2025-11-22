"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { ConnectButton } from "@mysten/dapp-kit"

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/onboarding/profile",
      })

      if (result?.error) {
        toast({
          title: "Sign In Failed",
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
          <CardTitle className="text-2xl">Sign In to CryptoVault</CardTitle>
          <CardDescription>Connect with your wallet or use Google to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-slate-100"
          >
            {isLoading ? "Signing in..." : "Sign In with Google"}
          </Button>

          <Separator className="bg-slate-700" />

          <div className="space-y-2">
            <p className="text-sm text-slate-400">Or use your wallet</p>
            <div className="flex justify-center">
              <ConnectButton className="w-full !bg-transparent !border-slate-700 hover:!bg-slate-800 !text-white" />
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-400 hover:underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
