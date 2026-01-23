export const translateDynamicContent = async (text, targetLang) => {
    try {
      const response = await fetch('http://localhost:5000/api/translate', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: targetLang }),
      });
      
      const data = await response.json();
      return data.translation;
    } catch (error) {
      console.error("Translation utility error:", error);
      throw error;
    }
};