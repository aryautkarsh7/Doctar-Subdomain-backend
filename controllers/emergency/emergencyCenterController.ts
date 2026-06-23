import { Request, Response } from 'express';
import EmergencyCenter from '../../models/emergency/EmergencyCenter';

// GET /api/emergency-centers?city=Kolkata
export async function getEmergencyCenters(req: Request, res: Response) {
  try {
    const query: Record<string, any> = { active: true };
    if (req.query.city) query.city = req.query.city;

    const collation = { locale: 'en', strength: 2 };
    const centers = await EmergencyCenter.find(query).collation(collation).lean();
    return res.json({ success: true, total: centers.length, data: centers });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

// GET /api/emergency-centers/:slug
export async function getEmergencyCenterBySlug(req: Request, res: Response) {
  try {
    const center = await EmergencyCenter.findOne({ slug: req.params.slug }).lean();
    if (!center) {
      return res.status(404).json({ success: false, message: 'Emergency centre not found' });
    }
    return res.json({ success: true, data: center });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}
