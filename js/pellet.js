class Pellet {
    constructor(x, y, isPower = false) {
        this.x = x;
        this.y = y;
        this.isPower = isPower;
        this.value = isPower ? 50 : 10;
    }
} 