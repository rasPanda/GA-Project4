# pylint: disable=import-error
from app import db

products_boards_join = db.Table('products_boards',
    db.Column('product_id', db.Integer, db.ForeignKey('products.id'), primary_key=True),
    db.Column('board_id', db.Integer, db.ForeignKey('boards.id'), primary_key=True),
    db.Column('purchased', db.Boolean, default=False)
)