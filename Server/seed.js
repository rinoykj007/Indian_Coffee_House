require("dotenv").config();
const mongoose = require("mongoose");
const Menu = require("./models/Menu");
const { menuData } = require("./menulist.js");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    await Menu.deleteMany({});
    await Menu.insertMany(menuData);
    console.log("Data seeded!");
    mongoose.disconnect();
  })
  .catch(console.error);
