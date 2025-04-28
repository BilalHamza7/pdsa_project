import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import '@testing-library/jest-dom';
import React from "react";
import TowerOfHanoi from '../main';

//1

describe('TowerOfHanoi', () => {
  it('renders the Tower of Hanoi game title', () => {
    render(
        <MemoryRouter>
        <TowerOfHanoi />
      </MemoryRouter>
    );
    
    // Check if main title appears
    expect(screen.getByText(/Tower of Hanoi Game/i))
  });
});

//2

describe("handlePegClick", () => {
  let alertMock;

  beforeEach(() => {
    alertMock = vi.spyOn(global, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertMock.mockRestore();
  });

  it("should select the top disk when clicking a peg with disks", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <TowerOfHanoi />
      </MemoryRouter>
    );

    // Simulate clicking peg A
    const pegA = getByTestId("peg-A");
    fireEvent.click(pegA);

    // Since state updates asynchronously, check if a disk is selected
    expect(alertMock).not.toHaveBeenCalled();
  });

  it("should move a selected disk to another peg if valid", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <TowerOfHanoi />
      </MemoryRouter>
    );

    // Select a disk first (click peg A)
    const pegA = getByTestId("peg-A");
    fireEvent.click(pegA);

    // Move disk by clicking peg B
    const pegB = getByTestId("peg-B");
    fireEvent.click(pegB);

    expect(alertMock).not.toHaveBeenCalled();
  });

  it("should prevent invalid moves and show an alert", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <TowerOfHanoi />
      </MemoryRouter>
    );

    // Simulating an invalid move by manually placing a smaller disk in peg B
    const pegA = getByTestId("peg-A");
    fireEvent.click(pegA); // Select a disk (assuming the largest disk)

    const pegB = getByTestId("peg-B");
    fireEvent.click(pegB); // Attempt invalid move onto a smaller disk

    console.log(alertMock.mock.calls); // Debugging output
    
});

});


//3
// Mock the fetch requests used inside handleSubmit
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ id: "mocked-player-id", game_id: "mocked-game-id" }),
  })
);

describe('TowerOfHanoi handleSubmit functionality', () => {

  beforeEach(() => {
    fetch.mockClear(); // Clear mocks before each test
  });

  it('shows alert if player name is empty', async () => {
    window.alert = vi.fn(); // Mock alert
    render(
      <MemoryRouter>
        <TowerOfHanoi />
      </MemoryRouter>
    );

    // Click "Start Game" button first
    const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
    fireEvent.click(startButtons[0]); // Click the first Start Game button

    const form = screen.getByTestId('hanoi-form'); // Using testid
    fireEvent.submit(form);

    
    fireEvent.submit(form);
    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Please fill all fields correctly.");
      
    });
  });

  it('submits correctly when valid data is entered', async () => {
    window.alert = vi.fn(); // Still mock alert to prevent real alert
    render(
      <MemoryRouter>
        <TowerOfHanoi />
      </MemoryRouter>
    );

    // Start the game
    const startButton = screen.getAllByRole('button', { name: /Start Game/i });
    fireEvent.click(startButton[0]);

    // Fill Player Name
    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), {
      target: { value: 'Alice' },
    });

    // Fill Move Count (example: 1 move)
    fireEvent.change(screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)'), {
      target: { value: '1' },
    });

    // Fill first move input fields
    fireEvent.change(screen.getByPlaceholderText('Disk No:'), {
      target: { value: '1' },
    });

    // Select From peg
    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'A' },
    });

    // Select To peg
    fireEvent.change(screen.getAllByRole('combobox')[1], {
      target: { value: 'C' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit Answer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Expect that fetch was called at least once
      expect(fetch).toHaveBeenCalled();
    });
  });
});

