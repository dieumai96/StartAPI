const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    username: { type: String, require: true },
    password: { type: String, require: true },
    created_at: { type: Date, require: true },
});
userSchema.methods.generateHash = function (passsword) {
    return bcrypt.hashSync(passsword, bcrypt.genSaltSync(8), null);
}
userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(err);
    }
}
module.exports = mongoose.model('User3', userSchema);