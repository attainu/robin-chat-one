import cloudinary from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const cloudUploader = (path) => {
    return new Promise((res, rej) => {
        cloudinary.uploader.upload(path, (info) => {
            res(info)
        });
    });
}

export default cloudUploader;