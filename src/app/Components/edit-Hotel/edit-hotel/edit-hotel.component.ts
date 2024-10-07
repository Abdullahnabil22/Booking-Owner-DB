import { Component } from '@angular/core';
import { HotelService } from '../../../Services/hotel/hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Hotel } from './../../../model/hotel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-hotel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-hotel.component.html',
  styleUrls: ['./edit-hotel.component.css'], 
})
export class EditHotelComponent {
  hotel: Hotel = {} as Hotel;
  updateProd: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private http: HotelService, private router: Router) {}

  ngOnInit(): void {
    const updateProd = this.activatedRoute.snapshot.paramMap.get("id");

    console.log("Route parameters:", this.activatedRoute.snapshot.paramMap);
    console.log("Hotel ID:", updateProd);

    if (updateProd) {
      this.updateProd = Number(updateProd);
      this.http.getHotelById(updateProd).subscribe((data: Hotel) => {
        this.hotel = data;
        console.log("data",this.hotel)
      });
    }
  }

  updateHotel(updatedHotel: Hotel): void {
    console.log("Updating hotel:", updatedHotel);
  
    this.http.updateHotel(updatedHotel).subscribe(
      (next) => {
        console.log("Hotel updated successfully:");
        this.sucessUpdate();
      },
     
    );
  }
  
  

  sucessUpdate(): void {
  console.log("hotelname",this.hotel.name)
    this.router.navigate(['/edit-property']); 
  }
}
