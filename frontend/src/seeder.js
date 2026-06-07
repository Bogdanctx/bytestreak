import axios from 'axios';
import { faker } from '@faker-js/faker';

const API_BASE = 'http://localhost:8080';

// Token-ul hardcodat
const AUTH_COOKIE = 'bytestreak_jwt=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJib2JvdHJpZmFuMDlAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzgwMDk0MDQyLCJleHAiOjE3ODAxODA0NDJ9.e-ykUmgJ3_iYmQeEtkdZJzvUxdzAkUu_3PXG70KmeyFExaE3YmnyMQsixVZGVFdyEbL03CAG1os8kOL_cyoE6Q';

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
    for (let i = 0; i < 50; i++) { // Redus la 10 pentru test, ajustează la 100 cum aveai dacă e necesar
        const account = {
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: '123123',
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

async function seedProblems() {
    const difficulties = ["EASY", "MEDIUM", "HARD"];
    const possibleTags = ["Dynamic Programming", "Sliding Window", "Two pointers", "Graph", "Tree", "Array", "String", "Hash Table", "Math"];

    const axiosConfig = {
        headers: { 
            Cookie: AUTH_COOKIE
        },
        withCredentials: true 
    };

    console.log("🚀 Starting database seeding with hardcoded token...");

    for (let i = 0; i < 100; i++) {
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
        };

        try {
            const response = await axios.post(`${API_BASE}/creator/new-problem`, problemData, axiosConfig);
            console.log(`✅ Created problem ${i + 1}/100: [${problemData.difficulty}] ${problemData.title}`);

            await axios.put(`${API_BASE}/problems/${response.data.id}/toggle-problem-visibility`, {}, axiosConfig);

        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error(`❌ Failed to create problem ${i + 1}: ${errorMsg}`);
        }

        await delay(100);
    }
    
    console.log("🎉 Seeding complete!");
}

// Rulăm direct funcția
seedProblems();
seedAccounts();