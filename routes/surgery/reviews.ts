import express from 'express';
const router = express.Router();
import controller from '../../controllers/surgery/reviewController';

/**
 * @openapi
 * /api/reviews:
 *   get:
 *     tags: [Surgery]
 *     summary: List patient reviews
 *     parameters:
 *       - in: query
 *         name: showOn
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of reviews (name, city, rating 1-5, review, consultation, hospital, verified, showOn[])
 *   post:
 *     tags: [Surgery]
 *     summary: Create a review (⚠️ No write auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, review]
 *             properties:
 *               name: { type: string }
 *               city: { type: string }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               review: { type: string }
 *               consultation: { type: string }
 *               hospital: { type: string }
 *               verified: { type: boolean }
 *               showOn: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Review created }
 * /api/reviews/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a review by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Review found }
 *       404: { description: Review not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a review (⚠️ No write auth)
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
 *       200: { description: Review updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a review (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Review deleted }
 */
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
