const categories = require("../data/categories");
const { Category } = require("../models/Category");

const LoadCategories = () => {

    console.log(categories.length)
    
    categories.map(async(category) =>{
        const verif = await Category.findOne({
            categoryId: category.categoryId
        })

        if (!verif){
            const newCategory = new Category(category)
  
            await newCategory.save()
            console.log("cargado")
        } else {
            console.log("Existe")
        }
    })

    return
}

module.exports = LoadCategories;