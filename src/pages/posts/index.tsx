import { FC } from 'react'
import { getPrismicClient } from '../../services/prismic';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import PostsPage from '../../components/pages/Posts/Posts';
import { PostsProps } from '../../components/pages/Posts/types'; 
import { RichText } from 'prismic-dom';

const Posts: FC<PostsProps> = ({ posts }) => {
  return (
    <PostsPage posts={posts} />
  );
};

export default Posts;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'publication')
  ], {
    fetch: ['publication.title', 'publication.content'], // TODO - contents
    pageSize: 100,
  });

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }
  });

  return {
    props: { posts }
  }
}
