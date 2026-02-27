'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Code2, Library, Palette, FileJson } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Omnibar() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted border border-border rounded-md hover:border-primary/50 transition-colors w-full max-w-sm"
            >
                <Search className="w-4 h-4" />
                <span>Search components...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
                <Command.Input placeholder="Search for buttons, cards, gsap animations..." />
                <Command.List>
                    <Command.Empty>No results found.</Command.Empty>

                    <Command.Group heading="Categories">
                        <Command.Item onSelect={() => { router.push('/dashboard?tag=buttons'); setOpen(false); }}>
                            <Palette className="w-4 h-4" />
                            Buttons
                        </Command.Item>
                        <Command.Item onSelect={() => { router.push('/dashboard?tag=cards'); setOpen(false); }}>
                            <Library className="w-4 h-4" />
                            Cards
                        </Command.Item>
                        <Command.Item onSelect={() => { router.push('/dashboard?tag=gsap'); setOpen(false); }}>
                            <Code2 className="w-4 h-4" />
                            GSAP Animations
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Recent Components">
                        <Command.Item onSelect={() => setOpen(false)}>
                            <FileJson className="w-4 h-4" />
                            <span>Animated Navbar</span>
                        </Command.Item>
                        <Command.Item onSelect={() => setOpen(false)}>
                            <FileJson className="w-4 h-4" />
                            <span>Pricing Table Gradients</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </Command.Dialog>
        </>
    );
}
