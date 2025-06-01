const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const predictButton = document.getElementById('predict');
ctx.fillStyle = 'black';
ctx.strokeStyle = 'white'; // Màu vẽ
ctx.lineWidth = 13;
ctx.lineCap = 'round';
ctx.fillRect(0, 0, canvas.width, canvas.height);
let isDrawing = false;
clearButton.addEventListener('click', clearCanvas);
predictButton.addEventListener('click', predict);
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseleave', stopDraw);
canvas.addEventListener("touchstart", function(e) {
  e.preventDefault(); // ngăn cuộn trang
  startDraw(e);
});

canvas.addEventListener("touchmove", function(e) {
  e.preventDefault(); // ngăn cuộn trang
  draw(e);
});

canvas.addEventListener("touchend", function(e) {
  e.preventDefault();
  stopDraw();
});

function getPos(e) {
  if (e.touches) {
    return { x: e.touches[0].clientX - canvas.offsetLeft,
             y: e.touches[0].clientY - canvas.offsetTop };
  } else {
    return { x: e.clientX - canvas.offsetLeft,
             y: e.clientY - canvas.offsetTop };
  }
}

function startDraw(e) {
  drawing = true;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!drawing) return;
  const pos = getPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDraw() {
  drawing = false;
  ctx.closePath();
}


// function draw(e) {
//     if(!isDrawing) return;
//     ctx.fillStyle = 'white';
//     ctx.beginPath();
//     ctx.arc(e.offsetX, e.offsetY, 8, 0, Math.PI*2.5);
//     ctx.fill();
// }

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