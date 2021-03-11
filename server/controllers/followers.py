# pylint: disable=import-error
from flask import Blueprint, request, g
from models.user import User
from serializers.user import UserSchema
from decorators.secure_route import secure_route

user_schema = UserSchema()

router = Blueprint(__name__, "users")