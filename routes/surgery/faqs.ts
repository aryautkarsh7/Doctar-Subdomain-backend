import express from 'express';
const router = express.Router();
import controller from '../../controllers/surgery/faqController';

/**
 * @openapi
 * /api/faqs:
 *   get:
 *     tags: [Surgery]
 *     summary: List FAQs
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of FAQs (question, answer, category, order, showOn[])
 *   post:
 *     tags: [Surgery]
 *     summary: Create a FAQ (⚠️ No write auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question, answer]
 *             properties:
 *               question: { type: string }
 *               answer: { type: string }
 *               category: { type: string }
 *               order: { type: integer }
 *               showOn: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: FAQ created }
 * /api/faqs/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a FAQ by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: FAQ found }
 *       404: { description: FAQ not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a FAQ (⚠️ No write auth)
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
 *       200: { description: FAQ updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a FAQ (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: FAQ deleted }
 */
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
