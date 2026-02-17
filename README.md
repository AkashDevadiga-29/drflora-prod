# Dr.Flora 🌿

**An AI-powered chatbot assistant for identifying plant diseases and providing care advice.**

## 📖 Overview

Dr.Flora is a full-stack application designed to help gardeners and farmers diagnose plant health issues. Users upload an image of a sick plant leaf to the chat interface. The system processes the image using a deep learning model to identify the disease. It then leverages a Large Language Model (LLM) to provide detailed, actionable advice on how to treat the specific condition detected.

## ✨ Key Features

* **Image-Based Diagnosis:** Upload photos of plant leaves for instant analysis.
* **Deep Learning Classification:** Accurately identifies plant diseases using transfer learning with state-of-the-art convolutional neural networks.
* **AI-Powered Advice:** Generates context-aware treatment plans and answers follow-up questions using OpenAI.
* **Contextual Guardrails & General Q&A:** Uses LangChain to ensure the chatbot remains focused on botanical and agricultural topics. While it filters out unrelated subjects (e.g., sports, politics), it **is capable of answering general relevant inquiries** about plant care, fertilizers, and seasons, even if they are not strictly about the uploaded image.

## ⚠️ Limitations & Known Issues

* **Stateless Image Processing:** The application currently does not maintain the state of the uploaded image across the conversation. Once the initial diagnosis is delivered, the vision context is lost. If you ask a visual follow-up question (e.g., "Look at the corner of the leaf again"), the bot will not be able to "see" the image a second time without a re-upload. It relies purely on the text history stored in the database for follow-up conversation.

## 🛠️ Tech Stack

Dr.Flora combines several advanced technologies to create a seamless experience:

### Machine Learning (Image Analysis)
* **Language:** Python
* **Frameworks:** TensorFlow & Keras
* **Model Architecture:** ResNet152V2 (Pre-trained on ImageNet and fine-tuned for plant diseases).
* **Image Processing:** OpenCV (cv2) for resizing, normalization, and preprocessing user uploads.

### LLM & Chat Pipeline
* **LLM Provider:** OpenAI API (e.g., gpt-3.5-turbo or gpt-4).
* **Orchestration:** LangChain. Used to dynamically generate prompts based on the vision model's output and to enforce context filtering.

### Full-Stack Web Application
* **Frontend:** React.js for a dynamic user interface, styled with Bootstrap for responsiveness.
* **Backend:** Django (Python) serving as the API server, handling image uploads and connecting the frontend to the ML pipeline.
* **Database:** MongoDB (NoSQL) used to store chat histories, user sessions, and disease metadata.

## 🔄 How It Works (Workflow)

1.  **Frontend:** User takes a photo of a leaf and uploads it via the React chat interface.
2.  **Backend Processing:** The Django backend receives the image.
3.  **Pre-processing:** OpenCV prepares the image for the model (resizing, color conversion).
4.  **Prediction:** The TensorFlow/Keras model (ResNet152V2) analyzes the image and outputs a predicted disease label (e.g., "Tomato_Early_Blight").
5.  **Prompt Engineering:** Django passes this label to LangChain. LangChain constructs a specific prompt.
6.  **LLM Response:** This prompt is sent to the OpenAI API to generate a cure/advice summary.
7.  **Delivery:** The AI's advice is saved to MongoDB and displayed back to the user in the chat window.

## ⚙️ Prerequisites for Running Locally

To run this project completely, you need the following set up in your environment:

* Python 3.9+
* Node.js and npm
* MongoDB instance running locally or in the cloud.
* Valid OpenAI API Key.
