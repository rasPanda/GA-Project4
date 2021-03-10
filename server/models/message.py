# pylint: disable=import-error
from app import db
from models.base import BaseModel

class messages(db.Model, BaseModel):
    
    __tablename__ = 'comments'
    text = db.Column(db.Text, nullable=False)

    sender_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))