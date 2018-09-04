import { EventEmitter } from '@angular/core';

import { TreeNode } from './node';
import { FuncOptions } from './options';
import { MultipleNodeArgs, SingleNodeArgs } from './event-args';

// dark theme: http://paletton.com/#uid=5420u0k4m9k4GcQ4wb94c7l4257

export class Tree {
    element: any;
    treeElement: any; // jquery element

    data: TreeNode[] = [];
    backColor: string = undefined;
    borderColor: string = undefined;
    checkedIcon: string = 'glyphicon glyphicon-check';
    collapseIcon: string = 'glyphicon glyphicon-minus';
    color: string = undefined;
    emptyIcon: string = 'glyphicon';
    enableLinks: boolean = false;
    expandIcon: string = 'glyphicon glyphicon-plus';
    highlightSearchResults: boolean = true;
    highlightSelected: boolean = true;
    levels: number = 10;
    multiSelect: boolean = false;
    nodeIcon: string = 'glyphicon glyphicon-stop';
    onhoverColor: string = '#F5F5F5';
    selectedIcon: string = 'glyphicon glyphicon-stop';
    searchResultBackColor: string = undefined;
    searchResultColor: string = '#D9534F';
    selectedBackColor: string = undefined;
    selectedColor: string = undefined;
    disabledColor: string = undefined;
    disabledBackColor: string = undefined;
    showBorder: boolean = true;
    showCheckbox: boolean = false;
    showIcon: boolean = true;
    showTags: boolean = false;
    uncheckedIcon: string = undefined;

    onNodeChecked: EventEmitter<SingleNodeArgs> = new EventEmitter<SingleNodeArgs>();
    onNodeCollapsed: EventEmitter<SingleNodeArgs> = new EventEmitter<SingleNodeArgs>();
    onNodeDisabled: EventEmitter<SingleNodeArgs> = new EventEmitter<SingleNodeArgs>();
    onNodeEnabled: EventEmitter<SingleNodeArgs> = new EventEmitter<SingleNodeArgs>();
    onNodeExpanded: EventEmitter<SingleNodeArgs> = new EventEmitter<SingleNodeArgs>();
    onNodeSelected: EventEmitter<SingleNodeArgs> = new EventEmitter<SingleNodeArgs>();
    onNodeUnchecked: EventEmitter<SingleNodeArgs> = new EventEmitter<SingleNodeArgs>();
    onNodeUnselected: EventEmitter<SingleNodeArgs> = new EventEmitter<SingleNodeArgs>();
    onSearchComplete: EventEmitter<MultipleNodeArgs> = new EventEmitter<MultipleNodeArgs>();
    onSearchCleared: EventEmitter<MultipleNodeArgs> = new EventEmitter<MultipleNodeArgs>();
    onInitialized: EventEmitter<any> = new EventEmitter();

    public constructor(init?: Partial<Tree>) {
        Object.assign(this, init);
    }

    initialize(element: any): any {
        this.applyTheme('dark');
        this.treeElement = element;
        element.treeview(this);
        this.element = element.data('treeview');
        this.attachToEvents();
        this.onInitialized.emit();
    }

    /// Triggers the event Emitters when the events on the tree Element are fired.
    attachToEvents(): any {
        this.treeElement.on('nodeChecked', (event, data) => { this.onNodeChecked.emit(new SingleNodeArgs({ event: event, data: data })); });
        this.treeElement.on('nodeCollapsed', (event, data) => { this.onNodeCollapsed.emit(new SingleNodeArgs({ event: event, data: data })); });
        this.treeElement.on('nodeDisabled', (event, data) => { this.onNodeDisabled.emit(new SingleNodeArgs({ event: event, data: data })); });
        this.treeElement.on('nodeEnabled', (event, data) => { this.onNodeEnabled.emit(new SingleNodeArgs({ event: event, data: data })); });
        this.treeElement.on('nodeExpanded', (event, data) => { this.onNodeExpanded.emit(new SingleNodeArgs({ event: event, data: data })); });
        this.treeElement.on('nodeSelected', (event, data) => { this.onNodeSelected.emit(new SingleNodeArgs({ event: event, data: data })); });
        this.treeElement.on('nodeUnchecked', (event, data) => { this.onNodeUnchecked.emit(new SingleNodeArgs({ event: event, data: data })); });
        this.treeElement.on('nodeUnselected', (event, data) => { this.onNodeUnselected.emit(new SingleNodeArgs({ event: event, data: data })); });
        this.treeElement.on('searchCleared', (event, data) => {
            this.onSearchCleared.emit(new MultipleNodeArgs({ event: event, data: Object.keys(data).map(k => data[k]) }));
        });
        this.treeElement.on('searchComplete', (event, data) => {
            this.onSearchComplete.emit(new MultipleNodeArgs({ event: event, data: Object.keys(data).map(k => data[k]) }));
        });
    }

