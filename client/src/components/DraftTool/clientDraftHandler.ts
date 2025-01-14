import { Socket } from "socket.io-client"

export const handleBanPhase = (setCurrentTime: React.Dispatch<React.SetStateAction<number>>, sideCode: string | undefined, socket: Socket) => {
    let banTimer = 30
    socket.on('timer', (timer: number) => {
        banTimer = timer - 4
        setCurrentTime(banTimer)
    })
}

export const handlePickPhase = (setCurrentTime: React.Dispatch<React.SetStateAction<number>>, sideCode: string | undefined, socket: Socket) => {
    let pickTimer = 34
    
}