namespace TS {

    /** The game frame width and height */
    const Frame = {
        width: 9999,
        height: 9999,

        /** The start point for first Arena */
        topStartPoint: {
            x: Math.floor(9999 / 2),
            y: 500
        },

        /** The map center line */
        center: Math.floor(9999 / 2),

        // * Levels deeps, each creature will stay on its level
        levels: [
            {
                top: 0,
                bottom: 2499,
            },
            {
                top: 2500,
                bottom: 4999,
            },
            {
                top: 5000,
                bottom: 7499,
            },
            {
                top: 7500,
                bottom:  9999,
            },
        ]
    };

    /** The game actual state */
    const GameStatus: {
        /** My actual score */
        myScore: number;
        /** Opponents actual score */
        foeScore: number;
        /** My actual count of scanned creatures */
        myScanCount: number;
        /** Opponents actual count of scanned creatures */
        foeScanCount: number;
        /** The creatures list in game */
        creatureList: Map<Id, Creature>;
    } = {
        myScore: 0,
        foeScore: 0,
        myScanCount: 0,
        foeScanCount: 0,
        creatureList: parseCreatures(),
    };

    const droneList: Map<Id, Drone> = new Map<Id, Drone>();


    /**
     * Score points by scanning valuable fish faster than your opponent.
     */

    let TURNS: number = 0;

    /*
        Strategy, go middle then go down slowly,
        Scanning all creatures on each step,
        put on light each 5 turns then off
    */
    const PHAZES: Array<PHAZE> = [
        // * --- PHASE 1 - Go MIDDLE ---
        {
            done: false,
            action: (drone) => {
                const target = Frame.topStartPoint;
                if (GameMap.isAtCoord(drone, target)) {
                    PHAZES[0].done = true;
                    doAction(Action.WAIT);
                    return;
                }
                doAction(Action.MOVE, target, TURNS % 5 === 0 ? Light.ON : Light.OFF);
            }
        }
    ];

    // ----- GAME LOOP -----
    while (true) {

        // --- GAME INFO ---
        updateGameStatus();

        parsePlayerDrones(Player.me);
        parsePlayerDrones(Player.foe);

        updateGameStatusScans();

        const visibleCreatureList = getVisibleCreatures();

        const radarBlipCount: number = parseInt(getInput());
        for (let i = 0; i < radarBlipCount; i++) {
            const inputs: string[] = getInput().split(' ');
            const droneId: Id = parseInt(inputs[0]);
            const creatureId: Id = parseInt(inputs[1]);
            const radar: Radar = inputs[2] as Radar;
        }

        // * Actions foreach of my drones
        Drone.getPlayerDrones(droneList, Player.me).forEach(drone => {
            // Write an action using console.log()
            // To debug: console.error('Debug messages...');
            const phazeToDo = PHAZES.find(phaze => !phaze.done);
            if (phazeToDo === undefined) {
                console.error(`Nothing left to do for drone ${drone.id}`);
                doAction(Action.WAIT);
            } else {
                console.error('Do action');
                phazeToDo.action(drone);
            }
        });
        TURNS++;
    }

    // ----- END GAME LOOP -----

    /** Do an action for a Drone */
    function doAction(action: Action, coord: Coord | null = null, light: Light = Light.OFF): void {
        if (action === Action.MOVE && coord === null) {
            throw Error(`Action ${action} requires some coordinates, given null`);
        }
        console.log(`${action}${coord ? ` ${coord.x} ${coord.y}` : ''} ${light}`);
    }

    /** Get all creature that are visible right now */
    function getVisibleCreatures(): Array<Creature> {
        const visibleCreatureList: Array<Creature> = [];
        const visibleCreatureCount: number = parseInt(getInput());
        for (let i = 0; i < visibleCreatureCount; i++) {
            const inputs: string[] = getInput().split(' ');
            const creatureId: number = parseInt(inputs[0]);
            const creature: Creature | undefined = GameStatus.creatureList.get(creatureId);
            // * La position de la créature.
            const creatureX: number = parseInt(inputs[1]);
            const creatureY: number = parseInt(inputs[2]);
            // * La vitesse actuelle de la créature.
            const creatureVx: number = parseInt(inputs[3]);
            const creatureVy: number = parseInt(inputs[4]);
            if (!creature) {
                throw Error(`Creature ${creatureId} not found in list`);
            }
            creature.setCoord({ x: creatureX, y: creatureY });
            creature.setSpeed({ vX: creatureVx, vY: creatureVy });
            visibleCreatureList.push(creature);
        }
        return visibleCreatureList;
    }

    /** Update game status scan counts for each drone */
    function updateGameStatusScans(): void {
        const droneScanCount: number = parseInt(getInput());
        for (let i = 0; i < droneScanCount; i++) {
            const inputs: string[] = getInput().split(' ');
            const droneId: Id = parseInt(inputs[0]);
            const drone: Drone | undefined = droneList.get(droneId);
            const creatureId: Id = parseInt(inputs[1]);
            if (!drone) {
                throw Error(`Drone ${droneId} not found in list`);
            }
            if (drone.type === Player.me) {
                GameStatus.creatureList.get(creatureId)!.scannedBy.me = true;
            } else {
                GameStatus.creatureList.get(creatureId)!.scannedBy.foe = true;
            }
        }
    }

    /** Updates game score status */
    function updateGameStatus(): void {
        GameStatus.myScore = parseInt(getInput());
        GameStatus.foeScore = parseInt(getInput());

        const myScanCount: number = parseInt(getInput());
        GameStatus.myScanCount = myScanCount;
        for (let i = 0; i < myScanCount; i++) {
            const creatureId: Id = parseInt(getInput());
            GameStatus.creatureList.get(creatureId)!.setScannedBy(Player.me);
        }

        const foeScanCount: number = parseInt(getInput());
        GameStatus.foeScanCount = foeScanCount;
        for (let i = 0; i < foeScanCount; i++) {
            const creatureId: Id = parseInt(getInput());
            GameStatus.creatureList.get(creatureId)!.setScannedBy(Player.foe);
        }
    }

    /** Parse drones in game */
    function parsePlayerDrones(type: Player): void {
        const droneCount: number = parseInt(getInput());
        for (let i = 0; i < droneCount; i++) {
            const inputs: string[] = getInput().split(' ');
            const droneId: number = parseInt(inputs[0]);
            const droneX: number = parseInt(inputs[1]);
            const droneY: number = parseInt(inputs[2]);
            const emergency: number = parseInt(inputs[3]);
            const battery: number = parseInt(inputs[4]);

            const drone = droneList.get(droneId) ?? new Drone(
                droneId, type
            );
            drone.setCoord({ x: droneX, y: droneY });
            drone.setEmergency(emergency);
            drone.setBattery(battery);
            droneList.set(droneId, drone);
        }
    }

    /**
     * Parse creatures in game
     * @returns All the creature that are in game
     */
    function parseCreatures(): Map<Id, Creature> {
        const creatureList: Map<Id, Creature> = new Map<Id, Creature>();
        /** The number of creatures to scan */
        const creatureCount: number = parseInt(getInput());
        for (let i = 0; i < creatureCount; i++) {
            const inputs: string[] = getInput().split(' ');
            const creatureId: Id = parseInt(inputs[0]);
            const color: CreatureColor = parseInt(inputs[1]);
            const type: CreatureType = parseInt(inputs[2]);

            creatureList.set(creatureId, new Creature(creatureId, type, color));
        }
        return creatureList;
    }

    /**
     * @returns Game input info
     */
    function getInput(): string {
        // @ts-ignore
        return readline();
    }
}
