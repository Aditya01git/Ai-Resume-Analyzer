from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import gridfs
from dotenv import load_dotenv
import os
from bson import ObjectId
from io import BytesIO
import PyPDF2

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

# Setting up Database Connection
client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print("MongoDB connection error:", str(e))

# Creating/Connecting to Database
db = client[DB_NAME]

# Create GridFS instance
fs = gridfs.GridFS(db)


def saveToDb(AI_Response, username, resume_file, resume_report, resume_file_name, today_date):

    try:
        # Ensure resume_file is at the start
        if isinstance(resume_file, BytesIO):
            resume_file.seek(0)

        # Store resume file in GridFS
        resume_id = fs.put(resume_file, filename=f"{username}_resume")
        AI_Response["resume_file_id"] = str(resume_id)
        
        # Store report file in GridFS only if it exists
        if resume_report is not None:
            try:
                pdf_reader = PyPDF2.PdfReader(BytesIO(resume_report))
                if len(pdf_reader.pages) == 0:
                    raise ValueError("Resume report PDF is empty")
                report_id = fs.put(resume_report, filename=f"{username}_report")
                AI_Response["resume_report_id"] = str(report_id)
            except Exception as e:
                print(f"❌ Invalid resume report PDF: {str(e)}")
                AI_Response["resume_report_id"] = None  # Mark as absent but proceed
        else:
            AI_Response["resume_report_id"] = None  # No report for invalid resumes
            
        # Adding Resume File Name & Uploaded Date
        AI_Response['resume_file_name'] = resume_file_name
        AI_Response['uploaded_date'] = today_date
        
        # Save JSON document in a collection (per user)
        collection_data = db[username]
        result = collection_data.insert_one(AI_Response)

        AI_Response["_id"] = str(result.inserted_id)

        print("✅ Data and files saved successfully.")
        return AI_Response

    except Exception as e:
        print("❌ Database Exception:", str(e))
        return None

def check_username_exists(username):
    try:
        # Attempt to access the collection; if it doesn't exist, list_collection_names() won't include it
        collection_names = db.list_collection_names()
        return username in collection_names
    except Exception as e:
        print(f"❌ Error checking username existence: {str(e)}")
        return False

def get_file(file_id, output_path: str = "Report/Temp.pdf"):
    """
    Retrieve a file from GridFS by file ID and save it locally.
    
    Args:
        file_id (str): The GridFS file ID.
        output_path (str): Local path to save the file (default: "Report/Temp.pdf").
    
    Returns:
        str: The path where the file was saved, or None if an error occurs.
    """
    try:
        grid_out = fs.get(ObjectId(file_id))
        os.makedirs(os.path.dirname(output_path), exist_ok=True)  # Ensure directory exists
        with open(output_path, "wb") as f:
            f.write(grid_out.read())
        print(f"✅ File saved to {output_path}")
        return output_path
    except Exception as e:
        print(f"❌ Error retrieving file {file_id}: {str(e)}")
        return None

def get_file_stream(file_id):
    """
    Retrieve a file from GridFS by file ID as a BytesIO stream.
    
    Args:
        file_id (str): The GridFS file ID.
    
    Returns:
        tuple: (BytesIO stream, filename) if successful, or (None, None) if an error occurs.
    """
    try:
        grid_out = fs.get(ObjectId(file_id))
        file_stream = BytesIO(grid_out.read())
        file_stream.seek(0)  # Ensure stream is at the start
        return file_stream, grid_out.filename
    except Exception as e:
        print(f"❌ Error retrieving file stream {file_id}: {str(e)}")
        return None, None

def get_report(report_id: str, username: str):
    try:
        collection_data = db[username]
        
        # Find the document first
        data = collection_data.find_one({'_id': ObjectId(report_id)})
        if not data:
            print(f"⚠️ No document found with report_id {report_id} for user {username}.")
            return False
        
        # Convert ObjectId to string
        data["_id"] = str(data["_id"])
        
        print(f"✅ Retrieved 1 document for user {username}.")
        return data


    except Exception as e:
        print(f"❌ Error Retrieving report {report_id}: {str(e)}")
        return False

def delete_report(report_id: str, username: str):
    try:
        collection_data = db[username]
        
        # Find the document first
        data = collection_data.find_one({'_id': ObjectId(report_id)})
        if not data:
            print(f"⚠️ No document found with report_id {report_id} for user {username}.")
            return False

        # Delete files from GridFS
        if 'resume_file_id' in data:
            fs.delete(ObjectId(data['resume_file_id']))
        if 'resume_report_id' in data:
            fs.delete(ObjectId(data['resume_report_id']))

        # Delete document from collection
        result = collection_data.delete_one({'_id': ObjectId(report_id)})
        if result.deleted_count > 0:
            print(f"✅ Report {report_id} deleted successfully for user {username}.")
            return True
        else:
            print(f"⚠️ Document {report_id} was not deleted.")
            return False

    except Exception as e:
        print(f"❌ Error deleting report {report_id}: {str(e)}")
        return False

def get_all_documents(username: str):
    """
    Retrieve all documents from the user's collection.

    Args:
        username (str): The username associated with the collection.

    Returns:
        tuple: (documents, avg_ats_score, score_change)
    """
    try:
        collection_data = db[username]
        documents = list(collection_data.find())

        total_valid_documents = 0
        if len(documents) == 0:
            print(f"⚠️ No documents found for user {username}.")
            return [], 0, 0

        avg_ats_score = 0
        curr_score = 0
        prev_score = 0
        
        # Convert ObjectId to string for JSON serialization
        for doc in documents:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
            if doc['success'] == True and 'data' in doc and 'ats_score' in doc['data']:
                prev_score = curr_score
                curr_score = doc['data']['overall_score']
                avg_ats_score += doc['data']['ats_score']
                total_valid_documents += 1

        avg_ats_score = avg_ats_score / total_valid_documents if total_valid_documents > 0 else 0

        # Compute score change safely
        score_change = curr_score - prev_score

        print(f"✅ Retrieved {len(documents)} document(s) for user {username}.")
        return documents, avg_ats_score, score_change, total_valid_documents

    except Exception as e:
        print(f"❌ Error retrieving documents for user {username}: {str(e)}")
        return None, None, None, None