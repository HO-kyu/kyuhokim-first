const imageUpload = document.getElementById('image-upload');
const uploadedImage = document.getElementById('uploaded-image');
const predictButton = document.getElementById('predict-button');
const predictionResult = document.getElementById('prediction');
const loadingDiv = document.getElementById('loading');

let model;

// 1. Load the model
async function loadModel() {
    loadingDiv.style.display = 'block';
    try {
        model = await mobilenet.load();
        loadingDiv.style.display = 'none';
        console.log('Model loaded successfully!');
    } catch (err) {
        console.error('Failed to load model', err);
        predictionResult.innerText = 'Failed to load model. Please try again.';
        loadingDiv.style.display = 'none';
    }
}

// Immediately start loading the model when the script runs
loadModel();

// 2. Handle image upload
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = 'block';
            predictionResult.innerText = ''; // Clear previous prediction
        };
        reader.readAsDataURL(file);
    }
});

// 3. Handle prediction
predictButton.addEventListener('click', async () => {
    if (!model) {
        predictionResult.innerText = 'Model is not loaded yet. Please wait.';
        return;
    }
    if (!uploadedImage.src || uploadedImage.style.display === 'none') {
        predictionResult.innerText = 'Please upload an image first!';
        return;
    }

    loadingDiv.style.display = 'block';

    try {
        const predictions = await model.classify(uploadedImage);
        console.log('Predictions:', predictions);

        let isDog = false;
        let isCat = false;
        let dogConfidence = 0;
        let catConfidence = 0;

        predictions.forEach(p => {
            const className = p.className.toLowerCase();
            // MobileNet has many specific breeds, so we check for common terms
            if (className.includes('dog') || className.includes('canine') || className.includes('retriever') || className.includes('terrier') || className.includes('shepherd')) {
                isDog = true;
                dogConfidence = Math.max(dogConfidence, p.probability);
            }
            if (className.includes('cat') || className.includes('feline') || className.includes('tabby') || className.includes('siamese')) {
                isCat = true;
                catConfidence = Math.max(catConfidence, p.probability);
            }
        });

        if (isDog && dogConfidence > catConfidence) {
            predictionResult.innerText = `You look like a Dog! 🐶 (Confidence: ${Math.round(dogConfidence * 100)}%)`;
        } else if (isCat) {
            predictionResult.innerText = `You look like a Cat! 🐱 (Confidence: ${Math.round(catConfidence * 100)}%)`;
        } else {
            predictionResult.innerText = "Hmm, I can't seem to decide... try another photo!";
        }

    } catch (err) {
        console.error('Prediction failed', err);
        predictionResult.innerText = 'Oops, something went wrong during prediction.';
    } finally {
        loadingDiv.style.display = 'none';
    }
});
