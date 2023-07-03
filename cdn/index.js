const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const sharp = require('sharp');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());
app.use(cors('*'));

function checkAPIKey(req, res, next) {
    const apiKey = req.headers['api-key'];

    if (apiKey !== 'rP3T4X2bwO9Y6jU7dFqE1cL5iG8vN0zMnBhKlS') {
        return res.status(401).json({ message: 'Invalid API key' });
    }
    next();
}

// File upload endpoint
app.post('/upload', checkAPIKey, (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }
  
    // Access the uploaded file using req.files.file
    const file = req.files.file;
  
    // Generate a unique filename using UUID and timestamp
    const uniqueFilename = `${uuidv4()}_${Date.now()}`;
  
  
    // Convert the file to JPEG using sharp
    const convertedFile = sharp(file.data).jpeg();
  
    // Construct the complete unique file path with extension
    const uploadPath = path.join(__dirname, 'media', `${uniqueFilename}.jpg`);
  
    // Save the converted file
    convertedFile
        .toFile(uploadPath)
        .then(() => {
            res.status(200).json({ message: 'File uploaded and converted successfully', url: `/media/${uniqueFilename}.jpg`, success: true });
        })
        .catch((err) => {
            return res.status(500).json({ message: 'Error occurred while uploading the file' });
        });
  });
  
  // File download endpoint
app.get('/media/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'media', filename);
  
    // Send the file as a download attachment
    res.download(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'File not found' });
            }
            return res.status(500).json({ message: 'Error occurred while downloading the file' });
        }
    });
});

// File delete endpoint
app.delete('/media/:filename', checkAPIKey, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'media', filename);
  
    // Delete the file
    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'File not found' });
            }
            return res.status(500).json({ message: 'Error occurred while deleting the file' });
        }
    
        res.json({ message: 'File deleted successfully' });
    });
});

app.listen(3002, () => {
    console.log('Server is running on port 3002');
});
