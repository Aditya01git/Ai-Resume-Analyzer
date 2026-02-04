from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from io import BytesIO
import PyPDF2
from Analyze_Resume import workflow
import warnings
from sklearn.exceptions import InconsistentVersionWarning
from Report.resume_report import generate_resume_report
from DB_Handle import saveToDb, get_file, get_file_stream, delete_report, get_all_documents, get_report, check_username_exists
from datetime import datetime

# Ignore scikit-learn version mismatch warnings
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

## Run Command : uvicorn main:app --reload

app = FastAPI()

# Allow frontend origins (adjust for your setup)
origins = [
    "http://localhost:5173",   # React local dev
    "http://127.0.0.1:3000",
    "https://yourfrontenddomain.com",  # production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],         # allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],         # allows all custom headers
)

# ---------------------------
# PDF Text Extraction
# ---------------------------
def get_resume_content(file_bytes) -> str:
    """
    Extract text content from a PDF file.
    
    Args:
        file_bytes (BytesIO): The PDF file as a BytesIO object.
    
    Returns:
        str: Extracted text from the PDF.
    """
    try:
        pdf_reader = PyPDF2.PdfReader(file_bytes)
        text = ""
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted
        return text
    except Exception as e:
        raise ValueError(f"Error extracting text from PDF: {str(e)}")

def get_resume_report(initial_state):
    
    try:
        result = workflow.invoke(initial_state)
        return {
            "success": True,
            "data": result
        }
    except ValueError as e:
         # Raised for invalid inputs (non-resume, malicious job desc, etc.)
        return {
            "success": False,
            "error": {
            "type": "InputValidationError",
            "message": str(e),
            "details": None
            }
        }
    except Exception as e:
        # Catch-all for unexpected runtime/LLM issues
        return {
            "success": False,
            "error": {
            "type": "InternalServerError",
            "message": "Something went wrong during resume analysis. Please try again later.",
            "details": str(e) # optional, hide in production
            }
        }


# ---------------------------
# FastAPI Endpoints
# ---------------------------
@app.post("/upload_resume")
async def upload_resume(uploaded_file: UploadFile = File(...), job_description: str = Form(...), user_name: str = Form(...)):
    """
    Upload a resume, analyze it, generate a report, and save to MongoDB.
    
    Args:
        uploaded_file (UploadFile): The uploaded resume PDF.
        job_description (str): The job description text.
        user_name (str): The username for storing data.
    
    Returns:
        dict: AI response with analysis and file IDs, or error message.
    """
    try:
        file_bytes = await uploaded_file.read()
        resume_file = BytesIO(file_bytes)
        resume_text = get_resume_content(resume_file)
        resume_file_name = uploaded_file.filename

        # Get today's date
        today_date = datetime.today().strftime("%Y-%m-%d")
        
        AI_Response = {}
        try:
            AI_Response = get_resume_report({'resume_content': resume_text, 'job_description': job_description})
            
            # Ensure directory exists for report
            output_path = f"Report/Resume_Reports/{user_name}_Report.pdf"
            import os
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Generate Feedback Report only if successful
            if AI_Response['success']:
                resume_report = generate_resume_report(AI_Response['data'], user_name=user_name, output_path=output_path)
            else:
                resume_report = None

            # Reset resume_file position for saving
            resume_file.seek(0)
            
            # Save to MongoDB regardless of success/failure
            AI_Response = saveToDb(AI_Response, user_name, resume_file, resume_report, resume_file_name, today_date)
            
            if AI_Response is None:
                raise HTTPException(status_code=500, detail="Failed to save data to database, possibly due to invalid report PDF")
            
        except ValueError as ve:
            print("PDF generation error:", str(ve))
            raise HTTPException(status_code=500, detail=f"PDF generation error: {str(ve)}")
        except Exception as e:
            print("Exception during analysis or report generation:", str(e))
            raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")
        
        return AI_Response

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File processing error: {str(e)}")

@app.get("/check_username/{username}")
def check_username(username: str):
    pass
    exists = check_username_exists(username)
    if exists :
        return {
            "Username_Exists": exists,
            "message": f"Username {username} already exists."
        }
    else:
        return {
            "Username_Exists": exists,
            "message": f"Username {username} does not exists."
        }

@app.get("/retrieve_document")
def retrieve_doc(user_name: str, report_id: str):
    """
    Retrieve single document from the user's collection with matching report id.
    
    Args:
        username (str): The username associated with the collection.
        report_id (str): Users Report id
    
    Returns:
        Dictionary: A single dictionary / json object
    """
    document = get_report(report_id, user_name)
    if document is None:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve document for user {user_name}")
    if not document:
        return {"message": f"No document found for user {user_name}", "document": []}
    
    return {"message": f"Retrieved document for user {user_name}", "document": document}

@app.get("/get_all_documents")
async def get_all_documents_endpoint(username: str = Query(...)):
    """
    Retrieve all documents from the user's collection.
    
    Args:
        username (str): The username associated with the collection (query parameter).
    
    Returns:
        list: List of documents in the collection.
    """
    documents, avg_ats_score, score_change, total_valid_documents = get_all_documents(username)
    if documents is None:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve documents for user {username}")
    if not documents:
        return {"message": f"No documents found for user {username}", "documents": []}
    
    return {
        "message": f"Retrieved {len(documents)} document(s) for user {username}", 
        "Total_Analyses": len(documents),
        "Total Valid Analyses": total_valid_documents,
        "Avg_ATS_Score": avg_ats_score,
        "Overall_Score_Change": score_change,
        "documents": documents
    }

@app.get("/download_reportfile/{file_id}")
async def download_file(file_id: str):
    """
    Download a file from GridFS by file ID as a streaming response.
    
    Args:
        file_id (str): The GridFS file ID.
    
    Returns:
        StreamingResponse: The file as a streaming response.
    """
    file_stream, filename = get_file_stream(file_id)
    if file_stream is None:
        raise HTTPException(status_code=404, detail="File not found")
    
    return StreamingResponse(
        file_stream,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# @app.get("/retrieve_and_save_reportfile/{file_id}")
# async def retrieve_and_save_file(file_id: str, output_path: str = "Report/Temp.pdf"):
    # """
    # Retrieve a file from GridFS by file ID and save it locally.
    
    # Args:
    #     file_id (str): The GridFS file ID.
    #     output_path (str): Local path to save the file (default: "Report/Temp.pdf").
    
    # Returns:
    #     dict: Confirmation message with the saved file path.
    # """
    # saved_path = get_file(file_id, output_path)
    # if saved_path is None:
    #     raise HTTPException(status_code=404, detail="File not found or failed to save")
    
    # return {"message": f"File successfully saved to {saved_path}"}

@app.delete("/delete_report/{report_id}")
async def delete_report_endpoint(report_id: str, username: str = Query(...)):
    """
    Delete a report from GridFS and remove its ID from the user's collection.
    
    Args:
        report_id (str): The GridFS report file ID.
        username (str): The username associated with the data (query parameter).
    
    Returns:
        dict: Confirmation message.
    """
    success = delete_report(report_id, username)
    if not success:
        raise HTTPException(status_code=404, detail="Report not found or failed to delete")
    
    return {"message": f"Report {report_id} deleted successfully for user {username}"}