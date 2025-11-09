import Form from '@/app/ui/blogs/edit-form';
import Breadcrumbs from '@/app/ui/blogs/breadcrumbs';
import { fetchBlogById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
    const [post] = await Promise.all([
    fetchBlogById(id)
  ]);
    if (!post) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/blogs' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/blogs/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form post={post} />
    </main>
  );
}