import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import cookie from "cookie"
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
      // Set JWT token in a cookie
      const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
    const cookieOptions = {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set cookie expiration to 30 days from now
      path: '/', // Cookie is accessible on the entire domain
    };

    const cookieStr = cookie.serialize('token', token, cookieOptions);
    const cookies = res.setHeader('Set-Cookie', cookieStr);
    console.log(cookies)
      
      await user.save();


      const cookieHeader = req.headers.cookie;

  // Parse the cookie header into an object
  const cookiess = cookie.parse(cookieHeader || '');

  // Get the token from the parsed cookies object
  const tokenn = cookiess.token;

  return tokenn;
      res.status(200).json({ success: 'User registered successfully', tokenn });
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
            if(!user) return res.status(400).json({error:'Invalid Email'})
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
