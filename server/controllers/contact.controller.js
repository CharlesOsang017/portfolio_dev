import Contact from "../models/Contact.js";

// Get the contact document (or create an empty one if it doesn't exist yet)
export const contacts = async (req, res) => {
    try {
        let contact = await Contact.findOne();
        if (!contact) {
            contact = await Contact.create({});
        }
        return res.json(contact);
    } catch (error) {
        return res.status(500).json({ error: "Server error fetching contact info." });
    }
};

// Update the contact document, or create it with req.body if it's missing
export const contactUpdate = async (req, res) => {
    try {
        const updatedContact = await Contact.findOneAndUpdate(
            {},                  
            { $set: req.body }, 
            { 
                new: true,       
                upsert: true,    
                runValidators: true 
            }
        );

        return res.json(updatedContact);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};