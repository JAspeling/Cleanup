import { DirectoryResponse } from "./responses/directory-response";
import { Guid } from "./extensions";

export class TreeNode {
    public constructor(init?: Partial<TreeNode>) {
        Object.assign(this, init);
    }

    id: string = Guid.newGuid();
    directoryInfo: DirectoryResponse = new DirectoryResponse();
    text: string = undefined; // optional
    icon: string = undefined; // optional
    selectedIcon: string = undefined; // optional
    color : string = undefined;
    backColor: string = undefined;
    href: string = undefined;
    selectable: boolean = true;
    state: TreeNodeState = new TreeNodeState();
    tags: string[] = [];
    nodes: TreeNode[] = undefined;
} 

export class TreeNodeState  {
    public constructor(init?: Partial<TreeNodeState>) {
        Object.assign(this, init);
    }

    checked: boolean = false;
    disabled: boolean = false;
    expanded: boolean = false;
    selected: boolean = false;
}