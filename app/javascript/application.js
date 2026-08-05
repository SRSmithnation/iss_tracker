import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener("DOMContentLoaded", () => {
  const refreshButton = document.getElementById("refresh-btn")
  const mapElement = document.getElementById("map")

  let map
  let marker

  if (mapElement) {
    map = L.map("map").setView([0, 0], 2)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map)

    marker = L.marker([0, 0]).addTo(map)
  }

  let previousData = null
  let latestData = null
  let animationStart = null
  const ANIMATION_DURATION = 5000

  function lerp(start, end, t) {
    return start + (end - start) * t
  }

  function animateFrame(timestamp) {
    if (!previousData || !latestData) return

    if (!animationStart) animationStart = timestamp
    const elapsed = timestamp - animationStart
    const t = Math.min(elapsed / ANIMATION_DURATION, 1)

    const currentLat = lerp(previousData.latitude, latestData.latitude, t)
    const currentLon = lerp(previousData.longitude, latestData.longitude, t)
    const currentAlt = lerp(previousData.altitude, latestData.altitude, t)
    const currentVel = lerp(previousData.velocity, latestData.velocity, t)

    document.getElementById("latitude").textContent = currentLat.toFixed(4) + " deg"
    document.getElementById("longitude").textContent = currentLon.toFixed(4) + " deg"
    document.getElementById("altitude").textContent = currentAlt.toFixed(2) + " km"
    document.getElementById("velocity").textContent = currentVel.toFixed(2) + " km/h"

    if (map && marker) {
      const currentPosition = [currentLat, currentLon]
      marker.setLatLng(currentPosition)
      map.panTo(currentPosition, { animate: false })
    }

    if (t < 1) {
      requestAnimationFrame(animateFrame)
    }
  }

  function updateIssData() {
    fetch("/?format=json")
      .then((response) => response.json())
      .then((data) => {
        previousData = latestData || data
        latestData = data
        animationStart = null

        const timestampEl = document.getElementById("timestamp")
        if (timestampEl) {
          const date = new Date(data.timestamp * 1000)
          timestampEl.textContent = date.toLocaleTimeString()
        }

        requestAnimationFrame(animateFrame)
      })
  }

  if (refreshButton) {
    refreshButton.addEventListener("click", updateIssData)
  }

  setInterval(updateIssData, ANIMATION_DURATION)
  updateIssData()
})