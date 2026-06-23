import { Request, Response } from 'express';
import BloodBank from '../../models/emergency/BloodBank';

const VALID_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// GET /api/blood-banks?city=Kolkata&blood=O+
export async function getBloodBanks(req: Request, res: Response) {
  try {
    const query: Record<string, any> = { active: true };
    if (req.query.city) query.city = req.query.city;

    // Filter by a specific blood group being available, e.g. ?blood=O+
    const blood = req.query.blood as string | undefined;
    if (blood && VALID_GROUPS.includes(blood)) {
      query[`availableBlood.${blood}`] = true;
    }

    const collation = { locale: 'en', strength: 2 };
    const banks = await BloodBank.find(query).collation(collation).lean();
    return res.json({ success: true, total: banks.length, data: banks });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

// GET /api/blood-banks/:slug
export async function getBloodBankBySlug(req: Request, res: Response) {
  try {
    const bank = await BloodBank.findOne({ slug: req.params.slug }).lean();
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Blood bank not found' });
    }
    return res.json({ success: true, data: bank });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}
