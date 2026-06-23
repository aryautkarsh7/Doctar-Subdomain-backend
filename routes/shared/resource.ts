import express, { Router, Request, Response, NextFunction } from 'express';
import crudController from '../../controllers/shared/crudController';
import { Model, Document } from 'mongoose';

/**
 * @openapi
 * /api/doctor-claims:
 *   get:
 *     tags: [Shared]
 *     summary: List doctor profile claims
 *     description: Currently the only consumer of the generic resourceRouter() factory (mounted in server.ts). If more models reuse this factory later, document them here too.
 *     responses:
 *       200:
 *         description: List of claims (doctorSlug, doctorName, claimantName, email, phone, regNumber, message, status [pending|approved|rejected])
 *   post:
 *     tags: [Shared]
 *     summary: Submit a doctor profile claim
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorName, claimantName, email, phone]
 *             properties:
 *               doctorSlug: { type: string }
 *               doctorName: { type: string }
 *               claimantName: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               regNumber: { type: string }
 *               message: { type: string }
 *     responses:
 *       201: { description: Claim created }
 * /api/doctor-claims/{id}:
 *   get:
 *     tags: [Shared]
 *     summary: Get a doctor claim by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Claim found }
 *       404: { description: Claim not found }
 *   put:
 *     tags: [Shared]
 *     summary: Update a doctor claim, e.g. approve/reject (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [pending, approved, rejected] }
 *     responses:
 *       200: { description: Claim updated }
 *   delete:
 *     tags: [Shared]
 *     summary: Delete a doctor claim (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Claim deleted }
 */
// Build a standard REST router for a model.
export default function resourceRouter(ModelClass: any, label: string): Router {
  const router = express.Router();
  const c = crudController(ModelClass, label);

  router.get('/', c.getAll);
  router.get('/:id', c.getOne);
  router.post('/', c.create);
  router.put('/:id', c.update);
  router.delete('/:id', c.remove);

  return router;
}
