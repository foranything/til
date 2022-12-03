const sharp = require("sharp");
const size = [64, 64];
const filePath = "../assets/4225935.png";

sharp(filePath)
  .resize(...size)
  .png()
  .toFile("./out.png");
