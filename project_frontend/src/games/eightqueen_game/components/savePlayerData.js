import axios from 'axios';

const savePlayerData = async (playerPositions, playerName, sequentialResult, setShowConfetti, setGameResult, setResetSolModal, setPlayerSolutionCount) => {

    const throwConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
    };

    try {
        setPlayerSolutionCount(-1);
        setGameResult("Win");
        throwConfetti();

        const response = await axios.post('http://localhost:5000/api/eightQueensPuzzle/savePlayerData', {
            playerName,
            playerPositions,
        });

        if (!response.data || response.status !== 200) {
            console.error("Invalid response from savePlayerData:", response);
            alert("Something went wrong while saving your solution. Please try again.");
            return;
        }

        const plSolCountRes = await axios.get('http://localhost:5000/api/eightQueensPuzzle/getPlayerSolutionCount');
        if (!plSolCountRes.data || plSolCountRes.status !== 200) {
            console.warn("Unexpected response for player solution count:", plSolCountRes);
            alert("Unable to fetch updated player count.");
            return;
        }
        setPlayerSolutionCount(plSolCountRes.data);

        if (plSolCountRes.data === sequentialResult?.numberOfSolutions) {
            setResetSolModal(true);
        }

        console.log('Player Data Saved:', response.data);
    } catch (error) {
        console.error("Failed to save player data:", error);
        alert("An error occurred while saving your progress. Please try again.");
    }
};

export default savePlayerData;