'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Post } from '@/app/lib/definitions';
import { updatePost, State } from '@/app/lib/blog-actions';
import { Button } from '@/app/ui/button';

export default function EditBlogForm({ post }: { post: Post }) {
  const initialState: State = { message: '', errors: {} };
  const updatePostWithId = updatePost.bind(null, post.id);
  const [state, formAction] = useActionState(updatePostWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={post.title}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder="Enter blog title"
            aria-describedby="title-error"
          />
          {state.errors?.title ? (
            <div id="title-error" className="mt-2 text-sm text-red-500">
              {state.errors.title[0]}
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="mb-2 block text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            defaultValue={post.content}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder="Write your blog content here..."
            aria-describedby="content-error"
          />
          {state.errors?.content ? (
            <div id="content-error" className="mt-2 text-sm text-red-500">
              {state.errors.content[0]}
            </div>
          ) : null}
        </div>

        {/* Excerpt */}
        <div className="mb-4">
          <label htmlFor="excerpt" className="mb-2 block text-sm font-medium">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt || ''}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder="Brief summary of your blog post"
          />
        </div>

        {/* Author */}
        <div className="mb-4">
          <label htmlFor="author" className="mb-2 block text-sm font-medium">
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            defaultValue={post.author || ''}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder="Author name"
          />
        </div>

        {/* Published Status */}
        <div className="mb-4">
          <label htmlFor="published" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <div className="flex items-center">
            <input
              id="published"
              name="published"
              type="checkbox"
              defaultChecked={post.published}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="published" className="ml-2 text-sm">
              Published
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <div className="mt-4">
        {state.message ? (
          <div className="text-sm text-red-500">{state.message}</div>
        ) : null}
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/blogs"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Blog</Button>
      </div>
    </form>
  );
}