import React, { useState } from 'react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateCardNumber, validateExpiryDate, validateCVV, validateName } from '../utils/validation';
import type { PaymentMethod } from '../types';

interface PaymentFormProps {
    onSubmit: (paymentData: PaymentMethod) => void;
    submitButtonText: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, submitButtonText }) => {
    const { user } = useAuth();

    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues: {
            cardNumber: user?.paymentMethod?.cardNumber || '',
            expiryDate: user?.paymentMethod?.expiryDate || '',
            cvv: '', // CVV should not be pre-filled
            nameOnCard: user?.paymentMethod?.nameOnCard || user?.name || '',
            billingAddress: user?.paymentMethod?.billingAddress || '',
            zipCode: user?.paymentMethod?.zipCode || '',
        },
        validationRules: {
            cardNumber: validateCardNumber,
            expiryDate: validateExpiryDate,
            cvv: validateCVV,
            nameOnCard: validateName,
            billingAddress: val => !val.trim() ? "Billing address is required." : null,
            zipCode: val => !val.trim() ? "ZIP code is required." : null,
        },
        onSubmit: async (formValues) => {
            await onSubmit(formValues);
        }
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
                <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-300">Name on Card</label>
                <input type="text" id="nameOnCard" name="nameOnCard" value={values.nameOnCard} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.nameOnCard ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                {errors.nameOnCard && <p className="text-red-400 text-xs mt-1">{errors.nameOnCard}</p>}
            </div>
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" value={values.cardNumber} onChange={handleChange} placeholder="**** **** **** ****" required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300">Expiry Date</label>
                    <input type="text" id="expiryDate" name="expiryDate" value={values.expiryDate} onChange={handleChange} placeholder="MM/YY" required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                    {errors.expiryDate && <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-300">CVV</label>
                    <input type="text" id="cvv" name="cvv" value={values.cvv} onChange={handleChange} placeholder="123" required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                    {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-300">Billing Address</label>
                <input type="text" id="billingAddress" name="billingAddress" value={values.billingAddress} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.billingAddress ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                {errors.billingAddress && <p className="text-red-400 text-xs mt-1">{errors.billingAddress}</p>}
            </div>
            <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300">ZIP Code</label>
                <input type="text" id="zipCode" name="zipCode" value={values.zipCode} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.zipCode ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                {errors.zipCode && <p className="text-red-400 text-xs mt-1">{errors.zipCode}</p>}
            </div>
            <div className="pt-4">
                <Button type="submit" className="w-full text-lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : submitButtonText}
                </Button>
            </div>
        </form>
    );
};

export default PaymentForm;
