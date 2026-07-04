from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)

    image: Mapped[str] = mapped_column(String(120), nullable=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)





    def serialize(self):
        return {
            "id": self.id,
            "image": self.image,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active
        }


class Cart(db.Model):
    __tablename__ = 'cart'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    Cart_Products: Mapped["User"] = relationship(back_populates="cart", cascade="all, delete")


class Cart_Products(db.Model):
    __tablename__ = 'cart_products'
    id: Mapped[int] = mapped_column(primary_key=True)

    quantity: Mapped[int] = mapped_column(nullable=False)
    cart_id: Mapped[int] = mapped_column(ForeignKey("cart.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("product.id"), nullable=False)

    cart: Mapped["Cart"] = relationship(back_populates="cart_products")
    product: Mapped["Product"] = relationship(back_populates="cart_products")

