'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const FormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Please enter a post title.'),
  content: z.string().min(1, 'Post content is required.'),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  published: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type State = {
  errors?: {
    title?: string[];
    content?: string[];
    excerpt?: string[];
    author?: string[];
    published?: string[];
  };
   message?: string | null | undefined;
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const CreatePost = FormSchema.omit({ id: true, created_at: true, updated_at: true });
const UpdatePost = FormSchema.omit({ id: true, created_at: true, updated_at: true });

export async function createPost(prevState: State, formData: FormData) {
  const raw = {
    title: String(formData.get('title') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    excerpt: (() => {
      const v = formData.get('excerpt');
      if (v == null) return undefined;
      const s = String(v).trim();
      return s === '' ? undefined : s;
    })(),
    author: (() => {
      const v = formData.get('author');
      if (v == null) return undefined;
      const s = String(v).trim();
      return s === '' ? undefined : s;
    })(),
    published: !!formData.get('published'),
  };

  const validated = CreatePost.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create post.',
    };
  }

  const { title, content, excerpt, author, published } = validated.data;

  try {
    await sql`
      INSERT INTO posts (title, content, excerpt, author, published)
      VALUES (${title}, ${content}, ${excerpt ?? null}, ${author ?? null}, ${published})
    `;
  } catch (err) {
    console.error('Database Error:', err);
    return { message: 'Failed to create post due to server error.' };
  }

  revalidatePath('/dashboard/blogs');
  redirect('/dashboard/blogs');
}

export async function updatePost(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const raw = {
    title: String(formData.get('title') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    excerpt: (() => {
      const v = formData.get('excerpt');
      if (v == null) return undefined;
      const s = String(v).trim();
      return s === '' ? undefined : s;
    })(),
    author: (() => {
      const v = formData.get('author');
      if (v == null) return undefined;
      const s = String(v).trim();
      return s === '' ? undefined : s;
    })(),
    published: !!formData.get('published'),
  };

  const validated = UpdatePost.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to update post.',
    };
  }

  const { title, content, excerpt, author, published } = validated.data;

  try {
    await sql`
      UPDATE posts
      SET
        title        = ${title},
        content      = ${content},
        excerpt      = ${excerpt ?? null},
        author       = ${author ?? null},
        published    = ${published},
        updated_at   = NOW()
      WHERE id = ${id}
    `;
  } catch (err) {
    console.error('Database Error:', err);
    return { message: 'Failed to update post due to server error.' };
  }

  revalidatePath('/dashboard/blogs');
  redirect('/dashboard/blogs');
}

export async function deletePost(id: string) {
  try {
    await sql`DELETE FROM posts WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  }
  revalidatePath('/dashboard/blog');
}