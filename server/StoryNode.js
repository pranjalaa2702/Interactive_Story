const mongoose = require('mongoose');

const StoryNodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  choices: [
    {
      text: { type: String, required: true },
      nextNode: { type: String, required: true }
    }
  ]
});

const StoryNode = mongoose.model('StoryNode', StoryNodeSchema);

module.exports = StoryNode;
