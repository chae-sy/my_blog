import { GetStaticPaths, GetStaticProps } from "next";
import Detail from "src/routes/Detail";
import { filterPosts } from "src/libs/utils/notion";
import { CONFIG } from "site.config";
import { NextPageWithLayout } from "../types";
import CustomError from "src/routes/Error";
import { getRecordMap, getPosts } from "src/apis";
import MetaConfig from "src/components/MetaConfig";
import { queryClient } from "src/libs/react-query";
import { queryKey } from "src/constants/queryKey";
import { dehydrate } from "@tanstack/react-query";
import usePostQuery from "src/hooks/usePostQuery";
import { FilterPostsOptions } from "src/libs/utils/notion/filterPosts";

/**
 * Filter definition used for both getStaticPaths and getStaticProps.
 * Only posts that are public and have one of the specified types are considered
 * valid detail pages.
 */
const filter: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
};

/**
 * Build‑time generation of every valid slug.
 * We guard against network/fs failures so that the whole build doesn’t crash.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = (await getPosts()) ?? [];

    const filtered = filterPosts(posts, filter) ?? [];

    return {
      paths: filtered.map((row) => `/${row.slug}`),
      // "blocking" prevents a splash of fallback UI and still lets us ISR new pages
      fallback: "blocking",
    };
  } catch (err) {
    console.error("[build] getStaticPaths error:", err);
    // Returning an empty list still allows the site to deploy; pages will be generated on demand.
    return { paths: [], fallback: "blocking" };
  }
};

/**
 * Provide data for an individual post page.
 * Includes dehydrated React Query state so the client can re‑use the fetched data.
 */
export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const slug = context.params?.slug as string | undefined;

    if (!slug) {
      return { notFound: true };
    }

    const posts = (await getPosts()) ?? [];

    // Feed (list‑view) posts – caching them here avoids an extra request client‑side
    const feedPosts = filterPosts(posts) ?? [];
    await queryClient.prefetchQuery(queryKey.posts(), () => feedPosts);

    // Detail page candidates filtered by visibility/type
    const detailPosts = filterPosts(posts, filter) ?? [];
    const postDetail = detailPosts.find((t) => t.slug === slug);

    if (!postDetail) {
      return { notFound: true };
    }

    const recordMap = await getRecordMap(postDetail.id);

    await queryClient.prefetchQuery(queryKey.post(slug), () => ({
      ...postDetail,
      recordMap,
    }));

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: CONFIG.revalidateTime,
    };
  } catch (err) {
    console.error("[build] getStaticProps error:", err);
    return { notFound: true };
  }
};

/**
 * Detail page component
 */
const DetailPage: NextPageWithLayout = () => {
  const post = usePostQuery();

  // While ISR generates the page (fallback="blocking"), post will be undefined on first render.
  if (!post) return <CustomError />;

  const image =
    post.thumbnail ??
    CONFIG.ogImageGenerateURL ??
    `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(post.title)}.png`;

  const date = post.date?.start_date || post.createdTime || "";

  const meta = {
    title: post.title,
    date: new Date(date).toISOString(),
    image,
    description: post.summary || "",
    type: post.type[0],
    url: `${CONFIG.link}/${post.slug}`,
  };

  return (
    <>
      <MetaConfig {...meta} />
      <Detail />
    </>
  );
};

DetailPage.getLayout = (page) => page;

export default DetailPage;