//4
describe('TowerOfHanoi handleMoveCountChange functionality', () => {

    beforeEach(() => {
      vi.restoreAllMocks(); // Clean up mocks before each test
    });
  
    it('shows alert if move count is invalid (zero or negative)', async () => {
      window.alert = vi.fn(); // Mock alert
  
      render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Start the game
      const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
      fireEvent.click(startButtons[0]);
  
      // Find move count input
      const moveCountInput = screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)');
  
      // Enter invalid move count (zero)
      fireEvent.change(moveCountInput, { target: { value: '0' } });  
      
    });
  
    it('updates user move count and user moves correctly with valid input', async () => {
      render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Start the game
      const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
      fireEvent.click(startButtons[0]);
  
      // Find move count input
      const moveCountInput = screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)');
  
      // Enter a valid move count
      fireEvent.change(moveCountInput, { target: { value: '3' } });
  
      // Expect 3 move input rows to appear (move sequence inputs)
      await waitFor(() => {
        const moveInputs = screen.getAllByPlaceholderText('Disk No:');
        expect(moveInputs.length).toBe(3); // 3 move inputs
      });
    });
  
  });

  //5
  describe('TowerOfHanoi handleMoveChange functionality', () => {

    it('updates the correct move when user edits move fields', () => {
      render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Start the game
      const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
      fireEvent.click(startButtons[0]);
  
      // Fill Player Name
      fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), {
        target: { value: 'TestPlayer' },
      });
  
      // Fill Move Count (e.g., 2 moves)
      fireEvent.change(screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)'), {
        target: { value: '2' },
      });
  
      // Now, there should be 2 move inputs for Disk No
      const diskInputs = screen.getAllByPlaceholderText('Disk No:');
  
      // Change the first move's Disk Number
      fireEvent.change(diskInputs[0], { target: { value: '1' } });
  
      // Change the From peg of first move
      const fromSelects = screen.getAllByRole('combobox');
      fireEvent.change(fromSelects[0], { target: { value: 'A' } });
  
      // Change the To peg of first move
      fireEvent.change(fromSelects[1], { target: { value: 'C' } });
  
      // Now check if the inputs are updated correctly
      expect(diskInputs[0]).toHaveValue(1);
      expect(fromSelects[0]).toHaveValue('A');
      expect(fromSelects[1]).toHaveValue('C');
    });
  
  });

  it('updates multiple moves separately without overwriting others', () => {
    render(
      <MemoryRouter>
        <TowerOfHanoi />
      </MemoryRouter>
    );
  
    // Start the game
    const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
    fireEvent.click(startButtons[0]);
  
    // Fill Player Name
    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), {
      target: { value: 'TestPlayer' },
    });
  
    // Fill Move Count (example: 2 moves)
    fireEvent.change(screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)'), {
      target: { value: '2' },
    });
  
    // Now, there should be 2 move input sections
    const diskInputs = screen.getAllByPlaceholderText('Disk No:');
    const fromSelects = screen.getAllByRole('combobox');
  
    // Update Move 0
    fireEvent.change(diskInputs[0], { target: { value: '1' } });
    fireEvent.change(fromSelects[0], { target: { value: 'A' } });
    fireEvent.change(fromSelects[1], { target: { value: 'C' } });
  
    // Update Move 1
    fireEvent.change(diskInputs[1], { target: { value: '2' } });
    fireEvent.change(fromSelects[2], { target: { value: 'A' } });
    fireEvent.change(fromSelects[3], { target: { value: 'B' } });
  
    // Check first move updated correctly
    expect(diskInputs[0]).toHaveValue(1);
    expect(fromSelects[0]).toHaveValue('A');
    expect(fromSelects[1]).toHaveValue('C');
  
    // Check second move updated correctly
    expect(diskInputs[1]).toHaveValue(2);
    expect(fromSelects[2]).toHaveValue('A');
    expect(fromSelects[3]).toHaveValue('B');
  });
  
//6
describe('TowerOfHanoi handleStart functionality', () => {

    it('starts the game by enabling form fields and timer', () => {
      render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Before clicking Start Game, input fields should be disabled
      const playerNameInput = screen.getByPlaceholderText('Enter Your Name');
      const moveCountInput = screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)');
      const submitButton = screen.getByRole('button', { name: /Submit Answer/i });
  
      expect(playerNameInput).toBeDisabled();
      expect(moveCountInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
  
      // Click Start Game button
      const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
      fireEvent.click(startButtons[0]); // Click first "Start Game" (3-peg)
  
      // Now, inputs should be enabled
      expect(playerNameInput).toBeEnabled();
      expect(moveCountInput).toBeEnabled();
      expect(submitButton).toBeEnabled();
    });
  
  });

  //7
  describe('TowerOfHanoi resetGame functionality', () => {

    it('resets the game state when reset button is clicked', async () => {
      render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Start the game first
      const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
      fireEvent.click(startButtons[0]);
  
      // Fill Player Name
      const playerNameInput = screen.getByPlaceholderText('Enter Your Name');
      fireEvent.change(playerNameInput, { target: { value: 'TestPlayer' } });
  
      // Fill Move Count
      const moveCountInput = screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)');
      fireEvent.change(moveCountInput, { target: { value: '3' } });
  
      // Now click Reset button
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      fireEvent.click(resetButton);
  
      // After reset, check:
      expect(playerNameInput).toHaveValue(""); // Player name cleared
      expect(moveCountInput.value).toBe("0"); // Move count cleared (depends on how React handles it)
      expect(playerNameInput).toBeDisabled(); // Form disabled again
      expect(moveCountInput).toBeDisabled();
      
      // Bonus: You can also check timer reset to 0, but for now we just check important fields.
    });
  
  });

  //8
  
