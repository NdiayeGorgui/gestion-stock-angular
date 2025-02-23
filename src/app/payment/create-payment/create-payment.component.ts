import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment } from '../payment';
import { Custom } from '../../customer/custom';
import { IModePayment } from '../IModePayment';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { AmountDto } from './amountDto';


@Component({
  selector: 'app-create-payment',
  standalone: false,
  
  templateUrl: './create-payment.component.html',
  styleUrl: './create-payment.component.css'
})
export class CreatePaymentComponent implements OnInit{

  amountDto: AmountDto = { amount: 0 ,totalAmount:0,tax:0,discount:0};  // Défaut pour éviter undefined
 
  customerIdEvent!:string;

  status="CREATED";
  mode!:string;
   customer:Custom=new Custom();
  

   payment:Payment=new Payment();
   responseType:any;

   public modes:Array<IModePayment>=[{id:1,name:'COMPTANT'},
    {id:2,name:'CHEQUE'},
    {id:3,name:'VIREMENT'}];
    
      constructor(private stockService:StockService, private router:Router,private activatedRoute:ActivatedRoute,private cdr: ChangeDetectorRef){
    
      }

      modeChange(mode: string) {
        //this.mode=mode;
       // console.log(mode);
      }

      ngOnInit(): void {
        this.customerIdEvent=this.activatedRoute.snapshot.params['customerIdEvent'];
        this.stockService.getCustomerById(this.customerIdEvent).subscribe({
          next:data=>{
           this.customer=data;
           this.getAmount();
          },error:err=>{
           console.log(err);
         }
         });       
      }
  
      newPayment(){
        this.payment.customerIdEvent=this.customerIdEvent;
        this.stockService.createPayment(this.payment).subscribe({
          next:prod=>{
            alert('Payment created successfuly !');
            this.router.navigate(['/admin/payment']);
           
          },
          error:err=>{
            console.log(err);
          }
        });
       
      }

      getAmount() {
        this.stockService.getAmount(this.customerIdEvent, this.status).subscribe(
          (data: AmountDto) => {  
            console.log("✅ Réponse API :", data);
      
            if (data && data.amount !== undefined && data.totalAmount !== undefined && data.tax !== undefined && data.discount !== undefined) {
              this.amountDto = data;
              this.cdr.detectChanges(); // 🔹 Force Angular à voir le changement
              console.log("🎯 Montant récupéré :", this.amountDto.amount);
            }
          }, 
          error => {
            console.error("❌ Erreur API :", error);
          }
        );
      }
      
      
      printPayment(){
       
        this.stockService.printInvoice(this.customerIdEvent,this.status).subscribe(

          response => {
            const fileName = `Facture_${this.customerIdEvent}.xlsx`;
           this.saveExcelFile(response,fileName);
          }, error => {
            console.error('Erreur lors du téléchargement', error);
          });
          this.newPayment();
      }

      exportToExcel(data: any[], fileName: string): void {
        // Convertir les données en feuille Excel
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
        
        // Générer le fichier Excel
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        // Sauvegarde du fichier
        this.saveExcelFile(excelBuffer, fileName);
      }

      private saveExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, `${fileName}.xlsx`);
      }

      goBack(){
        this.router.navigate(['/admin/order']);
        //window.location.href = '/admin/order';  // Redirection forcée
      }

}
