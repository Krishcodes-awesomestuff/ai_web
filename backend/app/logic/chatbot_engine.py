import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class ChatbotEngine:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "your_secret_key_here":
            self.client = None
            print("WARNING: OPENAI_API_KEY not set correctly.")
        else:
            self.client = OpenAI(api_key=api_key)
        
        self.model = "gpt-4o-mini"

    async def get_response(self, query: str, context_products: list):
        if not self.client:
            return {
                "reply": "I'm sorry, I'm currently in offline mode. Here are some products I found for you:",
                "products": context_products
            }

        product_context = "\n".join([
            f"- [ID: {p.id}] {p.name} ($ {p.price}): {p.description}" for p in context_products
        ])

        system_prompt = f"""
        You are a helpful AI Shopping Assistant for a premium e-commerce platform.
        Your goal is to help users find the best products based on their needs.
        Use the following products as context for your recommendations:
        {product_context}
        
        Be concise, friendly, and focus on why these products are a good fit.
        Return your response as structured JSON with two fields: 'reply' (string) and 'recommended_ids' (list of product IDs from the context).
        """

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                response_format={ "type": "json_object" }
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            
            # Map IDs back to product objects if needed, but for now just send names
            return {
                "reply": result.get("reply", "I found these for you:"),
                "products": [p for p in context_products if p.id in result.get("recommended_ids", [])]
            }
        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            return {
                "reply": "Something went wrong while talking to the AI. Here are the best matches for your query:",
                "products": context_products
            }

chatbot_engine = ChatbotEngine()
