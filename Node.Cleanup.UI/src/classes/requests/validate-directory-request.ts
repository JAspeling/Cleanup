export class DirectoryRequest {
    public constructor(init?: Partial<DirectoryRequest>) {
        Object.assign(this, init);
    }

    path: string = '';
}

export class DirectoriesRequest {
    public constructor(init?: Partial<DirectoriesRequest>) {
        Object.assign(this, init);
    }

    paths: string[] = [];
}

