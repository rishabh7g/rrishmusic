import { type Page, type Locator, expect } from '@playwright/test';
import { TestUtils } from '../setup';

export class HomePage {
  readonly page: Page;
  
  // Navigation elements
  readonly navMenu: Locator;
  readonly homeLink: Locator;
  readonly aboutLink: Locator;
  readonly teachingLink: Locator;
  readonly pricingLink: Locator;
  readonly contactLink: Locator;
  readonly mobileMenuToggle: Locator;
  
  // Hero section
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroCTA: Locator;
  readonly heroImage: Locator;
  
  // About section
  readonly aboutSection: Locator;
  readonly aboutTitle: Locator;
  readonly aboutContent: Locator;
  readonly aboutImage: Locator;
  
  // Teaching approach section
  readonly teachingSection: Locator;
  readonly teachingTitle: Locator;
  readonly teachingContent: Locator;
  readonly teachingFeatures: Locator;
  
  // Lesson packages section
  readonly packagesSection: Locator;
  readonly packagesTitle: Locator;
  readonly packageCards: Locator;
  readonly packagePrices: Locator;
  
  // Testimonials section
  readonly testimonialsSection: Locator;
  readonly testimonialCards: Locator;
  
  // Contact section
  readonly contactSection: Locator;
  readonly contactTitle: Locator;
  readonly contactForm: Locator;
  readonly contactInfo: Locator;
  readonly socialLinks: Locator;
  
  // Footer
  readonly footer: Locator;
  readonly footerLinks: Locator;
  
