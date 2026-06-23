import { Request, Response, NextFunction } from 'express';

// Shared admin password, reusable across every subdomain backend.
// Matches the password currently hardcoded client-side in public/admin.html
// (ADMIN_PASSWORD='doctar2024'); kept here as a single source of truth for
// any future server-side admin route guard, without changing existing
// behavior (no route currently calls requireAdmin).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'doctar2024';

export function checkAdminPassword(candidate: string | undefined): boolean {
  return Boolean(candidate) && candidate === ADMIN_PASSWORD;
}

// Express middleware: expects the password via 'x-admin-key' header,
// '?adminKey=' query param, or { adminKey } in the body.
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const candidate =
    (req.headers['x-admin-key'] as string) ||
    (req.query.adminKey as string) ||
    (req.body && req.body.adminKey);

  if (!checkAdminPassword(candidate)) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  next();
}
