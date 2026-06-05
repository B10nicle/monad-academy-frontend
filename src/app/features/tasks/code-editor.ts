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
  template: `<div class="editor-host" #editorHost></div>`,
  styles: `
    .editor-host {
      width: 100%;
      height: 320px;
      min-height: 280px;
      overflow: hidden;
      border: 1px solid #cfd6e1;
      border-radius: 8px;
      background: #1e1e1e;
    }
  `,
})
export class CodeEditor implements AfterViewInit, OnChanges, OnDestroy {
  readonly value = input('');
  readonly disabled = input(false);
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
