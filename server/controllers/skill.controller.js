import Skill from "../models/Skill.js";

export const allSkills = async(req, res)=>{ 
        const skills = await Skill.find().sort({ category: 1, order: 1 });
        res.json(skills);
}

export const createSkill = async(req, res) => {
    const skill = await Skill.create(req.body);
    res.json(skill);
}

export const deleteSkill = async(req, res) => {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    res.json(skill);
}

export const updateSkill = async(req, res) => {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(skill);
}