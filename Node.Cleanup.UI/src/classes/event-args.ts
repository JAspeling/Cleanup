import { TreeNode } from "./node";

export interface IEventArgs {
    event: Event;
    data: any;
}

export abstract class EventArgs implements IEventArgs {
    public constructor(init?: Partial<EventArgs>) {
        Object.assign(this, init);
    }

    event: Event;
    abstract data: any;
}

export class SingleNodeArgs extends EventArgs {
    public constructor(init?: Partial<SingleNodeArgs>) {
        super()
        Object.assign(this, init);
    }

    data: TreeNode;
}

export class MultipleNodeArgs extends EventArgs {
    public constructor(init?: Partial<MultipleNodeArgs>) {
        super();
        Object.assign(this, init);
    }

    data: TreeNode[] = [];
}
