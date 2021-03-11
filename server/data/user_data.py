# pylint: disable=import-error
from models.user import User

user1 = User(
    username="raspanda",
    password='Kines123',
    email='carl@carl.com',
    role='admin',
)

user2 = User(
    username="shamarreigns",
    password='Tianna92',
    email='shamar@shamar.com',
    role='normal',
    followers=[user1]
)

user3 = User(
    username="random",
    password='12345678',
    email='ran@dom.com',
    role='normal',
    followers=[user1, user2]
)