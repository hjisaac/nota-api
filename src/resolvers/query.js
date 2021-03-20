module.exports = {
    notes: async (parent, args, { models }) => {
        return await models.Note.find();
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
    }
}