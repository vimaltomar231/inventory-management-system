from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.product_model import Product
from app.models.customer_model import Customer
from app.models.order_model import Order

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db)
):
    total_products = db.query(
        Product
    ).count()

    total_customers = db.query(
        Customer
    ).count()

    total_orders = db.query(
        Order
    ).count()

    low_stock_products = db.query(
        Product
    ).filter(
        Product.stock < 5
    ).all()

    return {
        "total_products":
        total_products,

        "total_customers":
        total_customers,

        "total_orders":
        total_orders,

        "low_stock_products":
        [
            {
                "id": product.id,
                "name": product.name,
                "stock": product.stock
            }
            for product in low_stock_products
        ]
    }