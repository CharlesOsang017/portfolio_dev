import Experience from "../models/Experience.js";


// GET /api/experience/ (public)
export const getExperience = async (req, res) => {
    const exp = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(exp);
}

// POST /api/experience
export const createExperience = async (req, res) => {
    const exp = await Experience.create(req.body);
    res.status(201).json(exp);
}

// PUT /api/experience/:id
export const updateExperience = async (req, res) => {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(exp)
}

// DELETE /api/experience/:id
export const deleteExperience = async (req, res) => {
    await Experience.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
}

// PUT /api/experience/reorder
export const reorderExperience = async (req, res) => {
    const { order } = req.body;
    await Promise.all(order.map(({ id, order }) => Experience.findByIdAndUpdate(id, { order })));
    res.json({ message: 'Reordered' });
}