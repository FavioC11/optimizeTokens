import { Component } from '@angular/core';
import { CodeCompressorComponent } from './code-compressor/code-compressor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CodeCompressorComponent],
  template: '<app-code-compressor></app-code-compressor>',
})
export class AppComponent {}
