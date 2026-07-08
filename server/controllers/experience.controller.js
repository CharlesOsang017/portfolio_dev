import Experience from "../models/Experience.js";

// GET /api/experience/ (public)
export const getExperience = async (req, res) => {
  try {
    const exp = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(exp);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching experience", error: error.message });
  }
};

// POST /api/experience
export const createExperience = async (req, res) => {
  try {
    const { jobTitle, company, location, startDate, endDate, isPresent, responsibilities, order } = req.body;
    const exp = await Experience.create({
      jobTitle,
      company,
      location,
      startDate,
      endDate: isPresent ? null : endDate,
      isPresent: !!isPresent,
      responsibilities: responsibilities || [],
      order: order || 0
    });

    res.status(201).json(exp);
  } catch (error) {
    res.status(500).json({ message: "Server error creating experience", error: error.message });
  }
};

// PUT /api/experience/:id
export const updateExperience = async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // runValidators ensures updates respect the schema rules
    );
    
    if (!exp) return res.status(404).json({ message: 'Experience entry not found' });
    res.status(200).json(exp);
  } catch (error) {
    res.status(500).json({ message: "Server error updating experience", error: error.message });
  }
};

// DELETE /api/experience/:id
export const deleteExperience = async (req, res) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Experience entry not found' });
    
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting experience", error: error.message });
  }
};

// PUT /api/experience/reorder
export const reorderExperience = async (req, res) => {
  try {
    const { order } = req.body; // Expects an array of objects: [{ id: "...", order: 1 }]
    
    if (!Array.isArray(order)) {
      return res.status(400).json({ message: "Order data must be an array" });
    }

    await Promise.all(
      order.map(({ id, order }) => Experience.findByIdAndUpdate(id, { order }))
    );
    
    res.status(200).json({ message: 'Reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: "Server error reordering experiences", error: error.message });
  }
};