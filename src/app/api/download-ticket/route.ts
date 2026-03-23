import { NextRequest, NextResponse } from "next/server";

// Note: You'll need to install html2pdf or similar
// npm install html2pdf.js
// For now, creating a simple PDF generation endpoint

export async function POST(request: NextRequest) {
    try {
        const { reference, ticketType } = await request.json();

        if (!reference) {
            return NextResponse.json(
                { error: "Reference is required" },
                { status: 400 }
            );
        }

        // Create a simple HTML-based PDF content
        // In production, use jsPDF or similar library
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .ticket-id { font-size: 24px; font-weight: bold; margin: 20px 0; }
          .info-box { 
            border: 2px solid #333; 
            padding: 15px; 
            margin: 10px 0; 
            background: #f5f5f5;
          }
          .label { font-weight: bold; color: #666; }
          .value { color: #000; margin-left: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏎️ ILORIN CAR SHOW 3.0</h1>
            <h2>Event Ticket</h2>
          </div>
          
          <div class="info-box">
            <div class="ticket-id">Reference: ${reference}</div>
          </div>
          
          <div class="info-box">
            <div><span class="label">Event:</span><span class="value">Ilorin Car Show 3.0</span></div>
            <div><span class="label">Type:</span><span class="value">${ticketType || "General Admission"}</span></div>
            <div><span class="label">Date:</span><span class="value">To be announced</span></div>
            <div><span class="label">Venue:</span><span class="value">Metropolitan Square, Asadam Road, Ilorin, Kwara State</span></div>
          </div>
          
          <div class="footer">
            <p>Please present this ticket at the gate.</p>
            <p>For inquiries, contact: info@ilorincarshow.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

        // For now, return as text/html
        // In production, convert to PDF using jsPDF or puppeteer
        return new NextResponse(htmlContent, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="ticket-${reference}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error generating ticket PDF:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
