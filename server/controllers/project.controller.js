import Project from "../models/Project.js";

// GET /api/projects (public)
export const getPublicProjects = async (req, res) => {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
}

// GET /api/projects/:id
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) { res.status(500).json({ message: err.message }); }
}

// POST /api/projects
export const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (err) { res.status(500).json({ message: err.message }); }
}

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) { res.status(500).json({ message: err.message }); }
}

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
}

// PUT /api/projects/reorder
export const reorderProjects = async (req, res) => {
    try {
        const { order } = req.body;
        await Promise.all(order.map(({ id, order: o }) => Project.findByIdAndUpdate(id, { order: o })));
        res.json({ message: 'Reordered' });
    } catch (err) { res.status(500).json({ message: err.message }); }
}