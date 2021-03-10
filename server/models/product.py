# pylint: disable=import-error
from app import db
from models.base import BaseModel
from models.products_boards import products_boards_join
from models.board import Board
from models.comment import Comment

class Product(db.Model, BaseModel):
    
    __tablename__ = 'products'
    name = db.Column(db.String(100), nullable=False, unique=True)
    vendor = db.Column(db.String(50), nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    dest_url = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))

    comments = db.relationship('Comment', backref='product', cascade='all, delete')
    boards = db.relationship('Spell', backref='heroes', secondary=products_boards_join)