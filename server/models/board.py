# pylint: disable=import-error
from app import db
from models.base import BaseModel

class Board(db.Model, BaseModel):
    
    __tablename__ = 'boards'
    name = db.Column(db.String(50), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))