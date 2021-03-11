# pylint: disable=import-error
from app import db
from models.base import BaseModel
from models.products_boards import products_boards_join
from models.board import Board
from models.comment import Comment
from sqlalchemy.orm import validates

class Product(db.Model, BaseModel):
    
    __tablename__ = 'products'
    name = db.Column(db.String(100), nullable=False, unique=True)
    vendor = db.Column(db.String(50), nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    image = db.Column(db.Text, nullable=False)
    price = db.Column(db.String(10), nullable=False)
    dest_url = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))

    comments = db.relationship('Comment', backref='product', cascade='all, delete')
    boards = db.relationship('Spell', backref='product', secondary=products_boards_join)

    @validates('dest_url')
    def validate_dest_url(self, key, url):
        assert 'http://' or 'https://' in url, "Invalid URL"
        return url

    @validates('image')
    def validate_image(self, key, url):
        assert 'http://' or 'https://' in url, "Invalid image URL"
        return url