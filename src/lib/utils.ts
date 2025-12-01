import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}


export function commaSeparatedToArray(str: string): string[] {
  return str
    .split(',')
    .map(item => item.trim())
    .filter(item => item !== '');
}