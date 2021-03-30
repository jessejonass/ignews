import { GetServerSideProps } from 'next';

import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';

import { stripe } from '../services/stripe';

import styles from '../styles/home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home - ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  )
}

// importar tipagem para essa function
export const getServerSideProps: GetServerSideProps = async () => {
  // todo codigo colocado aqui é executado no servidor node do next

  const price = await stripe.prices.retrieve('price_1IagBhKMEMKyzCEgCtXsf6VL', {
    expand: ['product'], // usado para ver info do produto
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD',
    }).format( (price.unit_amount / 100)), // centavos
  };

  return {
    props: {
      product,
    }
  }
}