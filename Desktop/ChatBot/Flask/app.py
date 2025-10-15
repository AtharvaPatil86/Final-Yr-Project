from flask import Flask, request, jsonify
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from groq import Groq
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)

# ---- CONFIG ----
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
PINECONE_INDEX_NAME = "web-scrape-index"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# Load once (for performance)
model = SentenceTransformer(EMBEDDING_MODEL)
pc = Pinecone(api_key=PINECONE_API_KEY)
client = Groq(api_key=GROQ_API_KEY)

# ---- RETRIEVAL ----
def get_relevant_context(query, top_k=5):
    index = pc.Index(PINECONE_INDEX_NAME)
    query_vector = model.encode(query).tolist()

    results = index.query(vector=query_vector, top_k=top_k, include_metadata=True)
    if not results.get("matches"):
        return None

    context = "\n---\n".join(
        match.get("metadata", {}).get("text_chunk", "")
        for match in results["matches"]
    )
    return context

# ---- GENERATION ----
def generate_final_answer(query, context):
    system_prompt = (
        "You are an expert assistant. Answer only based on the given context.In case u find no relevant informtion, you can tell user to find on relevant website"
    )
    user_prompt = f"""
    **Context:**
    {context}

    **Question:**
    {query}
    """

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        model="llama-3.1-8b-instant",
        temperature=0.2,
    )
    return chat_completion.choices[0].message.content

# ---- API ROUTE ----
@app.route("/query", methods=["POST"])
def query_handler():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "Missing 'query' field"}), 400

    context = get_relevant_context(query)
    if not context:
        return jsonify({"answer": "No relevant context found."})

    answer = generate_final_answer(query, context)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(port=8000, debug=True)
