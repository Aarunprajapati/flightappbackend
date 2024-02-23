import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';

const userController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!(name && email && password)) {
        return res.status(200).json({error: "Please provide all the required details"});
      }    
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = new userModel({
        name,
        email,
        password: hashedPassword,
      });
      const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
      await user.save();


      res.status(200).json({ success: 'User registered successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async login( req,res){
    const { email, password } = req.body;
    try {
        if(!(email && password)){
            return res.status(400).json({error: 'Please provide email and password'});
        }
        else{
            const user = await userModel.findOne({ email });
            if(!user) return res.status(400).json({error:'Invalid Email or Password'})
            const isMatch = await bcrypt.compare(password, user.password);
            if( isMatch){
                const token = jwt.sign({userId: user._id, email}, process.env.JWT_SECRET_KEY, {expiresIn:'15d'});
                res.status(200).json({success:"login successfully", token : token}) ;
            }
            else{
                return res.status(400).json({error: "password doesn't match with existing password"})
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
        
    }
  },
  async loggeduser(req,res){
    res.send({"user": req.user})
   },
   
   
};

export default userController;
