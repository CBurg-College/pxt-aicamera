/*
The code below is a refactoring of:
- the ElecFreaks 'pxt-PlanetX-AI' library:
  https://github.com/elecfreaks/pxt-PlanetX-AI/blob/master/main.ts
MIT-license.
*/

namespace CameraAI {

    const CameraAddr = 0X14;
    let DataBuffer = pins.createBuffer(9);
    let ITEM = 0

    export enum Recognize {
        //% block="balls"
        //% block.loc.nl="ballen"
        Ball = 7,
        //% block="colors"
        //% block.loc.nl="kleuren"
        Color = 9
    }

    export function init(): void {
        let timeout = input.runningTime()
        while (!(pins.i2cReadNumber(CameraAddr, NumberFormat.Int8LE))) {
            if (input.runningTime() - timeout > 30000) {
                while (true) {
                    basic.showString("Init of AI-Lens failed")
                }
            }
        }
    }

    export function recognize(item: Recognize): void {
        ITEM = item
        let buff = pins.i2cReadBuffer(CameraAddr, 9)
        buff[0] = 0x20
        buff[1] = item
        pins.i2cWriteBuffer(CameraAddr, buff)
    }

    export function fetchCamera(): void {
        DataBuffer = pins.i2cReadBuffer(CameraAddr, 9)
        basic.pause(30)
    }

    export function itemCount(): number {
        if (DataBuffer[0] != ITEM)
            return 0
        return DataBuffer[7]
    }

    export function itemPosX(): number {
        return DataBuffer[2]
    }

    export function itemPosY(): number {
        return DataBuffer[3]
    }

    export function itemSize(): number {
        return DataBuffer[4]
    }

    export function itemColor(): number {
        return DataBuffer[1]
    }

    export function itemIsColor(col: Color): boolean {
        return (DataBuffer[1] == col)
    }

    export function itemID(): number {
        return DataBuffer[8]
    }

    export function itemConfidence(): number {
        return 100 - DataBuffer[6]
    }
}
