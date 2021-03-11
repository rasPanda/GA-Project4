# pylint: disable=no-member
from app import app, db
from data.product_data import list_products
from data.comment_data import list_comments
from data.message_data import list_messages
from data.user_data import list_users

with app.app_context():

    try:
        db.drop_all()
        db.create_all()
        db.session.add_all(list_users)
        db.session.commit()
        db.session.add_all(list_products)
        db.session.commit()
        db.session.add_all(list_comments)
        db.session.commit()
        db.session.add_all(list_messages)
        db.session.commit()
        
        print('🤖 Database seeded! 🤖')
        
    except Exception as e:
        print('🤖 Error in seeding 🤖')
        print(e)
