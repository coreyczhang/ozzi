from flask import Flask, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)

def draw_box(image):
    # implementation for drawing a box
    box_start = (50, 50)
    box_end = (200, 200)
    return box_start, box_end

@app.route('/')
def index():
    return "Welcome to the Image Processing API!"

@app.route('/draw-box', methods=['POST'])
def draw_box_endpoint():
    # Check if the POST request has the files part
    if 'image1' not in request.files or 'image2' not in request.files:
        return jsonify({"error": "Missing files"}), 400

    file1 = request.files['image1']
    file2 = request.files['image2']

    image1 = cv2.imdecode(np.frombuffer(file1.read(), np.uint8), cv2.IMREAD_COLOR)
    image2 = cv2.imdecode(np.frombuffer(file2.read(), np.uint8), cv2.IMREAD_COLOR)

    box_start1, box_end1 = draw_box(image1)
    box_start2, box_end2 = draw_box(image2)

    return jsonify({
        'box1': {'start': box_start1, 'end': box_end1},
        'box2': {'start': box_start2, 'end': box_end2}
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)