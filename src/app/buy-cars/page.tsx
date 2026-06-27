import BuyCarsClient from './BuyCarsClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface PageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function BuyCarsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const categoryParam = category || null;

  return <BuyCarsClient categoryParam={categoryParam} />;
}
