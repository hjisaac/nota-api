const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthenticationError, ForbiddenError } = require("apollo-server-express");

require("dotenv").config();
const gravatar = require("../util/gravatar");

module.exports = {
    createNote: async (parent, args, { models }) => {
        return await models.Note.create({
            content: args.content,
            author: "Foo Bar"
        });
    },
    updateNote: async (parent, { content, id }, { models }) => {
        return await models.Note.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
    },
    deleteNote: async (parent, { id }, { models }) => {
        let isDelected = false;
        try {
            await models.Note.findOneAndRemove({ _id: id });
            isDelected = true;
        } catch (error) {
            console.log(error);
        }
        return isDelected;
    } ,
    signUp: async (parent, { username, email, password }, { models }) => {
        email = email.trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatar = gravatar(email);
        console.log("avatar: ", avatar);
        try {
            const user = await models.User.create(
                {
                    username,
                    email,
                    avatar,
                    password: hashedPassword
                }
            );
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        } catch (error) {
            console.log(error);
            throw new Error("Error- Account creation failed");
        }
    },
    signIn: async (parent, { username, email, password }, { models }) => {
        if(email) {
            email = email.trim().toLowerCase();
        }
        const user = await models.User.findOne(
            {
                $or: [
                    { email },
                    { username }
                ]
            }
        );

        if(!user) {
            throw new AuthenticationError("Error- Sign-in failed");
        }

        const isValid = await bcrypt.compare(password, user.password);
        
        if(!isValid) {
            throw new AuthenticationError("Error- Sign-in failed, check your pass")
        }

        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    }
};
