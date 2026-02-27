export type Component = {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    code_snippet: string;
    preview_image_1_url: string | null;
    preview_image_2_url: string | null;
    created_at: string;
};

export type Tag = {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
};

export type ComponentWithTags = Component & {
    tags: Tag[];
};
