import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Head from 'next/head';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <a href="#" key={post.slug}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          )) }
        </div>
      </main>
    </>
  );
};

// página estática - não terei post a todo momento
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  // prismic docs > query the API: doc de queries
  const response = await prismic.query([
    // tipo Publication: predicate é uma query
    Prismic.predicates.at('document.type', 'publication')
  ], {
    // quais dados eu quero dessa pub?
    fetch: ['publication.title', 'publication.contents'],
    pageSize: 100,
  });

  // prismic-dom - converte formatos do prismic para html
  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title), // converte texto Prismic para html,
      
      excerpt: post.data.contents.find(content => (
        content.type == 'paragraph'
      ))?.text ?? '', // buscar primeiro paragrafo || ''

      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return {
    props: { posts }
  }
}
