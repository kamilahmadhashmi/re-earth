#!/usr/bin/env python3
"""
Generate a comprehensive, publication-quality Microsoft Word (.docx) document
for the entire RE—EARTH project, including embedded high-resolution pictures,
tables, executive callouts, and in-depth architectural and operational specifications.
"""

import os
import shutil
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCX_OUTPUT_PATH = r"c:\Users\KIIT\OneDrive\Desktop\re-earth\RE_EARTH_Comprehensive_Project_Documentation.docx"
ARTIFACT_DOCX_PATH = r"C:\Users\KIIT\.gemini\antigravity-ide\brain\fd5c4d41-3232-4f43-9e43-d6165c1bad02\RE_EARTH_Comprehensive_Project_Documentation.docx"

IMAGE_HERO = r"C:\Users\KIIT\.gemini\antigravity-ide\brain\fd5c4d41-3232-4f43-9e43-d6165c1bad02\re_earth_hero_cover_1791760141084.jpg"
IMAGE_KIOSK = r"C:\Users\KIIT\.gemini\antigravity-ide\brain\fd5c4d41-3232-4f43-9e43-d6165c1bad02\re_earth_smart_kiosk_1791760160361.jpg"
IMAGE_SKYLINE = r"C:\Users\KIIT\.gemini\antigravity-ide\brain\fd5c4d41-3232-4f43-9e43-d6165c1bad02\re_earth_sponsor_skyline_1791760180796.jpg"
IMAGE_AWS = r"C:\Users\KIIT\.gemini\antigravity-ide\brain\fd5c4d41-3232-4f43-9e43-d6165c1bad02\re_earth_aws_architecture_1791759517829.jpg"

# Color Palette Constants
COLOR_PRIMARY_HEX = "00A872"      # Emerald Green
COLOR_NAVY_HEX = "1A2B4C"         # Deep Navy
COLOR_SLATE_HEX = "64707D"        # Slate Grey
COLOR_LIGHT_BG_HEX = "F4FBF7"     # Ultra-light Emerald Tint
COLOR_BOX_BG_HEX = "F0F4F8"       # Light Slate Background
COLOR_ACCENT_HEX = "008F62"       # Dark Emerald

COLOR_PRIMARY = RGBColor(0, 168, 114)
COLOR_NAVY = RGBColor(26, 43, 76)
COLOR_SLATE = RGBColor(100, 112, 125)
COLOR_BODY = RGBColor(35, 45, 55)

def set_cell_background(cell, fill_hex):
    """Sets background color of a table cell."""
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tc_pr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    """Sets cell internal padding in dxa (1 pt = 20 dxa)."""
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

def add_callout(doc, title, text, border_color_hex=COLOR_PRIMARY_HEX, bg_color_hex=COLOR_LIGHT_BG_HEX):
    """Creates a beautifully styled single-cell callout box."""
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.8)
    cell = tbl.rows[0].cells[0]
    set_cell_background(cell, bg_color_hex)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

    # Left border only (accent line)
    tc_pr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color_hex}"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tc_pr.append(tcBorders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(3)
    r_t = p.add_run(f"★  {title}\n")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(11)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_NAVY

    r_body = p.add_run(text)
    r_body.font.name = "Calibri"
    r_body.font.size = Pt(10)
    r_body.font.color.rgb = COLOR_BODY

    # Spacer after table
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(6)

def style_heading_1(p, text):
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Arial"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = COLOR_NAVY
    return r

def style_heading_2(p, text):
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Arial"
    r.font.size = Pt(12.5)
    r.font.bold = True
    r.font.color.rgb = COLOR_PRIMARY
    return r

def style_heading_3(p, text):
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = COLOR_NAVY
    return r