describe('TowerOfHanoi useEffect for diskCount', () => {

  it('updates pegs, userMoves, userMoveCount, and selectedDisk when diskCount changes', () => {
    render(
      <MemoryRouter>
        <TowerOfHanoi />
      </MemoryRouter>
    );

    // Start the game first
    const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
    fireEvent.click(startButtons[0]);

    // Find move count input
    const moveCountInput = screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)');

    // Change diskCount indirectly by simulating reset
    const resetButton = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetButton);

    // Now after resetGame, diskCount is reset randomly (5~10) => but more importantly, the states should be reset

    // Check that User Moves is cleared: no move inputs yet
    expect(screen.queryByPlaceholderText('Disk No:')).not.toBeInTheDocument();

    // Try filling move count again to force rerender
    fireEvent.change(moveCountInput, { target: { value: '3' } });

    // Now 3 Disk inputs should appear
    const diskInputs = screen.getAllByPlaceholderText('Disk No:');
    expect(diskInputs.length).toBe(3); // because userMoves got reset and re-initialized

    // Bonus: You could also check that first Peg (A) has disks
    const pegA = screen.getByTestId('peg-A');
    expect(pegA).toBeInTheDocument();
  });

});

//9

describe('TowerOfHanoi4Peg useEffect for diskCount', () => {
    it('updates pegs4, userMoves4Peg, userMoveCount4Peg, and selectedDisk4 when diskCount changes', () => {
      render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Start the game first
      const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
      fireEvent.click(startButtons[0]);
  
      // Find move count input
      const moveCountInput = screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)');
  
      // Change diskCount indirectly by simulating reset
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      fireEvent.click(resetButton);
  
      // After reset, userMoves4Peg should be cleared
      expect(screen.queryByPlaceholderText('Disk No:')).not.toBeInTheDocument();
  
      // Fill move count input again to force rerender
      fireEvent.change(moveCountInput, { target: { value: '4' } });
  
      // Now 4 Disk input fields should appear
      const diskInputs = screen.getAllByPlaceholderText('Disk No:');
      expect(diskInputs.length).toBe(4); // because userMoves4Peg got reset and re-initialized
  
      // Check that Peg A has disks
      const pegA = screen.getByTestId('peg-A');
      expect(pegA).toBeInTheDocument();
    });
  });

  //10
  describe("handlePegClick4", () => {
    let alertMock;
  
    beforeEach(() => {
      alertMock = vi.spyOn(global, "alert").mockImplementation(() => {});
    });
  
    afterEach(() => {
      alertMock.mockRestore();
    });
  
    it("should select the top disk when clicking a peg with disks", () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Simulate clicking peg A
      const pegA = getByTestId("peg-A");
      fireEvent.click(pegA);
  
      // Should not alert when selecting a disk
      expect(alertMock).not.toHaveBeenCalled();
    });
  
    it("should move a selected disk to another peg if valid", () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Select a disk from peg A
      const pegA = getByTestId("peg-A");
      fireEvent.click(pegA);
  
      // Move selected disk to peg B
      const pegB = getByTestId("peg-B");
      fireEvent.click(pegB);
  
      expect(alertMock).not.toHaveBeenCalled();
    });
  
    it("should prevent invalid moves and show an alert", () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      const pegA = getByTestId("peg-A");
      fireEvent.click(pegA); // Select top disk from peg A
  
      const pegB = getByTestId("peg-B");
      fireEvent.click(pegB); // Move it to peg B (legal move)
  
      // Try to select a bigger disk now
      fireEvent.click(pegA); // Select next bigger disk from peg A
  
      // Try to move bigger disk onto smaller disk in peg B (invalid move)
      fireEvent.click(pegB);
  
      expect(alertMock).toHaveBeenCalledWith("Invalid move! Cannot place larger disk on smaller disk.");
    });
  });

  //10
  describe('TowerOfHanoi4Peg handle4PegMoveCountChange functionality', () => {

    beforeEach(() => {
      vi.restoreAllMocks(); // Reset mocks before each test
    });
  
    it('shows alert if move count is invalid (zero or negative)', async () => {
      window.alert = vi.fn(); // Mock alert
  
      render(
        <MemoryRouter>
          <TowerOfHanoi/>
        </MemoryRouter>
      );
  
      // Start the game
      const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
      fireEvent.click(startButtons[0]);
  
      // Find move count input
      const moveCountInput = screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)');
  
      // Enter invalid move count (zero)
      fireEvent.change(moveCountInput, { target: { value: '0' } });
  
      
    });
  
    it('updates user move count and user moves correctly with valid input', async () => {
      render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Start the game
      const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
      fireEvent.click(startButtons[0]);
  
      // Find move count input
      const moveCountInput = screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)');
  
      // Enter a valid move count
      fireEvent.change(moveCountInput, { target: { value: '4' } });
  
      // Expect 4 move input rows to appear
      await waitFor(() => {
        const moveInputs = screen.getAllByPlaceholderText('Disk No:');
        expect(moveInputs.length).toBe(4); // 4 move inputs
      });
    });
  
  });

  //11
  describe('TowerOfHanoi4Peg handle4PegMoveChange functionality', () => {

    it('updates the correct move when user edits move fields', () => {
      render(
        <MemoryRouter>
          <TowerOfHanoi />
        </MemoryRouter>
      );
  
      // Start the game
      const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
      fireEvent.click(startButtons[0]);
  
      // Fill Player Name
      fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), {
        target: { value: 'TestPlayer' },
      });
  
      // Fill Move Count (e.g., 2 moves)
      fireEvent.change(screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)'), {
        target: { value: '2' },
      });
  
      // Now, there should be 2 move inputs for Disk No
      const diskInputs = screen.getAllByPlaceholderText('Disk No:');
  
      // Change the first move's Disk Number
      fireEvent.change(diskInputs[0], { target: { value: '1' } });
  
      // Change the From peg of first move
      const fromSelects = screen.getAllByRole('combobox');
      fireEvent.change(fromSelects[0], { target: { value: 'A' } });
  
      // Change the To peg of first move
      
      fireEvent.change(fromSelects[1], { target: { value: 'D' } });
  
      // Now check if the inputs are updated correctly
      expect(diskInputs[0]).toHaveValue(1);
      expect(fromSelects[0]).toHaveValue('A');
      expect(fromSelects[1]).toHaveValue('D');
    });
  
    it('updates multiple moves separately without overwriting others', () => {
        render(
          <MemoryRouter>
            <TowerOfHanoi />
          </MemoryRouter>
        );
      
        // Start the game
        const startButtons = screen.getAllByRole('button', { name: /Start Game/i });
        fireEvent.click(startButtons[0]);
      
        // Fill Player Name
        fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), {
          target: { value: 'TestPlayer' },
        });
      
        // Fill Move Count (example: 2 moves)
        fireEvent.change(screen.getByPlaceholderText('Enter Your Move Count (e.g. 7)'), {
          target: { value: '2' },
        });
      
        // Check for the disk and select inputs
        const diskInputs = screen.getAllByPlaceholderText('Disk No:');
        const fromSelects = screen.getAllByRole('combobox');
      
        // Update Move 0
        fireEvent.change(diskInputs[0], { target: { value: '1' } });
        fireEvent.change(fromSelects[0], { target: { value: 'A' } });
        fireEvent.change(fromSelects[1], { target: { value: 'C' } });
      
        // Update Move 1
        fireEvent.change(diskInputs[1], { target: { value: '2' } });
        fireEvent.change(fromSelects[2], { target: { value: 'B' } });
        fireEvent.change(fromSelects[3], { target: { value: 'D' } });
      
        // Check if the first move updated correctly
        expect(diskInputs[0]).toHaveValue(1);
        expect(fromSelects[0]).toHaveValue('A');
        expect(fromSelects[1]).toHaveValue('C');
      
        // Check if the second move updated correctly
        expect(diskInputs[1]).toHaveValue(2);
        expect(fromSelects[2]).toHaveValue('B');
        expect(fromSelects[3]).toHaveValue('D');
      });
      
  
  });