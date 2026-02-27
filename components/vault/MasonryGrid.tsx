import { ComponentWithTags } from '@/types';
import { ComponentCard } from './ComponentCard';

interface MasonryGridProps {
    components: ComponentWithTags[];
}

export function MasonryGrid({ components }: MasonryGridProps) {
    if (components.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <span className="text-2xl text-muted-foreground">✨</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight">No components found</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    You haven't added any components yet, or no components match your search. Start by uploading a new component.
                </p>
            </div>
        );
    }

    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 w-full max-w-[1600px] mx-auto">
            {components.map((component) => (
                <ComponentCard key={component.id} component={component} />
            ))}
        </div>
    );
}
