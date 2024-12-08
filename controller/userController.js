import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../util/token.js";
import cloudinary from "../config/cloudinary.js";
import Image from "../models/imageModel.js";

export const userRegister = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        let user = await User.findOne({email})
        if(user){
            return res.status(403).json({message:"email exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10); 
        const userData = new User({
            name: username,
            email,
            phone,
            password: hashedPassword, 
        });
        await userData.save();
        user = await User.findOne({email})
        const accessToken =  generateToken(user._id)    
        res.status(200).json({ message: "Success" ,accessToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        user = await User.findOne({email})
        let accessToken =  generateToken(user._id)
        res.status(200).json({ message: "Login successful",accessToken, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const changePassword = async (req, res) => {
    try {
        const { oldPassword,newPassword } = req.body;
        const {_id} = req.user
        const userData = await User.findById(_id)
        const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);
        if(!isPasswordValid){
            return res.status(403).json({ message: "Old password is incorrect" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10); 
        userData.password = hashedPassword
        await userData.save()
        res.status(200).json({message:"Success"})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const UploadImages = async (req, res) => {
    try {
        const { titles } = req.body; 
        const { _id } = req.user; 
        const files = req.files;   
        const maxOrderDoc = await Image.find({ userId: _id }).sort({ order: -1 }).limit(1);
        let currentOrder = maxOrderDoc.length ? maxOrderDoc[0].order : 0;
        const uploadedData = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const title = titles[i];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'mentor_profiles',
            });
            currentOrder += 1;
            uploadedData.push({
                userId: _id,
                title,
                image: result.secure_url,
                order: currentOrder,
            });
        }
        await Image.insertMany(uploadedData);
        res.status(200).json({
            message: "Images uploaded and saved successfully",
            data: uploadedData,
        });
    } catch (error) {
        console.error("Error uploading images:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};




export const getImages = async (req, res) => {
    try {
        const {_id} = req.user
        const imagesData = await Image.find({userId:_id})
        res.status(200).json({message:"Success",images:imagesData})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const editImage = async (req, res) => {
    try {        
        const { imageId } = req.params;
        const { title } = req.body;        
        let imageUrl;
        if (!title) {
            return res.status(400).json({ message: "Title is required." });
        }
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'mentor_profiles',
            });
            imageUrl = result.secure_url;
        }
        const imageData = await Image.findById(imageId);
        if (!imageData) {
            return res.status(404).json({ message: "Image not found." });
        }
        imageData.title = title;
        if (imageUrl) {
            imageData.image = imageUrl; 
        }
        await imageData.save();

        return res.status(200).json({ message: "Image updated successfully.", imageUrl: imageUrl });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const deleteImage = async (req, res) => {
    try {
        const imageId = req.params.imageId
        await Image.findByIdAndDelete({_id:imageId})
        res.status(200).json({message:"Success"})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const changeOrder = async (req, res) => {
    try {        
        const  imagesOrder  = req.body.images; 
        if (!imagesOrder || !Array.isArray(imagesOrder)) {
            return res.status(400).json({ message: "Invalid request data. Ensure imagesOrder array is provided" });
        }
        const userId = req.user._id
        const images = await Image.find({ userId });
        if (!images.length) {
            return res.status(404).json({ message: "No images found for the given user" });
        }
        for (const { _id, order } of imagesOrder) {
            const image = images.find(img => img._id.toString() === _id);

            if (image) {
                image.order = order;
                await image.save(); 
            }
        }
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
