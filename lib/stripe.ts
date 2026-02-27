import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    const key = process.env.STRIPE_API_SECRET_KEY;

    if (!key) {
      // Não quebra o build nem o app (Stripe é opcional por enquanto)
      throw new Error("❌ Stripe não configurado. Adicione STRIPE_API_SECRET_KEY no .env para ativar corações premium.");
    }

    stripeInstance = new Stripe(key);  }

  return stripeInstance;
};