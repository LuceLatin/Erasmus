import {Category} from "../../models/Institution/Category.js";
import {Institution} from "../../models/Institution/Institution.js";

export const branches = async () => {
    const techCategory = await Category.findOne({ name: "Racunarstvo" });
    const eduCategory = await Category.findOne({ name: "Ekonomija" });

    const techCorp = await Institution.findOne({ name: "TehnoTvrtka" });
    const eduUniversity = await Institution.findOne({ name: "SveučilišteEdu" });

    return [
        {
            name: "Glavna podružnica TehnoTvrtke",
            address: "Tehnička ulica 123",
            city: "Tehnograd",
            country: "Hrvatska",
            category: techCategory._id,
            institution: techCorp._id,
        },
        {
            name: "Gradski kampus SveučilištaEdu",
            address: "Kampuska cesta 789",
            city: "Obrazovgrad",
            country: "Hrvatska",
            category: eduCategory._id,
            institution: eduUniversity._id,
        },
    ];
};