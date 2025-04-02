import { Namespace, Server, Socket } from "socket.io";
import { fearlessState } from "../initializers/fearlessLobbyInitializer";
import { updateFearlessClientState } from "../states/clientFearlessState";
import fearlessSideAssignment from "../initializers/fearlessSideAssignment";
import { draftState } from "../../sockets/draftState";
import EventEmitter from "events";
import { insertFinalFearlessLobby } from "../../db/queries/insert";

export const fearlessEmitters: Map<string, EventEmitter> = new Map();
export const fearlessSocket = (io: Namespace) => {
  io.on("connection", (socket: Socket) => {
    console.log("New connection to fearless socket");

    // Join a fearless series
    socket.on("joinFearless", ({ fearlessCode, teamCode }) => {
      try {
        const series = fearlessState[fearlessCode];
        console.log(fearlessCode);
        console.log(fearlessState);
        if (!series) {
          socket.emit("error", { message: "Invalid fearless series code" });
          return;
        }

            // Handle draft completion notification
    if (!fearlessEmitters.has(fearlessCode)) {
      fearlessEmitters.set(fearlessCode, new EventEmitter());

      fearlessEmitters.get(fearlessCode)!.on("draftCompleted", (data) => {
        const { fearlessCode, lobbyCode } = data;
        try {
          const series = fearlessState[fearlessCode];
          if (!series) {
            socket.emit("error", {
              message: "Invalid fearless series code",
            });
            return;
          }

          // Get the draft state for this completed draft
          const completedDraft = draftState[lobbyCode];
          if (!completedDraft) {
            socket.emit("error", { message: "Draft not found" });
            return;
          }

          if (!series.draftLobbyCodes) {
            series.draftLobbyCodes = [];
          }
          if (lobbyCode && !series.draftLobbyCodes.includes(lobbyCode)) {
            series.draftLobbyCodes.push(lobbyCode);
          }

          // Update the fearless state with the completed draft's data
          // Extract picks and bans
          series.allPicks.push(
            ...completedDraft.bluePicks,
            ...completedDraft.redPicks
          );
          series.allBans.push(
            ...completedDraft.blueBans,
            ...completedDraft.redBans
          );

          // Increment completed drafts counter
          series.completedDrafts++;

          // Clear current draft
          series.currentDraft = null;
          series.currentBlueSide = null;
          series.currentRedSide = null;

          // Check if series is complete
          if (series.completedDrafts >= series.draftCount) {
            series.fearlessComplete = true;
            const insertFinalFearlessHandler = async () => {
              await insertFinalFearlessLobby(series)
            }
            insertFinalFearlessHandler()
            console.log("FearlessCompleted: ", fearlessCode)
            // Notify all clients that the series is complete
            io.to(fearlessCode).emit(
              "fearlessCompleted",
              updateFearlessClientState(fearlessCode)
            );
          } else {
            // Notify clients to move to the next draft
            io.to(fearlessCode).emit(
              "nextDraft",
              updateFearlessClientState(fearlessCode)
            );
          }

          console.log(
            `Draft completed for fearless series ${fearlessCode}: ${series.completedDrafts}/${series.draftCount}`
          );
        } catch (error) {
          console.error("Error handling draft completion:", error);
          socket.emit("error", { message: "Internal server error" });
        }
      });
    }

        // Determine user type
        let teamDisplay = "spectator";
        if (teamCode === series.team1Code) {
          teamDisplay = "team1";
        } else if (teamCode === series.team2Code) {
          teamDisplay = "team2";
        }

        if (!fearlessEmitters.has(fearlessCode)) {
          fearlessEmitters.set(fearlessCode, new EventEmitter());
        }

        // Join the fearless room
        socket.join(fearlessCode);
        socket.data.fearlessCode = fearlessCode;
        socket.data.team = teamDisplay;
        socket.data.teamCode = teamCode;

        socket.emit("joinedFearless", {
          teamDisplay,
          fearlessState: series,
        });
        // Send current state to client
        socket.emit("fearlessState", updateFearlessClientState(fearlessCode));

        console.log(
          `User joined fearless series ${fearlessCode} as ${teamDisplay}`
        );
      } catch (error) {
        console.error("Error joining fearless series:", error);
        socket.emit("error", { message: "Internal server error" });
      }
    });

    // Handle side selection (only team1 can select sides)
    socket.on("selectSide", async ({ fearlessCode, selectedSide }) => {
      try {
        const series = fearlessState[fearlessCode];

        if (!series) {
          socket.emit("error", { message: "Invalid fearless series code" });
          return;
        }

        // Only team1 can select sides and only when there is no current draft
        if (socket.data.teamCode !== series.team1Code || series.currentDraft) {
          socket.emit("error", { message: "Not authorized to select sides" });
          return;
        }

        // sets sides according to user input
        await fearlessSideAssignment(
          socket.data.teamCode,
          series,
          selectedSide
        );

        // The current draft should now be set
        if (series.currentDraft) {
          // Notify all clients in the series
          io.to(fearlessCode).emit(
            "sideSelected",
            updateFearlessClientState(fearlessCode)
          );
        }
        socket.emit("fearlessState", updateFearlessClientState(fearlessCode));

        console.log(
          `Side selected for fearless series ${fearlessCode}: ${selectedSide}`
        );
      } catch (error) {
        console.error("Error in side selection:", error);
        socket.emit("error", { message: "Internal server error" });
      }
    });

    socket.on("fearlessStateUpdate", ({ fearlessCode }) => {
      socket.emit("newFearlessState", updateFearlessClientState(fearlessCode));
    });

    // Clean up on disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected from fearless socket");
    });
  });
};
