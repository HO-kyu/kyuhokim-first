<div>Teachable Machine Image Model</div>
<button type="button" onclick="init()">Start</button>
<div id="webcam-container"></div>
<div id="label-container"></div>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"></script>
<script type="text/javascript">
    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/w8H3e3Z5G/"; // Using the hosted URL you provided earlier

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);

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
            labelContainer.childNodes[0].innerHTML = `You look like a Dog! 🐶 (Confidence: ${Math.round(dogPrediction.probability * 100)}%)`;
            labelContainer.childNodes[1].innerHTML = ''; // Clear other label
        } else if (catPrediction.probability > dogPrediction.probability) {
            labelContainer.childNodes[0].innerHTML = `You look like a Cat! 🐱 (Confidence: ${Math.round(catPrediction.probability * 100)}%)`;
            labelContainer.childNodes[1].innerHTML = ''; // Clear other label
        } else {
            labelContainer.childNodes[0].innerHTML = "Hmm, I can't seem to decide... try again!";
            labelContainer.childNodes[1].innerHTML = ''; // Clear other label
        }
    }
</script>