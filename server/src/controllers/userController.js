const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const User = require('../models/user');
const generateJWTtoken=id=>jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'10d'});

exports.registerUser = async (req, res) => {
  try {
    const { name, occupation, email, password } = req.body;

    if (!name || !occupation || !email || !password) {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      occupation,
      email,
      password: hashedPassword,
    });

    if (user) {

      return res.status(201).json({
        _id: user.id,
        name: user.name,
        occupation: user.occupation,
        email: user.email,
        password:hashedPassword,
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Failed to create user' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({
        _id: user.id,
        name: user.name,
        occupation: user.occupation,
        email: user.email,
        token:generateJWTtoken(user._id),
        message: 'Logged in successfully',
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Failed to log in user' });
  }
};

exports.getCurrentUser=async(req,res)=>{
  res.json({message:'current user data'})
}