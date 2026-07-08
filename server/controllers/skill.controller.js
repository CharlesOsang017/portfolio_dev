import Skill from "../models/Skill.js";

// GET all skills
export const allSkills = async (req, res) => { 
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skills", error: error.message });
  }
};

// CREATE a skill
export const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: "Failed to create skill", error: error.message });
  }
};

// DELETE a skill
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.status(200).json({ message: "Skill deleted successfully", skill });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete skill", error: error.message });
  }
};

// UPDATE a skill
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.status(200).json(skill);
  } catch (error) {
    res.status(400).json({ message: "Failed to update skill", error: error.message });
  }
};