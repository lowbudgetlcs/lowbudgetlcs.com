import { Namespace, Server, Socket } from "socket.io";
import { fearlessState } from "../initializers/fearlessLobbyInitializer";
import { updateFearlessClientState } from "../states/clientFearlessState";
import fearlessSideAssignment from "../initializers/fearlessSideAssignment";
import { draftState } from "../../sockets/draftState";

export const fearlessSocket = (io: Namespace) => {
  io.on("connection", (socket: Socket) => {
    console.log("New connection to fearless socket");

    // Join a fearless series
    socket.on("joinFearless", ({ fearlessCode, teamCode }) => {
      try {
        const series = fearlessState[fearlessCode];

        if (!series) {
          socket.emit("error", { message: "Invalid fearless series code" });
          return;
        }

        // Determine user type
        let teamDisplay = "spectator";
        if (teamCode === series.team1Code) {
          teamDisplay = "team1";
        } else if (teamCode === series.team2Code) {
          teamDisplay = "team2";
        }

        // Join the fearless room
        socket.join(fearlessCode);
        socket.data.fearlessCode = fearlessCode;
        socket.data.team = teamDisplay;
        socket.data.teamCode = teamCode;

        socket.emit("joinedFearless", {
          success: true,
          teamDisplay,
          fearlessCode,
          teamCode,
        });
        // Send current state to client
        socket.emit("fearlessState", updateFearlessClientState(fearlessCode));

        console.log(`User joined fearless series ${fearlessCode} as ${teamDisplay}`);
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
          io.to(fearlessCode).emit("sideSelected", {
            selectedSide,
            currentDraftIndex: series.completedDrafts,
            lobbyCode: series.currentDraft,
            // Pass team-specific codes
            team1Side: selectedSide,
            team2Side: selectedSide === "blue" ? "red" : "blue",
          });
        }

        console.log(
          `Side selected for fearless series ${fearlessCode}: ${selectedSide}`
        );
      } catch (error) {
        console.error("Error in side selection:", error);
        socket.emit("error", { message: "Internal server error" });
      }
    });

    // Handle draft completion notification
    socket.on("draftCompleted", ({ fearlessCode, lobbyCode }) => {
      try {
        const series = fearlessState[fearlessCode];

        if (!series) {
          socket.emit("error", { message: "Invalid fearless series code" });
          return;
        }

        // Get the draft state for this completed draft
        const completedDraft = draftState[lobbyCode];
        if (!completedDraft) {
          socket.emit("error", { message: "Draft not found" });
          return;
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

          // Notify all clients that the series is complete
          io.to(fearlessCode).emit("fearlessCompleted", {
            team1Name: series.team1Name,
            team2Name: series.team2Name,
            allPicks: series.allPicks,
            allBans: series.allBans,
          });
        } else {
          // Notify clients to move to the next draft
          io.to(fearlessCode).emit("nextDraft", {
            currentDraftIndex: series.completedDrafts,
            remainingDrafts: series.draftCount - series.completedDrafts,
          });
        }

        console.log(
          `Draft completed for fearless series ${fearlessCode}: ${series.completedDrafts}/${series.draftCount}`
        );
      } catch (error) {
        console.error("Error handling draft completion:", error);
        socket.emit("error", { message: "Internal server error" });
      }
    });

    // Clean up on disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected from fearless socket");
    });
  });
};
