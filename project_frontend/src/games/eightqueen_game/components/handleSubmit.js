import axios from 'axios';
import savePlayerData from './savePlayerData';

const handleSubmit = async (playerName, positions, setGameResult, sequentialResult, setShowConfetti, setResetSolModal, setPlayerSolutionCount) => {
    const namePattern = /^[A-Za-z\s]+$/;  //checks if player name matches the regex
    if (playerName.trim() === '' || !namePattern.test(playerName)) {
        alert('Please Enter A Valid Player Name!');
        return;
    }
    setGameResult("Loading");
    const finalPos = positions.slice().reverse();  // copy and reverse

    try {
        const sequentialRes = await axios.get('http://localhost:5000/api/eightQueensPuzzle/getSequentialSolutions');
        const playerRes = await axios.get('http://localhost:5000/api/eightQueensPuzzle/getPlayerSolutions');

        // check if solution is matching a value in the solutions record in the database
        const sequentialData = sequentialRes.data?.[0]?.sequential_solution;
        const playerData = Array.isArray(playerRes.data) ? playerRes.data.map(item => item.solution) : [];  // map the solutions to an array

        const algoExists = sequentialData.some(
            solution => JSON.stringify(solution) === JSON.stringify(finalPos)  // check if current solution exists in the stored algorithm solutions
        );

        const playerExists = playerData.some(
            solution => JSON.stringify(solution) === JSON.stringify(finalPos)  // check if current solution does not exists in the stored player solutions
        );

        if (!algoExists) setGameResult("Lose");
        else if (!playerExists) await savePlayerData(finalPos, playerName, sequentialResult, setShowConfetti, setGameResult, setResetSolModal, setPlayerSolutionCount);
        else setGameResult("Draw");

    } catch (error) {
        console.error("Submission failed:", error);
        alert("Something went wrong. Please check your connection and try again.");
    }
};

export default handleSubmit;