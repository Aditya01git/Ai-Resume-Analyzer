# app.py
import streamlit as st
from Analyze_Resume import workflow, ResumeState
import PyPDF2

# ---------------------------
# Function to extract PDF text
# ---------------------------
def get_resume_content(resume_file) -> str:
    pdf_reader = PyPDF2.PdfReader(resume_file)
    text = ''
    for page in pdf_reader.pages:
        text += page.extract_text() or ''
    return text

def display_points(title, points):
    st.markdown(f"### {title}")
    if isinstance(points, list):
        for p in points:
            st.markdown(f"- {p.content}")
    else:
        st.markdown(points)


# ---------------------------
# Streamlit frontend
# ---------------------------
def main():
    st.set_page_config(page_title="Resume Analyzer", page_icon="📄", layout="wide")

    st.title("📄 Resume Analyzer")
    st.markdown(
        "Upload a resume in PDF format and get predicted job categories, scores, and analysis."
    )

    uploaded_file = st.file_uploader("Upload a Resume", type=["pdf"])

    if uploaded_file is not None:
        uploaded_file.seek(0)
        resume_text = get_resume_content(uploaded_file)

        if resume_text:
            st.success("Successfully extracted text from the uploaded resume.")
        else:
            st.warning("The file was read, but no meaningful text was extracted.")

        if st.checkbox("Show extracted text", False):
            st.text_area("Extracted Resume Text", resume_text, height=300)

        if resume_text:
            st.subheader("Predicted Category & Resume Analysis")
            initial_state: ResumeState = {'resume_content': resume_text}

            try:
                final_state: ResumeState = workflow.invoke(initial_state)

                # Display results
                st.markdown(f"""
**ATS Score:** {final_state.get('ats_score', 'N/A')}  
**Overall Score:** {final_state.get('overall_score', 'N/A')}  
**AI Job Category:** {final_state.get('ai_job_category', 'N/A')}  
**ML Job Category:** {final_state.get('ml_job_category', 'N/A')}  
""")

                display_points("Strengths", final_state.get('strengths', []))
                display_points("Weaknesses", final_state.get('weakness', []))
                display_points("Key Improvements", final_state.get('key_improvements', []))

                st.markdown(f"**Conclusion:** {final_state.get('conclusion', 'N/A')}")

            except Exception as e:
                st.error(f"Workflow failed: {str(e)}")
        else:
            st.error("Cannot make a prediction as the extracted text is empty.")


if __name__ == "__main__":
    main()