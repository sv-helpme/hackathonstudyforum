//getting modules
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

//setting up server thing
const app = express();
const port = 3000;

// configure/sort files -- save them in correct folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const referer = req.headers.referer || '';
        const subject = referer.split('/').pop().split('.')[0]; 
        const uploadDir = `uploads/${subject}`;
        
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => { //to keep file name same
        cb(null, file.originalname); 
    }
});
const upload = multer({ storage: storage });

// makes "public" and "uploads" files available to ppl using server
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// first page when u get onto server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/page1.html'));
});

// file uploads messaging
app.post('/upload', upload.array('uploadedFiles', 10), (req, res) => {
    if (req.files && req.files.length > 0) {
        const referer = req.headers.referer || '';
        const subject = referer.split('/').pop().split('.')[0]; 
        res.redirect(`/${subject}.html`); // this part is sort of to keep u back on the same page as per subject (hence var subject line above)
    } else {
        res.status(400).send('No files uploaded.');
    }
});


// get the file names for "uploads/math" directory in an array to list
app.get('/math/files', (req, res) => {
    const directoryPath = 'uploads/math/';
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.status(500).send('Unable to scan directory.');
        } else {
            res.json(files);
        }
    });
});


// same thing but for "uploads/chem"
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

// "uploads/econ"
app.get('/econ/files', (req, res) => {
    const directoryPath = 'uploads/econ/';
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.status(500).send('Unable to scan directory.');
        } else {
            res.json(files);
        }
    });
});

// "uploads/eng"
app.get('/eng/files', (req, res) => {
    const directoryPath = 'uploads/eng/';
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.status(500).send('Unable to scan directory.');
        } else {
            res.json(files);
        }
    });
});

// download files
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(uploadDir, 'math', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found.');
    }
});

app.listen(port, () => {
    console.log(`server running!!! <3 http://localhost:${port}`);
});
