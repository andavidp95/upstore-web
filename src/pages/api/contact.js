export const prerender = false; 

import nodemailer from 'nodemailer';

export const POST = async ({ request }) => {
  try {
    // 1. Leer los datos del FormData enviado desde el cliente
    const data = await request.formData();
    
    const name = data.get('name');
    const email = data.get('email');
    const company = data.get('company') || 'No especificado';
    const country_code = data.get('country_code') || '';
    const phone = data.get('phone') || 'No especificado';
    const service_type = data.get('service_type');
    const investment_range = data.get('investment_range') || 'No especificado';
    const project_details = data.get('project_details');
    const turnstileToken = data.get('turnstile-token');

    // 2. Validar Turnstile con Cloudflare (Protección Anti-Spam)
    if (turnstileToken) {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        return new Response(JSON.stringify({ errors: ['Falló la verificación de seguridad. Bot detectado.'] }), { status: 400 });
      }
    } else {
      return new Response(JSON.stringify({ errors: ['Falta el token de seguridad.'] }), { status: 400 });
    }

    // 3. Procesar los archivos adjuntos en memoria (Buffer)
    const files = data.getAll('technical_docs');
    const attachments = [];
    
    for (const file of files) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name,
          content: buffer,
          contentType: file.type
        });
      }
    }

    // 4. Configurar Nodemailer con Zoho
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST,
      port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
      },
      tls: { rejectUnauthorized: true }
    });

    // 5. Enviar Email al Administrador (A ti)
    await transporter.sendMail({
      from: `"Notificaciones UPStore" <${process.env.ZOHO_SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'ventas@upstore.com.ec',
      subject: `🔔 Nuevo proyecto: ${name} - ${service_type}`,
      attachments: attachments, // Enviamos los documentos del cliente
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🔔 Nuevo proyecto solicitado</h1>
            <p>Enviado desde el formulario web - Vercel Serverless</p>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; color: #333; border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 15px;"><strong>👤 Nombre:</strong> ${name}</div>
            <div style="margin-bottom: 15px;"><strong>📧 Email:</strong> ${email}</div>
            <div style="margin-bottom: 15px;"><strong>🏢 Empresa:</strong> ${company}</div>
            <div style="margin-bottom: 15px;"><strong>📱 Teléfono:</strong> ${country_code} ${phone}</div>
            <div style="margin-bottom: 15px;"><strong>🔧 Servicio:</strong> ${service_type}</div>
            <div style="margin-bottom: 15px;"><strong>💰 Inversión:</strong> ${investment_range}</div>
            <div style="margin-bottom: 15px;"><strong>📝 Detalles:</strong><br><p style="background: white; padding: 15px; border-radius: 8px;">${project_details}</p></div>
            <div style="margin-bottom: 15px; color: #667eea;"><strong>📎 Archivos adjuntos:</strong> ${attachments.length} archivo(s) procesado(s).</div>
          </div>
        </div>
      `
    });

    // 6. Enviar Email de Confirmación al Cliente (Auto-respuesta)
    await transporter.sendMail({
      from: `"UPStore" <${process.env.ZOHO_SMTP_USER}>`,
      to: email,
      subject: '✅ Hemos recibido su mensaje - UPStore',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">¡Mensaje Recibido!</h1>
            <p>Gracias por contactarnos</p>
          </div>
          <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px; color: #333; border: 1px solid #e2e8f0;">
            <p style="font-size: 16px;">Hola <strong>${name}</strong>,</p>
            <p style="font-size: 16px;">Hemos recibido sus datos del proyecto asociado al área de <strong>${service_type}</strong> y queremos agradecerle por su interés en nuestros servicios.</p>
            <p style="font-size: 16px;">Nuestro equipo de ingeniería está revisando los detalles y le contactaremos en un plazo máximo de <strong>24-48 horas hábiles</strong> para brindarle una atención personalizada.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://upstore.com.ec" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Visitar Nuestro Sitio Web</a>
            </div>
            <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #718096;">
              <p>Este es un mensaje automático, por favor no responder a este correo.</p>
            </div>
          </div>
        </div>
      `
    });

    // 7. Responder éxito al frontend
    return new Response(JSON.stringify({ success: true, message: 'Correos enviados correctamente' }), { status: 200 });

  } catch (error) {
    console.error('❌ Error enviando correos (Serverless):', error);
    return new Response(JSON.stringify({ errors: ['Hubo un error interno en el servidor de correo. Por favor contacte directamente por WhatsApp.'] }), { status: 500 });
  }
};