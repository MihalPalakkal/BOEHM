export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const getRewardPoints = (amount) => Math.floor(Number(amount || 0) / 10);

export default formatCurrency;
