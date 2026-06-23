import { Request, Response } from 'express';
import Ambulance from '../../models/emergency/Ambulance';

// GET /api/ambulances?city=Kolkata&available=true
export async function getAmbulances(req: Request, res: Response) {
  try {
    const query: Record<string, any> = { active: true };
    if (req.query.city) query.city = req.query.city;
    if (req.query.available != null) query.available = req.query.available === 'true';

    const collation = { locale: 'en', strength: 2 }; // case-insensitive city match
    const ambulances = await Ambulance.find(query).collation(collation).lean();
    return res.json({ success: true, total: ambulances.length, data: ambulances });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

// GET /api/ambulances/:slug
export async function getAmbulanceBySlug(req: Request, res: Response) {
  try {
    const ambulance = await Ambulance.findOne({ slug: req.params.slug }).lean();
    if (!ambulance) {
      return res.status(404).json({ success: false, message: 'Ambulance not found' });
    }
    return res.json({ success: true, data: ambulance });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}
