# pylint: disable=import-error
from app import db
from models.base import BaseModel


class Products_Boards(db.Model):
    _tablename__ = 'products_boards_join',
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey('boards.id'), primary_key=True)
    purchased = db.Column(db.Boolean, default=False)

    product = db.relationship('Product')
