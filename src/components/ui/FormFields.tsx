import React from 'react';
import { Search } from 'lucide-react';

const baseClasses = "bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-full";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text';
}

export function TextInput({ type = 'text', className = '', ...props }: TextInputProps) {
  return (
    <input
      type={type}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
}

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  placeholder?: string;
}

export function SelectInput({ options, placeholder, className = '', ...props }: SelectInputProps) {
  return (
    <select className={`${baseClasses} appearance-none ${className}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export function TextArea({ rows = 4, className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      rows={rows}
      className={`${baseClasses} resize-none ${className}`}
      {...props}
    />
  );
}

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'search';
}

export function SearchInput({ type = 'search', className = '', ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type={type}
        className={`${baseClasses} pl-10 ${className}`}
        {...props}
      />
    </div>
  );
}
