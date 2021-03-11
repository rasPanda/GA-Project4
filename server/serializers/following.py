# pylint: disable=import-error
from app import ma
from models.user import User

class FollowingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True