from pydantic import BaseModel
from typing import List


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class ProductInfo(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: float
    product: ProductInfo

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True