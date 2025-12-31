import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:./dev.db"
        }
    }
} as any)

async function main() {
    console.log('Seeding database...')

    // Clean up
    await prisma.productImage.deleteMany()
    await prisma.review.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.brand.deleteMany()

    // 1. Categories
    const catDevBoards = await prisma.category.create({
        data: { name: 'Development Boards', slug: 'development-boards', image: '/images/cats/dev.jpg' }
    })
    const catIoT = await prisma.category.create({
        data: { name: 'IoT & Wireless', slug: 'iot-wireless', image: '/images/cats/iot.jpg' }
    })
    const catSensors = await prisma.category.create({
        data: { name: 'Sensors', slug: 'sensors', image: '/images/cats/sensors.jpg' }
    })
    const catRobotics = await prisma.category.create({
        data: { name: 'Robotics', slug: 'robotics', image: '/images/cats/robotics.jpg' }
    })

    // 2. Brands
    const arduino = await prisma.brand.create({ data: { name: 'Arduino', slug: 'arduino' } })
    const espressif = await prisma.brand.create({ data: { name: 'Espressif', slug: 'espressif' } })
    const rpi = await prisma.brand.create({ data: { name: 'Raspberry Pi', slug: 'raspberry-pi' } })

    // 3. Products

    // Arduino Uno
    await prisma.product.create({
        data: {
            name: 'Arduino Uno R3 DIP Version (Original)',
            slug: 'arduino-uno-r3',
            description: 'The standard Arduino board. Easy to use, powerful, and robust.',
            price: 1250,
            comparePrice: 1650,
            stock: 50,
            categoryId: catDevBoards.id,
            brandId: arduino.id,
            isFeatured: true,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1555664424-778a69fdb6b8?q=80&w=1000' }
                ]
            },
            specs: JSON.stringify({ Microcontroller: 'ATmega328P', Voltage: '5V' })
        }
    })

    // ESP32
    await prisma.product.create({
        data: {
            name: 'ESP32-WROOM-32 Dev Kit V1',
            slug: 'esp32-wroom-32',
            description: 'Powerful WiFi + Bluetooth MCU module.',
            price: 550,
            comparePrice: 850,
            stock: 120,
            categoryId: catIoT.id,
            brandId: espressif.id,
            isFeatured: true,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000' }
                ]
            }
        }
    })

    // Raspberry Pi 4
    await prisma.product.create({
        data: {
            name: 'Raspberry Pi 4 Model B (4GB)',
            slug: 'raspberry-pi-4-4gb',
            description: 'Desktop computer power in a credit card size.',
            price: 6500,
            comparePrice: 8200,
            stock: 25,
            categoryId: catDevBoards.id,
            brandId: rpi.id,
            isFeatured: true,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1000' }
                ]
            }
        }
    })

    // Servo
    await prisma.product.create({
        data: {
            name: 'SG90 Micro Servo Motor',
            slug: 'sg90-servo',
            description: 'Tiny and lightweight with high output power.',
            price: 120,
            stock: 500,
            categoryId: catRobotics.id,
            isFeatured: false,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000' }
                ]
            }
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
