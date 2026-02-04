from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, 
    Paragraph, 
    Spacer, 
    Table, 
    TableStyle,
    ListFlowable,
    ListItem
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.colors import HexColor
import os
import PyPDF2

def generate_resume_report(json_data: dict, user_name: str, output_path: str = "resume_analysis_report.pdf"):
    """
    Generates a beautiful PDF report from the resume analysis JSON data, excluding resume_content and job_description.
    Saves the PDF to the specified path and returns the PDF as a bytes object.
    
    Args:
    - json_data: Dict containing the analysis.
    - user_name: Name of the user (e.g., "Anuj Rawat").
    - output_path: Path to save the PDF (default: "resume_analysis_report.pdf").
    
    Returns:
    - bytes: The PDF content as a bytes object.
    
    Raises:
    - ValueError: If the generated PDF is invalid or corrupted.
    """
    # Extract clean lists from nested structures
    strengths = [item for item in json_data.get('strengths', [])]
    weaknesses = [item for item in json_data.get('weakness', [])]
    content_improvements = [item for item in json_data.get('content_improvements', [])]
    format_design_improvements = [item for item in json_data.get('format_design_improvements', [])]
    key_improvements = [item for item in json_data.get('key_improvements', [])]
    
    ats_score = json_data.get('ats_score', 0)
    content_score = json_data.get('content_score', 0)
    format_design_score = json_data.get('format_design_score', 0)
    overall_score = json_data.get('overall_score', 0)
    ai_category = json_data.get('ai_job_category', 'N/A')
    ml_category = json_data.get('ml_job_category', 'N/A')
    conclusion = json_data.get('conclusion', '')
    
    # Create a BytesIO buffer to capture PDF content
    pdf_buffer = BytesIO()
    
    # Create PDF document for in-memory buffer
    buffer_doc = SimpleDocTemplate(pdf_buffer, pagesize=A4)
    
    # Custom styles for beauty
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=18,
        spaceAfter=30,
        textColor=HexColor('#1e3a8a'),  # Dark blue
        alignment=TA_CENTER
    )
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=12,
        textColor=HexColor('#1e40af'),  # Blue
        spaceBefore=20
    )
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        alignment=TA_JUSTIFY,
        spaceAfter=8
    )
    
    # Story (content elements)
    story = []
    
    # Title
    title = Paragraph(f"Resume Analysis Report<br/><i>For {user_name}</i>", title_style)
    story.append(title)
    story.append(Spacer(1, 0.3 * inch))
    
    # Summary Table
    summary_data = [
        ['Metric', 'Value'],
        ['ATS Score', f"{ats_score}/100"],
        ['Content Score', f"{content_score}/100"],
        ['Format/Design Score', f"{format_design_score}/100"],
        ['Overall Score', f"{overall_score}/100"],
        ['AI Predicted Job Category', ai_category],
        ['ML Model Predicted Job Category', ml_category]
    ]
    summary_table = Table(summary_data, colWidths=[2.5*inch, 3.5*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1e40af')),  # Header blue
        ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),    # White text
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f8fafc')),  # Light gray
        ('GRID', (0, 0), (-1, -1), 1, HexColor('#cbd5e1'))     # Light border
    ]))
    story.append(Paragraph("Summary", heading_style))
    story.append(summary_table)
    story.append(Spacer(1, 0.3 * inch))
    
    # Strengths Section
    story.append(Paragraph("Strengths", heading_style))
    strengths_list = ListFlowable(
        [ListItem(Paragraph(s, normal_style)) for s in strengths],
        bulletFontSize=10,
        bulletIndent=20,
        leftIndent=30,
        spaceBefore=6,
        bulletColor=HexColor('#059669'),  # Green
        bulletFontName='Helvetica'
    )
    story.append(strengths_list)
    story.append(Spacer(1, 0.2 * inch))
    
    # Weaknesses Section
    story.append(Paragraph("Weaknesses", heading_style))
    weaknesses_list = ListFlowable(
        [ListItem(Paragraph(w, normal_style)) for w in weaknesses],
        bulletFontSize=10,
        bulletIndent=20,
        leftIndent=30,
        spaceBefore=6,
        bulletColor=HexColor('#dc2626'),  # Red
        bulletFontName='Helvetica'
    )
    story.append(weaknesses_list)
    story.append(Spacer(2, 0.2 * inch))
    
    # Content Improvements Section
    story.append(Paragraph("Content Improvements", heading_style))
    content_improvements_list = ListFlowable(
        [ListItem(Paragraph(i, normal_style)) for i in content_improvements],
        bulletFontSize=10,
        bulletIndent=20,
        leftIndent=30,
        spaceBefore=6,
        bulletColor=HexColor('#d97706'),  # Orange
        bulletFontName='Helvetica'
    )
    story.append(content_improvements_list)
    story.append(Spacer(1, 0.2 * inch))
    
    # Format/Design Improvements Section
    story.append(Paragraph("Format/Design Improvements", heading_style))
    format_design_improvements_list = ListFlowable(
        [ListItem(Paragraph(i, normal_style)) for i in format_design_improvements],
        bulletFontSize=10,
        bulletIndent=20,
        leftIndent=30,
        spaceBefore=6,
        bulletColor=HexColor('#d97706'),  # Orange
        bulletFontName='Helvetica'
    )
    story.append(format_design_improvements_list)
    story.append(Spacer(1, 0.2 * inch))
    
    # Key Improvements Section
    story.append(Paragraph("Key Improvements", heading_style))
    improvements_list = ListFlowable(
        [ListItem(Paragraph(i, normal_style)) for i in key_improvements],
        bulletFontSize=10,
        bulletIndent=20,
        leftIndent=30,
        spaceBefore=6,
        bulletColor=HexColor('#d97706'),  # Orange
        bulletFontName='Helvetica'
    )
    story.append(improvements_list)
    story.append(Spacer(1, 0.2 * inch))
    
    # Conclusion
    story.append(Paragraph("Conclusion", heading_style))
    conclusion_para = Paragraph(conclusion, normal_style)
    story.append(conclusion_para)
    
    # Build PDF for in-memory buffer (single build)
    buffer_doc.build(story)
    
    # Get the PDF bytes from the buffer
    pdf_bytes = pdf_buffer.getvalue()
    
    # Validate PDF bytes
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
        if len(pdf_reader.pages) == 0:
            raise ValueError("Generated PDF is empty")
    except Exception as e:
        pdf_buffer.close()
        raise ValueError(f"Generated PDF is invalid: {str(e)}")
    
    # Save the validated pdf_bytes to the local file
    os.makedirs(os.path.dirname(output_path), exist_ok=True)  # Ensure directory exists
    with open(output_path, "wb") as f:
        f.write(pdf_bytes)
    print(f"PDF report generated successfully at: {output_path}")
    
    # Clean up the buffer
    pdf_buffer.close()
    
    # Return the PDF bytes
    return pdf_bytes