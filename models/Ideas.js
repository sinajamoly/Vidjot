const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        details: Date.now
    }
});

mongoose.model('ideas', IdeaSchema);