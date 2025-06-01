import { Component, OnInit } from '@angular/core';
import { Bill } from '../bill';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bill-details',
  standalone: false,
  
  templateUrl: './bill-details.component.html',
  styleUrl: './bill-details.component.css'
})
export class BillDetailsComponent implements OnInit {

      orderRef!:string;
    
      bill:Bill=new Bill();
     
      constructor(private stockService:StockService, private router:Router,private activatedRoute:ActivatedRoute){
        
      }
  
      ngOnInit(): void {
            this.orderRef=this.activatedRoute.snapshot.params['orderRef'];
            this.stockService.getBillById(this.orderRef).subscribe({
              next:data=>{
               this.bill=data;
             
              
              },error:err=>{
               console.log(err);
             }
             });       
      }
close() {
  this.router.navigate(['/admin/bill']);
}

}
