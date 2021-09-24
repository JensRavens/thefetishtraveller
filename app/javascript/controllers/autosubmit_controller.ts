import { Controller } from 'stimulus';

export default class extends Controller {
  connect(): void {
    console.log('connect', this.element);
    this.element.addEventListener('input', this.onChange);
  }

  disconnect(): void {
    this.element.removeEventListener('input', this.onChange);
  }

  private onChange(event: InputEvent): void {
    (event.target as HTMLInputElement).form.requestSubmit();
  }
}
