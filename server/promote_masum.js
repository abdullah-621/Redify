const { User, sequelize } = require('./db');

async function promoteMasum() {
  try {
    await sequelize.sync();
    const user = await User.findOne({ where: { email: 'shafi03@gmail.com' } });
    if (user) {
      user.role = 'Admin';
      await user.save();
      console.log(`User ${user.name} (${user.email}) is now an Admin!`);
    } else {
      console.log('User Masum not found.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

promoteMasum();
