import { Avatar, Backdrop, Button, CircularProgress, IconButton, Modal, Typography } from '@mui/material'
import { bgcolor, borderRadius, Box } from '@mui/system'
import { Formik, useFormik } from 'formik';
import React, { useState } from 'react'
import ImageIcon from '@mui/icons-material/Image';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { useDispatch, useSelector } from 'react-redux';
import { createPostAction } from '../../Redux/Post/post.action';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: "#2C303E", // ✅ this sets background to white   
    boxShadow: 24,
    p: 4,
    borderRadius: ".6rem",
    outline: "none"
};

const CreatePostModal = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store)
    const [selectedImage, setSelectedImage] = useState();
    const [selectedVideo, setSelectedVideo] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const handleSelectImage = async (event) => {
        setIsLoading(true)
        const imageUrl = await uploadToCloudinary(event.target.files[0], "image")
        setSelectedImage(imageUrl)
        setIsLoading(false)
        formik.setFieldValue("image", imageUrl);
    }

    const handleSelectVideo = async (event) => {
        setIsLoading(true)
        const videoUrl = await uploadToCloudinary(event.target.files[0], "video")
        setSelectedVideo(videoUrl)
        setIsLoading(false)
        formik.setFieldValue("video", videoUrl);
    }



    const formik = useFormik({
        initialValues: {
            caption: "",
            image: "",
            video: ""
        },

        onSubmit: async (values, { resetForm }) => {
            if (!values.caption && !values.image && !values.video) {
                return;
            }
            try {
                await dispatch(createPostAction(values)); // wait for success

                resetForm();            // ✅ clear inputs
                setSelectedImage(null); // ✅ clear image preview
                setSelectedVideo(null); // ✅ clear video preview
                handleClose();          // ✅ close modal
            } catch (error) {
                console.error("Post creation failed", error);
            }
        }

    });


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <div className='flex space-x-4 items-center'>
                            <Avatar src={auth.user?.profileImage} />
                            <div>
                                <p className='font-bold text-lg'>{auth.user.firstName + " " + auth.user.lastName}</p>
                                <p className='text-sm'>@{auth.user.firstName + "_" + auth.user.lastName}</p>
                            </div>
                        </div>
                        <textarea className='outline-none w-full mt-5 p-2 bg-transparent border border-[#3b4054] rounded-sm' onChange={formik.handleChange} placeholder='Write caption....' name="caption" rows={4} value={formik.values.caption}></textarea>
                        <div className='flex space-x-5 items-center mt-5 cursor-pointer'>
                            <div>
                                <input type="file" accept='image/*' onChange={handleSelectImage} style={{ display: 'none' }} id='image-input' />
                                <label htmlFor="image-input">
                                    <IconButton color='primary' component="span">
                                        <ImageIcon />
                                    </IconButton>
                                </label>
                                <span>Image</span>
                            </div>
                            <div>
                                <input type="file" accept='video/*' onChange={handleSelectVideo} style={{ display: 'none' }} id='video-input' />
                                <label htmlFor="video-input">
                                    <IconButton color='primary'>
                                        <VideoCallIcon />
                                    </IconButton>
                                </label>
                                <span>Video</span>
                            </div>
                        </div>
                        {
                            selectedImage && <div>
                                <img className='h-[10rem]' src={selectedImage} alt="" />
                            </div>
                        }
                        <div className='flex w-full justify-end'>
                            <Button disabled={isLoading} sx={{ borderRadius: "1.5rem" }} variant="contained" type="submit">Post</Button>
                        </div>
                    </div>
                </form>
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={isLoading}
                    onClick={handleClose}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </Modal>

    )
}

export default CreatePostModal
