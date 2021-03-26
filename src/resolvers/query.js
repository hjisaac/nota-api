const { model } = require("../models/note");

module.exports = {
    notes: async (parent, args, { models }) => {
        return await models.Note.find().limit(100);
    },
    note: async (parent, args, { models }) => {
        return await models.Note.findById(args.id);
    },
    user: async (parent, { username }, { models }) => {
        return await models.User.findOne(
            { username }
        );
    },
    users: async (parent, args, { models }) => {
        return await models.User.find({ });
    },
    me: async (parent, args, { models, userInformation }) => {
        // find a user given the curent user context
        return await models.User.findById(userInformation.id);
    },
    noteFeed: async (parent, { cursor }, { models }) => {
        // harcode the limit of item to 10
        const limit = 10;
        let hasNext = false;
        let cursorQueryCondition = {};
        // if there is a cursor
        if(cursor) {
            cursorQueryCondition = {
                _id: { $lt: cursor }
            }
        }

        // find the limit+1 in the db DESC 
        let notes = await (
            models
            .Note
            .find(cursorQueryCondition)
            .sort(
                { _id: -1 }
            )
            .limit(limit+1)
        );

        // if the number of notes we find exceeds our limit set hasNext to true 
        // and trim the @notes to the limit
        if(notes.length > limit) {
            hasNext = true;
            // take the n-th first elements
            notes = notes.slice(0, -1);
        }
        // the new cursor will be the id of the last note
        const newCursor = (notes[notes.length - 1])._id;
        
        return {
            notes, 
            cursor: newCursor,
            hasNext
        };
    }
}