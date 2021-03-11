# pylint: disable=import-error
from app import ma
from models.message import Message
from marshmallow import fields

class MessageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Message
        load_instance = True
    
    sender = fields.Nested('SimpleUserSchema')
    recipient = fields.Nested('SimpleUserSchema')