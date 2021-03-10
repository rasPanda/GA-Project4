# pylint: disable=import-error
from app import db
from models.base import BaseModel

class Comment(db.Model, BaseModel):
    
    __tablename__ = 'comments'
    text = db.Column(db.Text, nullable=False)

    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))