from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product_model import Product
from app.schemas.product_schema import (
    ProductCreate,
    ProductUpdate,
    ProductResponse
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# POST /products
@router.post(
    "",
    response_model=ProductResponse,
    status_code=201
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    existing_product = db.query(Product).filter(
        Product.sku == product.sku
    ).first()

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    new_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        stock=product.stock
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# GET /products
@router.get(
    "",
    response_model=list[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(Product).all()


# GET /products/{id}
@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# PUT /products/{id}
@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: int,
    updated_product: ProductUpdate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    sku_exists = db.query(Product).filter(
        Product.sku == updated_product.sku,
        Product.id != product_id
    ).first()

    if sku_exists:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    product.name = updated_product.name
    product.sku = updated_product.sku
    product.price = updated_product.price
    product.stock = updated_product.stock

    db.commit()
    db.refresh(product)

    return product


# DELETE /products/{id}
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message":
        "Product deleted successfully"
    }