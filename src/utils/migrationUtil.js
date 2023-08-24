const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile")


const clearProfile = async () => {

    /* console.log("Empezo clearProfile")
    const listProfiles = await Profile.find();

    for (let i = 0; i < listProfiles.length; i++) {
        let profile = listProfiles[i];
        if (profile) {
            let newData = {
                name: `${profile.first_name || ""} ${profile.last_name || ""}`,
                private_info: {
                    address: profile.address || "",
                    country: profile.country || "",
                    city: profile.city || "",
                    telephone: profile.telephone || "",
                    email: profile.email || ""
                }
            };

            await Profile.findByIdAndUpdate(profile._id, newData);
            console.log("Se actualizo tal" + profile._id);
            continue
        }
        continue
    }


    // Eliminar propiedad
    await Profile.updateMany(
        // Consulta para los documentos que deseas actualizar
        {},
        // Actualización para eliminar propiedades
        { $unset: { city: "", telephone: "", email: "", address: "", country: "", first_name: "", last_name: "", registered_time: "", realname: "" } },
        // Callback opcional
        (err, result) => {
            if (err) throw err;
            console.log(`${result.nModified} documentos actualizados`);
        }
    ); */

}

const updateeItems = async() => {
    try {
        console.log("Update item")

        const items = await Item.find();

        console.log("item", items.length);

        for (let item of items){
            console.log(item, "item")
            await Item.findByIdAndUpdate(item._id, {
                typeprice: "Total"
            })
        }        
        return

    } catch (err){
        console.error(err);
        return
    }
}

module.exports = {
    clearProfile,
    updateeItems
}