from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer_model import Customer
from app.models.product_model import Product
from app.models.order_model import (
    Order,
    OrderItem
)

from app.schemas.order_schema import (
    OrderCreate,
    OrderResponse
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# POST /orders
@router.post(
    "",
    response_model=OrderResponse,
    status_code=201
)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == order.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    total_amount = 0
    order_items = []

    for item in order.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product ID {item.product_id} not found"
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        product.stock -= item.quantity

        item_total = (
            product.price *
            item.quantity
        )

        total_amount += item_total

        order_item = OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )

        order_items.append(order_item)

    new_order = Order(
        customer_id=order.customer_id,
        total_amount=total_amount
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order_items:
        item.order_id = new_order.id
        db.add(item)

    db.commit()
    db.refresh(new_order)

    return new_order


# GET /orders
@router.get(
    "",
    response_model=list[OrderResponse]
)
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()


# GET /orders/{id}
@router.get(
    "/{order_id}",
    response_model=OrderResponse
)
def get_order_by_id(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


# DELETE /orders/{id}
@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # restore stock
    for item in order.items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:
            product.stock += item.quantity

    db.delete(order)
    db.commit()

    return {
        "message":
        "Order deleted successfully"
    }
