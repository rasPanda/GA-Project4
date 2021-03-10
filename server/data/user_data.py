# pylint: disable=import-error
from models.user import User

list_users = [
    User(
        username="raspanda",
        password='Kines123',
        email='carl@carl.com',
        role='admin',
    ),
    User(
        username="shamarreigns",
        password='Tianna92',
        email='shamar@shamar.com',
        role='normal',
    )
]