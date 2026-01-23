import express from 'express';
import { TranslationServiceClient } from '@google-cloud/translate';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Helper for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to the key in your backend root folder
const KEY_FILE = path.join(__dirname, '../../gcp-key.json');

const translationClient = new TranslationServiceClient({ 
  keyFilename: KEY_FILE 
});

router.post('/', async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: "Missing text or targetLanguage" });
  }

  try {
    const [response] = await translationClient.translateText({
      parent: `projects/naijafreelance-i18n/locations/global`,
      contents: [text],
      mimeType: 'text/plain',
      targetLanguageCode: targetLanguage,
    });

    res.json({ translation: response.translations[0].translatedText });
  } catch (error) {
    console.error("GCP Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;