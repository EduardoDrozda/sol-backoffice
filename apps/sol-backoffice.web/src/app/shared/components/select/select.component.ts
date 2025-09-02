import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'sol-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Selecione uma opção';
  @Input() disabled = false;
  @Input() error = false;
  @Input() required = false;
  @Input() label?: string;
  @Input() id?: string;
  @Input() icon?: string;

  @Output() selectionChange = new EventEmitter<SelectOption>();

  value: string | number | null = null;

  private onChange = (value: string | number | null) => {
    // ControlValueAccessor onChange implementation
  };
  private onTouched = () => {
    // ControlValueAccessor onTouched implementation
  };

  writeValue(value: string | number | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    if (selectedValue === '') {
      this.value = null;
      this.onChange(null);
      this.selectionChange.emit({ value: '', label: '', disabled: false });
    } else {
      const selectedOption = this.options.find(option => this.isValueEqual(option.value, selectedValue));
      if (selectedOption) {
        this.value = selectedOption.value;
        this.onChange(selectedOption.value);
        this.selectionChange.emit(selectedOption);
      }
    }
    this.onTouched();
  }

  onFocus(): void {
    // Método para compatibilidade com ControlValueAccessor
  }

  onBlur(): void {
    this.onTouched();
  }

  isValueEqual(optionValue: string | number, currentValue: string | number | null): boolean {
    return String(optionValue) === String(currentValue);
  }
}
