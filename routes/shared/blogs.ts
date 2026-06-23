import express, { Request, Response } from 'express';
const router = express.Router();
import Blog from '../../models/shared/Blog';

function slugify(value: any): string {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeBlogPayload(body: any): any {
  const payload = { ...body };

  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);
  if (typeof payload.published === 'string') {
    payload.published = payload.published === 'true' || payload.published === 'on';
  }
  if (typeof payload.tags === 'string') {
    payload.tags = payload.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
  }
  if (!Array.isArray(payload.showOn) || payload.showOn.length === 0) {
    payload.showOn = ['all'];
  }

  return payload;
}

/**
 * @openapi
 * /api/blogs:
 *   get:
 *     tags: [Shared]
 *     summary: List blog posts
 *     description: With `page`, returns only published posts matching showOn 'all' or the given page. Without `page`, returns every post (used by the admin panel). `siteType` is optional — omitting it returns posts for every subdomain.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: string }
 *         description: home | category-slug | doctor-slug | treatment-slug
 *       - in: query
 *         name: siteType
 *         schema: { type: string, enum: [surgery, emergency] }
 *     responses:
 *       200: { description: List of blog posts }
 *   post:
 *     tags: [Shared]
 *     summary: Create a blog post (⚠️ No write auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, category]
 *             properties:
 *               title: { type: string }
 *               slug: { type: string, description: "Auto-derived from title if omitted" }
 *               content: { type: string }
 *               contentType: { type: string, enum: [standard, html] }
 *               excerpt: { type: string }
 *               author: { type: string }
 *               category: { type: string }
 *               thumbnail: { type: string, description: "Surgery posts' image field" }
 *               image: { type: string, description: "Emergency posts' image field" }
 *               siteType: { type: string, enum: [surgery, emergency], default: surgery }
 *               tags: { type: array, items: { type: string } }
 *               published: { type: boolean }
 *               showOn: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Blog created }
 * /api/blogs/{id}:
 *   get:
 *     tags: [Shared]
 *     summary: Get a blog post by Mongo _id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Blog found }
 *       404: { description: Blog not found }
 *   put:
 *     tags: [Shared]
 *     summary: Update a blog post (⚠️ No write auth)
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
 *       200: { description: Blog updated }
 *   delete:
 *     tags: [Shared]
 *     summary: Delete a blog post (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Blog deleted }
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, siteType } = req.query;
    const filter: any = page
      ? { published: true, showOn: { $in: ['all', page as string] } }
      : {};
    if (siteType) filter.siteType = siteType as string;

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, total: blogs.length, data: blogs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.json({ success: true, data: blog });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.create(normalizeBlogPayload(req.body));
    res.status(201).json({ success: true, message: 'Blog created', data: blog });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, normalizeBlogPayload(req.body), {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.json({ success: true, message: 'Blog updated', data: blog });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
