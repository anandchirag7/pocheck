
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import datetime

app = FastAPI(title="POCheck Teradata Gateway")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]
    context: Optional[Dict[str, Any]] = None

class QueryRequest(BaseModel):
    sql: str
    params: Optional[Dict[str, Any]] = None

class UserProfile(BaseModel):
    user_id: str
    full_name: str
    email: str
    role: str
    department: str
    last_login: str
    location: str

# Mock data simulating Teradata responses
MOCK_USER = {
    "user_id": "JDOE_PROC_99",
    "full_name": "Johnathan Doe",
    "email": "j.doe@enterprise.com",
    "role": "Senior Procurement Analyst",
    "department": "Global Sourcing",
    "last_login": "2025-05-15 08:42 AM",
    "location": "North America Hub (Chicago)"
}

@app.get("/api/user-profile", response_model=UserProfile)
async def get_user_profile():
    return MOCK_USER

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Gateway for the custom LLM API.
    Replace the mock logic below with your actual LLM provider call.
    """
    user_msg = request.message.lower()
    
    # Placeholder for actual LLM API Call (e.g. requests.post("your-llm-url", ...))
    # Here we simulate a response that includes Teradata SQL
    
    response_text = f"I have processed your request regarding '{request.message}'."
    
    if "po" in user_msg or "purch" in user_msg:
        response_text += "\n\n```sql\nSELECT * FROM Procurement_Analysis_NRS.v_fact_purch_ord_hdr WHERE purch_doc_nbr = '" + (request.context.get("@ID") or "4500000000") + "';\n```"
        response_text += "\n\nI've generated a query for the Purchase Order header based on your current filters."
    else:
        response_text += "\n\nHow else can I assist you with your Teradata procurement data today?"

    return {"content": response_text}

@app.post("/api/query")
async def execute_query(request: QueryRequest):
    sql_lower = request.sql.lower()
    if "v_fact_purch_ord_hdr" in sql_lower:
        return {
            "columns": ["purch_doc_nbr", "cre_dt", "vend_nm", "tot_amt", "curr_cd"],
            "data": [["4500012345", "2025-01-10", "Global Logistics Corp", 12500.00, "USD"]]
        }
    return {
        "columns": ["Status", "Message"],
        "data": [["Success", "Query received by Teradata Engine."]]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
