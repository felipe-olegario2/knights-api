import { Schema } from 'mongoose';

export const KnightSchema = new Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  birthday: { type: String, required: true },
  weapons: [
    {
      name: String,
      mod: Number,
      attr: String,
      equipped: Boolean,
    },
  ],
  attributes: {
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
  },
  keyAttribute: { type: String, required: true },
  isHero: { type: Boolean, default: false },
});
