import { Router } from 'express';
import { getAmbulances, getAmbulanceBySlug } from '../../controllers/emergency/ambulanceController';

const router = Router();

/**
 * @openapi
 * /api/ambulances:
 *   get:
 *     tags: [Emergency]
 *     summary: List ambulances
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of active ambulances (name, slug, type [Basic|ALS|ICU], driver{name,phone}, phone, city, area, location{lat,lng}, available, price, rating, image)
 * /api/ambulances/{slug}:
 *   get:
 *     tags: [Emergency]
 *     summary: Get an ambulance by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Ambulance found }
 *       404: { description: Ambulance not found }
 */
router.get('/', getAmbulances);
router.get('/:slug', getAmbulanceBySlug);

export default router;
