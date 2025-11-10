import { fetchPosts } from '@/app/lib/data';
import Link from 'next/link';

export default async function BlogList() {
  const posts = await fetchPosts();

  return (
    <div className="mt-6">
      <div >
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-md md:pt-0">
            {/* layout as grid: 1 col (mobile), 2 cols (sm), 3 cols (md+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts?.map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${post.id}`}
                  className="block rounded-md bg-white p-4 h-full transition-colors hover:bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2">
                        <h3 className="font-medium">{post.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        {post.excerpt || post.content.substring(0, 100) + '...'}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between border-b py-5">
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Author</p>
                      <p className="font-medium">{post.author || 'Anonymous'}</p>
                    </div>
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Status</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          post.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
