
const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/api/info', (req, res) => {
    const format = req.query.format || 'all';

    res.json({
        message: 'Press & Compress server is running.',
        requestedFormat: format
    });
});

app.post('/upload', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            error: 'Please select at least one image.'
        });
    }

    const files = req.files.map((file) => ({
        name: file.originalname,
        size: file.size
    }));

    res.json({
        message: 'Files uploaded successfully.',
        files: files
    });
});

app.get('/test-error', (req, res, next) => {
    next(new Error('Test server error'));
});

app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>The page you requested does not exist.</p>
        <a href="/">Return Home</a>
    `);
});

app.use((err, req, res, next) => {
    console.error(err.message);

    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: 'Upload failed. Check the file size and number of files.'
        });
    }

    res.status(500).send(`
        <h1>500 - Server Error</h1>
        <p>Something went wrong. Please try again.</p>
        <a href="/">Return Home</a>
    `);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('Press & Compress running on port ' + PORT);
});
