const imageUpload = document.getElementById('image-upload');
const uploadedImage = document.getElementById('uploaded-image');
const predictButton = document.getElementById('predict-button');
const predictionResult = document.getElementById('prediction');
const loadingDiv = document.getElementById('loading');

let model, maxPredictions;

// Teachable Machine model URL
const URL = "https://teachablemachine.withgoogle.com/models/w8H3e3Z5G/";

// Load the model
async function loadModel() {
    loadingDiv.style.display = 'block';
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        loadingDiv.style.display = 'none';
        console.log('Teachable Machine model loaded successfully!');
    } catch (err) {
        console.error('Failed to load Teachable Machine model', err);
        predictionResult.innerText = 'Failed to load model. Please try again.';
        loadingDiv.style.display = 'none';
    }
}

// Immediately start loading the model when the script runs
loadModel();

// Handle image upload
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

// Handle prediction
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
        // Predict with the image
        const prediction = await model.predict(uploadedImage);

        let dogPrediction = { className: 'Dog', probability: 0 };
        let catPrediction = { className: 'Cat', probability: 0 };

        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = prediction[i];
            if (classPrediction.className.toLowerCase().includes('dog')) {
                dogPrediction = classPrediction;
            } else if (classPrediction.className.toLowerCase().includes('cat')) {
                catPrediction = classPrediction;
            }
        }

        if (dogPrediction.probability > catPrediction.probability) {
            predictionResult.innerText = `You look like a Dog! 🐶 (Confidence: ${Math.round(dogPrediction.probability * 100)}%)`;
        } else if (catPrediction.probability > dogPrediction.probability) {
            predictionResult.innerText = `You look like a Cat! 🐱 (Confidence: ${Math.round(catPrediction.probability * 100)}%)`;
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