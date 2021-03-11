# pylint: disable=import-error
from models.comment import Comment

list_comments = [
    Comment(
        text="So lovely!",
        product_id=1,
        user_id=2,
    ),
        Comment(
        text="Must buy",
        product_id=1,
        user_id=2,
    ),
        Comment(
        text="Not for me!",
        product_id=2,
        user_id=2,
    ),
]