# cs3980todo app, My Fridge

```bash
python3 -m venv venv
source ../.venv/bin/activate  or  . venv/bin/activate
pip3 install fastapi
pip3 install uvicorn
pip3 install pydantic
uvicorn main:app --reload
```

Display the contents of a kitchen so I can track what ingredients I have.

Uses the foundational CRUD functionalities.

Built from the todo app base with FastAPI.

```bash
pip3 freeze > requirements.txt
```