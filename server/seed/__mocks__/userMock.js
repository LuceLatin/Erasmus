export const users = [
    {
        username: "studentUser",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("2000-01-01"),
        OIB: 12345678901,
        address: "123 Main St",
        city: "Anytown",
        country: "CountryA",
        email: "student@example.com",
        password: "password123",
        role: "student",
        branch: new mongoose.Types.ObjectId(), // Replace with actual Branch ID
    },
    {
        username: "professorUser",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: new Date("1980-05-15"),
        OIB: 23456789012,
        address: "456 Elm St",
        city: "Othertown",
        country: "CountryB",
        email: "professor@example.com",
        password: "password123",
        role: "profesor",
        branch: new mongoose.Types.ObjectId(), // Replace with actual Branch ID
    },
    {
        username: "coordinatorUser",
        firstName: "Alice",
        lastName: "Johnson",
        dateOfBirth: new Date("1990-09-25"),
        OIB: 34567890123,
        address: "789 Oak St",
        city: "Sometown",
        country: "CountryC",
        email: "coordinator@example.com",
        password: "password123",
        role: "koordinator",
        branch: new mongoose.Types.ObjectId(), // Replace with actual Branch ID
    },
];