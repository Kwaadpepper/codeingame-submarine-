namespace TS {

    /** A unique ID */
    export type Id = number;

    export type PHAZE = {
        done: boolean,
        action: (drone: Drone) => void
    }

    /** Coordinates */
    export type Coord = {
        x: number;
        y: number;
    }

    /** Speed, this actually
    represents a direction */
    export type Speed = {
        vX: number;
        vY: number;
    }

    /** A player */
    export enum Player {
        me = 0,
        foe = 1
    }

    /** A creature type */
    export enum CreatureType {
        jellyfish = 0,
        fish = 1,
        crab = 3,
    }

    /** A creature color */
    export enum CreatureColor {
        pink = 0,
        yellow = 1,
        green = 2,
        blue = 3,
    }

    /** A direction for the radar detection, top can mean on same level */
    export enum Radar {
        /** Top left or on same level */
        TopLeft = "TL",
        /** Top right or on same level */
        TopRight = "TR",
        /** Bottom left */
        BottomLeft = "BL",
        /** Bottom right */
        BottomRight = "BR",
    }

    /** An action to do with the submarine */
    export enum Action {
        WAIT = "WAIT",
        MOVE = "MOVE",
    }

    /** The submarine light power */
    export enum Light {
        OFF = 0,
        ON = 1,
    }
}
