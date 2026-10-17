import os
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, Response
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "tracknext")
mongo_client: Optional[MongoClient] = None
opportunity_collection = None
mongo_connected = False

sample_opportunities: List[Dict[str, Any]] = [
    {
        "id": 1,
        "title": "Frontend Developer Internship",
        "category": "Internship",
        "organizer": "DVEIN Innovations",
        "date": "2026-10-10",
        "location": "Chennai",
        "price": "₹5,000/month",
        "format": "Offline",
        "description": "Work with a product engineering team building modern customer-facing interfaces, prototypes, and front-end components for real business use cases.",
        "eligibility": "Students in B.E./B.Tech, design & coding skills, portfolio or mini-project required.",
        "applicationLabel": "Sample application",
        "applicationUrl": "#sample-application",
        "illustration": "⌂",
        "highlight": "Featured",
    },
    {
        "id": 2,
        "title": "AI Product Hackathon",
        "category": "Hackathon",
        "organizer": "Build for Bharat",
        "date": "2026-10-14",
        "location": "Remote",
        "price": "₹25,000 prize pool",
        "format": "Online",
        "description": "Develop an AI or no-code solution for a civic or student-focused challenge and present your idea to mentors and industry judges.",
        "eligibility": "Any college student; team of 2-4 members preferred.",
        "applicationLabel": "Sample registration",
        "applicationUrl": "#sample-registration",
        "illustration": "✦",
        "highlight": "Trending",
    },
    {
        "id": 3,
        "title": "GenAI to Agentic AI Workshop",
        "category": "Workshop",
        "organizer": "Microsoft Office Chennai AI Community",
        "date": "2026-10-12",
        "location": "Online",
        "price": "Free",
        "format": "Online",
        "description": "Explore prompt engineering, AI agent design, and workflow automation through real demos and practical hands-on learning.",
        "eligibility": "Open to all students interested in AI and automation.",
        "applicationLabel": "Sample registration",
        "applicationUrl": "#sample-registration",
        "illustration": "✎",
        "highlight": "Popular",
    },
    {
        "id": 4,
        "title": "Build for Bharat Tech Event",
        "category": "Technical Event",
        "organizer": "TechConnect Hub",
        "date": "2026-10-20",
        "location": "Hyderabad",
        "price": "₹3,000 entry pass",
        "format": "Offline",
        "description": "A one-day technology showcase featuring expert talks, product demos, and networking with founders, engineers, and student innovators.",
        "eligibility": "Students and early-stage builders encouraged to participate.",
        "applicationLabel": "Sample application",
        "applicationUrl": "#sample-application",
        "illustration": "◈",
        "highlight": "Featured",
    },
    {
        "id": 5,
        "title": "Cyber Security Quiz & Debug",
        "category": "Competition",
        "organizer": "CipherSpark Labs",
        "date": "2026-10-18",
        "location": "Bengaluru",
        "price": "Free",
        "format": "Offline",
        "description": "Test your cybersecurity fundamentals, debugging ability, and problem-solving mindset in a competitive lab-based format.",
        "eligibility": "Open to computer science and cyber-focused students.",
        "applicationLabel": "Sample registration",
        "applicationUrl": "#sample-registration",
        "illustration": "◍",
        "highlight": "Challenge",
    },
    {
        "id": 6,
        "title": "Machine Learning Foundation Course",
        "category": "Course",
        "organizer": "SkillForge Academy",
        "date": "2026-10-28",
        "location": "Online",
        "price": "₹4,499",
        "format": "Online",
        "description": "A structured learning path covering Python, model training, evaluation, and practical ML use cases for career readiness.",
        "eligibility": "Students with basic programming experience preferred.",
        "applicationLabel": "Sample enrollment",
        "applicationUrl": "#sample-enrollment",
        "illustration": "◐",
        "highlight": "New",
    },
    {
        "id": 7,
        "title": "Software Engineer Campus Job",
        "category": "Job",
        "organizer": "NexaStack",
        "date": "2026-10-25",
        "location": "Bengaluru",
        "price": "₹18,000/month",
        "format": "Offline",
        "description": "Join an engineering team focused on web products, cloud services, and digital experience improvements for campus hires.",
        "eligibility": "Final-year students with strong DSA, JavaScript, and communication skills.",
        "applicationLabel": "Sample application",
        "applicationUrl": "#sample-application",
        "illustration": "◫",
        "highlight": "Role",
    },
    {
        "id": 8,
        "title": "Merit Scholarship for STEM Students",
        "category": "Scholarship",
        "organizer": "STEM Future Foundation",
        "date": "2026-10-30",
        "location": "Remote",
        "price": "₹50,000 grant",
        "format": "Online",
        "description": "A merit-based funding opportunity for students pursuing STEM fields with strong academic achievement and leadership potential.",
        "eligibility": "Students from recognized colleges with a strong academic profile.",
        "applicationLabel": "Sample form",
        "applicationUrl": "#sample-form",
        "illustration": "★",
        "highlight": "Award",
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    global mongo_client, opportunity_collection, mongo_connected

    if MONGODB_URI:
        try:
            mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
            mongo_client.admin.command("ping")
            opportunity_collection = mongo_client[MONGODB_DB_NAME]["opportunities"]
            opportunity_collection.create_index("id", unique=True)
            if opportunity_collection.count_documents({}) == 0:
                opportunity_collection.insert_many(sample_opportunities)
            mongo_connected = True
            print(f"MongoDB connected successfully to database: {MONGODB_DB_NAME}")
        except Exception as error:
            print(f"MongoDB connection failed; using sample data: {error}")
            if mongo_client:
                mongo_client.close()
            mongo_client = None
            opportunity_collection = None
            mongo_connected = False
    else:
        print("MONGODB_URI is not configured; using sample data.")

    yield

    if mongo_client:
        mongo_client.close()


app = FastAPI(title="TrackNext API", version="1.0.0", lifespan=lifespan)


def sanitize_record(record: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not record:
        return None
    record = dict(record)
    record.pop("_id", None)
    return record


def fetch_opportunities() -> List[Dict[str, Any]]:
    if opportunity_collection is not None and mongo_connected:
        try:
            docs = list(opportunity_collection.find({}).sort("id", 1))
            if docs:
                return [sanitize_record(doc) for doc in docs]
        except Exception:
            pass

    return sample_opportunities


@app.get("/")
def read_root() -> dict:
    return {
        "message": "TrackNext FastAPI backend is running",
        "api": "/api/opportunities",
        "rss": "/rss.xml",
    }


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "database": "mongodb" if mongo_connected else "sample-data",
        "mongo_connected": mongo_connected,
    }


@app.get("/api/opportunities")
def get_all_opportunities() -> dict:
    return {"opportunities": fetch_opportunities() or []}


@app.get("/api/opportunities/{opportunity_id}")
def get_opportunity(opportunity_id: int) -> dict:
    for item in fetch_opportunities():
        if item["id"] == opportunity_id:
            return {"opportunity": item}
    raise HTTPException(status_code=404, detail="Opportunity not found")


def xml_escape(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


@app.get("/rss.xml")
def get_rss() -> Response:
    items = fetch_opportunities()[:12]
    rss_items = "".join(
        f"""
        <item>
          <title>{xml_escape(str(item['title']))}</title>
          <link>http://localhost:3000/# {item['id']}</link>
          <guid>{item['id']}</guid>
          <pubDate>{item['date']}</pubDate>
          <description>{xml_escape(str(item['description']))}</description>
          <category>{xml_escape(str(item['category']))}</category>
        </item>
        """ for item in items
    )

    xml = f"""<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<rss version=\"2.0\">
  <channel>
    <title>TrackNext Opportunity Feed</title>
    <link>http://localhost:3000</link>
    <description>Latest internships, hackathons, workshops, jobs, and scholarships for students.</description>
    <language>en-us</language>
    {rss_items}
  </channel>
</rss>
"""
    return Response(content=xml, media_type="application/rss+xml")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False)
