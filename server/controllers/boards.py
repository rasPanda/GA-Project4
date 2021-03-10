# pylint: disable=import-error
from flask import Blueprint, request, g
from models.board import Board
from serializers.board import BoardSchema
from decorators.secure_route import secure_route

board_schema = BoardSchema()

router = Blueprint(__name__, "boards")

@router.route("/board", methods=["GET"])
def get_user_boards():
    boards = Board.query.filter_by(user_id=g.current_user.id)
    return board_schema.jsonify(boards, many=True), 200


@router.route("/board/user/<int:user_id>", methods=["GET"])
def get_other_user_boards(user_id):
    boards = Board.query.filter_by(user_id=user_id)
    return board_schema.jsonify(boards, many=True), 200


@router.route("/board/<int:board_id>", methods=["GET"])
def get_single_board(board_id):
    board = Board.query.get(board_id)
    if not board: 
        return { 'messages': 'Board not found' }, 404
    return board_schema.jsonify(board), 200


@router.route("/board", methods=["POST"])
@secure_route
def create_board():
    board_dict = request.json
    board = board_schema.load(board_dict)
    board.user = g.current_user
    board.save()
    return board_schema.jsonify(board), 201


@router.route("/board/<int:board_id>", methods=["PUT"])
@secure_route
def edit_board(board_id):
    existing_board = Board.query.get(board_id)
    board_dict = request.json
    if existing_board.user != g.current_user:
        return { 'messages': 'Unauthorized' }, 401
    board = board_schema.load(board_dict, instance=existing_board, partial=True)
    board.save()
    return board_schema.jsonify(board), 201


@router.route("/board/<int:board_id>", methods=["DELETE"])
@secure_route
def delete_board(board_id):
    board = Board.query.get(board_id)
    if board.user != g.current_user:
        return { 'messages': 'Unauthorized' }, 401
    board.remove()
    return { "messages": "Board successfully deleted" }, 200