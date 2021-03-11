# pylint: disable=import-error
from models.board import Board
from data.product_data import list_products

board_1 = Board(
        name="New flat",
        user_id=1,
        products=list_products
    )

board_2 = Board(
        name="Bedroom redecoration",
        user_id=1,
    )
