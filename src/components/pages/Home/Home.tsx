import { FC } from "react";
import SubscribeButton from "../../SubscribeButton";
import styles from "./styles.module.scss";
import Head from "next/head";

import { HomeProps } from "./types";

const Home: FC<HomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>

          <h1>
            News about the <span>React</span> world
          </h1>

          <p>
            Get access to all the publications <br />
            <strong>for {product.amount} month</strong> <br />

            <span className={styles.note}>
              You can register on the website with any fictitious card.
              Values ​​will not be charged 😀
            </span>
          </p>

          

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
};

export default Home;
