import axios from 'axios';
import { faker } from '@faker-js/faker';

const API_BASE = 'http://localhost:8080';

const codeTemplates = {
    cpp: {
        starter_code: "// ======= STARTER CODE =======\nint solve(vector<int>& nums) {\n    return 0;\n}",
        driver_code: "// ======= DRIVER CODE =======\n#include <iostream>\n#include <vector>\nusing namespace std;\n{{CODE}}\nint main() {\n    return 0;\n}"
    },
    python: {
        starter_code: "# ======= STARTER CODE =======\ndef solve(nums):\n    return 0",
        driver_code: "# ======= DRIVER CODE =======\n{{CODE}}\nif __name__ == '__main__':\n    print('test')"
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedAccounts() {
    let firstAccount = null;
    for (let i = 0; i < 30; i++) { // Redus la 10 pentru test, ajustează la 100 cum aveai dacă e necesar
        const account = {
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: 'password123',
            profilePictureUrl: faker.image.avatar()
        };

        try {
            await axios.post(`${API_BASE}/auth/register`, account);
            console.log(`✅ Created user: ${account.username}`);
            if (!firstAccount) firstAccount = account;
        } catch (error) {
            console.error(`❌ Failed to create ${account.username}`);
        }
        await delay(100);
    }
    return firstAccount;
}

async function loginAndGetToken(account) {
    try {
        // Ajustează acest endpoint în funcție de implementarea ta de securitate
        const response = await axios.post(`${API_BASE}/auth/login`, {
            email: account.email,
            password: account.password
        });
        return response.data.token; 
    } catch (error) {
        console.error("❌ Failed to login for seeding problems.", error.message);
        return null;
    }
}

async function seedProblems(authToken) {
    if (!authToken) {
        console.error("❌ No auth token provided. Skipping problem seeding.");
        return;
    }

    const difficulties = ["EASY", "MEDIUM", "HARD"];
    const possibleTags = ["Dynamic Programming", "Sliding Window", "Two pointers", "Graph", "Tree", "Array", "String", "Hash Table", "Math"];

    const axiosConfig = {
        headers: { Authorization: `Bearer ${authToken}` }
    };

    for (let i = 0; i < 30; i++) {
        const problemData = {
            title: faker.hacker.phrase().replace(/^./, str => str.toUpperCase()),
            description: `# ${faker.lorem.words(3)}\n\n${faker.lorem.paragraph()}\n\n**Example:**\n\`\`\`\nInput: nums = [1,2,3]\nOutput: 6\n\`\`\``,
            difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
            codeTemplates: JSON.stringify(codeTemplates),
            tags: faker.helpers.arrayElements(possibleTags, { min: 1, max: 3 }),
            testCases: [
                { fileName: "test1", input: "1\n2\n3", output: "6" },
                { fileName: "test2", input: "4\n5", output: "9" }
            ]
            // validationScript: null (Lăsat gol intenționat pentru probleme standard)
        };

        try {
            await axios.post(`${API_BASE}/creator/new-problem`, problemData, axiosConfig);
            console.log(`✅ Created problem: [${problemData.difficulty}] ${problemData.title}`);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error(`❌ Failed to create problem: ${errorMsg}`);
        }

        await delay(100);
    }
}

async function runSeeder() {
    console.log("🚀 Starting database seeding...");
    const adminAccount = await seedAccounts();
    const token = await loginAndGetToken(adminAccount);
    await seedProblems(token);
    console.log("🎉 Seeding complete!");
}

runSeeder();