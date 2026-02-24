"use client";

import { useState } from "react";

interface TraineeInfo {
  name: string;
  registrationNumber: string;
  className: string;
}

interface TraineeInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: TraineeInfo) => void;
  title: string;
}

export function TraineeInfoDialog({ isOpen, onClose, onSubmit, title }: TraineeInfoDialogProps) {
  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [className, setClassName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && registrationNumber.trim() && className.trim()) {
      onSubmit({ name: name.trim(), registrationNumber: registrationNumber.trim(), className: className.trim() });
      setName("");
      setRegistrationNumber("");
      setClassName("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Trainee Information</h2>
        <p className="text-gray-600 mb-4">
          Please enter your details before generating the report for <strong>{title}</strong>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Trainee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="regNumber"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter your registration number"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
              Class <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter your class"
              required
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
