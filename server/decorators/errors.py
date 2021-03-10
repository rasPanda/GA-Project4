# pylint: disable=import-error
from app import app
from flask import Flask, jsonify
from marshmallow.exceptions import ValidationError

@app.errorhandler(ValidationError)
def validation_error(e):
    print('validation e')
    return { "errors": e.messages, "messages": "Something went wrong" }, 400

@app.errorhandler(Exception)
def general_error(e):
    return { "errors": str(e), "messages": "Something went wrong" }, 400

@app.errorhandler(AssertionError)
def assertion_error(e):
    return { "messages": str(e) }, 400