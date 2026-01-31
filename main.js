const uploadMode = document.getElementById('upload-mode');
const labelContainer = document.getElementById('label-container');
const imageUpload = document.getElementById('image-upload');
const uploadedImage = document.getElementById('uploaded-image');
const loadingDiv = document.getElementById('loading');

const URL = "https://teachablemachine.withgoogle.com/models/u1uI_WuzB/";
let model, maxPredictions;

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
        console.error("모델 로딩 실패:", err);
        alert("모델을 불러오는데 실패했습니다. 콘솔을 확인해주세요.");
    } finally {
        loadingDiv.style.display = 'none';
    }
}
// Load model as soon as the page loads
window.onload = loadModel;

// --- UPLOAD LOGIC ---

imageUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!model) {
        alert("모델이 아직 로드되지 않았습니다. 잠시만 기다려주세요.");
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
        labelContainer.innerHTML = "예측할 수 없습니다. 다른 이미지를 시도해보세요.";
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
    let animalName = '';
    if (bestClass.toLowerCase().includes('dog')) {
        emoji = '🐶';
        animalName = '강아지';
    } else if (bestClass.toLowerCase().includes('cat')) {
        emoji = '🐱';
        animalName = '고양이';
    } else {
        animalName = bestClass;
    }

    labelContainer.innerHTML = `당신은 ${animalName}상 입니다! ${emoji} (정확도: ${Math.round(highestProb * 100)}%)`;
}