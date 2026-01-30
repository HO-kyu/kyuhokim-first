const webcamMode = document.getElementById('webcam-mode');
const uploadMode = document.getElementById('upload-mode');
const webcamContainer = document.getElementById('webcam-container');
const labelContainer = document.getElementById('label-container');
const imageUpload = document.getElementById('image-upload');
const uploadedImage = document.getElementById('uploaded-image');
const loadingDiv = document.getElementById('loading');

const URL = "https://teachablemachine.withgoogle.com/models/w8H3e3Z5G/";
let model, webcam, maxPredictions;

// --- INITIALIZATION ---

// Load the model
async function loadModel() {
    loadingDiv.style.display = 'block';
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (err) {
        console.error("Model loading failed:", err);
        alert("Failed to load the model. Please check the console for details.");
    } finally {
        loadingDiv.style.display = 'none';
    }
}
// Load model as soon as the page loads
window.onload = loadModel;

// --- MODE SWITCHING ---

document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.value === 'webcam') {
            webcamMode.style.display = 'block';
            uploadMode.style.display = 'none';
            if (webcam && webcam.running) webcam.stop(); // Stop webcam if running
            labelContainer.innerHTML = '';
        } else {
            webcamMode.style.display = 'none';
            uploadMode.style.display = 'block';
            if (webcam && webcam.running) webcam.stop(); // Stop webcam if running
            labelContainer.innerHTML = '';
        }
    });
});

// --- WEBCAM LOGIC ---

// Setup and start the webcam
async function initWebcam() {
    if (!model) {
        alert("Model not loaded yet. Please wait.");
        return;
    }
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    try {
        await webcam.setup();
        await webcam.play();
        webcamContainer.innerHTML = ''; // Clear previous canvas
        webcamContainer.appendChild(webcam.canvas);
        window.requestAnimationFrame(loop);
    } catch (err) {
        console.error("Webcam setup failed:", err);
        alert("Could not access the webcam. Please ensure it's not in use and permissions are allowed.");
    }
}

async function loop() {
    if (webcam.running) {
        webcam.update();
        await predictFromWebcam();
        window.requestAnimationFrame(loop);
    }
}

async function predictFromWebcam() {
    const prediction = await model.predict(webcam.canvas);
    displayPrediction(prediction);
}


// --- UPLOAD LOGIC ---

imageUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!model) {
        alert("Model not loaded yet. Please wait.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = 'block';
        // Predict from the uploaded image
        const prediction = await model.predict(uploadedImage);
        displayPrediction(prediction);
    };
    reader.readAsDataURL(file);
});


// --- SHARED PREDICTION DISPLAY LOGIC ---

function displayPrediction(prediction) {
    // Guard clause for empty predictions
    if (!prediction || prediction.length === 0) {
        labelContainer.innerHTML = "Could not get a prediction. Try a different image or angle.";
        return;
    }

    let highestProb = 0;
    let bestClass = '';

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            bestClass = prediction[i].className;
        }
    }

    let emoji = '';
    if (bestClass.toLowerCase().includes('dog')) {
        emoji = '🐶';
    } else if (bestClass.toLowerCase().includes('cat')) {
        emoji = '🐱';
    }

    labelContainer.innerHTML = `You look like a ${bestClass}! ${emoji} (Confidence: ${Math.round(highestProb * 100)}%)`;
}
