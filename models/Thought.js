const { Schema, model } = require('mongoose');

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
    },
    reactionBody: {
        type: Schema.Types.String,
        required: true,
        max_length: 280,
    },
    username: {
        type: Schema.Types.String,
        required: true,
    }, 

}, {
      timestamps: true,
});


const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            min_length: 1,
            max_length: 208,
            trim: true,
        },
        username: {
                type: String,
                required: true,
        },
        reactions: [reactionSchema],
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
        },
    }
);

thoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
})

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;