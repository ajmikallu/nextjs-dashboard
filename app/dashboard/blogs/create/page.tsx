import Form from '@/app/ui/blogs/create-form';
import Breadcrumbs from '@/app/ui/blogs/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Blog',
  description: 'Create a new blog post',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Blogs', href: '/dashboard/blogs' },
          {
            label: 'Create Blog',
            href: '/dashboard/blogs/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}