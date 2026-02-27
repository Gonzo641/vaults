'use client'

import { useActionState, useEffect, useState } from 'react'
import { signIn } from '@/actions/auth'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const initialState = {
    error: null as string | null,
}

// Regex pour vérifier: min 10 chars, 1 majuscule, 1 caractère spécial
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/

export function LoginForm() {
    const [signInState, signInAction, isSignInPending] = useActionState(signIn, initialState)
    const router = useRouter()
    const [isCreatingAccount, setIsCreatingAccount] = useState(false)
    const [password, setPassword] = useState('')

    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push('/dashboard')
            }
        }
        checkSession()
    }, [router])

    const handleSignUp = async (formData: FormData) => {
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!email || !password || !confirmPassword) {
            toast.error('Veuillez remplir tous les champs')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas')
            return
        }

        if (!passwordRegex.test(password)) {
            toast.error('Le mot de passe doit contenir au moins 10 caractères, une majuscule et un caractère spécial')
            return
        }

        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/login`,
            }
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Compte créé !', {
                description: 'Veuillez vérifier votre boîte mail pour confirmer votre compte.',
                duration: 8000
            })
            const form = document.getElementById('login-form') as HTMLFormElement
            if (form) form.reset()
            setIsCreatingAccount(false)
            setPassword('')
        }
    }

    // Calculate validity
    const isLengthValid = password.length >= 10
    const isUppercaseValid = /[A-Z]/.test(password)
    const isSpecialValid = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

    return (
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="text-center mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary mx-auto mb-4 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">CV</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Component Vault</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {isCreatingAccount ? "Create your new vault" : "Sign in to your vault"}
                </p>
            </div>

            {signInState?.error && !isCreatingAccount && (
                <div className="mb-4 p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                    {signInState?.error}
                </div>
            )}

            <form id="login-form" className="space-y-4 flex flex-col">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {isCreatingAccount && (
                    <>
                        <div className="text-[11px] space-y-1 text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/50">
                            <p className={cn("flex items-center gap-1", isLengthValid ? "text-primary font-medium" : "")}>
                                • Minimum 10 caractères
                            </p>
                            <p className={cn("flex items-center gap-1", isUppercaseValid ? "text-primary font-medium" : "")}>
                                • Une lettre majuscule
                            </p>
                            <p className={cn("flex items-center gap-1", isSpecialValid ? "text-primary font-medium" : "")}>
                                • Un caractère spécial
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required={isCreatingAccount}
                                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </>
                )}

                <div className="flex flex-col gap-2 pt-2">
                    {!isCreatingAccount ? (
                        <>
                            <button
                                formAction={signInAction}
                                disabled={isSignInPending}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {isSignInPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreatingAccount(true)}
                                disabled={isSignInPending}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-transparent border border-border text-foreground hover:bg-muted h-10 px-4 py-2 transition-colors disabled:opacity-50"
                            >
                                Create Account
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    const form = document.getElementById('login-form') as HTMLFormElement
                                    handleSignUp(new FormData(form))
                                }}
                                disabled={isSignInPending}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                Confirm Account Creation
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreatingAccount(false)
                                    setPassword('')
                                }}
                                disabled={isSignInPending}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-transparent border border-border text-foreground hover:bg-muted h-10 px-4 py-2 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    )
}
