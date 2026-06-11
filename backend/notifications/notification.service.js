const firebase = require('./firebase');

exports.sendNotification = async (userId, title, message) => {
  try {
    await firebase.sendNotification(userId, title, message);
    return { success: true, message: 'Notification sent' };
  } catch (error) {
    // Log but never throw — notification failures must not break calling flows.
    console.error('Error sending notification:', error.message);
    return { success: false, message: error.message };
  }
};

exports.sendOrderStatusNotification = async (userId, orderId, status) => {
  const messages = {
    pending: 'Your order has been received',
    confirmed: 'Your order has been confirmed',
    preparing: 'Your order is being prepared',
    ready: 'Your order is ready for pickup',
    out_for_delivery: 'Your order is out for delivery',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
  };

  return exports.sendNotification(
    userId,
    'Order Update',
    messages[status] || 'Order status updated'
  );
};

exports.sendLoyaltyNotification = async (userId, pointsEarned) => {
  return exports.sendNotification(
    userId,
    'Loyalty Points',
    `You earned ${pointsEarned} points!`
  );
};
