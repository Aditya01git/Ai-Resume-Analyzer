import streamlit as st
import pickle
import re
import nltk
import PyPDF2
import docx
import numpy as np # Import numpy for array handling

# Command to run : streamlit run app.py

# Ensure NLTK resources are downloaded
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except nltk.downloader.DownloadError:
    nltk.download('punkt')
    nltk.download('stopwords')

## Loading Models
model = pickle.load(open('./Model/job-role-prediction-model.pkl', 'rb'))
tfidf = pickle.load(open('./Model/tfidf.pkl', 'rb'))
category_map = pickle.load(open('./Model/job-role-dict.pkl', 'rb'))


### Helper Functions

## Clean Resume Function
def cleanResume(txt):
    clean_text = re.sub(r'http\S+', ' ', txt)   # Removes URL
    clean_text = re.sub(r'RT|cc', ' ', clean_text) 
    clean_text = re.sub(r'#\S+', ' ', clean_text) # Removes HashTags
    clean_text = re.sub(r'@\S+', ' ', clean_text)  # # Removes @ Signs
    clean_text = re.sub(r'[%s]' % re.escape(r"""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', clean_text)  # Removes Special Characters
    clean_text = re.sub(r'[^\x00-\x7f]', ' ', clean_text) 
    clean_text = re.sub(r'\s+', ' ', clean_text)
    return clean_text

# Function to extract text from PDF
def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ''
    for page in pdf_reader.pages:
        text += page.extract_text() or '' # Added 'or '' to handle potentially empty text
    return text


# Function to extract text from DOCX
def extract_text_from_docx(file):
    # docx library handles file-like objects directly
    doc = docx.Document(file) 
    text = ''
    for paragraph in doc.paragraphs:
        text += paragraph.text + '\n'
    return text


# Function to extract text from TXT with explicit encoding handling
def extract_text_from_txt(file):
    # Streamlit passes file-like objects. We read content and decode.
    # We must reset the stream position before reading, as st.file_uploader reads it initially.
    file.seek(0)
    
    # Try using utf-8 encoding for reading the text file
    try:
        text = file.read().decode('utf-8')
    except UnicodeDecodeError:
        # In case utf-8 fails, try 'latin-1' encoding as a fallback
        file.seek(0) # Reset stream again for the second read attempt
        text = file.read().decode('latin-1')
    return text

## Get the Content of the Resume
def get_resume_content(resume_file):
    file_extension = resume_file.name.split('.')[-1].lower()
    if file_extension == 'pdf':
        text = extract_text_from_pdf(resume_file)
    elif file_extension == 'docx':
        text = extract_text_from_docx(resume_file)
    elif file_extension == 'txt':
        text = extract_text_from_txt(resume_file)
    else:
        raise ValueError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.")
    return text

## Predict the Category / Job Role of the Resume
def predict_resume_category(resume_content):
    if not resume_content or not isinstance(resume_content, str):
        return "Extraction failed or content is empty."

    # Preprocess the input text (e.g., cleaning, etc.)
    cleaned_text = cleanResume(resume_content)

    # Vectorize the cleaned text using the same TF-IDF vectorizer used during training
    vectorized_text = tfidf.transform([cleaned_text])

    # Convert sparse matrix to dense 
    vectorized_text = vectorized_text.toarray()

    # Prediction
    predicted_category = model.predict(vectorized_text)

    # We must access the first element [0] of the NumPy array to get the integer index/label.
    if isinstance(predicted_category, np.ndarray) and predicted_category.size > 0:
        predicted_index = predicted_category[0]
    else:
        # Handle cases where prediction fails or returns unexpected format
        return "Prediction failed (Unexpected model output)."

    predicted_category_name = category_map.get(predicted_index, f"Unknown Category Index: {predicted_index}")

    return predicted_category_name  # Return the category name


## Building Frontend
def main():
    st.set_page_config(page_title="Resume Category Prediction", page_icon="📄", layout="wide")

    st.title("Resume Category Prediction App")
    st.markdown("Upload a resume in PDF, TXT, or DOCX format and get the predicted job category.")

    # File upload section
    uploaded_file = st.file_uploader("Upload a Resume", type=["pdf", "docx", "txt"])

    if uploaded_file is not None:

        # Extract text from the uploaded file
        try:
            # We must reset the file pointer before passing it to get_resume_content 
            # as Streamlit may have read part of it.
            uploaded_file.seek(0) 
            resume_text = get_resume_content(uploaded_file)
            
            if resume_text:
                st.success("Successfully extracted the text from the uploaded resume.")
            else:
                st.warning("Successfully read the file, but no meaningful text was extracted.")


            # Display extracted text (optional)
            if st.checkbox("Show extracted text", False):
                st.text_area("Extracted Resume Text", resume_text, height=300)

            # Make prediction
            if resume_text:
                st.subheader("Predicted Category")
                category = predict_resume_category(resume_text)
                st.info(f"The predicted category of the uploaded resume is: **{category}**")
            else:
                st.error("Cannot make a prediction as the extracted text is empty.")

        except ValueError as ve:
            st.error(f"File Type Error: {str(ve)}")
        except Exception as e:
            st.error(f"Error processing the file: {str(e)}")

## Python Main

if __name__ == "__main__":
    main()
