const mongoose = require('mongoose');

const downUpVotePostUserSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    idPost: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    vote: {
        type: Number,
        required: true
    }
});

const DownUpVotePostUser = mongoose.model('DownUpVotePostUser', downUpVotePostUserSchema);

module.exports = DownUpVotePostUser;