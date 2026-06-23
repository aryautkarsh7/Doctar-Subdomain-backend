import express, { Request, Response } from 'express';
const router = express.Router();
import Doctor from '../../models/surgery/Doctor';
import crudController from '../../controllers/shared/crudController';

const c = crudController(Doctor, 'Doctor');

/**
 * @openapi
 * /api/doctors:
 *   get:
 *     tags: [Surgery]
 *     summary: List all doctors
 *     description: Always includes `iconImage` (defaults to '' for docs seeded before that field existed).
 *     responses:
 *       200:
 *         description: List of all doctors, newest first
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
 *                       city: { type: string }
 *                       iconImage: { type: string }
 *   post:
 *     tags: [Surgery]
 *     summary: Create a doctor (⚠️ No write auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       201: { description: Doctor created }
 * /api/doctors/{id}:
 *   get:
 *     tags: [Surgery]
 *     summary: Get a doctor by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Doctor found }
 *       404: { description: Doctor not found }
 *   put:
 *     tags: [Surgery]
 *     summary: Update a doctor (⚠️ No write auth)
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
 *       200: { description: Doctor updated }
 *   delete:
 *     tags: [Surgery]
 *     summary: Delete a doctor (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Doctor deleted }
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const docs = await Doctor.find().sort({ createdAt: -1 }).lean();
    const normalized = docs.map((doc: any) => ({
      ...doc,
      iconImage: doc.iconImage || '',
    }));
    res.json({ success: true, total: normalized.length, data: normalized });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// All other CRUD operations (getOne, create, update, delete) use the generic controller
router.get('/:id', c.getOne);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

export default router;
