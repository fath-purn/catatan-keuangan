import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (
  email: string,
  code: string,
  isReset = false,
) => {
  const mailOptions = {
    from: `"Finfeel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: isReset
      ? "Reset Kata Sandi - Finfeel"
      : "Kode Verifikasi Email - Finfeel",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 4px solid black; border-radius: 20px; background-color: #FDF8EE; box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);">
        <h1 style="font-weight: 900; text-transform: uppercase; text-align: center; color: black; border-bottom: 2px solid black; padding-bottom: 10px;">
          ${isReset ? "Reset Kata Sandi" : "Verifikasi Akun"}
        </h1>
        <p style="font-weight: bold; text-align: center; margin-top: 20px;">Halo!</p>
        <p style="text-align: center;">
          ${isReset ? "Kami menerima permintaan reset kata sandi. Gunakan kode di bawah ini:" : "Gunakan kode di bawah ini untuk memverifikasi akun Finfeel kamu:"}
        </p>
        <div style="background-color: white; border: 2px solid black; padding: 15px; margin: 20px 0; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 5px; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);">
          ${code}
        </div>
        <p style="font-size: 12px; text-align: center; color: #666;">Kode ini akan kedaluwarsa dalam 10 menit.</p>
        <p style="font-size: 12px; text-align: center; font-weight: bold; margin-top: 20px;">Jika kamu tidak merasa meminta ini, abaikan email ini.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email verifikasi terkirim ke ${email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Gagal mengirim email:", error);
    return { success: false, error };
  }
};
