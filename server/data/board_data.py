# pylint: disable=import-error
from models.board import Board
from data.product_data import list_products

list_boards = [
    Board(
        name="New flat",
        user_id=1,
        products=list_products
    ),
    Board(
        name="Bedroom redecoration",
        user_id=1,
    )
]