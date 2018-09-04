export class FuncOptions {
    public constructor(init?: Partial<FuncOptions>) {
        Object.assign(this, init);
    }

    silent: boolean = false;
    levels: number = 2;

    ignoreCase: boolean = true;     // case insensitive
    exactMatch: boolean = false;    // like or equals
    revealResults: boolean = true;  // reveal matching nodes

    ignoreChildren: boolean = false;
}
