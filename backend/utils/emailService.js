import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendOrderEmail = async (order, type) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not configured. Skipping email sent.');
      return;
    }

    const transporter = createTransporter();
    
    let subject = '';
    let htmlContent = '';

    const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

    if (type === 'Placed') {
      subject = `Order Received - #${order.orderId} | VogueVault`;
      htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; border: 1px solid #EAEAEA; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #000; padding: 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px;">VOGUEVAULT</h1>
          </div>
          
          <div style="padding: 32px 24px;">
            <h2 style="color: #000; margin-top: 0; font-size: 20px;">Order Received! 🎉</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #444;">Hi <strong>${order.userName}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6; color: #444;">Thank you for shopping with VogueVault. We've received your order and are currently preparing it for dispatch.</p>
            
            <div style="background: #FAFAFA; border: 1px solid #F0F0F0; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <h3 style="margin-top: 0; border-bottom: 1px solid #E5E5E5; padding-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Summary (#${order.orderId})</h3>
              
              ${order.items.map(item => `
                <div style="display: flex; align-items: flex-start; padding: 12px 0; border-bottom: 1px dashed #E5E5E5;">
                  ${item.image ? `<img src="${item.image}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 16px; border: 1px solid #eee;" />` : ''}
                  <div style="flex-grow: 1;">
                    <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">${item.name}</p>
                    <p style="margin: 0; font-size: 13px; color: #666;">Qty: ${item.quantity} ${item.selectedSize ? `| Size: ${item.selectedSize}` : ''}</p>
                  </div>
                  <div style="font-weight: 600; font-size: 14px;">
                    ${formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              `).join('')}
              
              <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 8px;">
                <span style="font-size: 14px; color: #666;">Shipping:</span>
                <span style="font-size: 14px; color: #666;">${formatPrice(order.shippingPrice)}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #E5E5E5;">
                <strong style="font-size: 16px;">Total Paid:</strong>
                <strong style="font-size: 16px;">${formatPrice(order.totalPrice)}</strong>
              </div>
            </div>
            
            <div style="background-color: #F8F9FA; padding: 16px; border-radius: 8px; margin-top: 24px;">
              <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">Delivery Address</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.5;">
                ${order.shippingAddress?.fullName}<br/>
                ${order.shippingAddress?.address}<br/>
                ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}<br/>
                ${order.shippingAddress?.country}
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 32px; text-align: center;">We'll notify you once your order is shipped.</p>
          </div>
          
          <div style="background-color: #FAFAFA; border-top: 1px solid #EAEAEA; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #888;">© ${new Date().getFullYear()} VogueVault. All rights reserved.</p>
          </div>
        </div>
      `;
    } else if (type === 'Confirmed') {
      subject = `Order Confirmed - #${order.orderId} | VogueVault`;
      htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; border: 1px solid #EAEAEA; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #000; padding: 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px;">VOGUEVAULT</h1>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="color: #000; margin-top: 0; font-size: 20px;">Order Confirmed! ✅</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #444;">Hi <strong>${order.userName}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6; color: #444;">Great news! Your order <strong>#${order.orderId}</strong> has been confirmed and is being processed for shipping.</p>
            <p style="font-size: 14px; color: #666; margin-top: 32px; text-align: center;">We'll notify you once it's dispatched.</p>
          </div>
        </div>
      `;
    } else if (type === 'Delivered') {
      subject = `Order Delivered - #${order.orderId} | VogueVault`;
      htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; border: 1px solid #EAEAEA; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #000; padding: 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px;">VOGUEVAULT</h1>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="color: #10B981; margin-top: 0; font-size: 20px;">Order Delivered! 📦</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #444;">Hi <strong>${order.userName}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6; color: #444;">Your order <strong>#${order.orderId}</strong> has been successfully delivered to your shipping address.</p>
            <div style="background: #FAFAFA; border: 1px solid #F0F0F0; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <h3 style="margin-top: 0; font-size: 16px;">How did we do?</h3>
              <p style="margin: 0; font-size: 14px; color: #555;">We hope you love your new purchase! If you have a moment, we'd love to hear your feedback.</p>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 32px; text-align: center;">Thank you for shopping with VogueVault!</p>
          </div>
        </div>
      `;
    } else {
      return; // Skip other statuses
    }

    const mailOptions = {
      from: `"VogueVault" <${process.env.EMAIL_USER}>`,
      to: order.userEmail,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${order.userEmail} - Status: ${type} - MsgID: ${info.messageId}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
