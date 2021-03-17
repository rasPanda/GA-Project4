# pylint: disable=import-error, unused-wildcard-import
from app import db, bcrypt
from models.base import BaseModel
from models.product import Product
from models.message import Message
from models.board import Board
from models.user_following_join import user_following
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import jwt
from datetime import *
from config.environment import secret


def validate_password_strength(password_plaintext):
    assert len(password_plaintext) >= 8, "Password too short"
    return { "messages": "Invalid password" }, 400


class User(db.Model, BaseModel):

    __tablename__ = 'users'
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.Text, nullable=False, unique=True)
    image = db.Column(db.Text, nullable=False, default='https://www.clipartkey.com/mpngs/m/152-1520367_user-profile-default-image-png-clipart-png-download.png')
    role = db.Column(db.Enum('normal', 'admin', name='access_types'), default='normal')
    password_hash = db.Column(db.String(128), nullable=True)

    products = db.relationship('Product', backref='user')
    boards = db.relationship('Board', backref='user', cascade='all, delete')
    comments = db.relationship('Comment', backref='user')

    messages_sent = db.relationship('Message', backref='sender', lazy='dynamic', foreign_keys = 'Message.sender_id', cascade='all, delete')
    messages_received = db.relationship('Message', backref='recipient', lazy='dynamic', foreign_keys = 'Message.recipient_id', cascade='all, delete')
    
    following = db.relationship(
        'User', lambda: user_following,
        primaryjoin=lambda: User.id == user_following.c.user_id,
        secondaryjoin=lambda: User.id == user_following.c.following_id,
        backref='followers'
    )


    @hybrid_property
    def password(self):
        pass
    @password.setter
    def password(self, password_plaintext):
        validate_password_strength(password_plaintext)
        encoded_pw = bcrypt.generate_password_hash(password_plaintext)
        self.password_hash = encoded_pw.decode('utf-8')

    @validates('email')
    def validate_email(self, key, address):
        assert '@' and '.' in address, "Invalid email"
        return address

    def validate_password(self, password_plaintext):
        return bcrypt.check_password_hash(self.password_hash, password_plaintext)

    def generate_token(self):
        payload = {
            "sub": self.id,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(days=7),
        }
        token = jwt.encode(payload, secret, 'HS256')
        return token