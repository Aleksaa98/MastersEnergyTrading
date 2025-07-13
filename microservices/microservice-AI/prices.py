import requests
from model import predict_future_prices
import joblib


def get_actual_prices():
    url = "http://localhost:3001/api/price/predicted-prices"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        actual_prices = data.get("actual", [])
        return [
            {
                "timestamp": item["date"],
                "price": item["price"]
            }
            for item in actual_prices
        ]
    except requests.RequestException as e:
        print(f"Failed to fetch actual prices: {e}")
        return []


def get_predicted_prices():
    try:
        model = joblib.load("price_predictor.pkl")
        prediction = predict_future_prices(model)
        return [
            {
                "timestamp": ts,
                "price": price
            }
            for ts, price in zip(prediction["timestamps"], prediction["prices"])
        ]
    except Exception as e:
        print(f"Prediction failed: {e}")
        return []


def get_combined_data():
    actual = get_actual_prices()
    predicted = get_predicted_prices()

    # Optional: Sort by timestamp
    actual_sorted = sorted(actual, key=lambda x: x["timestamp"])
    predicted_sorted = sorted(predicted, key=lambda x: x["timestamp"])
    predicted_five = predicted_sorted[:5]

    return {
        "actual": actual_sorted,
        "predicted": predicted_five
    }