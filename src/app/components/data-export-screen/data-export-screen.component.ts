import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DBService } from 'src/app/Services/db.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort,Sort} from '@angular/material/sort';
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
export class DataExportScreenComponent implements OnInit, AfterViewInit {
  constructor(private DbService: DBService) {
    debugger

     // Assign the data to the data source for the table to render
  }
  groupDataSource: DataCategories[] = [];
  tableDataSource: TablesToExport[] = [];
  exportTables: TablesToExport[] = [];
  selectedTableCount = 0;
  searchTableData!: MatTableDataSource<TablesToExport>;
  searchGroupData!: MatTableDataSource<DataCategories>;
  selectedFile: File | null = null;


  ngOnInit(): void {
    this.getAllGroups();
    this.getAllTables()

//console.log('table data'+this.tableDataSource)
  }

  displayedColumns: string[] = ['GroupName', 'GroupDescription', 'Include'];
  displayedColumns1: string[] = [
    'TableName',
    'TableDescription',
    'Include',
    'ExportLevel',
    'ErrorMessage',
  ];


  @ViewChild('tablePaginator') tablePaginator!: MatPaginator;
  @ViewChild('groupPaginator') groupPaginator!: MatPaginator;
  @ViewChild('tableTblSort') tableSort!: MatSort;
  @ViewChild('groupTblSort') groupSort!: MatSort;

  ngAfterViewInit() {
    debugger
    this.searchTableData.paginator = this.tablePaginator;
    this.searchTableData.sort = this.tableSort;
    this.searchGroupData.paginator = this.groupPaginator;
    this.searchGroupData.sort = this.groupSort;
  }
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


  fileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  clearFile(input: any) {
    input.value = ''; // Clear the value of the file input field
    this.selectedFile = null; // Reset the selected file
  }

  applyFilter(event: Event) {
    const filterValues = (event.target as HTMLInputElement).value;
    this.searchTableData.filter = filterValues.trim().toLowerCase();

    if (this.searchTableData.paginator) {
          this.searchTableData.paginator.firstPage();
        }
  }
  applyFilterGroup(str: string) {
    const trimmedValue = str.trim().toLowerCase();
       this.searchGroupData.filter = trimmedValue;

    if (this.searchGroupData.paginator) {
          this.searchGroupData.paginator.firstPage();
        }
  }
  getAllGroups() {
    this.DbService.getAllGroups().subscribe(
      (data) => {
        this.groupDataSource = data;
        this.searchGroupData = new MatTableDataSource(this.groupDataSource);
        console.log('group data:', JSON.stringify(this.groupDataSource));
        console.log('searched group data:', JSON.stringify(this.searchGroupData.data));

      },
      (err) => console.error(err)
    );
  }

  getAllTables() {
    this.DbService.getAllTables().subscribe(
      (data) => {
        this.tableDataSource = data;
        this.searchTableData = new MatTableDataSource(this.tableDataSource);
        console.log('table data:', JSON.stringify(this.tableDataSource));
      console.log('searched data:', JSON.stringify(this.searchTableData.data));

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
