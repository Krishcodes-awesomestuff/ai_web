def chatbot_response(user_input, products):
    keywords = user_input.lower().split()

    filtered = []

    for p in products:
        if any(k in p["category"] for k in keywords):
            filtered.append(p)

    filtered.sort(key=lambda x: (-x["rating"], x["price"]))

    if not filtered:
        return "No matching products found."

    return filtered[:5]