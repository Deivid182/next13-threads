import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String
  },
  image: {
    type: String
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread'
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  timestamps: true
})

const Community = mongoose.models.Community || mongoose.model('Community', communitySchema);

export default Community

