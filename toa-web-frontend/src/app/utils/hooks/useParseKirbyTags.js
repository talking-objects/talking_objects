export const parseKirbyTags = (text) => {
    const linkRegex = /\(link:\s*(https?:\/\/[^\s]+)\s*text:\s*([^\)]+)\)/g;
    text = text.replace(linkRegex, '<a href="$1">$2</a>');
  
     // Regular expression to match Kirby's email tag: (email: email@example.com text: linkText)
     const emailRegex = /\(email:\s*([^\s]+)\s*text:\s*([^\)]+)\)/g;
     text = text.replace(emailRegex, '<a href="mailto:$1">$2</a>');
  
    // Replace Kirby's link syntax with a valid HTML <a> tag
    return text
  };