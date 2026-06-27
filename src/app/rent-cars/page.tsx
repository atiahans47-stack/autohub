import RentCarsClient from './RentCarsClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface PageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function RentCarsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams?.category || null;

  return <RentCarsClient categoryParam={categoryParam} />;
}