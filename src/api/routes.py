"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Store, Category, Product, Cart, Cart_List
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/admin/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200


@api.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200


@api.route("/user", methods=["POST"])
def create_user():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username:
        return jsonify({"error": "El nombre de usuario es obligatorio"}), 400

    if not email:
        return jsonify({"error": "El correo electrónico es obligatorio"}), 400

    if not password:
        return jsonify({"error": "La contraseña es obligatoria"}), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"error": "Ya existe un usuario con ese correo electrónico"}), 400

    new_user = User(username=username, email=email, password=password)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear el usuario"}), 500

    return jsonify(new_user.serialize()), 201


@api.route("/user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    user = User.query.get(user_id)

    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if "image" in data:
        user.image = data["image"]

    if "username" in data:
        user.username = data["username"]

    if "email" in data:
        user.email = data["email"]

    if "password" in data:
        user.password = data["password"]

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar el usuario"}), 500

    return jsonify(user.serialize()), 200


@api.route("/user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar el usuario"}), 500

    return jsonify({"message": "Usuario eliminado correctamente"}), 200


@api.route("/user/cart/<int:user_id>", methods=["GET"])
def get_user_cart(user_id):
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    cart = user.cart

    if cart is None:
        return jsonify({
            "id": None,
            "user_id": user.id,
            "cart_list": []
        }), 200

    return jsonify(cart.serialize()), 200


@api.route("/cart/add", methods=["POST"])
def add_product_to_cart():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Datos no enviados"}), 400

    user_id = data.get("user_id")
    product_id = data.get("product_id")


    if not user_id or not product_id:
        return jsonify({"error": "Falta user_id o product_id"}), 400

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.flush()

    cart_list = Cart_List.query.filter_by(
        cart_id=cart.id, product_id=product_id).first()

    if cart_list:
        cart_list.quantity += 1
    else:
        cart_list = Cart_List(
            cart_id=cart.id, product_id=product_id, quantity=1)
        db.session.add(cart_list)

    try:
        db.session.commit()
        return jsonify({"message": "Producto agregado al carrito correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al agregar el producto al carrito"}), 500





@api.route("/store", methods=["GET"])
def get_store():

    store = Store.query.first()

    if store is None:
        return jsonify({
            "message": "No existe ninguna tienda todavia."
        }), 404

    return jsonify(store.serialize()), 200


@api.route("/store", methods=["POST"])
def create_store():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    name = data.get("name")
    logo = data.get("logo")
    description = data.get("description")

    if not name:
        return jsonify({"error": "El nombre de la tienda es obligatorio"}), 400

    existing_store = Store.query.first()

    if existing_store:
        return jsonify({"error": "Ya existe una tienda"}), 400

    new_store = Store(
        name=name,
        logo=logo,
        description=description
    )

    try:
        db.session.add(new_store)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear la tienda"}), 500

    return jsonify(new_store.serialize()), 201


@api.route("/store", methods=["PUT"])
def update_store():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    store = Store.query.first()

    if store is None:
        return jsonify({"error": "No existe ninguna tienda todavía"}), 404

    if "name" in data:
        store.name = data["name"]

    if "logo" in data:
        store.logo = data["logo"]

    if "description" in data:
        store.description = data["description"]

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar la tienda"}), 500

    return jsonify(store.serialize()), 200


@api.route("/categories", methods=["GET"])
def get_categories():
    categories = Category.query.all()

    return jsonify([category.serialize() for category in categories]), 200


@api.route("/categories", methods=["POST"])
def create_category():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    name = data.get("name")

    if not name:
        return jsonify({"error": "El nombre de la categoría es obligatorio"}), 400

    new_category = Category(name=name)

    try:
        db.session.add(new_category)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear la categoría"}), 500

    return jsonify(new_category.serialize()), 201


@api.route("/categories/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    category = Category.query.get(category_id)

    if category is None:
        return jsonify({"error": "Categoría no encontrada"}), 404

    try:
        db.session.delete(category)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar la categoría"}), 500

    return jsonify({"message": "Categoría eliminada correctamente"}), 200


@api.route("/products/category/<int:category_id>", methods=["GET"])
def get_products_by_category(category_id):
    category = Category.query.get(category_id)

    if category is None:
        return jsonify({"error": "Categoría no encontrada"}), 404

    products = Product.query.filter_by(category_id=category_id).all()

    return jsonify([product.serialize() for product in products]), 200


@api.route("/products", methods=["POST"])
def create_product():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    name = data.get("name")
    price = data.get("price")
    description = data.get("description")
    image = data.get("image")
    category_id = data.get("category_id")

    if not name:
        return jsonify({"error": "El nombre del producto es obligatorio"}), 400

    if price is None:
        return jsonify({"error": "El precio del producto es obligatorio"}), 400

    if not category_id:
        return jsonify({"error": "La categoría es obligatoria"}), 400

    category = Category.query.get(category_id)

    if category is None:
        return jsonify({"error": "Categoría no encontrada"}), 404

    new_product = Product(
        name=name,
        price=price,
        description=description,
        image=image,
        category_id=category_id
    )

    try:
        db.session.add(new_product)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear Producto"}), 500

    return jsonify(new_product.serialize()), 201


@api.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    product = Product.query.get(product_id)

    if product is None:
        return jsonify({"error": "Producto no encontrado"}), 404

    if "name" in data:
        product.name = data["name"]

    if "price" in data:
        product.price = data["price"]

    if "description" in data:
        product.description = data["description"]

    if "image" in data:
        product.image = data["image"]

    if "category_id" in data:
        category = Category.query.get(data["category_id"])

        if category is None:
            return jsonify({"error": "Categoría no encontrada"}), 404

        product.category_id = data["category_id"]

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar el producto"}), 500

    return jsonify(product.serialize()), 200


@api.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)

    if product is None:
        return jsonify({"error": "Producto no encontrado"}), 404

    try:
        db.session.delete(product)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar el producto"}), 500

    return jsonify({"message": "Producto eliminado correctamente"}), 200
