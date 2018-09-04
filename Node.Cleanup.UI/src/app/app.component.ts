import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Tree } from '../classes/tree';
import { TreeNode, TreeNodeState } from '../classes/node';
import { FuncOptions } from '../classes/options';
import { SingleNodeArgs, MultipleNodeArgs } from '../classes/event-args';
import { ApiService } from '../services/httpService';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { LoaderComponent } from '../components/loader/loader.component';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { DirectoryResponse } from '../classes/responses/directory-response';
import { TreeviewComponent } from '../components/treeview/treeview';
declare var swal: any;
declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild(LoaderComponent) loader: LoaderComponent;
    @ViewChild(TreeviewComponent) treeView: TreeviewComponent;

    tree: Tree = undefined;

    connection: HubConnection;

    istesting: boolean = false;
    // directory: string = 'C:\\Source\\git\\SES\\Galleries\\angular5\\testapp';
    directory: string = '';
    isValidPath: boolean = false;
    isReady: boolean = false;

    onSearched: EventEmitter<MultipleNodeArgs> = new EventEmitter();

    constructor(private apiService: ApiService,
        private toastr: ToastrService) {

        this.apiService.readAppSettings().then(() => {
            this.isReady = true;
            this.initializeSignalR();
        }).catch(err => {
            console.error('Failed to read AppSettings', err);
        });

    }

    initializeSignalR() {
        this.connection = new HubConnectionBuilder().withUrl(`${this.apiService.api}${this.apiService.route}/directoryInfo`).build();
        this.connection.start().catch(err => {
            console.error('Failed to start the SignalR connection', err);
        });

        this.connection.on('ReportProgress', (m, p) => this.onMessageReceived(m, p));
    }

    onMessageReceived(message: string, progress: string) {
        this.loader.text = `${message}`;
    }

    ngOnInit() {
        setTimeout(() => {
            //this.validate();
        }, 100);
    }

    addButtons() {
        $(".node-tree").append(`
            <button>Test</button>
        `);
    }

    validate() {
        if (!this.directory) {
            this.toastr.error(`Supply a path`, 'Invalid path');
            return;
        }
        this.searchResults = [];
        this.selectedNode = undefined;
        this.searchSize = 0;
        this.selectedSize = 0;
        this.searchSizeString = "0 MB";
        this.selectedSizeString = "0 MB";

        this.loader.show('Validating Directory');
        this.apiService.validateDirectory(this.directory)
            .then((res: boolean) => {
                if (res == true) {
                    this.loader.text = 'Analyzing Directory';
                    this.apiService.analyzeDirectory(this.directory).then((res: DirectoryResponse) => {
                        this.unloadTree();
                        this.buildTree(res);
                        this.loader.hide();

                        setTimeout(() => {
                            if (this.tree) {
                                this.treeView.search();
                            }
                        }, 200);
                    }).catch((err) => {
                        this.loader.hide();
                        this.toastr.error(`Failed to analyze Directory: '${this.directory}'`, 'Failed to analyze');
                    });
                }
                this.isValidPath = true;
            }).catch((err: HttpErrorResponse) => {
                switch (err.status) {
                    case 404: this.toastr.error(`Unable to connect to endpoint ${this.apiService.api}${this.apiService.route}/api`, 'Unable to Connect',
                        { disableTimeOut: true }); break;
                    default: this.toastr.error(`Invalid Directory: '${this.directory}'`, 'Invalid path'); break;
                }
                this.loader.hide();

            });

    }
    selected: boolean = false;
    selectedNode: TreeNode = undefined;

    containsSearchResults: boolean = false;
    searchMatches: number = 0;
    searchSize: number = 0;
    searchSizeString: string;
    searchResults: TreeNode[] = [];


    selectedSize: number = 0;
    selectedSizeString: string = '0 MB';

    // searchSelectedItems: TreeNode[] = [];
    allSelected: boolean = false;

    checkChange(checked: boolean, node: TreeNode) {
        if (checked) {
            this.selectedSize += node.directoryInfo.size;
            node.state.checked = true;
            // this.searchSelectedItems.push(node);
            if (this.searchMatches == this.searchResults.filter(n => n.state.checked).length) this.allSelected = true;
        } else {
            const foundNode = this.searchResults.find(n => n.id == node.id);
            if (foundNode) {
                node.state.checked = false;
                this.selectedSize -= node.directoryInfo.size;
                this.selectedSizeString = Math.round(this.selectedSize / 1024 / 1024).toFixed(2) + ' MB';
            }
            if (this.searchResults.filter(n => n.state.checked).length != this.searchMatches) this.allSelected = false;
        }
        this.selectedSizeString = Math.round(this.selectedSize / 1024 / 1024).toFixed(2) + ' MB';
    }

    removeNode(node: TreeNode) {
        this.searchResults.splice(this.searchResults.indexOf(node), 1);
        this.searchSize -= node.directoryInfo.size;
        this.searchMatches -= 1;
        this.searchSizeString = Math.round(this.searchSize / 1024 / 1024).toFixed(2) + ' MB';
    }

    deleteDirectories() {
        const len = this.searchResults.filter(r => r.state.checked).length;
        swal({
            title: 'Are you sure?',
            text: `Delete ${len} directories? Note: You won't be able to revert this!`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete'
        }).then((result) => {
            if (result.value) {
                this.loader.show(`Deleting ${len} directories...`);
                this.apiService.deleteDirectories(this.searchResults.filter(r => r.state.checked).map(i => i.directoryInfo.fullName)).then((res) => {
                    this.searchResults.filter(r => r.state.checked).forEach(node => {
                        this.removeNode(node);
                    });

                    this.searchResults.filter(r => r.state.checked).forEach(r => r.state.checked = false);

                    this.loader.hide();
                    this.toastr.success(`Deleted ${len} Directories`, 'Deleted Successfully');
                }).catch(err => {
                    this.loader.hide();
                    this.toastr.error(`Invalid Directory: '${this.directory}'`, 'Failed to delete Directories');
                })
            }
        });
    }

    buildTree(res: DirectoryResponse): any {
        requestAnimationFrame(() => {
            this.tree = new Tree({
                data: [this.generateTreeData(res)],
                showCheckbox: false,
                showIcon: false,
                searchResultColor: 'orange',
                searchResultBackColor: '#428bca'
            });

            this.tree.onInitialized.subscribe(() => {
                this.tree.expandAll();
            });

            this.tree.onSearchComplete.subscribe((res: MultipleNodeArgs) => {
                this.containsSearchResults = true;
                this.searchMatches = res.data.length;
                if (res.data && res.data.length > 0) {
                    this.searchSize = res.data.map(r => r.directoryInfo.size).reduce((a, b) => a + b, 0);
                    this.searchSizeString = Math.round(this.searchSize / 1024 / 1024).toFixed(2) + ' MB';
                }

                this.searchResults = res.data.slice();

                console.log('Search Completed', res, this.searchMatches, this.searchSize);
            });

            this.tree.onNodeSelected.subscribe((node: SingleNodeArgs) => {
                console.log('Selected Node: ', node);
                // this.selected = this.tree.getSelected().length > 0;
                this.selectedNode = node.data;
            });

            this.tree.onNodeUnselected.subscribe((node: SingleNodeArgs) => {
                // this.selected = this.tree.getSelected().length > 0;
                this.selectedNode = undefined;
            });
        })
    }

    unloadTree(): any {
        requestAnimationFrame(() => {
            if (this.tree) this.tree.removeTree();
            this.tree = undefined;
        });
    }

    selectNode(node: TreeNode) {
        // this.selected = true;
        this.selectedNode = node;
    }

    getSelectedNodes() {
        return this.searchResults.filter(node => node.state.checked).length > 0;
    }

    toggleAll() {
        this.selectedSize = 0;
        this.searchResults.forEach(node => {
            // select all
            if (this.allSelected) {
                this.selectedSize += node.directoryInfo.size;
            }
            node.state.checked = this.allSelected;
        });
        this.selectedSizeString = Math.round(this.selectedSize / 1024 / 1024).toFixed(2) + ' MB';
    }

    generateTreeData(response: DirectoryResponse): TreeNode {
        const node = new TreeNode({ text: response.name });
        response.friendlySize = `${(response.size / 1024 / 1024).toFixed(2)} MB`;
        node.directoryInfo = response;

        response.directories.forEach(dir => {
            if (!node.nodes) node.nodes = [];
            node.nodes.push(this.generateTreeData(dir));
        });

        return node;
        // return new TreeNode({text: response.name});
    }

    checkWithKey(key: KeyboardEvent) {
        switch (key.keyCode) {
            case 13: this.validate(); break;
            case 27: this.directory = ''; break;
        }
    }

    analyze() {
        if (!this.isValidPath) {
            this.toastr.error(`Invalid Directory: '${this.directory}'`, 'Invalid path');
            return;
        }
    }

    deleteDirectory(node: TreeNode) {
        swal({
            title: 'Are you sure?',
            text: `Delete ${node.directoryInfo.fullName}? Note: You won't be able to revert this!`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.loader.show(`Deleting ${node.directoryInfo.fullName}...`);
                this.apiService.deleteDirectory(node.directoryInfo.fullName).then((res) => {
                    this.removeNode(node);

                    this.loader.hide();
                    this.toastr.success(`Deleted ${node.directoryInfo.fullName}`, 'Deleted Successfully');
                }).catch(err => {
                    this.loader.hide();
                    this.toastr.error(`Invalid Directory: '${this.directory}'`, 'Invalid path');
                })
            }
        });
    }

    test() {
        this.loader.show('Test');
        setTimeout(() => {
            this.loader.hide();
        }, 100);
    }
}
