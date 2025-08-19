from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss

# ---- (copy your ESCO semantic roadmap logic here, but as a single function) ----
# Assume these files live in ../esco_data/

occupations_df = pd.read_csv('../esco_data/occupations_en.csv')
skills_df = pd.read_csv('../esco_data/skills_en.csv')
occ_skill_rel_df = pd.read_csv('../esco_data/occupationSkillRelations_en.csv')
for df in (occupations_df, skills_df, occ_skill_rel_df): df.columns = df.columns.str.strip()

occupations_df['text'] = occupations_df['preferredLabel'].fillna('') + '. ' + occupations_df['description'].fillna('')
model = SentenceTransformer('all-MiniLM-L6-v2')
occ_embeddings = model.encode(occupations_df['text'].tolist(), convert_to_numpy=True)
faiss.normalize_L2(occ_embeddings)
faiss_index = faiss.IndexFlatIP(occ_embeddings.shape[1])
faiss_index.add(occ_embeddings)
skills_dict = skills_df.set_index('conceptUri')[['preferredLabel', 'description', 'skillType']].to_dict('index')
def get_skills_for_occupation(occupation_uri):
    rel = occ_skill_rel_df[occ_skill_rel_df['occupationUri'] == occupation_uri]
    skills_list = []
    for uri in rel['skillUri']:
        skill_obj = skills_dict.get(uri)
        if skill_obj:
            skills_list.append(skill_obj)
    return skills_list

app = FastAPI()
origins = ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])

class QueryRequest(BaseModel):
    query: str

@app.post("/search_roles")
async def search_roles(req: QueryRequest):
    # Return top 5 relevant occupations for search
    q_emb = model.encode([req.query], normalize_embeddings=True)
    D, I = faiss_index.search(q_emb, 5)
    result = []
    for idx in I:
        row = occupations_df.iloc[idx]
        result.append({"id": row['conceptUri'], "title": row['preferredLabel'], "description": row['description']})
    return result

@app.post("/get_roadmap")
async def get_roadmap(req: QueryRequest):
    # Find occupation by conceptUri or fallback to top semantic search
    occ = occupations_df[occupations_df['conceptUri'] == req.query]
    if occ.empty:
        # fallback: use semantic
        q_emb = model.encode([req.query], normalize_embeddings=True)
        D, I = faiss_index.search(q_emb, 1)
        occ_row = occupations_df.iloc[I[0]]
    else:
        occ_row = occ.iloc
    skills_info = get_skills_for_occupation(occ_row['conceptUri'])
    # Group skills/knowledge
    roadmap = []
    for t in ['skill/competence', 'knowledge']:
        filtered = [s for s in skills_info if s['skillType'] == t]
        step = {
            "type": t,
            "items": [
                {"title": s['preferredLabel'], "description": s['description']}
                for s in filtered
            ]
        }
        roadmap.append(step)
    return {
        "occupation": occ_row['preferredLabel'],
        "description": occ_row['description'],
        "roadmap": roadmap
    }