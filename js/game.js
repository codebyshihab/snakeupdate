class Game {
    constructor() {
        this.board = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.score = 0;
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.player = new Player(1, 1);
        this.ghosts = [
            new Ghost(13, 13, 'red'),
            new Ghost(1, 13, 'pink'),
            new Ghost(13, 1, 'cyan')
        ];
        this.pellets = [];
        this.gameOver = false;
        
        this.initGame();
        this.setupEventListeners();
    }

    initGame() {
        this.createBoard();
        this.placePellets();
        this.ghosts.forEach(ghost => ghost.startMoving(
            this.maze, 
            this.player, 
            () => this.handleGhostCollision()
        ));
        this.gameLoop();
    }

    createBoard() {
        this.board.innerHTML = '';
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (this.maze[y][x] === 1) {
                    cell.classList.add('wall');
                }
                this.board.appendChild(cell);
            }
        }
    }

    placePellets() {
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                if (this.maze[y][x] === 0 && 
                    !(x === this.player.x && y === this.player.y)) {
                    const isPower = (x === 1 && y === 1) || 
                                  (x === 13 && y === 1) || 
                                  (x === 1 && y === 13) || 
                                  (x === 13 && y === 13);
                    this.pellets.push(new Pellet(x, y, isPower));
                }
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameOver) {
                this.player.move(e.key, this.maze);
            }
        });
    }

    handleGhostCollision() {
        if (this.player.isPowered) {
            this.score += 200;
            this.updateScore();
        } else {
            this.gameOver = true;
            alert('Game Over! Score: ' + this.score);
            location.reload();
        }
    }

    collectPellets() {
        const pelletIndex = this.pellets.findIndex(
            p => p.x === this.player.x && p.y === this.player.y
        );

        if (pelletIndex !== -1) {
            const pellet = this.pellets[pelletIndex];
            this.score += pellet.value;
            if (pellet.isPower) {
                this.player.powerUp();
            }
            this.pellets.splice(pelletIndex, 1);
            this.updateScore();
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    render() {
        const cells = this.board.children;
        
        // Clear previous positions
        for (let cell of cells) {
            cell.classList.remove('player', 'ghost', 'pellet', 'power-pellet');
        }

        // Render pellets
        this.pellets.forEach(pellet => {
            const index = pellet.y * this.maze[0].length + pellet.x;
            cells[index].classList.add(pellet.isPower ? 'power-pellet' : 'pellet');
        });

        // Render player
        const playerIndex = this.player.y * this.maze[0].length + this.player.x;
        cells[playerIndex].classList.add('player');

        // Render ghosts
        this.ghosts.forEach(ghost => {
            const ghostIndex = ghost.y * this.maze[0].length + ghost.x;
            const ghostElement = cells[ghostIndex];
            ghostElement.classList.add('ghost');
            ghostElement.style.background = this.player.isPowered ? 'blue' : ghost.color;
        });
    }

    gameLoop() {
        if (!this.gameOver) {
            this.collectPellets();
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 