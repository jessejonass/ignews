import { FC } from 'react';
import { getPrismicClient } from '../../services/prismic';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { PostProps } from '../../components/pages/Post/types';
import { RichText } from 'prismic-dom';

import PostPage from '../../components/pages/Post';

const Post: FC<PostProps> = ({ post }) => {
  return <PostPage post={post} />;
};

export default Post;

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;

  if (!session.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response?.data.title),
    content: RichText.asHtml(response?.data.content),
    updatedAt: new Date(response?.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  return {
    props: {
      post,
    },
  };
};
