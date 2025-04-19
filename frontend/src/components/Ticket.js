import QRCode from 'qrcode.react';

export default function Ticket({ ticket }) {
  return (
    <div className="ticket">
      <h3>{ticket.event.title}</h3>
      <QRCode 
        value={JSON.stringify({
          ticketId: ticket.ticketId,
          eventId: ticket.event.id
        })}
        size={128}
      />
      <p>Ticket ID: {ticket.ticketId}</p>
    </div>
  );
}