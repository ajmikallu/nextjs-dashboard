import { fetchBlogById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchBlogById(id);

  return {
    title: post?.title ?? 'Blog Post',
    description: post?.excerpt ?? 'Blog post details',
  };
}

export default async function BlogPost(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const post = await fetchBlogById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <p>By {post.author || 'Anonymous'}</p>
          <span>•</span>
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      {/* Excerpt if available */}
      {post.excerpt && (
        <div className="mb-8">
          <p className="text-xl text-gray-600 italic">{post.excerpt}</p>
        </div>
      )}

      {/* Main content */}
      <div className="prose prose-lg max-w-none">
        {/* Split content into paragraphs */}
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Metadata footer */}
      <footer className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-sm ${post.published
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
              }`}>
              {post.published ? 'Published' : 'Draft'}
            </span>
          </div>
          <time dateTime={post.updated_at}>
            Last updated: {new Date(post.updated_at).toLocaleDateString()}
          </time>
        </div>
      </footer>
    </article>
  );
}