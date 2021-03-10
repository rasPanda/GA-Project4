# pylint: disable=import-error
from app import ma
from models.comment import Comment

class CommentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        load_instance = True