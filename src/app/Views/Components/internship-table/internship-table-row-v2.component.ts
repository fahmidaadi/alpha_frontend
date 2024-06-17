import { Component } from '@angular/core';
import { DataTablesModule } from "angular-datatables";
import { CommonModule } from '@angular/common';
import { InternshipDetailsButtonComponent } from '../../Shared/internship-details-button/internship-details-button.component';

import { AfterViewInit, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import * as DataTables from 'datatables.net';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-internship-table-row-v2',
  standalone: true,
  imports: [DataTablesModule  , CommonModule , InternshipDetailsButtonComponent],
  templateUrl: './internship-table-row-v2.component.html',
  styleUrl: './internship-table-row-v2.component.css'
})
export class InternshipTableRowV2Component implements OnInit {
  dataRows = [
  
    { id: 11, firstName: 'Daadi', lastName: 'Fahmi' },
    { id: 12, firstName: 'Ferchichi', lastName: 'Ghaieth' },
  ];

  showDetails(rowData: any) {
    console.log(`Name: ${rowData.firstName} ${rowData.lastName}`);
  }


  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;

  dtOptions: Config = {};

  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [{
        title: 'ID',
        data: 'id'
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }]
    };
  }
}

  

