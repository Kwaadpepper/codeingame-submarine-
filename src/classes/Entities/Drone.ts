namespace TS {
    export class Drone {
        /** The drone unique ID */
        id: Id;
        /** The drone Player Type, me or foe */
        type: Player;
        /** The drone actual coordinates */
        coord: Coord = {
            x: 0,
            y: 0
        };
        /** The drone battery level status */
        battery: number = 50;
        /** Unknown */
        emergency: number = 0;

        constructor(id: Id, type: Player) {
            this.id = id;
            this.type = type;
        }

        /** Set drone scan status */
        setCoord(coord: Coord): void {
            this.coord = coord;
        }
        /** Set drone emergency status */
        setEmergency(emergency: number): void {
            this.emergency = emergency;
        }
        /** Set drone battery level status */
        setBattery(battery: number): void {
            this.battery = battery;
        }

        /** Get a player drones */
        static getPlayerDrones(list: Map<Id,Drone>, type: Player): Array<Drone> {
            return [...list.values()].filter((drone) => drone.type === type);
        }
    }
}
