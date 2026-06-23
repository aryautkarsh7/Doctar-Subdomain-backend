import { Router } from 'express';
import { getEmergencyCenters, getEmergencyCenterBySlug } from '../../controllers/emergency/emergencyCenterController';

const router = Router();

/**
 * @openapi
 * /api/emergency-centers:
 *   get:
 *     tags: [Emergency]
 *     summary: List emergency centers
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of active emergency centers (name, slug, type, city, area, address, location{lat,lng}, phone, rating, services[], beds, open24x7, image)
 * /api/emergency-centers/{slug}:
 *   get:
 *     tags: [Emergency]
 *     summary: Get an emergency center by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Emergency center found }
 *       404: { description: Emergency center not found }
 */
router.get('/', getEmergencyCenters);
router.get('/:slug', getEmergencyCenterBySlug);

export default router;
