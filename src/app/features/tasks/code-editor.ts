import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnChanges,
  OnDestroy,
  output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import type * as Monaco from 'monaco-editor';

@Component({
  selector: 'app-code-editor',
  template: `
    <div class="editor-shell">
      @if (solutionClassLabel() || methodSignature()) {
        <div class="signature-bar" aria-label="Solution signature">
          @if (solutionClassLabel()) {
            <span class="signature-class">{{ solutionClassLabel() }}</span>
          }
          @if (methodSignature()) {
            <span class="signature-method">{{ methodSignature() }}</span>
          }
        </div>
      }
      <div class="editor-host" #editorHost></div>
    </div>
  `,
  styles: `
    .editor-shell {
      width: 100%;
      overflow: hidden;
      border: 1px solid #cfd6e1;
      border-radius: 8px;
      background: #1e1e1e;
    }

    .signature-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      min-height: 44px;
      padding: 10px 14px;
      border-bottom: 1px solid #343434;
      background: #1e1e1e;
      font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
      font-size: 0.9rem;
      font-weight: 700;
      line-height: 1.45;
    }

    .signature-class {
      color: #7db8ff;
    }

    .signature-method {
      color: #7ee2a8;
    }

    .editor-host {
      width: 100%;
      height: 580px;
      min-height: 320px;
    }
  `,
})
export class CodeEditor implements AfterViewInit, OnChanges, OnDestroy {
  readonly value = input('');
  readonly disabled = input(false);
  readonly solutionClassLabel = input('');
  readonly methodSignature = input('');
  readonly valueChange = output<string>();

  @ViewChild('editorHost', { static: true })
  private readonly editorHost?: ElementRef<HTMLElement>;

  private editor?: Monaco.editor.IStandaloneCodeEditor;

  ngAfterViewInit(): void {
    void this.createEditor();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.editor) {
      return;
    }

    if (this.editor.getValue() !== this.value()) {
      this.editor.setValue(this.value());
    }

    this.editor.updateOptions({
      readOnly: this.disabled(),
    });
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
  }

  private async createEditor(): Promise<void> {
    const host = this.editorHost?.nativeElement;

    if (!host) {
      return;
    }

    const monaco = await import('monaco-editor/esm/vs/editor/editor.api.js');

    const editor = monaco.editor.create(host, {
      automaticLayout: true,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
      fontSize: 14,
      language: 'java',
      minimap: {
        enabled: false,
      },
      readOnly: this.disabled(),
      scrollBeyondLastLine: false,
      theme: 'vs-dark',
      value: this.value(),
    });
    this.editor = editor;

    editor.onDidChangeModelContent(() => {
      this.valueChange.emit(editor.getValue());
    });
  }
}
