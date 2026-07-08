import Project from "../models/Project.js";
import {v2 as cloudinary} from "cloudinary";

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
    const { title, category, techStack, description, liveUrl, githubUrl, isFeatured, isInternal, isPublished } = req.body;
    let {image} = req.body;
    if(!title && !category && !description && !liveUrl && !githubUrl) {
        return res.status(400).json({
            message: 'At least title and category are required'
        })

    }
    let imgUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "portfolio_Dev",
            resource_type: "auto",
        })
        imgUrl = uploadResponse.secure_url;
    }
    const project = new Project({
        title,
        category,
        techStack: techStack.split(',').map(t => t.trim()),
        description,
        liveUrl,
        githubUrl,
        isFeatured,
        isInternal,
        isPublished,
        image: imgUrl
    });
    await project.save();
    res.status(201).json(project);
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