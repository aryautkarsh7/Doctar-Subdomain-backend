import express from 'express';
const router = express.Router();
import controller from '../../controllers/surgery/treatmentController';

/**
 * @openapi
 * /api/treatments:
 *   get:
 *     tags: [Surgery]
 *     summary: List treatments
 *     parameters:
 *       - in: query
 *         name: categorySlug
 *         schema: { type: string }
 *         description: Filter by parent category slug
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of treatments (name, slug, categorySlug, subCategorySlug, brief, recovery, costRange, procedure, benefits[])
 *   post:
 *     tags: [Surgery]
 *     summary: Create a treatment (⚠️ No write auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, categorySlug]
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               categorySlug: { type: string }
 *               subCategorySlug: { type: string }
 *               brief: { type: string }
 *               recovery: { type: string }
 *               costRange: { type: string }
 *               procedure: { type: string }
 *               benefits: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Treatment created }
 * /api/treatments/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a treatment by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Treatment found }
 *       404: { description: Treatment not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a treatment (⚠️ No write auth)
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
 *       200: { description: Treatment updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a treatment (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Treatment deleted }
 */
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
