"use strict";
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: (process.env.EMAIL_USER || '').trim(),
        // Gmail app passwords are often copied with spaces ("xxxx xxxx xxxx xxxx");
        // strip all whitespace so auth doesn't fail.
        pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
    },
});
function isConfigured() {
    const user = process.env.EMAIL_USER || '';
    const pass = process.env.EMAIL_PASS || '';
    if (!user || !pass)
        return false;
    if (user.includes('your-email') || pass.includes('your-'))
        return false;
    return true;
}
function verifyMailer() {
    if (!isConfigured()) {
        console.warn('⚠️  Email not configured — set real EMAIL_USER / EMAIL_PASS in .env');
        return;
    }
    transporter.verify((err) => {
        if (err)
            console.warn('⚠️  Email transporter error:', err.message);
        else
            console.log('✅ Email transporter ready');
    });
}
const brandPurple = '#5e4091';
function patientHtml(booking) {
    return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:${brandPurple};color:#fff;padding:24px 28px">
      <h2 style="margin:0;font-size:20px">Doctar — Booking Received</h2>
    </div>
    <div style="padding:28px">
      <p style="font-size:15px;color:#333">Hi <strong>${booking.name}</strong>,</p>
      <p style="font-size:15px;color:#333;line-height:1.6">
        Thank you for booking through Doctar. We've received your request and our care
        coordinator will call you shortly on <strong>${booking.phone}</strong>.
      </p>
      <p style="font-size:15px;color:#333;line-height:1.6">
        <strong>Your appointment:</strong> ${booking.appointmentDate || 'Not selected'} at ${booking.appointmentTime || 'Not selected'}
      </p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
        <tr><td style="padding:8px 0;color:#888">Reason of Visit</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.disease}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Doctor Requested</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.doctorName || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Appointment Date</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.appointmentDate || 'Not selected'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Appointment Time</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.appointmentTime || 'Not selected'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Location</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.location || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.phone}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Status</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.status}</td></tr>
      </table>
      <p style="font-size:13px;color:#888">Need help now? Call our 24/7 helpline at +91-8877772277.</p>
    </div>
    <div style="background:#faf8ff;padding:16px 28px;font-size:12px;color:#999;text-align:center">
      © Doctar Health Care
    </div>
  </div>`;
}
function adminHtml(booking) {
    return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:${brandPurple};color:#fff;padding:20px 28px">
      <h2 style="margin:0;font-size:18px">🔔 New Booking — Action Needed</h2>
    </div>
    <div style="padding:24px 28px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#888">Patient Name</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.phone}</td></tr>
        ${(booking.patientEmail || booking.email) ? `<tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.patientEmail || booking.email}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#888">Reason of Visit</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.disease}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Doctor Requested</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.doctorName || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Appointment Date</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.appointmentDate || 'Not selected'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Appointment Time</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.appointmentTime || 'Not selected'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Hospital</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.hospital || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Location</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.location || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Received</td><td style="padding:8px 0;color:#111;font-weight:600">${new Date(booking.createdAt).toLocaleString('en-IN')}</td></tr>
      </table>
    </div>
  </div>`;
}
function doctorHtml(booking) {
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
        <tr><td style="padding:8px 0;color:#888">Reason / Specialty</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.disease}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Hospital</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.hospital || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Received</td><td style="padding:8px 0;color:#111;font-weight:600">${new Date(booking.createdAt).toLocaleString('en-IN')}</td></tr>
      </table>
      <p style="font-size:13px;color:#888;margin-top:16px">Please reach out to the patient to confirm the appointment.</p>
    </div>
    <div style="background:#faf8ff;padding:16px 28px;font-size:12px;color:#999;text-align:center">© Doctar Health Care</div>
  </div>`;
}
async function sendBookingEmail(booking, doctorEmail) {
    if (!isConfigured()) {
        console.warn('⚠️  Skipping emails — EMAIL_USER / EMAIL_PASS not configured');
        return;
    }
    const from = `"Doctar" <${process.env.EMAIL_USER}>`;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const patientEmail = booking.patientEmail || booking.email;
    const jobs = [];
    // EMAIL 1 — Admin (always)
    jobs.push(transporter.sendMail({
        from,
        to: adminEmail,
        subject: `New Booking — ${booking.name} for ${booking.disease}`,
        html: adminHtml(booking),
    }).then(() => console.log('📧 Admin email sent'), (err) => console.error('❌ Admin email failed:', err.message)));
    // EMAIL 2 — Patient (if email provided)
    if (patientEmail) {
        jobs.push(transporter.sendMail({
            from,
            to: patientEmail,
            subject: 'Appointment Confirmed — Doctar Surgery',
            html: patientHtml(booking),
        }).then(() => console.log('📧 Patient email sent'), (err) => console.error('❌ Patient email failed:', err.message)));
    }
    // EMAIL 3 — Doctor (if doctor email found)
    if (doctorEmail) {
        jobs.push(transporter.sendMail({
            from,
            to: doctorEmail,
            subject: `New Patient — ${booking.name} | ${booking.disease}`,
            html: doctorHtml(booking),
        }).then(() => console.log('📧 Doctor email sent'), (err) => console.error('❌ Doctor email failed:', err.message)));
    }
    // Never throw — booking must succeed regardless of email outcome.
    try {
        await Promise.allSettled(jobs);
    }
    catch (err) {
        console.error('❌ Booking email error:', err.message);
    }
}
module.exports = { sendBookingEmail, verifyMailer };
