import User from '../models/user';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!name) return res.status(400).send('Name is required');
    if (!password || password.length < 6) return res.status(400).send('Password is required and must be atleast 6 character');

    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send('Email already exist');

    const user = new User(req.body);
    try {
        await user.save();
        console.log('User created', user)
        return res.json({ ok: true }).send('Success')
    } catch (err) {
        console.log('Create user failed', err)
        return res.status(400).send('Error, Try again!')
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email }).exec();
        console.log('User Exist', user);
        if (!user) return res.status(400).send('No Email Exist');
        // Compare Password
        user.comparePassword(password, function (err, match) {
            console.log(match, err)
            if (!match || err) return res.status(400).send('Wrong Password');
            // generate token
            let token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, { expiresIn: '7d' })
            res.json({
                token, user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }
            })
        })


    } catch (err) {
        console.log('Login Error', err);
        res.status(400).send('Login Failed')
    }
}
