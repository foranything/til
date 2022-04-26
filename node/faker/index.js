const { faker } = require("@faker-js/faker");

faker.seed(1234);

const email = faker.internet.email();

console.log(email);
