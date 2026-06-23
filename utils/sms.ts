import twilio from 'twilio';

export function isConfigured(): boolean {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE);
}

// Normalize an Indian mobile number to E.164 (+91XXXXXXXXXX).
// Returns null if we can't produce a 10-digit national number.
export function toE164India(raw: any): string | null {
  if (!raw) return null;
  let digits = String(raw).replace(/\\D/g, ''); // strip everything non-numeric
  // Drop a leading country code if the user already included it.
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(-10);
  if (digits.length > 10) digits = digits.slice(-10); // keep last 10 as a fallback
  if (digits.length !== 10) return null;
  return '+91' + digits;
}

export function verifyConfig(): void {
  const sid = process.env.TWILIO_ACCOUNT_SID || '';
  const token = process.env.TWILIO_AUTH_TOKEN || '';
  const phone = process.env.TWILIO_PHONE || '';
  // Masked logging — never print full secrets.
  console.log('🔧 Twilio config check:');
  console.log('   TWILIO_ACCOUNT_SID:', sid ? `${sid.slice(0, 6)}…${sid.slice(-4)} (len ${sid.length}, AC-prefixed: ${sid.startsWith('AC')})` : '❌ MISSING');
  console.log('   TWILIO_AUTH_TOKEN :', token ? `present (len ${token.length})` : '❌ MISSING');
  console.log('   TWILIO_PHONE      :', phone || '❌ MISSING');
}

export async function sendBookingSMS(booking: any): Promise<any> {
  if (!isConfigured()) {
    console.warn('⚠️ SMS not configured — set TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_PHONE in .env');
    verifyConfig();
    return;
  }

  const phone = toE164India(booking && booking.phone);
  if (!phone) {
    console.error('❌ SMS skipped — invalid phone number:', JSON.stringify(booking && booking.phone));
    return;
  }

  console.log(`📤 Attempting SMS  from=${process.env.TWILIO_PHONE}  to=${phone}`);

  try {
    let body = `Dear ${booking.name}, your booking has been received at Doctar. Our team will call you shortly. Helpline: +91-8877772277`;
    if (booking.source === 'emergency.doctar.in') {
      body = `Dear ${booking.name}, your emergency ambulance booking is received. Code: ${booking.confirmationCode || 'DOC-CONFIRMED'}. Our driver/team will contact you shortly. Helpline: +91-8877772277`;
    } else if (booking.source === 'surgery.doctar.in') {
      body = `Dear ${booking.name}, your appointment for ${booking.disease || 'surgery consultation'} has been booked at Doctar. Our team will call you shortly. Helpline: +91-8877772277`;
    } else if (booking.source === 'diagnostic.doctar.in') {
      body = `Dear ${booking.name}, your diagnostic test appointment has been booked at Doctar. Our team will call you shortly. Helpline: +91-8877772277`;
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const msg = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
    console.log(`📱 SMS sent to ${phone}  (SID: ${msg.sid}, status: ${msg.status})`);
    return msg;
  } catch (err: any) {
    // Detailed Twilio error logging — code + moreInfo pinpoint the exact cause.
    console.error('❌ SMS failed:');
    console.error('   message :', err.message);
    console.error('   code    :', err.code);
    console.error('   status  :', err.status);
    console.error('   moreInfo:', err.moreInfo);
    if (err.code === 21608) {
      console.error('   👉 TRIAL ACCOUNT: the destination number is UNVERIFIED.');
      console.error('      Add & verify it at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
      console.error(`      Verify this exact number with OTP: ${phone}`);
    } else if (err.code === 21211) {
      console.error('   👉 Invalid "to" number format. Expected E.164 like +91XXXXXXXXXX.');
    } else if (err.code === 21212 || err.code === 21606) {
      console.error('   👉 The "from" Twilio number is invalid or not SMS-capable for this destination.');
    } else if (err.code === 20003) {
      console.error('   👉 Authentication failed — check TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN.');
    }
    // Never throw — booking must still succeed even if SMS fails.
  }
}
