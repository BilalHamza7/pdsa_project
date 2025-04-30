import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import handleSubmit from "../components/handleSubmit";
import savePlayerData from "../components/savePlayerData";

vi.mock('axios');
vi.mock('../components/savePlayerData.js');

describe('handleSubmit', () => {
    const mockSetGameResult = vi.fn();
    const mockSetResetSolModal = vi.fn();
    const mockSetShowConfetti = vi.fn();
    const mockSetPlayerSolutionCount = vi.fn();
    const mockSequentialResult = { numberOfSolutions: 92 };

    const validPlayerName = "Player";
    const validPositions = [3, 1, 6, 2, 5, 7, 4, 0];
    const finalPos = validPositions.slice().reverse();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should alert on invalid name', async () => {
        vi.spyOn(window, 'alert').mockImplementation(() => { });

        axios.get
            .mockResolvedValueOnce({ data: [{ sequential_solution: [] }] })
            .mockResolvedValueOnce({ data: [] });

        await handleSubmit('player1', validPositions, mockSetGameResult, mockSequentialResult, mockSetShowConfetti, mockSetResetSolModal, mockSetPlayerSolutionCount);

        expect(window.alert).toHaveBeenCalledWith('Please Enter A Valid Player Name!');
        expect(savePlayerData).not.toHaveBeenCalled();
        expect(mockSetGameResult).not.toHaveBeenCalled();
    });

    it('should set game result to Lose if not in sequential solutions', async () => {
        axios.get.mockResolvedValueOnce({ data: [{ sequential_solution: [] }] }).mockResolvedValueOnce({ data: [] });  // sequential and player

        await handleSubmit(validPlayerName, validPositions, mockSetGameResult, mockSequentialResult, mockSetShowConfetti, mockSetResetSolModal, mockSetPlayerSolutionCount);

        expect(mockSetGameResult).toHaveBeenCalledWith('Loading');
        expect(mockSetGameResult).toHaveBeenCalledWith('Lose');
        expect(savePlayerData).not.toHaveBeenCalled();
    });

    it('should save data if valid new player solution (win)', async () => {
        // 1st API call: sequential solutions
        axios.get
            .mockResolvedValueOnce({
                data: [{ sequential_solution: [finalPos] }]
            })
            .mockResolvedValueOnce({
                data: []
            });

        await handleSubmit(
            validPlayerName,
            validPositions,
            mockSetGameResult,
            mockSequentialResult,
            mockSetShowConfetti,
            mockSetResetSolModal,
            mockSetPlayerSolutionCount
        );

        expect(mockSetGameResult).toHaveBeenCalledWith('Loading');
        expect(savePlayerData).toHaveBeenCalledWith(finalPos, validPlayerName, mockSequentialResult, mockSetShowConfetti, mockSetGameResult, mockSetResetSolModal, mockSetPlayerSolutionCount);
    });

    it('should set game result to Draw if player has already submitted the solution', async () => {

        axios.get.mockResolvedValueOnce({ data: [{ sequential_solution: [finalPos] }] }).mockResolvedValueOnce({ data: [{ solution: finalPos }] });

        await handleSubmit(validPlayerName, finalPos, mockSetGameResult, mockSequentialResult, mockSetShowConfetti, mockSetResetSolModal, mockSetPlayerSolutionCount);

        expect(mockSetGameResult).toHaveBeenCalledWith('Loading');
        expect(mockSetGameResult).toHaveBeenCalledWith("Draw");
        expect(savePlayerData).not.toHaveBeenCalled();
    });

    it('should catch and alert on axios error', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        vi.spyOn(window, 'alert').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });

        await handleSubmit(validPlayerName, validPositions, mockSetGameResult, mockSequentialResult, mockSetShowConfetti, mockSetResetSolModal, mockSetPlayerSolutionCount);

        expect(window.alert).toHaveBeenCalledWith("Something went wrong. Please check your connection and try again.");
        expect(console.error).toHaveBeenCalled();
        expect(savePlayerData).not.toHaveBeenCalled();
    });
});