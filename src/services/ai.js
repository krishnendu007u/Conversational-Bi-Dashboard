import { GoogleGenerativeAI } from '@google/generative-ai';
import alasql from 'alasql';

// --- ADD THIS NEW CODE HERE ---
const apiKeys = [
  import.meta.env.VITE_GEMINI_API_KEY_1,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3,
  import.meta.env.VITE_GEMINI_API_KEY_4
];

function getRandomKey() {
  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  return apiKeys[randomIndex];
}
// ------------------------------

const SYSTEM_PROMPT = `
You are an expert Data Analyst and Business Intelligence assistant.

Your job is to translate a user's natural language request into a valid SQL query and a corresponding dashboard configuration.

You are querying an in-memory database table called 'data'.

Here is the schema of the 'data' table:
{{SCHEMA_INFO}}

Here is a sample of the data to understand the format (e.g. date formats, categories):
{{DATA_SAMPLE}}

USER REQUEST:
"{{USER_PROMPT}}"

CRITICAL INSTRUCTIONS:
1. Generate valid SQL for the 'data' table. ONLY use standard SQL syntax compatible with AlaSQL.
2. Ensure you GROUP BY appropriate columns if you are using aggregations like SUM, AVG, COUNT.
3. Determine the best chart type to visualize this data from: 'line', 'bar', 'pie', 'area', 'scatter'.
   - Use 'line' or 'area' for time-series / trends.
   - Use 'bar' for categorical comparisons.
   - Use 'pie' for parts-of-a-whole (only if a few categories).
4. Specify the 'xAxisKey' (the column name for the x-axis).
5. Specify the 'yAxisKeys' (an array of column names for the line/bar height).
6. Provide a user-friendly 'title' for this chart.
7. Provide an array of 'kpis', calculating 1-3 high-level summary metrics relevant to the query based on the data sample (e.g. Total, Average).
8. Return ONLY a valid JSON object in the exact format below, with NO markdown formatting, NO code blocks (\`\`\`), and NO additional text. 

EXPECTED JSON FORMAT:
{
  "sql": "SELECT category, SUM(sales) as total_sales FROM data GROUP BY category",
  "chartType": "bar",
  "title": "Total Sales by Category",
  "xAxisKey": "category",
  "yAxisKeys": ["total_sales"],
  "kpis": [
    { "title": "Total Sales", "value": "$1,200,500" },
    { "title": "Top Category", "value": "Electronics" }
  ]
}
`;

export async function generateDashboardConfig(apiKey, schemaInfo, dataSample, userPrompt) {
  try {
    // 1. Grab a random key from your list at the top
    const activeKey = getRandomKey();

    // 2. Use that activeKey to initialize Gemini
    const genAI = new GoogleGenerativeAI(activeKey);

    // 3. Set the model (I changed 2.5 to 1.5 so it doesn't crash!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = SYSTEM_PROMPT
      .replace('{{SCHEMA_INFO}}', schemaInfo)
      .replace('{{DATA_SAMPLE}}', JSON.stringify(dataSample, null, 2))
      .replace('{{USER_PROMPT}}', userPrompt);

    const result = await model.generateContent(prompt);
    let textResult = result.response.text().trim();

    // Clean up potential markdown code block wrappers
    if (textResult.startsWith('\`\`\`json')) {
      textResult = textResult.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (textResult.startsWith('\`\`\`')) {
      textResult = textResult.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }

    const aiConfig = JSON.parse(textResult);

    // Execute the SQL to get the data
    const queryData = alasql(aiConfig.sql);

    // Return the full widget config
    return {
      title: aiConfig.title,
      type: aiConfig.chartType,
      data: queryData,
      xAxisKey: aiConfig.xAxisKey,
      yAxisKeys: aiConfig.yAxisKeys,
      kpis: aiConfig.kpis,
      originalSql: aiConfig.sql
    };
  } catch (error) {
    console.error("AI Generation or SQL execution failed:", error);
    throw error;
  }
}
