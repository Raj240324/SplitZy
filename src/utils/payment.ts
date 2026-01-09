/**
 * Generates a UPI payment URL for deep linking.
 * Format: upi://pay?pa=<address>&pn=<name>&am=<amount>&cu=INR&tn=<note>&tr=<ref>&mc=<mcode>
 * 
 * @param address The recipient's UPI ID (e.g., example@upi)
 * @param name The recipient's name
 * @param amount The transaction amount
 * @param transactionId Optional unique transaction reference
 * @returns A string representing the UPI deep link
 */
export const generateUpiLink = (address: string, name: string, amount: number, transactionId?: string) => {
  // Encode parameters to ensure the URL is valid
  const encodedName = encodeURIComponent(name);
  const roundedAmount = amount.toFixed(2);
  
  // mc=0000 is often used for P2P transactions to avoid some risk flags
  // tr is critical for trackability and reducing risk alerts in some apps
  let link = `upi://pay?pa=${address}&pn=${encodedName}&am=${roundedAmount}&cu=INR&tn=SplitZy Payment&mc=0000`;
  
  if (transactionId) {
    link += `&tr=${transactionId}`;
  }
  
  return link;
};

/**
 * Validates if a string is a potentially valid UPI ID format.
 * Basic format: username@bankname
 */
export const isValidUpiId = (upi: string) => {
  const upiRegex = /^[\w.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(upi);
};
