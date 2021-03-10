# pylint: disable=import-error
from app import ma
from models.board import Board
from marshmallow import fields

class BoardSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Board
        load_instance = True

    products = fields.Nested('SimpleProductSchema', many=True)

class SimpleBoardSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Board
        load_instance = True