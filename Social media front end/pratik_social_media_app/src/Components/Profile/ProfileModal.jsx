import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { UpdateProfileAction } from '../../Redux/Auth/auth.action';
import { Avatar, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import { Stack } from '@mui/material';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    outline: "none",
    borderRadius: 3
};

export default function ProfileModal({ open, handleClose }) {
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const [uploading, setUploading] = React.useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: auth.user?.firstName || "",
            lastName: auth.user?.lastName || "",
            bio: auth.user?.bio || "",
            profileImage: auth.user?.profileImage || ""
        },
        onSubmit: (values) => {
            dispatch(UpdateProfileAction(values));
            handleClose();
        }
    });

    /* ================= IMAGE UPLOAD ================= */
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const imageUrl = await uploadToCloudinary(file, "image");
        formik.setFieldValue("profileImage", imageUrl);
        setUploading(false);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <form onSubmit={formik.handleSubmit} className="space-y-4">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                            <h3 className="font-semibold">Edit Profile</h3>
                        </div>
                        <Button type="submit" variant="contained">
                            Save
                        </Button>
                    </div>

                    {/* AVATAR */}
                    <div className="flex flex-col items-center gap-3">
                        <Avatar
                            src={formik.values.profileImage}
                            sx={{ width: 120, height: 120 }}
                        />

                        <Button
                            component="label"
                            variant="outlined"
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Change Photo"}
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                    </div>

                    <Stack spacing={2}>
                        {/* FIRST NAME */}
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                        />

                        {/* LAST NAME */}
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                        />

                        {/* BIO */}
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Bio"
                            name="bio"
                            value={formik.values.bio}
                            onChange={formik.handleChange}
                        />
                    </Stack>

                </form>
            </Box>
        </Modal>
    );
}
