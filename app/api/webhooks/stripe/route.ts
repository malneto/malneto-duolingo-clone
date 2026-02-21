import Stripe from 'stripe';

export async function POST(req: Request) {
  // Stripe ainda não está ativado (você não usa hearts premium ainda)
  // Quando quiser ativar, é só preencher STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET no .env

  if (!process.env.STRIPE_SECRET_KEY) {
    console.log('⚠️ Stripe não configurado - webhook ignorado');
    return new Response(null, { status: 200 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });

  return new Response(null, { status: 200 });
}