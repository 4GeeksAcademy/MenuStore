from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)

    image: Mapped[str | None] = mapped_column(String(120), nullable=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="user")
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    cart: Mapped["Cart"] = relationship(back_populates="user", uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "image": self.image,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "cart": self.cart.serialize() if self.cart else None
        }


class Cart(db.Model):
    __tablename__ = 'cart'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="cart")

    cart_list: Mapped[list["Cart_List"]] = relationship(
        back_populates="cart", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "cart_list": [item.serialize() for item in self.cart_list]
        }


class Cart_List(db.Model):
    __tablename__ = 'cart_list'
    id: Mapped[int] = mapped_column(primary_key=True)

    quantity: Mapped[int] = mapped_column(nullable=False)
    cart_id: Mapped[int] = mapped_column(ForeignKey("cart.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("product.id"), nullable=False)

    cart: Mapped["Cart"] = relationship(back_populates="cart_list")
    product: Mapped["Product"] = relationship(back_populates="cart_list")

    def serialize(self):
        return {
            "id": self.id,
            "quantity": self.quantity,
            "cart_id": self.cart_id,
            "product_id": self.product_id,
            "product": self.product.serialize() if self.product else None
        }


class Store(db.Model):
    __tablename__ = "store"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    logo: Mapped[str] = mapped_column(String(250), nullable=True)
    description: Mapped[str] = mapped_column(String(250), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "logo": self.logo,
            "description": self.description
        }


class Category(db.Model):
    __tablename__ = "category"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)

    products: Mapped[list["Product"]] = relationship(
        back_populates="category",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }


class Product(db.Model):
    __tablename__ = "product"

    id: Mapped[int] = mapped_column(primary_key=True)
    price: Mapped[float] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(250), nullable=True)
    image: Mapped[str] = mapped_column(String(250), nullable=True)

    category_id: Mapped[int] = mapped_column(
        ForeignKey("category.id"),
        nullable=False
    )

    category: Mapped["Category"] = relationship(back_populates="products")

    cart_list: Mapped[list["Cart_List"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "price": self.price,
            "name": self.name,
            "description": self.description,
            "image": self.image,
            "category_id": self.category_id
        }
