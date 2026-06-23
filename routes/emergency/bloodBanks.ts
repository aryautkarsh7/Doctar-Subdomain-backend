import { Router } from 'express';
import { getBloodBanks, getBloodBankBySlug } from '../../controllers/emergency/bloodBankController';

const router = Router();

/**
 * @openapi
 * /api/blood-banks:
 *   get:
 *     tags: [Emergency]
 *     summary: List blood banks
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: blood
 *         schema: { type: string, enum: [A+, A-, B+, B-, O+, O-, AB+, AB-] }
 *         description: Filter to banks that currently have this blood group available
 *     responses:
 *       200:
 *         description: List of active blood banks (name, slug, city, area, address, location{lat,lng}, phone, rating, hospital, open24x7, availableBlood{8 groups}, image)
 * /api/blood-banks/{slug}:
 *   get:
 *     tags: [Emergency]
 *     summary: Get a blood bank by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Blood bank found }
 *       404: { description: Blood bank not found }
 */
router.get('/', getBloodBanks);
router.get('/:slug', getBloodBankBySlug);

export default router;
