import express from 'express';
const router = express.Router();
import controller from '../../controllers/surgery/subSubCategoryController';

/**
 * @openapi
 * /api/subsubcategories:
 *   get:
 *     tags: [Surgery]
 *     summary: List sub-subcategories
 *     parameters:
 *       - in: query
 *         name: categorySlug
 *         schema: { type: string }
 *       - in: query
 *         name: subCategorySlug
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of sub-subcategories (name, slug, categorySlug, subCategorySlug, keywords[], order)
 *   post:
 *     tags: [Surgery]
 *     summary: Create a sub-subcategory (⚠️ No write auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, categorySlug, subCategorySlug]
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               categorySlug: { type: string }
 *               subCategorySlug: { type: string }
 *               keywords: { type: array, items: { type: string } }
 *               order: { type: integer }
 *     responses:
 *       201: { description: Sub-subcategory created }
 * /api/subsubcategories/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a sub-subcategory by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Sub-subcategory found }
 *       404: { description: Sub-subcategory not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a sub-subcategory (⚠️ No write auth)
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
 *       200: { description: Sub-subcategory updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a sub-subcategory (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Sub-subcategory deleted }
 */
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
