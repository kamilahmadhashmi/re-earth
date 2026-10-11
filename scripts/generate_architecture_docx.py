#!/usr/bin/env python3
"""
Generate a Microsoft Word (.docx) document for the RE—EARTH AWS Architecture & Workflow Blueprint.
"""

import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCX_OUTPUT_PATH = r"c:\Users\KIIT\OneDrive\Desktop\re-earth\RE_EARTH_AWS_Architecture_Workflow.docx"
IMAGE_PATH = r"C:\Users\KIIT\.gemini\antigravity-ide\brain\fd5c4d41-3232-4f43-9e43-d6165c1bad02\re_earth_aws_architecture_1791759517829.jpg"

def set_cell_background(cell, fill_hex):
    """Sets background color of a table cell."""
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tc_pr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets cell internal padding."""
    tc_pr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tc_pr.append(tcMar)

def create_document():
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # -------------------------------------------------------------------------
    # DOCUMENT TITLE & HEADER
    # -------------------------------------------------------------------------
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(2)
    title_run = title_p.add_run("RE—EARTH")
    title_run.font.name = "Arial"
    title_run.font.size = Pt(26)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(0, 168, 114) # Emerald

    subtitle_p = doc.add_paragraph()
    subtitle_p.paragraph_format.space_after = Pt(4)
    sub_run = subtitle_p.add_run("Enterprise AWS Cloud Architecture & End-to-End Workflow Specification")
    sub_run.font.name = "Arial"
    sub_run.font.size = Pt(14)
    sub_run.font.bold = True
    sub_run.font.color.rgb = RGBColor(26, 43, 76) # Dark Navy

    meta_p = doc.add_paragraph()
    meta_p.paragraph_format.space_after = Pt(14)
    meta_run = meta_p.add_run("System: SMRT Kiosk Planetary Network  |  AWS Region: us-east-1 (N. Virginia)  |  Version: 2.6  |  Status: PRODUCTION READY")
    meta_run.font.name = "Calibri"
    meta_run.font.size = Pt(9.5)
    meta_run.font.color.rgb = RGBColor(100, 110, 125)

    # Divider line
    div_p = doc.add_paragraph()
    div_p.paragraph_format.space_after = Pt(12)
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="12" w:space="1" w:color="00A872"/></w:pBdr>')
    div_p._p.get_or_add_pPr().append(pBdr)

    # -------------------------------------------------------------------------
    # EMBED ARCHITECTURE DIAGRAM IMAGE
    # -------------------------------------------------------------------------
    if os.path.exists(IMAGE_PATH):
        img_p = doc.add_paragraph()
        img_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        img_p.paragraph_format.space_before = Pt(4)
        img_p.paragraph_format.space_after = Pt(4)
        img_run = img_p.add_run()
        img_run.add_picture(IMAGE_PATH, width=Inches(6.8))

        caption_p = doc.add_paragraph()
        caption_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        caption_p.paragraph_format.space_after = Pt(16)
        cap_run = caption_p.add_run("Figure 1: RE—EARTH End-to-End Serverless Architecture Diagram on AWS (Zones 1 to 4)")
        cap_run.font.name = "Calibri"
        cap_run.font.size = Pt(9)
        cap_run.font.italic = True
        cap_run.font.color.rgb = RGBColor(120, 130, 140)

    # -------------------------------------------------------------------------
    # 1. EXECUTIVE SUMMARY
    # -------------------------------------------------------------------------
    h1 = doc.add_heading("1. Executive Architecture Summary", level=1)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)
    for r in h1.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(15, 76, 129)

    p_summary = doc.add_paragraph(
        "RE—EARTH is an enterprise-grade cloud and IoT e-waste diversion platform designed to connect "
        "university students, physical smart drop-off collection pods, institutional campus administrators, and "
        "corporate sponsors into a transparent, circular-economy ecosystem. The cloud backbone is implemented on "
        "Amazon Web Services (AWS) using a strictly cost-minimized, 100% serverless, event-driven pattern in "
        "us-east-1 (N. Virginia). The platform eliminates idle infrastructure costs while providing global high-performance "
        "content delivery, sub-second API transactions, automated cryptographic data wipe compliance, and immutable ledger logging."
    )
    p_summary.paragraph_format.space_after = Pt(10)
    for r in p_summary.runs:
        r.font.name = "Calibri"
        r.font.size = Pt(10.5)

    # -------------------------------------------------------------------------
    # 2. END-TO-END WORKFLOW SEQUENCE
    # -------------------------------------------------------------------------
    h2 = doc.add_heading("2. End-to-End Cloud Transaction Lifecycle", level=1)
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(6)
    for r in h2.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(15, 76, 129)

    steps = [
        ("Step 1: Edge Distribution", "The student accesses the WebGL Three.js interactive earth client served globally via AWS Amplify Hosting with edge caching, achieving ~185ms initial response latency."),
        ("Step 2: Device Discovery & Triage", "The student selects their e-waste hardware (iPhone, laptop, tablet), performs battery swell safety checks, and completes the automated NIST SP 800-88 R1 data sanitization protocol."),
        ("Step 3: Locker Allocation Request", "The client initiates an asynchronous HTTPS request via Amazon API Gateway HTTP API v2 targeting the SMRT Kiosk allocation endpoint."),
        ("Step 4: Serverless Reservation Execution", "AWS Lambda (Python 3.11) processes the reservation payload, validates campus eligibility, and writes an atomic item to Amazon DynamoDB (SmrtKioskReservations)."),
        ("Step 5: Automated TTL Policy", "DynamoDB applies a native 24-hour Time-To-Live (reservationExpiresAt epoch timestamp), guaranteeing locker reservations cleanly expire if unredeemed without running cron jobs."),
        ("Step 6: Optical QR Pass Generation", "Lambda cryptographically signs an optical 2D token (SIG-XXXXXX-CAMPUS) valid for 24 hours (1-Day Pass) and returns it to the client with remaining time displayed in hours and minutes."),
        ("Step 7: Physical Kiosk Handover", "The student walks to the physical campus pod, places the device on the automated scale, and scans the optical pass at the 2D barcode scanner."),
        ("Step 8: Mass & Criterion Verification", "The kiosk operator/controller calls API Gateway to verify declared vs. measured grams, condition triage, battery safety, and cryptographic sanitization."),
        ("Step 9: State Finalization & Ledger Commit", "Upon successful inspection, Lambda updates the locker status to COMPLETED, appends verified $CO_2e$ avoided and eco-credits to Amazon DynamoDB (SmrtInstitutionalLedger), and generates a tamper-proof NIST Certificate in Amazon S3."),
        ("Step 10: Secure Certificate Vault Access", "Students access their permanent audit certificate directly via time-bounded Amazon S3 Presigned URLs without exposing public bucket permissions.")
    ]

    for title, desc in steps:
        p_step = doc.add_paragraph()
        p_step.paragraph_format.space_after = Pt(4)
        p_step.paragraph_format.left_indent = Inches(0.2)
        r_num = p_step.add_run(f"• {title}: ")
        r_num.font.name = "Arial"
        r_num.font.size = Pt(10)
        r_num.font.bold = True
        r_num.font.color.rgb = RGBColor(0, 128, 128)

        r_body = p_step.add_run(desc)
        r_body.font.name = "Calibri"
        r_body.font.size = Pt(10)

    # -------------------------------------------------------------------------
    # 3. DETAILED 4 ARCHITECTURAL ZONES
    # -------------------------------------------------------------------------
    h3 = doc.add_heading("3. Detailed Specification of the 4 Architectural Zones", level=1)
    h3.paragraph_format.space_before = Pt(14)
    h3.paragraph_format.space_after = Pt(6)
    for r in h3.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(15, 76, 129)

    zones = [
        ("Zone 1: Student Client & Smart Kiosk",
         "The physical and edge interaction plane. Features a Three.js WebGL globe, real-time campus transit overlay, "
         "NIST SP 800-88 R1 step-by-step cryptographic wipe protocol, 1-Day Optical QR Token generator, and physical smart kiosk "
         "pod hardware equipped with a precision digital load-cell scale, 2D scanner, and motorized hatch solenoid."),

        ("Zone 2: Edge & API Ingress Layer",
         "Combines AWS Amplify Hosting (App ID: d3cukmq7nr5vg3) with Amazon API Gateway HTTP API v2 (API ID: bzj8npggw7). "
         "Amplify serves client single-page assets globally with automated SSL and edge points of presence. API Gateway routes "
         "low-latency microservices with full CORS validation for both local developer environments and cloud production domains."),

        ("Zone 3: Serverless Processing Microservices",
         "Powered by AWS Lambda (Function: re-earth-api-service, Runtime: Python 3.11). Executes stateless business logic including "
         "NIST sanitization verification, token signature validation, locker availability checks, eco-credits and campus XP multiplier "
         "calculations, and S3 certificate document generation with sub-100ms execution times."),

        ("Zone 4: Cloud Persistence, Compliance Vault & Telemetry",
         "Consists of three core cloud primitives: Amazon DynamoDB for NoSQL reservations with TTL (SmrtKioskReservations) and append-only "
         "university sustainability ledgers (SmrtInstitutionalLedger); Amazon S3 (Bucket: re-earth-certificates-346560662330) for private "
         "certificate archives accessed via short-lived Presigned URLs; and Amazon CloudWatch for live operational dashboards and alarms.")
    ]

    for z_title, z_body in zones:
        p_z = doc.add_paragraph()
        p_z.paragraph_format.space_after = Pt(6)
        r_zt = p_z.add_run(f"■ {z_title}\n")
        r_zt.font.name = "Arial"
        r_zt.font.size = Pt(11)
        r_zt.font.bold = True
        r_zt.font.color.rgb = RGBColor(26, 43, 76)

        r_zb = p_z.add_run(z_body)
        r_zb.font.name = "Calibri"
        r_zb.font.size = Pt(10)

    # -------------------------------------------------------------------------
    # 4. ACTIVE AWS SERVICES REGISTRY TABLE
    # -------------------------------------------------------------------------
    h4 = doc.add_heading("4. Active AWS Services & Resource Registry", level=1)
    h4.paragraph_format.space_before = Pt(14)
    h4.paragraph_format.space_after = Pt(6)
    for r in h4.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(15, 76, 129)

    table_data = [
        ("AWS Service", "Resource Name / Identifier", "Operational Role in RE—EARTH", "Status"),
        ("AWS Amplify", "re-earth (d3cukmq7nr5vg3)", "Global Edge Hosting & CDN Delivery (branch: main)", "LIVE (HTTP 200)"),
        ("Amazon API Gateway", "re-earth-http-api (bzj8npggw7)", "HTTP API v2 Microservice Ingress & CORS Router", "ACTIVE (Low Latency)"),
        ("AWS Lambda", "re-earth-api-service", "Serverless NIST Sanitization & Reservation Compute (Python 3.11)", "ACTIVE (us-east-1)"),
        ("Amazon DynamoDB", "SmrtKioskReservations", "NoSQL Table with Automated TTL on reservationExpiresAt", "ACTIVE (TTL Enabled)"),
        ("Amazon DynamoDB", "SmrtInstitutionalLedger", "Append-Only Campus Recycling Volume & Derby Ledger", "ACTIVE (Pay-Per-Request)"),
        ("Amazon S3", "re-earth-certificates-346560662330", "Secure Compliance Vault with Presigned URL Access", "ACTIVE (Private)"),
        ("Amazon CloudWatch", "RE-EARTH-Amplify-Operations", "Operational Dashboard with Edge Health & Latency Alarms", "ACTIVE (Healthy [OK])")
    ]

    table = doc.add_table(rows=len(table_data), cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_widths = [Inches(1.4), Inches(1.8), Inches(2.6), Inches(1.2)]

    for row_idx, row_content in enumerate(table_data):
        row = table.rows[row_idx]
        is_header = (row_idx == 0)
        for col_idx, cell_value in enumerate(row_content):
            cell = row.cells[col_idx]
            cell.width = col_widths[col_idx]
            cell.text = cell_value
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)

            run = p.runs[0]
            if is_header:
                run.font.name = "Arial"
                run.font.size = Pt(9.5)
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
                set_cell_background(cell, "1A2B4C") # Navy
            else:
                run.font.name = "Calibri"
                run.font.size = Pt(9)
                if col_idx == 3:
                    run.font.bold = True
                    run.font.color.rgb = RGBColor(0, 128, 64) # Green
                bg_color = "F4F6F9" if row_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=100, bottom=100, left=120, right=120)

    # -------------------------------------------------------------------------
    # 5. KEY ARCHITECTURAL ADVANTAGES
    # -------------------------------------------------------------------------
    h5 = doc.add_heading("5. Architectural Advantages & Principles", level=1)
    h5.paragraph_format.space_before = Pt(16)
    h5.paragraph_format.space_after = Pt(6)
    for r in h5.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(15, 76, 129)

    advantages = [
        ("Strict Cost Minimization ($0.00 Idle Cost)", "The platform uses exclusively serverless, on-demand primitives. During periods of zero campus recycling activity, zero server instances run and zero hourly compute charges accrue."),
        ("Automated Lifecycle with DynamoDB TTL", "Native DynamoDB TTL removes the need for recurring worker daemons or scheduled cron tasks. Locker slots automatically release after their 24-hour expiration window."),
        ("Zero-Trust Security & S3 Presigned URLs", "The certificates bucket completely blocks public read/write access. Clients receive short-lived (15–60 minute) presigned URLs generated on the fly via IAM execution roles."),
        ("Edge Observability & Latency SLA", "Amazon CloudWatch synthetic probes continually verify that the global edge endpoint responds in under 2,500ms (typically ~185ms), firing automated alarms if health anomalies occur.")
    ]

    for adv_t, adv_d in advantages:
        p_adv = doc.add_paragraph()
        p_adv.paragraph_format.space_after = Pt(4)
        p_adv.paragraph_format.left_indent = Inches(0.2)
        r_t = p_adv.add_run(f"✓ {adv_t}: ")
        r_t.font.name = "Arial"
        r_t.font.size = Pt(9.5)
        r_t.font.bold = True
        r_t.font.color.rgb = RGBColor(0, 168, 114)
        r_d = p_adv.add_run(adv_d)
        r_d.font.name = "Calibri"
        r_d.font.size = Pt(9.5)

    # Save to disk
    doc.save(DOCX_OUTPUT_PATH)
    print(f"Document successfully saved to: {DOCX_OUTPUT_PATH}")

if __name__ == "__main__":
    create_document()
