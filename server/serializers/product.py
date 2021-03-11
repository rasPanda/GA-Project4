# pylint: disable=import-error
from app import ma
from models.product import Product
from marshmallow import fields

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True
    
    comments = fields.Nested('CommentSchema', many=True)
    boards = fields.Nested('SimpleBoardSchema', many=True)

class SimpleProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True