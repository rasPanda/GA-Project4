# pylint: disable=import-error
from models.user import User

user1 = User(
    username="raspanda",
    password='Kines123',
    email='carl@carl.com',
    role='admin',
)

user2 = User(
    username="random1",
    password='12345678',
    email='ran@dom1.com',
    role='normal',
    followers=[user1]
)

user3 = User(
    username="random2",
    password='12345678',
    email='ran@dom2.com',
    role='normal',
    followers=[user1, user2]
)