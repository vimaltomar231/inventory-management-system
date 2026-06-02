from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0)
    stock: int = Field(ge=0)


class ProductUpdate(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0)
    stock: int = Field(ge=0)


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    stock: int

    class Config:
        from_attributes = True