'use client'

import { useActionState, useEffect } from 'react'
import { updatePassword, updateEditorTheme } from '@/actions/settings'
import { Loader2, Key, Palette, Lock } from 'lucide-react'
import { toast } from 'sonner'

type ActionState = {
    error?: string;
    success?: string;
}

const initialState: ActionState = {}

export function PreferencesForm({ profile }: { profile?: any }) {
    const [pwdState, pwdAction, isPwdPending] = useActionState(updatePassword, initialState)
    const [themeState, themeAction, isThemePending] = useActionState(updateEditorTheme, initialState)

    const isPremium = profile?.plan_id === 'commander' || profile?.plan_id === 'lifetime_friend' || profile?.role === 'admin'
    const currentTheme = profile?.editor_theme || 'github-dark'

    useEffect(() => {
        if (pwdState?.error) {
            toast.error(pwdState.error)
        }
        if (pwdState?.success) {
            toast.success(pwdState.success)
            const form = document.getElementById('password-form') as HTMLFormElement
            if (form) form.reset()
        }
    }, [pwdState])

    useEffect(() => {
        if (themeState?.error) {
            toast.error(themeState.error)
        }
        if (themeState?.success) {
            toast.success(themeState.success)
        }
    }, [themeState])

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium">Application Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your visual preferences and security.
                </p>
            </div>

            {/* Custom Editor Themes Section */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Palette className="w-5 h-5 text-indigo-400" />
                        Editor Theme
                    </h3>
                    {!isPremium && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Lock className="w-3 h-3" /> Commander Only
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Customize the syntax highlighting colors of your components (Premium).
                </p>

                <form action={themeAction} className="space-y-4 max-w-md relative">
                    {!isPremium && (
                        <div className="absolute inset-0 z-10 cursor-not-allowed group" title="Upgrade your plan to unlock">
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-md transition-opacity group-hover:opacity-60" />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="theme">Select a Shiki theme</label>
                        <select
                            key={currentTheme}
                            id="theme"
                            name="theme"
                            defaultValue={currentTheme}
                            disabled={!isPremium}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="github-dark">GitHub Dark (Default)</option>
                            <option value="tokyo-night">Tokyo Night</option>
                            <option value="dracula">Dracula</option>
                            <option value="nord">Nord</option>
                            <option value="monokai">Monokai</option>
                            <option value="vitesse-dark">Vitesse Dark</option>
                            <option value="poimandres">Poimandres</option>
                            <option value="catppuccin-mocha">Catppuccin Mocha</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={!isPremium || isThemePending}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground h-10 px-4 py-2 hover:bg-secondary/80 transition-colors disabled:opacity-50"
                    >
                        {isThemePending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Theme
                    </button>
                </form>
            </div>

            <div className="bg-border h-px w-full" />

            <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Update your login password.
                </p>

                <form id="password-form" action={pwdAction} className="space-y-4 max-w-md">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="currentPassword">Current Password</label>
                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2 mt-6">
                        <label className="text-sm font-medium" htmlFor="newPassword">New Password</label>
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
                        <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm New Password</label>
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
                        disabled={isPwdPending}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isPwdPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}
