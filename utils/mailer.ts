import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: (process.env.EMAIL_USER || '').trim(),
    pass: (process.env.EMAIL_PASS || '').replace(/\\s+/g, ''),
  },
});

function isConfigured(): boolean {
  const user = process.env.EMAIL_USER || '';
  const pass = process.env.EMAIL_PASS || '';
  if (!user || !pass) return false;
  if (user.includes('your-email') || pass.includes('your-')) return false;
  return true;
}

export function verifyMailer(): void {
  if (!isConfigured()) {
    console.warn('⚠️  Email not configured — set real EMAIL_USER / EMAIL_PASS in .env');
    return;
  }
  transporter.verify((err) => {
    if (err) console.warn('⚠️  Email transporter error:', err.message);
    else console.log('✅ Email transporter ready');
  });
}

const brandPurple = '#5e4091';

function patientHtml(booking: any): string {
  const brandPurple = '#5e4091';
  let title = 'Doctar — Booking Received';
  let bodyContent = '';

  if (booking.source === 'emergency.doctar.in') {
    title = 'Doctar Emergency — Booking Confirmed';
    bodyContent = `
      <p style="font-size:15px;color:#333">Hi <strong>${booking.name}</strong>,</p>
      <p style="font-size:15px;color:#333;line-height:1.6">
        Your emergency ambulance booking is confirmed. The driver will contact you shortly on <strong>${booking.phone}</strong>.
      </p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0;text-align:center">
        <span style="font-size:13px;color:#dc2626;font-weight:700;display:block;margin-bottom:4px">CONFIRMATION CODE</span>
        <strong style="font-size:24px;color:#dc2626;letter-spacing:1px">${booking.confirmationCode || 'DOC-CONFIRMED'}</strong>
      </div>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
        <tr><td style="padding:8px 0;color:#888">Pickup Location</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.pickupLocation || booking.location || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Emergency Reason</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.reason || 'Emergency'}</td></tr>
        ${booking.notes ? `<tr><td style="padding:8px 0;color:#888">Notes for Driver</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.notes}</td></tr>` : ''}
      </table>
    `;
  } else if (booking.source === 'diagnostic.doctar.in') {
    title = 'Doctar Diagnostics — Booking Received';
    bodyContent = `
      <p style="font-size:15px;color:#333">Hi <strong>${booking.name}</strong>,</p>
      <p style="font-size:15px;color:#333;line-height:1.6">
        Thank you for booking a diagnostic test through Doctar. We've received your request and our care
        coordinator will call you shortly on <strong>${booking.phone}</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
        <tr><td style="padding:8px 0;color:#888">Patient Name</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.phone}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Location</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.location || 'Not specified'}</td></tr>
      </table>
    `;
  } else {
    // Surgery / Default
    title = 'Doctar Surgery — Booking Received';
    bodyContent = `
      <p style="font-size:15px;color:#333">Hi <strong>${booking.name}</strong>,</p>
      <p style="font-size:15px;color:#333;line-height:1.6">
        Thank you for booking a consultation through Doctar. We've received your request and our care
        coordinator will call you shortly on <strong>${booking.phone}</strong>.
      </p>
      <p style="font-size:15px;color:#333;line-height:1.6">
        <strong>Your appointment:</strong> ${booking.appointmentDate || 'Not selected'} at ${booking.appointmentTime || 'Not selected'}
      </p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
        <tr><td style="padding:8px 0;color:#888">Reason of Visit</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.disease || 'Consultation'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Doctor Requested</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.doctorName || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Appointment Date</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.appointmentDate || 'Not selected'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Appointment Time</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.appointmentTime || 'Not selected'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Location</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.location || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.phone}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Status</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.status}</td></tr>
      </table>
    `;
  }

  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:${brandPurple};color:#fff;padding:24px 28px">
      <h2 style="margin:0;font-size:20px">${title}</h2>
    </div>
    <div style="padding:28px">
      ${bodyContent}
      <p style="font-size:13px;color:#888">Need help now? Call our 24/7 helpline at +91-8877772277.</p>
    </div>
    <div style="background:#faf8ff;padding:16px 28px;font-size:12px;color:#999;text-align:center">
      © Doctar Health Care
    </div>
  </div>`;
}

function adminHtml(booking: any): string {
  const brandPurple = '#5e4091';
  let rowsHtml = `
    <tr><td style="padding:8px 0;color:#888">Patient Name</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.name}</td></tr>
    <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.phone}</td></tr>
    <tr><td style="padding:8px 0;color:#888">Source Site</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.source}</td></tr>
  `;

  if (booking.source === 'emergency.doctar.in') {
    rowsHtml += `
      <tr><td style="padding:8px 0;color:#888">Confirmation Code</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.confirmationCode || 'DOC-CONFIRMED'}</td></tr>
      <tr><td style="padding:8px 0;color:#888">Pickup Location</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.pickupLocation || booking.location || 'Not specified'}</td></tr>
      <tr><td style="padding:8px 0;color:#888">Emergency Reason</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.reason || 'Emergency'}</td></tr>
      ${booking.notes ? `<tr><td style="padding:8px 0;color:#888">Notes</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.notes}</td></tr>` : ''}
    `;
  } else {
    // Surgery / Diagnostics / Default
    rowsHtml += `
      ${booking.disease ? `<tr><td style="padding:8px 0;color:#888">Reason / Disease</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.disease}</td></tr>` : ''}
      ${booking.doctorName ? `<tr><td style="padding:8px 0;color:#888">Doctor Requested</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.doctorName}</td></tr>` : ''}
      ${booking.appointmentDate ? `<tr><td style="padding:8px 0;color:#888">Appointment Date</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.appointmentDate}</td></tr>` : ''}
      ${booking.appointmentTime ? `<tr><td style="padding:8px 0;color:#888">Appointment Time</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.appointmentTime}</td></tr>` : ''}
      ${booking.hospital ? `<tr><td style="padding:8px 0;color:#888">Hospital</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.hospital}</td></tr>` : ''}
      ${booking.location ? `<tr><td style="padding:8px 0;color:#888">Location</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.location}</td></tr>` : ''}
    `;
  }

  rowsHtml += `
    <tr><td style="padding:8px 0;color:#888">Received</td><td style="padding:8px 0;color:#111;font-weight:600">${new Date(booking.createdAt).toLocaleString('en-IN')}</td></tr>
  `;

  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:${brandPurple};color:#fff;padding:20px 28px">
      <h2 style="margin:0;font-size:18px">🔔 New Booking — Action Needed</h2>
    </div>
    <div style="padding:24px 28px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rowsHtml}
      </table>
    </div>
  </div>`;
}

