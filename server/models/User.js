import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();
export const Payment_status = {
    PAYMENTUSER: "paymentuser",
    NONPAYMENTUSER: "nonpaymentuser",
    ADMINISTRATOR: "Administrator"
};

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        UserName: {
            type: String,
            unique: true,
            required: true,
        },
        Password: {
            type: String,
            required: true,
        },
        Email: { type: String, unique: true, required: true },
        Firstname: { type: String, required: true },
        Lastname: { type: String, required: true },
        IsActive: { type: Boolean, default: false },
        PhoneNumber: String,
        LastsubscriptionDate: Date,
        PaymentStatus: String,
        Company_code: String,
        Profile_image: String,
        token: String,
        User_code: String,
    },
    {
        timestamps: true,
        collection: "users",
    }
);

/**
 * @param {String} UserName
 * @param {String} Password
 * @param {String} Email
 * @param {String} Firstname
 * @param {String} Lastname
 * @param {Boolean} IsActive
 * @param {String} PhoneNumber
 * @param {Date} LastsubscriptionDate
 * @param {String} Company_code
 * @param {String} Profile_image
 * @param {String} User_code
 * @param {String} PaymentStatus
 * @returns {Object} new user object created
 */
userSchema.statics.createUser = async function (_id, username, password, email, firstname, lastname, token) {
    try {
        const PaymentStatus = Payment_status.NONPAYMENTUSER;
        const Password = password;
        const user = await this.create({ _id, UserName: username, Password, Email: email, Firstname: firstname, Lastname: lastname, PaymentStatus, token });
        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * @param {String} id, user id
 * @return {Object} User profile object
 */
userSchema.statics.getUserById = async function (id) {
    try {
        const user = await this.findOne({ _id: id });
        if (!user) throw ({ error: 'No user with this id found!' });
        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * @return {Array} List of all users
 */
userSchema.statics.getUsers = async function () {
    try {
        const users = await this.find();
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * @param {Array} ids, string of user ids
 * @return {Array of Objects} users list
 */
userSchema.statics.getUserByIds = async function (ids) {
    try {
        const users = await this.find({ _id: { $in: ids } });
        return users;
    } catch (error) {
        throw error;
    }
}


/**
 * @param {String} id - id of user
 * @return {Object} - details of action performed
 */
userSchema.statics.deleteUserById = async function (id) {
    try {
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

userSchema.statics.deleteAllUsers = async function () {
    try {
        const result = await this.deleteMany({});
        return result;
    } catch (error) {
        throw error;
    }
}

userSchema.methods.generateVerificationToken = async function () {
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id },
        process.env.USER_VERIFICATION_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return verificationToken;
};
export default mongoose.model("User", userSchema);
