'use client'

import { useActionState, useEffect } from 'react'
import { updatePassword } from '@/actions/settings'
import { Loader2, Key } from 'lucide-react'
import { toast } from 'sonner'

type ActionState = {
    error?: string;
    success?: string;
}

const initialState: ActionState = {}

export function ProfileSettingsForm({ user }: { user: any }) {
    const [state, action, isPending] = useActionState(updatePassword, initialState)

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success(state.success)
            const form = document.getElementById('password-form') as HTMLFormElement
            if (form) form.reset()
        }
    }, [state])

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium">Profil utilisateur</h3>
                <p className="text-sm text-muted-foreground">
                    Gérez les informations liées à votre compte.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Adresse Email</label>
                    <div className="flex w-full max-w-md items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground opacity-70">
                        {user?.email}
                    </div>
                    <p className="text-[11px] text-muted-foreground">L'email ne peut actuellement pas être modifié depuis l'interface.</p>
                </div>
            </div>

            <div className="bg-border h-px w-full" />

            <div>
                <h3 className="text-lg font-medium">Sécurité</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Mettez à jour votre mot de passe de connexion.
                </p>

                <form id="password-form" action={action} className="space-y-4 max-w-md">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="currentPassword">Mot de passe actuel</label>
                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2 mt-6">
                        <label className="text-sm font-medium" htmlFor="newPassword">Nouveau mot de passe</label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            required
                            minLength={6}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
                        Mettre à jour le mot de passe
                    </button>
                </form>
            </div>
        </div>
    )
}
