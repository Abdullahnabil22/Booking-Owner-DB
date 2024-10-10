import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../../Services/hotel/hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Hotel } from './../../../model/hotel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-hotel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-hotel.component.html',
  styleUrls: ['./edit-hotel.component.css'], 
})
export class EditHotelComponent implements OnInit {
  hotel: Hotel = {} as Hotel;
  updateProd: string = '';
  selectedFiles: File[] = [];
  imagePreviewUrls: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HotelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const updateProd = this.activatedRoute.snapshot.paramMap.get("id");

    console.log("Route parameters:", this.activatedRoute.snapshot.paramMap);
    console.log("Hotel ID:", updateProd);

    if (updateProd) {
      this.updateProd = updateProd;
      this.http.getHotelById(updateProd).subscribe((data: Hotel) => {
        this.hotel = data;
        console.log("data", this.hotel);
    
        if (this.hotel.images && this.hotel.images.length > 0) {
          this.imagePreviewUrls = this.hotel.images;
        }
      });
    }
  }

  onFileSelect(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.generateImagePreviews(newFiles);
    }
  }

  generateImagePreviews(files: File[]): void {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  updateHotel(updatedHotel: Hotel): void {
    console.log("Updating hotel:", updatedHotel);
    

    if (this.selectedFiles.length > 0) {
      this.uploadFiles().then(uploadedImageUrls => {
        updatedHotel.images = [...(updatedHotel.images || []), ...uploadedImageUrls];
        this.sendUpdateRequest(updatedHotel);
      });
    } else {
      this.sendUpdateRequest(updatedHotel);
    }
  }

  uploadFiles(): Promise<string[]> {

    return Promise.resolve([]);  
  }

  sendUpdateRequest(updatedHotel: Hotel): void {
    this.http.updateHotel(updatedHotel).subscribe(
      (next) => {
        console.log("Hotel updated successfully:");
        this.sucessUpdate();
      },
      (error) => {
        console.error("Error updating hotel:", error);
      }
    );
  }

  sucessUpdate(): void {
    console.log("hotelname", this.hotel.name);
    this.router.navigate(['/edit-property']); 
  }
}