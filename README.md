# Claude Weidner Portfolio Site

**Live Site:** [claudeweidner.com](https://claudeweidner.com)

A professional portfolio landing page for Claude Weidner's Break The Chains™ chronic illness management ecosystem.

## 🎯 Project Overview

This portfolio site serves as the central hub for:
- **SpoonSync™** - Chronic wellness companion app
- **MedTracker** - Medication tracking with spoon theory
- **SecureVault** - Password management tool
- **Break The Chains™ Book Series** - 14-book series on metabolic health
- **About Claude** - Recovery journey and mission
- **Contact Information** - Ways to connect

## 🎨 Design Features

- **Purple/Gold Gradient Branding** matching Break The Chains™
- **Dark Mode Toggle** with localStorage persistence
- **Glass Morphism Cards** for modern UI
- **Responsive Design** - Mobile-first approach
- **Smooth Scrolling** between sections
- **Accessibility Features** - WCAG compliant
- **Fast Loading** - Optimized performance

## 📁 Files

```
portfolio/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling with dark mode
├── script.js       # Interactive features & dark mode
└── README.md       # This file
```

## 🚀 Deployment Instructions

### Option 1: Netlify (Recommended)

1. **Create GitHub Repository:**
```powershell
cd "C:\Users\claud\OneDrive\Desktop\Claude Companies\Portfolio"
git init
git add .
git commit -m "Initial commit - Claude Weidner Portfolio"
git remote add origin https://github.com/cwinvestments/claudeweidner-portfolio.git
git push -u origin main
```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select `claudeweidner-portfolio` repository
   - Click "Deploy site"

3. **Configure Custom Domain:**
   - In Netlify dashboard → "Domain settings"
   - Click "Add custom domain"
   - Enter: `claudeweidner.com`
   - Follow DNS configuration instructions

### Option 2: GitHub Pages

1. Push to GitHub (same as above)
2. Go to repository Settings → Pages
3. Select main branch
4. Save and wait for deployment
5. Configure custom domain in settings

### DNS Configuration (GoDaddy)

1. Log in to GoDaddy account
2. Go to "My Products" → "DNS"
3. Find `claudeweidner.com`
4. Add/Edit records:

**For Netlify:**
```
Type: CNAME
Name: @
Value: [your-site-name].netlify.app
TTL: 1 Hour
```

```
Type: CNAME
Name: www
Value: [your-site-name].netlify.app
TTL: 1 Hour
```

**For GitHub Pages:**
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 1 Hour
```
(Add 3 more A records with values: 185.199.109.153, 185.199.110.153, 185.199.111.153)

5. Wait 24-48 hours for DNS propagation

## 🔄 Making Updates

After making changes to any file:

```powershell
cd "C:\Users\claud\OneDrive\Desktop\Claude Companies\Portfolio"
git add .
git commit -m "Description of changes"
git push origin main
```

Netlify will automatically redeploy within 1-2 minutes.

## ✨ Features Checklist

### Completed ✅
- [x] Responsive hero section
- [x] Apps showcase with 3 live apps + 3 coming soon
- [x] About section with recovery story
- [x] Book series section
- [x] Contact section with email & social links
- [x] Dark mode toggle with localStorage
- [x] Smooth scrolling navigation
- [x] Back-to-top button
- [x] Professional footer
- [x] Mobile-responsive design
- [x] Break The Chains™ branding consistency
- [x] Accessibility features
- [x] Fast loading optimization

### Future Enhancements 🔮
- [ ] Newsletter signup form
- [ ] Blog section integration
- [ ] Testimonials section
- [ ] Video introduction
- [ ] FAQ accordion
- [ ] Download press kit
- [ ] Social proof (user counts)
- [ ] Analytics integration

## 🎨 Brand Guidelines

### Colors
- **Purple:** #667eea, #764ba2, #7e22ce
- **Gold:** #FFD700, #FFA500
- **Success:** #10b981
- **Warning:** #fbbf24
- **Danger:** #ef4444

### Typography
- Font: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- Headings: 700 weight
- Body: 16-18px, 1.6 line-height

### Components
- Border Radius: 20px (cards), 50px (buttons)
- Shadows: 0 5px 20px rgba(0,0,0,0.08)
- Transitions: 0.3s ease

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader friendly
- Skip to content link
- Proper heading hierarchy
- Alt text for images (when added)

## 🔒 Legal & Credits

- **Copyright:** © 2025 Claude Weidner
- **Trademark:** Break The Chains™, SpoonSync™
- **Spoon Theory:** Created by Christine Miserandino
- **Amazon Affiliate ID:** breakthech0f4-20

## 📧 Contact

- **Email:** BreakTheChainsMetabolicHealth@gmail.com
- **Facebook:** [@BreakTheChainsNutrition](https://www.facebook.com/BreakTheChainsNutrition)
- **Instagram:** [@BreakTheChainsWarriors](https://www.instagram.com/BreakTheChainsWarriors)
- **TikTok:** [@BreakTheChainsWarriors](https://www.tiktok.com/@BreakTheChainsWarriors)

## 📝 Notes

- All crisis resources remain free (ethical requirement)
- Not medical advice - tools complement healthcare
- Health transformation advocate perspective
- Lived experience, not medical professional
- Emphasis on energy-conscious design

---

**Built with ❤️ for chronic illness warriors**

*"Break the chains of chronic illness through metabolic health"*
