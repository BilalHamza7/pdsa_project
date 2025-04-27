import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter

import React from "react";
import TowerOfHanoi from '../main';
//import { handlePegClick } from '../main'; // Update the correct path


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