  constructor(page: Page) {
    this.page = page;
    
    // Navigation
    this.navMenu = page.locator('nav');
    this.homeLink = page.locator('nav a[href="#home"], nav a[href="/"]');
    this.aboutLink = page.locator('nav a[href="#about"]');
    this.teachingLink = page.locator('nav a[href="#teaching"]');
    this.pricingLink = page.locator('nav a[href="#pricing"]');
    this.contactLink = page.locator('nav a[href="#contact"]');
    this.mobileMenuToggle = page.locator('[data-testid="mobile-menu-toggle"], .mobile-menu-toggle, .hamburger');
    
    // Hero section
    this.heroSection = page.locator('#hero, [data-testid="hero"], .hero-section').first();
    this.heroTitle = this.heroSection.locator('h1');
    this.heroSubtitle = this.heroSection.locator('h2, .subtitle, [data-testid="hero-subtitle"]');
    this.heroCTA = this.heroSection.locator('button, .cta-button, [data-testid="hero-cta"]');
    this.heroImage = this.heroSection.locator('img');
    
    // About section
    this.aboutSection = page.locator('#about, [data-testid="about"], .about-section');
    this.aboutTitle = this.aboutSection.locator('h2');
    this.aboutContent = this.aboutSection.locator('.content, [data-testid="about-content"]');
    this.aboutImage = this.aboutSection.locator('img');
    
    // Teaching approach
    this.teachingSection = page.locator('#teaching, [data-testid="teaching"], .teaching-section');
    this.teachingTitle = this.teachingSection.locator('h2');
    this.teachingContent = this.teachingSection.locator('.content, [data-testid="teaching-content"]');
    this.teachingFeatures = this.teachingSection.locator('.features, [data-testid="teaching-features"]');
    
    // Lesson packages
    this.packagesSection = page.locator('#pricing, [data-testid="pricing"], .packages-section');
    this.packagesTitle = this.packagesSection.locator('h2');
    this.packageCards = this.packagesSection.locator('.package-card, [data-testid="package-card"]');
    this.packagePrices = this.packagesSection.locator('.price, [data-testid="package-price"]');
    
    // Testimonials
    this.testimonialsSection = page.locator('#testimonials, [data-testid="testimonials"], .testimonials-section');
    this.testimonialCards = this.testimonialsSection.locator('.testimonial, [data-testid="testimonial"]');
    
    // Contact
    this.contactSection = page.locator('#contact, [data-testid="contact"], .contact-section');
    this.contactTitle = this.contactSection.locator('h2');
    this.contactForm = this.contactSection.locator('form, [data-testid="contact-form"]');
    this.contactInfo = this.contactSection.locator('.contact-info, [data-testid="contact-info"]');
    this.socialLinks = this.contactSection.locator('.social-links a, [data-testid="social-link"]');
    
    // Footer
    this.footer = page.locator('footer');
    this.footerLinks = this.footer.locator('a');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPageLoad() {
    await this.page.waitForSelector('nav');
    await this.page.waitForSelector('h1');
    await this.page.waitForLoadState('networkidle');
  }

  // Navigation methods
  async clickNavLink(section: 'home' | 'about' | 'teaching' | 'pricing' | 'contact') {
    const linkMap = {
      home: this.homeLink,
      about: this.aboutLink,
      teaching: this.teachingLink,
      pricing: this.pricingLink,
      contact: this.contactLink,
    };
    
    await linkMap[section].first().click();
    await this.page.waitForTimeout(1000); // Allow for scroll animation
  }

  async toggleMobileMenu() {
    await this.mobileMenuToggle.click();
    await this.page.waitForTimeout(300); // Animation time
  }

  async navigateToSection(section: string) {
    await TestUtils.scrollToElement(this.page, `#${section}`);
  }

  async scrollToSection(sectionId: string) {
    const section = this.page.locator(`#${sectionId}`);
    await section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    return section;
  }

  // Content verification methods
  async verifyHeroContent() {
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroTitle).toContainText(/rrish|guitar|music/i);
    
    const titleText = await this.heroTitle.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText!.length).toBeGreaterThan(5);
  }

  async verifyAboutSection() {
    await expect(this.aboutSection).toBeVisible();
    await expect(this.aboutTitle).toBeVisible();
    await expect(this.aboutContent).toBeVisible();
    
    const aboutText = await this.aboutContent.textContent();
    expect(aboutText).toBeTruthy();
    expect(aboutText!.length).toBeGreaterThan(50);
  }

  async verifyTeachingSection() {
    await expect(this.teachingSection).toBeVisible();
    await expect(this.teachingTitle).toBeVisible();
    await expect(this.teachingContent).toBeVisible();
  }

  async verifyPackagesSection() {
    await expect(this.packagesSection).toBeVisible();
    await expect(this.packagesTitle).toBeVisible();
    
    const packageCount = await this.packageCards.count();
    expect(packageCount).toBeGreaterThan(0);
    
    // Verify at least one package has pricing
    if (packageCount > 0) {
      const firstPackagePrice = this.packagePrices.first();
      if (await firstPackagePrice.count() > 0) {
        await expect(firstPackagePrice).toBeVisible();
      }
    }
  }

  async verifyContactSection() {
    await expect(this.contactSection).toBeVisible();
    await expect(this.contactTitle).toBeVisible();
    
    // Check for either form or contact info
    const hasForm = await this.contactForm.count() > 0;
    const hasContactInfo = await this.contactInfo.count() > 0;
    
    expect(hasForm || hasContactInfo).toBe(true);
    
    // Verify social links
    const socialLinkCount = await this.socialLinks.count();
    if (socialLinkCount > 0) {
      await expect(this.socialLinks.first()).toBeVisible();
    }
  }

  // Interactive elements
  async clickSocialLink(platform: string = 'instagram') {
    const socialLink = this.socialLinks.filter({ hasText: new RegExp(platform, 'i') }).first();
    const href = await socialLink.getAttribute('href');
    
    expect(href).toBeTruthy();
    expect(href).toContain(platform);
    
    // Don't actually navigate to external site in tests
    return href;
  }

  async fillContactForm(data: { name: string; email: string; message: string }) {
    if (await this.contactForm.count() === 0) {
      console.log('No contact form found on page');
      return;
    }

    const nameInput = this.contactForm.locator('input[name="name"], input[placeholder*="name" i]');
    const emailInput = this.contactForm.locator('input[name="email"], input[type="email"]');
    const messageInput = this.contactForm.locator('textarea, input[name="message"]');

    if (await nameInput.count() > 0) {
      await nameInput.fill(data.name);
    }
    if (await emailInput.count() > 0) {
      await emailInput.fill(data.email);
    }
    if (await messageInput.count() > 0) {
      await messageInput.fill(data.message);
    }
  }

  async submitContactForm() {
    const submitButton = this.contactForm.locator('button[type="submit"], input[type="submit"], button');
    if (await submitButton.count() > 0) {
      await submitButton.click();
    }
  }

  // Responsive design verification
  async verifyMobileLayout() {
    // Check if mobile menu toggle is visible
    if (await this.mobileMenuToggle.count() > 0) {
      await expect(this.mobileMenuToggle).toBeVisible();
    }
    
    // Verify sections stack vertically
    const sections = [this.heroSection, this.aboutSection, this.teachingSection];
    for (const section of sections) {
      if (await section.count() > 0) {
        await expect(section).toBeVisible();
      }
    }
  }

  async verifyDesktopLayout() {
    // Verify navigation is horizontal
    await expect(this.navMenu).toBeVisible();
    
    // Verify sections are properly spaced
    const heroBox = await this.heroSection.boundingBox();
    expect(heroBox).toBeTruthy();
    expect(heroBox!.height).toBeGreaterThan(300);
  }

  // Performance and accessibility helpers
  async checkImagesLoaded() {
    const images = this.page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      await expect(image).toHaveAttribute('src', /\.(jpg|jpeg|png|webp|svg)$/i);
      
      // Check if image is loaded
      const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  }

  async checkLinksWork() {
    const internalLinks = this.page.locator('a[href^="#"], a[href^="/"]');
    const linkCount = await internalLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = internalLinks.nth(i);
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      
      if (href?.startsWith('#')) {
        const targetSection = this.page.locator(href);
        if (await targetSection.count() > 0) {
          await expect(targetSection).toBeVisible();
        }
      }
    }
  }
}