import Inquiry from "../models/Inquiry.js";

// @desc    Submit a new inquiry (Public)
// @route   POST /api/inquiries
export const submitInquiry = async (req, res) => {
    try {
        const { senderName, senderEmail, subject, message } = req.body;

        // Simple validation check
        if (!senderName || !senderEmail || !subject || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const inquiry = await Inquiry.create({
            senderName,
            senderEmail,
            subject,
            message
        });

        res.status(201).json(inquiry);
    } catch (error) {
        res.status(500).json({ message: "Server error while submitting inquiry.", error: error.message });
    }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
export const getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching inquiries.", error: error.message });
    }
};

// @desc    Update inquiry status (Admin)
// @route   PUT /api/inquiries/:id
export const updateInquiry = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate enum values before hitting the database
        const allowedStatuses = ['unread', 'replied', 'archived'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true, runValidators: true } // runValidators ensures schema enum is respected
        );

        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found." });
        }

        res.status(200).json(inquiry);
    } catch (error) {
        res.status(500).json({ message: "Server error while updating inquiry.", error: error.message });
    }
};

// @desc    Delete an inquiry (Admin)
// @route   DELETE /api/inquiries/:id
export const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found." });
        }

        res.status(200).json({ message: "Inquiry deleted successfully.", id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting inquiry.", error: error.message });
    }
};