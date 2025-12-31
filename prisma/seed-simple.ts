import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database with sample products...')

    // Clean up existing data
    await prisma.productImage.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.brand.deleteMany()

    // 1. Create Categories
    const devBoards = await prisma.category.create({
        data: {
            name: 'Development Boards',
            slug: 'development-boards',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'
        }
    })

    const iot = await prisma.category.create({
        data: {
            name: 'IoT & Wireless',
            slug: 'iot-wireless',
            image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800'
        }
    })

    const sensors = await prisma.category.create({
        data: {
            name: 'Sensors',
            slug: 'sensors',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'
        }
    })

    // 2. Create Brands
    const arduino = await prisma.brand.create({
        data: { name: 'Arduino', slug: 'arduino' }
    })

    const espressif = await prisma.brand.create({
        data: { name: 'Espressif', slug: 'espressif' }
    })

    const rpi = await prisma.brand.create({
        data: { name: 'Raspberry Pi', slug: 'raspberry-pi' }
    })

    // 3. Create Products with Images
    await prisma.product.create({
        data: {
            name: 'Arduino Uno R3 Development Board',
            slug: 'arduino-uno-r3',
            description: 'The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, and more. Perfect for beginners!',
            price: 1250,
            comparePrice: 1650,
            stock: 50,
            categoryId: devBoards.id,
            brandId: arduino.id,
            isFeatured: true,
            specs: JSON.stringify({
                Microcontroller: 'ATmega328P',
                'Operating Voltage': '5V',
                'Input Voltage': '7-12V',
                'Digital I/O Pins': '14',
                'Analog Input Pins': '6',
                'Flash Memory': '32 KB'
            }),
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1555664424-778a69fdb6b8?w=800' },
                    { url: 'https://images.unsplash.com/photo-1608528577891-9f90ca2eb01a?w=800' }
                ]
            }
        }
    })

    await prisma.product.create({
        data: {
            name: 'ESP32 DevKit V1 WiFi + Bluetooth',
            slug: 'esp32-devkit-v1',
            description: 'Powerful WiFi and Bluetooth enabled microcontroller. Perfect for IoT projects with built-in wireless connectivity. Low power consumption and rich peripheral set.',
            price: 550,
            comparePrice: 850,
            stock: 120,
            categoryId: iot.id,
            brandId: espressif.id,
            isFeatured: true,
            specs: JSON.stringify({
                Processor: 'Dual-core Xtensa 32-bit',
                'Clock Speed': '240 MHz',
                WiFi: '802.11 b/g/n',
                Bluetooth: 'v4.2 BR/EDR and BLE',
                'Flash Memory': '4 MB',
                'GPIO Pins': '34'
            }),
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
                    { url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800' }
                ]
            }
        }
    })

    await prisma.product.create({
        data: {
            name: 'Raspberry Pi 4 Model B (4GB RAM)',
            slug: 'raspberry-pi-4-4gb',
            description: 'A complete desktop computer in a tiny package. Run Linux, browse the web, play 4K video, and create amazing projects. Ideal for learning programming and electronics.',
            price: 6500,
            comparePrice: 8200,
            stock: 25,
            categoryId: devBoards.id,
            brandId: rpi.id,
            isFeatured: true,
            specs: JSON.stringify({
                Processor: 'Quad-core Cortex-A72',
                'Clock Speed': '1.5 GHz',
                RAM: '4 GB LPDDR4',
                Connectivity: 'WiFi, Bluetooth 5.0, Gigabit Ethernet',
                'USB Ports': '2x USB 3.0, 2x USB 2.0',
                'Video Output': 'Dual 4K HDMI'
            }),
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800' },
                    { url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800' }
                ]
            }
        }
    })

    await prisma.product.create({
        data: {
            name: 'DHT22 Temperature & Humidity Sensor',
            slug: 'dht22-sensor',
            description: 'High-precision digital temperature and humidity sensor. Easy to use with any microcontroller. Includes calibrated digital signal output.',
            price: 320,
            stock: 200,
            categoryId: sensors.id,
            isFeatured: false,
            specs: JSON.stringify({
                'Temperature Range': '-40°C to 80°C',
                'Humidity Range': '0-100% RH',
                Accuracy: '±0.5°C, ±2% RH',
                'Power Supply': '3.3-5V DC',
                'Output': 'Digital signal via single-bus'
            }),
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800' }
                ]
            }
        }
    })

    console.log('✅ Database seeded successfully!')
    console.log('📦 Created 4 products across 3 categories')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Error seeding database:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
