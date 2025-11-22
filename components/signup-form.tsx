"use client"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
    Field,
    FieldGroup,
    FieldSeparator,
} from "./ui/field"
import { useState } from "react"

interface SignupFormProps extends React.ComponentProps<"div"> {
    onGoogleSignUp?: () => Promise<void>;
    WalletButton?: React.ReactNode;
}

export function SignupForm({
    className,
    onGoogleSignUp,
    WalletButton,
    ...props
}: SignupFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleSignUp = async () => {
        if (!onGoogleSignUp) {
            console.log("Google Sign Up not configured")
            return
        }
        setIsLoading(true)
        try {
            await onGoogleSignUp()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1>Create Account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Join the decentralized data marketplace
                    </p>
                </div>

                {/* Wallet Connection */}
                {WalletButton && (
                    <Field>
                        {WalletButton}
                    </Field>
                )}

                <FieldSeparator>Or continue with</FieldSeparator>

                <Field>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full border-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        {isLoading ? "Creating account..." : "Sign up with Google"}
                    </Button>
                </Field>

                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/auth/signin" className="underline underline-offset-4">
                        Sign in
                    </a>
                </div>
            </FieldGroup>
        </div>
    )
}
