import pickle
import re
import numpy as np

## Loading Models
model = pickle.load(open('./Job_Role/Model/job-role-prediction-model.pkl', 'rb'))
tfidf = pickle.load(open('./Job_Role/Model/tfidf.pkl', 'rb'))
category_map = pickle.load(open('./Job_Role/Model/job-role-dict.pkl', 'rb'))


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