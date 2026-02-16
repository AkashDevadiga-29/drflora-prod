from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import os
import dotenv

dotenv.load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# drflora/chatbot_logic.py
class ChatbotApiManager:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-5-mini", reasoning_effort="low", api_key=OPENAI_API_KEY)
        self.prompt = ChatPromptTemplate.from_messages([
    ("system", """You are Dr. Flora, an expert agronomist. 
    Your task is to assist users based on the vision system's analysis of their plants.
    Follow these guidelines strictly:
        - If the plant is HEALTHY: Congratulate the user and provide maintenance/fertilizer tips.
        - If a DISEASE is named: Provide a 3-step recovery plan: 1. Immediate Action, 2. Treatment, 3. Prevention.
        - Always mention the confidence level briefly if it is below 70% (e.g., 'The system is moderately sure...').
        - Keep responses concise (under 150 words) and user-friendly."""),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}"),
])
        self.chain = self.prompt | self.llm
        self.wrapped_chain = RunnableWithMessageHistory(
            self.chain,
            self.get_session_history,
            input_messages_key="input",
            history_messages_key="history",
        )

    def get_session_history(self, session_id: str):
        return MongoDBChatMessageHistory(
            connection_string="mongodb://localhost:27017/",
            session_id=session_id,
            database_name="drflora",
            collection_name="chathistory"
        )

    def call_chatbot(self, input_text: str, session_id: str, disease_name: str = None) -> str:
        """
        Processes the conversation.
        disease_name is passed here in case you want to use it for 
        specific metadata or logging, but the 'input_text' now 
        contains the formatted System Notification from the view.
        """
        config = {"configurable": {"session_id": session_id}}
        
        try:
            response = self.wrapped_chain.invoke(
                {"input": input_text}, 
                config=config
            )
            
            return response.content
            
        except Exception as e:
            return f"I'm sorry, I'm having trouble connecting to my knowledge base. Error: {str(e)}"