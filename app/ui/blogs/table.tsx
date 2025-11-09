import Image from 'next/image';
import { DeleteBlog, UpdateBlog } from '@/app/ui/blogs/buttons';
import { fetchFilteredBlogs } from '@/app/lib/data';



export default async function BlogTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const posts = await fetchFilteredBlogs(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            {/* Mobile view */}
            <div className="md:hidden">
              {posts?.map((post) => (
                <div
                  key={post.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
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
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${post.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <UpdateBlog id={post.id} />
                    <DeleteBlog id={post.id} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view */}
            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Title
                  </th>
                  <th scope="col" className="md:hidden px-3 py-5 font-medium">
                    Excerpt
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Author
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Date
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-900">
                {posts?.map((post) => (
                  <tr key={post.id} className="group">
                    <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                      <div className="flex items-center gap-3">
                        <p>{post.title}</p>
                      </div>
                    </td>
                    <td className="md:hidden whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {post.excerpt || post.content.substring(0, 100) + '...'}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {post.author || 'Anonymous'}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${post.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateBlog id={post.id} />
                        <DeleteBlog id={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
