import express from 'express';
const router = express.Router();
import controller from '../../controllers/surgery/petHospitalController';

/**
 * @openapi
 * /api/pet-hospitals:
 *   get:
 *     tags: [Surgery]
 *     summary: List pet hospitals / veterinary clinics
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of pet hospitals (slug, name, type, petTypes[], phone, address, city, rating, services[], amenities[], ...)
 *   post:
 *     tags: [Surgery]
 *     summary: Create a pet hospital (⚠️ No write auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               city: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               services: { type: array, items: { type: string } }
 *               amenities: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Pet hospital created }
 * /api/pet-hospitals/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a pet hospital by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Pet hospital found }
 *       404: { description: Pet hospital not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a pet hospital (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200: { description: Pet hospital updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a pet hospital (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Pet hospital deleted }
 */
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
