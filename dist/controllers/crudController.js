"use strict";
/**
 * Generic CRUD controller factory.
 * Returns { getAll, getOne, create, update, remove } for a given Mongoose model.
 */
function crudController(Model, label = 'Item') {
    return {
        // GET /  — list all (newest first when timestamps exist).
        // Supports filtering by any real schema field via query params,
        // e.g. GET /api/subcategories?categorySlug=general-surgery
        async getAll(req, res) {
            try {
                const filter = {};
                const paths = Model.schema.paths;
                for (const key of Object.keys(req.query || {})) {
                    if (paths[key])
                        filter[key] = req.query[key];
                }
                const items = await Model.find(filter).sort({ createdAt: -1 });
                res.json({ success: true, total: items.length, data: items });
            }
            catch (err) {
                res.status(500).json({ success: false, error: err.message });
            }
        },
        // GET /:id
        async getOne(req, res) {
            try {
                const item = await Model.findById(req.params.id);
                if (!item)
                    return res.status(404).json({ success: false, message: `${label} not found` });
                res.json({ success: true, data: item });
            }
            catch (err) {
                res.status(500).json({ success: false, error: err.message });
            }
        },
        // POST /
        async create(req, res) {
            try {
                const item = await Model.create(req.body);
                res.status(201).json({ success: true, message: `${label} created`, data: item });
            }
            catch (err) {
                const code = err.code === 11000 ? 409 : 400;
                res.status(code).json({ success: false, error: err.message });
            }
        },
        // PUT /:id
        async update(req, res) {
            try {
                const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!item)
                    return res.status(404).json({ success: false, message: `${label} not found` });
                res.json({ success: true, message: `${label} updated`, data: item });
            }
            catch (err) {
                res.status(400).json({ success: false, error: err.message });
            }
        },
        // DELETE /:id
        async remove(req, res) {
            try {
                const item = await Model.findByIdAndDelete(req.params.id);
                if (!item)
                    return res.status(404).json({ success: false, message: `${label} not found` });
                res.json({ success: true, message: `${label} deleted` });
            }
            catch (err) {
                res.status(500).json({ success: false, error: err.message });
            }
        },
    };
}
module.exports = crudController;
