import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import numpy as np

def create_features(df):
    df = df.copy()
    df['hour'] = df.index.hour
    df['dayofweek'] = df.index.dayofweek
    df['quarter'] = df.index.quarter
    df['month'] = df.index.month
    df['year'] = df.index.year
    df['dayofyear'] = df.index.dayofyear
    return df

def train_model(file_path='HourlyPrices.csv'):
    # Read data from the Excel file, assuming it has 'timestamp' and 'price' columns
    df = pd.read_csv(file_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.set_index('timestamp')
    df = df.sort_index()

    # Feature Creation
    df = create_features(df)
    
    # Define features (X) and target (y)
    FEATURES = ['hour', 'dayofweek', 'quarter', 'month', 'year', 'dayofyear']
    TARGET = 'price'

    X = df[FEATURES]
    y = df[TARGET]

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Save the trained model to a file
    joblib.dump(model, 'price_predictor.pkl')
    print(f"Model trained from {file_path} and saved as price_predictor.pkl")
    return model

def predict_future_prices(model, hours_to_predict=24):
    last_timestamp = pd.to_datetime('now').floor('H')
    future_dates = pd.to_datetime([last_timestamp + pd.DateOffset(hours=i) for i in range(1, hours_to_predict + 1)])
    
    future_df = pd.DataFrame(index=future_dates)
    future_df = create_features(future_df)

    FEATURES = ['hour', 'dayofweek', 'quarter', 'month', 'year', 'dayofyear']
    predictions = np.round(model.predict(future_df[FEATURES]), 1)
    prediction = { 'timestamps': future_df.index.strftime('%Y-%m-%dT%H:%M:%S').tolist(), 'prices': predictions.tolist() }
    return prediction
