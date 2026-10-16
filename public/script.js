
const uploadForm = document.getElementById('upload-form');
const imageInput = document.getElementById('images');
const statusMessage = document.getElementById('status');

imageInput.addEventListener('change', () => {
    const files = imageInput.files;

    if (files.length === 0) {
        statusMessage.textContent = 'No images selected.';
        return;
    }

    const names = [];

    for (let i = 0; i < files.length; i++) {
        names.push(files[i].name);
    }

    statusMessage.textContent =
        files.length + ' image(s) selected: ' + names.join(', ');
});

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (imageInput.files.length === 0) {
        statusMessage.textContent = 'Please select at least one image.';
        return;
    }

    const formData = new FormData();

    for (let i = 0; i < imageInput.files.length; i++) {
        formData.append('images', imageInput.files[i]);
    }

    statusMessage.textContent = 'Uploading images...';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Upload failed.');
        }

        const names = result.files.map((file) => file.name);

        statusMessage.textContent =
            result.message + ' Files: ' + names.join(', ');
    } catch (error) {
        statusMessage.textContent =
            'Upload failed: ' + error.message;
    }
});
