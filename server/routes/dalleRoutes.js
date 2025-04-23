import express from 'express';
import * as dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

const router = express.Router();

const hf = new HfInference(process.env.HF_TOKEN);

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E! Route - Now using Hugging Face!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const responseBlob = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
      parameters: {
        height: 1024,
        width: 1024,
      },
    });

    const buffer = Buffer.from(await responseBlob.arrayBuffer());
    const base64Image = buffer.toString('base64');

    res.status(200).json({ photo: base64Image });

  } catch (error) {
    console.error('Hugging Face API Error:', error);
    const message = error.message || 'Something went wrong while generating the image with Hugging Face.';
    res.status(500).send(message);
  }
});

export default router;