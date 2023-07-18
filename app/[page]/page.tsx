import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// lib
import { getClient } from 'lib/strapi/client';
import { PageResponse } from 'lib/strapi/domain/page';

//query
import { getPageQuery } from 'lib/strapi/queries/page';

//components
import Prose from 'components/prose';


export const revalidate = 43200; // 12 hours in seconds

export async function generateMetadata({
  params
}: {
  params: { page: string };
}): Promise<Metadata> {
  //const page = await getPage(params.page);

  const title = data.page.data.attributes.title;
  const body = data.page.data.attributes.body;
  const bodySummary = data.page.data.attributes.bodySummary;
  const seo = data.page.data.attributes.SEO;
  const createdAt = data.page.data.attributes.createdAt;
  const updatedAt = data.page.data.attributes.updatedAt;

  if (!data) return notFound();

  return {
    title: seo?.title || title,
    description: seo?.description || bodySummary,
    openGraph: {
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630
        }
      ],
      publishedTime: createdAt,
      modifiedTime: updatedAt,
      type: 'article'
    }
  };
}

export default async function Page({ params }: { params: { page: string } }) {
  const{ data, loading } = await getClient().query<PageResponse>({
    query: getPageQuery,
    variables: {
      handle: params.page
    }
  });
  console.log(data.page.data.attributes)
  
  if (!data) return notFound();
  if (loading) return 'cargando....';
  //const page = await getPage(params.page);
  //const page = data.page?.data?.attributes?.items;

  const title = data.page.data.attributes.title;
  const body = data.page.data.attributes.body;
  const updatedAt = data.page.data.attributes.updatedAt;

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{title}</h1>
      <Prose className="mb-8" html={body as string} />
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(new Date(updatedAt))}.`}
      </p>
    </>
  );
}
