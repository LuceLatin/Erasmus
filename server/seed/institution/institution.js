import { Category } from "../../models/Institution/Category.js";
import { Institution } from "../../models/Institution/Institution.js";
import { Branch } from "../../models/Institution/Branch.js";

const institutionExists = async () => {
    const institutions = await Institution.countDocuments();
    if (institutions > 0) {
        console.log("Institutions already exist in the database");
        return true;
    }
    return false;
}
const institutions = [
    {
        OIB: 12345678901,
        name: "TehnoTvrtka",
        address: "Tehnička ulica 123",
        city: "Tehnograd",
        country: "Hrvatska",
        type: "company",
    },
    {
        OIB: 98765432109,
        name: "SveučilišteEdu",
        address: "Ulica Edukacije 456",
        city: "Obrazovgrad",
        country: "Hrvatska",
        type: "college",
    },
];

const branches = async () => {
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

export const seedInstitutions = async () => {
    try {
        if (await institutionExists()) return;

        await Institution.deleteMany();
        await Branch.deleteMany();


        const createdInstitutions = await Institution.insertMany(institutions);
        console.log("Institutions seeded:", createdInstitutions);

        const branchData = await branches();
        const createdBranches = await Branch.insertMany(branchData);
        console.log("Branches seeded:", createdBranches);

        console.log("Seeding complete");
    } catch (err) {
        console.error("Seeding error:", err);
    }
};

