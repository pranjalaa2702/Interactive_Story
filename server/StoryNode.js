const mongoose = require('mongoose');

const StoryNodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  perspective: { type: String, required: true },
  text: { type: String, required: true },
  choices: [
    {
      option: { type: String, required: true },
      nextNode: { type: String, required: true }
    }
  ]
});

const StoryNode = mongoose.model('Story', StoryNodeSchema);

module.exports = StoryNode;
