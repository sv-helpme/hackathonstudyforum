const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
    }
});

const upload = multer({ storage: storage });

// Serve an HTML form for file upload
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle multiple file uploads
app.post('/upload', upload.array('uploadedFiles', 10), (req, res) => { // Allow up to 10 files
    if (req.files && req.files.length > 0) {
        const uploadedFileNames = req.files.map(file => file.filename);
        res.send(`Files uploaded successfully: ${uploadedFileNames.join(', ')}`);
    } else {
        res.status(400).send('No files uploaded.');
    }
});

// Ensure the uploads folder exists
const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// index.html
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Upload</title>
</head>
<body>
    <h1>Upload Files</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="uploadedFiles" multiple />
        <button type="submit">Upload</button>
    </form>
</body>
</html>
`;
fs.writeFileSync('index.html', htmlContent);