def add_body_p(doc, text, bold_prefix="", space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(10.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_NAVY
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(10.5)
    r.font.color.rgb = COLOR_BODY
    return p

def add_bullet_p(doc, bold_prefix, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_b = p.add_run(bold_prefix + ": ")
        r_b.font.name = "Calibri"
        r_b.font.size = Pt(10)
        r_b.font.bold = True
        r_b.font.color.rgb = COLOR_NAVY
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(10)
    r.font.color.rgb = COLOR_BODY
    return p

def add_image_figure(doc, image_path, caption_text, width_inches=6.8):
    if os.path.exists(image_path):
        img_p = doc.add_paragraph()
        img_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        img_p.paragraph_format.space_before = Pt(8)
        img_p.paragraph_format.space_after = Pt(4)
        run = img_p.add_run()
        run.add_picture(image_path, width=Inches(width_inches))

        cap_p = doc.add_paragraph()
        cap_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap_p.paragraph_format.space_after = Pt(12)
        c_run = cap_p.add_run(caption_text)
        c_run.font.name = "Calibri"
        c_run.font.size = Pt(9)
        c_run.font.italic = True
        c_run.font.color.rgb = COLOR_SLATE

def build_full_documentation():
    print("Initializing Document Creation...")
    doc = Document()

    # Configure Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # =========================================================================
    # DOCUMENT COVER / TITLE
    # =========================================================================
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(2)
    t_run = title_p.add_run("RE—EARTH")
    t_run.font.name = "Arial"
    t_run.font.size = Pt(28)
    t_run.font.bold = True
    t_run.font.color.rgb = COLOR_PRIMARY

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(4)
    s_run = sub_p.add_run("Autonomous E-Waste Diversion & Circular Economy Platform\nComprehensive Project Documentation & System Specification")
    s_run.font.name = "Arial"
    s_run.font.size = Pt(14)
    s_run.font.bold = True
    s_run.font.color.rgb = COLOR_NAVY

    meta_p = doc.add_paragraph()
    meta_p.paragraph_format.space_after = Pt(12)
    m_run = meta_p.add_run("Version: 3.0 Production  |  Cloud Backbone: AWS Serverless (us-east-1)  |  Target Audience: University Campuses & Municipal Hubs")
    m_run.font.name = "Calibri"
    m_run.font.size = Pt(9.5)
    m_run.font.color.rgb = COLOR_SLATE

    # Top Divider
    div_p = doc.add_paragraph()
    div_p.paragraph_format.space_after = Pt(12)
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="18" w:space="1" w:color="{COLOR_PRIMARY_HEX}"/></w:pBdr>')
    div_p._p.get_or_add_pPr().append(pBdr)

    # Embed Figure 1: Hero Visual
    add_image_figure(
        doc,
        IMAGE_HERO,
        "Figure 1: RE—EARTH System Vision — 3D Planetary Digital Twin & Autonomous Campus SMRT Drop-off Hub",
        width_inches=6.8
    )

    # Executive Overview Callout
    add_callout(
        doc,
        "Executive Abstract",
        "RE—EARTH is an end-to-end cyber-physical e-waste diversion ecosystem that transforms electronic disposal "
        "from an opaque, toxic hazard into an engaging, gamified circular economy experience. By integrating physical "
        "IoT SMRT Kiosks, real-time 3D WebGL digital twins, cryptographic data wipe certifications (NIST SP 800-88 R1), "
        "tokenized student incentives, and corporate ESG sponsor underwriting on AWS, RE—EARTH achieves measurable, "
        "verified diversion of critical silicon, rare earth minerals, and hazardous lithium compounds."
    )

    # =========================================================================
    # SECTION 1: WHAT IS RE—EARTH?
    # =========================================================================
    h1 = doc.add_paragraph()
    style_heading_1(h1, "1. What is RE—EARTH? (Project Definition & Vision)")

    add_body_p(
        doc,
        "RE—EARTH is a next-generation circular economy platform engineered specifically to tackle the runaway "
        "accumulation of discarded consumer electronics across university campuses, research institutes, and modern smart cities. "
        "At its core, RE—EARTH bridges physical hardware collection with an immersive digital twin infrastructure."
    )

    add_body_p(
        doc,
        "Rather than relying on passive recycling bins that suffer from contamination, neglect, and lack of accountability, "
        "RE—EARTH establishes an autonomous network of IoT-enabled 'SMRT Kiosks' linked dynamically to a 3D WebGL planetary dashboard. "
        "Every single discarded smartphone, laptop, lithium battery, or accessory deposited into a kiosk is weighed, optically scanned, "
        "cryptographically certified for data sanitization, and credited to the student or department responsible."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "1.1 The Four Core Pillars of the Platform")

    add_bullet_p(doc, "Autonomous Hardware Intake", "Physical campus kiosks equipped with optical scanners, precision load-cell scales, automated solenoid hatch locks, and fire-suppression isolation lockers.")
    add_bullet_p(doc, "Interactive 3D Digital Twin", "A planetary WebGL globe (Three.js) rendering real-time pod telemetry, student drop-off orbital trajectories, college leaderboard heatmaps, and campus derbies.")
    add_bullet_p(doc, "Cryptographic Data Sanitization", "A secure 'Tech Vault' providing automated NIST SP 800-88 R1 compliant data destruction certification, eliminating data theft anxiety for discarding students.")
    add_bullet_p(doc, "Corporate ESG Sponsor Engine", "A 3D Skyline Forest where corporate environmental investments directly underwrite student recycling incentives and campus collection infrastructure.")

    # =========================================================================
    # SECTION 2: WHY ARE WE MAKING IT? (THE E-WASTE CRISIS)
    # =========================================================================
    h1 = doc.add_paragraph()
    style_heading_1(h1, "2. Why Are We Making It? (Problem Statement & Ecological Imperative)")

    add_body_p(
        doc,
        "Modern civilization faces an unprecedented material paradox: while demand for computing power and consumer "
        "electronics reaches historic highs, the global capacity to safely reclaim post-consumer electronics is collapsing."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "2.1 The Global Silicon & Electronic Waste Dilemma")

    add_body_p(
        doc,
        "According to the United Nations Global E-waste Monitor, the world generates over 62 million metric tonnes of electronic "
        "waste annually—a figure growing five times faster than documented recycling capacity. Less than 22.3% of this volume is "
        "formally collected and recycled. The remaining 78% is dumped in municipal landfills, incinerated, or shipped to developing nations, "
        "where primitive processing poisons groundwater and exposes vulnerable communities to heavy toxins."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "2.2 The College Campus Bottleneck")

    add_body_p(
        doc,
        "Higher education campuses represent one of the densest per-capita concentrations of personal electronic consumption on Earth. "
        "Students, faculty, and laboratories replace laptops, smartphones, charging accessories, and headphones every 12 to 24 months. "
        "Yet, when surveyed, university students cite three distinct bottlenecks preventing proper recycling:"
    )

    add_bullet_p(doc, "The Convenience Gap", "Traditional e-waste collection sites are located in remote industrial yards or open for only a few hours once per semester.")
    add_bullet_p(doc, "The Data Paranoia Factor", "Over 74% of students hoard old devices in dorm drawers ('dormant silicon') because they fear personal photographs, passwords, or banking data will be extracted if the device is handed to an unverified collection bin.")
    add_bullet_p(doc, "The Lack of Tangible Incentive", "Altruism alone does not overcome the friction of finding a disposal depot. Without immediate feedback, tokenized recognition, or campus rewards, devices remain discarded in trash chutes.")

    h2 = doc.add_paragraph()
    style_heading_2(h2, "2.3 The Toxicity Matrix & Rare Earth Mineral Scarcity")

    add_body_p(
        doc,
        "E-waste constitutes only 2% of solid waste in landfills by volume, yet accounts for 70% of toxic heavy metals entering water tables. "
        "Conversely, discarded electronics are the richest mineral deposits on Earth:"
    )

    # Toxicity vs Recovery Table
    table_tox = doc.add_table(rows=5, cols=4)
    table_tox.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_tox.autofit = False

    headers = ["Material Component", "Ecological Hazard if Landfilled", "Scrap & Resource Value", "RE—EARTH Action"]
    col_widths = [Inches(1.5), Inches(2.0), Inches(1.8), Inches(1.5)]

    hdr_row = table_tox.rows[0]
    for idx, heading in enumerate(headers):
        cell = hdr_row.cells[idx]
        cell.width = col_widths[idx]
        set_cell_background(cell, COLOR_NAVY_HEX)
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(heading)
        r.font.name = "Arial"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    tox_data = [
        ("Lithium-Ion Cells", "Thermal runaway, groundwater lithium toxicity, explosive fires in compaction trucks", "Cobalt, Nickel, high-grade Lithium carbonate", "Hermetically isolated fire-safe intake with sensor telemetry"),
        ("Motherboards & PCBs", "Leaching Lead (Pb), Cadmium (Cd), and Brominated Flame Retardants (BFRs)", "Gold (Au: 300g/tonne vs 5g/tonne virgin ore), Copper (Cu), Palladium", "Automated scrap grading, high-efficiency smelting routing"),
        ("Displays (OLED/LCD)", "Mercury vapor from backlights, Indium tin oxide chemical dispersion", "Indium, optical-grade glass, reclaimable micro-diodes", "Cracked screen triage; refurbishment vs material shredding"),
        ("Copper Cabling & Adapters", "PVC insulation releases carcinogenic dioxins when burned in open pits", "Ultra-high purity Copper (Cu) electrical conductor wiring", "Weight-based automated Karma conversion; zero-burn stripping")
    ]

    for row_idx, data in enumerate(tox_data, start=1):
        row = table_tox.rows[row_idx]
        bg = "FFFFFF" if row_idx % 2 == 1 else COLOR_BOX_BG_HEX
        for c_idx, val in enumerate(data):
            cell = row.cells[c_idx]
            cell.width = col_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_NAVY
            else:
                r.font.color.rgb = COLOR_BODY

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # =========================================================================
    # SECTION 3: KEY SYSTEM FEATURES
    # =========================================================================
    h1 = doc.add_paragraph()
    style_heading_1(h1, "3. Key Features of the RE—EARTH Platform")

    add_body_p(
        doc,
        "The RE—EARTH system represents a complete operational stack integrating frontend interaction, "
        "cloud microservices, cryptographic validation, and physical kiosk robotics."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "3.1 Autonomous SMRT Kiosks (Hardware IoT Pods)")
    add_body_p(
        doc,
        "The physical anchor of RE—EARTH is the SMRT Kiosk network deployed across university campus dormitories, "
        "student unions, engineering quads, and dining commons. Each kiosk features a ruggedized brushed aluminum chassis, "
        "a multi-touch sunlight-readable OLED interface, high-speed optical barcode/QR scanners, a high-precision digital load-cell scale, "
        "and electronically controlled intake compartments."
    )

    # Embed Figure 2: Kiosk Hardware Design
    add_image_figure(
        doc,
        IMAGE_KIOSK,
        "Figure 2: RE—EARTH SMRT Kiosk Hardware Architecture — Sensor Intake, Precision Scale, and Fire-Suppression Locker",
        width_inches=6.8
    )

    add_bullet_p(doc, "Precision Load-Cell Scale", "Instantly verifies deposited device mass to ±1 gram precision, preventing fraud or empty package deposits.")
    add_bullet_p(doc, "Active Hazard Thermal Chamber", "Lithium battery compartment insulated with aerosol fire suppression and thermocouple temperature monitoring to detect thermal runaway.")
    add_bullet_p(doc, "Solenoid Locking Hatches", "Intake chutes remain mechanically locked until a valid 1-Day Pass QR code is verified against the cloud database.")

    h2 = doc.add_paragraph()
    style_heading_2(h2, "3.2 Real-Time 3D WebGL Digital Twin (Three.js Earth)")
    add_body_p(
        doc,
        "The central web experience features an interactive 3D WebGL planetary globe rendered using custom Three.js shaders. "
        "Every campus pod is mapped with exact geospatial coordinates. Glowing orbital arcs animate when items are deposited, "
        "visualizing the real-time diversion of e-waste from university grounds into certified recycling channels."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "3.3 Cryptographic NIST SP 800-88 R1 Data Sanitization & Tech Vault")
    add_body_p(
        doc,
        "To decisively eradicate user fear regarding data theft, RE—EARTH embeds an automated data sanitization protocol. "
        "Students depositing computers, tablets, or phones choose between Cryptographic Overwrite (NIST SP 800-88 R1 Clear/Purge) "
        "or Physical Media Destruction (Degaussing/Shredding). Upon intake, the system signs a digital Certificate of Destruction "
        "with an immutable SHA-256 hash stored in the user's Tech Vault."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "3.4 Gamified Campus Derbies & Inter-College Leaderboard")
    add_body_p(
        doc,
        "Universities thrive on collegiate rivalry. RE—EARTH channels this energy into environmental restoration through "
        "real-time Campus Derbies. Dormitories, academic colleges (e.g., School of Engineering vs. School of Law), and sister campuses "
        "compete on a live public leaderboard tracking total kilograms diverted, grams of gold recovered, and net carbon abatement."
    )

    # =========================================================================
    # SECTION 4: OTHER FEATURES (AUDIO, SPONSORS & CLOUD ARCHITECTURE)
    # =========================================================================
    h1 = doc.add_paragraph()
    style_heading_1(h1, "4. Other Distinctive Features")

    h2 = doc.add_paragraph()
    style_heading_2(h2, "4.1 3D Sponsor Skyline Forest")
    add_body_p(
        doc,
        "RE—EARTH re-envisions corporate environmental philanthropy through the 3D Sponsor Skyline Forest. "
        "Corporate partners (e.g., Microsoft, Google, Tesla, Intel) sponsor kiosk networks, student reward pools, and recycling logistics. "
        "In return, their contributions materialize as glowing corporate skyscraper towers in a procedurally generated 3D forest, "
        "with tower height and foliage density mathematically linked to their verified metric tons of diverted carbon."
    )

    # Embed Figure 3: Sponsor Skyline
    add_image_figure(
        doc,
        IMAGE_SKYLINE,
        "Figure 3: 3D Sponsor Skyline Forest — Corporate ESG Skyscrapers and Verified Live Carbon Offset Trees",
        width_inches=6.8
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "4.2 Cybernetic Web Audio API Soundscape Engine")
    add_body_p(
        doc,
        "To provide a responsive, high-tech tactile feel without network latency or bloated audio file downloads, "
        "RE—EARTH features an embedded procedural synthesizer powered by the native browser Web Audio API. "
        "Every UI button hover, stage transition, pod selection, and pass generation triggers micro-synthesized harmonic frequencies, "
        "holographic scan hums, and electronic hatch release sounds."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "4.3 'Volt' the Autonomous Cyber-Feline AI Companion")
    add_body_p(
        doc,
        "Guiding users through the platform is 'Volt', an interactive AI cyber-feline mascot rendered with custom SVG and dynamic state animations. "
        "Volt provides real-time guidance during device triage, explains rare earth mineral composition, gives tips on safe lithium handling, "
        "and celebrates milestone achievements when users reach new ecological karma levels."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "4.4 Dynamic 1-Day Pass Generation System")
    add_body_p(
        doc,
        "Physical kiosk access is protected by dynamic, time-limited 1-Day Passes. Each pass contains a secure cryptographic token "
        "and QR code valid for exactly 24 hours. The interface displays human-readable remaining time: hours remaining when plenty of time "
        "remains, seamlessly switching to minutes remaining during the final hour to maintain urgency without distracting second-by-second countdown flicker."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "4.5 Enterprise Serverless AWS Cloud Infrastructure")
    add_body_p(
        doc,
        "The RE—EARTH backend is deployed on Amazon Web Services (AWS) using a strictly cost-minimized, 100% serverless, event-driven pattern in us-east-1. "
        "Static and WebGL web assets are served globally via AWS Amplify and Amazon CloudFront edge nodes. Dynamic API calls route through "
        "Amazon API Gateway into AWS Lambda functions executing Python 3.12 microservices, with persistent state stored in Amazon DynamoDB "
        "and audit certificates archived in Amazon S3 with immutable Object Lock."
    )

    # Embed Figure 4: AWS Cloud Architecture
    add_image_figure(
        doc,
        IMAGE_AWS,
        "Figure 4: Complete RE—EARTH Cloud Architecture on Amazon Web Services (AWS 4-Zone Serverless Topology)",
        width_inches=6.8
    )

    # =========================================================================
    # SECTION 5: STEP-BY-STEP PRODUCT SUBMISSION WALKTHROUGH
    # =========================================================================
    h1 = doc.add_paragraph()
    style_heading_1(h1, "5. How to Submit a Product: Step-by-Step Walkthrough")

    add_body_p(
        doc,
        "The product submission flow is designed to eliminate all friction. A user can complete the entire process from dorm room "
        "to kiosk locker in under 90 seconds through the intelligent 6-Stage Recycling Wizard."
    )

    # Table of 6 Stages
    table_stages = doc.add_table(rows=7, cols=4)
    table_stages.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_stages.autofit = False

    stg_headers = ["Stage", "Phase Title", "User Action & Input", "System Processing & Output"]
    stg_widths = [Inches(1.0), Inches(1.8), Inches(2.2), Inches(1.8)]

    hdr_r = table_stages.rows[0]
    for idx, heading in enumerate(stg_headers):
        cell = hdr_r.cells[idx]
        cell.width = stg_widths[idx]
        set_cell_background(cell, COLOR_NAVY_HEX)
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(heading)
        r.font.name = "Arial"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    stages_data = [
        ("Stage 1", "Hardware Categorization", "User selects item type from tactile cards: Smartphones, Laptops, Tablets, Lithium Batteries, Peripherals, or Scrap Circuit Boards.", "Platform retrieves material composition coefficients and current secondary market scrap index from DynamoDB."),
        ("Stage 2", "Condition & Triage", "User specifies operational health: Like-New, Working with Wear, Damaged Screen, Non-Functional Scrap, or Swollen Battery.", "Determines whether unit is routed for Refurbishment/Resale, Board Harvest, or Raw Smelter Extraction."),
        ("Stage 3", "Ecological Impact Valuation", "User reviews instant real-time calculation breakdown of their contribution.", "Displays estimated Gold (mg), Lithium (g), Copper (g), CO2 abated (kg), and calculated Karma Points reward."),
        ("Stage 4", "Data Sanitization Protocol", "User selects cryptographic wipe standard: NIST SP 800-88 R1 3-Pass Overwrite or Physical Degauss/Shred.", "Generates cryptographically signed data wipe pre-authorization token and assigns unique Tech Vault audit ID."),
        ("Stage 5", "Pod Allocation & Routing", "User selects nearest campus SMRT Kiosk drop pod using the interactive Leaflet/OSM campus locator map.", "Checks real-time pod bin capacity via IoT telemetry to ensure adequate locker volume before routing."),
        ("Stage 6", "1-Day Pass Generation", "User receives animated 1-Day Pass with unique QR code, arrives at kiosk, scans QR, and deposits device into unlocked hatch.", "Kiosk scale validates deposit weight; system triggers instant Karma payout to student wallet and updates college derby.")
    ]

    for row_idx, data in enumerate(stages_data, start=1):
        row = table_stages.rows[row_idx]
        bg = "FFFFFF" if row_idx % 2 == 1 else COLOR_BOX_BG_HEX
        for c_idx, val in enumerate(data):
            cell = row.cells[c_idx]
            cell.width = stg_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_PRIMARY
            elif c_idx == 1:
                r.font.bold = True
                r.font.color.rgb = COLOR_NAVY
            else:
                r.font.color.rgb = COLOR_BODY

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # =========================================================================
    # SECTION 6: HOW SPONSORS CONTACT US & CORPORATE ESG INTEGRATION
    # =========================================================================
    h1 = doc.add_paragraph()
    style_heading_1(h1, "6. How Sponsors Contact Us & Corporate ESG Integration")

    add_body_p(
        doc,
        "Corporate sponsorship is the financial engine that makes RE—EARTH zero-cost for university campuses and highly lucrative for students. "
        "Global technology enterprises, semiconductor foundries, and institutional funds face mandatory ESG reporting requirements under "
        "EU CSRD and SEC climate disclosure rules. RE—EARTH provides verified, audit-grade Scope 3 electronic waste diversion credits."
    )

    h2 = doc.add_paragraph()
    style_heading_2(h2, "6.1 Corporate Sponsorship Tiers")

    add_bullet_p(doc, "Seedling Tier ($5,000 / Campus / Year)", "Sponsors a single campus collection pod. Includes corporate logo on the physical kiosk exterior, logo on the campus derby leaderboard, and quarterly ESG diversion certificates.")
    add_bullet_p(doc, "Canopy Tier ($25,000 / Campus / Year)", "Sponsors a full residential quad (4–6 kiosks). Features a mid-rise branded skyscraper in the 3D Sponsor Skyline Forest, naming rights for semester dorm derbies, and co-branded student 1-Day Passes.")
    add_bullet_p(doc, "Redwood Tier ($100,000+ / Multi-Campus Network)", "Institutional partner level. Includes a dominant megastructure skyscraper in the Skyline Forest with live API telemetry feeds, custom-branded hardware pods, keynote presence at campus sustainability summits, and direct student recruitment pipeline access.")

    h2 = doc.add_paragraph()
    style_heading_2(h2, "6.2 Sponsor Inquiry Pipeline & Contact Workflow")

    add_body_p(
        doc,
        "Prospective corporate sponsors connect through the dedicated Sponsor Skyline Portal on the RE—EARTH web platform:"
    )

    add_bullet_p(doc, "Step 1: 3D Skyline Simulation", "Sponsors explore the interactive 3D Skyline Forest, clicking existing corporate towers to inspect live impact metrics (CO2 abated, kilograms diverted, university reach).")
    add_bullet_p(doc, "Step 2: Interactive Tier Configurator", "The sponsor selects target universities, estimated annual e-waste diversion volume, and desired corporate branding package.")
    add_bullet_p(doc, "Step 3: Enterprise Inquiry Submission", "The sponsor completes the embedded partnership form (Corporate Entity, ESG Point of Contact, Business Email, Target Budget, CSR Goals).")
    add_bullet_p(doc, "Step 4: Automated Routing & SLA", "The inquiry is captured into the Amazon DynamoDB `re_earth_sponsors` table, triggers an Amazon SNS alert to the partnerships desk, and dispatches an instant automated ESG Capability Deck to the sponsor's inbox within 60 seconds.")
    add_bullet_p(doc, "Step 5: Executive Onboarding", "A dedicated RE—EARTH partnership manager schedules a briefing within 24 hours to finalize pod hardware placement, custom 3D model asset integration, and legal tax exemption documentation.")

    add_callout(
        doc,
        "Corporate Partnership Desk Contact Details",
        "Direct Sponsor Inquiries: sponsor@re-earth.eco  |  ESG Global Desk: partnerships@re-earth.eco\n"
        "Institutional Hotline: +1 (800) 733-2784 (RE-EARTH)  |  Response SLA: Under 24 Business Hours\n"
        "Tax Classification: 501(c)(3) Circular Economy Research & Environmental Education Entity."
    )

    # =========================================================================
    # SECTION 7: DEEP DIVE INTO USER ROLES
    # =========================================================================
    h1 = doc.add_paragraph()
    style_heading_1(h1, "7. In-Depth User Role Profiles: Student, Admin, and Operator")

    add_body_p(
        doc,
        "The RE—EARTH platform enforces strict Role-Based Access Control (RBAC). The top navigation bar dynamically "
        "adapts its menu pills, permissions, and available workspaces based on the authenticated session token."
    )

    # Role 1: Student
    h2 = doc.add_paragraph()
    style_heading_2(h2, "7.1 Student / Campus Recycler Role")
    add_body_p(
        doc,
        "The Student is the primary community participant driving material intake. The interface is optimized for speed, clarity, and gratification."
    )
    add_bullet_p(doc, "Primary Objectives", "Safely dispose of obsolete electronics, protect personal data, earn redeemable campus rewards, and help their dormitory win the campus derby.")
    add_bullet_p(doc, "TopNav Visibility", "Recycle (6-Stage Wizard), Tech Vault (Certificates), Sponsor (Skyline Forest).")
    add_bullet_p(doc, "Dashboard Views", "Personal Karma balance, cumulative kilograms diverted, tree-equivalent CO2 offset, dorm leaderboard rank, and active 1-Day Passes.")
    add_bullet_p(doc, "Reward Utilization", "Redeem earned Karma for campus dining vouchers, university bookstore gear discounts, and campus coffee perks funded by corporate sponsors.")

    # Role 2: Operator
    h2 = doc.add_paragraph()
    style_heading_2(h2, "7.2 Kiosk Operator / Field Logistics Technician Role")
    add_body_p(
        doc,
        "The Operator is the on-ground campus logistics technician responsible for kiosk maintenance, physical bin clearance, and safety monitoring."
    )
    add_bullet_p(doc, "Primary Objectives", "Ensure physical kiosk uptime, swap full collection bins before overflow, verify incoming student deposits, and handle damaged lithium batteries.")
    add_bullet_p(doc, "TopNav Visibility", "Kiosk Operator Terminal (`#kiosk-terminal`), Sponsor (Skyline Forest). All student-facing clutter is hidden to maximize operational efficiency.")
    add_bullet_p(doc, "Operator Terminal Views", "Live telemetry of all campus pods (bin fullness percentage, thermal sensors, scale calibration), queue of incoming student 1-Day Passes, and emergency hatch release overrides.")
    add_bullet_p(doc, "Key Workflows", "Scanning arriving student passes at physical pods; inspecting deposit compartment; approving manual overrides for damaged barcodes; performing logistics swaps (inserting fresh empty bin and locking full bin with courier chain-of-custody seal).")

    # Role 3: Admin
    h2 = doc.add_paragraph()
    style_heading_2(h2, "7.3 Campus Administrator / Central Admin Role")
    add_body_p(
        doc,
        "The Campus Administrator oversees the entire institutional e-waste program, governance, compliance, and sponsor placement."
    )
    add_bullet_p(doc, "Primary Objectives", "Maintain university regulatory environmental compliance, track aggregate campus diversion metrics for institutional accreditation, manage campus derby competitions, and oversee sponsor contracts.")
    add_bullet_p(doc, "TopNav Visibility", "Admin Portal (`#admin`), Tech Vault (`#vault`), Sponsor (`#sponsor`).")
    add_bullet_p(doc, "Admin Portal Views", "Campus-wide executive analytics, institutional carbon offset audit reports, pod network deployment map, dispute resolution console, and raw CSV/PDF compliance export tools.")
    add_bullet_p(doc, "Key Workflows", "Commissioning new physical SMRT Kiosks; scheduling and launching seasonal campus derbies; reviewing NIST SP 800-88 data destruction compliance logs; generating official ESG reports for University Board of Regents and state environmental bodies.")

    # Role Comparison Table
    table_roles = doc.add_table(rows=4, cols=4)
    table_roles.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_roles.autofit = False

    role_headers = ["Attribute", "Student / Recycler", "Kiosk Operator", "Campus Administrator"]
    role_widths = [Inches(1.5), Inches(1.8), Inches(1.8), Inches(1.7)]

    hdr_ro = table_roles.rows[0]
    for idx, heading in enumerate(role_headers):
        cell = hdr_ro.cells[idx]
        cell.width = role_widths[idx]
        set_cell_background(cell, COLOR_NAVY_HEX)
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(heading)
        r.font.name = "Arial"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    roles_data = [
        ("Primary UI View", "Student Dashboard, 3D Globe, Wizard", "Kiosk Operator Terminal Console", "Executive Admin Management Portal"),
        ("Key Functional Capabilities", "Submit items, generate 1-Day Pass, view certificates, redeem rewards", "Verify passes, monitor pod capacity, clear bins, thermal hazard alerts", "Provision pods, sanction derbies, download ESG reports, manage sponsors"),
        ("Security Clearance", "Standard JWT Token (Read/Deposit)", "Operator Token (Hardware Control)", "Root Admin Token (Governance & Audit)")
    ]

    for row_idx, data in enumerate(roles_data, start=1):
        row = table_roles.rows[row_idx]
        bg = "FFFFFF" if row_idx % 2 == 1 else COLOR_BOX_BG_HEX
        for c_idx, val in enumerate(data):
            cell = row.cells[c_idx]
            cell.width = role_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_NAVY
            else:
                r.font.color.rgb = COLOR_BODY

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # =========================================================================
    # SECTION 8: COMPLIANCE, SECURITY & CHAIN OF CUSTODY
    # =========================================================================
    h1 = doc.add_paragraph()
    style_heading_1(h1, "8. Data Security, Regulatory Compliance & Chain of Custody")

    add_body_p(
        doc,
        "To guarantee institutional-grade integrity, RE—EARTH adheres strictly to international environmental and cybersecurity standards."
    )

    add_bullet_p(doc, "NIST SP 800-88 Revision 1 Compliance", "All sanitization operations executed through RE—EARTH follow the National Institute of Standards and Technology (NIST) Guidelines for Media Sanitization. Drives marked for reuse undergo full cryptographic Purge/Clear overwrites. Storage media incapable of software wipe are routed to certified shredders meeting DIN 66399 Security Level H-5 (particle size < 30 mm²).")
    add_bullet_p(doc, "Cryptographic Chain of Custody", "Every hardware deposit generates a SHA-256 transaction hash combining user ID, device serial, weight sensor readings, timestamp, and kiosk GPS coordinates. This hash is written to Amazon DynamoDB and locked to prevent post-hoc tampering.")
    add_bullet_p(doc, "Courier Hand-off & Smelter Manifests", "When a logistics operator clears a full kiosk bin, an electronic manifest is generated. Downstream recycling partners (R2v3 or e-Stewards certified facilities) scan the manifest upon receipt, closing the audit loop.")

    # Final Summary Callout
    add_callout(
        doc,
        "Project Conclusion & Scalability Outlook",
        "RE—EARTH is not merely a recycling application; it is a holistic circular economy infrastructure. "
        "By aligning the economic and behavioral incentives of students (rewards, data security), universities (accreditation, clean quads), "
        "and corporate sponsors (verifiable ESG offsets), RE—EARTH transforms e-waste management into an automated, "
        "transparent, and inspiring institutional model ready for global university and municipal deployment."
    )

    # Save Document Locally and to Artifacts
    print(f"Saving Word document to: {DOCX_OUTPUT_PATH}")
    doc.save(DOCX_OUTPUT_PATH)

    print(f"Copying Word document to artifact directory: {ARTIFACT_DOCX_PATH}")
    shutil.copyfile(DOCX_OUTPUT_PATH, ARTIFACT_DOCX_PATH)

    print("Document Generation Completed Successfully!")

if __name__ == "__main__":
    build_full_documentation()
