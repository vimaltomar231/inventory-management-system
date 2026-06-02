from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.routes.product_routes import router as product_router
from app.routes.customer_routes import router as customer_router
from app.routes.order_routes import router as order_router
from app.routes.dashboard_routes import router as dashboard_router


app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# CORS Configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard_router)


@app.get("/")
def home():
    return {"message": "Inventory Management API Running"}