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

    // Helper to generate the items HTML
    const getItemsHtml = () => order.items.map(item => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #EAEAEA;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="60" style="padding-right: 15px;">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" width="60" height="75" style="display: block; border-radius: 4px; object-fit: cover; background-color: #F8F8F8;" />` : `<div style="width: 60px; height: 75px; background-color: #F8F8F8; border-radius: 4px;"></div>`}
              </td>
              <td valign="top">
                <p style="margin: 0 0 5px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #0A0A0A;">
                  ${item.name}
                </p>
                <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #666666;">
                  Qty: ${item.quantity} ${item.selectedSize ? `&nbsp;|&nbsp; Size: ${item.selectedSize}` : ''}
                </p>
              </td>
              <td valign="top" align="right" style="width: 80px;">
                <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #0A0A0A;">
                  ${formatPrice(item.price * item.quantity)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');

    // Common Email Layout wrapper
    const createEmailLayout = (headerTitle, subHeader, mainMessage, includeTrackButton = false) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${headerTitle}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F5F5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                
                <!-- HEADER -->
                <tr>
                  <td align="center" style="background-color: #0A0A0A; padding: 30px 40px;">
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">VogueVault</h1>
                  </td>
                </tr>

                <!-- HERO SECTION -->
                <tr>
                  <td align="center" style="padding: 40px 40px 20px 40px;">
                    <h2 style="margin: 0 0 10px 0; color: #0A0A0A; font-size: 24px; font-weight: 600;">${headerTitle}</h2>
                    <p style="margin: 0; color: #666666; font-size: 15px; line-height: 1.5;">${subHeader}</p>
                  </td>
                </tr>

                <!-- MESSAGE -->
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <p style="margin: 0; color: #0A0A0A; font-size: 15px; line-height: 1.6;">
                      Hi <strong>${order.userName}</strong>,<br><br>
                      ${mainMessage}
                    </p>
                  </td>
                </tr>

                <!-- ORDER DETAILS -->
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <div style="border: 1px solid #EAEAEA; border-radius: 8px; padding: 25px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding-bottom: 15px; border-bottom: 2px solid #0A0A0A;">
                            <h3 style="margin: 0; color: #0A0A0A; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
                            <p style="margin: 5px 0 0 0; color: #888888; font-size: 13px;">Order #${order.orderId}</p>
                          </td>
                        </tr>
                        
                        ${getItemsHtml()}

                        <!-- TOTALS -->
                        <tr>
                          <td style="padding-top: 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding-bottom: 10px;">
                                  <p style="margin: 0; font-size: 14px; color: #666666;">Subtotal</p>
                                </td>
                                <td align="right" style="padding-bottom: 10px;">
                                  <p style="margin: 0; font-size: 14px; color: #0A0A0A; font-weight: 500;">${formatPrice(order.itemsPrice || order.totalPrice)}</p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 15px; border-bottom: 1px solid #EAEAEA;">
                                  <p style="margin: 0; font-size: 14px; color: #666666;">Shipping</p>
                                </td>
                                <td align="right" style="padding-bottom: 15px; border-bottom: 1px solid #EAEAEA;">
                                  <p style="margin: 0; font-size: 14px; color: #0A0A0A; font-weight: 500;">${order.shippingPrice > 0 ? formatPrice(order.shippingPrice) : 'Free'}</p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-top: 15px;">
                                  <p style="margin: 0; font-size: 16px; color: #0A0A0A; font-weight: 700;">Total</p>
                                </td>
                                <td align="right" style="padding-top: 15px;">
                                  <p style="margin: 0; font-size: 18px; color: #0A0A0A; font-weight: 700;">${formatPrice(order.totalPrice)}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>

                <!-- TRACKING BUTTON -->
                ${includeTrackButton ? `
                <tr>
                  <td align="center" style="padding: 0 40px 40px 40px;">
                    <a href="${process.env.FRONTEND_URL || 'https://voguevalut.vercel.app'}/orders" style="display: inline-block; background-color: #0A0A0A; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 35px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
                      View Order Status
                    </a>
                  </td>
                </tr>
                ` : ''}

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="background-color: #F8F8F8; padding: 30px 40px; border-top: 1px solid #EAEAEA;">
                    <p style="margin: 0 0 10px 0; color: #888888; font-size: 13px;">
                      Need help? Contact our support team at <a href="mailto:support@voguevault.com" style="color: #0A0A0A; text-decoration: underline;">support@voguevault.com</a>
                    </p>
                    <p style="margin: 0; color: #AAAAAA; font-size: 12px;">
                      © ${new Date().getFullYear()} VogueVault. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    if (type === 'Placed') {
      subject = `We've received your order! (#${order.orderId})`;
      htmlContent = createEmailLayout(
        'Order Received! 🎉',
        'Your style journey begins here.',
        'Thank you for shopping with VogueVault! We have received your order and our team is already preparing it for shipment.',
        true
      );
    } else if (type === 'Confirmed') {
      subject = `Your order is confirmed! (#${order.orderId})`;
      htmlContent = createEmailLayout(
        'Order Confirmed! ✨',
        'Great news! Your items are secured.',
        'Your order has been officially confirmed. We are currently processing it and will dispatch it shortly. We will send you another email once it\'s out for delivery.',
        true
      );
    } else if (type === 'Delivered') {
      subject = `Your order has been delivered! (#${order.orderId})`;
      htmlContent = createEmailLayout(
        'Order Delivered! 📦',
        'Time to unbox your new style.',
        'Great news! Your order has been successfully delivered to your shipping address. We hope you love your new purchase as much as we loved curating it for you.',
        false
      );
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
