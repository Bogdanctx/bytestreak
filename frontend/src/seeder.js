import axios from 'axios';
import { faker } from '@faker-js/faker';

const API_URL = 'http://localhost:8080/auth/register';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedAccounts() {
    for (let i = 0; i < 100; i++) {
        const account = {
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: '123123',
            profilePictureUrl: faker.image.avatar()
        };

        try {
            await axios.post(API_URL, account);
            console.log(`✅ Created user: ${account.username} (${account.email})`);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error(`❌ Failed to create ${account.username}: ${errorMsg}`);
        }

        await delay(500); // <-- THIS actually pauses
    }
}

seedAccounts();