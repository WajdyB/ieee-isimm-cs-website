/**
 * Seed script to migrate existing static excom data to MongoDB.
 * Run with: node scripts/seed-excom.mjs
 * Or: node --env-file=.env scripts/seed-excom.mjs (Node 20+)
 * Requires: MONGODB_URI in .env
 */

import { MongoClient } from "mongodb"
import { readFileSync, existsSync } from "fs"
import { resolve } from "path"

// Load .env manually if not already set
if (!process.env.MONGODB_URI && existsSync(resolve(process.cwd(), ".env"))) {
  const env = readFileSync(resolve(process.cwd(), ".env"), "utf8")
  env.split("\n").forEach((line) => {
    const [key, ...v] = line.split("=")
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "")
    }
  })
}

const members = [
  {
    name: "Yosr Hadj Ali",
    position: "Chairwoman",
    image: "/images/committee/yosr-hadj-ali.png",
    facebook: "https://www.facebook.com/yosr.hajali.39",
    email: "hadjaliyosr@ieee.org",
    linkedin: "https://www.linkedin.com/in/yosr-hadj-ali-22a18437b/",
    order: 0,
    mandate: "2025-2026",
  },
  {
    name: "Mariem Ben Nasr",
    position: "Vice Chair",
    image: "/images/committee/mariem-ben-nasr.png",
    facebook: "https://www.facebook.com/mariem.ben.nasr.937503",
    email: "mariembennsar090@gmail.com",
    linkedin: "https://www.linkedin.com/in/maryem-ben-nasr-3b33b6370/",
    order: 1,
    mandate: "2025-2026",
  },
  {
    name: "Yessine Choieche",
    position: "Secretary",
    image: "/images/committee/yessine-choieche.png",
    facebook: "https://www.facebook.com/yessine.chaoiache",
    email: "yessinechaoiache@gmail.com",
    linkedin: "https://www.linkedin.com/in/yessine-ch-543479377/",
    order: 2,
    mandate: "2025-2026",
  },
  {
    name: "Ahmed Brahem",
    position: "Treasurer",
    image: "/images/committee/ahmed-brahem.png",
    facebook: "https://www.facebook.com/ahm2d.brahem",
    email: "ahmedbrahem911@gmail.com",
    linkedin: "https://www.linkedin.com/in/ahmed-brahem-7b8258308/",
    order: 3,
    mandate: "2025-2026",
  },
  {
    name: "Yassine Mansour",
    position: "Webmaster",
    image: "/images/committee/yassine-mansour.png",
    facebook: "https://www.facebook.com/yassinemansour0",
    email: "yassinemansourr09@gmail.com",
    linkedin: "https://www.linkedin.com/in/yassine-mansour-008341210/",
    order: 4,
    mandate: "2025-2026",
  },
]

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("MONGODB_URI not found in .env")
    process.exit(1)
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db()
    const collection = db.collection("excom")

    const existing = await collection.countDocuments()
    if (existing > 0) {
      console.log(`Excom collection already has ${existing} members. Skipping seed.`)
      console.log("To re-seed, run: db.excom.deleteMany({}) in MongoDB first.")
      return
    }

    const now = new Date()
    const docs = members.map((m) => ({
      ...m,
      created_at: now,
      updated_at: now,
    }))

    await collection.insertMany(docs)
    console.log(`✓ Seeded ${docs.length} excom members.`)
  } finally {
    await client.close()
  }
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
