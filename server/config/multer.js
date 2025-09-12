import multer from "multer";

/*
==> 'multer' is a middleware for handling multipart/form-data, which is primarily used for uploading files.
==> multer.diskStorage({}) configures how files are stored. Here, an empty configuration means the default settings are used (e.g., files are stored with random names in the OS default temp folder unless otherwise specified).
==> upload is the configured instance of Multer used to handle file uploads.
*/
const storage = multer.diskStorage({});

const upload = multer({ storage });

export default upload;
