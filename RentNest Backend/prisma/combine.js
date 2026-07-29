const fs = require('fs');
const path = require('path');

const schemasDir = path.join(__dirname, 'schemas');
const outputPath = path.join(__dirname, 'schema.prisma');

const files = [
  '_base.prisma',
  'user.prisma',
  'category.prisma',
  'property.prisma',
  'rental-request.prisma',
  'payment.prisma',
  'review.prisma',
];

let combined = '';

for (const file of files) {
  const filePath = path.join(schemasDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  combined += `// ===== ${file} =====\n\n${content}\n\n`;
}

fs.writeFileSync(outputPath, combined.trim() + '\n');
console.log('✅ schema.prisma combined from schemas/');
