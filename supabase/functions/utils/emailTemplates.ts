export const newQuoteEmailTemplate = (quote: { text: string; authors: { name: string }; categories: { name: string } }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .quote { padding: 20px; background: #f9f9f9; border-left: 4px solid #8B5CF6; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
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

export const weeklyDigestTemplate = (quotes: Array<{ text: string; authors: { name: string }; categories: { name: string } }>) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .quote { padding: 20px; background: #f9f9f9; border-left: 4px solid #8B5CF6; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
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
      </div>
    `).join('')}
    <div class="footer">
      <p>You're receiving this because you subscribed to weekly digest notifications.</p>
      <p>To update your preferences, please visit your profile settings.</p>
    </div>
  </div>
</body>
</html>
`;