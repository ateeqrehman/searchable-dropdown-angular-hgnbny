import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { MatSelect } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.css']
})
export class SelectSearchComponent implements OnInit {

  /** control for the selected entity */
  public entityCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public entityFilterCtrl: FormControl = new FormControl();

  /** list of entities filtered by search keyword */
  public filteredEntities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  @Input() set data(data: any[]) {
    this._data = data;
    // load the initial entity list
    this.filteredEntities.next(this.data.slice());
  }
  get data(): any[] {
    return this._data;
  }
  private _data: any[];

  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    // listen for search field value changes
    this.entityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterEntities();
      });

  }

  ngAfterViewInit(): void {
    this.setInitialValue();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onChange($event) {
    this.onSelectionChange.emit($event);
  }

  private setInitialValue() {
    this.filteredEntities
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredEntities are loaded initially
        // and after the mat-option elements are available
        if(this.singleSelect)
          this.singleSelect.compareWith = (a: any, b: any) => a.url === b.url;
      });
  }

  private filterEntities() {
    if (!this.data) {
      return;
    }
    // get the search keyword
    let search = this.entityFilterCtrl.value;
    if (!search) {
      this.filteredEntities.next(this.data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the entitys
    this.filteredEntities.next(
      this.data.filter(entity => entity.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
