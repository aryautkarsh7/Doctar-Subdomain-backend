import { Router, Request, Response } from 'express';
import Ambulance from '../../models/emergency/Ambulance';
import EmergencyCenter from '../../models/emergency/EmergencyCenter';
import BloodBank from '../../models/emergency/BloodBank';

const router = Router();

/**
 * @openapi
 * /api/emergency/data/critical:
 *   get:
 *     tags: [Emergency]
 *     summary: Fast aggregate payload for emergency.doctar.in's initial page load
 *     description: Cached 10 minutes. Namespaced under /api/emergency/data (rather than /api/data) because /api/data/critical is already taken by the surgery site's critical payload route.
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string, default: Kolkata }
 *     responses:
 *       200:
 *         description: Per-city emergency payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 city: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     ambulances: { type: array, items: { type: object } }
 *                     emergencyCenters: { type: array, items: { type: object } }
 *                     bloodBanks: { type: array, items: { type: object } }
 */
router.get('/critical', async (req: Request, res: Response) => {
  try {
    const city = ((req.query.city as string) || 'Kolkata').trim();
    const collation = { locale: 'en', strength: 2 }; // case-insensitive

    const [ambulances, emergencyCenters, bloodBanks] = await Promise.all([
      Ambulance.find({ city, active: true }).collation(collation).lean(),
      EmergencyCenter.find({ city, active: true }).collation(collation).lean(),
      BloodBank.find({ city, active: true }).collation(collation).lean(),
    ]);

    res.json({ success: true, city, data: { ambulances, emergencyCenters, bloodBanks } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
