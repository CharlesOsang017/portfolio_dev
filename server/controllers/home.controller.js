import HomeContent from "../models/HomeContent.js";
import ViewLog from "../models/viewLog.model.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * Helper to extract public ID from a Cloudinary URL.
 * Automatically checks if it needs to preserve extensions for raw assets.
 */
const extractPublicId = (url, isRaw = false) => {
    if (!url) return null;
    try {
        // Splits by '/upload/' to isolate the versioning and public ID path
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;
        
        // Remove version component (e.g., v1710000000/) if present
        const pathWithExtension = parts[1].replace(/^v\d+\//, '');
        
        // If it's a raw file (like a PDF resume), Cloudinary requires the extension as part of the Public ID
        if (isRaw) {
            return pathWithExtension;
        }
        
        // Strip out the file extension for standard image types
        return pathWithExtension.substring(0, pathWithExtension.lastIndexOf('.'));
    } catch (err) {
        console.error("Error parsing Cloudinary URL public ID:", err);
        return null;
    }
};

// GET /api/home
export const getHomeContent = async(req, res)=>{
    let content = await HomeContent.findOne();
    if (!content) content = await HomeContent.create({});
    res.json(content);  
}

// PUT /api/home
export const updateHomeContent = async (req, res) => {
    try {
        let content = await HomeContent.findOne();
        if (!content) content = new HomeContent();

        // 1. Destructure fields from body, separating the file payloads
        const { profileImage, resumeFile, ...otherData } = req.body;

        // 2. Assign text fields and metrics safely
        Object.assign(content, otherData);

        // 3. Secure Cloudinary Upload for profileImage (Image)
        if (profileImage && profileImage.startsWith('data:')) {
            // Cleanup: Delete previous image from Cloudinary if it exists
            if (content.profileImage) {
                const oldPublicId = extractPublicId(content.profileImage, false);
                if (oldPublicId) {
                    console.log(`Deleting old profile image: ${oldPublicId}`);
                    await cloudinary.uploader.destroy(oldPublicId).catch(err => 
                        console.error("Failed to delete old image asset:", err)
                    );
                }
            }

            console.log("Uploading profile image payload to Cloudinary...");
            const uploadProfile = await cloudinary.uploader.upload(profileImage, {
                folder: "portfolio_Dev/home",
                resource_type: "auto",
            });
            content.profileImage = uploadProfile.secure_url;
        } else if (profileImage === '') {
            // Optional cleanup if user completely clears out profile image option
            if (content.profileImage) {
                const oldPublicId = extractPublicId(content.profileImage, false);
                if (oldPublicId) {
                    await cloudinary.uploader.destroy(oldPublicId).catch(err => console.error(err));
                }
            }
            content.profileImage = ''; 
        }

        // 4. Secure Cloudinary Upload for resumeFile (PDF/Docs)
        if (resumeFile && resumeFile.startsWith('data:')) {
            // Cleanup: Delete previous resume from Cloudinary if it exists
            if (content.resumeFile) {
                // Pass true since it's a raw asset to retain the extension in the Public ID
                const oldPublicId = extractPublicId(content.resumeFile, true);
                if (oldPublicId) {
                    console.log(`Deleting old resume file asset: ${oldPublicId}`);
                    // Raw assets like PDFs need resource_type: "raw" passed to destroy
                    await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'raw' }).catch(err => 
                        console.error("Failed to delete old resume asset:", err)
                    );
                }
            }

            console.log("Uploading resume file payload to Cloudinary...");
            const uploadResume = await cloudinary.uploader.upload(resumeFile, {
                folder: "portfolio_Dev/resumes",
                resource_type: "raw",   // PDFs must use 'raw' for correct delivery
                flags: "attachment",    // Tells Cloudinary to serve with Content-Disposition: attachment
            });
            content.resumeFile = uploadResume.secure_url;
        } else if (resumeFile === '') {
            // Optional cleanup if user completely clears out resume file option
            if (content.resumeFile) {
                const oldPublicId = extractPublicId(content.resumeFile, true);
                if (oldPublicId) {
                    await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'raw' }).catch(err => console.error(err));
                }
            }
            content.resumeFile = '';
        }

        // 5. Save Database Document Record
        const updated = await content.save();
        res.json(updated);

    } catch (err) {
        console.error("❌ BACKEND RUNTIME EXCEPTION:", err);
        res.status(500).json({ 
            message: 'Internal Server Error encountered while updating home content.',
            error: err.message 
        });
    }
};
// PUT /api/home/view
export const updateHomeView = async(req, res)=>{
    try {
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const existingView = await ViewLog.findOne({ ipAddress: clientIp });

        let content;
        if (!existingView) {
            await ViewLog.create({ ipAddress: clientIp });
            content = await HomeContent.findOneAndUpdate(
                {}, 
                { $inc: { portfolioViews: 1 } }, 
                { new: true, upsert: true }
            );
        } else {
            content = await HomeContent.findOne();
            if (!content) content = await HomeContent.create({});
        }

        res.json({ portfolioViews: content.portfolioViews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET /api/home/resume/download
export const downloadResume = async (req, res) => {
    try {
        const content = await HomeContent.findOne();
        if (!content?.resumeFile) {
            return res.status(404).json({ message: 'No resume file found.' });
        }

        const fileUrl = content.resumeFile;

        // Use fetch + arrayBuffer so the entire file is buffered before sending.
        // This is required on Vercel serverless — stream piping (https.get + pipe)
        // can cause the function to return before the stream finishes, resulting in
        // an empty or truncated download in production.
        const fileRes = await fetch(fileUrl);
        if (!fileRes.ok) {
            return res.status(502).json({ message: 'Failed to fetch resume from storage.' });
        }

        const arrayBuffer = await fileRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const contentType = fileRes.headers.get('content-type') || 'application/pdf';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
        res.setHeader('Content-Length', buffer.length);
        res.end(buffer);
    } catch (err) {
        console.error('downloadResume error:', err);
        res.status(500).json({ message: err.message });
    }
}