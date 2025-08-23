#!/usr/bin/env node

/**
 * Content Update Script
 * 
 * This script helps manage content updates with validation.
 * Usage: node scripts/update-content.js [section] [action]
 * 
 * Examples:
 * - node scripts/update-content.js validate        # Validate all content
 * - node scripts/update-content.js backup         # Backup content files
 * - node scripts/update-content.js lessons price  # Update lesson prices interactively
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');
const BACKUP_DIR = path.join(__dirname, '..', 'backups', 'content');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function validateContent() {
  console.log('🔍 Validating content files...\n');
  
  const files = [
    'site-content.json',
    'lessons.json', 
    'testimonials.json'
  ];

  let allValid = true;

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`❌ ${file}: File not found`);
        allValid = false;
        continue;
      }

      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Basic validation
      if (file === 'site-content.json') {
        const required = ['hero', 'about', 'approach', 'community', 'contact', 'seo'];
        const missing = required.filter(key => !content[key]);
        if (missing.length > 0) {
          console.log(`❌ ${file}: Missing sections: ${missing.join(', ')}`);
          allValid = false;
        } else {
          console.log(`✅ ${file}: Valid structure`);
        }
      } else if (file === 'lessons.json') {
        if (!content.packages || !Array.isArray(content.packages)) {
          console.log(`❌ ${file}: Missing or invalid packages array`);
          allValid = false;
        } else {
          console.log(`✅ ${file}: ${content.packages.length} lesson packages found`);
        }
      } else if (file === 'testimonials.json') {
        if (!Array.isArray(content)) {
          console.log(`❌ ${file}: Should be an array`);
          allValid = false;
        } else {
          console.log(`✅ ${file}: ${content.length} testimonials found`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${file}: JSON parse error - ${error.message}`);
      allValid = false;
    }
  }

  console.log(`\n${allValid ? '🎉' : '⚠️ '} Validation ${allValid ? 'passed' : 'failed'}`);
  return allValid;
}

async function backupContent() {
  console.log('💾 Creating content backup...\n');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, timestamp);
  
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    const source = path.join(CONTENT_DIR, file);
    const dest = path.join(backupPath, file);
    fs.copyFileSync(source, dest);
    console.log(`✅ Backed up: ${file}`);
  }

  console.log(`\n🎉 Backup created at: ${backupPath}`);
  return backupPath;
}

async function updateLessonPrices() {
  console.log('💰 Updating lesson prices...\n');
  
  const lessonsPath = path.join(CONTENT_DIR, 'lessons.json');
  const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
  
  console.log('Current packages:');
  lessons.packages.forEach((pkg, index) => {
    console.log(`${index + 1}. ${pkg.name}: $${pkg.price} (${pkg.sessions} sessions)`);
  });
  
  const packageIndex = parseInt(await question('\nWhich package to update (number)? ')) - 1;
  
  if (packageIndex < 0 || packageIndex >= lessons.packages.length) {
    console.log('❌ Invalid package number');
    return;
  }

  const pkg = lessons.packages[packageIndex];
  const newPrice = parseFloat(await question(`Enter new price for "${pkg.name}" (current: $${pkg.price}): $`));
  
  if (isNaN(newPrice) || newPrice <= 0) {
    console.log('❌ Invalid price');
    return;
  }

  // Backup first
  await backupContent();
  
  pkg.price = newPrice;
  
  // Recalculate discount if applicable
  if (pkg.sessions > 1 && lessons.packages[0]) { // Assuming first package is single lesson
    const singlePrice = lessons.packages[0].price;
    const fullPrice = pkg.sessions * singlePrice;
    pkg.discount = Math.round(((fullPrice - newPrice) / fullPrice) * 100);
  }
  
  fs.writeFileSync(lessonsPath, JSON.stringify(lessons, null, 2));
  console.log(`✅ Updated "${pkg.name}" to $${newPrice}`);
  
  if (pkg.discount) {
    console.log(`   Discount: ${pkg.discount}%`);
  }
}

async function addTestimonial() {
  console.log('🗣️  Adding new testimonial...\n');
  
  const name = await question('Student name: ');
  const text = await question('Testimonial text: ');
  const instrument = await question('Instrument (Guitar/Piano/Harmonica/Other): ');
  const level = await question('Level (beginner/intermediate/advanced): ');
  const rating = parseInt(await question('Rating (1-5): '));
  
  if (rating < 1 || rating > 5) {
    console.log('❌ Rating must be between 1 and 5');
    return;
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  
  const testimonial = {
    id,
    name,
    text,
    rating,
    instrument: instrument || undefined,
    level: ['beginner', 'intermediate', 'advanced'].includes(level) ? level : 'beginner',
    featured: false
  };

  // Backup first
  await backupContent();
  
  const testimonialsPath = path.join(CONTENT_DIR, 'testimonials.json');
  const testimonials = JSON.parse(fs.readFileSync(testimonialsPath, 'utf8'));
  
  testimonials.push(testimonial);
  
  fs.writeFileSync(testimonialsPath, JSON.stringify(testimonials, null, 2));
  console.log(`✅ Added testimonial from ${name}`);
}

async function showUsage() {
  console.log(`
Content Management Script
========================

Usage: node scripts/update-content.js [command]

Commands:
  validate     - Validate all content files
  backup       - Create backup of content files  
  prices       - Update lesson prices interactively
  testimonial  - Add new testimonial
  help         - Show this help

Examples:
  node scripts/update-content.js validate
  node scripts/update-content.js backup
  node scripts/update-content.js prices
`);
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'validate':
      await validateContent();
      break;
    case 'backup':
      await backupContent();
      break;
    case 'prices':
      await updateLessonPrices();
      break;
    case 'testimonial':
      await addTestimonial();
      break;
    case 'help':
    case undefined:
      await showUsage();
      break;
    default:
      console.log(`❌ Unknown command: ${command}\n`);
      await showUsage();
  }

  rl.close();
}

main().catch(console.error);