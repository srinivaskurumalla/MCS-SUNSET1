import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DBService } from 'src/app/Services/db.service';
export interface DataCategories {
  Id: number;
  GroupName: string;
  GroupDescription: string;
  Include: boolean;
}

export interface TablesToExport {
  Id: number;
  TableName: string;
  TableDescription: string;
  Include: boolean;
  ExportLevel: number;
  ErrorMessage: string;
  GroupDataId: number;
}

@Component({
  selector: 'app-data-export-screen',
  templateUrl: './data-export-screen.component.html',
  styleUrls: ['./data-export-screen.component.css'],
})
export class DataExportScreenComponent implements OnInit {
  constructor(private DbService: DBService) {}
  groupDataSource: DataCategories[] = [];
  tableDataSource: TablesToExport[] = [];
  exportTables: TablesToExport[] = [];

  ngOnInit(): void {
    this.DbService.getAllGroups().subscribe(
      (data) => {
        debugger;
        this.groupDataSource = data;
      },
      (err) => console.error(err)
    );

    this.DbService.getAllTables().subscribe(
      (data) => {
        this.tableDataSource = data;
      },
      (err) => console.error(err)
    );
  }
  // GROUP_DATA: DataCategories[] = []
  // TABLE_DATA : TablesToExport[] = []
  displayedColumns: string[] = ['GroupName', 'GroupDescription', 'Include'];
  displayedColumns1: string[] = [
    'TableName',
    'TableDescription',
    'Include',
    'ExportLevel',
    'ErrorMessage',
  ];

  // tableDataSource = TABLE_DATA;

  // Date and Time

  // this.currentDate = new Date();

  // formattedDateTime = this.this.currentDate.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
  // modifiedDateTime = this.formattedDateTime.replace(/\//g, '-');
  currentDate = new Date();

  month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
  day = String(this.currentDate.getDate()).padStart(2, '0');
  year = String(this.currentDate.getFullYear());
  hours = String(this.currentDate.getHours() % 12 || 12).padStart(2, '0');
  minutes = String(this.currentDate.getMinutes()).padStart(2, '0');
  amPm = this.currentDate.getHours() < 12 ? 'AM' : 'PM';
  formattedDateTime = `${this.month}-${this.day}-${this.year} ${this.hours}:${this.minutes} ${this.amPm}`;

  //Export selected tables

  ExportSelectedTables() {
    // console.log(ELEMENT_DATA)
    let counter = 0;

    if (this.exportTables.length > 0) {
      this.exportTables.length = 0;

    }
    for (let t of this.tableDataSource) {
      if (t.Include) {
        console.log(t);
       // this.DbService.exportTables()
        this.exportTables.push(t);
       // this.exportTables.p


        counter++;
      }
    }
    console.log('newly exported tables:', JSON.stringify(this.exportTables));




    this.DbService.exportTables(this.exportTables).subscribe(
      (response) => {
        alert(`Exported selected ${counter} tables data`);
      },
      (error) => {
        alert('Error while posting data:' + error);
      }
    )

    // this.DbService.deletePreviouslyExportedData().subscribe(
    //   () => {
    //     alert('delete works')
    //   }
    // )
    // debugger
    // this.DbService.deletePreviouslyExportedData().subscribe(
    //   () => {

    //   },
    //   (error) => console.log(error)

    // )

  }

  updateChildCheckboxes(Id: number) {
    for (let t of this.tableDataSource) {
      if (t.GroupDataId === Id) {
        t.Include = !t.Include;
      }
    }
  }

  updateParentCheckboxes(groupDataId: number): void {
    let parentTable = this.groupDataSource.find((g) => g.Id === groupDataId);

    //debugger
    if (parentTable) {
      let allChildrenUnchecked = true;

      for (let t of this.tableDataSource) {
        if (t.GroupDataId === groupDataId && t.Include) {
          allChildrenUnchecked = false;
          break;
        }
      }

      parentTable.Include = !allChildrenUnchecked;
    }
  }
}
