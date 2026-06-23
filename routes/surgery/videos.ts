import express from 'express';
const router = express.Router();
import controller from '../../controllers/surgery/videoController';

/**
 * @openapi
 * /api/videos:
 *   get:
 *     tags: [Surgery]
 *     summary: List videos (doctor reels / landscape clips)
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
 *         description: List of videos (title, video_url, embed_code, doctor_name, specialty, thumbnail_url, platform [youtube|instagram], type [reel|landscape], order, showOn[])
 *   post:
 *     tags: [Surgery]
 *     summary: Create a video (⚠️ No write auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, doctor_name, specialty, platform, type]
 *             properties:
 *               title: { type: string }
 *               video_url: { type: string }
 *               embed_code: { type: string }
 *               doctor_name: { type: string }
 *               specialty: { type: string }
 *               thumbnail_url: { type: string }
 *               platform: { type: string, enum: [youtube, instagram] }
 *               type: { type: string, enum: [reel, landscape] }
 *               order: { type: integer }
 *     responses:
 *       201: { description: Video created }
 * /api/videos/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a video by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Video found }
 *       404: { description: Video not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a video (⚠️ No write auth)
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
 *       200: { description: Video updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a video (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Video deleted }
 */
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
