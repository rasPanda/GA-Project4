# pylint: disable=import-error
from app import db
from models.base import BaseModel
from models.products_boards import Products_Boards

class Board(db.Model, BaseModel):
    
    __tablename__ = 'boards'
    name = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))

    products = db.relationship('Products_Boards')