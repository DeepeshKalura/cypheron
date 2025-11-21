# CryptoVault - Decentralized Data Marketplace

A blockchain-powered data marketplace built on Sui with zero-knowledge proofs, end-to-end encryption, and instant settlement.

## Features

- **Encrypted Data Trading**: Buy and sell encrypted datasets with AES-256 encryption
- **Zero-Knowledge Proofs**: Verify data authenticity without revealing contents
- **Sui Blockchain Integration**: Fast settlement on Sui testnet/mainnet
- **Distributed Storage**: Data stored via Walrus protocol
- **Seller Dashboard**: Manage datasets, track earnings, and monitor sales
- **Advanced Marketplace**: Search, filter, and discover datasets by category and price

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui with Cosmic Night theme
- **Blockchain**: Sui SDK (@mysten/sui.js)
- **Storage**: Walrus distributed storage
- **Encryption**: Seal protocol (AES-256)
- **Styling**: Tailwind CSS with custom Cosmic Night theme

## Getting Started

### Prerequisites

- Node.js 18+ (for Next.js environment)
- npm or yarn
- Sui wallet (e.g., Sui Wallet, Ethos Wallet)

### Installation

1. Clone this repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create `.env.local` file from `.env.example`:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Fill in your environment variables:
   - Sui RPC URL
   - Package ID (deploy your smart contracts first)
   - Walrus and Seal API keys
   - Other configuration

### Development

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Project Structure

\`\`\`
app/
├── page.tsx              # Homepage
├── marketplace/
│   └── page.tsx         # Marketplace browsing
├── upload/
│   └── page.tsx         # Data upload wizard
├── dashboard/
│   └── page.tsx         # Seller dashboard
├── api/
│   ├── datasets/        # Dataset CRUD endpoints
│   ├── transactions/    # Purchase transaction handling
│   ├── wallet/         # Wallet connection
│   ├── encrypt/        # Data encryption
│   └── zk-verify/      # Zero-knowledge verification
└── layout.tsx          # Root layout with metadata

components/
├── navigation.tsx       # Header navigation
├── dataset-card.tsx     # Dataset card component
├── marketplace-filters.tsx  # Marketplace filters
├── upload-steps.tsx     # Upload wizard steps
└── dashboard-stats.tsx  # Dashboard statistics
\`\`\`

## API Routes

- `GET /api/datasets` - List all datasets with filters
- `POST /api/datasets` - Create new dataset listing
- `GET /api/datasets/[id]` - Get dataset details
- `PUT /api/datasets/[id]` - Update dataset
- `DELETE /api/datasets/[id]` - Delete dataset
- `POST /api/transactions` - Process purchase transaction
- `POST /api/wallet` - Connect/verify wallet
- `POST /api/encrypt` - Encrypt dataset
- `POST /api/zk-verify` - Verify zero-knowledge proof

## Environment Variables

See `.env.example` for all required variables. Key variables:

- `NEXT_PUBLIC_RPC_URL` - Sui network RPC endpoint
- `NEXT_PUBLIC_PACKAGE_ID` - Your deployed smart contract package ID
- `WALRUS_API_KEY` - Walrus storage API key
- `SEAL_API_KEY` - Seal encryption API key

## Smart Contract Setup

To deploy your smart contracts to Sui:

1. Create Sui smart contracts for dataset management and transactions
2. Deploy to testnet/mainnet using Sui CLI
3. Update `NEXT_PUBLIC_PACKAGE_ID` with deployed package address
4. Update module name if different from `cryptovault`

## Features Overview

### Homepage
- Hero section with CTAs
- Feature highlights
- Statistics display
- Responsive navigation

### Marketplace
- Browse all available datasets
- Advanced filtering by category and price
- Sort by popularity, price, or rating
- Dataset cards with metadata

### Upload Portal
- Multi-step dataset upload wizard
- File encryption before upload
- Pricing and license configuration
- Dataset publication

### Seller Dashboard
- Overview statistics (earnings, sales, views)
- Manage your datasets
- Track earnings and payouts
- View recent activity

## Customization

### Theme
Edit `app/globals.css` to customize Cosmic Night colors:
- Primary (Emerald): `#10b981`
- Secondary (Indigo): `#6366f1`
- Accent (Cyan): `#06b6d4`
- Background: `#0f172a`
- Card: `#1e1b4b`

### Colors in globals.css
\`\`\`css
--primary: #10b981;        /* Emerald */
--secondary: #6366f1;      /* Indigo */
--accent: #06b6d4;         /* Cyan */
--background: #0f172a;     /* Deep Navy */
--card: #1e1b4b;           /* Deep Purple */
\`\`\`

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Security Considerations

- All data is encrypted before storage
- Private keys should never be exposed
- Use secure RPC endpoints in production
- Implement rate limiting on API routes
- Add authentication for sensitive endpoints
- Use HTTPS in production

## Future Enhancements

- [ ] Integrate actual Sui smart contracts
- [ ] Real database integration (Supabase/Neon)
- [ ] Multi-wallet support
- [ ] Payment processor integration
- [ ] Advanced analytics
- [ ] Community features (reviews, reputation)
- [ ] Data preview system
- [ ] Automated compliance checks

## License

MIT

## Support

For issues and questions, open a GitHub issue or contact the development team.

---

Built for hackathons and Web3 innovation. Let's decentralize data trading!
