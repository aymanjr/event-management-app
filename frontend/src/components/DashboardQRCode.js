import { QRCodeCanvas } from 'qrcode.react';
import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

export default function DashboardQRCode({ ticketId, eventTitle, eventDate, eventLocation }) {
  const qrRef = useRef();

  const handleDownload = () => {
    const qrCanvas = qrRef.current?.querySelector('canvas');
    if (!qrCanvas) return;
    // Create a new canvas to combine QR and text
    const width = 400;
    const height = 320;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#1a237e';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(eventTitle || 'Event Ticket', width/2, 40);

    // Date
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(eventDate || '', width/2, 70);

    // Location
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(eventLocation || '', width/2, 100);

    // Ticket ID label
    ctx.font = 'bold 15px Arial';
    ctx.fillStyle = '#444';
    ctx.fillText('Ticket ID:', width/2, 130);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#666';
    ctx.fillText(ticketId, width/2, 150);

    // Draw QR code (centered)
    ctx.drawImage(qrCanvas, (width-120)/2, 170, 120, 120);

    // Download
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${ticketId}.png`;
    link.click();
  };

  if (!ticketId) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }} ref={qrRef}>
      <QRCodeCanvas value={ticketId} size={96} />
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        sx={{ mt: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 15, boxShadow: 1 }}
        onClick={handleDownload}
      >
        Download Ticket
      </Button>
    </div>
  );
}
