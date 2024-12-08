
import { Router } from "express";
import { changeOrder, changePassword, deleteImage, editImage, getImages, UploadImages, userLogin, userRegister } from "../controller/userController.js";
import userAuthMiddleware from "../middileware/userAuthMiddileware.js";
import multipleImageUpload, { singleImageUpload } from "../config/multer.js";

const router = Router()


router.post('/register',userRegister)
router.post('/login',userLogin)
router.post('/changePassword',userAuthMiddleware,changePassword)
router.post('/upload-images',userAuthMiddleware,multipleImageUpload,UploadImages)
router.get('/getImages',userAuthMiddleware,getImages)
router.put('/updateImage/:imageId',userAuthMiddleware,singleImageUpload,editImage)
router.delete('/deleteImage/:imageId',userAuthMiddleware,deleteImage)
router.put('/updateImageOrder',userAuthMiddleware,changeOrder)


export default router