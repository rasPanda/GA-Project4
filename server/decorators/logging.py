# pylint: disable=import-error
from app import app
from flask import Flask, jsonify, request
from pprint import pprint

@app.before_request
def log():
    print(f'''--------------------------------
    🔴 INCOMING REQUEST!
    🔴 Request Method: {request.method}
    🔴 Request URL: {request.base_url}
    😺‍ Request Headers: {request.headers}
    📦 Request Body: {request.json}
    ❓ Request Query: {request.full_path}
    --------------------------------''')
