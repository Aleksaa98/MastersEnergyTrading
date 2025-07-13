from flask import Flask, jsonify
import joblib
from model import train_model, predict_future_prices
from prices import get_combined_data
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

MODEL_FILE = 'price_predictor.pkl'
DATA_FILE = 'HourlyPrices.csv'


@app.route('/train', methods=['POST'])
def train():
    """
    Trains the model from the local 'HourlyPrices.csv' file.
    """
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify({"error": f"Data file not found at {DATA_FILE}. Please make sure the file is in the microservice-AI directory."}), 404

        train_model(DATA_FILE)
        return jsonify({"message": "Model trained successfully from Excel file."})

    except Exception as e:
        return jsonify({"error": f"An error occurred during training: {e}"}), 500

@app.route('/predict', methods=['GET'])
def predict():
    """
    Loads the pre-trained model and returns predictions for the next 24 hours.
    """
    try:
        if not os.path.exists(MODEL_FILE):
             return jsonify({"error": "Model not found. Please train the model first by calling POST /train."}), 404
        
        model = joblib.load(MODEL_FILE)
        predictions = predict_future_prices(model)
        return jsonify(predictions)

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {e}"}), 500

@app.route('/prices', methods=['GET'])
def prices():
    try:
        if not os.path.exists(MODEL_FILE):
            return jsonify({"error": "Model not found. Please train the model first by calling POST /train."}), 404

        combined = get_combined_data()
        return jsonify(combined)

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {e}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return "OK", 200

if __name__ == '__main__':
    # For production, use a proper WSGI server like Gunicorn
    app.run(host='0.0.0.0', port=3002)
