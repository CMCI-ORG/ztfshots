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
      color: white !important; 
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
    <a href="https://quotes.ztfomum.org/quotes" class="cta-button">View on Website</a>
    <div class="footer">
      <p>You're receiving this because you subscribed to new quote notifications.</p>
      <p>To update your preferences, please <a href="https://quotes.ztfomum.org/profile" style="color: #8B5CF6; text-decoration: underline;">visit your profile settings</a>.</p>
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
      color: white !important; 
      text-decoration: none; 
      border-radius: 5px; 
      margin-top: 15px; 
    }
    .source-link {
      color: #8B5CF6 !important;
      text-decoration: none;
      margin-top: 10px;
      display: inline-block;
    }
    .quote-actions {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }
    .header {
      text-align: center;
      padding: 20px;
      border-bottom: 2px solid #eee;
      margin-bottom: 30px;
    }
    .header img {
      max-height: 60px;
      margin-bottom: 15px;
    }
    .header-links {
      margin-top: 15px;
    }
    .header-links a {
      color: #666 !important;
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
    .social-links {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .social-links a {
      color: #666 !important;
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="https://quotes.ztfomum.org">
        <img src="https://quotes.ztfomum.org/api/logo" alt="ZTF Quotes" />
      </a>
      <h2>Your Weekly Quote Digest</h2>
      <p>Here are this week's inspiring quotes to enrich your spiritual journey.</p>
      <div class="header-links">
        <a href="https://quotes.ztfomum.org/quotes">Browse Quotes</a> |
        <a href="https://quotes.ztfomum.org/about">About Us</a> |
        <a href="https://quotes.ztfomum.org/contact">Contact</a>
      </div>
    </div>

    ${quotes.map(quote => `
      <div class="quote">
        <p>${quote.text}</p>
        <p><strong>- ${quote.authors.name}</strong></p>
        <p>Category: ${quote.categories.name}</p>
        ${quote.source_title ? `
          <div class="quote-source">
            Source: ${quote.source_url ? 
              `<a href="${quote.source_url}" class="source-link" target="_blank" rel="noopener noreferrer">${quote.source_title}</a>` : 
              quote.source_title
            }
          </div>
        ` : ''}
        <div class="quote-actions">
          <a href="https://quotes.ztfomum.org/quotes/${quote.id}" class="cta-button" target="_blank" rel="noopener noreferrer">
            Read More & Share
          </a>
        </div>
      </div>
    `).join('')}
    
    <div class="footer">
      <p>You're receiving this because you subscribed to weekly digest notifications.</p>
      <p>To update your preferences, please <a href="https://quotes.ztfomum.org/profile" style="color: #8B5CF6; text-decoration: underline;">visit your profile settings</a>.</p>
      <a href="https://quotes.ztfomum.org/profile" class="cta-button">
        Manage Preferences
      </a>
      
      <div class="social-links">
        <p>Connect with us:</p>
        <a href="https://twitter.com/ZTFBooks" target="_blank" rel="noopener noreferrer">Twitter</a> |
        <a href="https://facebook.com/ZTFBooks" target="_blank" rel="noopener noreferrer">Facebook</a> |
        <a href="https://instagram.com/ZTFBooks" target="_blank" rel="noopener noreferrer">Instagram</a> |
        <a href="https://ztfbooks.com" target="_blank" rel="noopener noreferrer">Website</a>
      </div>
      
      <p style="margin-top: 20px; font-size: 12px;">
        &copy; ${new Date().getFullYear()} ZTF Books. All rights reserved.<br>
        Christian Mission International, P.O. Box 385, Bertoua, Cameroon
      </p>
    </div>
  </div>
</body>
</html>
`;