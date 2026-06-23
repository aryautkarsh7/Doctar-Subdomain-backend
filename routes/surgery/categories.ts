import express from 'express';
const router = express.Router();
import controller from '../../controllers/surgery/categoryController';

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags: [Surgery]
 *     summary: List all treatment categories
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 total: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name: { type: string }
 *                       slug: { type: string }
 *                       icon: { type: string }
 *                       iconImage: { type: string }
 *                       color: { type: string }
 *                       colorLight: { type: string }
 *                       treatmentCount: { type: integer }
 *                       tags: { type: array, items: { type: string } }
 *                       description: { type: string }
 *                       image: { type: string }
 *   post:
 *     tags: [Surgery]
 *     summary: Create a category (⚠️ No write auth)
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
 *               icon: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Category created }
 *       409: { description: Duplicate slug }
 * /api/categories/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a category by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category found }
 *       404: { description: Category not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a category (⚠️ No write auth)
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
 *       200: { description: Category updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a category (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category deleted }
 */
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
