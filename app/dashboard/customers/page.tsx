import { Metadata } from 'next';
import Table from '@/app/ui/customers/table';
import { lusitana } from '@/app/ui/fonts';
import { fetchFilteredCustomers, fetchCustomersPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';

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
  const totalPages = await fetchCustomersPages(query);
  console.log('totalPages', totalPages);

  const customers = await fetchFilteredCustomers(query, currentPage);
  // console.log('customers', customers);
  return (
    <div className="w-full">
      <Table customers={customers} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}