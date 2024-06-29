document.addEventListener('DOMContentLoaded', function () {
    // Select the maze container from the DOM
    const mazeContainer = document.querySelector('.maze');

    // Size of the maze (4x4 grid)
    const n = 4;

    // Total number of cells in the maze
    const totalCells = n * n;

    // Number of blocked cells to randomly place in the maze
    const blockedCells = 5;

    // 2D array to represent the maze layout
    const maze = [];

    // 2D array to track visited cells during pathfinding
    const visited = [];

    // Initialize maze and visited arrays
    for (let i = 0; i < n; i++) {
        maze[i] = [];
        visited[i] = [];

        for (let j = 0; j < n; j++) {
            // Initialize each cell as free and unvisited
            maze[i][j] = 1; // 1 represents free cell
            visited[i][j] = false;
        }
    }

    // Randomly place blocked cells, ensuring entry and exit are always free
    let placedBlocks = 0;
    while (placedBlocks < blockedCells) {
        // Generate random coordinates within the maze grid
        const randX = Math.floor(Math.random() * n);
        const randY = Math.floor(Math.random() * n);

        // Check if the cell is free and not at entry or exit points
        if (maze[randX][randY] === 1 && !(randX === 0 && randY === 0) && !(randX === n - 1 && randY === n - 1)) {
            // Mark the cell as blocked (0 represents blocked cell)
            maze[randX][randY] = 0;
            placedBlocks++;
        }
    }

    // Create the maze grid dynamically in the HTML
    for (let i = 0; i < n; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        mazeContainer.appendChild(row);

        for (let j = 0; j < n; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Add classes based on maze configuration (blocked or entry-exit)
            if (maze[i][j] === 0) {
                cell.classList.add('blocked');
            } else if (i === 0 && j === 0) {
                cell.classList.add('entry-exit');
            }

            // Append the cell to the current row
            row.appendChild(cell);
        }
    }

    // Function to animate rat's movement and find paths recursively
    async function findPath(i, j, path,paths,score) {
        // Base case: reached destination
        if (i === n - 1 && j === n - 1) {
            // Mark current cell as part of the path
            const currentCell = document.querySelector(`.row:nth-child(${i + 1}) .cell:nth-child(${j + 1})`);
            currentCell.classList.add('lastpath');
            score++;
            // Delay for 1 second to show the path animation
            await sleep(1000);
            alert("found path no" + ":{ " + path + " }");
            currentCell.classList.remove('lastpath');
            return true;
        }

        // Mark current cell as visited
        visited[i][j] = true;

        // Define movement directions: Down, Left, Right, Up
        const directions = ['Down', 'Left', 'Right', 'Up'];
        const di = [1, 0, 0, -1];
        const dj = [0, -1, 1, 0];

        // Try all possible directions with a delay
        let foundPath = false;
        for (let d = 0; d < 4; d++) {
            const nexti = i + di[d];
            const nextj = j + dj[d];

            // Check if the next cell is within bounds and free to move and not visited
            if (nexti >= 0 && nextj >= 0 && nexti < n && nextj < n && maze[nexti][nextj] === 1 && !visited[nexti][nextj]) {
                // Update UI to show the path
                const currentCell = document.querySelector(`.row:nth-child(${i + 1}) .cell:nth-child(${j + 1})`);
                currentCell.classList.add('path');

                // Delay for 1 second to show the path animation
                await sleep(1000);

                // Recursively explore the next cell
                if (await findPath(nexti, nextj, path + directions[d] + " ")) {
                    foundPath = true;
                }

                // Backtrack: remove the path update and highlight backtrack
                currentCell.classList.remove('path');
                currentCell.classList.add('backtrack');

                // Delay for 0.5 second to highlight backtrack
                await sleep(500);
                currentCell.classList.remove('backtrack');
            }
        }

        // Mark the current cell as part of the path before backtracking
        const currentCell = document.querySelector(`.row:nth-child(${i + 1}) .cell:nth-child(${j + 1})`);
        if (visited[i][j]) {
            currentCell.classList.add('path');

            // Delay for 1 second to show the path animation
            await sleep(1000);
            currentCell.classList.remove('path');
        }

        // Mark the current cell as unvisited
        visited[i][j] = false;
        return foundPath;
    }

    // Start finding the path from the top-left corner (0, 0)
    findPath(0, 0, '');

    // Utility function to delay execution
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});