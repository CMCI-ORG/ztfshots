export const newQuoteEmailTemplate = (
  quote: { 
    text: string; 
    authors: { name: string }; 
    categories: { name: string } 
  },
  unsubscribeUrl: string
) => `
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
      color: white !important; 
      text-decoration: none; 
      border-radius: 5px; 
      margin-top: 15px; 
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
    <a href="https://quotes.ztfomum.org/quotes" class="cta-button">View on Website</a>
    <div class="footer">
      <p>You're receiving this because you subscribed to new quote notifications.</p>
      <p>To update your preferences, please <a href="https://quotes.ztfomum.org/profile" style="color: #8B5CF6; text-decoration: underline;">visit your profile settings</a>.</p>
      <p>To unsubscribe, <a href="${unsubscribeUrl}" style="color: #8B5CF6; text-decoration: underline;">click here</a>.</p>
    </div>
  </div>
</body>
</html>
`;