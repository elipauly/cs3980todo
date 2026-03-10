from typing import Annotated

from fastapi import APIRouter, FastAPI, HTTPException, Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from todo_routes import todo_router

app = FastAPI(title="Todo Items App", version="1.0.0")


@app.get("/")
async def home():
    return FileResponse("./frontend/index.html")


app.include_router(todo_router, tags=["Todos"], prefix="/todos")

# the router needs to be before the mount.
# otherwise, the routes cannot be found.
app.mount("/", StaticFiles(directory="frontend"), name="static")