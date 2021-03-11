# pylint: disable=import-error
from app import ma
from models.user import User
from marshmallow import fields

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash', 'role')
        load_only = ('email, password')

    password = fields.String(required=True)
    boards = fields.Nested('BoardSchema', many=True)
    following = fields.Nested('SimpleUserSchema', many=True)
    messages_sent = fields.Nested('MessageSchema', many=True)
    messages_received = fields.Nested('MessageSchema', many=True)

class SimpleUserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash', 'role', 'email', 'image')
        load_only = ('email, password')