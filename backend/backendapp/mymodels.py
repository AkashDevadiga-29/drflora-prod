import keras
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' 
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import tensorflow as tf
from django.conf import settings

# 1. Standard Preprocessing
def preprocess_input(x):
    return keras.applications.resnet_v2.preprocess_input(x)

def load_fix():
    # 2. Build the "Skeleton" exactly like your Colab architecture
    base_model = keras.applications.ResNet152V2(
        weights=None, 
        include_top=False, 
        input_shape=(224, 224, 3)
    )
    
    # Use Functional API to be explicit and avoid the 2-tensor bug
    inputs = keras.Input(shape=(224, 224, 3))
    x = keras.layers.Lambda(preprocess_input)(inputs)
    x = base_model(x)
    x = keras.layers.GlobalAveragePooling2D()(x)
    x = keras.layers.Dense(256, activation='relu')(x)
    outputs = keras.layers.Dense(38, activation='softmax')(x)
    
    model = keras.Model(inputs, outputs)

    # 3. Load ONLY the weights from your saved file
    # This bypasses the buggy "Functional Map" that causes the 2-tensor error
    MODEL_PATH = os.path.join(settings.BASE_DIR, 'models', 'plantmodel.keras')
    
    try:
        print("Performing surgical weight load...")
        model.load_weights(MODEL_PATH)
        print("Model loaded successfully!")
        return model
    except Exception as e:
        print(f"Surgical load failed: {e}")
        return None

plantmodel = load_fix()

CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy', 
    'Blueberry___healthy', 'Cherry___healthy', 'Cherry___Powdery_mildew', 
    'Corn___Cercospora_leaf_spot Gray_leaf_spot', 'Corn___Common_rust', 'Corn___healthy', 
    'Corn___Northern_Leaf_Blight', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 
    'Grape___healthy', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy', 
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 
    'Potato___healthy', 'Potato___Late_blight', 'Raspberry___healthy', 'Soybean___healthy', 
    'Squash___Powdery_mildew', 'Strawberry___healthy', 'Strawberry___Leaf_scorch', 
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___healthy', 
    'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 
    'Tomato___Tomato_mosaic_virus', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus'
]