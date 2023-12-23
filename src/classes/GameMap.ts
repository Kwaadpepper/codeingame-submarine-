namespace TS {
    export class GameMap {

        /** Calculation point tolerance */
        private static coordCalcTolerance = 20;

        static isAtCoord(drone: Drone, coord: Coord): boolean {
            return Math.abs(drone.coord.x - coord.x) < this.coordCalcTolerance &&
                Math.abs(drone.coord.y - coord.y) < this.coordCalcTolerance;
        }
    }
}
