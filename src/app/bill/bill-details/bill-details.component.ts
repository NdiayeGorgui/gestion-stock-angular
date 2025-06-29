import { Component, OnInit } from '@angular/core';
import { Bill } from '../bill';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BillResponseDto } from '../BillResponseDto';
import { MatTableDataSource } from '@angular/material/table';
import { ProductItemResponseDto } from '../../payment/ProductItemResponseDto';

@Component({
  selector: 'app-bill-details',
  standalone: false,

  templateUrl: './bill-details.component.html',
  styleUrl: './bill-details.component.css'
})
export class BillDetailsComponent implements OnInit {

  bill: BillResponseDto = {
    orderId: '',
    customerName: '',
    customerPhone: '',
    customerMail: '',
    paymentMode: '',
    amount: 0,
    totalTax: 0,
    totalDiscount: 0,
    billStatus: '',
    billingDate: new Date(),
    products: []  // 
  };

  orderRef!: string;

  dataSource = new MatTableDataSource<ProductItemResponseDto>([]);
  displayedColumns: string[] = ['productId', 'productName', 'quantity', 'price', 'discount', 'tax'];

  constructor(private stockService: StockService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.orderRef = this.activatedRoute.snapshot.params['orderRef'];
    this.stockService.getBillById(this.orderRef).subscribe({
      next: data => {
        this.bill = data;
        this.dataSource.data = data.products;
        console.log('✅ Données chargées :', data);


      }, error: err => {
        console.log(err);
      }
    });
  }
  close() {
    this.router.navigate(['/admin/bill']);
  }

  printBill(orderRef: string): void {
    this.stockService.getBillByIdPdf(orderRef).subscribe({
      next: (pdfBlob: Blob) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank'); // Ouvre dans un nouvel onglet
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération de la facture :', err);
      }
    });
  }



}
