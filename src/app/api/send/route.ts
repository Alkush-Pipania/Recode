import { EmailTemplate } from '../../../components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailRequestBody {
  to: string;
  subject: string;
  text: string;
  url: string;
  firstName?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendEmailRequestBody;

    const { to, subject, text, url, firstName } = body;

    const { data, error } = await resend.emails.send({
      from: 'recode <no-reply@carter.fun>',
      to: [to],
      subject,
      text,
      react: EmailTemplate({ firstName, url }),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}