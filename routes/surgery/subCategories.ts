import express from 'express';
const router = express.Router();
import controller from '../../controllers/surgery/subCategoryController';

/**
 * @openapi
 * /api/subcategories:
 *   get:
 *     tags: [Surgery]
 *     summary: List subcategories
 *     parameters:
 *       - in: query
 *         name: categorySlug
 *         schema: { type: string }
 *         description: Filter by parent category slug, e.g. ?categorySlug=general-surgery
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of subcategories (name, slug, categorySlug, description, icon, order)
 *   post:
 *     tags: [Surgery]
 *     summary: Create a subcategory (⚠️ No write auth)
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
 *               description: { type: string }
 *               icon: { type: string }
 *               order: { type: integer }
 *     responses:
 *       201: { description: Subcategory created }
 * /api/subcategories/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a subcategory by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Subcategory found }
 *       404: { description: Subcategory not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a subcategory (⚠️ No write auth)
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
 *       200: { description: Subcategory updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a subcategory (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Subcategory deleted }
 */
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
