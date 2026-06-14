const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-connect';
(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findOne({ email: 'mshamim24@student.uiu.ac.bd' }).lean();
    console.log('user', user ? { email: user.email, studentId: user.studentId, role: user.role, password: user.password ? user.password.slice(0, 10) + '...' : null } : null);
    if (user) {
      const ok = await bcrypt.compare('Student123!', user.password);
      console.log('compare ok:', ok);
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
