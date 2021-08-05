import { FC } from 'react';
import { GetStaticProps } from 'next';
import { stripe } from '../services/stripe';
import { HomeProps } from '../components/pages/Home/types';
import HomePage from '../components/pages/Home';

const Home: FC<HomeProps> = ({ product }) => {
  return <HomePage product={product} />
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JFIMQKMEMKyzCEgtQzbtfsd', {
    expand: ['product'], // nome do produto, descrição, etc...
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100), // vem em centavos
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}