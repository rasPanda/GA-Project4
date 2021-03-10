# pylint: disable=import-error
from flask import Blueprint, request, g
from models.product import Product
from models.comment import Comment
from serializers.product import ProductSchema
from serializers.comment import CommentSchema
from decorators.secure_route import secure_route

product_schema = ProductSchema()
comment_schema = CommentSchema()

router = Blueprint(__name__, "comments")

@router.route("/comment/product_<int:product_id>", methods=["POST"])
@secure_route
def post_comment(product_id):
    comment_dict = request.json
    comment = comment_schema.load(comment_dict)
    comment.user_id = g.current_user.id
    comment.product_id = product_id
    comment.save()
    return comment_schema.jsonify(comment), 201

@router.route("/comment/product_<int:product_id>/comment_<int:comment_id>", methods=["DELETE"])
@secure_route
def delete_comment(product_id, comment_id):
    comment = Comment.query.get(comment_id)
    if comment.user != g.current_user:
        return { 'messages': 'Unauthorized' }, 401
    comment.remove()
    product = Product.query.get(product_id)
    return product_schema.jsonify(product), 200

@router.route("/comment/product_<int:product_id>/comment_<int:comment_id>", methods=["PUT"])
@secure_route
def edit_comment(product_id, comment_id):
    existing_comment = Comment.query.get(comment_id)
    comment_dict = request.json
    if existing_comment.user != g.current_user:
        return { 'messages': 'Unauthorized' }, 401
    comment = comment_schema.load(comment_dict, instance=existing_comment, partial=True)
    comment.save()
    product = Product.query.get(product_id)
    return product_schema.jsonify(product), 200