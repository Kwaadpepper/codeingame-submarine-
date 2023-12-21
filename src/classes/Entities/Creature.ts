namespace TS {
    export class Creature {
        /** The creature unique ID */
        id: Id;
        /** The creature Type, jellyfish, fish etc, values more points */
        type: CreatureType;
        /** The creature color, values less points */
        color: CreatureColor;
        /** The creature actual coordinates */
        coord: Coord = {
            x: 0,
            y: 0
        };

        /** The creature scan status foreach players */
        scannedBy: {
            me: boolean;
            foe: boolean;
        } = {
            me: false,
            foe: false
        };

        constructor(id: Id, type: CreatureType, color: CreatureColor) {
            this.id = id;
            this.type = type;
            this.color = color;
        }

        /** Set creature scan status */
        setScannedBy(player: Player): void {
            if (player === Player.me) {
                this.scannedBy.me = true;
            } else {
                this.scannedBy.foe = true;
            }
        }

        /** Set creature scan status */
        setCoord(coord: Coord): void {
            this.coord = coord;
        }
    }
}
