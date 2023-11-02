const { Profile } = require("../models/Profile");
const { Category } = require("../models/Category");
const { Subcategory } = require("../models/Subcategory");

const { categories, subcategories } = require("../data/initialData");
const ObjectId = require("mongoose").Types.ObjectId;

async function initialBD(req, res) {

    try {

        // New User Admin Profile
        let newData = {};
        let addressUser = process.env.ADDRESS_USER_ADMIN;

        newData.eth_address = addressUser;
        newData.name = "Admin";
        newData.photo = "";

        let newUser = new Profile(newData);
        let userSave = await newUser.save();

        // New Category Services
        let newCategory = {};
        newCategory.title = categories.title;
        newCategory.description = categories.description;
        newCategory.slug = categories.slug;
        newCategory.createdBy = ObjectId(userSave._id);

        let newCategoryData = new Category(newCategory);
        let categorySave = await newCategoryData.save();

        // New SubCategories
        for (let i = 0; i < subcategories.length; i++) {
            subcategories[i].category = ObjectId(categorySave._id);
            subcategories[i].createdBy = ObjectId(userSave._id);

            let subcategoryData = new Subcategory(subcategories[i]);
            await subcategoryData.save();
        }

        // Add new disputespolicies y terms agregar a mano en admin

        return res.status(200).json("Ok")

    } catch (err) {
        console.error(err);
        return res.status(404).json("Error")
    }
}




module.exports = {
    initialBD
};
