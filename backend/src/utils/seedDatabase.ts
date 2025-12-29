import prisma from '../config/database';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const organizer = await prisma.user.create({
      data: {
        email: 'organizer@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Organizer',
        phone: '+1234567890',
        role: 'ORGANIZER',
      },
    });

    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '+0987654321',
        role: 'USER',
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    });

    console.log('✅ Created users');

    // Create events
    const events = await Promise.all([
      prisma.event.create({
        data: {
          title: 'Tech Conference 2024',
          description: 'Join us for the biggest technology conference of the year!',
          category: 'Technology',
          location: 'San Francisco, CA',
          venue: 'Moscone Center',
          startDate: new Date('2024-06-15T09:00:00Z'),
          endDate: new Date('2024-06-17T18:00:00Z'),
          status: 'PUBLISHED',
          capacity: 500,
          price: 299.99,
          organizerId: organizer.id,
          tags: ['technology', 'conference', 'networking'],
        },
      }),
      prisma.event.create({
        data: {
          title: 'Summer Music Festival',
          description: 'Three days of amazing music!',
          category: 'Music',
          location: 'Austin, TX',
          venue: 'Zilker Park',
          startDate: new Date('2024-07-20T12:00:00Z'),
          endDate: new Date('2024-07-22T23:00:00Z'),
          status: 'PUBLISHED',
          capacity: 10000,
          price: 199.99,
          organizerId: organizer.id,
          tags: ['music', 'festival', 'outdoor'],
        },
      }),
    ]);

    console.log('✅ Created events');

    // Create sample ticket
    await prisma.ticket.create({
      data: {
        ticketNumber: 'TKT-SAMPLE-001',
        quantity: 2,
        totalPrice: 599.98,
        status: 'CONFIRMED',
        userId: user.id,
        eventId: events[0].id,
      },
    });

    console.log('✅ Created sample ticket');
    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📧 Test accounts:');
    console.log('   Organizer: organizer@example.com / password123');
    console.log('   User:      user@example.com / password123');
    console.log('   Admin:     admin@example.com / password123\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();