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

    const validPlayerName = "Player";
    const validPositions = [[0, 4, 7, 5, 2, 6, 3, 1]];
    const reversedPositions = [...validPositions].reverse();
    const mockSequentialResult = { numberOfSolutions: 92 };

    beforeEach(() => {
        vi.spyOn(window, 'alert').mockImplementation(() => { }); // suppress alerts
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should alert on invalid name', async () => {
        axios.get
            .mockResolvedValueOnce({ data: [{ sequential_solution: [] }] }) // sequential
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
        axios.get
            .mockResolvedValueOnce({
                data: [{
                    sequential_solution: [reversedPositions[0]] // match
                }]
            })
            .mockResolvedValueOnce({
                data: []
            });

        await handleSubmit(validPlayerName, reversedPositions, mockSetGameResult, mockSequentialResult, mockSetShowConfetti, mockSetResetSolModal, mockSetPlayerSolutionCount);

        expect(mockSetGameResult).toHaveBeenCalledWith('Loading');
        expect(savePlayerData).toHaveBeenCalledWith(validPlayerName, reversedPositions, mockSequentialResult, mockSetShowConfetti, mockSetGameResult, mockSetResetSolModal, mockSetPlayerSolutionCount);
    });

    it('should set game result to Draw if player has already submitted the solution', async () => {
        axios.get
            .mockResolvedValueOnce({
                data: [{
                    sequential_solution: [reversedPositions[0]] // match
                }]
            })
            .mockResolvedValueOnce({
                data: [{ solution: reversedPositions[0] }] // already submitted
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
        expect(mockSetGameResult).toHaveBeenCalledWith('Draw');
        expect(savePlayerData).not.toHaveBeenCalled();
    });

    it('should catch and alert on axios error', async () => {
        window.alert = vi.fn();
        console.error = vi.fn();

        axios.get.mockRejectedValue(new Error('Network Error'));

        await handleSubmit(
            validPlayerName,
            validPositions,
            mockSetGameResult,
            mockSequentialResult,
            mockSetShowConfetti,
            mockSetResetSolModal,
            mockSetPlayerSolutionCount
        );

        expect(window.alert).toHaveBeenCalledWith("Something went wrong. Please check your connection and try again.");
        expect(console.error).toHaveBeenCalled();
        expect(savePlayerData).not.toHaveBeenCalled();
    });
});