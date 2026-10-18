import time
import statistics
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_benchmark(iterations: int = 20):
    latencies = []
    print(f"\n--- Running Deterministic Latency Benchmark ({iterations} runs) ---")
    for i in range(iterations):
        start = time.perf_counter()
        resp = client.post("/api/chat", json={
            "message": "blue",
            "current_level": "L1",
            "current_lesson_id": "l1_colors_sky"
        })
        elapsed = (time.perf_counter() - start) * 1000  # ms
        assert resp.status_code == 200
        latencies.append(elapsed)

    avg_ms = statistics.mean(latencies)
    median_ms = statistics.median(latencies)
    p95_ms = statistics.quantiles(latencies, n=20)[18] if len(latencies) >= 20 else max(latencies)

    print(f"Results:")
    print(f"  Avg Latency:    {avg_ms:.2f} ms")
    print(f"  Median Latency: {median_ms:.2f} ms")
    print(f"  P95 Latency:    {p95_ms:.2f} ms")
    print(f"  Target (<2000ms): {'PASSED' if p95_ms < 2000 else 'FAILED'}")

if __name__ == "__main__":
    run_benchmark()
