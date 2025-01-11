class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = null;
        this.isPowered = false;
        this.powerTimer = null;
    }

    move(direction, maze) {
        let newX = this.x;
        let newY = this.y;

        switch (direction) {
            case 'ArrowUp':
                newY--;
                break;
            case 'ArrowDown':
                newY++;
                break;
            case 'ArrowLeft':
                newX--;
                break;
            case 'ArrowRight':
                newX++;
                break;
        }

        if (this.canMove(newX, newY, maze)) {
            this.x = newX;
            this.y = newY;
            return true;
        }
        return false;
    }

    canMove(x, y, maze) {
        return x >= 0 && x < maze[0].length && 
               y >= 0 && y < maze.length && 
               maze[y][x] !== 1;
    }

    powerUp() {
        this.isPowered = true;
        if (this.powerTimer) clearTimeout(this.powerTimer);
        this.powerTimer = setTimeout(() => {
            this.isPowered = false;
        }, 5000);
    }
} 