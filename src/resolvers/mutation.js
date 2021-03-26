const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { AuthenticationError, ForbiddenError } = require("apollo-server-express");

const env = require("../../env")
const gravatar = require("../util/gravatar");

module.exports = {
    createNote: async (parent, args, { models, userInformation }) => {
        // check for user information in the context
        if(!userInformation) {
            throw new AuthenticationError("Error- You must sign in to create a note");
        }
        return await models.Note.create({
            content: args.content,
            author: mongoose.Types.ObjectId(userInformation.id)
        });
    },
    updateNote: async (parent, { content, id }, { models, userInformation }) => {

        // userInformation must exists if that user has signed in
        if(!userInformation) {
            throw new AuthenticationError("Error- Sign in first before deleting note");
        }

        // find the note having id
        const note = await models.Note.findById(id);
        // check if current signed in user is the ower of the @note
        if(note && String(note.author) !== userInformation.id) {
            throw new ForbiddenError("Error- You don't have note deletion permission");
        }        

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
    deleteNote: async (parent, { id }, { models, userInformation }) => {
        // userInformation must exists if that user has signed in
        if(!userInformation) {
            throw new AuthenticationError("Error- Sign in first before deleting note");
        }

        // find the note having id
        const note = await models.Note.findById(id);
        // check if current signed in user is the ower of the @note
        if(note && String(note.author) !== userInformation.id) {
            throw new ForbiddenError("Error- You don't have note deletion permission");
        }

        let isDelected = false;

        try {
            await note.remove();
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
        
        try {
            const user = await models.User.create(
                {
                    username,
                    email,
                    avatar,
                    password: hashedPassword
                }
            );
            return jwt.sign({ id: user._id }, env.jwt_token);
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

        return jwt.sign({ id: user._id }, env.jwt_token);
    },
    toggleFavorite: async (parent, { id }, { models, userInformation }) => {
        if(!userInformation) {
            throw new AuthenticationError("Error- Sign in first");
        }
        const note = await models.Note.findById(id);
        // check if the current user has already favorited this note 
        const  userIndex = note.favoritedBy.indexOf(userInformation.id);
        if(userIndex >= 0) {
            // if the user exists, remove him from the this note favorited user and 
            // reduce the favoriteCount attribute (value) by 1
            console.log("pulling the user from *list with");
            console.log("\t favorited.by =", note.favoritedBy);
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(userInformation.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                // setting new to true allow to return the updated document
                { new: true }
            );
        } else {
            // if the user is not in this note's favorited user list, add him to that list
            // and increment the favoriteCount attribute (value) by 1
            console.log("pushing the user to that list with");
            console.log("\t favorited.by =", note.favoritedBy);
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(userInformation.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                { new: true }
            );
        }
    }
};
