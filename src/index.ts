namespace TS {

    // CLASSES

    /** The game Frame */
    const Frame = {
        width: 9999,
        height: 9999
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
        creatureList: parseCreatures()
    };

    const droneList: Map<Id, Drone> = new Map<Id, Drone>();

    /**
     * Score points by scanning valuable fish faster than your opponent.
     */

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
            var inputs: string[] = getInput().split(' ');
            const droneId: number = parseInt(inputs[0]);
            const creatureId: number = parseInt(inputs[1]);
            const radar: string = inputs[2];
        }

        // * Actions foreach of my drones
        Drone.getPlayerDrones(droneList, Player.me).forEach(drone => {
            // Write an action using console.log()
            // To debug: console.error('Debug messages...');

            console.log('WAIT 1');
        });
    }

    // ----- END GAME LOOP -----

    /** Get all creature that are visible right now */
    function getVisibleCreatures(): Array<Creature> {
        const visibleCreatureList: Array<Creature> = [];
        const visibleCreatureCount: number = parseInt(getInput());
        for (let i = 0; i < visibleCreatureCount; i++) {
            var inputs: string[] = getInput().split(' ');
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
            visibleCreatureList.push(creature);
        }
        return visibleCreatureList;
    }

    /** Update game status scan counts for each drone */
    function updateGameStatusScans(): void {
        const droneScanCount: number = parseInt(getInput());
        for (let i = 0; i < droneScanCount; i++) {
            var inputs: string[] = getInput().split(' ');
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

        GameStatus.myScanCount = parseInt(getInput());
        for (let i = 0; i < GameStatus.myScanCount; i++) {
            const creatureId: Id = parseInt(getInput());
            GameStatus.creatureList.get(creatureId)!.setScannedBy(Player.me);
        }

        GameStatus.foeScanCount = parseInt(getInput());
        for (let i = 0; i < GameStatus.foeScanCount; i++) {
            const creatureId: Id = parseInt(getInput());
            GameStatus.creatureList.get(creatureId)!.setScannedBy(Player.foe);
        }
    }

    /** Parse drones in game */
    function parsePlayerDrones(type: Player): void {
        const droneCount: number = parseInt(getInput());
        for (let i = 0; i < droneCount; i++) {
            var inputs: string[] = getInput().split(' ');
            const droneId: number = parseInt(inputs[0]);
            const droneX: number = parseInt(inputs[1]);
            const droneY: number = parseInt(inputs[2]);
            const emergency: number = parseInt(inputs[3]);
            const battery: number = parseInt(inputs[4]);

            const drone = droneList.get(droneId) ?? new Drone(
                droneId, Player.me
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
            let inputs: string[] = getInput().split(' ');
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
