def smart_score(product, query):
    score = 0

    if product["category"] in query:
        score += 3

    # price optimization
    score += (100000 - product["price"]) / 100000

    # rating importance
    score += product["rating"] * 2

    return score


def recommend_products(query, products):
    ranked = []

    for p in products:
        s = smart_score(p, query.lower())
        ranked.append((s, p))

    ranked.sort(reverse=True)

    return [r[1] for r in ranked[:10]]