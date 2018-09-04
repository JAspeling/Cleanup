import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'loader-component',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    animations: [
        trigger('loaderState', [
          state('inactive', style({
            opacity: '0'
          })),
          state('active',   style({
            opacity: '1'
          })),
          transition('inactive => active', animate('300ms ease-in')),
          transition('active => inactive', animate('300ms ease-out'))
        ])
      ]
})
export class LoaderComponent implements OnInit {

    @Input('text') text: string = 'Loading...';
    showLoader: boolean = false;
    public state: string = 'inactive';

    constructor() { }

    ngOnInit() {
    }

    show(message?: string) {
        if (message) this.text = message;
        this.showLoader = true;
        requestAnimationFrame(() => {
            this.state = 'active';
        });
    }

    hide() {
        this.state = 'inactive';
        setTimeout(() => {
            this.showLoader = false;
        }, 400);
    }
}
