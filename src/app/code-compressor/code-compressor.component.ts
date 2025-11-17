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
  styleUrl: './code-compressor.component.scss',
})
export class CodeCompressorComponent {
  inputCode: string = '';
  outputCode: string = '';
  selectedLanguage: 'typescript' | 'html' | 'css' | 'json' = 'typescript';
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

  private compressTypeScript(code: string): string {
    let c = code;
    c = c.replace(/\/\*[\s\S]*?\*\//g, '');
    c = c.replace(/\/\/.*/g, '');
    c = c.replace(/[ \t]+/g, ' ');
    c = c.replace(/\n\s*\n\s*\n/g, '\n\n');
    c = c.replace(/:\s*{\s*/g, ':{');
    c = c.replace(/\s*}\s*;/g, '};');
    c = c.replace(/\[\s+/g, '[');
    c = c.replace(/\s+\]/g, ']');
    c = c.replace(/{\s+/g, '{');
    c = c.replace(/\s+}/g, '}');
    c = c.replace(/\s*=>\s*/g, '=>');
    c = c.replace(/\s*:\s*/g, ':');
    c = c.replace(/\s*,\s*/g, ',');
    return c.trim();
  }

  private decompressTypeScript(code: string): string {
    let d = code;
    d = d.replace(/:{/g, ': {\n  ');
    d = d.replace(/};/g, '\n};\n');
    d = d.replace(/\[(?=[^\s])/g, '[ ');
    d = d.replace(/(?<=[^\s])\]/g, ' ]');
    d = d.replace(/=>/g, ' => ');
    d = d.replace(/,(?=[^\s])/g, ', ');
    const lines = d.split('\n');
    let indent = 0;
    const indented = lines.map((line) => {
      const t = line.trim();
      if (t.includes('}')) indent = Math.max(0, indent - 1);
      const r = '  '.repeat(indent) + t;
      if (t.includes('{') && !t.includes('}')) indent++;
      return r;
    });
    return indented.join('\n');
  }

  private compressHTML(code: string): string {
    let c = code;
    c = c.replace(/<!--[\s\S]*?-->/g, '');
    c = c.replace(/>\s+</g, '><');
    c = c.replace(/\s{2,}/g, ' ');
    c = c.replace(/\s*=\s*"/g, '="');
    c = c.replace(/"\s+/g, '" ');
    c = c.replace(/(<div|<section|<article|<header|<footer|<main)/g, '\n$1');
    c = c.replace(
      /(<\/div>|<\/section>|<\/article>|<\/header>|<\/footer>|<\/main>)/g,
      '$1\n'
    );
    return c.trim();
  }

  private decompressHTML(code: string): string {
    let d = code;
    d = d.replace(
      /(<div[^>]*>|<section[^>]*>|<article[^>]*>|<header[^>]*>|<footer[^>]*>|<main[^>]*>)/g,
      '$1\n  '
    );
    d = d.replace(
      /(<\/div>|<\/section>|<\/article>|<\/header>|<\/footer>|<\/main>)/g,
      '\n$1'
    );
    const lines = d.split('\n');
    let indent = 0;
    const indented = lines.map((line) => {
      const t = line.trim();
      if (t.startsWith('</')) indent = Math.max(0, indent - 1);
      const r = '  '.repeat(indent) + t;
      if (
        t.startsWith('<') &&
        !t.startsWith('</') &&
        !t.endsWith('/>') &&
        !t.includes('</')
      )
        indent++;
      return r;
    });
    return indented.join('\n');
  }

  private compressCSS(code: string): string {
    let c = code;
    c = c.replace(/\/\*[\s\S]*?\*\//g, '');
    c = c.replace(/\s*{\s*/g, '{');
    c = c.replace(/\s*}\s*/g, '}');
    c = c.replace(/\s*:\s*/g, ':');
    c = c.replace(/\s*;\s*/g, ';');
    c = c.replace(/\s{2,}/g, ' ');
    c = c.replace(/}(?!\s*$)/g, '}\n');
    return c.trim();
  }

  private decompressCSS(code: string): string {
    let d = code;
    d = d.replace(/{/g, ' {\n  ');
    d = d.replace(/}/g, '\n}\n');
    d = d.replace(/;(?!$)/g, ';\n  ');
    d = d.replace(/:/g, ': ');
    d = d.replace(/\n{3,}/g, '\n\n');
    return d.trim();
  }

  private compressJSON(code: string): string {
    try {
      const parsed = JSON.parse(code);
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

  // PUBLIC for template
  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('¡Copiado al portapapeles!');
    });
  }

  swapInputOutput(): void {
    [this.inputCode, this.outputCode] = [this.outputCode, this.inputCode];
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

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
}`,
      html: `<div class="container">
  <header class="page-header">
    <h1>Perfil de Usuario</h1>
  </header>
  <section class="form-section">
    <form [formGroup]="profileForm">
      <div class="form-group">
        <label>Nombre</label>
        <input type="text" formControlName="firstName" />
      </div>
      <button type="submit">Guardar</button>
    </form>
  </section>
</div>`,
      css: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
}

.form-group {
  margin-bottom: 20px;
}`,
      json: `{
  "users": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  ],
  "settings": {
    "theme": "dark",
    "language": "es"
  }
}`,
    };
    this.inputCode = examples[this.selectedLanguage];
  }
}