    applyTheme(theme: string) {
        switch (theme.toLowerCase()) {
            case 'dark':
                this.onhoverColor = '#37363E';
                this.backColor = '#2E2E34';
                this.borderColor = '#32363A';
                this.color = '#A2A2A2';
                this.selectedColor = '#A2A2A2';
                this.selectedBackColor = '#242429';
                this.searchResultBackColor = '#2E2E34';
                this.searchResultColor = 'darkorange';
                this.disabledBackColor = 'lightgray';
                break;
        }
    }

    checkAll(options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.checkAll(options);
    }

    checkNode(node: TreeNode | string, options?: FuncOptions) {
        options = !options ? new FuncOptions() : options;
        this.element.checkNode(node, options);
    }

    clearSearch(): void {
        this.element.clearSearch();
    }

    collapseAll(options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.collapseAll(options);
    }

    collapseNode(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.collapseNode(node, options);
    }

    disableAll(options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.disableAll(options);
    }

    disableNode(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.disableNode(node, options);
    }

    enableAll(options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.enableAll(options);
    }

    enableNode(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.enableNode(node, options);
    }

    expandAll(options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.expandAll(options);
    }

    // node or Node ID
    expandNode(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.expandNode(node, options);
    }

    getChecked(): TreeNode[] {
        return this.element.getChecked();
    }

    getCollapsed(): TreeNode[] {
        // For some reason its returning collapsed items for Expanded and vice versa
        return this.element.getCollapsed();
    }

    getDisabled(): TreeNode[] {
        return this.element.getEnabled();
    }

    getEnabled(): TreeNode[] {
        return this.element.getEnabled();
    }

    getExpanded(): TreeNode[] {
        return this.element.getExpanded();
    }

    getNode(nodeId: string): TreeNode {
        return this.element.getNode(nodeId);
    }

    getParent(node: TreeNode | string): TreeNode {
        return this.element.getParent(node);
    }

    getSelected(): TreeNode[] {
        return this.element.getSelected();
    }

    getSiblings(node: TreeNode | string): TreeNode[] {
        return this.element.getSiblings(node);
    }

    getUnchecked(): TreeNode[] {
        return this.element.getUnchecked();
    }

    getUnselected(): TreeNode[] {
        return this.element.getUnselected();
    }

    removeTree(): void {
        this.element.remove();
    }

    revealNode(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.revealNode(node, options);
    }

    search(text: string, options?: FuncOptions): TreeNode[] {
        options = !options ? new FuncOptions() : options;
        return this.element.search(text, options);
    }

    selectNode(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.selectNode(node, options);
    }

    toggleNodeChecked(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.toggleNodeChecked(node, options);
    }

    toggleNodeDisabled(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.toggleNodeDisabled(node, options);
    }

    toggleNodeExpanded(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.toggleNodeExpanded(node, options);
    }

    toggleNodeSelected(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.toggleNodeSelected(node, options);
    }

    uncheckAll(options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.uncheckAll(options);
    }

    uncheckNode(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.uncheckNode(node, options);
    }

    unselectNode(node: TreeNode | string, options?: FuncOptions): void {
        options = !options ? new FuncOptions() : options;
        this.element.unselectNode(node, options);
    }
}