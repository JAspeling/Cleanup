import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { TreeNode, TreeNodeState } from "../../classes/node";
import { Tree } from "../../classes/tree";
import { SingleNodeArgs, MultipleNodeArgs } from "../../classes/event-args";
import { FuncOptions } from "../../classes/options";
declare var $: any;

@Component({
    selector: 'treeview-component',
    templateUrl: './treeview.html',
    styleUrls: ['./treeview.scss']
})
export class TreeviewComponent implements OnInit {
    @Input('treeId') treeId: string;
    @Input('tree') tree: Tree;

    @Output() onSearched: EventEmitter<MultipleNodeArgs> = new EventEmitter()

    searchString: string = 'node_modules|(\\bbin\\b)|(\\bobj\\b)';

    allExpanded: boolean = false;
    options: FuncOptions = new FuncOptions();

    searchWithKey(key: KeyboardEvent) {
        switch (key.keyCode) {
            case 13: this.search(); break;
            case 27: this.searchString = ''; break;
        }
    }
    
    ngOnInit(): void {
        if (this.tree === undefined) throw new Error('No Tree defined for the Treeview Component');
        requestAnimationFrame(() => {
            // this.tree.initialize($(`#${this.treeId}`));
            this.tree.initialize($('#tree'));
        });
        // this.subscribeToEvents();
    }

    toggleExpandAll(): void {
        if (this.allExpanded)
            this.tree.collapseAll(this.options);
        else
            this.tree.expandAll(this.options);

        this.allExpanded = !this.allExpanded;
    }
    
    search(): void {
        this.tree.search(this.searchString);
    }

    clearSearch(): void {
        this.tree.clearSearch();
    }
}