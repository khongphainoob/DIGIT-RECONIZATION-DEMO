const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const predictButton = document.getElementById('predict');
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
let isDrawing = false;
clearButton.addEventListener('click', clearCanvas);
predictButton.addEventListener('click', predict);
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
    if(!isDrawing) return;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 8, 0, Math.PI*2.5);
    ctx.fill();
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function predict() {
    alert('JS loaded');
    const dataURL = canvas.toDataURL('image/png');
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: dataURL })
    })
   .then(response => response.json())
   .then(data => {
     console.log('Prediction result:', data);
        // Display the predicted digit and confidence
    document.getElementById('preview').src = 'data:image/png;base64,' + data.processed_image;
    document.getElementById('result').innerText = 
        `Predicted Digit: ${data.digit} (Confidence: ${data.confidence}%)`;
    })
    .catch(error => console.error('Error:', error));
}