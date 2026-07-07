import Inquiry from "../models/Inquiry.js";

// Public: submit inquiry
// POST /api/inquiries
export const submitInquiry = async (req, res) => {
    const inquiry = await Inquiry.create(req.body);
    res.json(inquiry);
}

// Admin: get all inquiries
// GET /api/inquiries
export const getInquiries = async (req, res) => {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
}

// Admin: update status
// PUT /api/inquiries/:id
export const updateInquiry = async (req, res) => {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(inquiry);
}

// Admin: delete
// DELETE /api/inquiries/:id
export const deleteInquiry = async (req, res) => {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    res.json(inquiry);
}