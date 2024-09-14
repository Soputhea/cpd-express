const mongoose = require("mongoose");
const dbConnect = require("./db/db");
const { faker } = require("@faker-js/faker");
const UserDetail = require("./models/user_detail"); // Adjust the path as necessary
const User = require('./models/user')
const bcrypt = require('bcrypt');


dbConnect().catch((err) => {
  console.log("Server error".err);
});
// Connect to MongoDB
// mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// mongoose.connect('mongodb://localhost:27017/cpd-db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const generateFakeUser = async () => {
  const password = await bcrypt.hash("123456789",10);
  const user = new User({
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    password: password,
    userType: faker.helpers.arrayElement(['sso', 'normal']),
    role: faker.helpers.arrayElement(['user', 'editor', 'admin']),
  });
  return await user.save();
};

const generateFakeUserDetail = async (userId) => {
  const userDetail = new UserDetail({
    user_id: userId,
    payroll_id: faker.string.uuid(),
    name_kh: faker.person.fullName(),
    name_en: faker.person.fullName(),
    gender: faker.helpers.arrayElement(['Male', 'Female']),
    dob: faker.date.past({ years: 40 }),
    date_of_starting_work: faker.date.past({ years: 10 }),
    location_kh: faker.location.city(),
    location_type: faker.helpers.arrayElement(['Urban', 'Rural']),
    province: faker.location.state(),
    commune: faker.location.city(),
    current_position: faker.person.jobTitle(),
    start_date: faker.date.past({ years: 10 }),
    salary_level_kh: `KHR ${faker.number.int({ min: 300, max: 1000 })}`,
    salary_degree: faker.string.alphanumeric(3),
    salary_type_shift_date: faker.helpers.arrayElement(["Daily", "Monthly"]),// Or adjust to fit the schema requirement
    highest_qualification: faker.helpers.arrayElement([
      "High School",
      "Bachelor",
      "Master",
      "PhD",
    ]),
    highest_qualification_subject: faker.person.jobArea(),
    highest_qualification_date: faker.date.past({ years: 20 }),
    highest_professional: faker.person.jobType(),
    professional: faker.person.jobType(),
  });

  return await userDetail.save();
};


const seedDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase(); // Optional: Clears the database before seeding
    for (let i = 0; i < 10; i++) { // Generate 10 users
      const usercreated = await generateFakeUser();
      await generateFakeUserDetail(usercreated._id);
    }
    console.log('Database seeded successfully!');
    // console.log(user);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();