// tokenUtils.js

export const decodeToken = (token) => {
    if (token) {
      const base64Url = token.split('.')[1]; // The payload is the second part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      // Parse the JSON payload
      return JSON.parse(jsonPayload);
    } else {
      throw new Error("No token provided.");
    }
  };
  