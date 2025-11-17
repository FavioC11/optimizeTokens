import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CompressionStats {
  original: number;
  compressed: number;
  saved: number;
  percentage: number;
}

@Component({
  selector: 'app-code-compressor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-compressor.component.html',
  styleUrls: ['./code-compressor.component.css'],
})
export class CodeCompressorComponent {
  inputCode: string = '';
  outputCode: string = '';
  selectedLanguage: 'typescript' | 'html' | 'css' | 'json' = 'typescript';
  mode: 'compress' | 'decompress' = 'compress';
  stats: CompressionStats | null = null;

  compress(): void {
    if (!this.inputCode.trim()) {
      alert('Por favor ingresa código para comprimir');
      return;
    }

    const originalTokens = this.estimateTokens(this.inputCode);

    let compressed = '';
    switch (this.selectedLanguage) {
      case 'typescript':
        compressed = this.compressTypeScript(this.inputCode);
        break;
      case 'html':
        compressed = this.compressHTML(this.inputCode);
        break;
      case 'css':
        compressed = this.compressCSS(this.inputCode);
        break;
      case 'json':
        compressed = this.compressJSON(this.inputCode);
        break;
    }

    this.outputCode = compressed;
    const compressedTokens = this.estimateTokens(compressed);

    this.stats = {
      original: originalTokens,
      compressed: compressedTokens,
      saved: originalTokens - compressedTokens,
      percentage: ((originalTokens - compressedTokens) / originalTokens) * 100,
    };
  }

  decompress(): void {
    if (!this.outputCode.trim()) {
      alert('No hay código comprimido para descomprimir');
      return;
    }

    let decompressed = '';
    switch (this.selectedLanguage) {
      case 'typescript':
        decompressed = this.decompressTypeScript(this.outputCode);
        break;
      case 'html':
        decompressed = this.decompressHTML(this.outputCode);
        break;
      case 'css':
        decompressed = this.decompressCSS(this.outputCode);
        break;
      case 'json':
        decompressed = this.decompressJSON(this.outputCode);
        break;
    }

    this.inputCode = decompressed;
    this.stats = null;
  }

  // ============= TYPESCRIPT COMPRESSION =============
  private compressTypeScript(code: string): string {
    let compressed = code;

    // Remover comentarios pero mantener estructura
    compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, '');
    compressed = compressed.replace(/\/\/.*/g, '');

    // Comprimir espacios múltiples a uno solo
    compressed = compressed.replace(/[ \t]+/g, ' ');

    // Remover líneas vacías múltiples, dejar solo una
    compressed = compressed.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Comprimir declaraciones de tipos largos
    compressed = compressed.replace(/:\s*{\s*/g, ':{');
    compressed = compressed.replace(/\s*}\s*;/g, '};');

    // Comprimir arrays y objetos
    compressed = compressed.replace(/\[\s+/g, '[');
    compressed = compressed.replace(/\s+\]/g, ']');
    compressed = compressed.replace(/{\s+/g, '{');
    compressed = compressed.replace(/\s+}/g, '}');

    // Comprimir operadores pero mantener legibilidad
    compressed = compressed.replace(/\s*=>\s*/g, '=>');
    compressed = compressed.replace(/\s*:\s*/g, ':');
    compressed = compressed.replace(/\s*,\s*/g, ',');

