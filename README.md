# 🛡️ AssetFlow - Personal Net Worth & Asset Tracking App

A modern, fast, private, and responsive web application to track and overview your complete financial position in one place. Accessible from any modern browser on desktop, tablet, or mobile.

Live URL (once deployed to GitHub Pages): **`https://zapy2343.github.io/Myapp/`**

---

## ✨ Features

- 🏛️ **Bank & Cash Accounts**: Track multiple checking and operational balances with instant inline editing.
- 🐖 **Savings Accounts**: High-Yield Savings Accounts (HYSA), emergency reserves, and fixed deposits.
- 🪙 **Gold & Precious Metals**:
  - Live valuation calculator for gold holdings.
  - Supports weight in **Grams (g)**, **Tolas** (~11.66g), and **Troy Ounces (oz)**.
  - Carat purity factors: **24K**, **22K**, **18K**, and **14K**.
  - Update today's market rate per unit anytime to instantly calculate total gold worth.
- 📈 **Shares & Stocks**:
  - Record stock portfolio and share accounts.
  - Optional invested capital tracking to automatically calculate unrealized gains / losses.
- ➕ **Custom Sections**:
  - Add unlimited new categories (e.g. *Real Estate*, *Crypto*, *Retirement / 401(k)*, *Vehicles*, *Cash in Hand*).
  - Customizable icons and color themes.
- 📊 **Visual Allocation**: Real-time multi-color asset distribution bar and category percentage pills.
- 📸 **Net Worth Snapshots**: Save historical milestones to track your net worth growth over time.
- 👁️ **Privacy Mode**: One-click eye toggle to mask all balances with asterisks when viewing in public.
- 💱 **Multi-Currency Support**: Switch between USD (`$`), NPR (`रू`), INR (`₹`), EUR (`€`), GBP (`£`), AUD (`A$`), and CAD (`C$`).
- 🔒 **100% Private & Local-First**: All data is stored in your browser's `localStorage`. No external servers or third parties ever access your numbers.
- 💾 **Backup & Restore**: Easily download a full JSON backup, restore from file, or export to CSV spreadsheet.

---

## 🚀 One-Click GitHub Pages Setup

1. In your GitHub repository: go to **Settings** > **Pages**
2. Under **Build and deployment** > **Source**, select **GitHub Actions**
3. On every push to `main`, GitHub Actions will automatically build and deploy your app to:
   ```
   https://zapy2343.github.io/Myapp/
   ```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📱 Mobile Access (Add to Home Screen)

Open the live URL on your mobile browser (Safari on iOS or Chrome on Android) and tap **"Add to Home Screen"** to use AssetFlow as a full-screen native-like app!
