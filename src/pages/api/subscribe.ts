import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { getSession } from 'next-auth/client';
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // esse método 'backend' só aceita POST
  if (req.method === 'POST') {
    // preciso criar um customer dentro do stripe

    // cookies para pegar o usuário logado
    const session = await getSession({ req }); // dentro da req tem os cookies

    // buscando o usuário no fauna / validar existencia
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email),
        )
      )
    );

    let customerId = user.data.stripe_customer_id;
    
    // se o usuário ainda não tem o campo customer_id
    // daí criar o stripeCustomer
    if (!customerId) {
      // customer a ser criado no stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata: 
      });

      // atualizar o user | aqui tá o erro
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        ) // não consigo atualizar pelo indice, tem q ser pelo campo
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1IagBhKMEMKyzCEgCtXsf6VL', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}