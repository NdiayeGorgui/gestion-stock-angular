import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ship } from '../Ship';

@Component({
  selector: 'app-ship-order',
  standalone: false,
  
  templateUrl: './ship-order.component.html',
  styleUrl: './ship-order.component.css'
})
export class ShipOrderComponent implements OnInit {
   ship:Ship=new Ship();
   orderId!:string;

   constructor(private stockService:StockService,private router:Router,private activatedRoute:ActivatedRoute){
  
      }

  ngOnInit(): void {
    this.orderId=this.activatedRoute.snapshot.params['orderId'];

    this.stockService.getShipById(this.orderId).subscribe({
      next:data=>{
       this.ship=data;
      },error:err=>{
       console.log(err);
     }
     });
    
   
  }

  newShip() {
   
    this.stockService.createShip(this.ship).subscribe({
      next: (res) => {
        console.log('Réponse du serveur:', res);
        alert('Order shipped successfully!');
        
        console.log('Navigation en cours...');
        this.router.navigate(['/admin/shipped-orders'])
            .then(success => console.log('Navigation réussie:', success))
            .catch(err => console.error('Erreur de navigation:', err));
    
        
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error while shipping order. Please try again.');
      }
    });
   
  }
}
