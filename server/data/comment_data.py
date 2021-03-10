# pylint: disable=import-error
from models.comment import Comment

list_comments = [
    Comment(
        content="So lovely!",
        product_id=1,
    ),
        Comment(
        content="Must buy",
        product_id=1,
    ),
        Comment(
        content="Not for me!",
        product_id=2,
    ),
]