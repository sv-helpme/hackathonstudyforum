const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Extract the subject from the referer header (e.g., "math", "chem")
        const referer = req.headers.referer || '';
        const subject = referer.split('/').pop().split('.')[0]; // Get the filename without extension
        const uploadDir = `uploads/${subject}`;
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
        }
        cb(null, uploadDir); // Save files in the correct subject folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Preserve original file name
    }
});


const upload = multer({ storage: storage });

// Serve static files from the "public" folder
app.use(express.static('public'));

// Serve uploaded files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the main uploads folder exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/page1.html'));
});

// Handle file uploads from "anyth.html"
app.post('/upload', upload.array('uploadedFiles', 10), (req, res) => {
    if (req.files && req.files.length > 0) {
        const referer = req.headers.referer || '';
        const subject = referer.split('/').pop().split('.')[0]; // Extract subject (e.g., "math", "chem")
        res.redirect(`/${subject}.html`); // Redirect to the appropriate subject page
    } else {
        res.status(400).send('No files uploaded.');
    }
});


// List files in the "uploads" directory -- changed to no longer be for math
app.get('/:subject/files', (req, res) => {
    const subject = req.params.subject; // Extract subject from route
    const directoryPath = `uploads/${subject}/`;
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.status(500).send(`Unable to scan directory for ${subject}.`);
        } else {
            res.json(files); // Send the list of files as JSON
        }
    });
});


// List files in the "uploads/chem" directory
app.get('/chem/files', (req, res) => {
    const directoryPath = 'uploads/chem/';
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.status(500).send('Unable to scan directory.');
        } else {
            res.json(files);
        }
    });
});

// Download a file
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(uploadDir, 'math', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
