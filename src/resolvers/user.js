module.exports = {
    // resolve notes list for a user when requested
    notes: async (user, args, { models }) => {
        return await models.Note.find(
            { author: user._id },
        ).sort(
            { _id: -1 }
        );
    },
    // resolve a favorites notes list for a user when requested
    favorites: async (user, args, { models }) => {
        return await models.Note.find(
            { favoritedBy: user._id }
        ).sort(
            { _id: -1 }
        );
    }
}