import { Omnibar } from '@/components/vault/Omnibar';
import { Package } from 'lucide-react';
import Link from 'next/link';

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Package className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Component Vault</span>
                </Link>

                <div className="flex-1 max-w-md flex justify-center">
                    <Omnibar />
                </div>

                <div className="flex items-center gap-4">
                    <button className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-medium">
                        U
                    </button>
                </div>
            </div>
        </header>
    );
}
