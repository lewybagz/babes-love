/**
 * List of email addresses that have admin access
 * Edit this array to add or remove admin users
 */
export const ADMIN_EMAILS: string[] = [
  "admin@babeslove.com",
  "owner@babeslove.com",
  "lleep1997@gmail.com",
  // Add more admin emails here
];

/**
 * Check if an email has admin access
 * @param email Email address to check
 * @returns Boolean indicating if the email has admin access
 */
export const hasAdminAccess = (email: string | null | undefined): boolean => {
  if (!email) {
    console.log('Admin check: No email provided');
    return false;
  }
  
  const normalizedEmail = email.toLowerCase();
  const hasAccess = ADMIN_EMAILS.includes(normalizedEmail);
  
  console.log(`Admin check for ${normalizedEmail}: ${hasAccess ? 'GRANTED' : 'DENIED'}`);
  console.log('Authorized admin emails:', ADMIN_EMAILS);
  
  return hasAccess;
}; 