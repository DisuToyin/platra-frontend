import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react"; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] flex flex-col p-0 text-sm tracking-tighter`}>
        <div className="sticky top-0 bg-white rounded-t-2xl z-10 border-b border-b-gray-200">
          <div className="relative">
            <DialogHeader className="px-6 py-4 pr-12"> 
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
        
        <p className="px-6">
            {description && <DialogDescription>{description}</DialogDescription>}
        </p>
        
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};