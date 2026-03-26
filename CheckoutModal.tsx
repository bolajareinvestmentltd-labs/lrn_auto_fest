// Updated CheckoutModal.tsx

import React from 'react';

export interface TicketTier {
    name: string;
    prices: {
        [key: string]: {
            single: number;
            group2: number;
            group4: number;
        };
    };
}

export const ticketTiers: TicketTier[] = [
    {
        name: 'Regular',
        prices: {
            'Presale': { single: 3000, group2: 6000, group4: 12000 },
            'On-sale': { single: 5000, group2: 10000, group4: 20000 },
        },
    },
    {
        name: 'Bronze VIP',
        prices: {
            'Presale': { single: 7500, group2: 14000, group4: 27000 },
            'On-sale': { single: 9000, group2: 17000, group4: 33000 },
        },
    },
    {
        name: 'Silver VIP',
        prices: {
            'Presale': { single: 21000, group2: 40000, group4: 78000 },
            'On-sale': { single: 25000, group2: 48000, group4: 92000 },
        },
    },
    {
        name: 'Gold VIP',
        prices: {
            'Presale': { single: 32000, group2: 60000, group4: 128000 },
            'On-sale': { single: 38000, group2: 72000, group4: 152000 },
        },
    },
    {
        name: 'Diamond VIP',
        prices: {
            'Presale': { single: 55000, group2: 105000, group4: 220000 },
            'On-sale': { single: 60000, group2: 115000, group4: 240000 },
        },
    },
];

const CheckoutModal: React.FC = () => {
    // Pricing logic using the ticketTiers

    return (
        <div>
            <h1>Checkout</h1>
            {/* Additional modal content goes here */}
        </div>
    );
};

export default CheckoutModal;