import { Component, ViewChild, ElementRef, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-firma-pad',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './firma-pad.html',
  styleUrls: ['./firma-pad.css']
})
export class FirmaPad implements AfterViewInit {

  @Input() label = 'Firma';

  @Output() firmaChange = new EventEmitter<string>();

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  uploadedImage: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    // Set canvas size based on CSS size
    canvas.width = rect.width;
    canvas.height = rect.height;

    this.ctx = canvas.getContext('2d')!;

    // Fill background with white
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configure drawing properties
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = '#000000';
  }

  startDraw(event: TouchEvent | MouseEvent) {
    event.preventDefault();
    this.drawing = true;
    this.draw(event);
  }

  endDraw() {
    if (!this.drawing) return;

    this.drawing = false;
    this.ctx.beginPath();

    // 👇 EMITIR FIRMA AL TERMINAR
    this.emitirFirma();
  }

  draw(event: TouchEvent | MouseEvent) {
    if (!this.drawing) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    let x = 0;
    let y = 0;

    if (event instanceof TouchEvent) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    // Ensure drawing properties are set
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 4;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  limpiar() {
    const canvas = this.canvasRef.nativeElement;

    // Clear canvas and fill with white background
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.uploadedImage = null;

    // Emitir vacío si se limpia
    this.firmaChange.emit('');
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64 = e.target?.result as string;
        this.uploadedImage = base64;

        // Clear canvas with white background
        const canvas = this.canvasRef.nativeElement;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Emitir imagen
        this.firmaChange.emit(base64);

        // Limpiar el input
        input.value = '';
      };

      reader.readAsDataURL(file);
    }
  }

  obtenerFirmaBase64(): string {
    if (this.uploadedImage) {
      return this.uploadedImage;
    }
    return this.canvasRef.nativeElement.toDataURL('image/png');
  }

  private emitirFirma(): void {
    const base64 = this.obtenerFirmaBase64();
    this.firmaChange.emit(base64);
  }
}
