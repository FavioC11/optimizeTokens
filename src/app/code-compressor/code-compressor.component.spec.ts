import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeCompressorComponent } from './code-compressor.component';

describe('CodeCompressorComponent', () => {
  let component: CodeCompressorComponent;
  let fixture: ComponentFixture<CodeCompressorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeCompressorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeCompressorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
