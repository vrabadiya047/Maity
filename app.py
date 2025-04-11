import numpy as np
from flask import Flask, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

URL = 'https://discosweb.esoc.esa.int'
token = 'ImQ4YTNmYjgzLTNiN2UtNGIzMi1hZjA2LTM3NjdiNjRjYmQ5NiI.lgVJVirrMASh-dA9E7Qt1qbVe1k'

@app.route('/api/spacecraft', methods=['GET'])
def get_spacecraft():
    response = requests.get(
        f'{URL}/api/objects',
        headers={
            'Authorization': f'Bearer {token}',
            'DiscosWeb-Api-Version': '2',
        },
        params={
            'filter': "eq(objectClass,Payload)&gt(reentry.epoch,epoch:'2020-01-01')",
            'sort': '-reentry.epoch',
        },
    )

    if response.ok:
        data = response.json().get("data", [])

        cleaned_data = []
        for obj in data:
            attributes = obj.get("attributes", {})
            valid_attributes = {k: v for k, v in attributes.items() if v not in [None]}
            obj["attributes"] = valid_attributes
            cleaned_data.append(obj)

        return jsonify(cleaned_data)
    else:
        print("Error Response:", response.json())
        return jsonify({'error': response.json().get('errors')}), 500

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to the Spacecraft API!",
        "endpoints": {
            "/api/spacecraft": "Get a list of spacecraft data (GET)"
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5003)