import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import savePlayerData from "../components/savePlayerData";

vi.mock('axios');

describe('savePlayerData', () => {
    const mockSetShowConfetti = vi.fn();
    const mockSetGameResult = vi.fn();
    const mockSetResetSolModal = vi.fn();
    const mockSetPlayerSolutionCount = vi.fn();
    const mockSequentialResult = { numberOfSolutions: 92 };

    beforeEach(() => {
        vi.spyOn(global, 'setTimeout').mockImplementation((fn) => fn()); // run immediately
        vi.spyOn(window, 'alert').mockImplementation(() => { }); // suppress alerts
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should save player data and update the game result and solution count', async () => {
        const mockPlayerPositions = [[0, 4, 7, 5, 2, 6, 3, 1]];  // Sample positions
        const mockPlayerName = 'Player1';

        axios.post.mockResolvedValue({ status: 200, data: { success: true } });  // save success scenario

        axios.get.mockResolvedValue({ status: 200, data: 92 });  // get success scenario, all 92 sols are found hence resetSolModal is true

        await savePlayerData(
            mockPlayerPositions,
            mockPlayerName,
            mockSequentialResult,
            mockSetShowConfetti,
            mockSetGameResult,
            mockSetResetSolModal,
            mockSetPlayerSolutionCount
        );

        expect(mockSetShowConfetti).toHaveBeenCalledWith(true);
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 4000);  // Timeout should be set to remove confetti after 4 seconds

        expect(mockSetGameResult).toHaveBeenCalledWith('Win');

        expect(mockSetPlayerSolutionCount).toHaveBeenCalledWith(-1);

        expect(mockSetResetSolModal).toHaveBeenCalledWith(true);  // when get data is 92, this is true else fale
    });

    it('should handle error when API response is invalid', async () => {
        const mockPlayerPositions = [[0, 4, 7, 5, 2, 6, 3, 1]];
        const mockPlayerName = 'Player';

        // Mocking axios POST to return a failed response
        axios.post.mockResolvedValue({ status: 500, data: null });

        // Mocking axios GET to return a valid response
        axios.get.mockResolvedValue({ status: 200, data: 1 });

        // Call the function
        await savePlayerData(
            mockPlayerPositions,
            mockPlayerName,
            mockSequentialResult,
            mockSetShowConfetti,
            mockSetGameResult,
            mockSetResetSolModal,
            mockSetPlayerSolutionCount
        );

        // Check if the alert was called
        expect(window.alert).toHaveBeenCalledWith('Something went wrong while saving your solution. Please try again.');
        expect(mockSetShowConfetti).toHaveBeenCalled(); // Confetti is triggered
        expect(mockSetGameResult).toHaveBeenCalled();  // Game result is updated
    });

    it('should handle error in fetching player solution count', async () => {
        const mockPlayerPositions = [[0, 4, 7, 5, 2, 6, 3, 1]];
        const mockPlayerName = 'Player1';

        // Mocking axios POST to return a successful response
        axios.post.mockResolvedValue({ status: 200, data: { success: true } });

        // Mocking axios GET to return an invalid response
        axios.get.mockResolvedValue({ status: 500, data: null });

        await savePlayerData(
            mockPlayerPositions,
            mockPlayerName,
            mockSequentialResult,
            mockSetShowConfetti,
            mockSetGameResult,
            mockSetResetSolModal,
            mockSetPlayerSolutionCount
        );

        // Check if the alert for solution count error was called
        expect(window.alert).toHaveBeenCalledWith('Unable to fetch updated player count.');
        expect(mockSetShowConfetti).toHaveBeenCalledWith(true);
        expect(mockSetGameResult).toHaveBeenCalledWith('Win');
        expect(mockSetResetSolModal).not.toHaveBeenCalled();  // reset modal shouldn't be called if there was an issue fetching the solution count
    });

    it('should catch unexpected errors and alert', async () => {
        const mockPlayerPositions = [[0, 4, 7, 5, 2, 6, 3, 1]];
        const mockPlayerName = 'Player1';

        // Mocking axios POST to throw an error
        axios.post.mockRejectedValue(new Error('Network Error'));

        await savePlayerData(
            mockPlayerPositions,
            mockPlayerName,
            mockSequentialResult,
            mockSetShowConfetti,
            mockSetGameResult,
            mockSetResetSolModal,
            mockSetPlayerSolutionCount
        );

        // Check if the alert for error was called
        expect(window.alert).toHaveBeenCalledWith('An error occurred while saving your progress. Please try again.');
        expect(mockSetShowConfetti).toHaveBeenCalled(); // Confetti is triggered
        expect(mockSetGameResult).toHaveBeenCalled();  // Game result is updated
    });
});