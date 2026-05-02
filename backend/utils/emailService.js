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

    if (type === 'Confirmed') {
      subject = `Order Confirmed - #${order.orderId} | VogueVault`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #0A0A0A; text-align: center;">Order Confirmed! 🎉</h2>
          <p>Hi <strong>${order.userName}</strong>,</p>
          <p>Thank you for your order! We've received it and are currently processing it.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Order Details (#${order.orderId})</h3>
            ${order.items.map(item => `
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                ${item.image ? `<img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px;" />` : ''}
                <div>
                  <p style="margin: 0;"><strong>${item.name}</strong></p>
                  <p style="margin: 0; font-size: 12px; color: #666;">Qty: ${item.quantity} ${item.selectedSize ? `| Size: ${item.selectedSize}` : ''}</p>
                </div>
                <div style="margin-left: auto; font-weight: bold;">
                  ${formatPrice(item.price * item.quantity)}
                </div>
              </div>
            `).join('')}
            <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between;">
              <strong>Total Amount:</strong>
              <strong>${formatPrice(order.totalPrice)}</strong>
            </div>
          </div>
          
          <p>We'll notify you once your order is out for delivery.</p>
          <br/>
          <p style="color: #888; font-size: 12px; text-align: center;">VogueVault Team</p>
        </div>
      `;
    } else if (type === 'Delivered') {
      subject = `Order Delivered - #${order.orderId} | VogueVault`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #10B981; text-align: center;">Order Delivered! 📦</h2>
          <p>Hi <strong>${order.userName}</strong>,</p>
          <p>Great news! Your order <strong>#${order.orderId}</strong> has been successfully delivered to your shipping address.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">How did we do?</h3>
            <p>We hope you love your new purchase! If you have a moment, we'd love to hear your feedback on the platform.</p>
          </div>
          
          <p>Thank you for shopping with VogueVault!</p>
          <br/>
          <p style="color: #888; font-size: 12px; text-align: center;">VogueVault Team</p>
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