    return compressed.trim();
  }

  private decompressTypeScript(code: string): string {
    let decompressed = code;

    // Restaurar espacios en objetos e interfaces
    decompressed = decompressed.replace(/:{/g, ': {\n  ');
    decompressed = decompressed.replace(/};/g, '\n};\n');

    // Restaurar espacios en arrays
    decompressed = decompressed.replace(/\[(?=[^\s])/g, '[ ');
    decompressed = decompressed.replace(/(?<=[^\s])\]/g, ' ]');

    // Restaurar espacios en funciones flecha
    decompressed = decompressed.replace(/=>/g, ' => ');

    // Restaurar espacios después de comas
    decompressed = decompressed.replace(/,(?=[^\s])/g, ', ');

    // Restaurar indentación básica
    const lines = decompressed.split('\n');
    let indent = 0;
    const indented = lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed.includes('}')) indent = Math.max(0, indent - 1);
      const result = '  '.repeat(indent) + trimmed;
      if (trimmed.includes('{') && !trimmed.includes('}')) indent++;
      return result;
    });

    return indented.join('\n');
  }

  // ============= HTML COMPRESSION =============
  private compressHTML(code: string): string {
    let compressed = code;

    // Remover comentarios HTML
    compressed = compressed.replace(/<!--[\s\S]*?-->/g, '');

    // Comprimir espacios entre tags
    compressed = compressed.replace(/>\s+</g, '><');

    // Comprimir espacios múltiples en atributos
    compressed = compressed.replace(/\s{2,}/g, ' ');

    // Comprimir atributos
    compressed = compressed.replace(/\s*=\s*"/g, '="');
    compressed = compressed.replace(/"\s+/g, '" ');

    // Mantener saltos de línea en tags de bloque importantes
    compressed = compressed.replace(
      /(<div|<section|<article|<header|<footer|<main)/g,
      '\n$1'
    );
    compressed = compressed.replace(
      /(<\/div>|<\/section>|<\/article>|<\/header>|<\/footer>|<\/main>)/g,
      '$1\n'
    );

    return compressed.trim();
  }

  private decompressHTML(code: string): string {
    let decompressed = code;

    // Agregar saltos de línea después de tags de apertura de bloque
    decompressed = decompressed.replace(
      /(<div[^>]*>|<section[^>]*>|<article[^>]*>|<header[^>]*>|<footer[^>]*>|<main[^>]*>)/g,
      '$1\n  '
    );

    // Agregar saltos de línea antes de tags de cierre de bloque
    decompressed = decompressed.replace(
      /(<\/div>|<\/section>|<\/article>|<\/header>|<\/footer>|<\/main>)/g,
      '\n$1'
    );

    // Agregar indentación básica
    const lines = decompressed.split('\n');
    let indent = 0;
    const indented = lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1);
      const result = '  '.repeat(indent) + trimmed;
      if (
        trimmed.startsWith('<') &&
        !trimmed.startsWith('</') &&
        !trimmed.endsWith('/>') &&
        !trimmed.includes('</')
      ) {
        indent++;
      }
      return result;
    });

    return indented.join('\n');
  }

  // ============= CSS COMPRESSION =============
  private compressCSS(code: string): string {
    let compressed = code;

    // Remover comentarios CSS
    compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, '');

    // Comprimir espacios alrededor de llaves y dos puntos
    compressed = compressed.replace(/\s*{\s*/g, '{');
    compressed = compressed.replace(/\s*}\s*/g, '}');
    compressed = compressed.replace(/\s*:\s*/g, ':');
    compressed = compressed.replace(/\s*;\s*/g, ';');

    // Comprimir espacios múltiples
    compressed = compressed.replace(/\s{2,}/g, ' ');

    // Mantener un salto de línea entre reglas
    compressed = compressed.replace(/}(?!\s*$)/g, '}\n');

    return compressed.trim();
  }

  private decompressCSS(code: string): string {
    let decompressed = code;

    // Agregar espacios y saltos de línea
    decompressed = decompressed.replace(/{/g, ' {\n  ');
    decompressed = decompressed.replace(/}/g, '\n}\n');
    decompressed = decompressed.replace(/;(?!$)/g, ';\n  ');
    decompressed = decompressed.replace(/:/g, ': ');

    // Limpiar líneas vacías múltiples
    decompressed = decompressed.replace(/\n{3,}/g, '\n\n');

    return decompressed.trim();
  }

  // ============= JSON COMPRESSION =============
  private compressJSON(code: string): string {
    try {
      const parsed = JSON.parse(code);
      // Compacto pero con saltos de línea en arrays de objetos
      return JSON.stringify(parsed, null, 0)
        .replace(/\[{/g, '[\n{')
        .replace(/}\]/g, '}\n]')
        .replace(/},{/g, '},\n{');
    } catch {
      return code;
    }
  }

  private decompressJSON(code: string): string {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return code;
    }
  }

  // ============= UTILITIES =============
  private estimateTokens(text: string): number {
    // Estimación aproximada: 1 token ≈ 4 caracteres para código
    return Math.ceil(text.length / 4);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('¡Copiado al portapapeles!');
    });
  }

  swapInputOutput(): void {
    const temp = this.inputCode;
    this.inputCode = this.outputCode;
    this.outputCode = temp;
  }

  clear(): void {
    this.inputCode = '';
    this.outputCode = '';
    this.stats = null;
  }

  loadExample(): void {
    const examples = {
      typescript: `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Component for user profile management
 * Handles form validation and data submission
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    // Initialize form with validators
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.min(18), Validators.max(120)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.profileForm.valid) {
      console.log('Form data:', this.profileForm.value);
      // Process form submission
    }
  }
}`,
      html: `<!-- User Profile Component Template -->
<div class="container">
  <header class="page-header">
    <h1>Perfil de Usuario</h1>
    <p class="subtitle">Actualiza tu información personal</p>
  </header>

  <section class="form-section">
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="firstName">Nombre</label>
        <input 
          type="text" 
          id="firstName" 
          formControlName="firstName"
          class="form-control"
          placeholder="Ingresa tu nombre"
        />
        <div class="error" *ngIf="submitted && profileForm.get('firstName')?.errors">
          El nombre es requerido
        </div>
      </div>

      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          formControlName="email"
          class="form-control"
        />
      </div>

      <button type="submit" class="btn btn-primary">Guardar Cambios</button>
    </form>
  </section>
</div>`,
      css: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
}

/* Header styles */
.page-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 15px;
}

.page-header h1 {
  font-size: 32px;
  color: #333333;
  margin-bottom: 10px;
  font-weight: 700;
}

.subtitle {
  font-size: 16px;
  color: #666666;
  margin: 0;
}

/* Form styles */
.form-section {
  background: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}`,
      json: `{
  "users": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "admin",
      "active": true,
      "permissions": ["read", "write", "delete"]
    },
    {
      "id": 2,
      "name": "María García",
      "email": "maria@example.com",
      "role": "user",
      "active": true,
      "permissions": ["read", "write"]
    }
  ],
  "settings": {
    "theme": "dark",
    "language": "es",
    "notifications": {
      "email": true,
      "push": false,
      "sms": false
    }
  }
}`,
    };

    this.inputCode = examples[this.selectedLanguage];
  }
}
