import { Server } from "socket.io";

export function draftConnection(io: Server) {
    let code: string;
    let roomID: number;

    io.on('connection', async (socket) => {
        socket.emit('welcome', 'Beginning Room Search')
        socket.on('code', (msg) => {
          console.log('code: ' + msg);
          socket.emit( 'codeRecieved','connecting with code: ' +  msg)
          code = msg
        });
        if(code) {
        //    const roomId = await fetchRoomCode()
        }
      });

}


// export const fetchRoomCode = async () => {
//     const roomID = await selectRoomID()
//     if (!roomID) {
//         console.error("Room ID does not exist!")
//     } 
// }