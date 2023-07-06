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
  selectedTableCount = 0;

  ngOnInit(): void {
    this.getAllGroups();
    this.getAllTables()


  }

  displayedColumns: string[] = ['GroupName', 'GroupDescription', 'Include'];
  displayedColumns1: string[] = [
    'TableName',
    'TableDescription',
    'Include',
    'ExportLevel',
    'ErrorMessage',
  ];


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



  getAllGroups() {
    this.DbService.getAllGroups().subscribe(
      (data) => {
        this.groupDataSource = data;
      },
      (err) => console.error(err)
    );
  }

  getAllTables() {
    this.DbService.getAllTables().subscribe(
      (data) => {
        this.tableDataSource = data;
      },
      (err) => console.error(err)
    );
  }

    //Export selected tables
  ExportSelectedTables() {

    let counter = 0;

    this.exportTables = []  //clear previous selected tables
    for (let t of this.tableDataSource) {
      if (t.Include) {
        console.log(t);
        this.exportTables.push(t);

        counter++;
      }
    }
    console.log('newly exported tables:', JSON.stringify(this.exportTables));

    if (counter > 0) {
      this.DbService.exportTables(this.exportTables).subscribe(
        () => {
          alert(`Exported selected ${counter} tables data`);
        },
        (error) => {
          alert('Error while posting data:' + error);
        }
      );
    } else {
      alert('Please select tables to exportF');
    }
  }

  updateChildCheckboxes(groupId: number): void {

    const parentTable = this.groupDataSource.find((g) => g.Id === groupId);

    if (parentTable) {
      const allChildrenChecked = this.tableDataSource
        .filter((t) => t.GroupDataId === groupId)
        .every((t) => t.Include);

      const shouldCheckChildren = parentTable.Include && !allChildrenChecked;

      for (const t of this.tableDataSource) {
        if (t.GroupDataId === groupId) {
          t.Include = shouldCheckChildren;
        }
      }
      this.updateSelectedTableCount(); // Update the count
    }
  }

  updateParentCheckboxes(groupDataId: number): void {

    const parentTable = this.groupDataSource.find((g) => g.Id === groupDataId);

    if (parentTable) {
      const allChildrenUnchecked = this.tableDataSource
        .filter((t) => t.GroupDataId === groupDataId)
        .every((t) => !t.Include);

      parentTable.Include = !allChildrenUnchecked;
    }
    this.updateSelectedTableCount(); // Update the count
  }

  updateSelectedTableCount(): void {
    this.selectedTableCount = this.tableDataSource.filter(
      (t) => t.Include
    ).length;
  }

}
