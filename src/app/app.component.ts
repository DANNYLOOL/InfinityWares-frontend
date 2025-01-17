import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GuestService } from './services/guest.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tienda';
  public geo = localStorage.getItem('geo');
  private tokenCheckInterval: any;
  private subscriptions: Subscription[] = [];
  
  ngOnInit(): void {
    this.checkToken();
    // Establecer intervalo para verificar el token cada cierto tiempo (ej. cada minuto)
    this.tokenCheckInterval = setInterval(() => this.checkToken(), 60100); // 60,000 ms = 1 minuto
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruye
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  constructor(
    private _guestService:GuestService,
    private _router:Router
  ){
    if(this.geo == null){
      this._guestService.obtener_ip_cliente().subscribe(
        response=>{
          this._guestService.obtener_data_cliente(response.ip).subscribe(
            response=>{
              localStorage.setItem('geo',JSON.stringify(response));
              window.location.reload();
              
            }
          );
        }
      );
    }
  }

  checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const sub = this._guestService.verificar_token(token).subscribe(
        response => {
          // Aquí puedes agregar lógica adicional si es necesario
        },
        error => {
          localStorage.removeItem('token');
          localStorage.removeItem('_id');
          localStorage.removeItem('user');
          this._router.navigate(['/login']);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      );
      this.subscriptions.push(sub);
    }
  }

  onActivate(event:any) {
    window.scroll(0,0);

  }
}
