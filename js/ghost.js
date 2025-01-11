class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = 'right';
        this.baseSpeed = 400;
        this.moveInterval = null;
    }

    startMoving(maze, player, onCollision) {
        this.moveInterval = setInterval(() => {
            this.move(maze, player, onCollision);
        }, this.baseSpeed);
    }

    move(maze, player, onCollision) {
        const directions = this.getValidDirections(maze);
        if (directions.length === 0) return;

        const playerPos = { x: player.x, y: player.y };
        let nextDirection;

        if (Math.random() < 0.75) {
            nextDirection = this.getDirectionTowardsPlayer(directions, playerPos);
        } else {
            nextDirection = directions[Math.floor(Math.random() * directions.length)];
        }

        this.x = nextDirection.x;
        this.y = nextDirection.y;

        if (this.x === player.x && this.y === player.y) {
            onCollision();
        }
    }

    getValidDirections(maze) {
        const directions = [
            { x: this.x, y: this.y - 1 },
            { x: this.x, y: this.y + 1 },
            { x: this.x - 1, y: this.y },
            { x: this.x + 1, y: this.y }
        ];

        return directions.filter(dir => 
            dir.x >= 0 && dir.x < maze[0].length &&
            dir.y >= 0 && dir.y < maze.length &&
            maze[dir.y][dir.x] !== 1
        );
    }

    getDirectionTowardsPlayer(validDirections, playerPos) {
        return validDirections.reduce((closest, current) => {
            const currentDist = Math.abs(current.x - playerPos.x) + 
                              Math.abs(current.y - playerPos.y);
            const closestDist = Math.abs(closest.x - playerPos.x) + 
                              Math.abs(closest.y - playerPos.y);
            return currentDist < closestDist ? current : closest;
        });
    }

    stop() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }
    }
} 