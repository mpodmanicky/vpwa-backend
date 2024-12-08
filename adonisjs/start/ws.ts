import app from '@adonisjs/core/services/app'
import Ws from '#services/Ws'
import Message from '#models/message'

app.ready(() => {
  Ws.boot()
  const io = Ws.io
  io?.on('connection', (socket) => {
    console.log('Client connected...', socket.id)

    socket.on('join', async (channel) => {
      socket.join(channel);
      console.log(`User joined channel: ${channel}`);
    });

    // Sending a message to the backend
    socket.on('send_message', async (data) => {
      const { channel, username, message } = data;

      try {
        // Save the message to the database
        const savedMessage = await Message.create({
          channel_id: channel,
          user_id: username,
          message_data: message,
        });

        console.log(`Message sent to ${channel}`);

        // Broadcast the message to all connected clients in that channel
        io.to(channel).emit('receive_message', {
          channel,
          username,
          message: savedMessage.message_data,
        });
      } catch (error) {
        console.error('Failed to save or broadcast message', error);
      }
    });
  });

  console.log('Websocket server is running...')
})

