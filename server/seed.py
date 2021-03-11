# pylint: disable=no-member
from app import app, db
from data.product_data import list_products
from data.comment_data import list_comments
from data.board_data import list_boards
from data.message_data import list_messages
from data.user_data import user1, user2, user3

with app.app_context():

    try:
        db.drop_all()
        db.create_all()
        db.session.add_all([user1, user2, user3])
        db.session.commit()
        db.session.add_all(list_products)
        db.session.commit()
        db.session.add_all(list_boards)
        db.session.commit()
        db.session.add_all(list_comments)
        db.session.commit()
        db.session.add_all(list_messages)
        db.session.commit()
        
        print('🤖 Database seeded! 🤖')
        
    except Exception as e:
        print('🤖 Error in seeding 🤖')
        print(e)
