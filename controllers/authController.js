import User from '../models/user';

export const register = async (req, res) => {
    // res.status(200).json(req.body)
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!name) return res.status(400).send('Name is required');
    if (!password || password.length < 6) return res.status(400).send('Password is required and must be atleast 6 character');

    const userExist = await User.findOne({ email }).exec();
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