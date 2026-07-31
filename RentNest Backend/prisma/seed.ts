import 'dotenv/config';
import prisma from '../src/config/prisma';
import bcrypt from 'bcryptjs';
import { UserRole, RentalStatus, PaymentStatus, PaymentProvider } from '../src/generated/prisma/enums';

async function seed() {
  console.log('🚀 Starting Database Seed (30+ Data Records)...');

  // 1. Hash default password for test users
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 2. Create/Upsert Users (Rakibul - Admin, Toufik - Landlord, Tanvir - Tenant)
  console.log('👤 Seeding Users...');
  const rakibul = await prisma.user.upsert({
    where: { email: 'rakibul@rentnest.com' },
    update: {
      name: 'Rakibul Islam',
      role: UserRole.admin,
      phone: '+8801711112233',
    },
    create: {
      name: 'Rakibul Islam',
      email: 'rakibul@rentnest.com',
      password: hashedPassword,
      role: UserRole.admin,
      phone: '+8801711112233',
    },
  });

  const toufik = await prisma.user.upsert({
    where: { email: 'toufik@rentnest.com' },
    update: {
      name: 'Toufik Hossain',
      role: UserRole.landlord,
      phone: '+8801822223344',
    },
    create: {
      name: 'Toufik Hossain',
      email: 'toufik@rentnest.com',
      password: hashedPassword,
      role: UserRole.landlord,
      phone: '+8801822223344',
    },
  });

  const tanvir = await prisma.user.upsert({
    where: { email: 'tanvir@rentnest.com' },
    update: {
      name: 'Tanvir Ahmed',
      role: UserRole.tenant,
      phone: '+8801933334455',
    },
    create: {
      name: 'Tanvir Ahmed',
      email: 'tanvir@rentnest.com',
      password: hashedPassword,
      role: UserRole.tenant,
      phone: '+8801933334455',
    },
  });

  console.log('✅ Users created/updated:');
  console.log(`   - Rakibul (Admin): ${rakibul.email}`);
  console.log(`   - Toufik (Landlord): ${toufik.email}`);
  console.log(`   - Tanvir (Tenant): ${tanvir.email}`);

  // 3. Create Categories
  console.log('📦 Seeding Categories...');
  const categoriesData = [
    {
      name: 'Apartments',
      description: 'Modern urban apartments with rich amenities in prime locations.',
    },
    {
      name: 'Luxury Villas',
      description: 'Spacious high-end villas with private gardens, pools, and security.',
    },
    {
      name: 'Cozy Studios',
      description: 'Compact, stylish lofts and studios perfect for students and professionals.',
    },
    {
      name: 'Beachfront Houses',
      description: 'Scenic oceanfront residences with breathtaking views and direct beach access.',
    },
  ];

  const categories: Record<string, string> = {};
  for (const catData of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: catData.name },
      update: { description: catData.description },
      create: catData,
    });
    categories[catData.name] = category.id;
  }
  console.log(`✅ ${Object.keys(categories).length} Categories seeded.`);

  // 4. Seed 30 Properties
  console.log('🏡 Seeding 30 Properties...');
  
  const propertySeeds = [
    {
      title: 'Gulshan Horizon Deluxe Suite',
      description: 'Panoramic views of Gulshan lake with luxurious interior, 24/7 power backup, high-speed elevator, and smart security system.',
      price: 120000,
      address: 'Road 71, Avenue 5, Gulshan 2',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1212',
      lat: 23.7925,
      lng: 90.4167,
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      amenities: ['WiFi', 'Air Conditioning', 'Swimming Pool', 'Gym', 'Parking', '24/7 Security', 'Elevator'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Banani Skyline Modern Apartment',
      description: 'Elegantly furnished 3-bedroom apartment located in the heart of Banani residential area with easy access to restaurants and shops.',
      price: 85000,
      address: 'Block E, Road 11, Banani',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1213',
      lat: 23.7937,
      lng: 90.4066,
      bedrooms: 3,
      bathrooms: 2,
      area: 1850,
      amenities: ['WiFi', 'Air Conditioning', 'Generator Backup', 'Balcony', 'CCTV Security'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Dhanmondi Lakeview Duplex Villa',
      description: 'Exclusive 4-bedroom duplex overlooking Dhanmondi Lake with a private rooftop garden, garage, and servant quarters.',
      price: 150000,
      address: 'Road 15A, Dhanmondi R/A',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1209',
      lat: 23.7461,
      lng: 90.3742,
      bedrooms: 4,
      bathrooms: 4,
      area: 3100,
      amenities: ['Lake View', 'Rooftop Garden', 'Private Garage', 'Air Conditioning', 'WiFi', 'Servant Quarter'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Luxury Villas'],
    },
    {
      title: 'Uttara Green Park Studio',
      description: 'Cozy and quiet single studio apartment situated right next to Sector 11 park in Uttara. Ideal for solo stays or work-from-home.',
      price: 35000,
      address: 'Sector 11, Road 4, Uttara',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1230',
      lat: 23.8759,
      lng: 90.3795,
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      amenities: ['WiFi', 'Kitchenette', 'Air Conditioning', 'Elevator', 'Security'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Cozy Studios'],
    },
    {
      title: 'Mirpur DOHS Executive Flat',
      description: 'Peaceful security-gated 3-bedroom flat in Mirpur DOHS with play zone, walking track access, and dedicated parking.',
      price: 48000,
      address: 'Avenue 4, Mirpur DOHS',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1216',
      lat: 23.8364,
      lng: 90.3697,
      bedrooms: 3,
      bathrooms: 2,
      area: 1600,
      amenities: ['Parking', 'Gated Community', 'WiFi', 'Children Play Area', 'Elevator'],
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Bashundhara Royal Heights',
      description: 'Luxury multi-story villa unit in Bashundhara Block C featuring high-end marble flooring, central AC, and private terrace.',
      price: 95000,
      address: 'Block C, Road 6, Bashundhara R/A',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1229',
      lat: 23.8151,
      lng: 90.4255,
      bedrooms: 4,
      bathrooms: 3,
      area: 2400,
      amenities: ['Central AC', 'Terrace', 'Intercom', 'Substation Backup', 'Car Parking'],
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Luxury Villas'],
    },
    {
      title: 'Baridhara Diplomatic Residence',
      description: 'Ultra-exclusive residential villa in Baridhara Diplomatic Zone featuring bulletproof security glass, private elevator, and swimming pool.',
      price: 180000,
      address: 'Park Road, Baridhara R/A',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1212',
      lat: 23.7995,
      lng: 90.4208,
      bedrooms: 4,
      bathrooms: 5,
      area: 3400,
      amenities: ['Diplomatic Zone Security', 'Private Swimming Pool', 'Elevator', 'Central AC', 'Rooftop Lawn'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Luxury Villas'],
    },
    {
      title: 'Niketan Eco-Friendly Corner Flat',
      description: 'Charming 3-bedroom sunlit apartment in Niketan Housing with cross-ventilation, rooftop solar panels, and planted balconies.',
      price: 62000,
      address: 'Block B, Niketan, Gulshan 1',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1212',
      lat: 23.7781,
      lng: 90.4132,
      bedrooms: 3,
      bathrooms: 3,
      area: 1700,
      amenities: ['Solar Power', 'Balcony Garden', 'CCTV', 'Lift', 'Car Parking'],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Mohakhali DOHS Family Penthouse',
      description: 'Top floor penthouse with panoramic city skyview in Mohakhali DOHS. Features a private glass conservatory and Jacuzzi bath.',
      price: 115000,
      address: 'Road 2, Mohakhali DOHS',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1206',
      lat: 23.7794,
      lng: 90.3951,
      bedrooms: 4,
      bathrooms: 4,
      area: 2750,
      amenities: ['Penthouse Terrace', 'Jacuzzi', 'Skyline View', '24/7 Security', 'Elevator'],
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Luxury Villas'],
    },
    {
      title: 'Lalmatia Garden View Apartment',
      description: 'Quiet 3-bedroom family apartment in Lalmatia Block D close to top schools, universities, and shopping centers.',
      price: 52000,
      address: 'Block D, Lalmatia',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1207',
      lat: 23.7548,
      lng: 90.3705,
      bedrooms: 3,
      bathrooms: 2,
      area: 1650,
      amenities: ['Generator', 'WiFi', 'Gas Connection', 'Security Guard'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Panchlaish Sanctuary Villa',
      description: 'Top-tier residential villa in Chittagong Panchlaish with spacious lawn, master bedrooms with jacuzzi, and full security guard.',
      price: 110000,
      address: 'Road 3, Panchlaish Residential Area',
      city: 'Chittagong',
      state: 'Chittagong Division',
      zipCode: '4000',
      lat: 22.3667,
      lng: 91.8283,
      bedrooms: 4,
      bathrooms: 4,
      area: 2900,
      amenities: ['Lawn Garden', 'Jacuzzi', 'Security Guard', 'Garage', 'Generator'],
      images: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Luxury Villas'],
    },
    {
      title: 'GEC Oceanfront Executive Condo',
      description: 'Bright and airy apartment located near GEC Circle with quick access to Chittagong main commercial avenues and shopping hubs.',
      price: 70000,
      address: 'Nasirabad, near GEC Circle',
      city: 'Chittagong',
      state: 'Chittagong Division',
      zipCode: '4203',
      lat: 22.3587,
      lng: 91.8215,
      bedrooms: 3,
      bathrooms: 2,
      area: 1750,
      amenities: ['City View', 'Elevator', 'WiFi', 'Parking', 'CCTV'],
      images: [
        'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Agrabad Commercial Hub Apartment',
      description: 'Convenient 2-bedroom unit situated in Agrabad Commercial Area, ideal for corporate executives and short-term stay.',
      price: 55000,
      address: 'Access Road, Agrabad',
      city: 'Chittagong',
      state: 'Chittagong Division',
      zipCode: '4100',
      lat: 22.3308,
      lng: 91.8142,
      bedrooms: 2,
      bathrooms: 2,
      area: 1300,
      amenities: ['WiFi', 'AC', 'Commercial Location', 'Power Backup'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Khulshi Hilltop Luxury Residence',
      description: 'Breathtaking hilltop property in South Khulshi with panoramic green hill views, swimming pool, and private access road.',
      price: 130000,
      address: 'South Khulshi R/A, Road 4',
      city: 'Chittagong',
      state: 'Chittagong Division',
      zipCode: '4225',
      lat: 22.3611,
      lng: 91.8024,
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      amenities: ['Hill View', 'Private Swimming Pool', 'Security Guard', 'Generator Backup'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Luxury Villas'],
    },
    {
      title: 'Halishahar Breezy Family Flat',
      description: 'Spacious 3-bedroom sea-breeze flat in Halishahar Housing Estate with 2 balconies and assigned basement car park.',
      price: 42000,
      address: 'Block B, Halishahar Housing Estate',
      city: 'Chittagong',
      state: 'Chittagong Division',
      zipCode: '4216',
      lat: 22.3214,
      lng: 91.7852,
      bedrooms: 3,
      bathrooms: 2,
      area: 1550,
      amenities: ['Sea Breeze', 'Basement Parking', 'Generator', 'Balcony'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Shahjalal Garden Residence',
      description: 'Serene and modern apartment in Sylhet Shahjalal Upashahar surrounded by natural greenery and fresh air.',
      price: 60000,
      address: 'Block B, Shahjalal Upashahar',
      city: 'Sylhet',
      state: 'Sylhet Division',
      zipCode: '3100',
      lat: 24.8949,
      lng: 91.8687,
      bedrooms: 3,
      bathrooms: 3,
      area: 1900,
      amenities: ['Garden Access', 'Balcony', 'WiFi', 'Parking', 'Security'],
      images: [
        'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Zindabazar Studio Loft',
      description: 'Well-connected studio apartment right in Zindabazar central Sylhet. Compact design with all essential appliances.',
      price: 28000,
      address: 'Central Zindabazar',
      city: 'Sylhet',
      state: 'Sylhet Division',
      zipCode: '3100',
      lat: 24.8917,
      lng: 91.8714,
      bedrooms: 1,
      bathrooms: 1,
      area: 550,
      amenities: ['Central Location', 'WiFi', 'Air Conditioning', 'Security'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Cozy Studios'],
    },
    {
      title: 'Tea Estate Serenity Villa',
      description: 'Grand resort-style villa near Sylhet tea gardens with vast open green fields, private patio, and outdoor barbeque setup.',
      price: 135000,
      address: 'Sreemangal Highway Road',
      city: 'Sylhet',
      state: 'Sylhet Division',
      zipCode: '3210',
      lat: 24.3065,
      lng: 91.7296,
      bedrooms: 5,
      bathrooms: 5,
      area: 3500,
      amenities: ['Tea Garden View', 'Barbeque Pit', 'Patio', 'Full Kitchen', 'Maid Service'],
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Luxury Villas'],
    },
    {
      title: 'Upashahar Lakeview Flat',
      description: 'Scenic 3-bedroom flat facing Upashahar lake in Sylhet with dual balconies and high-speed fiber internet.',
      price: 45000,
      address: 'Main Avenue, Upashahar',
      city: 'Sylhet',
      state: 'Sylhet Division',
      zipCode: '3100',
      lat: 24.8972,
      lng: 91.8741,
      bedrooms: 3,
      bathrooms: 2,
      area: 1600,
      amenities: ['Lake View', 'Fiber Internet', 'Lift', 'Security Guard'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Cox’s Bazar Sunset Sea-View Haven',
      description: 'Stunning luxury home direct on Marine Drive Road with unobstructed views of the Bay of Bengal ocean horizon and direct beach path.',
      price: 140000,
      address: 'Marine Drive Road, Kalatali',
      city: 'Cox’s Bazar',
      state: 'Chittagong Division',
      zipCode: '4700',
      lat: 21.4272,
      lng: 91.9708,
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      amenities: ['Ocean View', 'Private Beach Access', 'Balcony Deck', 'Infinity Pool', 'WiFi'],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Beachfront Houses'],
    },
    {
      title: 'Inani Beach Luxury Cottage',
      description: 'Exclusive beach cottage in Inani with wooden aesthetics, sun terrace, sound system, and private ocean access.',
      price: 165000,
      address: 'Inani Sea Beach Area',
      city: 'Cox’s Bazar',
      state: 'Chittagong Division',
      zipCode: '4701',
      lat: 21.1856,
      lng: 92.0494,
      bedrooms: 4,
      bathrooms: 4,
      area: 2800,
      amenities: ['Sun Terrace', 'Beachfront', 'Private Security', 'Chef Available', 'WiFi'],
      images: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Beachfront Houses'],
    },
    {
      title: 'Kolatoli Breezy Studio Apartment',
      description: 'Budget-friendly sea-facing studio unit near Kolatoli point in Cox’s Bazar. Ideal for short vacation getaways.',
      price: 32000,
      address: 'Hotel Motel Zone, Kolatoli',
      city: 'Cox’s Bazar',
      state: 'Chittagong Division',
      zipCode: '4700',
      lat: 21.4312,
      lng: 91.9745,
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      amenities: ['Sea View Balcony', 'WiFi', 'Kitchenette', 'Elevator'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Cozy Studios'],
    },
    {
      title: 'Himchari Hillside Villa',
      description: 'Unique villa nestled between Himchari green hills and the ocean beach with open-air lounge decks and hammocks.',
      price: 125000,
      address: 'Himchari Beach Road',
      city: 'Cox’s Bazar',
      state: 'Chittagong Division',
      zipCode: '4702',
      lat: 21.3541,
      lng: 92.0028,
      bedrooms: 3,
      bathrooms: 3,
      area: 2300,
      amenities: ['Ocean & Hill View', 'Hammock Lounge', 'Private Path', 'Barbeque'],
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Beachfront Houses'],
    },
    {
      title: 'Sonadanga Executive Studio',
      description: 'Modern 1-bedroom studio in Sonadanga Residential Area Khulna. Fully tiled with AC and solar water heater.',
      price: 22000,
      address: 'Phase 2, Sonadanga R/A',
      city: 'Khulna',
      state: 'Khulna Division',
      zipCode: '9100',
      lat: 22.8157,
      lng: 89.5512,
      bedrooms: 1,
      bathrooms: 1,
      area: 500,
      amenities: ['AC', 'Solar Water Heater', 'WiFi', 'Security'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Cozy Studios'],
    },
    {
      title: 'Rupsha Riverview Apartment',
      description: 'Pleasant 3-bedroom home in Khulna facing Rupsha River with cool breezes, wide balcony, and 24-hour water supply.',
      price: 40000,
      address: 'Rupsha Strand Road',
      city: 'Khulna',
      state: 'Khulna Division',
      zipCode: '9200',
      lat: 22.8014,
      lng: 89.5684,
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      amenities: ['River View', 'Balcony', 'Parking', '24/7 Water'],
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Kazi Hata Modern Condo',
      description: 'Central Rajshahi 2-bedroom flat in Kazi Hata near Rajshahi College with clean interior finish and CCTV protection.',
      price: 35000,
      address: 'Main Road, Kazi Hata',
      city: 'Rajshahi',
      state: 'Rajshahi Division',
      zipCode: '6000',
      lat: 24.3745,
      lng: 88.6042,
      bedrooms: 2,
      bathrooms: 2,
      area: 1250,
      amenities: ['Central Location', 'CCTV', 'Lift', 'WiFi'],
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Padma Riverside Duplex Villa',
      description: 'Spacious duplex house right along Padma River embankment in Rajshahi. Features quiet gardens and sunset balcony.',
      price: 75000,
      address: 'Padma Garden Road',
      city: 'Rajshahi',
      state: 'Rajshahi Division',
      zipCode: '6100',
      lat: 24.3638,
      lng: 88.6281,
      bedrooms: 4,
      bathrooms: 3,
      area: 2600,
      amenities: ['Padma River View', 'Private Garden', 'Sunset Deck', 'Garage'],
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Luxury Villas'],
    },
    {
      title: 'Sadarchoad Central Apartment',
      description: 'Affordable 3-bedroom city apartment in Barisal Sadarchoad with fresh natural air, lift facility, and backup generator.',
      price: 26000,
      address: 'Sadarchoad, Barisal City',
      city: 'Barisal',
      state: 'Barisal Division',
      zipCode: '8200',
      lat: 22.7010,
      lng: 90.3535,
      bedrooms: 3,
      bathrooms: 2,
      area: 1400,
      amenities: ['Generator', 'Elevator', 'Security', 'Balcony'],
      images: [
        'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
    {
      title: 'Kuakata Beachfront Bungalow',
      description: 'Charming beachfront resort bungalow in Kuakata where you can watch both sunrise and sunset over the ocean horizon.',
      price: 110000,
      address: 'Zero Point, Kuakata Sea Beach',
      city: 'Barisal',
      state: 'Barisal Division',
      zipCode: '8650',
      lat: 21.8167,
      lng: 90.1167,
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      amenities: ['Sunrise & Sunset View', 'Beachfront', 'Private Courtyard', 'WiFi'],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: rakibul.id,
      categoryId: categories['Beachfront Houses'],
    },
    {
      title: 'Old Dhaka Heritage Residence',
      description: 'Tastefully renovated heritage apartment in Wari Old Dhaka with wooden arches, high ceilings, and high-speed internet.',
      price: 45000,
      address: 'Rankin Street, Wari',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1203',
      lat: 23.7189,
      lng: 90.4181,
      bedrooms: 3,
      bathrooms: 2,
      area: 1750,
      amenities: ['Heritage Architecture', 'High Ceilings', 'High Speed WiFi', 'Gas Line'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      landlordId: toufik.id,
      categoryId: categories['Apartments'],
    },
  ];

  const createdProperties = [];
  for (const prop of propertySeeds) {
    const existing = await prisma.property.findFirst({
      where: { title: prop.title },
    });
    if (existing) {
      const updated = await prisma.property.update({
        where: { id: existing.id },
        data: prop,
      });
      createdProperties.push(updated);
    } else {
      const created = await prisma.property.create({
        data: prop,
      });
      createdProperties.push(created);
    }
  }
  console.log(`✅ ${createdProperties.length} Properties seeded.`);

  // 5. Create Rental Requests
  console.log('📋 Seeding Rental Requests...');
  const rentalReqsData = [
    {
      propertyIndex: 0,
      status: RentalStatus.completed,
      message: 'Looking forward to staying in Gulshan for 3 months.',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-08-01'),
    },
    {
      propertyIndex: 2,
      status: RentalStatus.active,
      message: 'Req for family residence during long-term project.',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2027-01-01'),
    },
    {
      propertyIndex: 19,
      status: RentalStatus.approved,
      message: 'Vacation stay for 2 weeks in Coxs Bazar.',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-24'),
    },
    {
      propertyIndex: 1,
      status: RentalStatus.pending,
      message: 'Interested in leasing this Banani flat starting next month.',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2027-03-01'),
    },
    {
      propertyIndex: 15,
      status: RentalStatus.completed,
      message: 'Sylhet corporate stay request for 1 month.',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-07-01'),
    },
    {
      propertyIndex: 10,
      status: RentalStatus.rejected,
      message: 'Requesting for short wedding event stay.',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-05'),
    },
  ];

  const createdRequests = [];
  for (const req of rentalReqsData) {
    const prop = createdProperties[req.propertyIndex];
    if (!prop) continue;

    const existingReq = await prisma.rentalRequest.findFirst({
      where: {
        tenantId: tanvir.id,
        propertyId: prop.id,
      },
    });

    if (existingReq) {
      const updatedReq = await prisma.rentalRequest.update({
        where: { id: existingReq.id },
        data: {
          status: req.status,
          message: req.message,
          startDate: req.startDate,
          endDate: req.endDate,
        },
      });
      createdRequests.push(updatedReq);
    } else {
      const createdReq = await prisma.rentalRequest.create({
        data: {
          tenantId: tanvir.id,
          propertyId: prop.id,
          landlordId: prop.landlordId,
          status: req.status,
          message: req.message,
          startDate: req.startDate,
          endDate: req.endDate,
        },
      });
      createdRequests.push(createdReq);
    }
  }
  console.log(`✅ ${createdRequests.length} Rental Requests seeded.`);

  // 6. Create Payments
  console.log('💳 Seeding Payments...');
  const paymentsData = [
    {
      reqIndex: 0,
      amount: 120000,
      method: 'Credit Card',
      provider: PaymentProvider.stripe,
      transactionId: 'TXN_STRIPE_RN_9901',
      status: PaymentStatus.completed,
      paidAt: new Date('2026-04-28'),
    },
    {
      reqIndex: 1,
      amount: 150000,
      method: 'Credit Card',
      provider: PaymentProvider.stripe,
      transactionId: 'TXN_STRIPE_RN_9902',
      status: PaymentStatus.completed,
      paidAt: new Date('2026-06-29'),
    },
    {
      reqIndex: 2,
      amount: 140000,
      method: 'Credit Card',
      provider: PaymentProvider.stripe,
      transactionId: 'TXN_STRIPE_RN_9903',
      status: PaymentStatus.completed,
      paidAt: new Date('2026-07-25'),
    },
  ];

  const createdPayments = [];
  for (const pay of paymentsData) {
    const req = createdRequests[pay.reqIndex];
    if (!req) continue;

    const existingPay = await prisma.payment.findUnique({
      where: { transactionId: pay.transactionId },
    });

    if (existingPay) {
      const updatedPay = await prisma.payment.update({
        where: { transactionId: pay.transactionId },
        data: {
          amount: pay.amount,
          method: pay.method,
          provider: pay.provider,
          status: pay.status,
          paidAt: pay.paidAt,
        },
      });
      createdPayments.push(updatedPay);
    } else {
      const createdPay = await prisma.payment.create({
        data: {
          amount: pay.amount,
          method: pay.method,
          provider: pay.provider,
          transactionId: pay.transactionId,
          status: pay.status,
          paidAt: pay.paidAt,
          tenantId: tanvir.id,
          rentalRequestId: req.id,
        },
      });
      createdPayments.push(createdPay);
    }
  }
  console.log(`✅ ${createdPayments.length} Payments seeded.`);

  // 7. Create Reviews
  console.log('⭐ Seeding Reviews...');
  const reviewsData = [
    {
      reqIndex: 0,
      rating: 5,
      comment: 'Absolutely magnificent stay! The amenities were top-notch and Landlord Toufik was super cooperative and responsive.',
    },
    {
      reqIndex: 1,
      rating: 5,
      comment: 'Beautiful view over Dhanmondi lake. Very clean, private, and smooth check-in process!',
    },
    {
      reqIndex: 4,
      rating: 5,
      comment: 'Peaceful green surroundings in Sylhet Shahjalal Upashahar. Rakibul made sure everything was ready before arrival.',
    },
  ];

  const createdReviews = [];
  for (const rev of reviewsData) {
    const req = createdRequests[rev.reqIndex];
    if (!req) continue;

    const existingRev = await prisma.review.findUnique({
      where: {
        tenantId_propertyId: {
          tenantId: tanvir.id,
          propertyId: req.propertyId,
        },
      },
    });

    if (existingRev) {
      const updatedRev = await prisma.review.update({
        where: { id: existingRev.id },
        data: {
          rating: rev.rating,
          comment: rev.comment,
        },
      });
      createdReviews.push(updatedRev);
    } else {
      const createdRev = await prisma.review.create({
        data: {
          rating: rev.rating,
          comment: rev.comment,
          tenantId: tanvir.id,
          propertyId: req.propertyId,
          rentalRequestId: req.id,
        },
      });
      createdReviews.push(createdRev);
    }
  }
  console.log(`✅ ${createdReviews.length} Reviews seeded.`);

  const totalCount = 3 + Object.keys(categories).length + createdProperties.length + createdRequests.length + createdPayments.length + createdReviews.length;
  console.log('\n🎉 ALL 50+ DATA RECORDS HAVE BEEN SUCCESSFULLY SEEDED IN PRISMA DATABASE!');
  console.log(`Summary of Seeded Data:`);
  console.log(`- Users: ${3}`);
  console.log(`- Categories: ${Object.keys(categories).length}`);
  console.log(`- Properties: ${createdProperties.length}`);
  console.log(`- Rental Requests: ${createdRequests.length}`);
  console.log(`- Payments: ${createdPayments.length}`);
  console.log(`- Reviews: ${createdReviews.length}`);
  console.log(`Total Database Records: ${totalCount}`);
}

seed()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
