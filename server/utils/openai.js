const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateSummary = async (content, model = 'gpt-3.5-turbo') => {
  try {
    const prompt = `Please provide a concise and well-structured summary of the following text. Focus on the key points and main ideas. Keep the summary clear and easy to understand.

Text to summarize:
${content}

Please provide a summary that is approximately 20-30% of the original length.`;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates clear, concise summaries of text content. Focus on extracting the most important information and presenting it in an organized manner.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', error.status, error.message, error.code, error.type);
    } else {
      console.error('Non-API Error in generateSummary:', error);
    }
    throw new Error('Failed to generate summary. Please try again.');
  }
};

const generateTitle = async (content) => {
  try {
    const prompt = `Generate a concise and descriptive title (maximum 60 characters) for the following text:

${content}

Title:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates concise, descriptive titles for text content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 20,
      temperature: 0.3,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', error.status, error.message, error.code, error.type);
    } else {
      console.error('Non-API Error in generateTitle:', error);
    }
    throw new Error('Failed to generate title. Please try again.');
  }
};

const extractTags = async (content) => {
  try {
    const prompt = `Extract 3-5 relevant tags from the following text. Return only the tags separated by commas, no additional text:

${content}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts relevant tags from text content. Return only the tags separated by commas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 50,
      temperature: 0.3,
    });

    const tags = response.choices[0].message.content.trim().split(',').map(tag => tag.trim());
    return tags.filter(tag => tag.length > 0 && tag.length <= 20);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', error.status, error.message, error.code, error.type);
    } else {
      console.error('Non-API Error in extractTags:', error);
    }
    throw new Error('Failed to extract tags. Please try again.');
  }
};

module.exports = {
  generateSummary,
  generateTitle,
  extractTags
}; 