const mongoose = require('mongoose');
const StoryNode = require('./StoryNode.js');

// Connect to MongoDB
mongoose.connect('mongodb+srv://roshr:VP6vOrMOZ5uKzMNw@project1.r2d67.mongodb.net/project1?retryWrites=true&w=majority&appName=project1');

const storyNodes = [
    {
        id: '95',
        perspective: 'Assassin',
        text: `You watch the battle unfold around you, standing at the Crime Lord’s side. The heir is distracted, their back exposed. This is your moment.
Without hesitation, you strike. Your blade pierces the heir’s side, a fatal blow. They turn, shock and betrayal clear in their eyes. "You..." the heir gasps, falling to their knees. They struggle to speak, but the life is already fading from them.
The Crime Lord steps forward, placing a hand on your shoulder. "Well done. Victory is ours."
You look down at the heir’s lifeless body, knowing there is no turning back now.`,
        choices: [
          {
            option: 'End of Story',
            nextNode: '106'
          }
        ]
      },
      {
        id: '96',
        perspective: 'Assassin',
        text: `Even as the Crime Lord offers you power and wealth, your loyalty never wavers. The heir has been good to you, and you will not betray them.
In the heat of the battle, you stand at the heir’s side, fighting off wave after wave of enforcers. One by one, they fall to your blade. The heir, glancing at you, nods in approval. "I knew I could trust you."
As the final enemy falls, you both stand victorious. "To the end," you say, and the heir smiles. "To the end."`,
        choices: [
          {
            option: 'End of Story',
            nextNode: '106'
          }
        ]
      },
      {
        id: '97',
        perspective: 'Heir',
        text: `You stand before the council, your voice strong as you speak of loyalty and honor. The room is silent as they listen, the weight of your words sinking in.
"Enough blood has been spilled," you say, meeting each of their gazes. "It’s time to fight for something greater—something that will last."
Though the council is divided, enough of them nod in agreement. With their support, you turn toward the battlefield, ready for the final confrontation. "This is it," you whisper to yourself. "One last stand."`,
        choices: [
          {
            option: 'Lead the Charge Yourself',
            nextNode: '100'
          },
          {
            option: 'Trust the Assassin',
            nextNode: '104'
          }
        ]
      },
      {
        id: '98',
        perspective: 'Heir',
        text: `When your words fail to sway the council, you resort to fear. "You’ve seen what I’m capable of," you say, your voice cold. "Cross me, and you’ll wish you hadn’t."
The room is thick with tension as you remind them of your past victories, the power you hold. Slowly, they bow their heads, fear etched in their expressions.
"You will follow me," you declare, "or you’ll face the consequences." The council murmurs their agreement, cowed into submission.`,
        choices: [
          {
            option: 'End of Story',
            nextNode: '106'
          }
        ]
      },
      {
        id: '99',
        perspective: 'Kingpin',
        text: `The heir’s body lies before you, struck down by the assassin’s blade. You stand victorious, the weight of your triumph settling in.
The council, having witnessed the fall of the heir, approaches cautiously. One by one, they kneel. "We submit to your rule."
You smile. "Good. The underworld is mine."`,
        choices: [
          {
            option: 'End of Story',
            nextNode: '106'
          }
        ]
      },
      {
        id: '100',
        perspective: 'Heir',
        text: `With a single, decisive strike, you take down the Crime Lord. They collapse at your feet, their power crumbling before you.
The battlefield is silent as their forces scatter, realizing their leader has fallen. The council watches, impressed by your strength and leadership. One by one, they swear their loyalty to you.
"The underworld is yours," they declare, and you know you’ve won.`,
        choices: [
          {
            option: 'End of Story',
            nextNode: '106'
          }
        ]
      },
      {
        id: '101',
        perspective: 'Heir',
        text: `The Crime Lord’s trap has failed. You outwit their final gambit, turning their own strategy against them. In a single blow, you defeat them.
As the Crime Lord falls, the balance of power shifts entirely to you. The council, witnessing your victory, declares you the rightful ruler of the underworld.`,
        choices: [
          {
            option: 'End of Story',
            nextNode: '106'
          }
        ]
      },
      {
        id: '102',
        perspective: 'Kingpin',
        text: `You’ve known the faction leader was plotting against you for some time. Before they can act, you strike first, eliminating them before their betrayal can unfold.
As their body hits the floor, you wipe the blood from your blade. "No more threats from within," you mutter.`,
        choices: [
          {
            option: 'Consolidate Power Quickly',
            nextNode: '103'
          },
          {
            option: 'Let Things Cool Down',
            nextNode: '104'
          }
        ]
      },
      {
        id: '103',
        perspective: 'Kingpin',
        text: `With the faction leader dead, their followers quickly fall into line. No one dares challenge your authority now. You rule the underworld with an iron fist, and no one can oppose you.`,
        choices: [
          {
            option: 'End of Story',
            nextNode: '106'
          }
        ]
      },
      {
        id: '104',
        perspective: 'Assassin',
        text: `You lead the charge against the Crime Lord’s enforcers, your strikes swift and deadly. Every move is calculated, and with each blow, the enemy’s numbers dwindle.
As the last enforcer falls, you stand beside the heir, victorious. "It’s over," the heir says, and you nod. "We’ve won."`,
        choices: [
          {
            option: 'End of Story',
            nextNode: '106'
          }
        ]
      },
      {
        id: '105',
        perspective: 'Both',
        text: `After countless battles, both you and the Crime Lord realize that victory comes at too high a cost. You meet in secret, neither willing to push for total domination.
"Perhaps we’ve had enough," the Crime Lord suggests, a hint of weariness in their voice. You nod, feeling the same exhaustion. "A truce, then."
The underworld is divided, an uneasy peace settled between you. Though neither of you reigns supreme, the bloodshed finally ends.`,
        choices: [
          {
            option: 'End of Story',
            nextNode: '106'
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
