// Format an integer amount into Indian number format (e.g., 100000 -> 1,00,000)
export function formatINR(amount) {
  if (isNaN(amount)) return amount;
  return amount.toLocaleString('en-IN');
}
