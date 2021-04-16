import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss';

interface PostPreviewPros {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
};

export default function PostPreview({ post }: PostPreviewPros) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <div className={styles.continueReading}>
            Wanna continue reading?

            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

// só existe em páginas com parâmetros []
export const getStaticPaths: GetStaticPaths = async() => {
  return {
    // paths: [
    //   { params: { slug: 'como-renomear-varios-arquivos-de-uma-vez-usando-o-terminal' } }
    // ], // páginas estáticas no momento da build

    paths: [], // todos os posts carregados no primeiro acesso
    fallback: 'blocking',
    // true | false | blocking
    // true: post estatico não gerado ainda é carregado no browser
    // false: post estatico não foi gerado ainda, gera um 404
    // blocking: post estatico não foi gerado ainda, é aguardado o SSR
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic  = getPrismicClient();

  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.contents.splice(0, 3)), // 3 primeiros itens
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutos
  }
}