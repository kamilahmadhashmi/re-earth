const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const QRCode = require('qrcode');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cssPath = path.resolve(__dirname, '../src/styles/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

async function testTemplate(name, isAccepted) {
  const scratchDir = path.resolve(__dirname, '../scratch');
  if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

  const passId = isAccepted ? 'SIG-88F4B91-DTU' : 'SIG-NEW789-NSUT';
  const qrDataUrl = await QRCode.toDataURL(JSON.stringify({
    v: 1,
    ref: passId,
    mfg: 'Apple',
    mod: isAccepted ? 'iPhone 11' : 'MacBook Air M1',
    kg: isAccepted ? 0.194 : 1.29,
    cond: isAccepted ? 'cracked' : 'mint',
    haz: false,
    kid: isAccepted ? 'kiosk-dtu-mech' : 'kiosk-nsut-admin'
  }), {
    width: 240,
    margin: 1.5,
    errorCorrectionLevel: 'H'
  });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RE—EARTH Certificate Print Test - ${name}</title>
  <style>
    ${cssContent}
  </style>
</head>
<body style="margin: 0; padding: 0; background: #000;">
  <div id="printable-official-certificate" class="printable-certificate-container" style="background: #0E131B; color: #F8FAFC;">
    <div style="border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-family: monospace; font-size: 10px; color: #059669; font-weight: bold; text-transform: uppercase;">
          RE—EARTH CIRCULAR PROTOCOL • NIST SP 800-88 R1
        </div>
        <h1 style="font-size: 20px; font-weight: 900; margin: 4px 0 2px 0; color: #0b0f14;">
          ${isAccepted ? 'Electronic Diversion Certificate' : 'Collegiate Hardware Handover Pass'}
        </h1>
        <p style="font-size: 11px; margin: 0; color: #64748b; font-family: monospace;">
          ${isAccepted ? 'Verified Institutional E-Waste Telemetry & Circular Recovery' : 'Ephemeral Physical Intake Authorization • Valid 15 Minutes'}
        </p>
      </div>
      <div style="text-align: right; font-family: monospace; font-size: 11px;">
        <div style="color: #64748b; font-size: 9px; text-transform: uppercase;">Reference</div>
        <div style="color: #059669; font-weight: 800; font-size: 13px;">${isAccepted ? 'REC-DTU-2026-0941' : 'PASS RESERVATION'}</div>
        <div style="color: #0284c7; font-weight: bold; font-size: 10px;">TOKEN: ${passId}</div>
      </div>
    </div>

    <div style="padding: 12px 0; display: flex; gap: 16px; align-items: center;">
      <div style="flex: 1; font-family: monospace; font-size: 11px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; margin-bottom: 8px;">
          <div style="font-size: 9px; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">
            Student Submitter Details
          </div>
          <div>STUDENT: <strong>Aarav Sharma</strong> (Roll: 2023/EE/042)</div>
          <div>DEPARTMENT: Electrical Engineering</div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; margin-bottom: 8px;">
          <div style="font-size: 9px; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">
            Hardware Specification
          </div>
          <div>DEVICE: <strong>${isAccepted ? 'Apple iPhone 11' : 'Apple MacBook Air M1'}</strong></div>
          <div>MASS: <strong>${isAccepted ? '192.8 g (Verified)' : '1290 g (Declared)'}</strong></div>
          <div>LOCATION: ${isAccepted ? 'DTU Mechanical Block Kiosk' : 'NSUT Main Admin Quad Kiosk'}</div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
          <div style="font-size: 9px; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">
            Environmental Equivalencies (EPA WARM)
          </div>
          <div>AVOIDED CO2e: <strong>${isAccepted ? '72.0 kg' : '165.0 kg'}</strong></div>
          <div>TOKENS: <strong>${isAccepted ? '+180 EC / +225 XP' : '+520 EC / +680 XP'}</strong></div>
        </div>
      </div>

      <div style="width: 170px; text-align: center; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; background: #fff;">
        <img src="${qrDataUrl}" alt="Scannable QR" style="width: 140px; height: 140px; display: block; margin: 0 auto;" />
        <div style="font-family: monospace; font-size: 10px; font-weight: bold; margin-top: 6px; color: #0b0f14;">
          ${passId}
        </div>
        <div style="font-size: 8px; color: #64748b; font-family: monospace;">2D SCANNER READY</div>
      </div>
    </div>

    <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 8px; font-family: monospace; font-size: 9px; display: flex; justify-content: space-between; align-items: center; color: #64748b;">
      <div>STATUS: ${isAccepted ? 'REDEEMED & ACCEPTED' : 'PENDING OPERATOR VERIFICATION'}</div>
      <div>DIGITAL PROOF: SHA256:7B8C24D9E9F01A4B</div>
    </div>
  </div>
</body>
</html>`;

  const htmlPath = path.resolve(scratchDir, `${name}.html`);
  const pdfPath = path.resolve(scratchDir, `${name}.pdf`);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file:///${htmlPath.replace(/\\\\/g, '/')}"`;
  execSync(cmd, { stdio: 'pipe' });

  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfString = pdfBuffer.toString('binary');
  const pageMatches = pdfString.match(/\/Type\s*\/Page\b/g);
  const pageCount = pageMatches ? pageMatches.length : 1;

  console.log(`[${name}] PDF Size: ${pdfBuffer.length} bytes | Pages: ${pageCount}`);
  if (pageCount !== 1) {
    throw new Error(`[${name}] Expected 1 page but got ${pageCount}!`);
  }
}

async function run() {
  await testTemplate('cert-accepted-diversion', true);
  await testTemplate('cert-pending-handover-pass', false);
  console.log('\nALL CERTIFICATE TEMPLATES VERIFIED: EXACTLY 1 PAGE EACH!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
