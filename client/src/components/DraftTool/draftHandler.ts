import { io } from "socket.io-client";
const socket = io('http://localhost:8070');

export function connectionHandler(connectURL: string | undefined) {
    socket.on('connect', () => {
        socket.on('welcome', (msg) => {
          console.log('Server: ', msg)
        })
      if(connectURL) {
        socket.emit('code', connectURL)
      }
    socket.on('goodMessage', (msg) => {
        console.log(msg)
    }) 
})
}

export const createDraftDBEntry = async (blueName: FormDataEntryValue, redName: FormDataEntryValue, tournamentID: FormDataEntryValue | null) => {
    try {
        const data = {
            blueName: blueName,
            redName: redName,
            tournamentID: tournamentID
        }

        console.log(data)
        const response = await fetch('http://localhost:8080/api/draft/createLobby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            // If the response status is not 200-299, throw an error
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        console.log(result)
    } catch(err) {
        console.error("Error in Creating Draft DB Entry: ", err )
    }
}