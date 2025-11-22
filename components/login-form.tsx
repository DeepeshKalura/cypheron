"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ConnectButton } from "@mysten/dapp-kit"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    console.log("Google Sign In clicked")
    setIsLoading(true)
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/onboarding/profile",
      })

      console.log("SignIn result:", result)

      if (result?.error) {
        console.error("SignIn error:", result.error)
        toast({
          title: "Sign In Failed",
          description: result.error,
          variant: "destructive",
        })
      } else if (result?.ok) {
        console.log("SignIn successful, redirecting...")
        router.push("/onboarding/profile")
      }
    } catch (error) {
      console.error("Unexpected error during sign in:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email/Password login attempted (not implemented yet)")
    toast({
      title: "Not Implemented",
      description: "Please use Google or Wallet login for now.",
    })
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Sign in to Cypheron</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Connect your wallet or use Google to get started
          </p>
        </div>

        {/* Wallet Connection */}
        <Field>
          <div className="flex justify-center w-full">
            <ConnectButton className="w-full !bg-primary/10 !border-primary/20 hover:!bg-primary/20 !text-primary-foreground" />
          </div>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </Field>

        <FieldSeparator>Or with email</FieldSeparator>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit" className="w-full">Login</Button>
        </Field>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </FieldGroup>
    </form>
  )
}
