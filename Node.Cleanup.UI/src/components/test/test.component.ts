import { Component, OnInit } from '@angular/core';
import { Tree } from '../../classes/tree';
import { FuncOptions } from '../../classes/options';
import { ApiService } from '../../services/httpService';
import { SingleNodeArgs, MultipleNodeArgs } from '../../classes/event-args';
import { TreeNode, TreeNodeState } from '../../classes/node';

@Component({
  selector: 'test-component',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

    tree: Tree = undefined;
    searchString: string = 'child';
    silentMode: boolean = true;

    allExpanded: boolean = false;
    checkAll: boolean = false;
    disableAll: boolean = false;
    options: FuncOptions = new FuncOptions();

    constructor(private apiService: ApiService) {

    }

    ngOnInit(): void {
        this.apiService.readAppSettings().then(() => {
            this.tree = this.getTypedTree();
            this.subscribeToEvents();
        }, err => { });
    }

    subscribeToEvents() {
        this.tree.onNodeChecked.subscribe((data: SingleNodeArgs) => { this.nodeChecked(data); });
        this.tree.onNodeCollapsed.subscribe((data: SingleNodeArgs) => { this.nodeCollapsed(data); });
        this.tree.onNodeDisabled.subscribe((data: SingleNodeArgs) => { this.nodeDisabled(data); });
        this.tree.onNodeEnabled.subscribe((data: SingleNodeArgs) => { this.nodeEnabled(data); });
        this.tree.onNodeExpanded.subscribe((data: SingleNodeArgs) => { this.nodeExpanded(data); });
        this.tree.onNodeSelected.subscribe((data: SingleNodeArgs) => { this.nodeSelected(data); });
        this.tree.onNodeUnchecked.subscribe((data: SingleNodeArgs) => { this.nodeUnchecked(data); });
        this.tree.onNodeUnselected.subscribe((data: SingleNodeArgs) => { this.nodeUnselected(data); });
        this.tree.onSearchCleared.subscribe((data: MultipleNodeArgs) => { this.searchCleared(data); });
        this.tree.onSearchComplete.subscribe((data: MultipleNodeArgs) => { this.searchCompleted(data); });
    }

    //#region Events
    nodeChecked(data: SingleNodeArgs) {
        console.log('Node Checked', data);
    }

    nodeCollapsed(data: SingleNodeArgs) {
        console.log('Node Collapsed', data);
    }

    nodeDisabled(data: SingleNodeArgs) {
        console.log('Node Disabled', data);
    }

    nodeEnabled(data: SingleNodeArgs) {
        console.log('Node Enabled', data);
    }

    nodeExpanded(data: SingleNodeArgs) {
        console.log('Node Expanded', data);
    }

    nodeSelected(data: SingleNodeArgs) {
        console.log('Node Selected', data);
    }

    nodeUnchecked(data: SingleNodeArgs) {
        console.log('Node Unchecked', data);
    }

    nodeUnselected(data: SingleNodeArgs) {
        console.log('Node Unselected', data);
    }

    searchCleared(data: MultipleNodeArgs) {
        console.log('Search Cleared', data);
    }

    searchCompleted(data: MultipleNodeArgs) {
        console.log('Search Completed', data);
    }
    //#endregion


    updateSilentMode() {
        this.options.silent = this.silentMode;
    }

    getTypedTree(): Tree {
        const tree = new Tree({
            showCheckbox: true,
            showIcon: false,
            searchResultColor: 'orange',
            searchResultBackColor: '#428bca',
            data: [
                new TreeNode({
                    text: "Parent 1",
                    state: new TreeNodeState({ expanded: false }),
                    nodes: [
                        new TreeNode({
                            text: 'Child 1',
                            nodes: [
                                new TreeNode({ text: 'GrandChild 1' }),
                                new TreeNode({ text: 'GrandChild 2' })
                            ]
                        }),
                        new TreeNode({ text: 'Child 2' })
                    ]
                }),
                new TreeNode({ text: 'Parent 2' }),
                new TreeNode({ text: 'Parent 3' }),
                new TreeNode({ text: 'Parent 4' }),
                new TreeNode({ text: 'Parent 5' }),
                new TreeNode({
                    icon: "glyphicon glyphicon-check",
                    text: 'Parent 6',
                    selectable: true,
                    state: new TreeNodeState({ checked: true, selected: true })
                }),
            ]
        });

        return tree;
    }

    toggleExpandAll(): void {
        if (this.allExpanded)
            this.tree.collapseAll(this.options);
        else
            this.tree.expandAll(this.options);

        this.allExpanded = !this.allExpanded;
    }

    toggleNode(index: number): void {
        const expanded = this.tree.data[index].state.expanded;
        if (!expanded)
            this.tree.expandNode(this.tree.data[index], new FuncOptions({ levels: 1, silent: this.silentMode }));
        else
            this.tree.collapseNode(this.tree.data[index], this.options);
    }

    toggleCheckNode(index: number): void {
        if (this.tree.data[index].state.checked)
            this.tree.uncheckNode(this.tree.data[index], this.options);
        else
            this.tree.checkNode(this.tree.data[index], this.options);
    }

    toggleCheckAll() {
        if (!this.checkAll)
            this.tree.checkAll(this.options);
        else
            this.tree.uncheckAll(this.options);
        this.checkAll = !this.checkAll;
    }

    toggleDisableAll() {
        if (!this.disableAll) {
            this.tree.disableAll(this.options);
        } else {
            this.tree.enableAll(this.options);
        }
        this.disableAll = !this.disableAll;
    }

    toggleDisable(index: number) {
        if (!this.tree.data[index].state.disabled)
            this.tree.disableNode(this.tree.data[index], this.options);
        else
            this.tree.enableNode(this.tree.data[index], this.options);
    }

    getChecked() {
        console.log('Checked', this.tree.getChecked());
    }

    getCollapsed() {
        console.log('Collapsed', this.tree.getCollapsed());
    }

    getExpanded() {
        console.log('Expanded', this.tree.getExpanded());
    }

    search(): void {
        this.tree.search(this.searchString);
    }

    clearSearch(): void {
        this.tree.clearSearch();
    }
}
