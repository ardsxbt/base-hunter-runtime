import { Request, Response, NextFunction } from 'express';

/**
 * Minimal x402-style payment gate scaffold.
 *
 * NOTE: This enforces a paid-header contract for hackathon demos.
 * Replace header checks with full x402 verification integration when wiring
 * a production payment verifier.
 */
export function requireX402(priceUsd: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const paymentHeader = req.header('x-402-payment');

    if (!paymentHeader) {
      return res.status(402).json({
        error: 'Payment Required',
        hint: 'Provide x-402-payment header',
        priceUsd,
        accepts: 'x402',
      });
    }

    return next();
  };
}
