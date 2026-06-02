const firebase = require('./firebase');

exports.sendNotification = async (userId, title, message) => {
  try {
    // Send notification via Firebase
    await firebase.sendNotification(userId, title, message);
    return { success: true, message: 'Notification sent' };
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

exports.sendOrderStatusNotification = async (userId, orderId, status) => {
  const messages = {
    pending: 'Your order has been received',
    processing: 'Your order is being prepared',
    ready: 'Your order is ready for pickup',
    completed: 'Your order has been completed',
    cancelled: 'Your order has been cancelled'
  };
  
  return exports.sendNotification(userId, 'Order Update', messages[status] || 'Order status updated');
};

exports.sendLoyaltyNotification = async (userId, pointsEarned) => {
  return exports.sendNotification(userId, 'Loyalty Points', `You earned ${pointsEarned} points!`);
};
