import HomeContent from "../models/HomeContent.js";

// GET /api/home
export const getHomeContent = async(req, res)=>{
    let content = await HomeContent.findOne();
    if (!content) content = await HomeContent.create({});
    res.json(content);  
}

// PUT /api/home
export const updateHomeContent = async(req, res)=>{
    try {
        let content = await HomeContent.findOne();
        if (!content) content = new HomeContent();
        Object.assign(content, req.body);
        const updated = await content.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// PUT /api/home/view
export const updateHomeView = async(req, res)=>{
    try {
        const content = await HomeContent.findOneAndUpdate(
            {}, { $inc: { portfolioViews: 1 } }, { new: true, upsert: true }
        );
        res.json({ portfolioViews: content.portfolioViews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}