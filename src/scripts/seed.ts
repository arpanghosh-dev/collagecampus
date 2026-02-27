import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { Job, JobType } from '../models/job.model';
import { Shop } from '../models/shop.model';
import User, { UserRole } from '../models/user.model';
import { env } from '../config/env';

const seedData = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('Connected to MongoDB for seeding with Faker...');

        // 1. Find or create an Admin user
        let admin = await User.findOne({ role: UserRole.ADMIN });
        if (!admin) {
            console.log('No admin found, creating a seed admin...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = await User.create({
                name: 'Seed Admin',
                email: 'admin@collagecampus.com',
                password: hashedPassword,
                role: UserRole.ADMIN,
            });
        }

        const adminId = admin._id;

        // 2. Clear existing data
        console.log('Clearing existing Jobs and Shops...');
        await Job.deleteMany({});
        await Shop.deleteMany({});

        // 3. Seed Jobs (10 random jobs)
        console.log('Seeding 30 Jobs using Faker...');
        const jobs = Array.from({ length: 30 }).map(() => ({
            jobName: faker.person.jobTitle(),
            jobId: `JOB-${faker.string.alphanumeric(5).toUpperCase()}`,
            createdBy: adminId,
            jobProvider: faker.company.name(),
            type: faker.helpers.arrayElement(Object.values(JobType)),
            deadline: faker.date.future(),
            location: `${faker.location.city()}, ${faker.location.state()}`,
            experience: faker.number.int({ min: 0, max: 10 }),
            salary: {
                from: faker.number.int({ min: 20000, max: 50000 }),
                to: faker.number.int({ min: 60000, max: 150000 }),
            },
            jobDescription: faker.lorem.paragraphs(2),
            responsibilities: Array.from({ length: 4 }).map(() => faker.lorem.sentence()),
            contactDetails: {
                email: faker.internet.email(),
                phoneNo: faker.phone.number(),
            },
        }));
        await Job.insertMany(jobs);

        // 4. Seed Shops (5 random shops)
        console.log('Seeding 20 Shops using Faker...');

        const generateTiming = () => ({
            isOpen: faker.datatype.boolean(0.8), // 80% chance open
            opensAt: '09:00',
            closesAt: '21:00',
        });

        const shops = Array.from({ length: 20 }).map(() => {
            const shopId = `SHOP-${faker.string.alphanumeric(5).toUpperCase()}`;
            return {
                name: faker.company.name(),
                shopId: shopId,
                createdBy: adminId,
                type: faker.helpers.arrayElement(['Cafe', 'Bookstore', 'Stationery', 'Electronics', 'Clothing']),
                location: faker.location.streetAddress(),
                distance: `${faker.number.int({ min: 10, max: 500 })}m away`,
                photo: faker.image.urlLoremFlickr({ category: 'business' }),
                photos: [faker.image.urlLoremFlickr({ category: 'store' }), faker.image.urlLoremFlickr({ category: 'interior' })],
                poster: faker.image.urlLoremFlickr({ category: 'abstract' }),
                topItems: Array.from({ length: 3 }).map(() => faker.commerce.productName()),
                allItems: Array.from({ length: 8 }).map(() => faker.commerce.productName()),
                contactDetails: {
                    email: faker.internet.email(),
                    phoneNo: faker.phone.number(),
                },
                shopTiming: {
                    monday: generateTiming(),
                    tuesday: generateTiming(),
                    wednesday: generateTiming(),
                    thursday: generateTiming(),
                    friday: generateTiming(),
                    saturday: generateTiming(),
                    sunday: { isOpen: false, opensAt: null, closesAt: null },
                },
                offers: Array.from({ length: 2 }).map(() => ({
                    offerId: `OFFER-${faker.string.alphanumeric(4).toUpperCase()}`,
                    shopId: shopId,
                    offerName: faker.commerce.productAdjective() + " Deal",
                    startDate: faker.date.recent(),
                    endDate: faker.date.future(),
                    description: faker.commerce.productDescription(),
                    photo: faker.image.urlLoremFlickr({ category: 'promotion' }),
                })),
            };
        });
        await Shop.insertMany(shops);

        console.log('Faker Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seedData();
