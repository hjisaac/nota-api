module.exports = {
    // resolve the user information for some note when requested
    author:  async (note, args, { models }) => {
            return await models.User.findById(note.author);
    },
    // resolve the favoritedBy for some note when requested
    favoritedBy: async (note, args, { models }) => {
        return await models.User.find(
            {
               _id: {
                   $in: note.favoritedBy
               }
            }
        );
    }
}