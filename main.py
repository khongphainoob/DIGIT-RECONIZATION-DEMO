from flask import Flask,render_template,request,jsonify
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io
import base64
import re

app = Flask(__name__)
# Load the pre-trained model
model = load_model('model.keras')
@app.route('/')
def index():
    return render_template('UI.html')
@app.route('/predict', methods=['POST'])
def predict():
    # Get the base64 image from the request
    img_data = request.json.get('image')
    # Decode the base64 image
    img_str = re.search(r'base64,(.*)', img_data).group(1)
    img_bytes = base64.b64decode(img_str)
    img = Image.open(io.BytesIO(img_bytes)).convert('L')
    img = img.resize((28, 28))
    img_array = np.array(img) / 255.0
    img_array = img_array.reshape(1, 28, 28, 1)
    # Make prediction
    prediction = model.predict(img_array)
    predict_digit = int(np.argmax(prediction))
    confidence = float(np.max(prediction))
    # Return the prediction and confidence
    # Chuyển mảng về ảnh PIL
    img_show = Image.fromarray((img_array[0, :, :, 0] * 255).astype('uint8'))
    buffered = io.BytesIO()
    img_show.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()

    # Trả về thêm trường 'processed_image'
    return jsonify({
        'digit': predict_digit,
        'confidence': round(confidence * 100, 2),
        'processed_image': img_base64
    })
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
