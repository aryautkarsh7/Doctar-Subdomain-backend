import express from 'express';
const router = express.Router();
import controller from '../../controllers/surgery/hospitalController';

/**
 * @openapi
 * /api/hospitals:
 *   get:
 *     tags: [Surgery]
 *     summary: List hospitals
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
 *         description: List of hospitals (slug, name, type, city, address, rating, phone, specialties[], services[], beds, ...)
 *   post:
 *     tags: [Surgery]
 *     summary: Create a hospital (⚠️ No write auth)
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
 *               address: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201: { description: Hospital created }
 * /api/hospitals/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a hospital by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Hospital found }
 *       404: { description: Hospital not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a hospital (⚠️ No write auth)
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
 *       200: { description: Hospital updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a hospital (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Hospital deleted }
 */
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
