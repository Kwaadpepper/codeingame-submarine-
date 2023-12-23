namespace TS {

    /** The game frame width and height */
    const Frame = {
        width: 9999,
        height: 9999,

        /** The start point for first Arena */
        topStartPoint: {
            x: 4600,
            y: 2750
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

    const CREATURES_PER_LEVEL = 4;
    const lIGHT_TOGGLE = 10;

    let SCANNED_CREATURES: number = 0;

    const levelStagnation: PHAZE = {
        done: false,
        action: (drone, phazeIndex) => {
            console.error(`Phaze ${phazeIndex}`);
            const target = {
                x: Frame.center,
                y: Frame.levels[phazeIndex].top + (2500 / 2)
            };
            console.error(`target ${target.x} ${target.y}`);
            const waitUntil: number = ((200 - 5) / 3) * phazeIndex;
            const shouldSkip: boolean = SCANNED_CREATURES >= (CREATURES_PER_LEVEL * phazeIndex);
            if (shouldSkip || TURNS > waitUntil) {
                doAction(Action.WAIT);
                PHAZES[phazeIndex].done = true;
                return;
            }

            // * Increment X to go left / right
            target.x = target.x + Math.floor(Math.sin(TURNS) * 1500);
            // * Increment Y to go up / down
            target.y = target.y + Math.floor(Math.cos(TURNS) * 270);

            if (GameMap.isAtCoord(drone, target)) {
                doAction(Action.WAIT);
                return;
            }
            doAction(Action.MOVE, target, TURNS % lIGHT_TOGGLE === 0 ? Light.ON : Light.OFF);
        }
    };

    /*
        Strategy, go middle then go down slowly,
        Scanning all creatures on each step,
        put on light each lIGHT_TOGGLE turns then off
    */
    const PHAZES: Array<PHAZE> = [
        // * --- PHASE 1 - Go MIDDLE ---
        {
            done: false,
            action: (drone, phazeIndex) => {
                Frame.topStartPoint.x = drone.coord.x;
                const target = Frame.topStartPoint;
                if (GameMap.isAtCoord(drone, target)) {
                    PHAZES[phazeIndex].done = true;
                    doAction(Action.WAIT);
                    return;
                }
                doAction(Action.MOVE, target, TURNS % lIGHT_TOGGLE === 0 ? Light.ON : Light.OFF);
            }
        },
        // * --- PHASE 2 - Go Center of LEVEL 2 for ((200 - 5) / 3 * index) turns ---
        Object.assign({}, levelStagnation),
        // * --- PHASE 3 - Go Center of LEVEL 3 for ((200 - 5) / 3 * index) turns ---
        Object.assign({}, levelStagnation),
        // * --- PHASE 4 - Go Center of LEVEL 4 for ((200 - 5) / 3 * index) turns ---
        Object.assign({}, levelStagnation),
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

        SCANNED_CREATURES = visibleCreatureList.map(creature => Number(creature.scannedBy.me ? 1 : 0))
            .reduce((prev, next) => prev + next);

        // * Actions foreach of my drones
        Drone.getPlayerDrones(droneList, Player.me).forEach(drone => {
            // Write an action using console.log()
            // To debug: console.error('Debug messages...');
            const phazeIndexToDo = PHAZES.findIndex((phaze) => !phaze.done);
            if (phazeIndexToDo === -1) {
                console.error(`Nothing left to do for drone ${drone.id}`);
                console.error(PHAZES);
                doAction(Action.WAIT);
            } else {
                console.error('Do action');
                PHAZES[phazeIndexToDo].action(drone, phazeIndexToDo);
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
