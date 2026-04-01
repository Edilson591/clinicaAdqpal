import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

// =============================================================================
// RATE LIMITERS
// =============================================================================

/**
 * General API rate limiter: 100 requests per 15 minutes per IP.
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => ipKeyGenerator(req.ip ?? "unknown"),
  message: {
    success: false,
    message: "Muitas requisições. Tente novamente em alguns minutos.",
  },
});

/**
 * WhatsApp endpoint rate limiter: 5 sends per 15 minutes per user.
 * Uses authenticated userId as the key to prevent abuse even behind shared IPs.
 */
export const whatsAppRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (userId) return userId;

    return ipKeyGenerator(req.ip ?? "unknown");
  },
  message: {
    success: false,
    message:
      "Limite de envio via WhatsApp atingido. Tente novamente em 15 minutos.",
  },
});
