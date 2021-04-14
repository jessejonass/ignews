import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>14 de abril de 2021</time>
            <strong>Título de teste</strong>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis nisi tempora assumenda totam quisquam?
            </p>
          </a>

          <a href="#">
            <time>14 de abril de 2021</time>
            <strong>Título de teste</strong>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis nisi tempora assumenda totam quisquam?
            </p>
          </a>

          <a href="#">
            <time>14 de abril de 2021</time>
            <strong>Título de teste</strong>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis nisi tempora assumenda totam quisquam?
            </p>
          </a>
        </div>
      </main>
    </>
  );
};

// página estática - não terei post a todo momento
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  // prismic docs > query the API
  const response = await prismic.query([
    // tipo Publication
    Prismic.predicates.at('document.type', 'publication')
  ], {
    // quais dados eu quero dessa pub
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100,
  });

  // console.log(JSON.stringify(response, null, 2));

  return {
    props: {}
  }
}
