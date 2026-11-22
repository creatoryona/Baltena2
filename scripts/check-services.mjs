const services = [
  { name: "backend", url: "http://localhost:4000" },
  { name: "frontend", url: "http://localhost:3001" },
]

let failed = false

for (const service of services) {
  try {
    const response = await fetch(service.url)
    console.log(`${service.name}: ${response.status} ${response.ok ? "OK" : "NOT OK"} (${service.url})`)
    if (!response.ok) failed = true
  } catch (error) {
    console.error(`${service.name}: unavailable (${service.url})`)
    failed = true
  }
}

if (failed) process.exit(1)
