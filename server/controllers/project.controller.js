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
    try {
        const { 
            title, 
            category, 
            techStack, 
            description, 
            liveUrl, 
            githubUrl, 
            isFeatured, 
            isInternal, 
            isPublished 
        } = req.body;
        
        let { image } = req.body;

        // 1. Refined Validation Check (Triggers if either required field is missing)
        if (!title || !category) {
            return res.status(400).json({
                message: 'Both title and category are strictly required fields.'
            });
        }

        // 2. Safe Tech Stack Parsing (Handles arrays or strings cleanly without throwing crashes)
        let processedTechStack = [];
        if (Array.isArray(techStack)) {
            processedTechStack = techStack.map(t => String(t).trim());
        } else if (typeof techStack === 'string' && techStack.trim() !== '') {
            processedTechStack = techStack.split(',').map(t => t.trim());
        }

        // 3. Secure Cloudinary Media Upload
        let imgUrl = '';
        if (image) {
            console.log("Uploading file attachment payload to Cloudinary...");
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "portfolio_Dev",
                resource_type: "auto",
            });
            imgUrl = uploadResponse.secure_url;
        }

        // 4. Save Database Document Record
        const project = new Project({
            title,
            category,
            techStack: processedTechStack,
            description: description || '',
            liveUrl: liveUrl || '',
            githubUrl: githubUrl || '',
            isFeatured: !!isFeatured,
            isInternal: !!isInternal,
            isPublished: !!isPublished,
            image: imgUrl
        });

        await project.save();
        
        // 5. Return success payload
        return res.status(201).json(project);

    } catch (error) {
        // Captures errors gracefully so the server stays up and running
        console.error("❌ BACKEND RUNTIME EXCEPTION:", error);
        return res.status(500).json({
            message: 'Internal Server Error encountered while generating project record.',
            error: error.message
        });
    }
};

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