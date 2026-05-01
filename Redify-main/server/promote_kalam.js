const { User, sequelize } = require('./db');

async function promoteKalam() {
  try {
    await sequelize.sync();
    const user = await User.findByPk(3);
    if (user) {
      user.role = 'Admin';
      await user.save();
      console.log(`User ${user.name} (${user.email}) is now an Admin!`);
    } else {
      console.log('User ID 3 not found.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

promoteKalam();
