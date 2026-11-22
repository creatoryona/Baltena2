import { execSync, spawnSync } from "child_process"

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export async function ensurePortFree(port: number): Promise<void> {
  if (process.platform !== "win32") return

  try {
    const result = spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `(Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue).OwningProcess`,
      ],
      { encoding: "utf8" }
    )

    const output = (result.stdout || "").trim()
    if (!output) return

    const pids = output
      .split(/\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p && p !== "0" && p !== String(process.pid))

    if (pids.length === 0) return

    for (const pid of pids) {
      try {
        console.log(`[Auto-Free Port ${port}] Killing old process PID ${pid}...`)
        execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" })
      } catch {
        // already gone
      }
    }

    // Wait for the OS to fully release the port
    await sleep(600)
  } catch {
    // ignore any errors
  }
}

