/**
 * Score points by scanning valuable fish faster than your opponent.
 **/

let counter = 0;

console.error('readline 1')
const creatureCount: number = parseInt(getInput());
for (let i = 0; i < creatureCount; i++) {
    var inputs: string[] = getInput().split(' ');
    console.error('readline 2 ' + i)
    const creatureId: number = parseInt(inputs[0]);
    const color: number = parseInt(inputs[1]);
    const type: number = parseInt(inputs[2]);
}


// game loop
while (true) {
    counter = 0;
    const myScore: number = parseInt(getInput());
    console.error('readline 3')
    const foeScore: number = parseInt(getInput());
    console.error('readline 4')
    const myScanCount: number = parseInt(getInput());
    for (let i = 0; i < myScanCount; i++) {
        const creatureId: number = parseInt(getInput());
        console.error('readline 4 ' + i)
    }
    const foeScanCount: number = parseInt(getInput());
    console.error('readline 5')
    for (let i = 0; i < foeScanCount; i++) {
        const creatureId: number = parseInt(getInput());
        console.error('readline 5 ' + i);
    }
    const myDroneCount: number = parseInt(getInput());
    console.error('readline 6');
    for (let i = 0; i < myDroneCount; i++) {
        var inputs: string[] = getInput().split(' ');
        console.error('readline 6 ' + i);
        const droneId: number = parseInt(inputs[0]);
        const droneX: number = parseInt(inputs[1]);
        const droneY: number = parseInt(inputs[2]);
        const emergency: number = parseInt(inputs[3]);
        const battery: number = parseInt(inputs[4]);
    }
    const foeDroneCount: number = parseInt(getInput());
    console.error('readline 6');
    for (let i = 0; i < foeDroneCount; i++) {
        var inputs: string[] = getInput().split(' ');
        console.error('readline 6 ' + i);
        const droneId: number = parseInt(inputs[0]);
        const droneX: number = parseInt(inputs[1]);
        const droneY: number = parseInt(inputs[2]);
        const emergency: number = parseInt(inputs[3]);
        const battery: number = parseInt(inputs[4]);
    }
    const droneScanCount: number = parseInt(getInput());
    console.error('readline 7');
    for (let i = 0; i < droneScanCount; i++) {
        var inputs: string[] = getInput().split(' ');
        console.error('readline 7 ' + i);
        const droneId: number = parseInt(inputs[0]);
        const creatureId: number = parseInt(inputs[1]);
    }
    const visibleCreatureCount: number = parseInt(getInput());
    console.error('readline 8 ');
    for (let i = 0; i < visibleCreatureCount; i++) {
        var inputs: string[] = getInput().split(' ');
        console.error('readline 8 ' + i);
        const creatureId: number = parseInt(inputs[0]);
        const creatureX: number = parseInt(inputs[1]);
        const creatureY: number = parseInt(inputs[2]);
        const creatureVx: number = parseInt(inputs[3]);
        const creatureVy: number = parseInt(inputs[4]);
    }
    const radarBlipCount: number = parseInt(getInput());
    console.error('readline 9 ');
    for (let i = 0; i < radarBlipCount; i++) {
        var inputs: string[] = getInput().split(' ');
        console.error('readline 9 ' + i);
        const droneId: number = parseInt(inputs[0]);
        const creatureId: number = parseInt(inputs[1]);
        const radar: string = inputs[2];
    }
    for (let i = 0; i < myDroneCount; i++) {

        // Write an action using console.log()
        // To debug: console.error('Debug messages...');

        console.log('WAIT 1');         // MOVE <x> <y> <light (1|0)> | WAIT <light (1|0)>

    }
    console.error(`counter ${counter}`);
}

/**
 * @returns Game input info
 */
function getInput(): string {
    counter++;
    // @ts-ignore
    return readline();
}
