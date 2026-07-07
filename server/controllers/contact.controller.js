import Contact from "../models/Contact.js";

export const contacts = async (req, res) => {
    let contact = await Contact.findOne();
    if (!contact) contact = await Contact.create({})
    res.json(contact);

}

export const contactUpdate = async (req, res) => {

    let contact = await Contact.findOne();
    if (!contact) contact = await Contact.create(req.body);
    const updated = await contact.save();
    res.json(updated);

}