from pydantic import BaseModel, EmailStr


class CustomerCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: str

    class Config:
        from_attributes = True