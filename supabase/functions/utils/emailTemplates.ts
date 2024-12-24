export const newQuoteEmailTemplate = (quote: { text: string; authors: { name: string }; categories: { name: string } }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .quote { padding: 20px; background: #f9f9f9; border-left: 4px solid #8B5CF6; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
    .cta-button { 
      display: inline-block; 
      padding: 10px 20px; 
      background-color: #8B5CF6; 
      color: white; 
      text-decoration: none; 
      border-radius: 5px; 
      margin-top: 15px; 
    }
    .source-link {
      color: #8B5CF6;
      text-decoration: none;
      margin-top: 10px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>New Quote Added</h2>
    <div class="quote">
      <p>${quote.text}</p>
      <p><strong>- ${quote.authors.name}</strong></p>
      <p>Category: ${quote.categories.name}</p>
    </div>
    <div class="footer">
      <p>You're receiving this because you subscribed to new quote notifications.</p>
      <p>To update your preferences, please visit your profile settings.</p>
    </div>
  </div>
</body>
</html>
`;

export const weeklyDigestTemplate = (quotes: Array<{ 
  text: string; 
  authors: { name: string }; 
  categories: { name: string };
  source_title?: string | null;
  source_url?: string | null;
  id: string;
}>) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .quote { padding: 20px; background: #f9f9f9; border-left: 4px solid #8B5CF6; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
    .cta-button { 
      display: inline-block; 
      padding: 10px 20px; 
      background-color: #8B5CF6; 
      color: white; 
      text-decoration: none; 
      border-radius: 5px; 
      margin-top: 15px; 
    }
    .source-link {
      color: #8B5CF6;
      text-decoration: none;
      margin-top: 10px;
      display: inline-block;
    }
    .quote-actions {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Your Weekly Quote Digest</h2>
    <p>Here are this week's inspiring quotes:</p>
    ${quotes.map(quote => `
      <div class="quote">
        <p>${quote.text}</p>
        <p><strong>- ${quote.authors.name}</strong></p>
        <p>Category: ${quote.categories.name}</p>
        ${quote.source_title ? `
          <div class="quote-source">
            Source: ${quote.source_url ? 
              `<a href="${quote.source_url}" class="source-link" target="_blank">${quote.source_title}</a>` : 
              quote.source_title
            }
          </div>
        ` : ''}
        <div class="quote-actions">
          <a href="https://quotes.ztfomum.org/quotes/${quote.id}" class="cta-button">
            Read More & Share
          </a>
        </div>
      </div>
    `).join('')}
    <div class="footer">
      <p>You're receiving this because you subscribed to weekly digest notifications.</p>
      <p>To update your preferences, please visit your profile settings.</p>
      <a href="https://quotes.ztfomum.org/profile" class="cta-button">
        Manage Preferences
      </a>
    </div>
  </div>
</body>
</html>
`;