import * as React from 'react';

interface EmailTemplateProps {
  firstName?: string;
  url: string;
}

export function EmailTemplate({ firstName, url }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
      <h1>Welcome{firstName ? `, ${firstName}` : ''}!</h1>
      <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>
      <p>
        <a
          href={url}
          style={{
            display: 'inline-block',
            padding: '10px 16px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Verify Email
        </a>
      </p>
      <p>If the button doesn&apos;t work, copy and paste this URL into your browser:</p>
      <p style={{ wordBreak: 'break-all' }}>{url}</p>
      <p>— The Recode Team</p>
    </div>
  );
}