function doctorHtml(booking: any): string {
  const brandPurple = '#5e4091';
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:${brandPurple};color:#fff;padding:22px 28px">
      <h2 style="margin:0;font-size:19px">🩺 New Patient Booking</h2>
    </div>
    <div style="padding:26px 28px">
      <p style="font-size:15px;color:#333;line-height:1.6">
        Hi <strong>${booking.doctorName || 'Doctor'}</strong>, you have a new patient booking through Doctar.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:14px;font-size:14px">
        <tr><td style="padding:8px 0;color:#888">Patient Name</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.phone}</td></tr>
        ${booking.patientEmail || booking.email ? `<tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.patientEmail || booking.email}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#888">Reason / Specialty</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.disease || 'Consultation'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Hospital</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.hospital || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Received</td><td style="padding:8px 0;color:#111;font-weight:600">${new Date(booking.createdAt).toLocaleString('en-IN')}</td></tr>
      </table>
      <p style="font-size:13px;color:#888;margin-top:16px">Please reach out to the patient to confirm the appointment.</p>
    </div>
    <div style="background:#faf8ff;padding:16px 28px;font-size:12px;color:#999;text-align:center">© Doctar Health Care</div>
  </div>`;
}

export async function sendBookingEmail(booking: any, doctorEmail?: string): Promise<void> {
  if (!isConfigured()) {
    console.warn('⚠️  Skipping emails — EMAIL_USER / EMAIL_PASS not configured');
    return;
  }

  const from = `"Doctar" <${process.env.EMAIL_USER}>`;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const patientEmail = booking.patientEmail || booking.email;
  const jobs: Promise<any>[] = [];

  // EMAIL 1 — Admin (always)
  const adminSubject = `New Booking — ${booking.name} [${booking.source}]`;
  jobs.push(
    transporter.sendMail({
      from,
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml(booking),
    }).then(
      () => console.log('📧 Admin email sent'),
      (err: any) => console.error('❌ Admin email failed:', err.message)
    )
  );

  // EMAIL 2 — Patient (if email provided)
  if (patientEmail) {
    let subject = 'Booking Received — Doctar';
    if (booking.source === 'emergency.doctar.in') {
      subject = 'Ambulance Booking Confirmed — Doctar Emergency';
    } else if (booking.source === 'surgery.doctar.in') {
      subject = 'Appointment Booking Confirmed — Doctar Surgery';
    } else if (booking.source === 'diagnostic.doctar.in') {
      subject = 'Diagnostic Test Booking Received — Doctar Diagnostics';
    }

    jobs.push(
      transporter.sendMail({
        from,
        to: patientEmail,
        subject,
        html: patientHtml(booking),
      }).then(
        () => console.log('📧 Patient email sent'),
        (err: any) => console.error('❌ Patient email failed:', err.message)
      )
    );
  }

  // EMAIL 3 — Doctor (if doctor email found)
  if (doctorEmail) {
    jobs.push(
      transporter.sendMail({
        from,
        to: doctorEmail,
        subject: `New Patient — ${booking.name} | ${booking.disease || 'Consultation'}`,
        html: doctorHtml(booking),
      }).then(
        () => console.log('📧 Doctor email sent'),
        (err: any) => console.error('❌ Doctor email failed:', err.message)
      )
    );
  }

  // Never throw — booking must succeed regardless of email outcome.
  try {
    await Promise.allSettled(jobs);
  } catch (err: any) {
    console.error('❌ Booking email error:', err.message);
  }
}