const bcrypt = require('bcrypt');
module.exports = {
  async up(db) {
    const users = [
      {
        role: "admin",
        username: "admin@gmail.com",
        firstName: "anastasiia",
        lastName: "nealova",
        password: await bcrypt.hash("admin", 10),
        lastAction: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        timezone: "America/Edmonton",
        locale:'en '
      }
    ];
    db.collection("users").insertMany(users);
  },
};
