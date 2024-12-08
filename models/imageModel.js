import mongoose from "mongoose";


const imageSchema = new mongoose.Schema({
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true 
    },
    title: 
    { 
        type: String, 
        required: true 
    },
    image: 
    { 
        type: String, 
        required: true 
    },
    order: { 
        type: Number, 
        required: true,
        default: 0 
    },
    createdAt: 
    { 
        type: Date, 
        default: Date.now 
    }
});

const Image = mongoose.model('Image', imageSchema);

export default Image