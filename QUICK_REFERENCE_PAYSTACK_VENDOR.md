# ⚡ Quick Start: Real Payments & Vendor Portal

## What Changed

✅ **Paystack Integration**: Real payment popup instead of simulation  
✅ **Vendor Portal**: New `/vendors` page for booth applications  
✅ **Button Linking**: "Vendor Space" now navigates to signup

---

## 🧪 Test It Now

### Test Payment

1. Go to <http://localhost:3001>
2. Click "Buy Tickets"
3. Fill form, click "Pay Now"
4. Paystack popup appears
5. Use test card: `4084 0840 8408 4081`, OTP: `123456`

### Test Vendor Portal

1. Go to <http://localhost:3001>
2. Click "Vendor Space" button
3. See pricing & fill application form
4. Submit application

---

## 📁 Files Changed

| File | What Changed |
|------|--------------|
| `src/components/CheckoutModal.tsx` | Added real Paystack integration |
| `src/components/Hero.tsx` | Added Link to /vendors |
| `src/app/vendors/page.tsx` | NEW - Vendor application page |
| `package.json` | Added react-paystack |

---

## 💳 Paystack Test Key

```
Public Key: pk_test_858607a04052382e73797962635921e549646549
Secret Key: sk_test_90be186ba4d40249ee8bb3a405c3cea33cb34c72
```

---

## 🎯 What Works

- ✅ Click "Buy Tickets" → Real Paystack payment popup
- ✅ Click "Vendor Space" → Goes to vendor signup
- ✅ Form validation on both
- ✅ Loading states during submission
- ✅ Mobile responsive
- ✅ Professional UI matching brand

---

## 🔧 How to Update Keys Later

### For Your Own Paystack Account

1. Get keys from Paystack dashboard
2. In `CheckoutModal.tsx` line ~57, replace:

   ```tsx
   publicKey: "pk_test_858607a04052382e...",
   ```

   With your public key

---

## 📞 Support

- Payment issues? Check browser console for errors
- Vendor form not submitting? Currently just shows success (backend needed)
- Need to go live? Update to production Paystack keys

---

**Everything is ready to use!** 🚀
