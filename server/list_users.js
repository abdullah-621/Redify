const { User, sequelize } = require('./db');
async function listUsers() {
  const users = await User.findAll();
  users.forEach(u => console.log(`${u.id}: ${u.name} (${u.email}) - ${u.role}`));
  process.exit();
}
listUsers();
