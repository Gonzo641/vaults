export type CodeFile = {
    language: string;
    code: string;
};

export type Component = {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    code_files: CodeFile[];
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

export type Pad = {
    id: string;
    user_id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
};

export type Todo = {
    id: string;
    user_id: string;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    created_at: string;
    updated_at: string;
};

export type Snippet = {
    id: string;
    user_id: string;
    title: string;
    code: string;
    language: string;
    created_at: string;
    updated_at: string;
};

export type Bookmark = {
    id: string;
    user_id: string;
    title: string;
    url: string;
    description: string | null;
    favicon_url: string | null;
    created_at: string;
    updated_at: string;
};
