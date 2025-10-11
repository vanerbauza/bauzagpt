import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Bad signature', err.message);
    return res.status(400).send(Webhook Error: );
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object;
    const email = s.customer_details?.email || s.metadata?.email;
    const plan  = s.metadata?.plan || 'pro';
    const query = s.metadata?.query || '';
    const token = crypto.randomBytes(16).toString('hex');

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase.from('purchases').insert({
      email, plan, query, token, status: 'paid'
    });
    if (error) console.error('supabase insert error', error);
  }

  res.json({ received: true });
}
