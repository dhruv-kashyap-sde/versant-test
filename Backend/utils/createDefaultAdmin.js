const Admin = require('../models/admin.model');

/**
 * Creates a default admin user if no admin exists in the database
 */
const createDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      // Create default admin
      const defaultAdmin = new Admin({
        username: 'admin',
        password: 'admin@7000', // This will be hashed by the pre-save hook
        email: 'admin@example.com'
      });
      
      await defaultAdmin.save();
      console.log('Default admin created successfully');
    } else {
      console.log('Admin already exists, skipping default admin creation');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

module.exports = createDefaultAdmin;
