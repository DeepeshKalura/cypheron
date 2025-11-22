import { Lock } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import Link from "next/link"

export default function LoginPage() {
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
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <div className="bg-primary text-primary-foreground border-2 border-border flex size-10 items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Lock className="size-5" />
            </div>
            Cypheron
          </Link>
        </div>

        {/* Login Form Card */}
        <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <LoginForm />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm hover:underline underline-offset-4">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
