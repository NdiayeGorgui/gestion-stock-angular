import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customer',
  standalone: false,
  
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {

  //products:Products[]=[];
    public customers:any;
    public dataSource:any;
    //customerIdEvent!:string;
  
    public displayedColumns=["name","phone","email","address","status","action"]
    
    @ViewChild(MatPaginator) paginator!:MatPaginator;
    @ViewChild(MatSort) sort!:MatSort;
    constructor(private router:Router, private stockService:StockService,private activatedRoute:ActivatedRoute){
    }
  
    public getCustomers(){
      this.stockService.getCustomersList().subscribe({
        next: data=>{
          this.customers=data;
          this.dataSource=new MatTableDataSource(this.customers)
          this.dataSource.paginator=this.paginator;
          this.dataSource.sort=this.sort;
        },
        error:err=>{
          console.log(err);
        }
  
      });
      
    }
    ngOnInit(): void {
      
    this.getCustomers();
      
    }

    filterCustomer(event:Event){
      let value=(event.target as HTMLInputElement).value;
      this.dataSource.filter = value;
    }

    createCustomer(){
      this.router.navigateByUrl("/admin/create-customer");
    }

    deleteCustomer(id:string){
      let conf=confirm("Are you sure ?")
      if(conf){
       this.stockService.deleteCustomer(id).subscribe(data => {
       // alert("Customer deleted successfuly !");
         console.log(data);
        // this.ngOnInit();
       });
       alert('Customer deleted successfuly !');
       this.ngOnInit();
      }
    }
  
    editCustomer(customerIdEvent:string){
      this.router.navigate(['/admin/update-customer',customerIdEvent]);
    }
    
  
    getCustomer(customerIdEvent:string){
      this.router.navigate(['/admin/customer-details',customerIdEvent]);
    }
  

}
