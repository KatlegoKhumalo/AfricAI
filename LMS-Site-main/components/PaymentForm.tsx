import React, { useState } from 'react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

interface PaymentFormProps {
    onSubmit: (paymentData: any) => void;
    submitButtonText: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, submitButtonText }) => {
    const { user } = useAuth();
    const [cardData, setCardData] = useState({
        cardNumber: user?.paymentMethod?.cardNumber || '',
        expiryDate: user?.paymentMethod?.expiryDate || '',
        cvv: user?.paymentMethod?.cvv || '',
        nameOnCard: user?.paymentMethod?.nameOnCard || user?.name || '',
        billingAddress: user?.paymentMethod?.billingAddress || '',
        zipCode: user?.paymentMethod?.zipCode || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally validate the data
        onSubmit(cardData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-300">Name on Card</label>
                <input type="text" id="nameOnCard" name="nameOnCard" value={cardData.nameOnCard} onChange={handleChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" value={cardData.cardNumber} onChange={handleChange} placeholder="**** **** **** ****" required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300">Expiry Date</label>
                    <input type="text" id="expiryDate" name="expiryDate" value={cardData.expiryDate} onChange={handleChange} placeholder="MM/YY" required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                </div>
                <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-300">CVV</label>
                    <input type="text" id="cvv" name="cvv" value={cardData.cvv} onChange={handleChange} placeholder="123" required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                </div>
            </div>
            <div>
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-300">Billing Address</label>
                <input type="text" id="billingAddress" name="billingAddress" value={cardData.billingAddress} onChange={handleChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
            <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300">ZIP Code</label>
                <input type="text" id="zipCode" name="zipCode" value={cardData.zipCode} onChange={handleChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
            {/* FIX: Removed unsupported <style jsx> tag and replaced with Tailwind classes */}
            <div className="pt-4">
                <Button type="submit" className="w-full text-lg">{submitButtonText}</Button>
            </div>
        </form>
    );
};

export default PaymentForm;