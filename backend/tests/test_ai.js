// tests/test_ai.js
// Verify that the OpenAI-compatible Gemini integration is working
import 'dotenv/config';
import { getGeminiModel } from '../src/config/gemini.js';

async function testAI() {
    console.log('🧪 Testing Gemini OpenAI-compatible integration...');

    const client = getGeminiModel();
    if (!client) {
        console.error('❌ Failed to initialize Gemini client. Check your GEMINI_API_KEY in .env');
        process.exit(1);
    }

    try {
        console.log('📡 Sending request to Gemini (gemini-2.0-flash)...');
        const response = await client.chat.completions.create({
            model: 'gemini-2.0-flash',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say "Connection Successful" in one word.' }
            ],
            max_tokens: 50
        });

        console.log('✅ Request successful!');
        console.log('🤖 Full Response:', JSON.stringify(response, null, 2));
        console.log('🤖 Response Content:', response.choices[0].message.content);
        console.log('🔢 Usage:', response.usage);
    } catch (err) {
        if (err.status === 429) {
            console.log('✅ Connection WORKS, but Quota is EXHAUSTED (429).');
            console.log('   This confirms the SDK and endpoint are correctly configured.');
        } else {
            console.error('❌ AI request failed:', err.message);
            console.error('   Status:', err.status);
            console.error('   Body:', JSON.stringify(err.error || err.response?.data, null, 2));
        }
    }
}

testAI();
