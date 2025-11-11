import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogList from '@/app/ui/blogs/blog-list';
import { BlogsTableSkeleton } from '@/app/ui/skeletons';
import { lusitana } from '@/app/ui/fonts';


export const metadata: Metadata = {
  title: 'Blogs',
};

export default async function Page() {
  return (
    <div className="w-full flex-grow flex justify-center py-8 px-4 md:px-8 lg:px-16">
      <div className="container">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
          Blogs
        </h1>
        <Suspense fallback={<BlogsTableSkeleton />}>
          <BlogList/>
        </Suspense>
      </div>
    </div>
  );
}