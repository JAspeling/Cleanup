export class DirectoryResponse {
    public constructor(init?: Partial<DirectoryResponse>) {
        Object.assign(this, init);
    }

    fullName: string = '';
    name: string = '';
    directories: DirectoryResponse[] = [];
    files: number;
    size: number;
    friendlySize: string;
}