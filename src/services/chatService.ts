interface ChatResponse {
  message: string;
}

export const sendMessage = async (prompt: string): Promise<ChatResponse> => {
  try {
    const response = await fetch('https://ohbauchatbot.onrender.com/chat', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
