import { Metadata } from 'next';
import { Suspense } from 'react';
import Table from '@/app/ui/blogs/table';
import { BlogsTableSkeleton } from '@/app/ui/skeletons';
import { fetchBlogsPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { CreateBlog } from '@/app/ui/blogs/buttons';


export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  const totalPages = await fetchBlogsPages(query);
  return (
    <div className="w-full">
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
          Blogs
        </h1>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search blogs..." />
          <CreateBlog />
        </div>
        <Suspense key={query + currentPage} fallback={<BlogsTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}