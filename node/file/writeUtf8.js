const fs = require("fs");

const filepath = process.argv[2];

const text = fs.readFileSync(filepath, "utf8");

fs.writeFileSync("./out", text);
