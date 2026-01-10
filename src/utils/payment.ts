/**
 * Generates a unique transaction reference for UPI payments.
 * Format: TXN + timestamp + random number
 * Example: TXN1704878325123
 */
export const generateTransactionRef = () => {
  return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

/**
 * Generates a UPI payment URL for deep linking.
 * Format: upi://pay?pa=<address>&pn=<name>&am=<amount>&cu=INR&tn=<note>&tr=<ref>&mc=<mcode>
 * 
 * @param upiId The recipient's UPI ID (e.g., example@upi)
 * @param payeeName The recipient's name
 * @param amount The transaction amount
 * @param note The transaction note/description
 * @param transactionRef Optional unique transaction reference
 * @returns A string representing the UPI deep link
 */
export const generateUpiLink = (
  upiId: string, 
  payeeName: string, 
  amount: number, 
  note: string,
  transactionRef?: string
) => {
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(note);
  const roundedAmount = amount.toFixed(2);
  
  // Base UPI URI parameters
  // mc=0000 is required for P2P/generic merchant code
  let link = `upi://pay?pa=${upiId}&pn=${encodedName}&am=${roundedAmount}&cu=INR&tn=${encodedNote}&mc=0000`;
  
  if (transactionRef) {
    link += `&tr=${transactionRef}`;
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
