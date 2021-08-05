import { FC } from "react";
import { getPrismicClient } from "../../../services/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import { PostProps } from "../../../components/pages/Post/types";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

import PostPreviewPage from "../../../components/pages/PostPreview";

const PostPreview: FC<PostProps> = ({ post }) => {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session, post.slug, router]);

  return <PostPreviewPage post={post} />;
};

export default PostPreview;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response?.data.title),
    content: RichText.asHtml(response?.data.content.splice(0, 3)),
    updatedAt: new Date(response?.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutos
  };
};
