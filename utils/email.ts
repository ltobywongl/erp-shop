import sendgrid from "@sendgrid/mail";
if (!process.env.SENDGRID_API_KEY)
  throw new Error("SENDGRID_API_KEY is not set in .env");
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMail(
  subject: string,
  receiver: string,
  emailHtml: string
) {
  await sendgrid
    .send({
      from: "tohongwong@gmail.com",
      to: receiver,
      subject: subject,
      html: emailHtml,
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}
