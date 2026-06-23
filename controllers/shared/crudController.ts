import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';

/**
 * Generic CRUD controller factory.
 * Returns { getAll, getOne, create, update, remove } for a given Mongoose model.
 */
export default function crudController<T extends Document>(ModelClass: Model<T>, label: string = 'Item') {
  return {
    // GET /  — list all (newest first when timestamps exist).
    // Supports filtering by any real schema field via query params,
    // e.g. GET /api/subcategories?categorySlug=general-surgery
    // Supports pagination via ?page=1&limit=20
    async getAll(req: Request, res: Response) {
      try {
        const filter: any = {};
        const paths = ModelClass.schema.paths;
        const reservedKeys = new Set(['page', 'limit']);
        for (const key of Object.keys(req.query || {})) {
          if (!reservedKeys.has(key) && paths[key]) {
            filter[key] = req.query[key];
          }
        }
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 0));
        const query = ModelClass.find(filter).sort({ createdAt: -1 });
        if (limit > 0) query.skip((page - 1) * limit).limit(limit);
        const items = await query;
        res.json({ success: true, total: items.length, page: limit > 0 ? page : 1, data: items });
      } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
      }
    },

    // GET /:id
    async getOne(req: Request, res: Response) {
      try {
        const item = await ModelClass.findById(req.params.id);
        if (!item) {
          res.status(404).json({ success: false, message: `${label} not found` });
          return;
        }
        res.json({ success: true, data: item });
      } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
      }
    },

    // POST /
    async create(req: Request, res: Response) {
      try {
        const item = await ModelClass.create(req.body);
        res.status(201).json({ success: true, message: `${label} created`, data: item });
      } catch (err: any) {
        const code = err.code === 11000 ? 409 : 400;
        res.status(code).json({ success: false, error: err.message });
      }
    },

    // PUT /:id
    async update(req: Request, res: Response) {
      try {
        const item = await ModelClass.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) {
          res.status(404).json({ success: false, message: `${label} not found` });
          return;
        }
        res.json({ success: true, message: `${label} updated`, data: item });
      } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
      }
    },

    // DELETE /:id
    async remove(req: Request, res: Response) {
      try {
        const item = await ModelClass.findByIdAndDelete(req.params.id);
        if (!item) {
          res.status(404).json({ success: false, message: `${label} not found` });
          return;
        }
        res.json({ success: true, message: `${label} deleted` });
      } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  };
}
