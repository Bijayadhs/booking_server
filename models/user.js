import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: 'string',
        trim: true,
        required: 'Name is required',
    },
    email: {
        type: 'string',
        trim: true,
        required: 'Email is required',
        unique: true
    },
    password: {
        type: 'string',
        required: 'Password is required',
        min: 6,
        max: 64,
    },
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {},

}, { timestamps: true });
//everytime loads cretedAtDate and updatedAtDate

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        return bcrypt.hash(user.password, 12, function (err, hash) {
            if (err) {
                console.log('Hashing error', err);
                return next()
            }
            user.password = hash;
            return next()
        })
    } else { return next() }



})
userSchema.methods.comparePassword = function (password, next) {
    bcrypt.compare(password, this.password, function (err, match) {
        if (err) {
            console.log('Compare Password Error', err)
            return next(err, false)
        }
        console.log('Matched password', match)
        return next(null, match);
    });
}

export default mongoose.model('User', userSchema);