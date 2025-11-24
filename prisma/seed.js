const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@waste.com' },
    update: {},
    create: {
      email: 'admin@waste.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@waste.com' },
    update: {},
    create: {
      email: 'user@waste.com',
      password: userPassword,
      name: 'Regular User',
      role: 'USER',
    },
  })

  console.log('✅ Users created:', { admin: admin.email, user: user.email })

  // Create sample bins
  const bins = [
    // Plastic bins
    { binId: 'BIN-P001', category: 'PLASTIC', location: 'Main Entrance', latitude: 40.7128, longitude: -74.0060, currentLevel: 45 },
    { binId: 'BIN-P002', category: 'PLASTIC', location: 'Cafeteria', latitude: 40.7138, longitude: -74.0070, currentLevel: 72 },
    { binId: 'BIN-P003', category: 'PLASTIC', location: 'Parking Lot A', latitude: 40.7118, longitude: -74.0050, currentLevel: 88 },
    
    // Paper bins
    { binId: 'BIN-PA001', category: 'PAPER', location: 'Office Building 1', latitude: 40.7148, longitude: -74.0080, currentLevel: 35 },
    { binId: 'BIN-PA002', category: 'PAPER', location: 'Library', latitude: 40.7158, longitude: -74.0090, currentLevel: 65 },
    { binId: 'BIN-PA003', category: 'PAPER', location: 'Print Room', latitude: 40.7108, longitude: -74.0040, currentLevel: 92 },
    
    // Metal bins
    { binId: 'BIN-M001', category: 'METAL', location: 'Workshop', latitude: 40.7168, longitude: -74.0100, currentLevel: 28 },
    { binId: 'BIN-M002', category: 'METAL', location: 'Recycling Center', latitude: 40.7098, longitude: -74.0030, currentLevel: 54 },
    
    // Organic bins
    { binId: 'BIN-O001', category: 'ORGANIC', location: 'Kitchen', latitude: 40.7178, longitude: -74.0110, currentLevel: 68 },
    { binId: 'BIN-O002', category: 'ORGANIC', location: 'Garden Area', latitude: 40.7088, longitude: -74.0020, currentLevel: 41 },
    { binId: 'BIN-O003', category: 'ORGANIC', location: 'Composting Site', latitude: 40.7188, longitude: -74.0120, currentLevel: 85 },
    
    // Glass bins
    { binId: 'BIN-G001', category: 'GLASS', location: 'Bar Area', latitude: 40.7078, longitude: -74.0010, currentLevel: 22 },
    { binId: 'BIN-G002', category: 'GLASS', location: 'Reception', latitude: 40.7198, longitude: -74.0130, currentLevel: 59 },
    
    // E-Waste bins
    { binId: 'BIN-E001', category: 'EWASTE', location: 'IT Department', latitude: 40.7068, longitude: -74.0000, currentLevel: 33 },
    { binId: 'BIN-E002', category: 'EWASTE', location: 'Electronics Store', latitude: 40.7208, longitude: -74.0140, currentLevel: 76 },
  ]

  for (const bin of bins) {
    const { currentLevel, ...binData } = bin
    const status = currentLevel <= 50 ? 'LOW' : currentLevel <= 80 ? 'MEDIUM' : 'HIGH'
    
    await prisma.bin.upsert({
      where: { binId: bin.binId },
      update: {},
      create: {
        ...binData,
        currentLevel,
        status,
        capacity: 100,
        lastEmptied: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    })
  }

  console.log(`✅ Created ${bins.length} bins`)

  // Get bin IDs
  const bin1 = await prisma.bin.findFirst({ where: { binId: 'BIN-P003' } })
  const bin2 = await prisma.bin.findFirst({ where: { binId: 'BIN-PA003' } })
  const bin3 = await prisma.bin.findFirst({ where: { binId: 'BIN-E002' } })

  // Create some sample requests
  const requests = [
    {
      type: 'COLLECTION',
      description: 'Bin is overflowing, urgent pickup needed',
      priority: 'HIGH',
      status: 'PENDING',
      userId: user.id,
      binId: bin1?.id,
    },
    {
      type: 'MAINTENANCE',
      description: 'Bin lid is broken, needs repair',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      userId: user.id,
      binId: bin2?.id,
    },
    {
      type: 'REPAIR',
      description: 'Chemical waste detected, handle with care',
      priority: 'HIGH',
      status: 'PENDING',
      userId: admin.id,
      binId: bin3?.id,
    },
  ]

  for (const request of requests) {
    await prisma.request.create({ data: request })
  }

  console.log(`✅ Created ${requests.length} requests`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
