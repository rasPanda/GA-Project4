# pylint: disable=import-error
from app import app
from flask import Flask, jsonify
from marshmallow.exceptions import ValidationError

@app.errorhandler(ValidationError)
def validation_error(e):
    print('validation e')
    return { 
        "error type": "Validation",
        "errors": e.messages, 
        "messages": "Something went wrong" 
        }, 400

@app.errorhandler(Exception)
def general_error(e):
    print('exception e')
    error_message = str(e)
    if 'users_email_key' in error_message:
        return { 
        "error type": "Exception",
        "errors": error_message, 
        "messages": "Account exists for this email, Login?" 
        }, 400
    elif 'users_username_key' in error_message:
        return { 
        "error type": "Exception",
        "errors": error_message, 
        "messages": "Username already being used!" 
        }, 400
    else: 
        return { 
        "error type": "Exception",
        "errors": error_message, 
        "messages": "Something went wrong" 
        }, 400

@app.errorhandler(AssertionError)
def assertion_error(e):
    print('assertion e')
    return { 
        "error type": "Assertion",        
        "messages": str(e) 
        }, 400

@app.errorhandler(AttributeError)
def attribute_error(e):
    print('attribute e')
    return { 
        "error type": "Attribute",    
        "errors": str(e), 
        "messages": "Something went wrong" 
        }, 400