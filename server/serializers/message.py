# pylint: disable=import-error
from app import ma
from models.messages import messages

class MessageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = messages
        load_instance = True