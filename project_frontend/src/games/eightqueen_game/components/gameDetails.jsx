import '../styles/gameDetails.css';

const GameDetails = ({ sequential, threaded, playerSolutionCount }) => {
    return (
        <div className="game-details-container">
            <h2 style={{ width: '100%', textAlign: 'center' }}>🧠 Puzzle Insights & Algorithm Comparison</h2>

            <div className="details-summary">
                <p>Total Solutions in Game: <strong>{sequential.numberOfSolutions}</strong></p>
                <p>Total Solutions Found: <strong>{playerSolutionCount}</strong></p>
            </div>

            <h3>🔍 Algorithm Comparison</h3>
            <table className="comparison-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Sequential</th>
                        <th>Threaded</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Number of Solutions</td>
                        <td>{sequential.numberOfSolutions}</td>
                        <td>{threaded.numberOfSolutions}</td>
                    </tr>
                    <tr>
                        <td>Time Taken (s)</td>
                        <td>{sequential.timeTaken} ms</td>
                        <td>{threaded.timeTaken} ms</td>
                    </tr>
                    <tr>
                        <td>Threads Used</td>
                        <td>Single Thread</td>
                        <td>8</td>
                    </tr>
                    <tr>
                        <td>Speed Improvement</td>
                        <td>{threaded.timeTaken / sequential.timeTaken} Times Faster</td>
                        <td>--</td>
                    </tr>
                </tbody>
            </table>

            <div className="algo-explanations">
                <div className="algo-card">
                    <h4>🧭 Sequential Algorithm</h4>
                    <p>
                    Runs the entire backtracking algorithm in a single thread, allowing it to avoid the overhead of thread creation, data synchronization, and message passing. This leads to faster execution for lightweight problems where parallelization may introduce unnecessary complexity.
                    </p>
                </div>

                <div className="algo-card">
                    <h4>⚙️ Threaded Algorithm</h4>
                    <p>
                        Runs multiple branches of the backtracking algorithm in parallel threads, yet the overhead of setting up parallel workers, message-passing latency, and memory overhead taking up more time to complete.
                    </p>
                </div>
            </div>

            <div className="challenge-box">
                <h4>🎯 Can You Do Better?</h4>
                <p>Try solving again to beat your previous time or discover new unique solutions!</p>
            </div>
        </div>
    );
};

export default GameDetails;