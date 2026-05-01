const { User, sequelize } = require('./db');

async function promoteAdmin() {
  try {
    await sequelize.sync();
    // Promote the first user to Admin, or you can specify email
    const user = await User.findOne({ order: [['id', 'ASC']] });
    if (user) {
      user.role = 'Admin';
      await user.save();
      console.log(`User ${user.name} (${user.email}) is now an Admin!`);
    } else {
      console.log('No users found in database.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

promoteAdmin();
