const mongoose = require('mongoose');
const StoryNode = require('./StoryNode.js');

// Connect to MongoDB
mongoose.connect('mongodb+srv://roshr:VP6vOrMOZ5uKzMNw@project1.r2d67.mongodb.net/project1?retryWrites=true&w=majority&appName=project1');

const storyNodes = [
  {
    "id": "111",
    "perspective": "Detective",
    "text": "As Vera hesitates, you see a glimpse of uncertainty. Her resolve is faltering, and you sense that this might be the opportunity you've been waiting for. She glances down, almost considering surrender.",
    "choices": [
      {
        "option": "Encourage her to surrender, appealing to any shred of humanity left",
        "nextNode": "130"
      },
      {
        "option": "Exploit her hesitation to restrain her",
        "nextNode": "131"
      }
    ]
  },
  {
    "id": "112",
    "perspective": "Detective",
    "text": "Pushing forward, you edge closer to ending the conflict. Shots echo in the tense silence, with each one bringing you nearer to the inevitable confrontation.",
    "choices": [
      {
        "option": "Attempt a final arrest",
        "nextNode": "132"
      },
      {
        "option": "Demand that she calls off her guards",
        "nextNode": "133"
      }
    ]
  },
  {
    "id": "113",
    "perspective": "Detective",
    "text": "You quickly retreat, realizing the danger is overwhelming. This fight is too big to tackle alone, but you now have crucial information that could bring Vera down.",
    "choices": [
      {
        "option": "Head to the department to regroup",
        "nextNode": "134"
      },
      {
        "option": "Contact Alex for possible help",
        "nextNode": "135"
      }
    ]
  },
  {
    "id": "114",
    "perspective": "Detective",
    "text": "After gathering reinforcements, you and your team stand ready to bring Vera’s network to its knees. The air buzzes with anticipation as you give the signal.",
    "choices": [
      {
        "option": "Lead a final assault on her last safehouse",
        "nextNode": "136"
      },
      {
        "option": "Lay a trap to draw her out",
        "nextNode": "137"
      }
    ]
  },
  {
    "id": "115",
    "perspective": "Detective",
    "text": "Considering all your options, you realize a direct confrontation may not be the best approach. Perhaps there’s another way to take down her empire.",
    "choices": [
      {
        "option": "Find and exploit her financial backers",
        "nextNode": "138"
      },
      {
        "option": "Attempt to turn one of her key lieutenants",
        "nextNode": "139"
      }
    ]
  },
  {
    "id": "116",
    "perspective": "Detective",
    "text": "With your team ready, you make a decisive move against Vera’s headquarters. The operation is swift and effective, bringing down several of her operatives.",
    "choices": [
      {
        "option": "Confront Vera personally",
        "nextNode": "140"
      },
      {
        "option": "Focus on dismantling the organization from within",
        "nextNode": "141"
      }
    ]
  },
  {
    "id": "117",
    "perspective": "Detective",
    "text": "You carefully lay a sting operation, setting the trap to lure Vera out of hiding. As the plan unfolds, every second feels like a lifetime.",
    "choices": [
      {
        "option": "Prepare for her arrival, hoping to negotiate",
        "nextNode": "142"
      },
      {
        "option": "Ensure all exits are blocked for a swift capture",
        "nextNode": "143"
      }
    ]
  },
  {
    "id": "118",
    "perspective": "Detective",
    "text": "Alone and determined, you confront Vera in her lair. She greets you with a mixture of surprise and disdain, sizing you up as if deciding whether you’re worth her time.",
    "choices": [
      {
        "option": "Appeal to her sense of loyalty to Blackwater",
        "nextNode": "144"
      },
      {
        "option": "Demand she surrender, leaving no room for negotiation",
        "nextNode": "145"
      }
    ]
  },
  {
    "id": "119",
    "perspective": "Detective",
    "text": "Setting up a trap, you leave hints for Vera to lure her into a false sense of security. It's a dangerous game, but if successful, it could mean an end to her reign.",
    "choices": [
      {
        "option": "Wait for her arrival and prepare for an ambush",
        "nextNode": "146"
      },
      {
        "option": "Alert your allies for backup",
        "nextNode": "147"
      }
    ]
  },
  {
    "id": "120",
    "perspective": "Detective",
    "text": "As you push for details on her motives, Vera’s mask of indifference cracks slightly. You sense there’s a personal reason behind her actions, buried deep.",
    "choices": [
      {
        "option": "Probe deeper, trying to understand her motivations",
        "nextNode": "148"
      },
      {
        "option": "Leverage her motives against her",
        "nextNode": "149"
      }
    ]
  },
  {
    "id": "121",
    "perspective": "Detective",
    "text": "Your threat hangs in the air, and for a moment, Vera's calm exterior wavers. 'Exposing my network would be your last mistake,' she says, almost as a warning.",
    "choices": [
      {
        "option": "Press her, refusing to back down",
        "nextNode": "150"
      },
      {
        "option": "Change tactics and offer her a way out",
        "nextNode": "151"
      }
    ]
  },
  {
    "id": "122",
    "perspective": "Detective",
    "text": "Prepared for her retaliation, you brace yourself. She seems almost impressed by your resilience. A silent, dangerous standoff begins.",
    "choices": [
      {
        "option": "Draw your weapon, prepared for a final showdown",
        "nextNode": "152"
      },
      {
        "option": "Attempt one last time to reason with her",
        "nextNode": "153"
      }
    ]
  },
  {
    "id": "123",
    "perspective": "Detective",
    "text": "You give Vera one final warning. She smirks, clearly unfazed. 'Warnings won’t save you,' she says, her eyes gleaming with a dark promise.",
    "choices": [
      {
        "option": "Engage in a final confrontation",
        "nextNode": "154"
      },
      {
        "option": "Call for backup, anticipating a struggle",
        "nextNode": "155"
      }
    ]
  },
  {
    "id": "124",
    "perspective": "Detective",
    "text": "As you close in on Vera, she realizes there’s nowhere left to run. Her shoulders slump slightly, resignation settling into her expression.",
    "choices": [
      {
        "option": "Arrest her, feeling a strange sense of closure",
        "nextNode": "156"
      },
      {
        "option": "Allow her a final word before taking her in",
        "nextNode": "157"
      }
    ]
  },
  {
    "id": "125",
    "perspective": "Detective",
    "text": "You offer her one last chance to surrender. Vera’s eyes narrow, her mind clearly racing as she contemplates the end of her empire.",
    "choices": [
      {
        "option": "She surrenders willingly, accepting defeat",
        "nextNode": "156"
      },
      {
        "option": "She lashes out, refusing to go down without a fight",
        "nextNode": "154"
      }
    ]
  },
  {
    "id": "126",
    "perspective": "Detective",
    "text": "Standing your ground, you manage to fend off her guards. You’re bruised but determined, with Vera in your sights.",
    "choices": [
      {
        "option": "Move in to finally apprehend her",
        "nextNode": "124"
      },
      {
        "option": "Signal to your team for backup",
        "nextNode": "155"
      }
    ]
  },
  {
    "id": "127",
    "perspective": "Detective",
    "text": "Retreating tactically, you find a brief moment to regroup and assess. Vera’s forces seem to be dwindling, and victory is within reach.",
    "choices": [
      {
        "option": "Launch a final offensive",
        "nextNode": "154"
      },
      {
        "option": "Consider negotiating a truce",
        "nextNode": "153"
      }
    ]
  }
];

// Insert multiple story nodes
StoryNode.insertMany(storyNodes)
  .then(() => {
    console.log('Multiple story nodes inserted successfully');
    mongoose.connection.close();  // Close the connection after saving
  })
  .catch((err) => {
    console.error('Error inserting story nodes:', err);
  });
