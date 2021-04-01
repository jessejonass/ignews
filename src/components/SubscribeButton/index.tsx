import { useSession, signIn } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {

  // existe sessão?
  const [session] = useSession();
  
  async function handleSubscribe() {
    // se não existe, mandar para o auth do github
    if (!session) {
      signIn('github');
      return;
    }

    // criação e uso da checkout session
    // https://stripe.com/docs/api/checkout/sessions

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      // o stripe público
      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId: sessionId });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <button 
      type="button" 
      onClick={handleSubscribe}
      className={styles.subscribeButton}
    >
      Subscribe now
    </button>
  );
};
